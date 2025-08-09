## 팀 이름  
### NB2-DearCarmate-Team1

(팀 협업 문서 링크 게시)

---

## 팀원 구성  
- **조가현** [(개인 Github 링크)](#)  
- **권나현** [(개인 Github 링크)](#)  
- **권은혜** [(개인 Github 링크)](#)
- **박건영** [(개인 Github 링크)](#)
- **박규남** [(개인 Github 링크)](#)  
- **박성국** [(개인 Github 링크)](#)

---
## 프로젝트 기간: 2025.07.22 ~ 2025.08.13  
---
## 프로젝트 소개  
- **Dear Carmate**는 중고차 판매 현장에서 발생하는 계약∙차량∙고객 관리를 통합 지원하는 올인원 중고차 계약 관리 서비스입니다.
- 복잡하고 분산된 판매 프로세스를 한 곳에서 관리할 수 있도록 설계되어, 계약 진행부터 매출 분석까지 업무 효율성을 극대화합니다.

**1. 주요 특징**

- 통합 계약 관리 : 차량∙고객∙계약 정보를 한 곳에서 조회∙수정∙삭제 가능

- 계약서 파일 업로드 및 관리 : 업로드 시 자동 이메일 발송, 다운로드/삭제/조회 기능 지원

- 데이터 시각화 대시보드 : 월별 매출, 진행 중 계약 수, 성사 계약 수, 차량 타입별 계약∙매출 현황 제공

- 대용량 데이터 업로드 : CSV 파일을 통한 차량∙고객 정보의 대량 등록 기능

- 안정적 데이터 처리 : 트랜잭션과 캐스캐이딩을 적용해 데이터 무결성 보장

**2. 핵심 기능**

- 인증/회원관리

   - 이메일·비밀번호 기반 로그인/로그아웃

   - 기업 인증코드를 통한 회원가입

   - 개인정보 수정 시 비밀번호 재검증

- 차량 관리

   - 차량 등록/수정/삭제/목록 조회

   - 차량 검색 및 페이지네이션

   - CSV를 통한 대량 등록

- 고객 관리

   - 고객 등록/수정/삭제/목록 조회

   - 고객 검색 및 페이지네이션

- 계약 관리

   - 계약 등록/수정/삭제

   - 거래 상태별 칸반 보드

   - 고객명, 담당자명 검색

- 대시보드

   - 매출 및 계약 현황 시각화

- 계약서 관리

   - 계약서 업로드, 다운로드, 삭제, 목록 조회

   - 자동 메일 발송 기능

- 대용량 업로드

   - CSV 파일 기반 고객·차량 데이터 대량 처리

**3. 기술적 특징**

- Layered Architecture 기반 설계

- 커스텀 에러 처리 클래스로 일관된 예외 처리

- 데이터베이스 성능 최적화 및 무결성 보장
  (캐스캐이딩, 트랜잭션, 대용량 처리 최적화)
 
**4. 적용 분야**

- 중고차 매매 업체

- 계약 관리 자동화가 필요한 영업 조직

- 매출 분석 및 고객 관리가 필요한 B2B∙B2C 서비스**  

### 기술 스택  
- **Backend:** node.js, express.js, typescript, tsc, nodemon, jsonwebtoken, bcrypt, multer, ts-node, cookie-parser, dotenv, prisma(ORM)  
- **Database:** Postgresql
- **API문서화:** Swagger
- **공통 Tool:** Git & Github, Discord
- **일정관리:** git issue, notion

---

## 팀원별 구현 기능 상세  

### 조가현  
(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)  

- **소셜 로그인 API**  
  - 구글 소셜 로그인 API를 활용하여 소셜 로그인 기능 구현  
  - 로그인 후 추가 정보 입력을 위한 API 엔드포인트 개발  

- **회원 추가 정보 입력 API**  
  - 회원 유형(관리자, 학생)에 따른 조건부 입력 처리 API 구현  

---

### 권나현  
(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)  

- **차량API**  
  -  
  - 

- **유저 회원가입 API**  
  - 
 
- **계약 목록 조회 API**
  - 

---

### 권은혜
(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)  

- **수강생 정보 관리 API**  
  - `fetch(GET)`을 사용하여 학생의 수강 정보를 조회하는 API 엔드포인트 개발  
  - 수강 정보의 반응형 UI 구성  

- **공용 Button API**  
  - 공통으로 사용할 버튼 기능을 처리하는 API 구현  

---

### 박건영  
(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)  

- **관리자 API**  
  - Path Parameter를 활용한 동적 라우팅 기능 구현  
  - `fetch(PATCH, DELETE)`를 사용하여 학생 정보를 수정하고 탈퇴하는 API 엔드포인트 개발  

- **CRUD 기능**  
  - 학생 정보 CRUD 기능을 제공하는 API 구현  

- **회원관리 슬라이더**  
  - 학생별 정보 목록을 carousel 방식으로 보여주는 API 개발  

---

### 박규남  
(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)  

- **학생 시간 정보 관리 API**  
  - 학생별 시간 정보를 조회하는 API 구현  
  - `fetch(GET)`을 통해 실시간 접속 현황을 관리  

- **수정 및 탈퇴 API**  
  - `fetch(PATCH, DELETE)`을 사용하여 수강생의 개인정보 수정 및 탈퇴 처리  

- **공용 Modal API**  
  - 공통 Modal 컴포넌트를 처리하는 API 구현

 ---
 
### 박성국
(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)  

- **학생 시간 정보 관리 API**  
  - 학생별 시간 정보를 조회하는 API 구현  
  - `fetch(GET)`을 통해 실시간 접속 현황을 관리  

- **수정 및 탈퇴 API**  
  - `fetch(PATCH, DELETE)`을 사용하여 수강생의 개인정보 수정 및 탈퇴 처리  

- **공용 Modal API**  
  - 공통 Modal 컴포넌트를 처리하는 API 구현

---

## 파일 구조  
```
NB2-DEARCARMATE-TEAM1
├─ prisma
│  ├─ models
│  │  ├─ alam.prisma.part
│  │  ├─ car.prisma.part
│  │  ├─ company.prisma.part
│  │  ├─ contract-document.prisma.part
│  │  ├─ contract.prisma.part
│  │  ├─ customer.prisma.part
│  │  ├─ file.prisma.part
│  │  ├─ meeting.prisma.part
│  │  ├─ refresh_token.prisma.part
│  │  └─ user.prisma.part
│  ├─ mock-data.ts
│  ├─ seed.ts
│  └─ seed.ts.part
├─ src
│  ├─ controllers
│  │  ├─ auth.controller.ts
│  │  ├─ car.controller.ts
│  │  ├─ company.controller.ts
│  │  ├─ contract-document.controller.ts
│  │  ├─ contracts.controller.ts
│  │  ├─ customer.controller.ts
│  │  ├─ dashboard.controller.ts
│  │  ├─ images.controller.ts
│  │  └─ user.controller.ts
│  ├─ enums
│  │  ├─ cookie.enum.ts
│  │  └─ user.enum.ts
│  ├─ handlers
│  │  ├─ global-error.handler.ts
│  │  └─ listen.handler.ts
│  ├─ middlewares
│  │  ├─ allow.middleware.ts
│  │  └─ bigint-serialization.middleware.ts
│  ├─ repositories
│  │  ├─ auth.repository.ts
│  │  ├─ car.repository.ts
│  │  ├─ company.repository.ts
│  │  ├─ contract-document.repository.ts
│  │  ├─ contracts.repository.ts
│  │  ├─ customer.repository.ts
│  │  ├─ dashboard.repository.ts
│  │  └─ user.repository.ts
│  ├─ routes
│  │  ├─ auth.router.ts
│  │  ├─ car.router.ts
│  │  ├─ company.router.ts
│  │  ├─ contract-document.router.ts
│  │  ├─ contracts.router.ts
│  │  ├─ customer.router.ts
│  │  ├─ dashboard.router.ts
│  │  ├─ images.router.ts
│  │  └─ user.router.ts
│  ├─ services
│  │  ├─ auth.service.ts
│  │  ├─ car.service.ts
│  │  ├─ company.service.ts
│  │  ├─ contract-document.service.ts
│  │  ├─ contracts.service.ts
│  │  ├─ customer.service.ts
│  │  ├─ dashboard.service.ts
│  │  ├─ images.service.ts
│  │  └─ user.service.ts
│  ├─ types
│  │  ├─ car.type.ts
│  │  ├─ company.type.ts
│  │  ├─ contract-document.type.ts
│  │  ├─ contract.type.ts
│  │  ├─ customer.type.ts
│  │  ├─ dashboard.type.ts
│  │  ├─ error.type.ts
│  │  ├─ express.d.ts
│  │  ├─ payload.type.ts
│  │  └─ user.type.ts
│  ├─ utils
│  │  ├─ bigint.util.ts
│  │  ├─ convert.util.ts
│  │  ├─ env.util.ts
│  │  ├─ error.util.ts
│  │  ├─ file.util.ts
│  │  ├─ firebase.ts
│  │  ├─ parse.util.ts
│  │  ├─ password.util.ts
│  │  ├─ token.util.ts
│  │  └─ user.util.ts
│  └─ app.ts
├─ .env.example
├─ .gitignore
├─ package-lock.json
├─ package.json
├─ README.md
└─ tsconfig.json
```
---

## 구현 홈페이지  
[https://www.codeit.kr/](https://www.codeit.kr/)

---

## 프로젝트 회고록  
(제작한 발표자료 링크 혹은 첨부파일 첨부)

