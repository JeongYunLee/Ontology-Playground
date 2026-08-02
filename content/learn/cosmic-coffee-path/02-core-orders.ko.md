---
title: "핵심 주문 모델"
description: "커피 비즈니스의 기초 엔티티인 Customer, Order, Product를 정의하고 관계로 연결합니다."
---

## 기초

모든 상거래 시스템은 세 개의 핵심 개념에서 시작합니다.

- **Customer** — 누가 사는가?
- **Order** — 어떤 거래가 발생했는가?
- **Product** — 무엇이 팔렸는가?

이 세 엔티티 타입이 Fourth Coffee 온톨로지의 심장입니다. 이후에 추가하는 모든 것은 여기서 뻗어 나갑니다.

## 엔티티 정의

### Customer

| 속성 | 타입 | 식별자? |
|---|---|---|
| `customerId` | string | ✓ |
| `name` | string | |
| `email` | string | |
| `loyaltyTier` | enum (Bronze, Silver, Gold, Platinum) | |
| `joinDate` | date | |
| `totalSpend` | decimal (USD) | |

`customerId`가 각 고객을 유일하게 식별합니다. `loyaltyTier`는 enum을 사용해 값을 유효한 티어로 제한합니다. 다운스트림 분석에서 데이터 품질 문제를 예방하는 조치입니다.

### Order

| 속성 | 타입 | 식별자? |
|---|---|---|
| `orderId` | string | ✓ |
| `timestamp` | datetime | |
| `total` | decimal (USD) | |
| `status` | enum (Pending, Preparing, Ready, Completed, Cancelled) | |
| `paymentMethod` | enum (Card, Cash, Mobile, Gift Card) | |

### Product

| 속성 | 타입 | 식별자? |
|---|---|---|
| `productId` | string | ✓ |
| `name` | string | |
| `category` | enum (Espresso, Brewed, Cold Brew, Tea, Food, Merchandise) | |
| `price` | decimal (USD) | |
| `origin` | string | |
| `isOrganic` | boolean | |

`isOrganic` 플래그는 boolean입니다. 이후 필터링과 컴플라이언스 쿼리에 유용합니다.

## 관계로 연결하기

엔티티만 있으면 그저 고립된 테이블일 뿐입니다. **관계**가 이들을 그래프로 만듭니다.

- **places** — `Customer` → `Order` (one-to-many)
  각 고객은 여러 주문을 낼 수 있지만, 각 주문은 한 명의 고객에게 속합니다.

- **contains** — `Order` → `Product` (many-to-many)
  주문에는 여러 상품이 들어갈 수 있고, 상품도 여러 주문에 등장할 수 있습니다.

## 지금까지의 그래프

<ontology-embed id="official/cosmic-coffee-step-1" height="350px"></ontology-embed>

*세 개의 엔티티, 두 개의 관계. 이후 모든 것이 이 위에 세워집니다.*

## 배운 것

- 모든 엔티티에는 유일한 키인 **식별자 속성**이 필요합니다
- **enum 속성**은 값을 유효한 옵션으로 제한합니다
- **boolean 속성**은 간단한 필터링을 가능하게 합니다
- **카디널리티**(one-to-many vs many-to-many)가 엔티티가 어떻게 관계 맺는지 결정합니다

```quiz
Q: Order와 Product 사이의 "contains" 관계를 one-to-many가 아닌 many-to-many로 설정한 이유는?
- 각 주문은 상품 하나만 가질 수 있어서
- 상품은 한 번에 하나의 주문에만 담길 수 있어서
- 주문은 여러 상품을 담을 수 있고, 상품도 여러 주문에 등장할 수 있어서 [correct]
- Many-to-many가 언제나 기본 관계 타입이라서
> 주문 하나에는 대개 여러 상품(라떼, 머핀, 원두 봉지 등)이 담기고, 각 상품도 여러 주문에 반복해서 등장합니다. 이 양방향 다중성 때문에 many-to-many가 필요합니다.
```

다음에는 주문이 처리되는 장소를 추적하기 위해 Store를 추가합니다.
