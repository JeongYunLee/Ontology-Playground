---
title: "서비싱과 지급 이력"
description: "FIBO 서비싱 조직과 감사 가능한 지급 이벤트로 모델을 확장합니다."
reviewStatus: under-human-review
---

## 운영 생애주기

기원 이후 대출은 서비싱 운영에 진입합니다. FIBO는 이 전환을 두 모듈에 걸쳐 모델링합니다.

- **Servicer** — 지급을 수취하고 처리하는 조직 ([LOAN/LoansGeneral/Loans](https://github.com/edmcouncil/fibo/tree/master/LOAN/LoansGeneral/Loans)의 `fibo-loan-ln-ln:Servicer`에서 적응)
- **PaymentHistory** — 지급의 집계 기록 ([LOAN/LoansGeneral/Loans](https://github.com/edmcouncil/fibo/tree/master/LOAN/LoansGeneral/Loans)의 `fibo-loan-ln-ln:PaymentHistory`에서 적응, [FBC/ProductsAndServices/ClientsAndAccounts](https://github.com/edmcouncil/fibo/tree/master/FBC/ProductsAndServices/ClientsAndAccounts)의 거래 기록 패턴을 확장)
- **PaymentTransaction** — 원자적 지급 이벤트 (`fibo-loan-ln-ln:IndividualPaymentTransaction`에서 적응, 이는 `fibo-fbc-pas-caa:IndividualTransaction`에 기반)

이는 실제 대출 플랫폼이 계약적 의도와 실행 로그를 어떻게 분리하는지 반영합니다.

## 새 속성

### Servicer

| 속성 | 타입 | 노트 |
|---|---|---|
| `servicerId` | string | 식별자 |
| `organizationName` | string | 서비싱 조직 이름 |

### PaymentHistory

| 속성 | 타입 | 노트 |
|---|---|---|
| `paymentHistoryId` | string | 식별자 |

### PaymentTransaction

| 속성 | 타입 | 노트 |
|---|---|---|
| `paymentTransactionId` | string | 식별자 |
| `amount` | decimal (USD) | 지급 금액 |
| `postedAt` | datetime | 지급이 기록된 시점 |

## 새 관계

- **servicedBy**: `Loan` → `Servicer` (`many-to-one`) — 여러 대출을 한 조직이 서비싱할 수 있음
- **hasPaymentHistory**: `LoanPaymentSchedule` → `PaymentHistory` (`one-to-one`) — 예정된 기대치와 실제 기록을 연결
- **hasIndividualPayment**: `PaymentHistory` → `PaymentTransaction` (`one-to-many`) — 각 이력은 여러 거래 이벤트를 담음

## 감사 이력

이 링크들로 모델을 통한 명확한 경로를 추적할 수 있습니다.

`Loan` → `LoanPaymentSchedule` → `PaymentHistory` → `PaymentTransaction`

이 경로가 감사 질의, 연체 분석, 서비싱 품질 지표를 뒷받침합니다 — 정확히 온톨로지 기반 데이터 통합을 가치 있게 만드는 그래프 순회입니다.

> **FIBO 참조**: 프로덕션 FIBO에서 대출 서비싱과 지급 이력 패턴은 LOAN과 FBC 모듈을 잇습니다. `Loan`은 대출 특화 계정과 관련되고, 지급 이력은 거래 기록으로 모델링되며, 개별 지급 거래는 이벤트 수준 팩트를 담습니다. 우리의 단순화된 모델은 이 핵심 패턴을 포착합니다. [LOAN/LoansGeneral/Loans](https://github.com/edmcouncil/fibo/tree/master/LOAN/LoansGeneral/Loans)와 [FBC/ProductsAndServices/ClientsAndAccounts](https://github.com/edmcouncil/fibo/tree/master/FBC/ProductsAndServices/ClientsAndAccounts)를 참고하세요.

## 3단계 그래프 (2단계 대비 차이)

<ontology-embed id="official/fibo-loans-step-3" diff="official/fibo-loans-step-2" height="420px"></ontology-embed>

*세 개의 새 엔티티(Servicer, PaymentHistory, PaymentTransaction)가 대출 생애주기 이벤트를 추적할 운영 계층을 만듭니다.*

```quiz
Q: amount와 postedAt 같은 원자적 지급 이벤트는 어느 엔티티에 담아야 할까요?
- Loan
- Servicer
- PaymentHistory
- PaymentTransaction [correct]
> PaymentHistory는 집계 컨테이너입니다. 원자적 이벤트는 PaymentTransaction에 속하며, 이 엔티티는 조정과 감사 이력에 사용되는 이벤트 수준 세부 정보를 저장합니다. 이 분리는 집계 기록과 개별 거래를 구분하는 FIBO 모델링 패턴을 따릅니다.
```
