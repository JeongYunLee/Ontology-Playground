---
title: "고객 & 계좌"
description: "뱅킹의 기초 Customer와 Account를 소유 관계와 금융 속성과 함께 정의합니다."
---

## 뱅킹의 기초

모든 금융 기관은 두 개의 핵심 개념에서 시작합니다.

- **Customer** — 누가 계좌를 보유하는가?
- **Account** — 돈이 어디에 저장되고 관리되는가?

이 짝이 어떤 뱅킹 온톨로지에서도 기초를 이룹니다. 이후 모든 금융 상품은 이들을 통해 연결됩니다.

## 엔티티 정의

### Customer

| 속성 | 타입 | 식별자? |
|---|---|---|
| `customerId` | string | ✓ |
| `name` | string | |
| `ssn` | string | |
| `creditScore` | integer | |
| `riskProfile` | string | |

`creditScore`는 대출 심사에 쓰이는 integer(300~850)입니다. `riskProfile` 속성은 컴플라이언스와 모니터링을 위한 은행의 평가를 담습니다.

> **민감 데이터 노트:** `ssn` 같은 속성은 온톨로지에 메타데이터로 나타납니다. 어떤 데이터가 *존재하는지* 기술하는 것이지, 실제 값이 아닙니다. 온톨로지는 스키마이지 데이터베이스가 아닙니다.

### Account

| 속성 | 타입 | 식별자? |
|---|---|---|
| `accountNumber` | string | ✓ |
| `type` | string | |
| `balance` | decimal (USD) | |
| `interestRate` | decimal (%) | |
| `openDate` | date | |

`type` 속성은 당좌·저축·증권 계좌를 구분합니다. `interestRate`는 백분율 단위를 씁니다.

## 소유 관계

- **owns** — `Customer` → `Account` (one-to-many)
  한 고객이 여러 계좌(당좌, 저축, 증권)를 보유할 수 있지만, 각 계좌는 한 고객에게 속합니다.

## 지금까지의 그래프

<ontology-embed id="official/finance-step-1" height="300px"></ontology-embed>

*Customer와 Account가 소유 관계로 연결됩니다. 단순하지만 기초적입니다.*

## 배운 것

- **integer 속성**은 점수와 등급에 적합합니다 (creditScore)
- **퍼센트 단위**(%)는 요율 기반 속성을 나타냅니다
- **owns** 관계가 근본적인 소유 체인을 만듭니다
- 온톨로지는 데이터 자체가 아니라 데이터의 *모양*을 기술합니다. SSN 같은 민감 필드도 메타데이터일 뿐입니다

```quiz
Q: creditScore를 string이 아닌 integer로 모델링하는 이유는?
- 문자열은 DB에 저장하기 어려워서
- integer 타입은 숫자 비교와 범위 질의(예: creditScore > 700)를 가능하게 해서 [correct]
- 신용 점수는 항상 정확히 세 자리여서
- integer가 저장 공간을 덜 쓴다고 해서
> integer 타입을 사용하면 온톨로지는 creditScore가 숫자 연산(비교, 범위, 평균, 임계값 등)을 지원한다는 신호를 줍니다. string 속성은 이런 능력을 쿼리 엔진에 전달하지 못합니다.
```

다음에는 계좌 활동을 추적할 Transaction을 추가합니다.
