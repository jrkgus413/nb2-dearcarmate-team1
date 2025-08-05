import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('기존 데이터 삭제 중...');

  // 모든 데이터 삭제
  await prisma.contract.deleteMany();
  await prisma.car.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  console.log('회사 데이터 다시 생성 중...');

  await prisma.company.createMany({
    data: [
      { name: '햇살카', companyCode: 'sunshine' },
      { name: '케이카', companyCode: 'kcar' },
      { name: '굿모닝카', companyCode: 'goodmorning' },
      { name: '행복카', companyCode: 'happy' },
      { name: '믿음카', companyCode: 'trust' },
      { name: '신뢰카', companyCode: 'reliable' },
      { name: '우리카', companyCode: 'ourcar' },
      { name: '미래카', companyCode: 'future' }
    ]
  });

  console.log('Seed 완료!');
}

main()
  .catch((e) => {
    console.error('Seed 실패:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
