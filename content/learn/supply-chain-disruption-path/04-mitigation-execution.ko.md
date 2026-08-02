---
title: "완화 실행 & 자동화"
description: "온톨로지를 운영 조치로 전환하기 — Fabric IQ 에이전트, 실시간 대시보드, 자동화와 함께 사용해 붕괴 영향을 며칠에서 몇 분으로 줄이는 방법."
---

## 모델에서 행동으로

이제 여러분의 온톨로지는 실시간 의사 결정 자동화를 뒷받침할 준비가 되었습니다. 붕괴 감지부터 완화 실행까지 어떻게 흐르는지 살펴봅니다.

### Phase 1: 감지 (0분)

**입력**: 외부 신호 (공급업체가 오프라인 상태, 자연재해 경보, 품질 문제 보고)

**여러분의 온톨로지가 가능하게 하는 것**:
```
Data Agent Query:
  "대만 지진의 영향을 받는 공급업체는?"
  ↓
  매칭: Supplier.country="Taiwan" + DisruptionEvent.region="Taiwan" 
           + DisruptionEvent.type="Natural Disaster"
  ↓
  결과: 3개의 결정적 공급업체 식별
```

### Phase 2: 영향 추적 (5분)

**입력**: 영향받는 공급업체 목록

**여러분의 온톨로지가 가능하게 하는 것**:
```
Data Agent Query:
  "이 3개 공급업체가 공급하는 모든 부품을 보여 줘"
  ↓
  경로: Supplier → supplies → Component
  ↓
  결과: 47개 부품 식별
  
이어서: "이 47개 부품은 어느 제품 라인에서 사용되나?"
  ↓
  경로: Component → usedIn → ProductLine
  ↓
  결과: 12개 제품 라인 노출
```

### Phase 3: 영향 정량화 (15분)

**입력**: 노출된 제품 라인 목록

**여러분의 온톨로지가 가능하게 하는 것**:
```
Calculation Engine:
  각 노출된 ProductLine에 대해:
    revenue_at_risk = annualRevenue / 365 * daysOfSupplyOnHand
    urgency = 100 - (daysOfSupplyOnHand * 10)
  
  집계:
    total_revenue_at_risk = SUM(revenue_at_risk)
    critical_product_lines = WHERE urgency > 70
    
  결과: 
    총 위험 매출: $127M
    결정적 일정: 3일
    영향받는 고객: 450,000+
```

### Phase 4: 조치 추천 (20분)

**입력**: 리스크 평가 결과

**여러분의 온톨로지가 가능하게 하는 것**:
```
Recommendation Engine:
  영향받는 각 제품 라인의 각 부품에 대해:
    1. 다음 조건을 만족하는 AlternativeSupplier 레코드를 찾음:
       - qualificationStatus="Approved"
       - capacityAvailable >= demand
       - country NOT IN earthquake_region
    
    2. 각 대체안을 다음 기준으로 점수:
       - 절약된 리드 타임 (leadTimeSavedDays)
       - 비용 영향 (pricePremiumPercent)
       - 신뢰도 (reliabilityScore)
    
    3. ROI로 상위 3개 조치 추천:
       - 조치 A: ChipX Europe 활성화 (2일 절약, +$2M 비용)
       - 조치 B: 안전 재고 증가 ($500K, 2주 커버)
       - 조치 C: 부품 재설계 (리드 타임 불명)
```

### Phase 5: 실행 (25분)

**여러분의 온톨로지가 자동 워크플로우를 발동합니다**:

```
IF RiskAssessment.revenueAtRisk > $50M AND 
   RiskAssessment.timeToImpactDays < 5:
   
   THEN:
     1. 추천된 AlternativeSupplier에 PurchaseOrder 생성
     2. 새 일정으로 ProductionSchedule 업데이트
     3. 이메일 전송:
        - 조달팀 (구매 실행)
        - 운영팀 (스케줄 조정)
        - 재무팀 ($2M 추가 비용 예측)
        - CEO/이사회 (노출 상황 업데이트)
     4. 에스컬레이션 정책이 있는 Activator 알람 생성
     5. MitigationAction.status 모니터링 시작
```

## 실제 워크플로우: 종단 간

### Day 1: 붕괴 감지

