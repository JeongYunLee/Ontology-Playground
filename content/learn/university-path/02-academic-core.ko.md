---
title: "학사 핵심"
description: "학사 기록의 근간이 되는 정션 엔티티 패턴 — Student, Course, Enrollment를 정의합니다."
---

## 학사 기록의 기초

학사 기록은 하나의 핵심 질문을 중심으로 돕니다. *어떤 학생이 어떤 강의를 듣고 어떻게 수행했는가?* 세 엔티티가 이에 답합니다.

- **Student** — 누가 배우는가?
- **Course** — 무엇이 가르쳐지는가?
- **Enrollment** — 학생과 강의를 성적과 함께 잇는 기록

## 엔티티 정의

### Student

| 속성 | 타입 | 식별자? |
|---|---|---|
| `studentId` | string | ✓ |
| `name` | string | |
| `gpa` | float | |
| `enrollmentYear` | integer | |
| `major` | string | |

`gpa` 속성은 float입니다. GPA(Grade Point Average)는 0.0에서 4.0 범위입니다. 이 집계 지표는 학사 지위 질의와 우등생 계산을 가능하게 합니다.

### Course

| 속성 | 타입 | 식별자? |
|---|---|---|
| `courseId` | string | ✓ |
| `title` | string | |
| `credits` | integer | |
| `level` | string | |
| `maxEnrollment` | integer | |

`level` 속성(100, 200, 300, 400)은 강의 난도와 선수 과목을 나타냅니다. `maxEnrollment` integer는 수용 계획을 가능하게 합니다.

### Enrollment

| 속성 | 타입 | 식별자? |
|---|---|---|
| `enrollmentId` | string | ✓ |
| `semester` | string | |
| `grade` | string | |
| `enrollDate` | date | |
| `status` | string | |

Enrollment는 **정션 엔티티**입니다. Student와 Course를 추가 맥락(성적, 학기, 상태)과 함께 잇기 위해 존재합니다.

## 관계

- **enrolls_in** — `Student` → `Enrollment` (one-to-many)
  한 학생은 학기에 걸쳐 여러 수강 신청을 가집니다.

- **for_course** — `Enrollment` → `Course` (many-to-one)
  각 수강 신청은 하나의 특정 강의를 위한 것입니다.

> **정션 엔티티 패턴:** 두 엔티티가 속성을 가진 many-to-many 관계에 있을 때 정션 엔티티를 만듭니다. 학생은 여러 강의를 듣습니다. 강의는 여러 학생을 갖습니다. Enrollment가 그 사이에 앉아 성적, 학기, 상태를 담습니다. 온톨로지 설계에서 가장 흔한 패턴 중 하나입니다.

## 지금까지의 그래프

<ontology-embed id="official/university-step-1" height="350px"></ontology-embed>

*Student와 Course가 Enrollment를 통해 연결됩니다. 고전적인 정션 엔티티 패턴입니다.*

## 배운 것

- **정션 엔티티**(Enrollment)는 속성을 가진 many-to-many 관계를 해소합니다
- **float 속성**(GPA)은 집계 계산과 임계값을 가능하게 합니다
- **integer 속성**(credits, maxEnrollment)은 수용과 업무량 계획을 가능하게 합니다
- 학사 핵심은 Student → Enrollment → Course 흐름을 따릅니다

```quiz
Q: Enrollment가 Student–Course 직접 관계 대신 별도 엔티티로 모델링된 이유는?
- 그래프에 노드를 더 많이 만들려고
- Enrollment가 Student나 Course 어느 쪽에도 속하지 않는 자체 속성(성적, 학기, 상태)을 담기 때문에 [correct]
- 온톨로지는 최소 세 개의 엔티티가 필요해서
- 엔티티 사이 직접 관계가 금지되어서
> Student–Course 직접 관계는 성적, 학기, 상태 정보를 담을 수 없습니다. 정션 엔티티 패턴은 관계 자체를 일급 엔티티로 만들어 "이 학생이 이번 학기에 이 강의에서 어떤 성적을 받았나?" 같은 질의를 가능하게 합니다. 어느 끝점의 속성이 아닌 연결의 속성이 필요할 때 씁니다.
```

다음에는 교수진 배정을 추적할 Professor를 추가합니다.
