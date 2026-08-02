---
title: "완성된 공급망"
description: "Supplier와 Shipment를 추가해 Fourth Coffee 온톨로지를 완성합니다. 소싱·물류·리테일을 연결합니다."
---

## 큰 그림 완성하기

Fourth Coffee는 커피만 파는 게 아닙니다. 전 세계 공급업체에서 원두를 조달하고, 매장으로 배송을 받고, 전체 공급망을 추적합니다. **Supplier**와 **Shipment**를 추가해 순환을 닫습니다.

## Supplier

| 속성 | 타입 | 식별자? |
|---|---|---|
| `supplierId` | string | ✓ |
| `name` | string | |
| `country` | string | |
| `certification` | enum (Fair Trade, Rainforest Alliance, Organic, Direct Trade, None) | |
| `rating` | decimal | |

`certification` 속성은 지속 가능성 인증을 담는 enum입니다. `rating`은 품질 점수를 위한 decimal (1~5)입니다.

## Shipment

| 속성 | 타입 | 식별자? |
|---|---|---|
| `shipmentId` | string | ✓ |
| `dispatchDate` | date | |
| `arrivalDate` | date | |
| `status` | enum (In Transit, Delivered, Delayed) | |
| `weight` | decimal (kg) | |

Shipment는 **허브 엔티티** 역할을 합니다. Product를 매개로 Supplier와 Store를 연결하며 소싱과 리테일 양쪽을 이어 줍니다.

## 새 관계

네 개의 새 관계가 공급망을 완성합니다.

- **sourcedFrom** — `Product` → `Supplier` (many-to-one)
  각 상품의 원두는 한 공급업체에서 조달됩니다.

- **sentBy** — `Shipment` → `Supplier` (many-to-one)
  각 배송은 한 공급업체에서 출발합니다.

- **deliveredTo** — `Shipment` → `Store` (many-to-one)
  각 배송은 한 매장에 도착합니다.

- **carries** — `Shipment` → `Product` (many-to-many)
  하나의 배송에는 여러 상품이 실릴 수 있고, 상품 하나도 여러 배송에 실릴 수 있습니다.

> **허브 엔티티 패턴:** Shipment는 세 개의 서로 다른 엔티티(Supplier, Store, Product)를 연결합니다. 허브 엔티티는 그래프의 흩어진 부분들을 이어 주기 때문에 강력합니다.

## 완성된 그래프

<ontology-embed id="official/cosmic-coffee-step-3" diff="official/cosmic-coffee-step-2" height="500px"></ontology-embed>

*완성된 Fourth Coffee 온톨로지: 6개 엔티티 타입, 7개 관계. Shipment가 Supplier, Store, Product를 잇는 허브 역할을 합니다.*

## 완성된 모델이 가능하게 하는 것

| 질문 | 그래프 경로 |
|---|---|
| 어느 공급업체가 유기농 원두를 제공하나? | Product (isOrganic=true) → Supplier |
| 지연 배송을 받은 매장은? | Shipment (status=Delayed) → Store |
| 최상위 공급업체의 등급은? | Product → Supplier (rating 정렬) |
| 어느 인증 공급업체가 최대 규모 매장에 배송하나? | Supplier → Shipment → Store (capacity 정렬) |

## GQL 쿼리 예시

캘리포니아 매장으로 배송하는 Fair Trade 인증 공급업체 찾기:

```gql
MATCH (sup:Supplier)<-[:sentBy]-(s:Shipment)-[:deliveredTo]->(st:Store)
WHERE sup.certification = 'Fair Trade' AND st.state = 'CA'
RETURN sup.name, st.name, s.status
```

## 지금까지 만든 것

| 단계 | 추가된 엔티티 | 누적 | 핵심 개념 |
|---|---|---|---|
| 1 | Customer, Order, Product | 3 | 엔티티 타입, 식별자, 카디널리티 |
| 2 | Store | 4 | 위치 모델링, many-to-one |
| 3 | Supplier, Shipment | 6 | 공급망, 허브 엔티티 |

## 핵심 정리

1. **작게 시작하라** — 세 개의 엔티티만으로도 가치를 만들 수 있습니다
2. Shipment 같은 **허브 엔티티**가 서로 다른 비즈니스 도메인을 이어 줍니다
3. **enum 속성**은 모델 수준에서 데이터 품질을 강제합니다
4. **그래프는 점진적으로 자란다** — 각 단계가 새로운 질의 능력을 더합니다
5. **GQL 쿼리**는 온톨로지 구조에 그대로 매핑됩니다 — 임피던스 미스매치가 없습니다

```quiz
Q: 이 온톨로지에서 Shipment가 "허브 엔티티"로 여겨지는 이유는?
- 어느 엔티티보다도 속성이 많아서
- Supplier, Store, Product 세 엔티티를 연결해서 [correct]
- 가장 자주 조회되는 엔티티라서
- 마지막에 추가된 엔티티라서
> Shipment는 Supplier(sentBy), Store(deliveredTo), Product(carries)와 관계를 맺으며 소싱·물류·리테일 도메인을 하나의 엔티티에서 이어 주기 때문에 허브입니다.
```

Fourth Coffee 학습 경로를 완주하셨습니다! [카탈로그](#/catalogue)에서 각 단계를 불러와 대화식으로 탐색해 보세요.
