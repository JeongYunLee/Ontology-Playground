---
title: "완성된 플랫폼"
description: "구매자 피드백 루프를 닫는 Review를 추가해 전자상거래 온톨로지를 완성합니다."
---

## 피드백 루프 닫기

전자상거래 퍼즐의 마지막 조각은 **고객 리뷰**입니다. 리뷰는 구매자를 상품과 다시 이어 주며, 이후 구매에 영향을 미치는 피드백 루프를 만듭니다.

## Review 엔티티

| 속성 | 타입 | 식별자? |
|---|---|---|
| `reviewId` | string | ✓ |
| `rating` | integer | |
| `title` | string | |
| `body` | string | |
| `verified` | boolean | |

`verified` boolean은 리뷰어가 실제로 상품을 구매했는지를 나타냅니다. 다른 구매자와 분석 양쪽에 결정적인 신뢰 신호죠.

## 새 관계

- **writes** — `Buyer` → `Review` (one-to-many)
  한 구매자는 시간에 걸쳐 여러 리뷰를 쓸 수 있습니다.

- **reviews** — `Review` → `Product` (many-to-one)
  각 리뷰는 정확히 하나의 상품에 대한 것이고, 상품 하나는 여러 리뷰를 가질 수 있습니다.

> **피드백 루프:** `Buyer → writes → Review → reviews → Product` 경로는 다시 Product로 순환합니다. 구매자가 상품을 소비하고 리뷰를 남기면 그 리뷰가 다른 구매자에게 영향을 줍니다.

## 완성된 그래프

<ontology-embed id="official/ecommerce-step-3" diff="official/ecommerce-step-2" height="500px"></ontology-embed>

*완성된 전자상거래 온톨로지: 5개 엔티티, 6개 관계. Review가 구매자 피드백 루프를 닫습니다.*

## 완성된 모델이 가능하게 하는 것

| 질문 | 그래프 경로 |
|---|---|
| 인증 리뷰의 평점이 가장 높은 상품은? | Review (verified=true) → Product |
| 장바구니는 있지만 주문은 없는 구매자는? | Buyer → Cart (itemCount > 0), Buyer → Order 없음 |
| 카테고리별 평균 평점은? | Review → Product (카테고리로 그룹) |
| 리뷰를 가장 많이 쓰는 충성 구매자는? | Buyer (loyaltyTier=Gold) → Review (count) |

## GQL 쿼리 예시

현재 누군가의 장바구니에 담긴 상품에 대한 인증 리뷰 찾기:

```gql
MATCH (b:Buyer)-[:has_cart]->(c:Cart)-[:contains]->(p:Product)<-[:reviews]-(r:Review)
WHERE r.verified = true
RETURN p.name, r.rating, r.title
```

## 지금까지 만든 것

| 단계 | 추가된 엔티티 | 누적 | 핵심 개념 |
|---|---|---|---|
| 1 | Buyer, Product, Order | 3 | 구매 흐름, SKU 식별자 |
| 2 | Shopping-Cart | 4 | 세션 엔티티, one-to-one |
| 3 | Review | 5 | 피드백 루프, 인증된 신뢰 |

## 핵심 정리

1. **세션 엔티티**(Cart)는 진행 중인 상태를 담습니다
2. **one-to-one** 관계는 배타적 소유를 모델링합니다
3. **boolean 속성**(verified)은 신뢰 기반 필터링을 가능하게 합니다
4. **피드백 루프**는 선형 체인보다 풍부한 질의 경로를 만듭니다
5. 완성된 그래프로 브라우징부터 리뷰까지 **퍼널 분석**이 가능합니다

```quiz
Q: 이 온톨로지에서 Review 엔티티가 "피드백 루프"를 만드는 이유는?
- 그래프의 모든 다른 엔티티에 연결되어서
- 구매 경로와는 다른 경로로 Buyer에서 Product로 돌아오는 길을 만들어서 [correct]
- 어떤 엔티티보다도 속성이 많아서
- boolean verified 속성을 사용해서
> Review가 없다면 Buyer에서 Product로 가는 경로는 Order를 통한 것뿐입니다. Review는 두 번째 경로(Buyer → Review → Product)를 만들어 순환을 형성합니다. 이 이중 경로 구조는 "구매했지만 리뷰 안 남김" vs "리뷰만 남기고 안 삼" 같은 비교 질의를 가능하게 합니다.
```

전자상거래 플랫폼 학습 경로를 완주하셨습니다! [카탈로그](#/catalogue)에서 각 단계를 불러와 대화식으로 탐색해 보세요.
