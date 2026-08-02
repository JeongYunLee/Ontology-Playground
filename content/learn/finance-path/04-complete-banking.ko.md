---
title: "완성된 뱅킹 모델"
description: "Loan과 Investment를 추가해 뱅킹 온톨로지를 완성합니다. 여신 상품과 포트폴리오 보유를 연결합니다."
---

## 금융 상품

기본 계좌와 거래를 넘어 은행은 두 가지 주요 상품 범주를 제공합니다.

- **Loan** — 은행이 자금을 빌려 주는 여신 상품
- **Investment** — 고객이 자산을 불리는 보유 자산

이들을 추가하면 그림이 완성되고 흥미로운 다중 경로 관계가 만들어집니다.

## Loan

| 속성 | 타입 | 식별자? |
|---|---|---|
| `loanId` | string | ✓ |
| `principal` | decimal (USD) | |
| `apr` | decimal (%) | |
| `term` | integer (개월) | |
| `status` | string | |

`term`은 개월 단위로 측정된 integer입니다. 기간 속성에서 흔한 패턴이죠. `apr`(연이자율, Annual Percentage Rate)은 백분율 단위를 씁니다.

## Investment

| 속성 | 타입 | 식별자? |
|---|---|---|
| `holdingId` | string | ✓ |
| `symbol` | string | |
| `shares` | decimal | |
| `purchasePrice` | decimal (USD) | |
| `currentValue` | decimal (USD) | |

`symbol` 속성(예: MSFT, AAPL)이 종목을 식별합니다. `purchasePrice`와 `currentValue`를 모두 가지면 손익 계산이 가능합니다.

## 새 관계

네 개의 관계가 금융 상품을 연결합니다.

- **has_loan** — `Customer` → `Loan` (one-to-many)
  한 고객이 여러 대출을 가질 수 있습니다.

- **funds** — `Account` → `Loan` (one-to-many)
  대출 상환의 자금 출처가 되는 계좌.

- **holds** — `Customer` → `Investment` (one-to-many)
  고객의 투자 포트폴리오.

- **linked_to** — `Account` → `Investment` (one-to-many)
  투자 보유와 연결된 증권 계좌.

> **다중 경로 패턴:** Investment는 Customer와 *두* 가지 다른 경로로 연결됩니다. 직접적으로는 `holds`, 간접적으로는 `Account → linked_to`. 이 이중성은 의도적입니다. 소유(누가 보유하나?)와 자금(어느 계좌가 지원하나?)을 함께 모델링합니다.

## 완성된 그래프

<ontology-embed id="official/finance-step-3" diff="official/finance-step-2" height="500px"></ontology-embed>

*완성된 뱅킹 & 파이낸스 온톨로지: 5개 엔티티, 6개 관계. Loan과 Investment는 Customer와 Account 모두를 통해 연결됩니다.*

## 완성된 모델이 가능하게 하는 것

| 질문 | 그래프 경로 |
|---|---|
| 고위험 고객 중 큰 대출을 가진 사람은? | Customer (riskProfile=high) → Loan (principal > 100K) |
| 상위 고객의 포트폴리오 가치는? | Customer → Investment (currentValue 합계) |
| 대출과 투자 모두를 지원하는 계좌는? | Account → Loan AND Account → Investment |
| 투자 수익이 대출 비용을 웃도는 고객은? | Customer → Investment (currentValue) vs Customer → Loan (principal × apr) |

## GQL 쿼리 예시

투자 포트폴리오가 총 대출 원금을 초과하는 고객 찾기:

```gql
MATCH (c:Customer)-[:holds]->(inv:Investment),
      (c)-[:has_loan]->(loan:Loan)
WITH c, SUM(inv.currentValue) AS portfolio, SUM(loan.principal) AS debt
WHERE portfolio > debt
RETURN c.name, portfolio, debt
```

## 지금까지 만든 것

| 단계 | 추가된 엔티티 | 누적 | 핵심 개념 |
|---|---|---|---|
| 1 | Customer, Account | 2 | 소유, 금융 식별자 |
| 2 | Transaction | 3 | 활동 추적, datetime 정밀도 |
| 3 | Loan, Investment | 5 | 금융 상품, 다중 경로 관계 |

## 핵심 정리

1. **소유 체인**(Customer → Account → Transaction)은 컴플라이언스 질의를 가능하게 합니다
2. **datetime 정밀도**는 금융 데이터에서 결정적입니다
3. **다중 경로 관계**는 같은 연결의 서로 다른 측면을 모델링합니다
4. **기간 속성**(term in months)은 단위가 있는 integer를 씁니다
5. 금융 온톨로지는 데이터 모양을 기술합니다. 민감 데이터는 원본 시스템에 남습니다

```quiz
Q: Investment가 "holds"로 Customer와, "linked_to"로 Account와 모두 연결된 이유는?
- 실수 — 관계 하나면 충분함
- 각 관계가 다른 측면(소유 vs 자금 출처)을 모델링해서 [correct]
- Investment는 유효하려면 관계가 최소 두 개 필요해서
- one-to-many 관계는 항상 쌍으로 오기 때문에
> "holds"는 "누가 이 투자를 보유하나?"에 답하고, "linked_to"는 "어느 계좌가 이걸 지원하나?"에 답합니다. 다른 질문이며 답이 다를 수 있습니다(예: 공동 계좌가 한 사람의 투자를 지원하는 경우).
```

뱅킹 & 파이낸스 학습 경로를 완주하셨습니다! [카탈로그](#/catalogue)에서 각 단계를 불러와 대화식으로 탐색해 보세요.
