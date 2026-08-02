---
title: RDF와 OWL 이해하기
description: 시맨틱 웹에서 클래스·속성·관계를 기술하는 표준 언어인 RDF/OWL로 온톨로지가 어떻게 표현되는지 배웁니다.
---

## RDF란?

**RDF** (Resource Description Framework)는 정보를 연결된 리소스의 그래프로 기술하는 W3C 표준입니다. RDF의 모든 것은 **트리플**로 표현됩니다. 주어(subject) → 술어(predicate) → 목적어(object).

```
:Customer  rdf:type       owl:Class .
:name      rdf:type       owl:DatatypeProperty .
:name      rdfs:domain    :Customer .
:name      rdfs:range     xsd:string .
```

위 트리플은 이렇게 읽을 수 있습니다. "Customer라는 클래스가 있고, 그 클래스에는 문자열 타입의 name이라는 속성이 있다."

## OWL은 RDF 위에 세워집니다

**OWL** (Web Ontology Language)은 카디널리티 제약, 클래스 계층, 논리적 공리 등 더 풍부한 모델링을 위해 RDF를 확장합니다. 온톨로지 설계에서 핵심적인 OWL 구성 요소는 다음과 같습니다.

| OWL 개념 | 대응되는 개념 | 예시 |
|-------------|---------|---------|
| `owl:Class` | 엔티티 타입 | `Customer`, `Product` |
| `owl:DatatypeProperty` | 원시 값을 가진 속성 | `name` (문자), `price` (십진수) |
| `owl:ObjectProperty` | 엔티티 사이의 관계 | `placedBy` (Order → Customer) |
| `rdfs:domain` / `rdfs:range` | 속성이 속한 엔티티 / 값의 타입 | `price`는 `Product`에 속하고 타입은 `xsd:decimal` |

## 네임스페이스로 모호함을 없앤다

RDF의 모든 리소스는 전역적으로 유일한 **URI**를 가집니다. URI를 매번 길게 쓰지 않기 위해 RDF/XML은 **네임스페이스 접두어**를 사용합니다.

```xml
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:owl="http://www.w3.org/2002/07/owl#"
         xmlns="https://mycompany.com/ontology/">
```

`xmlns=`로 지정한 기본 네임스페이스 덕분에 `<owl:Class rdf:about="Customer">`는 실제로는 `https://mycompany.com/ontology/Customer`를 뜻합니다.

## RDF/OWL 파일 읽어보기

엔티티 타입 하나와 속성 하나만 담긴 최소한의 온톨로지 예시입니다.

```xml
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
         xmlns:owl="http://www.w3.org/2002/07/owl#"
         xmlns:xsd="http://www.w3.org/2001/XMLSchema#"
         xmlns="https://example.com/shop/">

  <!-- 엔티티 타입: Product -->
  <owl:Class rdf:about="Product">
    <rdfs:label>Product</rdfs:label>
  </owl:Class>

  <!-- 속성: productName (문자열, 식별자) -->
  <owl:DatatypeProperty rdf:about="productName">
    <rdfs:domain rdf:resource="Product"/>
    <rdfs:range rdf:resource="http://www.w3.org/2001/XMLSchema#string"/>
    <rdfs:label>productName</rdfs:label>
  </owl:DatatypeProperty>
</rdf:RDF>
```

Ontology Playground는 이런 파일을 곧바로 가져올 수 있고, 시각적으로 설계한 뒤 RDF로 내보낼 수도 있습니다.

<ontology-embed id="official/ecommerce" height="400px"></ontology-embed>

*E-Commerce 온톨로지는 여러 엔티티 타입과 그것들을 연결하는 오브젝트 속성이 있는 더 풍부한 예시를 보여줍니다.*

## JSON vs RDF — 언제 뭘 쓸까

| | JSON | RDF/OWL |
|---|------|---------|
| **가독성** | 사람이 읽고 편집하기 쉬움 | 장황하지만 정밀함 |
| **툴링** | 아무 텍스트 편집기 | 시맨틱 웹 도구, SPARQL 엔드포인트 |
| **상호운용성** | 애플리케이션에 특화 | W3C 표준, 어디서든 통용됨 |
| **적합한 용도** | 빠른 프로토타이핑, 앱 설정 | 정식 데이터 모델, 시스템 간 연동 |

Ontology Playground는 두 포맷을 모두 지원합니다. 시각적 편집기에서 설계하고 빠른 사용에는 JSON으로, 정식 공개에는 RDF/OWL로 내보낼 수 있습니다.

## 핵심 정리

- RDF는 지식을 **주어 → 술어 → 목적어** 트리플로 표현합니다
- OWL은 RDF 위에 클래스, 데이터 속성, 오브젝트 속성을 얹습니다
- 네임스페이스는 URI를 짧게 하고 모호함을 없앱니다
- Playground는 표준 RDF/OWL을 가져오고 내보내므로 손으로 코딩할 필요가 없습니다

```quiz
Q: RDF에서 정보는 어떤 방식으로 표현되나요?
- 행과 열이 있는 테이블
- JSON 키-값 쌍
- 주어 → 술어 → 목적어 트리플 [correct]
- 이진 데이터 스트림
> RDF는 트리플, 즉 주어가 술어를 통해 목적어와 연결되는 세 부분 진술을 사용하여 정보를 연결된 리소스의 그래프로 기술합니다.
```

```quiz
Q: owl:ObjectProperty가 나타내는 것은?
- 문자열 같은 원시 값을 가진 속성
- 두 엔티티 타입 사이의 관계 [correct]
- 온톨로지의 네임스페이스
- 데이터 타입에 대한 제약
> OWL에서 ObjectProperty는 두 클래스(엔티티 타입) 사이의 관계를 정의합니다. 예를 들어 Order를 Customer와 연결하는 "placedBy"가 있습니다. 원시 값에는 DatatypeProperty가 사용됩니다.
```
