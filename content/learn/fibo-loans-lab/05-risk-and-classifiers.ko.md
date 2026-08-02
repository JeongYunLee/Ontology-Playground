---
title: "리스크와 분류"
description: "심사와 담보 리스크 분석을 뒷받침하기 위해 FIBO 소유권과 담보권 분류를 추가합니다."
reviewStatus: under-human-review
---

## 분류 계층

FIBO는 명시적 분류자에 크게 의존합니다 — 다른 엔티티를 범주화하는 것이 주된 역할인 엔티티들입니다. 이 마지막 단계에서 모기지와 담보 대출 리스크 분석에 결정적인 두 개념을 추가합니다.

- **OwnershipInterest** — 담보의 법적 소유 유형을 분류 ([LOAN/LoansGeneral/Loans](https://github.com/edmcouncil/fibo/tree/master/LOAN/LoansGeneral/Loans)의 `fibo-loan-ln-ln:OwnershipInterest`에서 적응, `fibo-fnd-oac-own:Ownership`에 근거)
- **LenderLienPosition** — 담보 자산에 대한 대출자 청구 우선순위를 분류 ([LOAN/LoansGeneral/Loans](https://github.com/edmcouncil/fibo/tree/master/LOAN/LoansGeneral/Loans)의 `fibo-loan-ln-ln:LenderLienPosition`에서 적응)

## 분류자가 왜 중요한가

FIBO Mortgages 모듈([LOAN/RealEstateLoans/Mortgages](https://github.com/edmcouncil/fibo/tree/master/LOAN/RealEstateLoans/Mortgages))에서 담보권 위치는 담보 실행에서 회수 우선순위를 결정합니다. 1순위 모기지는 후순위 담보권보다 회수 기대치가 강하며, 이는 다음에 직접 영향을 미칩니다.

- 신용 리스크 모델링
- 부도 시 손실(Loss-given-default) 추정
- 포트폴리오 리스크 집계
- 규제 자본 계산

> **FIBO 참조**: FIBO Mortgages 온톨로지는 `owl:Restriction` 블록을 사용해 부동산 담보와 계약 시맨틱을 제약합니다. LOAN 온톨로지에서 `SecurityAgreement`와 `Loan`은 `LenderLienPosition`과 `OwnershipInterest` 같은 분류자 사용으로 더 제약됩니다. [LOAN/RealEstateLoans/Mortgages.rdf](https://github.com/edmcouncil/fibo/blob/master/LOAN/RealEstateLoans/Mortgages.rdf)와 [LOAN/LoansGeneral/Loans.rdf](https://github.com/edmcouncil/fibo/blob/master/LOAN/LoansGeneral/Loans.rdf)를 참고하세요.

## 새 관계

- **classifiesCollateralOwnership**: `OwnershipInterest` → `Collateral` (`one-to-many`)
- **hasLienPosition**: `Collateral` → `LenderLienPosition` (`many-to-one`)

## 4단계 그래프 (3단계 대비 차이)

<ontology-embed id="official/fibo-loans-step-4" diff="official/fibo-loans-step-3" height="460px"></ontology-embed>

*두 개의 분류자 엔티티(OwnershipInterest와 LenderLienPosition)가 리스크와 심사 시맨틱으로 모델을 완성합니다.*

## 완성된 적응 모델

동일한 FIBO 소스 개념에서 만든 전체 외부 하위 집합도 살펴볼 수 있습니다.

<ontology-embed id="external/fibo/loans-general" height="420px"></ontology-embed>

## 지금까지 만든 것

이제 다음을 아우르는 점진적 FIBO 기반 대출 온톨로지가 있습니다.

| 계층 | 엔티티 | FIBO 소스 모듈 |
|---|---|---|
| 계약 액터 | Loan, Borrower, Lender | [LOAN/LoansGeneral/Loans](https://github.com/edmcouncil/fibo/tree/master/LOAN/LoansGeneral/Loans) |
| 담보 & 스케줄 | Collateral, LoanPaymentSchedule | [FBC/DebtAndEquities/Debt](https://github.com/edmcouncil/fibo/tree/master/FBC/DebtAndEquities/Debt) |
| 서비싱 운영 | Servicer, PaymentHistory, PaymentTransaction | [LOAN/LoansGeneral/Loans](https://github.com/edmcouncil/fibo/tree/master/LOAN/LoansGeneral/Loans) + [FBC/ProductsAndServices/ClientsAndAccounts](https://github.com/edmcouncil/fibo/tree/master/FBC/ProductsAndServices/ClientsAndAccounts) |
| 리스크 분류 | OwnershipInterest, LenderLienPosition | [LOAN/LoansGeneral/Loans](https://github.com/edmcouncil/fibo/tree/master/LOAN/LoansGeneral/Loans) + [FND/OwnershipAndControl/Ownership](https://github.com/edmcouncil/fibo/tree/master/FND/OwnershipAndControl) |

도메인 특화 모듈로 확장하기에 튼튼한 기초입니다 — 모기지 유형, HELOC 상품, 자동차 대출, 소상공인 대출 등.

## 더 읽을거리

- **FIBO GitHub**: [github.com/edmcouncil/fibo](https://github.com/edmcouncil/fibo)
- **FIBO 명세**: [spec.edmcouncil.org/fibo](https://spec.edmcouncil.org/fibo/)
- **EDM Council**: [edmcouncil.org](https://edmcouncil.org/)
- **FIBO Loans 모듈**: [LOAN/LoansGeneral/Loans 소스](https://github.com/edmcouncil/fibo/tree/master/LOAN/LoansGeneral/Loans)
- **FIBO Mortgages 모듈**: [LOAN/RealEstateLoans/Mortgages 소스](https://github.com/edmcouncil/fibo/tree/master/LOAN/RealEstateLoans/Mortgages)
- **FIBO Debt 모듈**: [FBC/DebtAndEquities/Debt 소스](https://github.com/edmcouncil/fibo/tree/master/FBC/DebtAndEquities/Debt)
- **FIBO Clients and Accounts 모듈**: [FBC/ProductsAndServices/ClientsAndAccounts 소스](https://github.com/edmcouncil/fibo/tree/master/FBC/ProductsAndServices/ClientsAndAccounts)

## 라이선싱

이 랩에서 참조된 모든 FIBO 온톨로지 콘텐츠는 다음과 같습니다.

- **저작권** EDM Council, Inc. and Object Management Group, Inc. (정확한 연도 범위는 모듈 헤더 참고)
- [MIT License](https://opensource.org/licenses/MIT) **라이선스 하에 배포**

MIT License는 저작권 고지를 유지하면 상업용을 포함해 온톨로지 파일의 사용·수정·재배포를 허용합니다. 이 랩의 온톨로지 파일은 교육 목적으로 만든 적응 하위 집합입니다.

```quiz
Q: 담보 모델에 LenderLienPosition을 추가하는 주된 가치는?
- 차입자 정보의 필요를 대체한다
- 대출자 청구의 우선순위를 담아 신용 리스크와 손실 모델링의 핵심이 된다 [correct]
- 지급 타임스탬프를 저장한다
- 대출 이자율을 자동 결정한다
> 담보권 위치는 청구 우선순위(예: 1순위 담보권 vs 후순위 담보권)를 담으며, 이는 담보 실행에서 회수 기대치에 직접 영향을 미칩니다. 심사, 포트폴리오 리스크 모델, 규제 자본 계산에 결정적입니다 — FIBO 부채·자본 모듈의 핵심 개념입니다.
```
