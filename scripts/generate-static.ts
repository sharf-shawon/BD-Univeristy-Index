import fs from 'fs';
import path from 'path';
import { University } from '../src/types';

const DATA_PATH = path.join(process.cwd(), 'data', 'universities.json');
const OUTPUT_DIR = path.join(process.cwd(), 'dist-static', 'universities');

function getUniversities(): University[] {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
}

function generateHtml(title: string, content: string, description: string = "Official directory of UGC approved universities in Bangladesh.", keywords: string = "Bangladesh university, UGC approved, higher education BD") {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | BD University Index Official Directory</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords}">
    <meta property="og:title" content="${title} | BD University Index">
    <meta property="og:description" content="${description}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lucide-static/0.321.0/lucide.min.css">
</head>
<body class="bg-gray-50 text-gray-900 font-sans">
    ${content}
</body>
</html>`;
}

async function run() {
  console.log('Generating static pages...');
  const universities = getUniversities();

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Index page
  const indexContent = `
    <header class="bg-blue-600 text-white py-12 px-4 shadow-lg text-center">
        <h1 class="text-4xl font-bold mb-4">BD University Index</h1>
        <p class="text-lg opacity-90">Official listing of approved universities in Bangladesh</p>
    </header>
    <main class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${universities.map(u => `
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 mb-4">${u.category}</span>
                    <h2 class="text-xl font-bold mb-4 line-clamp-2">${u.name}</h2>
                    <a href="/universities/${u.slug}/index.html" class="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                        View Details →
                    </a>
                </div>
            `).join('')}
        </div>
    </main>
  `;
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), generateHtml(
    'All Universities', 
    indexContent,
    "Complete list of UGC approved public, private, and international universities in Bangladesh.",
    "Bangladesh university list, UGC approved universities BD, education registry"
  ));

  // Individual pages
  universities.forEach(u => {
    const uniDir = path.join(OUTPUT_DIR, u.slug);
    if (!fs.existsSync(uniDir)) fs.mkdirSync(uniDir);

    const detailContent = `
      <div class="max-w-4xl mx-auto px-4 py-12">
          <a href="../index.html" class="inline-block mb-8 text-blue-600 font-medium hover:underline">← Back to Index</a>
          <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div class="bg-blue-600 p-12 text-white">
                  <span class="bg-white/20 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">${u.category}</span>
                  <h1 class="text-4xl font-extrabold">${u.name}</h1>
              </div>
              <div class="p-12 space-y-8">
                  <div class="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                      <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4 text-center">Institutional Email Validator</h4>
                      <div class="flex gap-2">
                          <input type="email" id="email-v" placeholder="Verify institution email..." class="flex-1 px-4 py-2 border rounded-xl text-sm outline-none focus:border-blue-500">
                          <button onclick="vEmail()" class="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Verify</button>
                      </div>
                      <div id="v-res" class="mt-4 text-[10px] font-bold text-center hidden"></div>
                  </div>
                  <script>
                      function vEmail() {
                          const e = document.getElementById('email-v').value;
                          const r = document.getElementById('v-res');
                          let domain = '';
                          try {
                              domain = new URL('${u.website || ''}').hostname.replace('www.', '');
                          } catch(e) {}
                          
                          if(!e || !domain || domain === 'localhost') return;
                          r.classList.remove('hidden');
                          const eDomain = e.split('@')[1]?.toLowerCase();
                          if(eDomain === domain.toLowerCase() || (eDomain && eDomain.endsWith('.' + domain.toLowerCase()))) {
                              r.textContent = 'VERIFIED DOMAIN'; r.className = 'mt-4 text-[10px] font-bold text-center text-green-600';
                          } else {
                              r.textContent = 'DOMAIN MISMATCH'; r.className = 'mt-4 text-[10px] font-bold text-center text-red-600';
                          }
                      }
                  </script>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <div>
                          <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</h3>
                          <p class="text-lg font-bold text-gray-800">${u.category}</p>
                      </div>
                      <div>
                          <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Established</h3>
                          <p class="text-lg font-bold text-gray-800">${u.yearOfEstablishment || 'N/A'}</p>
                      </div>
                      <div>
                          <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Vice Chancellor</h3>
                          <p class="text-lg font-bold text-gray-800">${u.viceChancellor || 'N/A'}</p>
                      </div>
                      <div>
                          <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Registrar</h3>
                          <p class="text-lg font-bold text-gray-800">${u.registrar || 'N/A'}</p>
                      </div>
                      <div>
                          <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">District</h3>
                          <p class="text-lg font-bold text-gray-800">${u.district || 'N/A'}</p>
                      </div>
                  </div>
                  <hr class="border-gray-100">
                  <div class="space-y-6">
                      <div>
                          <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Campus Address</h3>
                          <p class="text-gray-700 leading-relaxed">${u.permanentCampus || u.address || 'Refer to website'}</p>
                      </div>
                      ${u.permanentCampus && u.address ? `
                      <div>
                          <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Additional Location</h3>
                          <p class="text-gray-700 leading-relaxed">${u.address}</p>
                      </div>` : ''}
                  </div>
                  <hr class="border-gray-100">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                          <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Official Website</h3>
                          <p>${u.website ? `<a href="${u.website}" class="text-blue-600 font-bold hover:underline">${u.website}</a>` : 'Not available'}</p>
                      </div>
                      <div>
                          <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Registry Email</h3>
                          <p>${u.email ? `<a href="mailto:${u.email}" class="text-blue-600 font-bold hover:underline">${u.email}</a>` : 'Not available'}</p>
                      </div>
                  </div>
                  <div class="pt-8 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                         <span class="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-200"></span>
                         <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">${u.approvalStatus} by UGC</span>
                      </div>
                      <span class="text-[10px] font-medium text-gray-300">Sync: ${new Date(u.lastChecked).toLocaleDateString()}</span>
                  </div>
              </div>
          </div>
      </div>
    `;
    fs.writeFileSync(path.join(uniDir, 'index.html'), generateHtml(
      u.name, 
      detailContent,
      `Official details for ${u.name}, a ${u.category} university in ${u.district || 'Bangladesh'}. Established in ${u.yearOfEstablishment || 'N/A'}.`,
      `${u.name}, ${u.district}, ${u.category} university, Bangladesh education`
    ));
  });

  console.log('Static generation complete. Output in dist-static/universities');
}

run().catch(console.error);
