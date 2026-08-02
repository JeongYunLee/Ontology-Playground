---
title: "매장 추가하기"
description: "온톨로지에 매장 위치를 도입하고, 주문을 처리 매장과 연결합니다."
---

## 주문이 일어나는 곳

지금까지는 *누가* *무엇을* 주문하는지 알지만 *어디서*는 아직 모릅니다. Fourth Coffee는 여러 도시에서 매장을 운영하고, 각 주문은 특정 매장에서 처리됩니다.

**Store** 엔티티를 추가하면 위치 기반의 질문에 답할 수 있습니다.

- "가장 주문이 많은 매장은?"
- "도시별 평균 주문 금액은?"
- "주문량 기준으로 인력 보강이 필요한 매장은?"

## Store 엔티티

| 속성 | 타입 | 식별자? |
|---|---|---|
| `storeId` | string | ✓ |
| `name` | string | |
| `city` | string | |
| `state` | string | |
| `openDate` | date | |
| `capacity` | integer | |

`capacity` 속성(좌석 수)은 **integer**입니다. 운영 계획에 유용합니다. `city`와 `state` 속성은 전체 주소 계층 없이도 지리적 맥락을 제공합니다.

## 새 관계

- **processedAt** — `Order` → `Store` (many-to-one)
  각 주문은 정확히 하나의 매장에서 처리되지만, 한 매장은 많은 주문을 처리합니다.

> **설계 노트:** many-to-one 관계입니다. 많은 주문이 하나의 매장에 매핑됩니다. "속한다" 또는 "일어난다" 관계에서 가장 흔한 카디널리티 패턴입니다.

## 성장하는 그래프

<ontology-embed id="official/cosmic-coffee-step-2" diff="official/cosmic-coffee-step-1" height="400px"></ontology-embed>

*Store가 processedAt 관계를 통해 그래프에 합류합니다. diff 뷰가 Step 1 이후 무엇이 새로 생겼는지 강조해 줍니다.*

## 배운 것

- **many-to-one 관계**는 "속한다" 또는 "위치한다" 패턴을 모델링합니다
- **integer 속성**은 셀 수 있는 수량(capacity, 층수, 좌석 수)에 적합합니다
- 엔티티 하나를 추가하면 위치 기반 질의의 한 영역이 통째로 열립니다
- `diff` 뷰는 무엇이 바뀌었는지 정확히 보여 주어 온톨로지 진화를 추적하기 쉽게 합니다

```quiz
Q: Order와 Store 사이의 "processedAt" 관계는 어떤 카디널리티여야 할까요?
- One-to-one — 각 매장에 정확히 하나의 주문
- One-to-many — 각 주문이 여러 매장에서 처리됨
- Many-to-one — 여러 주문이 하나의 매장에서 처리됨 [correct]
- Many-to-many — 주문이 여러 매장에서 동시에 처리될 수 있음
> 각 주문은 정확히 하나의 매장 위치에서 처리되지만, 한 매장은 하루에 많은 주문을 처리합니다. Order 관점에서 볼 때 many-to-one입니다.
```

다음에는 Supplier와 Shipment로 공급망을 완성합니다.
