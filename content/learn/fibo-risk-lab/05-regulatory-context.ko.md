---
title: "4단계: 규제 맥락"
description: "은행 규제, 집중 한도, 크로스 도메인 연결로 모델을 완성합니다."
reviewStatus: under-human-review
---

## 루프 닫기

첫 세 단계는 참조 데이터를 구축했습니다: 업종, 지리, 대출 분류. 이 마지막 단계에서 **규제 집행 계층** — 포트폴리오 집중을 제약하는 규제와 정량 한도 — 을 추가합니다.

여기서 온톨로지가 운영적으로 강력해집니다. 특정 대출에서 그 집중 카테고리를 거쳐 적용되는 규제 한도까지 추적할 수 있고, 각 한도를 어느 규제가 의무화하는지 알 수 있습니다.

## 새 엔티티 타입

### Regulation

은행 당국이 발행한 규제 프레임워크.

| 속성 | 타입 | 노트 |
|---|---|---|
| `regulationCode` | string | 식별자 (예: "OCC_CRE_2006") |
| `name` | string | 규제 이름 |
| `issuingAuthority` | string | 발행 주체 (OCC, FDIC, Basel Committee) |
| `effectiveDate` | date | 시행일 |
| `scope` | string | 다루는 범위 |
| `description` | string | 전체 설명 |

### RegulatoryLimit

규제에서 나온 특정 정량 임계값.

| 속성 | 타입 | 노트 |
|---|---|---|
| `limitId` | string | 식별자 |
| `limitName` | string | 표시 이름 |
| `category` | string | 어느 차원을 제약하는지 |
| `thresholdPct` | decimal (%) | 한도 값 |
| `severity` | string | 위반 결과 (예: "warning", "action required", "supervisory intervention") |
| `description` | string | 이 한도의 의미 |

핵심 예시:

| 한도 | 임계값 | 규제 |
|---|---|---|
| CRE 집중 | 자본의 300% | OCC Guidance 2006-46 |
| 기후 + 허리케인 | 포트폴리오의 15% | 내부 리스크 정책 |
| 지리적 집중 | 포트폴리오의 20% | OCC Bulletin 2011-12 |
| 업종 집중 | 포트폴리오의 25% | FDIC Risk Management |

## 새 관계

- **mandatedBy**: `RegulatoryLimit` → `Regulation` (`many-to-one`) — 각 한도는 특정 규제로 의무화됨
- **limitAppliesToCategory**: `RegulatoryLimit` → `ConcentrationCategory` (`many-to-one`) — 한도를 이들이 제약하는 집중 카테고리와 연결

## 설계 패턴: 크로스 도메인 브릿지

`limitAppliesToCategory`로 규제 계층이 ConcentrationCategory를 통해 대출 분류 계층과 연결됩니다. 이것이 **크로스 도메인 질의 경로**를 완성합니다.

```
Jurisdiction (hurricaneZone=true)
  → [지리 차원]
    → ConcentrationCategory
      → [규제 차원]
        → RegulatoryLimit (thresholdPct)
          → Regulation (issuingAuthority)
```

그리고 업종 쪽에서는:

```
IndustryGroup (climateSensitivity="high")
  → [업종 차원]
    → Subsector → Sector
```

## 완성 모델

최종 온톨로지는 네 도메인에 걸친 **11개 엔티티 타입**과 **10개 관계**를 가집니다.

| 도메인 | 엔티티 | 관계 |
|---|---|---|
| 업종 | Sector, Subsector, IndustryGroup | partOfSector, belongsToSubsector |
| 지리 | Region, Country, Jurisdiction | inCountry, inRegion |
| 대출 분류 | ConcentrationCategory, LoanType, CollateralType | loanClassifiedAs, collateralClassifiedAs, typicallySecuredBy |
| 규제 | Regulation, RegulatoryLimit | mandatedBy, limitAppliesToCategory |

## 4단계 그래프 (3단계 대비 차이)

<ontology-embed id="official/fibo-risk-step-4" diff="official/fibo-risk-step-3" height="480px"></ontology-embed>

*두 개의 새 엔티티(Regulation과 RegulatoryLimit)가 모델을 완성합니다. limitAppliesToCategory 관계가 규제 집행을 대출 분류와 이어 줍니다.*

## 전체 외부 참조 온톨로지

각 도메인을 외부 카탈로그에서 개별적으로 살펴볼 수도 있습니다.

- [FIBO Industry Classification](/#/catalogue/external/fibo/industry-classification)
- [FIBO Geographic Hierarchy](/#/catalogue/external/fibo/geographic-hierarchy)
- [FIBO Loan Classification](/#/catalogue/external/fibo/loan-classification)
- [FIBO Regulatory Context](/#/catalogue/external/fibo/regulatory-context)

## 지금까지 만든 것

이제 다음을 가능하게 하는 종합적인 FIBO 기반 리스크 관리 온톨로지가 있습니다.

- **업종 집중 분석** — 섹터, 서브섹터, 산업 그룹별 노출 롤업
- **지리적 리스크 평가** — 재해 지역 플래그로 필터링, 포트폴리오 데이터와 교차 참조
- **Basel III 자본 계산** — 대출 유형에 표준화 위험 가중치 적용
- **규제 준수 모니터링** — 의무화된 한도 대비 포트폴리오 집중 확인

이 모델은 전통적 데이터 웨어하우스에서라면 복잡한 다중 테이블 JOIN이 필요할 크로스 도메인 리스크 질의를, 온톨로지 기반 시스템에서는 단순한 그래프 순회로 표현할 수 있게 합니다.

## 라이선싱

이 랩에서 참조된 모든 FIBO 온톨로지 콘텐츠는 다음과 같습니다.

- **저작권** (c) 2016-2025 EDM Council, Inc. and Object Management Group, Inc.
- [MIT License](https://opensource.org/licenses/MIT) **라이선스 하에 배포**

```quiz
Q: 완성 모델에서 ConcentrationCategory의 역할은?
- 지리 좌표를 저장한다
- 대출 분류, 담보 유형, 규제 한도를 도메인에 걸쳐 잇는 허브 엔티티 역할을 한다 [correct]
- 각 대출의 Basel 위험 가중치를 정의한다
- 컴플라이언스 추적을 위해 Regulation 엔티티를 대체한다
> ConcentrationCategory는 대출 분류 도메인과 규제 도메인을 잇는 중심 허브입니다. LoanType과 CollateralType이 모두 여기로 분류되고, RegulatoryLimit이 이를 제약합니다. 이 덕분에 크로스 도메인 집중 리스크 질의의 핵심 노드가 됩니다.
```
