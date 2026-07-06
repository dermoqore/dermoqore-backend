/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
/**
 * Run: npx ts-node -r tsconfig-paths/register src/dump-seed.ts
 * Dumps all current DB data into prisma/seed-data.json
 */
import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const { PrismaClient } = await import('./@generated/prisma/client.js');

  const rawUrl = process.env.DATABASE_URL ?? '';
  const url = new URL(rawUrl);
  url.searchParams.delete('channel_binding');
  url.searchParams.set('sslmode', 'require');

  const pool = new Pool({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: false },
  });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  const data = {
    users: await prisma.user.findMany(),
    categories: await prisma.category.findMany(),
    brands: await prisma.brand.findMany(),
    deliveryCharges: await prisma.deliveryCharge.findMany(),
    companyInfos: await prisma.companyInfo.findMany(),
    announcementBars: await prisma.announcementBar.findMany(),
    reviews: await (prisma as any).review.findMany(),
    clients: await prisma.client.findMany(),
    banners: await prisma.banner.findMany(),
    products: await prisma.product.findMany(),
    productImages: await prisma.productImage.findMany(),
    ingredients: await prisma.ingredient.findMany(),
    productUsages: await prisma.productUsage.findMany(),
    productBenefits: await prisma.productBenefit.findMany(),
    productSEOs: await prisma.productSEO.findMany(),
    blogs: await prisma.blog.findMany(),
    footers: await prisma.footer.findMany(),
    footerSocials: await prisma.footerSocial.findMany(),
    footerSections: await prisma.footerSection.findMany(),
    footerLinks: await prisma.footerLink.findMany(),
    campaigns: await (prisma as any).campaign.findMany(),
    campaignImages: await (prisma as any).campaignImage.findMany(),
    campaignFaqs: await (prisma as any).campaignFaq.findMany(),
  };

  await prisma.$disconnect();
  await pool.end();

  const outPath = path.join(__dirname, '..', 'prisma', 'seed-data.json');
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log(`✅ Dumped to ${outPath}`);
  console.log(
    'Record counts:',
    Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, (v as any[]).length]),
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
