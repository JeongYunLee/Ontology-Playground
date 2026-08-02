---
title: "장바구니"
description: "활성 쇼핑 세션을 모델링하기 위해 Shopping-Cart를 추가하고 one-to-one 관계 패턴을 소개합니다."
---

## 구매 이전

모든 브라우징 세션이 구매로 이어지지는 않습니다. **장바구니**는 결제 전에 구매자가 고민하고 있는 것을 담습니다. 일시적이고 변경 가능한 세션 엔티티입니다.

장바구니를 추가하면 이런 질문에 답할 수 있습니다.

- "이번 주 방치된 장바구니는 얼마나 되나?"
- "평균 장바구니 금액 vs 평균 주문 금액은?"
- "장바구니에는 자주 담기지만 구매로는 이어지지 않는 상품은?"

## Shopping-Cart 엔티티

| 속성 | 타입 | 식별자? |
|---|---|---|
| `cartId` | string | ✓ |
| `createdAt` | datetime | |
| `itemCount` | integer | |
| `subtotal` | decimal (USD) | |

`itemCount`와 `subtotal`은 비정규화된 요약 속성입니다. 장바구니 내용에서 계산할 수도 있지만, 직접 저장해 두면 쿼리가 빨라집니다.

## 새 관계

- **has_cart** — `Buyer` → `Shopping-Cart` (one-to-one)
  각 구매자는 정확히 하나의 활성 장바구니를 가지고, 각 장바구니는 정확히 한 명의 구매자에 속합니다.

- **contains** — `Shopping-Cart` → `Product` (many-to-many)
  장바구니에는 여러 상품이 담길 수 있고, 하나의 상품도 여러 장바구니에 담길 수 있습니다.

> **one-to-one 패턴:** `has_cart` 관계는 각 구매자가 하나의 활성 쇼핑 세션만 갖기 때문에 one-to-one입니다. 시간이 지나며 여러 개가 쌓이는 주문(one-to-many)과 달리, 장바구니는 특정 시점에 하나만 존재합니다.

## 성장하는 그래프

<ontology-embed id="official/ecommerce-step-2" diff="official/ecommerce-step-1" height="400px"></ontology-embed>

*Shopping-Cart가 두 개의 새 관계로 Buyer와 Product를 연결합니다. diff는 Step 1 이후 무엇이 바뀌었는지 강조합니다.*

## 배운 것

- **세션 엔티티**는 일시적이거나 진행 중인 상태를 모델링합니다 (장바구니, 초안, 세션)
- **one-to-one 관계**는 엄격한 짝을 강제합니다 (한 구매자 ↔ 하나의 장바구니)
- **비정규화 속성**(itemCount, subtotal)은 저장 공간을 쿼리 속도와 맞바꿉니다
- 장바구니 분석으로 **전환 퍼널** 인사이트(장바구니 → 주문 비율)를 얻습니다

```quiz
Q: Buyer와 Shopping-Cart 사이의 has_cart 관계가 one-to-many가 아닌 one-to-one인 이유는?
- 장바구니는 유일한 식별자가 필요하지 않아서
- 각 구매자는 특정 시점에 정확히 하나의 활성 장바구니만 가져서 [correct]
- one-to-one이 구현이 더 단순해서
- 장바구니는 구매 후 삭제되어서
> 구매자는 어느 시점에도 하나의 활성 쇼핑 세션(장바구니)만 유지합니다. 생애 동안 쌓이는 주문과 달리 장바구니는 현재 상태 엔티티입니다. 한 구매자, 하나의 활성 장바구니.
```

다음에는 고객 리뷰로 플랫폼을 완성합니다.
