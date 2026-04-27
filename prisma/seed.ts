import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main(){
  const passwordHash=await bcrypt.hash("Password123!",10);
  await prisma.user.deleteMany();
  const admin=await prisma.user.create({data:{fullName:"Resynex Admin",email:"admin@resynex.io",passwordHash,role:"ADMIN",emailVerifiedAt:new Date(),verificationStatus:"VERIFIED"}});
  const industry=await prisma.user.create({data:{fullName:"Demo Industry",email:"demo@company.com",passwordHash,role:"INDUSTRY",emailVerifiedAt:new Date(),verificationStatus:"VERIFIED",industryProfile:{create:{legalCompanyName:"BioNova Pty Ltd",abn:"12345678901",websiteUrl:"https://example.com",sector:"Biotechnology",businessEmail:"demo@company.com"}}}});
  const uni=await prisma.user.create({data:{fullName:"Demo University",email:"facilities@demo.edu.au",passwordHash,role:"UNIVERSITY",emailVerifiedAt:new Date(),verificationStatus:"VERIFIED",universityProfile:{create:{officialUniversityName:"Demo University",institutionalEmail:"facilities@demo.edu.au",officialWebsite:"https://demo.edu.au",country:"Australia",campusLocation:"Canberra"}}}});
  const academic=await prisma.user.create({data:{fullName:"Dr Researcher",email:"researcher@demo.edu.au",passwordHash,role:"ACADEMIC",emailVerifiedAt:new Date(),verificationStatus:"VERIFIED",academicProfile:{create:{institutionName:"Demo University",institutionalEmail:"researcher@demo.edu.au",department:"Chemistry",title:"Lecturer",researchFields:["Analytical Chemistry","Pharmaceutical Analysis"]}}}});
  await prisma.problemPost.create({data:{userId:industry.id,title:"Improve stability of peptide formulation",description:"We need academic support to improve peptide formulation stability under accelerated storage conditions.",field:"Pharmaceutical Formulation",expectedOutcome:"Prototype formulation and stability plan",budgetMin:10000,budgetMax:25000,confidentialityLevel:"NDA required"}});
  await prisma.facilityListing.create({data:{userId:uni.id,title:"LC-MS/MS Core Facility",description:"High-sensitivity LC-MS/MS analysis for pharmaceutical, biological and environmental samples.",facilityType:"Analytical Instrumentation",equipmentList:["LC-MS/MS","HPLC","Sample prep"],location:"Canberra",institutionName:"Demo University",accessType:"Booking + collaboration",pricingModel:"Quote",basePrice:250}});
  await prisma.communityPost.create({data:{authorUserId:academic.id,type:"QUESTION",title:"Best practices for validating LC-MS/MS methods?",content:"What validation parameters do you prioritize for early-stage applied research collaboration?",topic:"Analytical Chemistry",tags:["LCMS","Validation"]}});
  await prisma.notification.create({data:{userId:admin.id,title:"Welcome",body:"Seed data installed successfully."}});
}
main().finally(()=>prisma.$disconnect());
