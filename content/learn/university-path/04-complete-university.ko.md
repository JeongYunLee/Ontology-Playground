---
title: "완성된 대학교 모델"
description: "Department를 추가해 대학교 온톨로지를 완성합니다. 교수진·강의·학생을 학사 프로그램으로 조직합니다."
---

## 조직 구조

대학교는 **학과(Department)** 로 조직됩니다. 교수진이 소속되고, 강의를 개설하고, 학위를 수여하는 행정 단위입니다. Department를 추가하면 모든 것을 이어 주는 조직 계층이 만들어집니다.

## Department 엔티티

| 속성 | 타입 | 식별자? |
|---|---|---|
| `departmentId` | string | ✓ |
| `name` | string | |
| `building` | string | |
| `budget` | float | |
| `headOfDept` | string | |

`budget` float는 자원 배분 질의를 가능하게 합니다. `headOfDept` 속성은 학과를 이끄는 교수를 참조합니다. 조직 계층에서 흔한 자기 참조 패턴이죠.

## 새 관계

- **belongs_to** — `Professor` → `Department` (many-to-one)
  교수는 하나의 학과에 소속됩니다.

- **offers** — `Department` → `Course` (one-to-many)
  학과는 학사 프로그램의 일환으로 강의를 개설합니다.

> **조직 계층:** Department는 대학교 온톨로지 최상단에 위치합니다. 아래로 Professor(교수진)와 Course(커리큘럼) 모두에 연결됩니다. 이 허브 위치가 "학과 수준 통계" 같은 집계 질의에 이상적입니다.

## 완성된 그래프

<ontology-embed id="official/university-step-3" diff="official/university-step-2" height="500px"></ontology-embed>

*완성된 대학교 온톨로지: 5개 엔티티, 6개 관계. Department가 교수진과 커리큘럼을 조직합니다.*

## 완성된 모델이 가능하게 하는 것

| 질문 | 그래프 경로 |
|---|---|
| 학생 평균 GPA가 가장 높은 학과는? | Department → Course ← Enrollment ← Student (평균 GPA) |
| 소속 학과 강의 외 강의를 담당하는 교수는? | Professor → Department vs Professor → Course → Department |
| 학과별 수강 신청률은? | Department → Course ← Enrollment (count) / Course.maxEnrollment |
| 정년 교수가 가장 많은 학과는? | Department ← Professor (tenured=true, count) |

## GQL 쿼리 예시

학생들이 어려움을 겪는 학과 찾기(평균 성적 B 미만):

```gql
MATCH (d:Department)-[:offers]->(c:Course)<-[:for_course]-(e:Enrollment)<-[:enrolls_in]-(s:Student)
WHERE e.grade IN ['C', 'D', 'F']
RETURN d.name, c.title, COUNT(e) AS struggling_count
ORDER BY struggling_count DESC
```

## 지금까지 만든 것

| 단계 | 추가된 엔티티 | 누적 | 핵심 개념 |
|---|---|---|---|
| 1 | Student, Course, Enrollment | 3 | 정션 엔티티, many-to-many |
| 2 | Professor | 4 | 전이적 질의, boolean 속성 |
| 3 | Department | 5 | 조직 계층, 허브 엔티티 |

## 핵심 정리

1. **정션 엔티티**(Enrollment)는 속성이 있는 many-to-many 관계를 해소합니다
2. **전이적 질의**는 다중 홉 경로 순회로 인사이트를 풀어냅니다
3. **boolean 속성**(tenured)은 범주형 필터링을 가능하게 합니다
4. **조직 계층**(Department)은 집계 그룹핑을 제공합니다
5. **허브 엔티티**(Department)는 온톨로지의 여러 가지를 이어 줍니다

```quiz
Q: 대학교 온톨로지에서 Department가 "허브 엔티티"로 여겨지는 이유는?
- 속성이 가장 많아서
- Professor와 Course 모두에 연결되며 조직 계층 최상단에 위치해서 [correct]
- 마지막에 추가되어서
- 허브 엔티티는 budget 속성을 가져야 해서
> Department는 아래로 Professor(belongs_to)와 Course(offers) 모두에 연결됩니다. 이 이중 연결이 조직 허브로 만들며, 학과 수준에서 교수진과 커리큘럼 데이터를 결합하는 집계 질의에 이상적입니다.
```

대학교 시스템 학습 경로를 완주하셨습니다! [카탈로그](#/catalogue)에서 각 단계를 불러와 대화식으로 탐색해 보세요.
