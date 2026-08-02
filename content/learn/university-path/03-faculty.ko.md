---
title: "교수진"
description: "누가 무엇을 가르치는지 추적하기 위해 Professor를 추가합니다. 교수를 강의·학생과 연결합니다."
---

## 교수진 추가

강의는 누가 가르치는가? **Professor** 엔티티가 교수 차원을 더합니다. 교수진을 강의와, 그리고 전이적으로 학생과 잇습니다.

Professor를 추가하면 다음이 가능해집니다.

- "400 레벨 강의를 가장 많이 담당하는 교수는?"
- "Smith 교수 강의의 평균 GPA는?"
- "입문 강의를 담당하는 정년 교수는?"

## Professor 엔티티

| 속성 | 타입 | 식별자? |
|---|---|---|
| `professorId` | string | ✓ |
| `name` | string | |
| `rank` | string | |
| `tenured` | boolean | |
| `officeHours` | string | |

`rank` 속성(Assistant, Associate, Full)은 학사 계층을 반영합니다. `tenured` boolean은 고용 안정성과 기관 투자에 관한 질의를 가능하게 합니다.

## 새 관계

- **teaches** — `Professor` → `Course` (one-to-many)
  한 교수가 학기당 하나 이상의 강의를 담당합니다.

- **advises** — `Professor` → `Student` (one-to-many)
  교수는 자신의 학사 프로그램 내 학생을 지도합니다.

> **전이적 질의:** Professor → Course ← Enrollment ← Student 구조로, 이제 강의 관계를 넘나드는 질문이 가능해집니다. "정년 교수의 강의를 듣는 학생은?" 같은 질문은 Professor → Course → Enrollment → Student를 순회해야 합니다.

## 성장하는 그래프

<ontology-embed id="official/university-step-2" diff="official/university-step-1" height="400px"></ontology-embed>

*Professor가 강의와 지도 관계로 합류합니다. diff가 새로 생긴 부분을 강조합니다.*

## 배운 것

- **boolean 속성**(tenured)은 필터링을 위한 예/아니오 범주를 만듭니다
- **전이적 질의**는 여러 관계를 순회해 멀리 있는 엔티티를 잇습니다
- **학사 직급**은 정의된 계층을 따릅니다 (Assistant → Associate → Full)
- 그래프는 이제 학생 중심과 교수 중심 질의를 모두 지원합니다

```quiz
Q: 대학교 온톨로지에서 전이적 질의는 어떤 모습인가요?
- 단일 엔티티의 속성을 조회함
- Professor → Course → Enrollment → Student 같이 여러 관계를 순회해 멀리 있는 엔티티를 이음 [correct]
- 교수를 ID로 조회함
- 시스템의 강의 수를 셈
> 전이적 질의는 그래프 기반 온톨로지의 가장 큰 장점 중 하나입니다. Professor → Course → Enrollment → Student를 순회함으로써 "정년 교수의 강의를 듣는 학생은?" 같은 질문에 답할 수 있습니다. 직접 관계가 없는 엔티티들을 중간 노드로 이어 주는 것이죠.
```

다음에는 학사 구조를 조직할 Department를 추가합니다.
