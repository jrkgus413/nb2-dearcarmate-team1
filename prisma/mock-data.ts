// 목 데이터 정의 파일

// 회사 목 데이터
export const mockCompanies = [
  {
    name: "서울자동차",
    companyCode: "SEOUL_AUTO_001"
  },
  {
    name: "부산모터스",
    companyCode: "BUSAN_MOTORS_002"
  },
  {
    name: "대구카센터",
    companyCode: "DAEGU_CAR_003"
  }
];

// 사용자 목 데이터 (비밀번호는 시드에서 해시화됨)
export const mockUsers = [
  {
    name: "김철수",
    email: "kim.cs@seolauto.com",
    phoneNumber: "010-1234-5678",
    password: "password123",
    companyCode: "SEOUL_AUTO_001",
    employeeNumber: "EMP001",
    isAdmin: true
  },
  {
    name: "이영희",
    email: "lee.yh@seolauto.com", 
    phoneNumber: "010-2345-6789",
    password: "password123",
    companyCode: "SEOUL_AUTO_001",
    employeeNumber: "EMP002",
    isAdmin: false
  },
  {
    name: "박민수",
    email: "park.ms@busanmotors.com",
    phoneNumber: "010-3456-7890",
    password: "password123",
    companyCode: "BUSAN_MOTORS_002", 
    employeeNumber: "EMP003",
    isAdmin: true
  },
  {
    name: "최지연",
    email: "choi.jy@daegucar.com",
    phoneNumber: "010-4567-8901",
    password: "password123",
    companyCode: "DAEGU_CAR_003",
    employeeNumber: "EMP004",
    isAdmin: false
  }
];

// 고객 목 데이터
export const mockCustomers = [
  {
    name: "홍길동",
    gender: "MALE",
    phoneNumber: "010-1111-2222",
    email: "hong@example.com",
    ageGroup: "THIRTY",
    region: "SEOUL",
    memo: "신차 구매 희망 고객"
  },
  {
    name: "김영수",
    gender: "MALE", 
    phoneNumber: "010-3333-4444",
    email: "kim.ys@example.com",
    ageGroup: "FORTY",
    region: "GG",
    memo: "SUV 선호"
  },
  {
    name: "이미영",
    gender: "FEMALE",
    phoneNumber: "010-5555-6666", 
    email: "lee.my@example.com",
    ageGroup: "TWENTY",
    region: "BUSAN",
    memo: "첫 차 구매"
  },
  {
    name: "박준호",
    gender: "MALE",
    phoneNumber: "010-7777-8888",
    email: "park.jh@example.com", 
    ageGroup: "FIFTY",
    region: "DAEGU",
    memo: "럭셔리 세단 관심"
  },
  {
    name: "정수진",
    gender: "FEMALE",
    phoneNumber: "010-9999-0000",
    email: "jung.sj@example.com",
    ageGroup: "THIRTY",
    region: "INCH",
    memo: "컴팩트카 선호"
  }
];

// 차량 목 데이터
export const mockCars = [
  {
    carNumber: "12가3456",
    manufacturer: "현대",
    model: "아반떼",
    type: "경·소형",
    manufacturingYear: 2022,
    mileage: 15000,
    price: 18000000,
    totalPrice: 18500000,
    accidentCount: 0,
    explanation: "무사고 차량, 정기 점검 완료",
    status: "판매중",
    imageUrl: "https://example.com/car1.jpg"
  },
  {
    carNumber: "34나5678", 
    manufacturer: "기아",
    model: "쏘렌토",
    type: "SUV",
    manufacturingYear: 2021,
    mileage: 32000,
    price: 28000000,
    totalPrice: 29000000,
    accidentCount: 1,
    explanation: "7인승 SUV, 상태 양호",
    accidentDetails: "경미한 접촉사고 1회 (범퍼 교체)",
    status: "판매중",
    imageUrl: "https://example.com/car2.jpg"
  },
  {
    carNumber: "56다7890",
    manufacturer: "BMW",
    model: "320i",
    type: "준중·중형",
    manufacturingYear: 2020,
    mileage: 45000,
    price: 35000000,
    totalPrice: 36000000,
    accidentCount: 0,
    explanation: "프리미엄 세단, 풀옵션",
    status: "예약중",
    imageUrl: "https://example.com/car3.jpg"
  },
  {
    carNumber: "78라9012",
    manufacturer: "벤츠",
    model: "E-Class",
    type: "대형",
    manufacturingYear: 2019,
    mileage: 68000,
    price: 42000000,
    totalPrice: 43500000,
    accidentCount: 2,
    explanation: "럭셔리 세단",
    accidentDetails: "측면 충돌 1회, 후방 추돌 1회 (모두 수리 완료)",
    status: "판매완료",
    imageUrl: "https://example.com/car4.jpg"
  },
  {
    carNumber: "90마1234",
    manufacturer: "토요타",
    model: "캠리",
    type: "준중·중형",
    manufacturingYear: 2023,
    mileage: 8000,
    price: 32000000,
    totalPrice: 33000000,
    accidentCount: 0,
    explanation: "최신형 하이브리드",
    status: "판매중",
    imageUrl: "https://example.com/car5.jpg"
  }
];

