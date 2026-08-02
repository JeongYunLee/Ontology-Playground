---
title: "리스크 전파 모델"
description: "붕괴가 어떻게 파급되는지 이해합니다 — 공급업체 영향 → 부품 리스크 → 제품 노출 → 완화 조치를 모델링하는 7개 관계."
---

## 파급: 7개 관계

여러분 온톨로지의 힘은 관계에 있습니다. 관계가 영향이 공급망을 통해 어떻게 흐르는지 인코딩합니다. 데이터 에이전트는 "이 공급업체 실패에 노출된 제품 라인은 몇 개인가?" 같은 질문에 답하기 위해 이 경로를 따라갑니다.

### 1. **Supplier supplies Component** (one-to-many)

```
Supplier "ChipX Corp" 
  supplies→ Component "GPU Module"
         → Component "Memory Board"
         → Component "Power Supply"
```

- **왜 중요한가**: 공급업체 하나가 붕괴되면 의존하는 모든 부품에 영향
- **질의 예시**: "대만에 있는 공급업체의 모든 부품을 보여 줘"

### 2. **Component used in ProductLine** (many-to-many)

```
Component "GPU Module"
  usedIn→ ProductLine "Gaming Laptop 2024"
       → ProductLine "Workstation Pro"
       → ProductLine "Tablet Plus"
```

- **왜 중요한가**: 부품 하나의 실패가 여러 제품 라인을 중단시킬 수 있음
- **질의 예시**: "이 부품에 의존하는 제품 라인은 몇 개인가?"

### 3. **DisruptionEvent affects Supplier** (many-to-many)

```
DisruptionEvent "Taiwan Power Outage 2024-05-01"
  affects→ Supplier "ChipX Corp"
        → Supplier "Memory Inc"
```

- **왜 중요한가**: 하나의 재해가 여러 공급업체를 동시에 강타할 수 있음
- **질의 예시**: "홍수 지역에 있는 공급업체는?"

### 4. **DisruptionEvent triggers RiskAssessment** (one-to-many)

```
DisruptionEvent "Taiwan Power Outage"
  triggers→ RiskAssessment "Gaming Laptop - Impact Analysis"
         → RiskAssessment "Workstation - Impact Analysis"
```

- **왜 중요한가**: 각 붕괴는 영향받는 제품 라인마다 상세 영향 분석을 유발
- **질의 예시**: "이 붕괴로 위험에 처한 총 매출은?"

### 5. **RiskAssessment recommends MitigationAction** (one-to-many)

```
RiskAssessment "Gaming Laptop - Impact Analysis"
  recommends→ MitigationAction "Activate Alt Supplier X"
           → MitigationAction "Increase Safety Stock"
           → MitigationAction "Redesign Component"
```

- **왜 중요한가**: 각 영향 분석은 우선순위가 매겨진 조치 목록을 생성
- **질의 예시**: "붕괴 영향을 최소화할 최선의 조치는?"

### 6. **MitigationAction activates AlternativeSupplier** (many-to-many)

```
MitigationAction "Activate Alt Supplier X"
  activates→ AlternativeSupplier "ChipX Europe"
          → AlternativeSupplier "SemiCorp Japan"
```

- **왜 중요한가**: 하나의 조치가 여러 백업을 동시에 온라인으로 만들 수 있음
- **질의 예시**: "인계받을 수 있는 사전 인증 공급업체는?"

### 7. **AlternativeSupplier canReplace Supplier** (many-to-one)

```
AlternativeSupplier "ChipX Europe"
  canReplace→ Supplier "ChipX Corp"

AlternativeSupplier "SemiCorp Japan"  
  canReplace→ Supplier "ChipX Corp"
```

- **왜 중요한가**: 결정적 공급업체에는 여러 승인된 백업이 존재
- **질의 예시**: "이 공급업체의 승인된 백업이 있는가?"

## 완전한 파급 예시

실제 시나리오로 영향을 추적해 봅시다.

```
DISRUPTION
│
├─ Taiwan Power Outage (2024-05-01, Critical severity)
│
├─ AFFECTS
│  └─ Supplier "ChipX Corp" (singleSourced=true)
│     ├─ SUPPLIES
│     │  ├─ Component "GPU Module" (daysOfSupplyOnHand=3)
│     │  │  ├─ USED IN
│     │  │  │  ├─ ProductLine "Gaming Laptop 2024" ($50M annual revenue)
│     │  │  │  ├─ ProductLine "Workstation Pro" ($30M annual revenue)
│     │  │  │
│     │  │  └─ TRIGGERS RiskAssessment
│     │  │     ├─ revenueAtRisk=$80M
│     │  │     ├─ timeToImpactDays=3
│     │  │     │
│     │  │     └─ RECOMMENDS
│     │  │        ├─ MitigationAction "Activate ChipX Europe"
│     │  │        │  ├─ estimatedCost=$2M
│     │  │        │  ├─ leadTimeSavedDays=2
│     │  │        │  │
│     │  │        │  └─ ACTIVATES
│     │  │        │     ├─ AlternativeSupplier "ChipX Europe" 
│     │  │        │     │  ├─ qualificationStatus=Approved
│     │  │        │     │  ├─ capacityAvailable=50,000 units/month
│     │  │        │     │  ├─ pricePremiumPercent=12%
│     │  │        │     │  │
│     │  │        │     │  └─ CAN REPLACE
│     │  │        │     │     └─ Supplier "ChipX Corp"
│     │  │        │     │
│     │  │        │     └─ AlternativeSupplier "SemiCorp Japan"
│     │  │        │        └─ (2순위 옵션)
│     │  │        │
│     │  │        └─ MitigationAction "Increase Safety Stock"
│     │  │           └─ estimatedCost=$500K
│     │  │
│     │  └─ Component "Memory Board"
│     │     └─ (유사한 파급...)
```

## 이 구조가 자동화를 가능하게 하는 이유

여러분의 데이터 에이전트는 이제 다음을 할 수 있습니다.

1. **감지** — "이 공급업체들과 이 지역을 모니터링하라"
2. **추적** — "ChipX Corp에 문제가 생기면 영향받는 14개 제품 라인까지 자동 추적"
3. **정량화** — "총 매출 위험($80M)과 영향까지 시간(3일) 계산"
4. **추천** — "$80M 손실 대비 2일 절약하고 $2M 드는 사전 인증 대체안 활성화"
5. **실행** — "조달 알람 전송, 생산 스케줄 업데이트, 이해관계자 통지"
6. **학습** — "어떤 조치가 실제로 작동했는지, 실제 대비 예상 영향 추적"

## 카디널리티 규칙

| 관계 | 카디널리티 | 이유 |
|---|---|---|
| Supplier → Component | 1:N | 한 공급업체가 여러 부품 제공 |
| Component → ProductLine | M:N | 부품은 재사용되고 제품은 부품을 공유 |
| Disruption → Supplier | M:N | 하나의 재해가 여러 공급업체를 강타, 한 공급업체는 여러 위협에 직면 |
| Disruption → Assessment | 1:N | 각 붕괴는 영향받는 제품 라인마다 평가를 생성 |
| Assessment → Action | 1:N | 각 평가는 여러 조치를 추천 |
| Action → Alternative | M:N | 하나의 조치가 여러 백업을 활성화, 백업은 여러 상황을 처리 |
| Alternative → Supplier | M:1 | 하나의 주 공급업체에 여러 사전 인증 백업 존재 |

다음에는 이 모델로 실제 완화 워크플로우를 실행하는 방법을 봅니다.
