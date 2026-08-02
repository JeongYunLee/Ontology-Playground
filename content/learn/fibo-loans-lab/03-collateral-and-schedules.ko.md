---
title: "담보와 스케줄"
description: "FIBO의 담보와 지급 스케줄 개념으로 담보 계약과 상환 케이던스를 추가합니다."
reviewStatus: under-human-review
---

## 계약에서 구조로

대출은 FIBO의 두 개념을 추가하면 운영적으로 의미 있어집니다.

- **Collateral** — 상환을 담보하는 것 ([FBC/DebtAndEquities/Debt](https://github.com/edmcouncil/fibo/tree/master/FBC/DebtAndEquities/Debt)의 `fibo-fbc-dae-dbt:Collateral`에서 적응)
- **LoanPaymentSchedule** — 시간에 걸쳐 어떻게 상환이 기대되는지 ([LOAN/LoansGeneral/Loans](https://github.com/edmcouncil/fibo/tree/master/LOAN/LoansGeneral/Loans)의 `fibo-loan-ln-ln:LoanPaymentSchedule`에서 적응)

이들은 FIBO의 두 핵심 관심사를 담습니다. **담보 계약**과 **시간적 의무**.

## 새 속성

### Collateral

| 속성 | 타입 | 노트 |
|---|---|---|
| `assetType` | string | 식별자 — 자산 유형 (예: "부동산", "차량", "증권") |
| `appraisedValue` | decimal (USD) | 감정 시점의 시장 가치 |

> **FIBO 참조**: 전체 온톨로지에서 부채 담보는 `fibo-fbc-dae-dbt:Collateral`로 모델링되며, 물리적·비물리적 담보 자산 모두를 대표할 수 있습니다. FIBO Mortgages 모듈([LOAN/RealEstateLoans/Mortgages](https://github.com/edmcouncil/fibo/tree/master/LOAN/RealEstateLoans/Mortgages))에서 `LoanSecuredByRealEstate`는 담보를 `fibo-fnd-plc-rp:RealProperty`로 제약하고 `owl:Restriction` 블록을 통해 `SecurityAgreement`와 연결됩니다.

### LoanPaymentSchedule

| 속성 | 타입 | 노트 |
|---|---|---|
| `scheduleId` | string | 식별자 |
| `expectedPayments` | integer | 예상 지급 기간 수 |

## 새 관계

- **securedBy**: `Loan` → `Collateral` (`one-to-many`) — 하나의 대출이 여러 자산으로 담보될 수 있음
- **repaidBySchedule**: `Loan` → `LoanPaymentSchedule` (`one-to-one`) — 각 대출은 하나의 주 상환 스케줄을 가짐

## 2단계 그래프 (1단계 대비 차이)

<ontology-embed id="official/fibo-loans-step-2" diff="official/fibo-loans-step-1" height="380px"></ontology-embed>

*새 엔티티가 강조 표시됩니다. Collateral과 LoanPaymentSchedule이 담보와 시간 구조로 대출 모델을 확장합니다.*

```quiz
Q: FIBO에서 Collateral 개념은 어디서 유래하나요?
- LOAN/LoansGeneral/Loans
- FBC/DebtAndEquities/Debt [correct]
- FND/Agreements/Contracts
- FND/Places/RealProperty
> Collateral은 FIBO의 FBC(Financial Business and Commerce) 도메인 아래 DebtAndEquities/Debt에서 정의됩니다. 상환 의무를 담보하기 위해 담보로 잡힌 자산을 나타내며, 모기지에 국한되지 않고 모든 담보 대출 유형에 공유되는 개념입니다.
```
