---
title: "시나리오 개요"
description: "FIBO는 무엇이고, 어디서 왔으며, 이 랩에서 무엇을 만들지."
reviewStatus: under-human-review
---

## FIBO란 무엇인가?

**Financial Industry Business Ontology** (FIBO)는 [EDM Council](https://edmcouncil.org/)과 [Object Management Group](https://www.omg.org/) (OMG)이 개발한 업계 표준 온톨로지 패밀리입니다. 금융 상품, 당사자, 계약, 규제 개념에 대한 형식적이고 기계 판독 가능한 어휘를 제공합니다.

FIBO는 다음과 같습니다.

- [MIT License](https://opensource.org/licenses/MIT)로 **오픈 소스**
- [edmcouncil/fibo](https://github.com/edmcouncil/fibo)에서 **GitHub 호스팅**
- [spec.edmcouncil.org/fibo](https://spec.edmcouncil.org/fibo/)에서 **OWL 온톨로지로 발행**
- 주요 금융 기관, 규제 기관, 표준 단체의 기여로 **2012년부터 개발**

> **출처**: 이 랩의 개념은 주로 `LOAN/LoansGeneral/Loans`에서 적응되었으며, 보조 개념은 `FBC/DebtAndEquities/Debt`, `FBC/ProductsAndServices/ClientsAndAccounts`, `FND/OwnershipAndControl/Ownership`에서 왔습니다. 전체 소스 모듈은 [FIBO GitHub 저장소](https://github.com/edmcouncil/fibo)를 참고하세요.

## 왜 이 랩인가

FIBO는 방대합니다 — 증권, 파생상품, 기업 활동, 지수 등을 아우르는 수백 개의 온톨로지 모듈이 있습니다. `LOAN` 도메인만 해도 여러 하위 모듈에 걸쳐 있습니다.

| FIBO 모듈 | 다루는 내용 |
|---|---|
| `LOAN/LoansGeneral/Loans` | 대출 생애주기 개념 (대출, 서비싱, 지급 이력, 담보권 및 소유권 분류) |
| `FBC/DebtAndEquities/Debt` | 차입자/대출자 역할, 담보, 담보 계약, 부채 조건 |
| `FBC/ProductsAndServices/ClientsAndAccounts` | 거래 기록과 지급 이력에서 사용하는 개별 거래 |
| `LOAN/RealEstateLoans/Mortgages` | 부동산 특화 제약 (실질 자산 담보와 모기지 구조) |
| `FND/OwnershipAndControl/Ownership` | 대출 소유 분류에서 재사용되는 소유 시맨틱 |

*(출처: [FIBO 온톨로지 구조](https://github.com/edmcouncil/fibo/tree/master/LOAN))*

이 랩은 대출 계약과 지급 흐름에 초점을 맞춘 교육용 하위 집합을 추출합니다. 전체 모듈 계층을 탐색하지 않고도 FIBO 모델링 패턴을 배울 수 있게요.

## 무엇을 만들까

네 개의 점진적 단계에 걸쳐 10개 엔티티 타입과 10개 관계로 **대출 온톨로지**를 모델링합니다.

1. **핵심 대출 삼각형** — `Loan`, `Borrower`, `Lender`
2. **담보 & 지급 스케줄** — `Collateral`, `LoanPaymentSchedule`
3. **서비싱 & 지급 이력** — `Servicer`, `PaymentHistory`, `PaymentTransaction`
4. **리스크 분류** — `OwnershipInterest`, `LenderLienPosition`

## 이 모델이 지원하는 실제 질문

- 담보가 있는 대출 중 후순위 담보권을 가진 것은?
- 원금 임계값을 초과하는 이자만 지급하는 대출을 가진 차입자는?
- 서비서별 지급 거래 패턴은 어떻게 다른가?
- 상환 문제와 상관관계가 있는 소유 구조는?

## 라이선싱과 저작자 표시

이 랩은 EDM Council FIBO 온톨로지에서 적응되었습니다.

- **저작권**: EDM Council, Inc. and Object Management Group, Inc. (정확한 연도 범위는 모듈 헤더 참고)
- **라이선스**: [MIT License](https://opensource.org/licenses/MIT)
- **소스 저장소**: [github.com/edmcouncil/fibo](https://github.com/edmcouncil/fibo)
- **명세**: [spec.edmcouncil.org/fibo](https://spec.edmcouncil.org/fibo/)

이 랩의 온톨로지 파일은 교실 친화적으로 단순화된 적응본입니다. 핵심 FIBO 시맨틱은 보존하되 단계별 교육을 위해 복잡성을 줄였습니다.

```quiz
Q: FIBO를 개발하고 유지하는 조직은?
- 세계은행
- EDM Council과 Object Management Group (OMG) [correct]
- 유럽중앙은행
- W3C Web Ontology Working Group
> FIBO는 EDM Council(Enterprise Data Management Council)이 Object Management Group과 협력해 개발합니다. MIT License로 오픈 소스이며 edmcouncil/fibo에 GitHub 호스팅됩니다.
```
