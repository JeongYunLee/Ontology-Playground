---
title: "완성된 HR 모델"
description: "PerformanceReview를 추가하고 완성된 HR 온톨로지를 실제 인력 분석 질문에 적용합니다."
---

## 인력 분석 계층 완성

마지막 엔티티는 **PerformanceReview**입니다. 리뷰 사이클에 걸친 평가 결과를 직원과 연결합니다.

관계:

- `Employee` -> `PerformanceReview` (one-to-many)

### PerformanceReview 속성

| 속성 | 타입 | 식별자? |
|---|---|---|
| `reviewId` | string | ✓ |
| `reviewPeriod` | string | |
| `rating` | enum | |
| `reviewDate` | date | |

이제 온톨로지는 운영과 전략 HR 질문을 하나의 그래프에서 지원합니다.

## 완성된 그래프

<ontology-embed id="community/ravi-chandu/hr-system" height="460px"></ontology-embed>

*HR 시스템 온톨로지: 5개 엔티티 — Employee, Department, Position, Assignment, PerformanceReview.*

## 그래프 질문 예시

| 질문 | 그래프 경로 |
|---|---|
| 시니어 직원이 가장 많은 학과는? | Department <- Assignment <- Employee (`jobLevel=senior`) |
| 지난 1년간 역할을 바꾼 직원은? | Employee -> Assignment (날짜별 여러 레코드) -> Position |
| outstanding 리뷰가 많은 팀은? | Department <- Assignment <- Employee -> PerformanceReview (`rating=outstanding`) |
| 더 이상 활성이 아닌 배정은? | Assignment (`endDate` 설정 또는 `isPrimary=false`) |

## 핵심 정리

1. **사람**, **조직 단위**, **역할**을 별개 엔티티로 분리합니다.
2. **Assignment**를 시간 인식 배치 이력을 위한 정션 엔티티로 사용합니다.
3. **PerformanceReview**로 측정 가능한 결과를 인력 엔티티에 붙입니다.
4. 식별자는 안정적으로, 상태는 enum 값으로 통제합니다.

```quiz
Q: 시간에 걸친 역할과 학과 변화의 이력 분석을 가능하게 하는 엔티티는?
- Employee
- Department
- Assignment [correct]
- PerformanceReview
> Assignment는 특정 직원-학과-직책 연결의 시작일과 종료일을 기록합니다. 이것이 없으면 배치 이력을 깔끔하게 추적할 수 없습니다.
```

HR 시스템 경로를 완주하셨습니다. [카탈로그](#/catalogue/community/ravi-chandu/hr-system)에서 모델을 열거나 [디자이너](#/designer/community/ravi-chandu/hr-system)에서 계속 다듬어 보세요.
