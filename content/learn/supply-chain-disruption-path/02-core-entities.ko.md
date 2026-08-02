---
title: "핵심 엔티티 & 속성"
description: "공급업체와 부품에서 리스크 평가와 완화 조치까지 — 공급망 붕괴를 모델링하는 7개 엔티티 타입과 40개 속성을 배웁니다."
---

## 7개 엔티티 타입

여러분의 온톨로지는 유발 사건부터 감지·평가·대응까지 공급망 붕괴의 전체 생애주기를 담습니다.

### 계층 1: 네트워크

**Supplier**
- 원자재나 부품을 제공하는 외부 회사를 대표
- 주요 속성: `supplierId` (고유), `name`, `country`, `tier` (Tier 1/2/3), `reliabilityScore` (0-100), `singleSourced` (boolean)
- 유스케이스: 리스크 증폭 요소가 되는 결정적 단일 공급업체 식별

**Component**
- 하나 이상의 공급업체에서 조달되는 부품, 자재, 서브 어셈블리
- 주요 속성: `componentId`, `name`, `category` (Electronic/Mechanical/Chemical/Packaging/Raw Material), `daysOfSupplyOnHand`, `criticalityLevel` (Critical/High/Medium/Low)
- 유스케이스: 안전 재고를 근거로 공급 중단을 견딜 수 있는 부품 추적

**ProductLine**
- 공통 부품을 공유하는 완제품 그룹
- 주요 속성: `productLineId`, `name`, `annualRevenue`, `marketSegment`, `productionStatus` (Active/At Risk/Halted/Discontinued)
- 유스케이스: 매출 노출과 생산 일정 영향 계산

### 계층 2: 붕괴

**DisruptionEvent**
- 하나 이상의 공급업체로부터의 정상 공급을 중단시키거나 위협하는 사건
- 주요 속성: `eventId`, `type` (Natural Disaster/Geopolitical/Financial/Logistics/Quality Recall/Pandemic/Cyber Attack), `severity` (Critical/High/Medium/Low), `startDate`, `estimatedDurationDays`, `region`
- 유스케이스: 분류와 심각도가 확대 수준과 대응 일정을 결정

### 계층 3: 분석

**RiskAssessment**
- 붕괴가 공급망에 영향을 줄 때의 비즈니스 영향 분석
- 주요 속성: `assessmentId`, `assessedDate` (datetime), `revenueAtRisk` (USD), `timeToImpactDays`, `confidenceLevel` (High/Medium/Low), `recommendedAction`
- 유스케이스: 대응 우선순위를 정하기 위해 비즈니스 언어(돈과 시간)로 영향 정량화

**MitigationAction**
- 붕괴 영향을 줄이거나 없애기 위한 구체적 단계
- 주요 속성: `actionId`, `type` (Activate Alternative Supplier/Increase Safety Stock/Redesign Component/Reduce Production/Expedite Shipment/Customer Communication), `status` (Proposed/Approved/In Progress/Completed/Cancelled), `estimatedCost` (USD), `leadTimeSavedDays`
- 유스케이스: 어떤 조치가 취해졌는지, 실제 대비 예상 효과성 추적

### 계층 4: 백업

**AlternativeSupplier**
- 주 공급업체를 대체할 수 있는 인증된 백업 공급업체
- 주요 속성: `altSupplierId`, `name`, `country`, `qualificationStatus` (Pre-qualified/Approved/Pending Audit/Not Qualified), `capacityAvailable` (units/month), `pricePremiumPercent` (%)
- 유스케이스: 알려진 용량과 비용 영향으로 백업을 신속히 활성화

## 속성 타입과 검증

각 속성은 AI 에이전트와 대시보드가 다루는 방식을 결정하는 타입을 가집니다.

| 타입 | 예시 | 에이전트에서의 용도 |
|------|---------|---------------|
| `string` | 공급업체 이름, 부품 카테고리 | 검색, 필터링, 리포팅 |
| `integer` | 공급 일수, 용량, 단위 수 | 임계값 기반 알람 |
| `decimal` | 매출, 가격 프리미엄, 신뢰도 점수 | 비용-편익 계산 |
| `date` | 붕괴 시작일 | 일정 비교 |
| `datetime` | 리스크 평가 타임스탬프 | 감사 이력, 트렌드 |
| `enum` | 공급업체 계층, 붕괴 유형, 심각도 | 분류, 의사 결정 트리 |
| `boolean` | 단일 소싱 플래그 | 리스크 표시 |

## 식별자 속성

각 엔티티는 고유 식별자를 가집니다.

```
Supplier → supplierId (예: "SUPP-00456")
Component → componentId (예: "COMP-SEM-0821")
ProductLine → productLineId (예: "PL-LAP-2024")
DisruptionEvent → eventId (예: "DISR-202405-TAIWAN-001")
RiskAssessment → assessmentId (예: "RA-20240501-SEM-001")
MitigationAction → actionId (예: "MA-20240501-ALT-SUPP")
AlternativeSupplier → altSupplierId (예: "ALTSUPP-00789")
```

이 ID들은 여러분과 에이전트가 질의와 리포트에서 특정 인스턴스를 참조하는 방식입니다.

## 카디널리티와 관계

엔티티는 정의된 카디널리티가 있는 관계로 연결됩니다.

- **one-to-many**: 한 공급업체가 여러 부품을 제공, 한 붕괴가 여러 공급업체에 영향
- **many-to-many**: 부품이 여러 제품 라인에 사용됨, 완화 조치가 여러 대체 공급업체를 활성화
- **many-to-one**: 여러 대체 공급업체가 하나의 주 공급업체를 대체할 수 있음

전체 관계 지도는 다음 단계에서 살펴봅니다.
