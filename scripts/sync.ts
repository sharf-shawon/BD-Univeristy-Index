import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import { UniversityCategory, University } from '../src/types';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'registry');
const DATA_FILE = path.join(DATA_DIR, 'universities.json');
const RANKINGS_FILE = path.join(process.cwd(), 'src', 'config', 'rankings.json');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SITEMAP_FILE = path.join(PUBLIC_DIR, 'sitemap.xml');

const SOURCES = [
  {
    url: 'http://www.ugc-universities.gov.bd',
    category: UniversityCategory.PUBLIC,
  },
  {
    url: 'http://www.ugc-universities.gov.bd/private-universities',
    category: UniversityCategory.PRIVATE,
  },
  {
    url: 'http://www.ugc-universities.gov.bd/international-universities',
    category: UniversityCategory.INTERNATIONAL,
  },
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[-\s]+/g, '-');
}

function getFingerprint(uni: Partial<University>): string {
  return crypto.createHash('md5').update(`${uni.name}-${uni.website}-${uni.category}`).digest('hex');
}

async function loadExistingUniversities(): Promise<Record<string, University>> {
  if (!fs.existsSync(DATA_FILE)) return {};
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as University[];
    const map: Record<string, University> = {};
    data.forEach(u => map[u.id] = u);
    return map;
  } catch (e) {
    console.error('Error loading existing data:', e);
    return {};
  }
}

async function loadPermanentRankings(): Promise<Record<string, any[]>> {
  if (!fs.existsSync(RANKINGS_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(RANKINGS_FILE, 'utf-8'));
  } catch (e) {
    console.error('Error loading permanent rankings:', e);
    return {};
  }
}

async function saveUniversities(universities: University[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(universities, null, 2));
}

async function fetchWithRetry(url: string, retries = 3): Promise<string | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        timeout: 15000,
        validateStatus: (status) => status === 200,
      });
      return response.data;
    } catch (error) {
      console.warn(`Retry ${i + 1}/${retries} for ${url} failed...`);
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 2000 * (i + 1))); // Exponential backoff
    }
  }
  return null;
}

