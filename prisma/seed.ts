import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

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
  })

  console.log('관리자 계정 생성 중…');
  const company = await prisma.company.findUnique({ where: { companyCode: 'kcar' } });
  if (!company) throw new Error('Seed: kcar 회사가 없습니다');

  const adminPassword = await bcrypt.hash('AdminPass123!', 10);
  await prisma.user.create({
    data: {
      name: '관리자',
      email: 'admin@example.com',
      employeeNumber: '0000',
      phoneNumber: '010-0000-0000',
      password: adminPassword,
      isAdmin: true,
      deletedAt: null,
      isDeleted: false,
      company: company.name,
      companyCode: company.companyCode,
      affiliatedCompany: { connect: { id: company.id } }
    }
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
