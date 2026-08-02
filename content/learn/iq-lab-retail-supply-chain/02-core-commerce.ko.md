---
title: "핵심 상거래"
description: "Customer, Order, Product를 정의합니다 — 어떤 리테일 온톨로지에서도 기초가 되는 세 엔티티 — 그리고 관계로 연결합니다."
---

## 기초

모든 리테일 시스템은 세 개의 핵심 개념에서 시작합니다.

- **Customer** — 누가 사는가?
- **Order** — 어떤 거래가 일어났는가?
- **Product** — 무엇이 팔렸는가?

이 세 엔티티 타입이 온톨로지의 심장을 이룹니다. 이후 단계에서 추가하는 모든 것은 이들로 이어집니다.

## 엔티티 타입 정의

각 엔티티 타입은 다음을 갖춰야 합니다.

1. **이름** — 단수형, 서술적 (예: `Customers`나 `tbl_cust`가 아닌 `Customer`)
2. **식별자 속성** — 각 인스턴스의 고유 키
3. **속성** — 각 인스턴스를 기술하는 속성들

### Customer

| 속성 | 타입 | 식별자? |
|---|---|---|
| `customerId` | string | ✓ |
| `name` | string | |
| `email` | string | |
| `loyaltyTier` | string | |
| `lifetimeValue` | decimal (USD) | |

`customerId`가 각 고객을 유일하게 식별합니다. `loyaltyTier`와 `lifetimeValue` 같은 속성은 소스 DB의 암호 같은 컬럼 이름에 매핑되지만, 비즈니스적으로 의미 있는 이름입니다.

### Order

| 속성 | 타입 | 식별자? |
|---|---|---|
| `orderId` | string | ✓ |
| `orderDate` | datetime | |
| `status` | string | |
| `totalAmount` | decimal (USD) | |

### Product

| 속성 | 타입 | 식별자? |
|---|---|---|
| `productId` | string | ✓ |
| `name` | string | |
| `unitCost` | decimal (USD) | |
| `discountPercent` | decimal (%) | |

## 관계로 연결

엔티티만으로는 그저 고립된 테이블입니다. **관계**가 이들을 연결된 그래프로 만듭니다.

- **OrderPlacedByCustomer** — `Order` → `Customer` (many-to-one)
  각 주문은 정확히 한 명의 고객이 발주하지만, 한 고객은 여러 주문을 낼 수 있습니다.

- **OrderContainsProduct** — `Order` → `Product` (many-to-many)
  주문에는 여러 상품이 담길 수 있고, 하나의 상품도 여러 주문에 등장할 수 있습니다.

### 카디널리티가 중요한 이유

카디널리티는 시스템에 어떻게 세고 집계할지를 알려 줍니다.

| 카디널리티 | 의미 | 예시 |
|---|---|---|
| one-to-one | 양쪽에 정확히 하나씩 | Employee → Badge |
| one-to-many | 한 부모, 여러 자식 | Customer → Orders |
| many-to-one | 여러 자식, 한 부모 | Orders → Customer |
| many-to-many | 제한 없음 | Orders ↔ Products |

올바른 카디널리티를 고르면 "고객마다 주문을 몇 개 냈나?" 같은 질의가 정확한 카운트를 반환합니다.

## 지금까지의 그래프

세 엔티티와 두 관계만으로도 이미 연결된 그래프가 생겼습니다.

<ontology-embed id="official/iq-lab-retail-step-1" height="350px"></ontology-embed>

*Customer, Order, Product가 두 관계로 연결됩니다. 이후 모든 것이 이 위에 세워집니다.*

## 배운 것

- 모든 엔티티 타입에는 식별자 속성이 필요합니다
- 내부 컬럼 이름이 아니라 비즈니스적으로 의미 있는 이름을 씁니다
- 관계는 데이터 집계 방식에 영향을 주는 카디널리티를 가집니다
- 세 엔티티만으로도 유용한 연결 그래프가 만들어집니다

```quiz
Q: 한 Customer가 여러 Order를 낼 수 있고, 각 Order는 하나의 Customer에 속합니다. 이 카디널리티는?
- one-to-one
- many-to-many
- one-to-many [correct]
- many-to-one
> Customer 관점에서 이건 one-to-many입니다. 한 고객이 여러 주문을 가질 수 있죠. Order 관점에서는 many-to-one입니다. 관계는 Customer → Order 방향으로 one-to-many 카디널리티로 정의됩니다.
```

다음에는 주문에 세부 정보를 더하고 상품을 카테고리로 조직합니다.
