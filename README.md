## 팀 이름  
### NB2-DearCarmate-Team1

(팀 협업 문서 링크 게시)

---

## 팀원 구성  
- **조가현** [(개인 Github 링크)](#)  
- **권나현** [(개인 Github 링크)](https://github.com/kwonnahyun0125/NB2_Dear-Carmate-Team1-Report/blob/main/README.md)  
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
<img width="1434" height="750" alt="스크린샷 2025-08-13 002515" src="https://github.com/user-attachments/assets/dbe8e000-5cb9-4def-bd2b-5fc2d647ec09" />

- **차량API**  
   - 차량 등록/수정/삭제/목록 조회
   - 차량 검색 및 페이지네이션
   - 차량 이미지 수정 시 imageUrl 갱신 

- **유저 API**  
  - 회원가입 기능 구현
 
- **계약 API**
  - 목록 조회 기능 구현

---

### 권은혜
(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)  

- 유저 삭제·회원 탈퇴 API
   - 본인 탈퇴 및 관리자 유저 삭제 엔드포인트 구현 (DELETE /users/me, DELETE /users/:id)
   - fetch(DELETE)을 사용하여 소프트 삭제(isDeleted, deletedAt) 처리

- 권한 검증 및 예외 처리
   - JWT 인증 및 Role 체크로 관리자 전용 삭제 보호
   - BigInt ID 변환(문자열→BigInt)과 403/404/409 예외 규격화

- **공용 Modal API**  
  - 탈퇴/삭제 확인용 공통 Modal 컴포넌트 상태/콜백 처리
---

### 박건영  
차량 목록 조회
<img width="567" height="582" alt="image" src="https://github.com/user-attachments/assets/e392b0ef-a0cc-41d8-a584-3eaa163105c5" />
고객 목록 조회
<img width="571" height="556" alt="image" src="https://github.com/user-attachments/assets/1581cfee-0a86-4422-8ecc-7593ec46484f" />
유저 목록 조회
<img width="756" height="481" alt="image" src="https://github.com/user-attachments/assets/1ec33481-ba53-43db-b09a-2bfb489823f2" />

- **계약용 차량 목록 조회 API**  
  - 계약 시에 필요한 차량 목록을 보여주는 api 구현  
- **계약용 고객 목록 조회 API**  
  - 계약 시에 필요한 고객의 목록을 보여주는 api 구현
- **계약용 유저 목록 조회 API**  
  - 계약 시에 필요한 유저 목록을 보여주는 api 구현

개인 개발 레포트 = "https://github.com/geonyoung28/-/blob/main/README.md" 
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
├─ .env
├─ .gitignore
├─ package-lock.json
├─ package.json
├─ README.md
└─ tsconfig.json
```
---

## 구현 홈페이지  
- 백엔드 : https://nb2-dearcarmate-team1.onrender.com/

- 프론트엔드 : https://www.nb02-dearcarmate.online/signin
---

## 프로젝트 회고록  
시연영상
<img width="1283" height="665" alt="스크린샷 2025-08-13 021325" src="https://github.com/user-attachments/assets/fa6f013b-3975-49a9-ab55-e651b5b58770" />
<img width="1282" height="720" alt="스크린샷 2025-08-13 021437" src="https://github.com/user-attachments/assets/5100d734-4006-4c5a-9c9a-d9a1aec4c9bb" />
<img width="1283" height="719" alt="스크린샷 2025-08-13 021449" src="https://github.com/user-attachments/assets/908c1fd4-1a91-4b83-bf2c-6e841652e0ac" />
<img width="1281" height="719" alt="스크린샷 2025-08-13 021517" src="https://github.com/user-attachments/assets/fbeaaeb3-9b0a-4be7-a761-40fec3a0ca46" />
<img width="1281" height="719" alt="스크린샷 2025-08-13 021537" src="https://github.com/user-attachments/assets/c9a59357-1c50-403f-904b-99a0a0cf4806" />
<img width="1281" height="720" alt="스크린샷 2025-08-13 021551" src="https://github.com/user-attachments/assets/7df16ecd-56f3-435e-87a8-d6d72504c262" />
<img width="1279" height="718" alt="스크린샷 2025-08-13 021636" src="https://github.com/user-attachments/assets/3059feed-00f7-4fd8-8971-ae3f7aa13cbf" />
<img width="1281" height="720" alt="스크린샷 2025-08-13 021647" src="https://github.com/user-attachments/assets/45fc80bd-6a43-4950-aa61-ba9fd55190f4" />
<img width="1280" height="719" alt="스크린샷 2025-08-13 021701" src="https://github.com/user-attachments/assets/7d254102-2219-4e98-81e4-7a777af16311" />
<img width="1282" height="718" alt="스크린샷 2025-08-13 021726" src="https://github.com/user-attachments/assets/2d2c7430-b4b1-48a3-8d99-aa046bc28cc0" />
<img width="1280" height="718" alt="스크린샷 2025-08-13 022300" src="https://github.com/user-attachments/assets/ca5dfeee-4f17-4ebf-90fb-b2fd35a288d7" />
<img width="1281" height="720" alt="스크린샷 2025-08-13 021802" src="https://github.com/user-attachments/assets/8b5c4a06-745b-4afd-b1e1-901a2a26d212" />
<img width="1280" height="719" alt="스크린샷 2025-08-13 021818" src="https://github.com/user-attachments/assets/12e134fe-6ee1-4e1f-b344-62198807e5fb" />
<img width="1281" height="718" alt="스크린샷 2025-08-13 021832" src="https://github.com/user-attachments/assets/b6ab57ab-473c-4b70-abaa-56bfde89578f" />
<img width="1283" height="719" alt="스크린샷 2025-08-13 022400" src="https://github.com/user-attachments/assets/315619af-5cd7-497d-9f13-ccd29fd04d4a" />
<img width="1279" height="720" alt="스크린샷 2025-08-13 021848" src="https://github.com/user-attachments/assets/3b70c2fc-90e2-4121-9b8e-39f3dc7f4df9" />
<img width="1280" height="719" alt="스크린샷 2025-08-13 022550" src="https://github.com/user-attachments/assets/ebcd6331-f892-4236-8dfc-427c02c80c8b" />
<img width="1281" height="721" alt="스크린샷 2025-08-13 021939" src="https://github.com/user-attachments/assets/6b9061af-0187-4da6-b522-cfeee3c13ad2" />
<img width="1280" height="719" alt="스크린샷 2025-08-13 021949" src="https://github.com/user-attachments/assets/7e0e6bb8-07a1-42f8-8f30-cd3e4f7800a6" />
<img width="1278" height="719" alt="스크린샷 2025-08-13 022001" src="https://github.com/user-attachments/assets/b4242dd3-4cdf-49d9-80a1-adc5557d4270" />
<img width="1281" height="719" alt="스크린샷 2025-08-13 022014" src="https://github.com/user-attachments/assets/7575dfa1-5352-4bb4-8af5-4eed8c8ce2ae" />





























