import { PrismaClient, Company, User, Customer, Car, File, Contract } from '@prisma/client';
import {
  mockCompanies,
  mockUsers,
  mockCustomers,
  mockCars,
  mockFiles,
  mockContracts,
  mockMeetings
} from './mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 시드 데이터 생성을 시작합니다...');

  try {
    // 1. 기존 데이터 삭제 (순서 중요: 참조 관계 고려)
    console.log('🗑️  기존 데이터를 삭제합니다...');
    await prisma.meeting.deleteMany();
    await prisma.contractDocument.deleteMany();
    await prisma.contract.deleteMany();
    await prisma.carImage.deleteMany();
    await prisma.userImage.deleteMany();
    await prisma.file.deleteMany();
    await prisma.car.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();
    await prisma.refreshToken.deleteMany();

    // 2. 회사 데이터 생성
    console.log('🏢 회사 데이터를 생성합니다...');
    const companies: Company[] = [];
    for (const companyData of mockCompanies) {
      const company = await prisma.company.create({
        data: companyData
      });
      companies.push(company);
      console.log(`   ✅ 회사 생성: ${company.name}`);
    }

    // 3. 사용자 데이터 생성
    console.log('👥 사용자 데이터를 생성합니다...');
    const users: User[] = [];
    for (let i = 0; i < mockUsers.length; i++) {
      const userData = mockUsers[i];
      // 간단한 해시 함수로 대체 (bcrypt 없이)
      const hashedPassword = `hashed_${userData.password}`;
      
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          password: hashedPassword,
          companyCode: userData.companyCode,
          employeeNumber: userData.employeeNumber,
          isAdmin: userData.isAdmin,
          companyId: companies[i % companies.length].id
        }
      });
      users.push(user);
      console.log(`   ✅ 사용자 생성: ${user.name} (${user.email})`);
    }

    // 4. 고객 데이터 생성
    console.log('🧑‍🤝‍🧑 고객 데이터를 생성합니다...');
    const customers: Customer[] = [];
    for (let i = 0; i < mockCustomers.length; i++) {
      const customerData = mockCustomers[i];
      const customer = await prisma.customer.create({
        data: {
          ...customerData,
          companyId: companies[i % companies.length].id
        }
      });
      customers.push(customer);
      console.log(`   ✅ 고객 생성: ${customer.name} (${customer.email})`);
    }

    // 5. 차량 데이터 생성
    console.log('🚗 차량 데이터를 생성합니다...');
    const cars: Car[] = [];
    for (let i = 0; i < mockCars.length; i++) {
      const carData = mockCars[i];
      const car = await prisma.car.create({
        data: {
          ...carData,
          companyId: companies[i % companies.length].id
        }
      });
      cars.push(car);
      console.log(`   ✅ 차량 생성: ${car.manufacturer} ${car.model} (${car.carNumber})`);
    }

    // 6. 파일 데이터 생성
    console.log('📁 파일 데이터를 생성합니다...');
    const files: File[] = [];
    for (const fileData of mockFiles) {
      const file = await prisma.file.create({
        data: fileData
      });
      files.push(file);
      console.log(`   ✅ 파일 생성: ${file.name}`);
    }

    // 7. 계약 데이터 생성
    console.log('📋 계약 데이터를 생성합니다...');
    const contracts: Contract[] = [];
    for (let i = 0; i < mockContracts.length; i++) {
      const contractData = mockContracts[i];
      const contract = await prisma.contract.create({
        data: {
          contractName: contractData.contractName,
          resolutionDate: contractData.resolutionDate,
          status: contractData.status,
          carId: cars[i % cars.length].id,
          customerId: customers[i % customers.length].id,
          userId: users[i % users.length].id
        }
      });
      contracts.push(contract);
      console.log(`   ✅ 계약 생성: ${contract.status} (ID: ${contract.id})`);
    }    // 8. 사용자 이미지 데이터 생성
    console.log('🖼️  사용자 이미지 데이터를 생성합니다...');
    await prisma.userImage.create({
      data: {
        fileId: files[0].id, // user1-profile.jpg
        userId: users[0].id   // 첫 번째 사용자
      }
    });
    console.log(`   ✅ 사용자 이미지 생성: User ${users[0].name} - ${files[0].name}`);

    // 9. 차량 이미지 데이터 생성
    console.log('🚙 차량 이미지 데이터를 생성합니다...');
    const carImageMappings = [
      { carIndex: 0, fileIndex: 1 }, // Car 1 - car1-main.jpg
      { carIndex: 0, fileIndex: 2 }, // Car 1 - car1-interior.jpg  
      { carIndex: 1, fileIndex: 1 }  // Car 2 - car1-main.jpg (재사용)
    ];

    for (const mapping of carImageMappings) {
      await prisma.carImage.create({
        data: {
          carId: cars[mapping.carIndex].id,
          fileId: files[mapping.fileIndex].id
        }
      });
      console.log(`   ✅ 차량 이미지 생성: ${cars[mapping.carIndex].model} - ${files[mapping.fileIndex].name}`);
    }

    // 10. 계약서 문서 데이터 생성
    console.log('📄 계약서 문서 데이터를 생성합니다...');
    const contractDocumentMappings = [
      { contractIndex: 0, fileIndex: 3 }, // Contract 1 - contract1.pdf
      { contractIndex: 1, fileIndex: 4 }, // Contract 2 - contract2.pdf
      { contractIndex: 2, fileIndex: 3 }  // Contract 3 - contract1.pdf (재사용)
    ];

    for (const mapping of contractDocumentMappings) {
      await prisma.contractDocument.create({
        data: {
          contractId: contracts[mapping.contractIndex].id,
          fileId: files[mapping.fileIndex].id,
          fileName: files[mapping.fileIndex].name
        }
      });
      console.log(`   ✅ 계약서 문서 생성: Contract ${contracts[mapping.contractIndex].id} - ${files[mapping.fileIndex].name}`);
    }

    // 11. 미팅 데이터 생성
    console.log('🤝 미팅 데이터를 생성합니다...');
    for (let i = 0; i < Math.min(mockMeetings.length, contracts.length); i++) {
      await prisma.meeting.create({
        data: {
          contractId: contracts[i].id
        }
      });
      console.log(`   ✅ 미팅 생성: Contract ${contracts[i].id}`);
    }

    // 12. RefreshToken 데이터 생성 (기본 구조)
    console.log('🔑 RefreshToken 데이터를 생성합니다...');
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      await prisma.refreshToken.create({
        data: {}
      });
      console.log(`   ✅ RefreshToken 생성: User ${user.name}`);
    }

    console.log('\n🎉 시드 데이터 생성이 완료되었습니다!');
    console.log('\n📊 생성된 데이터 요약:');
    console.log(`   • 회사: ${companies.length}개`);
    console.log(`   • 사용자: ${users.length}명`);
    console.log(`   • 고객: ${customers.length}명`);
    console.log(`   • 차량: ${cars.length}대`);
    console.log(`   • 파일: ${files.length}개`);
    console.log(`   • 계약: ${contracts.length}건`);
    console.log(`   • 사용자 이미지: 1개`);
    console.log(`   • 차량 이미지: ${carImageMappings.length}개`);
    console.log(`   • 계약서 문서: ${contractDocumentMappings.length}개`);
    console.log(`   • 미팅: ${Math.min(mockMeetings.length, contracts.length)}개`);
    console.log(`   • RefreshToken: ${users.length}개`);

  } catch (error) {
    console.error('❌ 시드 데이터 생성 중 오류가 발생했습니다:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ 시드 실행 중 오류:', e);
    process.exit(1);
  });
