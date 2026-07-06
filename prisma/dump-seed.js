/**
 * Run: node prisma/dump-seed.js
 * Dumps all current DB data into prisma/seed-data.json
 */
require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function query(client, sql) {
  const res = await client.query(sql);
  return res.rows;
}

async function main() {
  const rawUrl = process.env.DATABASE_URL;
  const url = new URL(rawUrl);
  url.searchParams.delete('channel_binding');
  url.searchParams.set('sslmode', 'require');

  const client = new Client({ connectionString: url.toString(), ssl: { rejectUnauthorized: false } });
  await client.connect();

  const data = {
    users:            await query(client, 'SELECT * FROM "User"'),
    categories:       await query(client, 'SELECT * FROM "Category"'),
    brands:           await query(client, 'SELECT * FROM "Brand"'),
    deliveryCharges:  await query(client, 'SELECT * FROM delivery_charges'),
    companyInfos:     await query(client, 'SELECT * FROM "CompanyInfo"'),
    announcementBars: await query(client, 'SELECT * FROM "AnnouncementBar"'),
    reviews:          await query(client, 'SELECT * FROM "Review"'),
    clients:          await query(client, 'SELECT * FROM "Client"'),
    banners:          await query(client, 'SELECT * FROM "Banner"'),
    products:         await query(client, 'SELECT * FROM "Product"'),
    productImages:    await query(client, 'SELECT * FROM "ProductImage"'),
    ingredients:      await query(client, 'SELECT * FROM "Ingredient"'),
    productUsages:    await query(client, 'SELECT * FROM "ProductUsage"'),
    productBenefits:  await query(client, 'SELECT * FROM "ProductBenefit"'),
    productSEOs:      await query(client, 'SELECT * FROM "ProductSEO"'),
    blogs:            await query(client, 'SELECT * FROM "Blog"'),
    footers:          await query(client, 'SELECT * FROM "Footer"'),
    footerSocials:    await query(client, 'SELECT * FROM "FooterSocial"'),
    footerSections:   await query(client, 'SELECT * FROM "FooterSection"'),
    footerLinks:      await query(client, 'SELECT * FROM "FooterLink"'),
    campaigns:        await query(client, 'SELECT * FROM "Campaign"'),
    campaignImages:   await query(client, 'SELECT * FROM "CampaignImage"'),
    campaignFaqs:     await query(client, 'SELECT * FROM "CampaignFaq"'),
  };

  await client.end();

  const outPath = path.join(__dirname, 'seed-data.json');
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log('✅ Dumped to', outPath);
  console.log('Record counts:');
  for (const [k, v] of Object.entries(data)) {
    if (v.length > 0) console.log(`  ${k}: ${v.length}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