async function scrape() {
  console.log('Starting sync process...');
  const existingMap = await loadExistingUniversities();
  const permanentRankings = await loadPermanentRankings();
  const universities: University[] = [];
  const processedSlugs = new Set<string>();

  for (const source of SOURCES) {
    console.log(`Processing ${source.category} universities...`);
    try {
      const html = await fetchWithRetry(source.url);
      if (!html) continue;

      const $ = cheerio.load(html);
      
      const rowElements = $('table tr').get();
      for (let i = 1; i < rowElements.length; i++) {
        const el = rowElements[i];
        const cols = $(el).find('td');
        if (cols.length >= 2) {
          const name = $(cols[1]).text().trim();
          if (!name || name.length < 3) continue;

          // Find detail link
          const detailPath = $(el).find('a').filter((_, a) => {
            const href = $(a).attr('href');
            return !!href && href.includes('university-detail');
          }).attr('href');
          
          const detailUrl = detailPath ? new URL(detailPath, source.url).href : null;
          const slug = generateSlug(name);
          
          if (processedSlugs.has(slug)) continue;
          processedSlugs.add(slug);

          const existing = existingMap[slug];
          // If we already have leadership info and district, we can skip re-scraping
          const needsDeepScrape = !existing || !existing.viceChancellor || !existing.yearOfEstablishment || !existing.district;

          if (!needsDeepScrape && existing) {
             universities.push(existing);
             continue;
          }

          console.log(`Deep scraping [${source.category}] ${name}...`);
          let details: Partial<University> = {};
          
          if (detailUrl) {
            try {
              const detailHtml = await fetchWithRetry(detailUrl);
              if (detailHtml) {
                const $d = cheerio.load(detailHtml);
                const tableRows = $d('table tr');
                tableRows.each((_, tr) => {
                  const key = $d(tr).find('td').first().text().toLowerCase().trim();
                  const val = $d(tr).find('td').last().text().trim();
                  
                  if (key.includes('year of establishment')) details.yearOfEstablishment = val;
                  if (key.includes('persent campus') || key.includes('present campus')) details.address = val;
                  if (key.includes('permanent campus')) details.permanentCampus = val;
                  if (key.includes('vice chancellor')) details.viceChancellor = val;
                  if (key.includes('pro vice chancellor')) details.proViceChancellor = val;
                  if (key.includes('treasurer')) details.treasurer = val;
                  if (key.includes('registrar')) details.registrar = val;
                  if (key.includes('website')) details.website = val.startsWith('http') ? val : `http://${val}`;
                  if (key.includes('email')) details.email = val;
                  if (key.includes('telephone') || key.includes('mobile')) details.phone = val;
                  if (key.includes('fax')) details.fax = val;
                });

                // Infer district from address strings
                const fullAddress = `${details.permanentCampus || ''} ${details.address || ''}`;
                const districts = [
                  'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh',
                  'Gazipur', 'Narayanganj', 'Comilla', 'Noakhali', 'Feni', 'Brahmanbaria', 'Chandpur', 
                  'Lakshmipur', 'Cox\'s Bazar', 'Rangamati', 'Bandarban', 'Khagrachhari', 'Sirajganj', 
                  'Pabna', 'Bogura', 'Natore', 'Naogaon', 'Joypurhat', 'Chapainawabganj', 'Kushtia',
                  'Meherpur', 'Chuadanga', 'Jhenaidah', 'Magura', 'Narayail', 'Satkhira', 'Jashore',
                  'Bagerhat', 'Bhola', 'Patuakhali', 'Pirojpur', 'Jhalokati', 'Barguna', 'Habiganj',
                  'Moulvibazar', 'Sunamganj', 'Dinajpur', 'Thakurgaon', 'Panchagarh', 'Kurigram',
                  'Nilphamari', 'Gaibandha', 'Lalmonirhat', 'Sherpur', 'Jamalpur', 'Netrokona', 'Kishoreganj',
                  'Tangail', 'Manikganj', 'Munshiganj', 'Faridpur', 'Madaripur', 'Shariatpur', 'Rajbari', 'Gopalganj'
                ];
                
                for (const d of districts) {
                  if (fullAddress.toLowerCase().includes(d.toLowerCase())) {
                    details.district = d;
                    break;
                  }
                }
              }
            } catch (de) {
              console.warn(`Detail fetch failed for ${name}: ${de instanceof Error ? de.message : 'Unknown error'}`);
            }
          }

          universities.push({
            id: slug,
            name,
            slug,
            category: source.category,
            approvalStatus: 'Approved',
            website: details.website || existing?.website || null,
            address: details.address || existing?.address || null,
            permanentCampus: details.permanentCampus || existing?.permanentCampus || null,
            yearOfEstablishment: details.yearOfEstablishment || existing?.yearOfEstablishment || null,
            viceChancellor: details.viceChancellor || existing?.viceChancellor || null,
            proViceChancellor: details.proViceChancellor || existing?.proViceChancellor || null,
            treasurer: details.treasurer || existing?.treasurer || null,
            registrar: details.registrar || existing?.registrar || null,
            phone: details.phone || existing?.phone || null,
            email: details.email || existing?.email || null,
            fax: details.fax || existing?.fax || null,
            district: details.district || existing?.district || null,
            notes: existing?.notes || null,
            rankings: permanentRankings[slug] || existing?.rankings || [],
            sourceUrl: detailUrl || source.url,
            lastChecked: new Date().toISOString(),
            isVerified: true,
          });
        }
      }
    } catch (error) {
      console.error(`Fatal error scraping ${source.url}:`, error);
    }
  }

  if (universities.length === 0) {
    console.error('No universities found during scrape. Aborting save to prevent data loss.');
    process.exit(1);
  }

  console.log(`Sync complete. Found ${universities.length} institutions. Saving...`);
  await saveUniversities(universities);

  // Sitemap generation
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${process.env.APP_URL || 'https://ais-university-directory.example.com'}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${universities.map(u => `
  <url>
    <loc>${process.env.APP_URL || 'https://ais-university-directory.example.com'}/universities/${u.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`).join('')}
</urlset>`;
  
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }
  fs.writeFileSync(SITEMAP_FILE, sitemap);
}

scrape().catch(err => {
  console.error('Scrape job failed:', err);
  process.exit(1);
});
