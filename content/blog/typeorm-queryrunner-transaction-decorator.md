---
title: "TypeORM QueryRunner를 커스텀 데코레이터로 트랜잭션 공통화하기"
description: "서비스마다 반복되던 startTransaction / try-catch-finally 를 Interceptor + 파라미터 데코레이터 + BaseRepository 조합으로 걷어낸 방법. typeorm-transactional을 안 쓴 이유까지."
date: "2026-08-04"
tags: ["NestJS", "TypeORM", "Transaction", "Decorator", "Interceptor"]
published: true
---

> 서비스마다 트랜잭션 뼈대 계속 다시 짜기 싫어서 공통화한 얘기.

## 목차

1. [왜 만들었나](#1-왜-만들었나)
2. [typeorm-transactional 두고 왜](#2-typeorm-transactional-두고-왜)
3. [세 조각으로 자른 이유](#3-세-조각으로-자른-이유)
4. [TransactionInterceptor](#4-transactioninterceptor)
5. [@QueryRunner() 데코레이터](#5-queryrunner-데코레이터)
6. [BaseRepository](#6-baserepository)
7. [PG 에러코드 처리](#7-pg-에러코드-처리)
8. [실제 흐름](#8-실제-흐름)
9. [한계](#9-한계)

---

## 1. 왜 만들었나

일단 트랜잭션은 쓰기가 여러 개일 때 씀. SELECT 한 번, UPDATE 한 번짜리엔 필요 없음. DB가 알아서 auto-commit으로 처리해줌.

트랜잭션이 필요한 건 이런 경우. 관리자 비밀번호 바꾸면서 감사 로그 남기고, 기존 세션도 지워야 함.

```typescript
async resetAdminPassword(adminId: number, current: string, next: string) {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const account = await queryRunner.manager
      .getRepository(Account)
      .findOneBy({ id: adminId });

    if (!await verify(account.password, current)) {
      throw new UnauthorizedException();
    }

    account.password = await hash(next);
    await queryRunner.manager.save(account);                    // ① 비밀번호 갱신

    await queryRunner.manager.insert(AuditLog, {                // ② 감사 로그
      actorId: adminId,
      action: 'PASSWORD_RESET',
      at: new Date(),
    });

    await queryRunner.manager.delete(Session, { accountId: adminId }); // ③ 세션 삭제

    await queryRunner.commitTransaction();
    return { success: true, message: '변경 완료' };
  } catch (e) {
    await queryRunner.rollbackTransaction();
    throw e;
  } finally {
    await queryRunner.release();
  }
}
```

비번은 바뀌었는데 세션이 안 지워지면? 이전 비번으로 로그인한 세션이 그대로 살아있음. 감사 로그 빠지면 나중에 추적도 안 되고. 그래서 세 개를 묶어야 함.

근데 이걸 서비스마다 다시 짜야 한다는 게 문제. 로직 5줄 쓰려고 뼈대 15줄 붙임. 그리고 `release()` 한 번 빼먹으면 커넥션 반환이 안 되는데, 이게 당장은 티가 안 남. 서비스 뜨고 한참 지나서 커넥션 풀 다 차서 응답 밀리기 시작하는데, 이 시점부터 원인 잡으려면 꽤 고생함.

무엇보다 트랜잭션 열고 닫는 건 서비스가 할 일이 아님. 요청 시작할 때 열고 끝날 때 닫는 거니까 요청 경계에서 해야 함.

---

## 2. typeorm-transactional 두고 왜

보통은 `typeorm-transactional` 의 `@Transactional()` 씀. 서비스 메서드에 붙이면 알아서 감싸주고, 내부는 `AsyncLocalStorage` 로 컨텍스트 흘려보내는 방식.

편하긴 함. 근데 리포지토리 메서드만 딱 보면 지금 트랜잭션 안인지 밖인지 안 보임. 확인하려면 호출자 거슬러 올라가서 `@Transactional()` 어디 걸렸는지 찾아야 함. 별거 아닌 것 같아도 디버깅할 때 은근 발목 잡힘.

시그니처에 `queryRunner?: QueryRunner` 있으면 한 눈에 보임. 넘어왔으면 안, 안 넘어왔으면 밖. 인자 하나 늘어나는 대신 이걸 얻는 쪽이 지금 규모엔 맞다고 봄.

---

## 3. 세 조각으로 자른 이유

책임을 셋으로 나눔.

```
[요청 진입]
    ↓
① TransactionInterceptor    ─── 요청 시작할 때 QueryRunner 열고, 끝날 때 커밋/롤백
    ↓
[Controller 핸들러]
    ↓
② @QueryRunner() 데코레이터  ─── request에 심어둔 걸 타입 안전하게 꺼내는 통로
    ↓
[Service]
    ↓
③ BaseRepository             ─── QueryRunner 있으면 그거 쓰고, 없으면 기본 repo
    ↓
[DB]
```

셋이 서로 최소한만 알게 하려고 했음. Interceptor는 라이프사이클만 앎. 데코레이터는 request에서 값 꺼내는 얇은 통로. BaseRepository는 QueryRunner 있냐 없냐만 봄.

이렇게 잘라두면 나중에 마이크로서비스 컨텍스트 지원이 필요해져도 Interceptor만 갈아끼우면 되고, 배치 스크립트에선 그냥 QueryRunner 없이 리포지토리 쓰면 됨.

---

## 4. TransactionInterceptor

핵심 코드부터.

```typescript
@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Promise<Observable<unknown>> {
    const req = context.switchToHttp().getRequest<RequestWithQueryRunner>();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    req.queryRunner = queryRunner;  // ← 뒤에 나올 데코레이터랑 연결되는 지점

    return next.handle().pipe(
      catchError(async (e: unknown) => {
        await this.rollbackTransaction(queryRunner);
        // ... 에러 매핑은 7장에서 ...
        throw e;
      }),
      tap(async () => {
        await this.commitTransaction(queryRunner);
      }),
    );
  }
}
```

### request 객체에 담은 이유

컨텍스트 전달을 라이브러리 없이 풀어야 하는데, NestJS(Express)는 요청 하나당 request 객체 하나가 보장됨. 여기에 `queryRunner` 얹으면 같은 요청 안의 모든 코드가 같은 인스턴스 봄.

즉 AsyncLocalStorage 자리를 request 객체가 대신함. Express가 이미 해주는 걸 재활용하는 거라 별도 초기화도 없고, 컨텍스트가 어디 있는지도 뻔함. 그냥 request 안에.

### commit / rollback / release 각자 감싼 이유

디테일 하나. 세 동작을 각자 try-catch로 감쌈.

```typescript
private async rollbackTransaction(qr: QueryRunner) {
  try {
    await qr.rollbackTransaction();
  } catch {
    // 롤백 실패는 무시. 이미 에러 상황이라.
  } finally {
    await this.releaseQueryRunner(qr);
  }
}

private async commitTransaction(qr: QueryRunner) {
  try {
    await qr.commitTransaction();
  } catch {
    await qr.rollbackTransaction();  // 커밋 실패했으면 롤백이라도 시도
  } finally {
    await this.releaseQueryRunner(qr);
  }
}

private async releaseQueryRunner(qr: QueryRunner) {
  try {
    await qr.release();
  } catch {
    // release 실패도 무시. 여기서 던져봐야 원본 에러만 가려짐.
  }
}
```

두 개가 중요함.

하나. release는 무조건 돌아야 함. 안 하면 커넥션 풀이 조금씩 새고, 나중에 원인 못 찾고 헤맴. 그래서 finally에 넣음.

둘. rollback이나 release가 실패했다고 새 예외 던지면 원래 에러가 가려짐. 유니크 위반으로 catchError에 들어왔는데 롤백에서 또 뭐가 터졌다고 그걸 던지면? 프론트는 엉뚱한 에러만 봄. 진짜 원인은 유니크 위반이었는데.

이걸 서비스마다 실수 없이 짜는 거 진짜 어려움. 한 번 짜서 재사용하는 것만으로도 뽕뽑음.

---

## 5. @QueryRunner() 데코레이터

Interceptor가 `req.queryRunner` 에 심어둔 걸 컨트롤러에서 꺼내야 함. 매번 `@Req() req` 받아서 `req.queryRunner` 꺼내기 싫었음. 의도도 안 드러나고 타입도 흐릿하고. 그래서 파라미터 데코레이터.

```typescript
export const QueryRunner = createParamDecorator(
  (_data: unknown, context: ExecutionContext): TypeOrmQueryRunner => {
    const req = context.switchToHttp().getRequest<{
      queryRunner?: TypeOrmQueryRunner;
    }>();

    if (!req.queryRunner) {
      throw new InternalServerErrorException('QueryRunner가 없습니다.');
    }

    return req.queryRunner;
  },
);
```

여기서 신경 쓴 건 하나. 없으면 조용히 undefined 넘기지 말고 그 자리에서 터트림. `@UseInterceptors(TransactionInterceptor)` 컨트롤러에 안 붙이는 실수 언젠가 무조건 남. 근데 undefined가 서비스 안까지 흘러가면 엉뚱한 데서 터지고, 그러면 원인 찾는 데 시간 다 씀.

여기서 명확한 예외로 죽이면 로그 한 줄로 끝. Interceptor 안 붙였네, 붙이면 됨.

---

## 6. BaseRepository

트랜잭션 걸린 요청에선 모든 쿼리가 같은 `QueryRunner.manager` 위에서 돌아야 그 트랜잭션에 들어감. 다른 매니저로 쿼리 날리면 auto-commit이라 롤백에서 빠짐.

이걸 리포지토리 계층에서 잡아주려고 함.

```typescript
@Injectable()
export abstract class BaseRepository<T extends ObjectLiteral> {
  protected repository: Repository<T>;
  private readonly entityClass: EntityTarget<T>;

  protected constructor(
    repository: Repository<T>,
    entityClass: EntityTarget<T>,
  ) {
    this.repository = repository;
    this.entityClass = entityClass;
  }

  protected getRepository(queryRunner?: QueryRunner): Repository<T> {
    return queryRunner
      ? queryRunner.manager.getRepository(this.entityClass)
      : this.repository;
  }
}
```

`queryRunner` 를 옵션으로 뒀음.

넘어오면 트랜잭션 매니저 쪽 repo, 안 넘어오면 기본 repo. 덕분에 같은 메서드를 트랜잭션 안팎에서 다 씀. 배치 스크립트에서 대량 처리할 땐 건별로 auto-commit 돌리고 싶으니까 그럴 땐 인자 없이 부르면 됨.

```typescript
async updatePasswordWithAccount(
  account: Account,
  password: string,
  queryRunner?: QueryRunner,
) {
  account.password = password;
  return await this.getRepository(queryRunner).save(account);
}
```

이 시그니처가 그대로 문서 역할. "이 메서드는 트랜잭션에 참여할 수도, 안 할 수도 있다." 주석 없어도 호출부에서 판단됨.

---

## 7. PG 에러코드 처리

Interceptor의 catchError에서 하나 더 함. PostgreSQL 저수준 에러코드를 HTTP 예외로 바꿔주는 것.

```typescript
catchError(async (e: unknown) => {
  await this.rollbackTransaction(queryRunner);

  if (e instanceof QueryFailedError) {
    const errorCode = (e.driverError as { code?: string })?.code;

    if (errorCode === '23503') {
      throw new BadRequestException('참조 무결성 제약조건 위반이 발생했습니다.');
    }
    if (errorCode === '23505') {
      throw new ConflictException('이미 존재하는 데이터입니다.');
    }
  }

  throw e;
});
```

`23503` 은 외래키 위반, `23505` 는 유니크 위반. 트랜잭션 실패 중에 이 두 개가 압도적으로 많이 나옴. 서비스마다 try-catch로 잡아서 도메인 예외로 바꾸는 방법도 있는데, 그러면 또 뼈대가 서비스에 쌓임. 요청 경계에서 한 번에 끝내면 서비스는 자기 일만 하면 됨.

물론 도메인 규칙상 특정 위반을 다르게 처리해야 하는 경우 — 회원가입 이메일 중복은 `409` 말고 별도 코드로 응답한다든가 — 그런 건 서비스에서 명시적으로 잡아서 던지면 됨. Interceptor에서 하는 건 폴백. 명시적으로 처리 안 한 것들은 여기서 최소한 말 되는 응답으로 바꿔줌.

---

## 8. 실제 흐름

세 조각이 어떻게 맞물리는지 요청 하나로 봄.

```typescript
// Controller
@UseInterceptors(TransactionInterceptor)   // ← ①
@Post('admin/reset-password')
async resetAdminPassword(
  @Admin() admin: AdminInfo,
  @Body() dto: ResetAdminPasswordDto,
  @QueryRunner() queryRunner: QR,          // ← ②
) {
  return await this.accountService.resetAdminPassword(
    admin.id,
    dto.currentPassword,
    dto.newPassword,
    queryRunner,
  );
}

// Service
async resetAdminPassword(
  adminId: number,
  current: string,
  next: string,
  queryRunner: QueryRunner,
) {
  const account = await this.accountRepository.findById(adminId, queryRunner);
  // ... 현재 비밀번호 검증 ...
  const hashed = await hash(next);
  await this.accountRepository.updatePasswordWithAccount(account, hashed, queryRunner);
  return { success: true, message: '변경 완료' };
}

// Repository
async findById(id: number, queryRunner?: QueryRunner) {
  return this.getRepository(queryRunner).findOneBy({ id });  // ← ③
}
```

정상 흐름:

```
요청 진입
  → Interceptor가 QueryRunner 열고 req에 심음
  → Controller가 @QueryRunner()로 꺼내 서비스에 넘김
  → Service가 여러 Repository에 같은 queryRunner 계속 넘김
  → Repository가 getRepository(qr)로 트랜잭션 매니저 위에서 실행
  → 리턴
  → Interceptor의 tap이 commit + release
```

중간에 예외 나면:

```
예외 발생
  → catchError 진입
  → rollback + release
  → PG 에러코드면 도메인 예외로 변환
  → 아니면 원본 그대로 throw
```

요청 하나 = 트랜잭션 하나. 이 규칙이 서비스 코드 어디에도 안 적혀 있는데 그냥 지켜짐. 서비스 어디에도 `startTransaction / commit / rollback / release` 가 없음. 이게 이 구조로 얻은 가장 큰 소득.

---

## 9. 한계

지금 규모에선 잘 굴러가는데 몇 가지는 알고 있어야 함.

**HTTP 컨텍스트 전용.** Interceptor가 `switchToHttp()` 를 씀. `@nestjs/microservices` 의 RPC/이벤트 핸들러는 request 개념이 달라서 그대로는 안 돌아감. RPC 핸들러에도 트랜잭션 필요해지면 Interceptor를 컨텍스트별로 분기하거나 AsyncLocalStorage 같은 별도 그릇 붙여야 함.

사실 MSA 컨텍스트에서 트랜잭션은 좀 다른 문제이기도 함. 서비스 경계 넘는 순간 로컬 트랜잭션이 아니라 Saga랑 Outbox 영역. 이건 이전 글 [MSA 데이터 정합성 확보 설계 노트](/blog/msa-data-consistency/) 에서 정리했음.

**중첩 트랜잭션 안 됨.** 같은 요청에서 트랜잭션 또 여는 건 지원 안 함. 근데 이게 오히려 이 구조를 단순하게 만드는 규칙이라 SAVEPOINT 까지 지원한다고 복잡도 늘리진 않음. 부분 롤백 정말 필요해지면 그때 가서 `BaseRepository` 에 별도 API 파는 게 나음.

**Interceptor 붙이는 걸 까먹을 수 있음.** `@UseInterceptors(TransactionInterceptor)` 안 붙이면 `@QueryRunner()` 가 런타임에 터짐. 바로 발견되긴 하는데 컴파일 타임에 잡히진 않음. 컨트롤러가 지금은 관리 가능한 수준이라 명시적으로 붙이고 있는데 더 커지면:

- 글로벌 Interceptor로 바꾸고 `@SkipTransaction()` opt-out 두거나
- `@QueryRunner()` 있는데 `@UseInterceptors(TransactionInterceptor)` 없으면 에러 내는 lint 규칙 짜거나

정도가 자연스러운 다음.

**Outbox 패턴이랑 잘 붙음.** 이건 얻은 점. 이벤트 발행을 같은 트랜잭션에 묶어야 할 때 `OutboxEvent` 도 같은 `queryRunner` 로 저장하면 끝.

```typescript
async createOrder(dto: CreateOrderDto, queryRunner: QueryRunner) {
  const order = await this.orderRepository.create(dto, queryRunner);
  await this.outboxRepository.insert(
    { eventType: 'order.created', payload: {...} },
    queryRunner,
  );
  return order;
}
```

`queryRunner` 가 인자로 흐르니까 이 두 INSERT 가 같은 트랜잭션이라는 게 코드에 그대로 보임. 이중 쓰기(dual write) 문제 예방엔 이 명시성이 정말 도움됨.

---

## 마치며

이 구조로 얻은 건 두 개. 반복되던 뼈대 걷어낸 거, 그리고 트랜잭션 참여 여부가 함수 시그니처에 그대로 보이는 거.

라이브러리 안 쓴 이유도 결국 두 번째 때문. 호출 흐름이 코드에 다 보이게 하고 싶었음. 팀이 크지 않고 트랜잭션 흐름 명확히 통제해야 하는 시점엔 편의보다 이 명시성이 더 값짐.

물론 지금 판단이 그렇다는 거고, 서비스 커지고 QueryRunner 넘겨야 하는 계층이 계속 늘어나면 그때 다시 볼 문제.
