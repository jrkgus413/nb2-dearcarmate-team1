## 팀 이름

### NB2-DearCarmate-Team1

(팀 협업 문서 링크 게시)

---

## 팀원 구성

- **조가현** [(개인 Github 링크)](https://github.com/jrkgus413/nb02-dear-carmate-report/blob/main/README.md)
- **권나현** [(개인 Github 링크)](https://github.com/kwonnahyun0125/NB2_Dear-Carmate-Team1-Report/blob/main/README.md)
- **권은혜** [(개인 Github 링크)](#)
- **박건영** [(개인 Github 링크)](#)
- **박규남** [(개인 Github 링크)](https://github.com/gyunam-bark/nb02-dear-carmate-development-report)
- **박성국** [(개인 Github 링크)](https://adhesive-seagull-c5e.notion.site/2071de3a2b0b80f3a54dfde6f48f798a?pvs=74)

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

- 매출 분석 및 고객 관리가 필요한 B2B∙B2C 서비스\*\*

### 기술 스택

- **Backend:** node.js, express.js, typescript, tsc, nodemon, jsonwebtoken, bcrypt, multer, ts-node, cookie-parser, dotenv, prisma(ORM)
- **Database:** Postgresql
- **API문서화:** Swagger
- **공통 Tool:** Git & Github, Discord
- **일정관리:** git issue, notion

---

## 팀원별 구현 기능 상세

### 조가현

- **유저 API**
  - `[GET] /users/me`  로그인한 사용자의 정보 조회 API 구현
  - `[PATCH] /users/me` 로그인한 사용자의 정보 수정 API 구현
    - 유저 프로필 이미지 수정 시 imageUrl 갱신

- **회사 API**
  - `[POST] /companies` 회사 등록 API 구현
  - `[GET] /companies` 회사 목록 조회 API 구현
    - 회사 검색 및 페이지네이션
  - `[GET] /companies/users` 회사별 유저 목록 API 구현
    - 유저 검색 및 페이지네이션
  - `[PATCH] /companies/{companyId}` 회사 수정 API 구현
  - `[DELETE] /companies/{companyId}` 회사 삭제 API 구현

- **대시보드 API**
  - `[GET] /dashboard`
    - 이번달 매출 / 지난달 매출 / 성장률 계산
    - 차량 타입별 매출액
    - 차량 타입별 계약 수
    - 진행 중인 계약 건수
    - 완료된 계약 건수
  - 트랜잭션 적용을 적용하여 데이터 베이스 최적화 처리
  

- **Bigint 변환 미들웨어**
  - BigInt 값을 응답 시 숫자로 변환하되, 자바스크립트 정수 범위 이상일 경우 문자열로 처리하는 전역 미들웨어
  - BigInt 타입의 필드 응답 시 JSON 직렬화 오류 발생
  - 모든 ID는 기본 bigint 타입으로 개별 컨트롤러에서 변환하는 방식보다 전역 처리 방식으로 적용

- **회원탈퇴 UI**
  - API 명세에만 정의된 회원 탈퇴 기능을 실제 화면에 적용할 수 있도록, 샘플 프론트엔드 코드에 회원 탈퇴 버튼 UI 추가

---

### 권나현

<img width="1434" height="750" alt="스크린샷 2025-08-13 002515" src="https://github.com/user-attachments/assets/dbe8e000-5cb9-4def-bd2b-5fc2d647ec09" />

- **차량 API**

  - `[POST] /cars` : 차량 등록
  - `[GET] /cars` : 차량 목록 조회
  - `[PATCH] /cars/{carId}` : 차량 수정  
  - `[DELETE] /cars/{carId}` : 차량 삭제
  - `[GET] /cars/{carId}` : 차량 모델 목록 조회
  - 차량 검색 및 페이지네이션
  - 차량 이미지 수정 시 imageUrl 갱신

- **유저 API**

  - `[POST] /users` : 회원가입 

- **계약 API**
  - `[GET] /contracts` : 목록 조회

---

### 권은혜

- 유저 삭제·회원 탈퇴 API

   - 일반 유저의 자기 계정 삭제(회원 탈퇴) 엔드포인트 DELETE /users/me와, 관리자가 특정 유저를 삭제(유저 삭제) 하는 엔드포인트        DELETE /users/:id 구현. 
   - fetch(DELETE)로 소프트 삭제(isDeleted, deletedAt) 처리.

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

---

### 박규남

(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)

- **헬스체크**

  - `[GET] /` : 서버 헬스체크 구현

- **인증 API / 검증 미들웨어**

  - `[POST] auth/login` : 사용자 로그인 구현 및 토큰 발급
  - `[POST] auth/refresh` : `accessToken` 및 `refreshToken` 재발급
  - `[MIDDLEWARE] allow` : 토큰 검증 미들웨어 구현, `토큰 인증` 및 `req 확장` 구현

- **계약 API**

  - `[POST] contracts/` : 계약 생성
  - `[PATCH] contracts/:id` : 계약 수정

- **이미지 업로드 API**

  - \[multer\] \-\> \[firebase\] \-\> \[postgresql\] \-\> \[return url\]
  - `[POST] images/upload` : 이미지 업로드(사용자, 차량) 기능

- **파일 업로드 API**

  - \[multer\] \-\> \[firebase\] \-\> \[postgresql\] \-\> \[return url\]
  - `[POST] contractDocument/upload` : 파일 업로드 기능

- **파일 다운로드 API**

  - \[postgresql\] \-\> \[return url\] \-\> \[frontend\] \-\> \[axios.get:blob\]
  - `[POST] contractDocument/:id/download` : 파일 다운로드 기능
  - 실제로 파일을 다운로드 받을 수 있도록 프론트엔드 코드 수정

- **대용량 업로드 API**

  - \[multer\] \-\> \[csvToCarList / csvToCustomerList\] \-\> \[postgresql\]
  - `[POST] cars/upload` : 차량 업로드 기능
  - `[POST] customers/upload` : 고객 업로드 기능

- **NotFound 핸들러 미들웨어**

  - `NotFoundHandler` : 지원하지 않는 API 에 접근 했을 때 공통적으로 `404` 에러를 반환하는 미들웨어

- **글로벌 에러 핸들러 미들웨어**

  - `GlobalErrorHandler` : API 서버에서 발생하는 에러를 처리하는 에러 핸들러 미들웨어

- **파이어베이스 스토리지 연동/관리**

  - `GCS Bucket CORS 관리` : `GCSUTIL CLI` 를 사용해서 `cors.json` 업로드하여 권한 수정

- **프론트엔드 배포**

  - `vercel` 을 사용하여 배포
  - `차량` 항목에 이미지(imageURL)을 추가하고 변경할 수 있도록 프론트엔드 코드 수정

  ***

### 박성국

- **고객 API**

  - `POST /customers`: 고객 등록
  - `GET /customers`: 고객 목록 조회
  - `GET /customers/{customerId}`: 고객 상세 정보 조회
  - `PATCH /customers/{customerId}`: 고객 수정
  - `DELETE /customers/{customerId}`: 고객 삭제

- **문서 API**
  - `/api-docs`: swagger 문서 API

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
