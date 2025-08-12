import { PrismaClient, Prisma, type User, type Car, type Customer, type Contract } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';

type UserLite = Pick<User, 'id' | 'companyId' | 'name'>;
type CarLite = Pick<Car, 'id' | 'companyId' | 'carNumber' | 'manufacturer' | 'model'>;
type CustomerLite = Pick<Customer, 'id' | 'companyId'>;
type ContractLite = Pick<Contract, 'id' | 'status' | 'companyId'>;

const prisma = new PrismaClient();

// --- 고정 데이터 -------------------------------------------------------------
const COMPANIES = [
  { name: '햇살카', companyCode: 'sunshine' },
  { name: '케이카', companyCode: 'kcar' },
  { name: '굿모닝카', companyCode: 'goodmorning' },
  { name: '행복카', companyCode: 'happy' },
  { name: '믿음카', companyCode: 'trust' },
  { name: '신뢰카', companyCode: 'reliable' },
  { name: '우리카', companyCode: 'ourcar' },
  { name: '미래카', companyCode: 'future' },
] as const;

const MANUFACTURERS: Record<string, string[]> = {
  '현대': ['아반떼', '쏘나타', '그랜저', '투싼', '베뉴', '싼타페', '팰리세이드', '아이오닉5', '아이오닉6'],
  '기아': ['K3', 'K5', 'K7', 'K9', 'K8', '스포티지', '쏘렌토', '셀토스', 'EV6'],
  'BMW': ['320i', '520d', 'X5'],
  '벤츠': ['E클래스', 'S클래스', 'GLC'],
  '쉐보레': ['스파크', '말리부', '트랙스'],
  '아우디': ['A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron'],
  '폭스바겐': ['골프', '파사트', '티구안', '투아렉', 'ID.4', 'ID.3'],
  '도요타': ['프리우스', '캠리', '라브4'],
  '테슬라': ['모델3', '모델Y', '모델S'],
  '르노': ['클리오', '캡처', '조에', '마스터', '트위지'],
  '볼보': ['XC40', 'XC60', 'XC90'],
  '지프': ['랭글러', '체로키', '그랜드 체로키'],
};

const CONTRACT_STATUS = {
  SUCCESS: 'contractSuccessful',
  FAIL: 'contractFailed',
  INSPECTION: 'carInspection',
  NEGOTIATION: 'priceNegotiation',
  DRAFT: 'contractDraft',
} as const;

const REGIONS = ['서울','경기','인천','부산','대구','대전','광주','울산','세종','강원','충북','충남','전북','전남','경북','경남','제주'];
const AGE_GROUPS = ['20대','30대','40대','50대','60대'];

const MALE_FIRST = ['민준','도윤','예준','시우','하준','서준','지호','우진','현우','준우','유준','성민'];
const FEMALE_FIRST = ['서연','서윤','하윤','지우','하은','지아','지유','예나','채원','소율','가은','민서'];
const LAST = ['김','이','박','최','정','윤','임','한','오','서','조','장'];

function pick<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function phone() { return `010-${randInt(1000,9999)}-${randInt(1000,9999)}`; }
function plate() {
  const pref = ['11','12','13','20','21','22','23','24','25','26','27','28','29','30'];
  const mid = ['가','나','다','라','마','바','사','아'];
  return `${pick(pref)}${pick(mid)}${randInt(1000,9999)}`;
}
function person(g: 'M'|'F') {
  return `${pick(LAST)}${pick(g === 'M' ? MALE_FIRST : FEMALE_FIRST)}`;
}

