---
title: "MSA 데이터 정합성 확보 설계 노트"
description: "분산 환경에서 데이터 정합성을 어떻게 보장할 것인가 — 동시성, 멱등성, NATS, Outbox, Saga 패턴을 하나의 흐름으로 정리."
date: "2026-08-03"
tags: ["MSA", "NestJS", "NATS", "Outbox", "Saga", "Idempotency"]
published: true
---

> 힐링샘 레거시 3종 서비스를 NestJS + gRPC + NATS 기반 MSA로 전환하면서, DB per Service 구조에서 데이터 정합성을 어떻게 보장할지 정리한 설계 문서입니다.
>
> 핵심 질문: **분산 환경에서 데이터 정합성을 어떻게 보장하는가.**

## 목차

1. [전체 흐름 — 왜 이 문제들이 연결되는가](#1-전체-흐름--왜-이-문제들이-연결되는가)
2. [멀티 인스턴스에서의 동시성 문제](#2-멀티-인스턴스에서의-동시성-문제)
3. [멱등성 (Idempotency) — 1단계 방어](#3-멱등성-idempotency--1단계-방어)
4. [Redis 분산 락 — 2단계 방어](#4-redis-분산-락--2단계-방어)
5. [아키텍처 레벨 방지 — 3단계 방어](#5-아키텍처-레벨-방지--3단계-방어)
6. [메시지 브로커 선택 — 왜 NATS인가](#6-메시지-브로커-선택--왜-nats인가)
7. [NATS 장애 대응 전략](#7-nats-장애-대응-전략)
8. [Outbox 패턴 — 이벤트 발행의 신뢰성 보장](#8-outbox-패턴--이벤트-발행의-신뢰성-보장)
9. [Saga 패턴 — 여러 서비스에 걸친 트랜잭션](#9-saga-패턴--여러-서비스에-걸친-트랜잭션)

---

## 1. 전체 흐름 — 왜 이 문제들이 연결되는가

```
MSA(마이크로서비스 아키텍처)를 운영한다
  ↓
서비스가 멀티 인스턴스로 배포된다
  ↓
같은 이벤트가 여러 인스턴스에서 동시에 처리될 수 있다 → [동시성 문제]
  ↓
같은 요청이 2번 와도 1번만 처리되어야 한다 → [멱등성]
  ↓
서비스 간 이벤트를 전달할 메시지 브로커가 필요하다 → [왜 NATS인가]
  ↓
NATS가 죽으면 이벤트가 유실된다 → [NATS 장애 대응]
  ↓
이벤트 발행의 신뢰성을 보장해야 한다 → [Outbox 패턴]
  ↓
여러 서비스에 걸친 트랜잭션을 관리해야 한다 → [Saga 패턴]
```

각 계층은 앞 계층의 한계를 보완하기 위해 존재합니다. 하나의 패턴이 만능이 아니라, 여러 계층이 겹쳐서 정합성을 만듭니다.

---

## 2. 멀티 인스턴스에서의 동시성 문제

### 왜 이 문제가 발생하는가

MSA에서는 서비스를 여러 인스턴스로 배포합니다 (로드밸런싱, 가용성). 메시지 브로커가 이벤트를 발행하면, 네트워크 지연 · 브로커 재전송 · 컨슈머 ACK 실패 등의 이유로 **같은 이벤트가 2개 이상의 인스턴스에 도달**할 수 있습니다.

**예시:** 주문이 생성되면 `order.created` 이벤트가 발행됩니다. 결제 서비스가 3개 인스턴스로 떠 있는데, 브로커 재전송으로 인해 인스턴스 A와 B가 동시에 같은 이벤트를 받습니다. 멱등성 처리가 없으면 **결제가 2번 일어납니다.**

### 해결: 3단계 방어 구조

- **1단계** — 멱등성 (DB 유니크 제약)
- **2단계** — Redis 분산 락
- **3단계** — 아키텍처 레벨 방지 (파티셔닝, Outbox)

---

## 3. 멱등성 (Idempotency) — 1단계 방어

### 멱등성이란

**같은 요청을 한 번 보내든 열 번 보내든 결과가 동일한 성질.**

HTTP 메서드로 보면:

- GET, PUT, DELETE → 멱등
- POST → 비멱등

분산 환경에서는 재시도, 브로커 재전송 등으로 같은 요청이 여러 번 올 수 있으므로, **모든 상태 변경 처리는 멱등성을 보장해야 합니다.**

### 구현: DB 유니크 제약을 이용한 멱등키

이벤트마다 고유한 idempotency key(이벤트 ID)를 부여합니다. 처리 전에 DB에 해당 키로 INSERT를 시도하고, 유니크 제약 위반이 발생하면 이미 처리된 이벤트로 판단하고 무시합니다.

**핵심: "확인 후 삽입"이 아니라 "삽입 시도 후 충돌 처리"**

먼저 자연스럽게 떠오르는 방식부터 봅니다.

```typescript
// ❌ 위험한 방식
const exists = await db.findOne({ eventId });
if (!exists) {
  await processEvent(event);       // 결제 처리
  await db.insert({ eventId });    // 처리 끝났으니 기록
}
```

"처리에 성공한 것만 표시하자"는 사고 흐름 때문에 이 순서를 자주 씁니다. 그런데 인스턴스 A, B 가 이벤트를 동시에 받으면 이렇게 됩니다.

```
시각    인스턴스 A                인스턴스 B
─────────────────────────────────────────────
t1     findOne → 없음
t2                              findOne → 없음
t3     processEvent (결제)
t4                              processEvent (결제)   ← 결제 2번!
t5     insert eventId (성공)
t6                              insert eventId (실패)  ← 이때 막아봐야 늦음
```

DB 유니크 제약이 두 번째 INSERT는 막아주지만, 그 시점엔 이미 결제가 두 번 일어난 뒤입니다. **DB 가 뭘 막아주기 전에 부수효과가 먼저 실행되는 게 문제입니다.**

그럼 순서를 뒤집어서 INSERT를 먼저 해도 되지 않냐 할 수 있는데, 그것도 아슬아슬합니다.

```typescript
// △ 아슬아슬한 방식
const exists = await db.findOne({ eventId });
if (!exists) {
  await db.insert({ eventId });    // ← 여기서 두 번째 놈이 유니크 위반으로 throw
  await processEvent(event);
}
```

이 코드는 실제로 이중 처리가 안 나긴 합니다. 두 번째 INSERT 가 예외를 던지고, 그 예외 때문에 processEvent 까지 안 갑니다. 그런데 **개발자 머릿속 모델과 실제 안전장치가 어긋난 상태**입니다. 개발자는 "내가 findOne 으로 체크했으니 안전하다"고 생각하는데, 실제로 안전하게 만들어주는 건 findOne 이 아니라 INSERT 실패 예외입니다. 만약 예외가 위로 안 던져지도록 감싼 코드가 있거나, 나중에 누가 findOne 만 믿고 순서를 바꾸는 순간 바로 위의 "위험한 방식"이 됩니다.

그래서 findOne 은 아예 빼고, **INSERT 시도 자체를 체크로 삼는** 방식이 안전합니다.

```typescript
// ✅ 올바른 방식 — INSERT 시도가 곧 체크
try {
  await db.insert({ eventId });    // 유니크 제약이 걸려 있으므로 하나만 성공
  await processEvent(event);       // INSERT 성공한 인스턴스만 여기로
} catch (e) {
  if (e instanceof UniqueConstraintViolation) {
    return;                        // 이미 처리된 이벤트
  }
  throw e;
}
```

이 방식은 실제 안전장치(유니크 제약)가 코드의 첫 줄에 그대로 드러납니다. 순서를 바꿀 수도 없고(processEvent 가 INSERT 성공 뒤에만 실행), 개발자 머릿속 모델과 실제 방어선이 일치합니다.

### 처리와 멱등키 저장은 하나의 트랜잭션으로 묶는다

```typescript
await dataSource.transaction(async (manager) => {
  await manager.insert(ProcessedEvent, { eventId });
  await processEvent(event, manager);
});
// 커밋되면 둘 다 저장, 롤백되면 둘 다 취소
```

- 키만 저장하고 처리가 실패하면 → 영원히 재처리 불가
- 처리는 되고 키 저장이 실패하면 → 다음에 또 처리됨 (중복)

하나의 트랜잭션에 묶으면 이 두 상황이 구조적으로 발생하지 않습니다.

---

## 4. Redis 분산 락 — 2단계 방어

### 왜 필요한가

DB 유니크 제약은 확실하지만, 매번 DB에 INSERT를 시도하므로 이벤트 양이 많으면 DB 부하가 커집니다. **더 빠른 1차 필터**가 필요합니다.

### 구현: Redis SET NX

```typescript
const acquired = await redis.set(
  `lock:event:${eventId}`,
  '1',
  'NX', // 존재하지 않을 때만 저장
  'EX', // TTL
  60,   // 60초 후 자동 만료
);

if (acquired) {
  try {
    await processEvent(event);
  } catch (e) {
    await redis.del(`lock:event:${eventId}`);
    throw e;
  }
} else {
  // 다른 인스턴스가 이미 처리 중
}
```

Redis는 싱글 스레드이므로 SET NX 자체가 원자적입니다. 두 인스턴스가 동시에 요청해도 하나만 성공합니다. TTL을 걸어서 락이 영원히 남는 문제도 방지됩니다.

### Redis + DB 조합으로 안전성 극대화

```
이벤트 수신
  ↓
[1차] Redis SET NX → 이미 있으면 무시 (빠른 필터)
  ↓
[2차] DB INSERT + 유니크 제약 → 이미 있으면 무시 (최종 안전망)
  ↓
이벤트 처리
```

Redis로 대부분의 중복을 걸러내고, Redis가 장애여도 DB 유니크 제약이 잡아줍니다.

---

## 5. 아키텍처 레벨 방지 — 3단계 방어

1단계(멱등키)와 2단계(분산 락)는 "중복이 왔을 때 막는 것"입니다. 3단계는 **"중복이 오지 않게 구조를 설계하는 것"** 입니다.

- **Kafka 파티셔닝** — 같은 키(예: `orderId`)를 가진 이벤트를 동일 파티션에 배정하면, 해당 파티션의 컨슈머는 하나뿐이므로 물리적으로 중복 수신이 불가능
- **RabbitMQ Single Active Consumer** — 하나의 컨슈머만 메시지를 수신하도록 설정
- **Transactional Outbox 패턴** — 이벤트 발행 자체를 DB 트랜잭션과 묶어서, 발행 단계에서 중복이 생기지 않도록 (→ [8장](#8-outbox-패턴--이벤트-발행의-신뢰성-보장))

---

## 6. 메시지 브로커 선택 — 왜 NATS인가

기술 선택은 항상 **대안 대비 장점**으로 설명해야 합니다.

| 비교 항목 | NATS | Kafka | RabbitMQ |
|-----------|------|-------|----------|
| 복잡도 | 낮음 — 설정 단순 | 높음 — ZooKeeper/KRaft 필요 | 중간 |
| 지연 시간 | 매우 낮음 | 낮음 (배치 최적화) | 낮음 |
| 메시지 영속성 | JetStream 사용 시 지원 | 기본 지원 (로그 기반) | 기본 지원 |
| NestJS 통합 | 공식 트랜스포터 | 별도 라이브러리 | 공식 트랜스포터 |
| 적합한 규모 | 중소규모 MSA | 대규모 스트리밍 | 중규모, 복잡한 라우팅 |

### 선택 근거

NestJS + gRPC 기반 MSA에서 서비스 간 이벤트 전달 용도로 사용합니다. Kafka는 대규모 로그 스트리밍에 강점이 있지만, 힐링샘 서비스 규모에서는 인프라 오버헤드가 과합니다. NATS는:

- NestJS 공식 트랜스포터로 통합이 간편
- 경량이면서도 JetStream을 통해 메시지 영속성과 재전송을 지원
- 현재 규모와 요구사항에 가장 적합

---

## 7. NATS 장애 대응 전략

메시지 브로커는 **단일 장애점(SPOF)** 이 될 수 있습니다. 3단계로 대응합니다.

### 1단계: NATS 자체 고가용성 — 클러스터링

단일 노드로 운영하지 않습니다. 최소 3노드 클러스터로 구성하면, 한 노드가 죽어도 나머지 노드가 자동으로 이어받습니다.

```bash
nats-server -cluster nats://0.0.0.0:6222 \
  -routes nats://node2:6222,nats://node3:6222
```

JetStream을 쓰면 메시지가 노드 간 복제되므로 데이터 유실도 방지됩니다.

### 2단계: NATS 전체 장애 시 — Outbox 폴백

클러스터가 통째로 죽는 극단적 상황에서는, **메시지를 NATS에 직접 보내지 않고 DB에 저장**합니다.

```typescript
try {
  await natsClient.emit('order.created', payload);
} catch (e) {
  await outboxRepository.insert({
    eventType: 'order.created',
    payload: JSON.stringify(payload),
    published: false,
    createdAt: new Date(),
  });
}
```

NATS가 복구되면 별도 프로세스가 Outbox를 읽어서 재발행합니다. **이벤트 발행이 NATS의 가용성에 의존하지 않게 됩니다.**

### 3단계: 아키텍처 레벨 — 동기/비동기 분리

- 즉시 응답이 필요한 통신은 **gRPC(동기)**, 비동기 이벤트만 NATS
- NATS가 죽어도 gRPC로 핵심 기능은 유지
- 서킷 브레이커로 NATS 연결 실패 반복 시 자동으로 Outbox 모드 전환
- 헬스체크로 상태 모니터링, 복구 시 자동 정상 모드 복귀

---

## 8. Outbox 패턴 — 이벤트 발행의 신뢰성 보장

Outbox 패턴은 **장애 대응만을 위한 것이 아닙니다.** 정상 상황에서도 이벤트 발행의 신뢰성을 보장하는 핵심 패턴입니다.

### 문제: 이중 쓰기 (Dual Write Problem)

MSA에서 가장 흔한 실수는 비즈니스 로직과 이벤트 발행을 따로 처리하는 것입니다.

```typescript
// ❌ 위험한 코드
await orderRepository.save(order);              // 1. DB 저장 성공
await natsClient.emit('order.created', order);  // 2. 이벤트 발행 실패 시?
```

- 1번 성공, 2번 실패 → 주문은 DB에 있지만, 결제·재고 서비스는 모름
- 2번 먼저 성공, 1번 롤백 → 존재하지 않는 주문에 대해 결제 진행

**DB 트랜잭션과 메시지 발행은 서로 다른 시스템이라 하나의 트랜잭션으로 묶을 수 없습니다.** 이것이 이중 쓰기 문제입니다.

### 해결: 이벤트를 같은 DB 트랜잭션에서 Outbox 테이블에 저장

```typescript
await dataSource.transaction(async (manager) => {
  // 1. 비즈니스 로직
  const order = manager.create(Order, { userId, items, status: 'CREATED' });
  await manager.save(order);

  // 2. 같은 트랜잭션에서 Outbox에 이벤트 저장
  await manager.insert(OutboxEvent, {
    id: uuid(),
    aggregateType: 'Order',
    aggregateId: order.id,
    eventType: 'ORDER_CREATED',
    payload: JSON.stringify({
      orderId: order.id,
      userId: order.userId,
      items: order.items,
    }),
    published: false,
    createdAt: new Date(),
  });
});
// 트랜잭션 커밋되면 둘 다 저장, 롤백되면 둘 다 취소 → 원자성 보장
```

### Outbox 테이블 구조

```sql
CREATE TABLE outbox_event (
  id              UUID PRIMARY KEY,
  aggregate_type  VARCHAR(100) NOT NULL,   -- 'Order', 'Payment'
  aggregate_id    UUID NOT NULL,
  event_type      VARCHAR(100) NOT NULL,   -- 'ORDER_CREATED'
  payload         JSONB NOT NULL,
  published       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMP DEFAULT NOW()
);
```

### Outbox → 브로커 전달 방식

**방법 1: 폴링 퍼블리셔 (Polling Publisher)**

별도 프로세스가 주기적으로 Outbox를 조회하여 미발행 이벤트를 브로커에 발행합니다.

```typescript
async function publishOutboxEvents() {
  const unpublished = await outboxRepository.find({
    where: { published: false },
    order: { createdAt: 'ASC' },
    take: 100,
  });

  for (const event of unpublished) {
    try {
      await natsClient.emit(event.eventType, JSON.parse(event.payload));
      event.published = true;
      await outboxRepository.save(event);
    } catch (e) {
      break; // 다음 주기에 재시도
    }
  }
}

setInterval(publishOutboxEvents, 5000);
```

- 장점: 구현이 단순
- 단점: 폴링 주기만큼 지연, DB 부하

**방법 2: CDC (Change Data Capture)**

DB의 트랜잭션 로그(WAL/binlog)를 읽어서, Outbox 테이블에 INSERT가 발생하면 자동으로 브로커에 전달합니다. **Debezium**이 대표적입니다.

- 장점: 거의 실시간, 폴링 부하 없음
- 단점: Debezium 같은 별도 인프라 필요

---

## 9. Saga 패턴 — 여러 서비스에 걸친 트랜잭션

Outbox 패턴으로 **하나의 서비스 내에서** 이벤트 발행의 신뢰성을 보장했습니다. 하지만 MSA에서는 주문 → 결제 → 재고 → 배송처럼 **여러 서비스에 걸친 트랜잭션**이 필요합니다. 각 서비스가 자기 DB를 갖고 있으므로 하나의 트랜잭션으로 묶을 수 없습니다.

결제까지 완료된 후에 재고 부족으로 실패하면? 이미 완료된 결제를 취소하고, 주문도 취소해야 합니다. 이것을 **보상 트랜잭션(Compensating Transaction)** 이라 하고, 이 전체 흐름을 관리하는 것이 Saga 패턴입니다.

### 핵심 개념: 로컬 트랜잭션 + 보상 트랜잭션

```
정상 흐름:
주문 생성 → 결제 처리 → 재고 차감 → 배송 요청 → 완료

재고 차감에서 실패 시:
재고 차감 실패 → 결제 취소(환불) → 주문 취소 → 실패 응답
```

| 단계 | 로컬 트랜잭션 | 보상 트랜잭션 |
|------|-------------|-------------|
| 1 | 주문 생성 (PENDING) | 주문 취소 (CANCELLED) |
| 2 | 결제 처리 | 결제 취소 (환불) |
| 3 | 재고 차감 | 재고 복구 |
| 4 | 배송 요청 | 배송 취소 |

### 방식 1: Choreography (이벤트 기반)

중앙 관리자 없이, 각 서비스가 이벤트를 발행하고 다음 서비스가 구독하여 진행합니다.

```
주문 서비스: 주문 생성 → 'order.created' 발행
    ↓ (구독)
결제 서비스: 결제 처리 → 'payment.completed' 발행
    ↓ (구독)
재고 서비스: 재고 차감 → 'inventory.reserved' 발행
    ↓ (구독)
주문 서비스: 주문 확정 (CONFIRMED)

// 재고 실패 시 → 역방향 보상
재고 서비스: 'inventory.failed' 발행
    ↓
결제 서비스: 환불 → 'payment.refunded' 발행
    ↓
주문 서비스: 주문 취소 (CANCELLED)
```

```typescript
@EventPattern('payment.completed')
async handlePaymentCompleted(data: PaymentCompletedEvent) {
  await this.orderRepository.update(data.orderId, {
    status: OrderStatus.PAYMENT_DONE,
  });
  this.client.emit('inventory.reserve', {
    orderId: data.orderId,
    items: data.items,
  });
}

@EventPattern('inventory.failed')
async handleInventoryFailed(data: InventoryFailedEvent) {
  // 보상 트랜잭션
  await this.orderRepository.update(data.orderId, {
    status: OrderStatus.CANCELLED,
    cancelReason: data.reason,
  });
}
```

- 장점: 서비스 간 결합도가 낮음
- 단점: 전체 흐름 파악이 어려움. 서비스가 많아지면 이벤트 체인이 복잡해져서 디버깅이 어려워짐

### 방식 2: Orchestration (중앙 관리자)

Saga Orchestrator가 전체 흐름을 중앙에서 관리합니다. 각 단계를 순서대로 호출하고, 실패 시 보상 트랜잭션을 역순으로 실행합니다.

```typescript
class OrderSagaOrchestrator {
  private steps: SagaStep[] = [
    {
      name: 'createOrder',
      execute: (data) => this.orderService.create(data),
      compensate: (data) => this.orderService.cancel(data.orderId),
    },
    {
      name: 'processPayment',
      execute: (data) => this.paymentService.charge(data),
      compensate: (data) => this.paymentService.refund(data.paymentId),
    },
    {
      name: 'reserveInventory',
      execute: (data) => this.inventoryService.reserve(data),
      compensate: (data) => this.inventoryService.release(data.reservationId),
    },
  ];

  async execute(orderData: CreateOrderDto) {
    const completedSteps: CompletedStep[] = [];

    for (const step of this.steps) {
      try {
        const result = await step.execute(orderData);
        completedSteps.push({ step, result });
        orderData = { ...orderData, ...result };
      } catch (error) {
        await this.compensate(completedSteps);
        throw new SagaFailedException(step.name, error);
      }
    }

    return { success: true, orderId: orderData.orderId };
  }

  private async compensate(completedSteps: CompletedStep[]) {
    for (const { step, result } of completedSteps.reverse()) {
      try {
        await step.compensate(result);
      } catch (e) {
        // 보상 실패 → 로그 + Dead Letter Queue + 수동 개입
        logger.error(`Compensation failed: ${step.name}`, e);
      }
    }
  }
}
```

- 장점: 전체 흐름이 한 곳에서 관리되어 파악, 디버깅, 모니터링이 쉬움
- 단점: 오케스트레이터가 SPOF가 될 수 있음

### 선택 기준

| 기준 | Choreography | Orchestration |
|------|-------------|---------------|
| 서비스 수 | 3~4개 이하 단순 플로우 | 5개 이상 또는 복잡한 분기 |
| 가시성 | 이벤트 추적 필요 | 한눈에 보임 |
| 결합도 | 낮음 | 오케스트레이터에 의존 |

### Outbox + Saga 조합 (실무 적용안)

Saga의 각 단계에서 이벤트를 발행할 때 Outbox 패턴을 함께 사용합니다. Saga 진행 중에 메시지 브로커 장애가 나도 이벤트가 유실되지 않습니다.

```
주문 서비스 (트랜잭션):
  1. 주문 생성 (DB)
  2. 'order.created' → Outbox에 저장     ← Outbox 패턴
  3. 트랜잭션 커밋

폴링 퍼블리셔:
  4. Outbox → NATS 발행                   ← Saga 진행

결제 서비스:
  5. 결제 처리 + 'payment.completed' → Outbox  ← 다음 Saga 단계
  ...
```

힐링샘 MSA에서는 주문·결제·재고 흐름에 **Orchestration 방식의 Saga**를 적용하고, 각 단계의 이벤트 발행은 **Outbox 패턴**으로 신뢰성을 보장하는 방향으로 설계 중입니다. 보상 트랜잭션 실패에 대비한 **Dead Letter Queue와 수동 개입 프로세스**까지 함께 검토하고 있습니다.
