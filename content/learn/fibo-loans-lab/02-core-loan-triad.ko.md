---
title: "핵심 대출 삼각형"
description: "FIBO의 근본적인 대출 삼각형 — Loan, Borrower, Lender — 를 속성과 관계로 모델링합니다."
reviewStatus: under-human-review
---

## 계약의 핵심

모든 대출 시스템은 FIBO 대출·부채 모듈의 세 핵심 개념에서 시작합니다.

- **Loan** — 부채 상품과 계약 봉투 (`LOAN/LoansGeneral/Loans`)
- **Borrower** — 상환 의무 당사자 역할 (`FBC/DebtAndEquities/Debt`)
- **Lender** — 자금을 조달하는 당사자 역할 (`FBC/DebtAndEquities/Debt`)

FIBO의 OWL 온톨로지에서 이들은 `fibo-loan-ln-ln:Loan`, `fibo-fbc-dae-dbt:Borrower`, `fibo-fbc-dae-dbt:Lender`로 모델링됩니다.
LOAN 모듈은 이 당사자-역할 개념을 대출 특화 용도로 임포트하고 제약합니다. 우리는 클래스 계층을 단순화하지만 핵심 시맨틱은 보존합니다.

## 주요 속성

### Loan

| 속성 | 타입 | 노트 |
|---|---|---|
| `loanId` | string | 식별자 |
| `principalAmount` | decimal (USD) | 최초 계약된 금액 |
| `isInterestOnly` | boolean | 초기 기간 동안 차입자가 이자만 지급하는지 여부 |

### Borrower

| 속성 | 타입 | 노트 |
|---|---|---|
| `borrowerId` | string | 식별자 |
| `name` | string | 당사자 이름 |
| `creditScore` | integer | 심사 지표 (예: FICO 점수) |

### Lender

| 속성 | 타입 | 노트 |
|---|---|---|
| `lenderId` | string | 식별자 |
| `name` | string | 조직 이름 |
| `lenderType` | string | 분류 (예: "은행", "신용조합", "모기지 회사") |

## 관계

FIBO는 대출 당사자 역할을 계약 객체에서 당사자로 향하는 관계로 모델링합니다.

- **owedBy**: `Loan` → `Borrower` (`many-to-one`) — 대출은 정확히 한 명의 차입자에게 지고 있으며, 차입자는 여러 대출을 가질 수 있음
- **originatedBy**: `Loan` → `Lender` (`many-to-one`) — 대출은 한 대출자에서 시작되지만, 대출자는 여러 대출을 시작할 수 있음

> **FIBO 참조**: 전체 FIBO 모델에서 차입자와 대출자는 부채·대출 온톨로지를 통해 사용되는 계약 당사자 역할 개념이며, 역할 시맨틱은 당사자와 계약 패턴에 근거를 둡니다. 우리는 명료함을 위해 단순화된 직접 엔티티 모델을 씁니다. [FBC Debt](https://github.com/edmcouncil/fibo/tree/master/FBC/DebtAndEquities/Debt), [LOAN LoansGeneral](https://github.com/edmcouncil/fibo/tree/master/LOAN/LoansGeneral/Loans), [FND Parties](https://github.com/edmcouncil/fibo/tree/master/FND/Parties)를 참고하세요.

## 1단계 그래프

<ontology-embed id="official/fibo-loans-step-1" height="340px"></ontology-embed>

*세 개의 엔티티와 두 개의 관계가 핵심 대출 삼각형을 이룹니다 — 모든 FIBO 대출 모델의 기초.*

```quiz
Q: 대출 상환 책임을 가장 잘 표현하는 관계는?
- Borrower → Loan (originatedBy)
- Loan → Borrower (owedBy) [correct]
- Lender → Loan (owedBy)
- Loan → Lender (hasCollateral)
> 이 모델에서 대출은 `owedBy`를 통해 차입자를 가리키므로 상환 의무가 계약 객체에서 명시적입니다. 이는 상품에서 당사자로 의무를 방향적으로 모델링하는 FIBO 패턴을 따릅니다.
```
