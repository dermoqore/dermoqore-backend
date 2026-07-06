/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const { PrismaClient } = await import('./@generated/prisma/client.js');

  const rawUrl = process.env.DATABASE_URL ?? '';
  const url = new URL(rawUrl);
  url.searchParams.delete('channel_binding');
  url.searchParams.set('sslmode', 'require');

  const pool = new Pool({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: false },
  });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) }) as any;

  const dataPath = path.join(__dirname, '..', '..', 'prisma', 'seed-data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  const upsert = (model: any, where: any, row: any) =>
    model.upsert({ where, update: {}, create: row });

  for (const u of data.users) {
    await upsert(prisma.user, { id: u.id }, u);
  }
  console.log(`✅ Users: ${data.users.length}`);

  const roots = data.categories.filter((c: any) => !c.parentId);
  const children = data.categories.filter((c: any) => c.parentId);
  for (const c of [...roots, ...children]) {
    await upsert(prisma.category, { id: c.id }, c);
  }
  console.log(`✅ Categories: ${data.categories.length}`);

  for (const b of data.brands) {
    await upsert(prisma.brand, { id: b.id }, b);
  }
  console.log(`✅ Brands: ${data.brands.length}`);

  for (const d of data.deliveryCharges) {
    await upsert(prisma.deliveryCharge, { id: d.id }, d);
  }
  console.log(`✅ DeliveryCharges: ${data.deliveryCharges.length}`);

  for (const c of data.companyInfos) {
    await upsert(prisma.companyInfo, { id: c.id }, c);
  }
  console.log(`✅ CompanyInfos: ${data.companyInfos.length}`);

  for (const a of data.announcementBars) {
    await upsert(prisma.announcementBar, { id: a.id }, a);
  }
  console.log(`✅ AnnouncementBars: ${data.announcementBars.length}`);

  for (const r of data.reviews) {
    await upsert(prisma.review, { id: r.id }, r);
  }
  console.log(`✅ Reviews: ${data.reviews.length}`);

  for (const c of data.clients) {
    await upsert(prisma.client, { id: c.id }, c);
  }
  console.log(`✅ Clients: ${data.clients.length}`);

  for (const b of data.banners) {
    await upsert(prisma.banner, { id: b.id }, b);
  }
  console.log(`✅ Banners: ${data.banners.length}`);

  for (const p of data.products) {
    await upsert(prisma.product, { id: p.id }, p);
  }
  console.log(`✅ Products: ${data.products.length}`);

  for (const pi of data.productImages) {
    await upsert(prisma.productImage, { id: pi.id }, pi);
  }
  console.log(`✅ ProductImages: ${data.productImages.length}`);

  for (const i of data.ingredients) {
    await upsert(prisma.ingredient, { id: i.id }, i);
  }
  console.log(`✅ Ingredients: ${data.ingredients.length}`);

  for (const u of data.productUsages) {
    await upsert(prisma.productUsage, { id: u.id }, u);
  }
  console.log(`✅ ProductUsages: ${data.productUsages.length}`);

  for (const b of data.productBenefits) {
    await upsert(prisma.productBenefit, { id: b.id }, b);
  }
  console.log(`✅ ProductBenefits: ${data.productBenefits.length}`);

  for (const s of data.productSEOs) {
    await upsert(prisma.productSEO, { id: s.id }, s);
  }
  console.log(`✅ ProductSEOs: ${data.productSEOs.length}`);

  for (const b of data.blogs) {
    await upsert(prisma.blog, { id: b.id }, b);
  }
  console.log(`✅ Blogs: ${data.blogs.length}`);

  for (const f of data.footers) {
    await upsert(prisma.footer, { id: f.id }, f);
  }
  for (const s of data.footerSocials) {
    await upsert(prisma.footerSocial, { id: s.id }, s);
  }
  for (const s of data.footerSections) {
    await upsert(prisma.footerSection, { id: s.id }, s);
  }
  for (const l of data.footerLinks) {
    await upsert(prisma.footerLink, { id: l.id }, l);
  }
  console.log(
    `✅ Footers: ${data.footers.length} (+ socials, sections, links)`,
  );

  for (const c of data.campaigns) {
    await upsert(prisma.campaign, { id: c.id }, c);
  }
  for (const ci of data.campaignImages) {
    await upsert(prisma.campaignImage, { id: ci.id }, ci);
  }
  for (const cf of data.campaignFaqs) {
    await upsert(prisma.campaignFaq, { id: cf.id }, cf);
  }
  console.log(`✅ Campaigns: ${data.campaigns.length} (+ images, faqs)`);

  await prisma.$disconnect();
  await pool.end();
  console.log('\n🎉 Seed complete!');
}

bootstrap().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
