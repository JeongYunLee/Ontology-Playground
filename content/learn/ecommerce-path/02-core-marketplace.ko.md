---
title: "핵심 마켓플레이스"
description: "전자상거래 플랫폼의 기초 엔티티인 Buyer, Product, Order를 정의합니다."
---

## 구매 흐름

모든 마켓플레이스는 세 개의 개념을 중심으로 돕니다.

- **Buyer** — 누가 사는가?
- **Product** — 무엇이 팔리고 있는가?
- **Order** — 완료된 거래는 무엇인가?

이 세 엔티티가 핵심 구매 흐름을 담습니다. 이후에 추가하는 모든 것은 이 기초를 풍부하게 할 뿐입니다.

## 엔티티 정의

### Buyer

| 속성 | 타입 | 식별자? |
|---|---|---|
| `buyerId` | string | ✓ |
| `email` | string | |
| `memberSince` | date | |
| `loyaltyTier` | string | |
| `totalSpent` | decimal (USD) | |

오프라인 리테일 고객과 달리, 전자상거래 구매자는 언제나 기본 연락 수단으로 `email`을 가집니다. `totalSpent` 속성은 생애 가치(LTV) 세분화에 쓰입니다.

### Product

| 속성 | 타입 | 식별자? |
|---|---|---|
| `sku` | string | ✓ |
| `name` | string | |
| `category` | string | |
| `price` | decimal (USD) | |
| `stockQty` | integer | |

여기서의 식별자는 `sku` (Stock Keeping Unit)입니다. 전자상거래의 표준 상품 식별자죠. `stockQty` 속성은 실시간 재고를 추적합니다.

### Order

| 속성 | 타입 | 식별자? |
|---|---|---|
| `orderId` | string | ✓ |
| `orderDate` | datetime | |
| `status` | string | |
| `total` | decimal (USD) | |
| `shippingMethod` | string | |

## 관계

- **places** — `Buyer` → `Order` (one-to-many)
  구매자 한 명은 시간에 따라 여러 주문을 낼 수 있습니다.

- **includes** — `Order` → `Product` (many-to-many)
  주문 하나에 여러 상품이 담길 수 있고, 각 상품도 여러 주문에 등장할 수 있습니다.

## 지금까지의 그래프

<ontology-embed id="official/ecommerce-step-1" height="350px"></ontology-embed>

*Buyer, Product, Order가 구매 흐름 관계로 이어져 있습니다.*

## 배운 것

- **SKU**는 전자상거래 상품의 표준 식별자입니다
- `stockQty` integer 속성은 재고 질의를 가능하게 합니다
- 기본 구매 흐름(Buyer → Order → Product)은 어떤 마켓플레이스에서도 척추 역할을 합니다

```quiz
Q: Product의 식별자로 productId 대신 sku를 사용하는 이유는?
- SKU가 입력하기 짧아서
- SKU(Stock Keeping Unit)가 전자상거래·리테일에서 상품을 유일하게 식별하는 업계 표준이라서 [correct]
- productId는 이름 충돌을 일으켜서
- SKU는 항상 숫자값이라서
> SKU는 Stock Keeping Unit의 약자로, 재고 관리·창고·전자상거래 시스템 전반에서 개별 아이템을 유일하게 식별하는 업계 표준 식별자입니다.
```

다음에는 구매 이전 단계를 모델링할 Shopping Cart를 추가합니다.
