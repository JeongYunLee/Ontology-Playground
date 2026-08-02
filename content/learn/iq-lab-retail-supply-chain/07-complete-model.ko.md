---
title: "완성된 모델"
description: "Promotion과 Return을 추가해 완전한 15-엔티티 리테일 공급망 온톨로지를 완성합니다 — 그리고 완성된 그래프를 탐색합니다."
---

## 마지막 두 엔티티

마지막 두 엔티티 타입이 리테일 생애주기를 닫습니다.

- **Promotion** — 매출을 견인하는 마케팅 캠페인
- **Return** — 되돌아오는 상품, 주문과 상품 모두에 연결

## Promotion

특정 상품을 타겟팅하는 마케팅 캠페인.

| 속성 | 타입 | 식별자? |
|---|---|---|
| `promotionId` | string | ✓ |
| `promotionName` | string | |
| `isActivePromotion` | boolean | |

`isActivePromotion` 플래그는 현재 진행 중인 캠페인 필터링을 가능하게 합니다. "반품률이 높은 상품과 연관된 활성 프로모션은?" 같은 질문은 Promotion → Product ← Return을 순회합니다.

## Return

주문과 상품으로 되돌아가는 반품 아이템.

| 속성 | 타입 | 식별자? |
|---|---|---|
| `returnId` | string | ✓ |
| `returnDate` | date | |
| `reason` | string | |

## 새 관계

마지막 세 관계.

- **PromotionForProduct** — `Promotion` → `Product` (many-to-one)
  프로모션이 어느 상품을 타겟팅하는지.

- **ReturnForOrder** — `Return` → `Order` (many-to-one)
  반품이 어느 주문과 연결되는지.

- **ReturnOfProduct** — `Return` → `Product` (many-to-one)
  어느 상품이 반품됐는지.

## 완성된 그래프

<ontology-embed id="official/iq-lab-retail-step-6" diff="official/iq-lab-retail-step-5" height="500px"></ontology-embed>

*완성된 리테일 공급망 온톨로지: 15개 엔티티 타입, 18개 관계. 모든 엔티티가 최소 하나 이상의 다른 엔티티와 연결되어 풍부하고 순회 가능한 그래프를 이룹니다.*

## 완성된 모델이 가능하게 하는 것

전체 온톨로지가 갖춰지면 다음과 같은 질문이 자연스러워집니다.

| 질문 | 그래프 경로 |
|---|---|
| 반품을 유발한 프로모션은? | Promotion → Product ← Return |
| 반품된 상품의 재고는? | Return → Product ← Inventory → Warehouse |
| 수요가 높은 지역에 서비스하는 캐리어는? | DemandSignal → Region ← Store; Shipment → Carrier |
| 프로모션 상품을 주문한 고객은? | Customer ← Order → OrderLine → Product ← Promotion |
| 재고가 부족한 상품에 대한 예측은? | Inventory → Product ← Forecast |

이들 각각은 복잡한 다중 테이블 SQL 조인이 필요할 것입니다. 온톨로지가 있으면 그래프 순회로 표현됩니다. 그리고 Fabric IQ에서는 자연어 데이터 에이전트가 온톨로지 구조에서 답할 수 있습니다.

## GQL 쿼리 예시

첫 번째 질문 — "반품을 유발한 프로모션은?" — 을 GQL로 표현하면 다음과 같습니다.

```gql
MATCH (r:Return)-[:ReturnOfProduct]->(p:Product)<-[:PromotionForProduct]-(promo:Promotion)
WHERE promo.isActivePromotion = true
RETURN promo.promotionName, p.name, r.reason
```

GQL 패턴은 여러분이 설계한 온톨로지 관계를 그대로 반영합니다. 모델과 질의 사이에 임피던스 미스매치가 없습니다.

## 지금까지 만든 것

여섯 단계에 걸쳐 완전한 온톨로지를 점진적으로 구축했습니다.

| 단계 | 추가된 엔티티 | 누적 | 핵심 개념 |
|---|---|---|---|
| 1 | Customer, Order, Product | 3 | 엔티티 타입, 식별자, 카디널리티 |
| 2 | OrderLine, ProductCategory | 5 | 연결 엔티티, 계층 |
| 3 | Region, Store | 7 | 지리 구조, boolean 속성 |
| 4 | Shipment, Carrier, Warehouse | 10 | 허브 엔티티, 크로스 도메인 연결 |
| 5 | Inventory, Forecast, DemandSignal | 13 | 크로스 소스 통합, 계획 데이터 |
| 6 | Promotion, Return | 15 | 루프 닫기, GQL 질의 |

## 핵심 정리

1. **작게 시작하고 점진적으로 키우세요** — 세 엔티티만으로도 가치를 만들 수 있습니다
2. **연결 엔티티**는 many-to-many 속성 문제를 해결합니다
3. **허브 엔티티**(Shipment 같은)는 서로 다른 도메인을 잇습니다
4. **크로스 소스 통합**이 핵심 가치입니다. 하나의 온톨로지, 여러 데이터 엔진
5. **그래프 순회**는 복잡한 SQL 조인을 직관적인 경로 패턴으로 대체합니다
6. **온톨로지가 API입니다** — GQL 질의와 데이터 에이전트 질문 모두 같은 구조를 따릅니다

```quiz
Q: 완성된 리테일 온톨로지에서 "반품을 유발한 프로모션은?" 질의를 그래프 순회로 어떻게 표현할까요?
- Customer → Order → Product → Promotion
- Promotion → Product ← Return [correct]
- Return → Order → Customer → Promotion
- Promotion → Return → Product
> Promotion → Product ← Return 경로는 PromotionForProduct와 ReturnOfProduct 관계를 따라 공유 Product 엔티티를 통해 프로모션과 반품된 상품을 잇습니다.
```

IQ Lab: 리테일 공급망을 완주하셨습니다. [카탈로그](#/catalogue)에서 단계별 온톨로지를 로드해 플레이그라운드에서 대화식으로 탐색해 보세요.
