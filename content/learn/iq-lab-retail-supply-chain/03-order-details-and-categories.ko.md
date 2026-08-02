---
title: "주문 상세 & 카테고리"
description: "Order와 Product 사이의 연결 엔티티로 OrderLine을 추가하고, 그룹핑을 위한 ProductCategory를 도입합니다."
---

## many-to-many의 문제

1단계에서 Order를 Product에 many-to-many 관계로 직접 연결했습니다. "이 주문에 어떤 상품들이 있었나?" 같은 단순 질의에는 잘 작동하지만, **수량**과 **라인 총액**은 어떡할까요?

직접적인 many-to-many 관계는 속성을 실을 수 없습니다. 고객 A가 상품 X를 3개 주문하고 고객 B가 1개 주문했다면 수량은 어디에 저장할까요? Order에도(주문에는 여러 상품이 있음), Product에도(상품은 여러 주문에 등장) 실을 수 없습니다.

## 연결 엔티티 패턴

해결책은 **연결 엔티티** — 두 엔티티 사이에 앉아 개별 연관의 속성을 담는 엔티티 타입입니다.

**OrderLine**이 Order와 Product를 이으며 다음을 담습니다.

| 속성 | 타입 | 식별자? |
|---|---|---|
| `orderLineId` | string | ✓ |
| `quantity` | integer | |
| `lineTotal` | decimal (USD) | |

### 새 관계

- **OrderHasLineItem** — `Order` → `OrderLine` (one-to-many)
  각 주문은 하나 이상의 라인 아이템을 가집니다.

- **OrderLineReferencesProduct** — `OrderLine` → `Product` (many-to-one)
  각 라인 아이템은 정확히 하나의 상품을 참조합니다.

이제 순회는 이렇게 됩니다. `Order` → `OrderLine` → `Product`. 각 라인 아이템이 자체 `quantity`와 `lineTotal`을 지닙니다.

> **설계 패턴:** many-to-many 관계에 속성(수량, 가격, 날짜)이 필요할 때마다 연결 엔티티를 도입하세요. 이는 관계형 DB의 연관 테이블에 해당하는 온톨로지 개념입니다.

## 카테고리로 조직

상품은 고립되어 존재하는 경우가 드뭅니다. "냉동식품", "생활용품", "전자제품" 같은 **카테고리**에 속합니다. ProductCategory 엔티티를 추가하면 상품을 그룹핑하고 "반품이 가장 많은 카테고리는?" 같은 질문에 답할 수 있습니다.

**ProductCategory**:

| 속성 | 타입 | 식별자? |
|---|---|---|
| `categoryId` | string | ✓ |
| `categoryName` | string | |

### 새 관계

- **ProductInCategory** — `Product` → `ProductCategory` (many-to-one)
  각 상품은 정확히 하나의 카테고리에 속합니다.

## 2단계 그래프

<ontology-embed id="official/iq-lab-retail-step-2" diff="official/iq-lab-retail-step-1" height="400px"></ontology-embed>

*5개 엔티티 타입이 5개 관계로 연결됩니다. OrderLine이 Order와 Product의 다리 역할을 하며 수량 데이터를 담습니다. ProductCategory가 상품을 그룹핑합니다.*

## 배운 것

- **연결 엔티티**는 many-to-many 속성 문제를 해결합니다
- 관계가 자체 데이터를 필요로 할 때 엔티티로 모델링합니다
- **계층**(Product → ProductCategory)은 롤업 질의를 가능하게 합니다
- 그래프가 자라고 있습니다. 새 엔티티마다 기존 엔티티와 연결됩니다

```quiz
Q: 직접 관계 대신 연결 엔티티(OrderLine 같은)를 언제 도입해야 할까요?
- 엔티티 타입이 세 개보다 많을 때
- 두 엔티티 사이 관계가 자체 속성을 필요로 할 때 [correct]
- 두 엔티티 타입이 모두 식별자 속성을 가질 때
- 엔티티가 서로 다른 네임스페이스에 있을 때
> many-to-many 관계가 수량이나 라인 총액 같은 자체 데이터를 담아야 할 때 연결 엔티티가 필요합니다. 직접 관계는 속성을 실을 수 없습니다.
```

다음에는 Region과 Store로 지리 구조를 추가합니다.