// 파일 목 데이터
export const mockFiles = [
  {
    url: "https://example.com/files/user1-profile.jpg",
    name: "user1-profile.jpg",
    ext: "jpg",
    size: 1024000
  },
  {
    url: "https://example.com/files/car1-main.jpg",
    name: "car1-main.jpg", 
    ext: "jpg",
    size: 2048000
  },
  {
    url: "https://example.com/files/car1-interior.jpg",
    name: "car1-interior.jpg",
    ext: "jpg", 
    size: 1536000
  },
  {
    url: "https://example.com/files/contract1.pdf",
    name: "contract1.pdf",
    ext: "pdf",
    size: 512000
  },
  {
    url: "https://example.com/files/contract2.pdf", 
    name: "contract2.pdf",
    ext: "pdf",
    size: 768000
  }
];

// 계약 목 데이터
export const mockContracts = [
  {
    contractName: "현대 아반떼 구매 계약서",
    status: "contractDraft",
    resolutionDate: new Date("2025-08-15")
  },
  {
    contractName: "기아 쏘렌토 구매 계약서",
    status: "contractSuccessful",
    resolutionDate: new Date("2025-07-20") // 현재 월 (7월)
  },
  {
    contractName: "BMW 320i 구매 계약서",
    status: "contractDraft", 
    resolutionDate: new Date("2025-08-30")
  },
  {
    contractName: "벤츠 E-Class 구매 계약서",
    status: "contractSuccessful",
    resolutionDate: new Date("2025-06-15") // 지난 월 (6월)
  },
  {
    contractName: "토요타 캠리 구매 계약서",
    status: "contractSuccessful",
    resolutionDate: new Date("2025-07-25") // 현재 월 (7월)
  }
];

// 계약서 문서 목 데이터
export const mockContractDocuments = [
  // Contract 1 - File 4 (contract1.pdf)
  {},
  // Contract 2 - File 5 (contract2.pdf) 
  {},
  // Contract 3 - File 4 (contract1.pdf) - 같은 파일 재사용
  {}
];

// 차량 이미지 목 데이터
export const mockCarImages = [
  // Car 1 - File 2 (car1-main.jpg)
  {},
  // Car 1 - File 3 (car1-interior.jpg)
  {},
  // Car 2 - File 2 (car1-main.jpg) - 재사용
  {}
];

// 사용자 이미지 목 데이터
export const mockUserImages = [
  // User 1 - File 1 (user1-profile.jpg)
  {}
];

// 미팅 목 데이터
export const mockMeetings = [
  // Contract 1
  {},
  // Contract 2
  {},
  // Contract 3
  {}
];

// RefreshToken 목 데이터 (각 사용자당 1개씩)
export const mockRefreshTokens = [
  // User 1 (김철수 - 관리자)
  {
    expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)) // 7일 후
  },
  // User 2 (이영희 - 일반사용자)
  {
    expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))
  },
  // User 3 (박민수 - 관리자)
  {
    expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))
  },
  // User 4 (최지연 - 일반사용자)
  {
    expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))
  }
];