```
10:30 AM: 대만 규모 6.8 지진
          ↓
10:45 AM: 시스템이 감지: DisruptionEvent 생성
          ├─ type = "Natural Disaster"
          ├─ severity = "Critical"
          ├─ region = "Taiwan"
          ├─ estimatedDurationDays = 7
          
10:46 AM: 데이터 에이전트가 영향 추적
          ├─ 3개 결정적 공급업체 영향
          ├─ 47개 부품 중단
          ├─ 12개 제품 라인 노출
          ├─ $127M 매출 위험
          ├─ 3일 후 생산 중단
          
10:47 AM: RiskAssessment 생성
          ├─ 각 제품 라인에 대한 영향 평가
          ├─ ROI로 순위 매긴 조치 추천
          
10:48 AM: MitigationActions 자동 생성
          ├─ ChipX Europe (승인된 대체안)에 PO 발행
          ├─ 안전 재고 주문 발주
          ├─ 조달·운영·재무팀에 알람 전송
          
10:50 AM: Activator 발동
          ├─ 실시간 대시보드가 영향과 조치 표시
          ├─ 에스컬레이션 정책이 리더십에 통지
          ├─ 조달팀이 수신 확인 및 접수 확정
          
11:30 AM: MitigationAction.status = "In Progress"
          ├─ 구매 주문 진행 중
          ├─ ChipX Europe이 48시간 내 출하 확약
          ├─ 생산 영향 7일 → 3일로 감소
```

### Day 2-4: 모니터링 및 조정

```
매 4시간마다:
  - DisruptionEvent.estimatedDurationDays 확인 (복구 상황 변화 시 업데이트)
  - MitigationAction 진행 상황 모니터링
  - 최신 재고 데이터로 RiskAssessment 재계산
  - leadTimeSavedDays가 밀리면 알람 (대체 공급업체 지연)
  - 필요 시 대비 조치 추천
  
Day 3: ChipX Europe 배송 도착
  ├─ MitigationAction.status = "Completed"
  ├─ 47개 부품 재고 복원
  ├─ 생산 재개 (7일 지연이 아닌 3일)
  ├─ 실제 비용: $2.1M (예상 $2M)
  ├─ 보호된 매출: 노출 $127M 중 약 $100M
```

## Fabric IQ와 연동

여러분의 온톨로지는 Fabric IQ 데이터 에이전트와 매끄럽게 통합됩니다.

```
사용자: "지금 우리 공급망 리스크 노출은 어떻게 되나요?"
  ↓
데이터 에이전트가 온톨로지에 질의를 그라운딩:
  1. singleSourced=true인 모든 Supplier 레코드 찾기
  2. 각각에 대해 공급하는 Component 찾기
  3. 그 부품을 사용하는 ProductLine으로 추적
  4. 각 ProductLine의 revenueAtRisk 계산
  5. revenueAtRisk 순으로 정렬된 목록 반환
  
에이전트 응답:
  "3개의 결정적 단일 소스 공급업체가 있습니다.
   하나라도 붕괴되면 4-9일 안에 약 $180M을 잃습니다.
   8개 대체 공급업체를 사전 인증할 것을
   권장합니다 (목록 첨부)."

사용자: "ChipX에 대해 승인된 대체안은 무엇인가요?"
  ↓
에이전트 질의:
  AlternativeSupplier WHERE:
    canReplace.Supplier.name = "ChipX Corp"
    AND qualificationStatus = "Approved"
  ↓
결과:
  - ChipX Europe (용량: 50K/월, +12% 비용)
  - SemiCorp Japan (용량: 30K/월, +18% 비용)
  - Semiconductor Direct USA (용량: 25K/월, +15% 비용)
```

## 지속적 개선

완화 모델의 효과성을 추적하세요.

| 지표 | 계산 | 목표 |
|--------|-------------|------|
| 감지 속도 | 붕괴에서 RiskAssessment까지 시간 | < 1시간 |
| 추적 정확도 | 실제 영향받은 부품 중 식별한 비율 | > 95% |
| 영향 추정 정확도 | 예상 vs 실제 매출 위험 | ±10% |
| 완화까지 시간 | 평가에서 MitigationAction 실행까지 시간 | < 2시간 |
| 비용 효율 | 조치의 실제 vs 예상 비용 | ±5% |
| 매출 보호율 | 위험 매출 중 조치로 보호된 비율 | > 80% |

각 붕괴 사건은 훈련 기회가 됩니다. 에이전트는 실제로 잘 작동하는 대체 공급업체, 유지되는 리드 타임, 가장 회복탄력적인 제품 라인을 학습합니다.

## 요약

여러분의 공급망 붕괴 & 리스크 전파 온톨로지는 프로덕션 준비가 되었습니다.

✅ **7개 엔티티 타입**이 전체 붕괴 생애주기를 담습니다  
✅ **40개 속성**이 의사 결정에 풍부한 맥락을 제공합니다  
✅ **7개 관계**가 현실적인 영향 파급을 모델링합니다  
✅ 자연어 에이전트를 위한 **Fabric IQ 호환**  
✅ enum 분류와 타임스탬프로 **자동화 준비 완료**  
✅ **측정 가능한 결과** — 붕괴 영향을 며칠에서 몇 시간으로 감소  

배포하고, 모니터링하고, 공급망 회복탄력성이 변모하는 것을 지켜보세요.