async function main() {
  console.log('🔄 Clear...');
  // 참조 순서대로 삭제
  await prisma.alarm.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.contractDocument.deleteMany();
  await prisma.file.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.carImage.deleteMany();
  await prisma.car.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.userImage.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  console.log('🏢 Companies (8)');
  const companies = await Promise.all(COMPANIES.map(c =>
    prisma.company.create({ data: { name: c.name, companyCode: c.companyCode } })
  ));

  const companyIds = companies.map(c => c.id);

  await prisma.user.create({
    data: {
      name: 'Platform Admin',
      email: 'admin@dearcarmate.com',
      phoneNumber: '010-0000-0000',
      password: await bcrypt.hash('admin1234', 10), // 꼭 해시
      image_url: null,
      company: '플랫폼',
      companyId: companyIds[0], // 임시로 첫 번째 회사에 귀속
      companyCode: 'platform',
      employeeNumber: 'ADMIN-001',
      isDeleted: false,
      isAdmin: true,
    }
  });

  console.log('👥 Users (16: 회사별 2명 / 남10 여6)');
  const hash = await bcrypt.hash('password', 10);
  const genderPlan: ('M'|'F')[] = [
    'M','M','M','M','M','M','M','M','M','M',
    'F','F','F','F','F','F'
  ];
  let gIdx = 0;
  const users: UserLite[] = [];
  for (const c of companies) {
    for (let i=1;i<=2;i++) {
      const g = genderPlan[gIdx++ % genderPlan.length];
      const u = await prisma.user.create({
        data: {
          name: person(g),
          email: `user${i}@${c.companyCode}.com`,
          phoneNumber: phone(),
          password: hash,
          image_url: null,
          company: c.name,                 // 문자열 필드
          companyId: c.id,                 // FK (affiliatedCompany)
          companyCode: c.companyCode,
          employeeNumber: `E-${c.companyCode}-${String(i).padStart(2,'0')}`,
          isDeleted: false,
          isAdmin: false,
        }
      });
      users.push(u);
    }
  }

  console.log('🚗 Cars (59: 모델당 1대, 라운드로빈 회사 배정)');
  const carList = Object.entries(MANUFACTURERS).flatMap(([m, models]) =>
    models.map(model => ({ manufacturer: m, model }))
  ); // 59개

  const cars: CarLite[] = [];
  for (let i=0;i<carList.length;i++) {
    const item = carList[i];
    const companyId = companyIds[i % companyIds.length];

    const manufacturingYear = randInt(2018, 2025);
    const mileage = BigInt(randInt(5_000, 120_000));
    const price = BigInt(randInt(800, 7500) * 10000); // 원
    const accidentCount = pick([0,0,0,1,1,2]);

    const car = await prisma.car.create({
      data: {
        carNumber: plate(),
        manufacturer: item.manufacturer,
        model: item.model,
        type: '세단', // 필요 시 'SUV','전기','해치백' 등으로 가변 처리
        manufacturingYear,
        mileage,
        price,
        totalPrice: null,
        accidentCount,
        explanation: `${item.manufacturer} ${item.model} ${manufacturingYear}년식`,
        accidentDetails: accidentCount ? '단순 판금/도색' : null,
        status: 'AVAILABLE',      // 문자열 스키마이므로 임의값. 프론트 기준 필요 시 변경
        imageUrl: null,
        companyId
      }
    });
    cars.push(car);
  }

  console.log('👨‍👩‍👧 Customers (100)');
  // companyId 라운드로빈, gender/연령대 고루 분포
  const customers: CustomerLite[] = [];
  for (let i=0;i<100;i++) {
    const isMale = i % 2 === 0;
    const c = await prisma.customer.create({
      data: {
        name: person(isMale ? 'M' : 'F'),
        gender: isMale ? 'MALE' : 'FEMALE',         // 문자열
        phoneNumber: phone(),
        email: Math.random() < 0.3 ? null : `customer${i+1}@example.com`,
        ageGroup: pick(AGE_GROUPS),                 // 문자열 VarChar(7)
        region: pick(REGIONS),
        memo: '시드 생성 고객',
        companyId: companyIds[i % companyIds.length],
        isDeleted: false,
      }
    });
    customers.push(c);
  }

  console.log('📄 Contracts (80) - 분포 맞춤 & 필드명 매핑');
  // 분포: 성공57, 실패2, 차량확인11, 가격협의4, 계약서작성6
  const statusPool: Array<Contract['status']> = [
    ...Array(57).fill(CONTRACT_STATUS.SUCCESS),
    ...Array(2).fill(CONTRACT_STATUS.FAIL),
    ...Array(11).fill(CONTRACT_STATUS.INSPECTION),
    ...Array(4).fill(CONTRACT_STATUS.NEGOTIATION),
    ...Array(6).fill(CONTRACT_STATUS.DRAFT),
  ];
  // shuffle
  for (let i = statusPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [statusPool[i], statusPool[j]] = [statusPool[j], statusPool[i]];
  }

  const contracts: ContractLite[] = [];
  let carIdx = 0;
  for (let i=0;i<statusPool.length;i++) {
    const car = cars[carIdx++ % cars.length];
    const companyId = car.companyId;
    const assignees = users.filter(u => u.companyId === companyId);
    const user = pick(assignees);
    const customer = pick(customers.filter(x => x.companyId === companyId));

    const status = statusPool[i];
    const createdAt = new Date(2025, randInt(0,7), randInt(1,28), randInt(9,18), 0, 0);
    const resolutionDate =
      (status === CONTRACT_STATUS.SUCCESS || status === CONTRACT_STATUS.FAIL)
        ? new Date(createdAt.getTime() + randInt(1,10) * 86400000)
        : null;

    const contract = await prisma.contract.create({
      data: {
        userName: user.name,
        contractName: `중고차 거래 - ${car.manufacturer} ${car.model}`,
        carNumber: car.carNumber,
        status, // 문자열 필드
        contractPrice: new Prisma.Decimal(randInt(1_000_000, 80_000_000)),
        resolutionDate,
        createdAt,
        isDeleted: false,
        carId: car.id,
        customerId: customer.id,
        userId: user.id,
        companyId
      }
    });
    contracts.push({ id: contract.id, status: contract.status, companyId: contract.companyId });
  }

  console.log('🗂️ Files + ContractDocuments (57 for successful)');
  const successful = contracts.filter(c => c.status === CONTRACT_STATUS.SUCCESS).slice(0, 57);

  for (let i=0;i<successful.length;i++) {
    const c = successful[i];
    // File 먼저 생성
    const f = await prisma.file.create({
      data: {
        url: `https://example.com/contracts/${c.id}/계약서_${i+1}.pdf`, // ✅ 유니크
        name: `계약서_${String(i+1).padStart(2,'0')}.pdf`,
        ext: 'pdf',
        size: BigInt(1_024_000), // 약 1MB
        isDeleted: false,
      }
    });

    // ContractDocument 연결
    await prisma.contractDocument.create({
      data: {
        contractId: c.id,
        fileId: f.id,
        fileName: f.name,
      }
    });
  }

  console.log('✅ Seed Done.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
