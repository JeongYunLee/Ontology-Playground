---
title: "완성된 공장 모델"
description: "Quality-Check를 추가해 제조 온톨로지를 완성합니다. 생산에서 검사로 이어지는 순환을 닫습니다."
---

## 품질 루프 닫기

제조는 부품이 만들어지는 것으로 끝나지 않습니다. 반드시 검사되어야 합니다. **Quality-Check**가 부품이 사양을 만족하는지 확인함으로써 생산 순환을 닫습니다.

## Quality-Check 엔티티

| 속성 | 타입 | 식별자? |
|---|---|---|
| `checkId` | string | ✓ |
| `inspector` | string | |
| `checkDate` | date | |
| `passed` | boolean | |
| `defectCode` | string | |

`passed` boolean이 결정적 속성입니다. 부품이 출하되는지 재작업되는지가 여기서 갈립니다. `defectCode` 속성은 근본 원인 분석을 위해 결함을 분류합니다.

## 새 관계

- **inspects** — `Quality-Check` → `Part` (many-to-one)
  각 품질 검사는 특정 부품을 검사합니다. 부품 하나가 여러 번 검사받을 수도 있습니다(초기 검사, 재작업 후 재검사).

> **피드백 루프:** 품질 검사가 실패하면 생산 체인이 역방향으로 흐릅니다. `Quality-Check (passed=false) → Part → Work-Order → Machine`. 이 피드백 루프가 스마트 공장이 문제 있는 설비를 식별하고 생산 품질을 개선해 나가는 방식입니다.

## 완성된 그래프

<ontology-embed id="official/manufacturing-step-3" diff="official/manufacturing-step-2" height="500px"></ontology-embed>

*완성된 스마트 제조 온톨로지: 5개 엔티티, 5개 관계. Quality-Check가 검사에서 생산으로 이어지는 피드백 루프를 닫습니다.*

## 완성된 모델이 가능하게 하는 것

| 질문 | 그래프 경로 |
|---|---|
| 검사에서 실패한 부품을 만드는 설비는? | Machine → Part ← Quality-Check (passed=false) |
| 결함 부품이 만들어진 시점에 이상치를 보인 센서는? | Sensor → Machine → Part ← Quality-Check (passed=false) |
| 작업 지시 우선순위별 결함률은? | Work-Order (priority) → Part ← Quality-Check |
| 재검사가 필요한 부품은? | Part ← Quality-Check (passed=false, count > 1) |

## GQL 쿼리 예시

센서 이상과 품질 실패의 상관 관계 찾기:

```gql
MATCH (s:Sensor)-[:monitors]->(m:Machine)-[:has_part]->(p:Part)<-[:inspects]-(qc:QualityCheck)
WHERE s.lastReading > s.threshold AND qc.passed = false
RETURN m.name, s.type, s.lastReading, p.name, qc.defectCode
```

## 지금까지 만든 것

| 단계 | 추가된 엔티티 | 누적 | 핵심 개념 |
|---|---|---|---|
| 1 | Machine, Sensor | 2 | IoT 계층, 텔레메트리 |
| 2 | Work-Order, Part | 4 | 생산 체인, 허용 오차 |
| 3 | Quality-Check | 5 | 피드백 루프, 검사 |

## 핵심 정리

1. **IoT 계층**은 텔레메트리 집계를 위해 센서를 설비 아래로 조직합니다
2. **생산 체인**은 스케줄링 엔티티를 매개로 장비와 산출물을 잇습니다
3. **품질 피드백 루프**는 생산 체인 전반에 걸친 근본 원인 분석을 가능하게 합니다
4. **임계값 기반 알람**은 예방 정비를 뒷받침합니다
5. **boolean 속성**(passed)은 워크플로우에서 명확한 결정 지점을 만듭니다

```quiz
Q: 제조 온톨로지에서 Quality-Check가 피드백 루프를 만드는 방식은?
- Machine에 직접 연결됨
- 실패한 검사가 Part → Work-Order → Machine을 거슬러 결함의 원천을 찾음 [correct]
- Sensor 엔티티로 되돌아감
- 품질 검사는 피드백 루프를 만들지 않음
> 품질 검사가 실패하면 Quality-Check → Part → Work-Order → Machine 경로가 결함을 근원으로 되짚어 갑니다. 이 피드백 루프는 스마트 제조의 지속적 개선에 근본이 됩니다. 어떤 설비, 작업 지시, 조건이 결함 부품을 만드는지 식별하는 것이죠.
```

스마트 제조 학습 경로를 완주하셨습니다! [카탈로그](#/catalogue)에서 각 단계를 불러와 대화식으로 탐색해 보세요.
