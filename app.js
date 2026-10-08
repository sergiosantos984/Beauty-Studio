/* =====================================================================
   Beauty Studio Cátia Gonçalves — app.js
   Vanilla ES6 + GSAP + ScrollTrigger. Frontend only.

   1. DADOS ............ tudo o que o site mostra (pronto para Firebase)
   2. FONTE DE DADOS ... único ponto a trocar por Firestore no futuro
   3. ARTE ............. ilustrações editoriais geradas (substituídas por
                         fotografias reais assim que "image" for preenchido)
   4. RENDER ........... HTML a partir dos dados
   5. ROUTER ........... páginas (#inicio, #servicos, ...) + transições
   6. MOTION ........... coreografia GSAP por página
   7. UI GLOBAL ........ header, menu, cursor, botões magnéticos, etc.
   8. ARRANQUE
   9. ADMINISTRAÇÃO .... área reservada em #admin (palavra-passe, edição, publicação)
   ===================================================================== */
(() => {
'use strict';

/* =====================================================================
   1. DADOS
   Para usar fotografias reais, preencha "image":
     image: "assets/img/nail-art.webp"
   ou, com direção de arte diferente para telemóvel:
     image: { desktop: "assets/img/hero-wide.webp", mobile: "assets/img/hero-portrait.webp" }
   Enquanto "image" estiver vazio, é usada a ilustração definida em "art".
   ===================================================================== */

let studio = {
  name: 'Beauty Studio Cátia Gonçalves',
  // EXEMPLO — substituir pelos contactos reais
  whatsapp: '351912345678',
  phone: '+351 912 345 678',
  email: 'ola@beautystudiocg.pt',
  instagram: { handle: '@beautystudio.catiagoncalves', url: 'https://www.instagram.com/' },
  address: 'Rua das Pérolas, 12 · 2750-000 Cascais',
  hours: [
    ['Segunda', 'Encerrado'],
    ['Terça a Sexta', '10h00 – 19h30'],
    ['Sábado', '09h30 – 17h00'],
    ['Domingo', 'Encerrado']
  ],
  hoursShort: 'Ter–Sex 10h–19h30 · Sáb 9h30–17h',
  bookingMessage: 'Olá Cátia! Gostaria de marcar uma sessão.',
  aboutShort: 'A Cátia acredita que uma manicure bem feita muda a forma como nos sentimos o resto da semana. Cada sessão é calma, cuidada e pensada para as suas mãos.',
  aboutLead: 'Técnica de unhas, com gosto pelo detalhe e pela calma de um trabalho bem feito.',
  aboutStory: [
    'Cada cliente chega com uma ideia diferente: uma cor que viu, uma ocasião especial, ou apenas vontade de parar uma hora. O meu trabalho é ouvir e transformar isso num resultado bonito e duradouro.',
    'Trabalho com produtos profissionais, material esterilizado e uma marcação de cada vez, para que o tempo no studio seja só seu.',
    'O studio nasceu para ser um espaço tranquilo, onde a beleza se faz sem pressa.'
  ],
  quote: '“Unhas bonitas são o resultado de pequenos gestos feitos com tempo.”',
  studioShort: 'Um espaço pequeno, luminoso e tranquilo, pensado para que se sinta em casa desde o primeiro minuto.',
  principles: [
    { title: 'Higiene', em: 'sem exceções', text: 'Material esterilizado, limas individuais e superfícies desinfetadas entre cada cliente.' },
    { title: 'Detalhe', em: 'em cada unha', text: 'Cutículas, forma e acabamento tratados com a mesma atenção, da primeira à décima unha.' },
    { title: 'Tempo', em: 'só para si', text: 'Uma cliente de cada vez. Sem pressas e sem salas cheias.' }
  ],
  notes: [
    { title: 'Chegue com tempo', text: 'Pedimos que chegue 5 minutos antes, para começarmos com calma.' },
    { title: 'Alterações e cancelamentos', text: 'Avise com 24 horas de antecedência, para podermos oferecer o horário a outra cliente.' },
    { title: 'Remoção de gel', text: 'Se vem de outro espaço com gel ou verniz gel, indique-o na marcação para reservarmos o tempo certo.' },
    { title: 'Referências', text: 'Traga fotografias de inspiração. Ajudam a perceber exatamente o que procura.' }
  ],
  images: [
    { caption: 'O studio', alt: 'Sala do studio com janela em arco e luz natural', image: '', art: { kind: 'studio', bg: ['#EFE3D9', '#CDB6A8'], arch: true, mirror: true, vase: true, bottles: 3, table: '#E4D3C6' } },
    { caption: 'A bancada', alt: 'Bancada de manicure com almofada e frascos de verniz', image: '', art: { kind: 'studio', bg: ['#F1E6DE', '#D6BFB2'], arch: false, lamp: true, cushion: true, bottles: 4, floor: .58, table: '#EADCD0' } },
    { caption: 'Os detalhes', alt: 'Pérolas e verniz nude sobre tecido de seda', image: '', art: { kind: 'nails', shape: 'oval', finish: 'pearl', polish: '#EBCFC6', bg: ['#F3E6DF', '#D8B9AE'], length: 'short', props: 'strand' } },
    { caption: 'Os produtos', alt: 'Frascos de verniz em tons de bordeaux, nude e rosa', image: '', art: { kind: 'bottles', bg: ['#EDDCD6', '#C7A79D'], colors: ['#8E1F2F', '#E7C6BC', '#C9958F'] } },
    { caption: 'A preparação', alt: 'Toalhas dobradas e frascos alinhados na bancada', image: '', art: { kind: 'studio', bg: ['#EADBD0', '#C2A797'], arch: true, towel: true, bottles: 2, floor: .66, table: '#DFCBBE', ax: .3 } }
  ]
};

let services = [
  {
    id: 'manicure', name: 'Manicure', category: 'Manicure', featured: true,
    description: 'Cuidado completo das unhas e cutículas, limagem na forma que preferir e acabamento com verniz tradicional ou fortalecedor.',
    price: 20, from: false, duration: '45 min', image: '',
    alt: 'Unhas curtas ovais em tom nude',
    art: { kind: 'nails', shape: 'oval', finish: 'nude', polish: '#E8C4B8', bg: ['#F4E7E0', '#D9BFB4'], length: 'short' }
  },
  {
    id: 'verniz-gel', name: 'Verniz Gel', category: 'Manicure', featured: true,
    description: 'Cor intensa e brilho espelhado que se mantêm até três semanas, sem lascar. Inclui preparação completa das unhas.',
    price: 28, from: false, duration: '60 min', image: '',
    alt: 'Unhas amêndoa em verniz gel bordeaux',
    art: { kind: 'nails', shape: 'almond', finish: 'solid', polish: '#8E1F2F', bg: ['#F0DCD6', '#C9A097'], length: 'medium', skin: 'medium' }
  },
  {
    id: 'unhas-gel', name: 'Unhas de Gel', category: 'Gel', featured: true,
    description: 'Extensão ou reforço em gel, com forma e comprimento à sua medida. Resistentes, leves e com acabamento natural.',
    price: 40, from: true, duration: '120 min', image: '',
    alt: 'Unhas de gel em formato coffin com acabamento cromado rosé',
    art: { kind: 'nails', shape: 'coffin', finish: 'chrome', polish: '#D7B9C0', bg: ['#EADFE1', '#B9A0A8'], length: 'long' }
  },
  {
    id: 'nail-art', name: 'Nail Art', category: 'Arte', featured: true,
    description: 'Nail art personalizada, desenhada à mão. Do detalhe minimalista a composições completas com folha de ouro.',
    price: 5, from: true, priceNote: 'por unha', duration: '+15 min', image: '',
    alt: 'Nail art com linhas douradas sobre fundo rosa',
    art: { kind: 'nails', shape: 'almond', finish: 'mix', polish: '#E6B7B1', accent: '#C2994F', bg: ['#F3E2DD', '#D0A9A1'], length: 'long' }
  },
  {
    id: 'francesinha', name: 'Francesinha', category: 'Manicure', featured: true,
    description: 'O clássico intemporal: base nude translúcida e ponta branca desenhada com precisão, em verniz gel.',
    price: 32, from: false, duration: '75 min', image: '',
    alt: 'Francesinha clássica em unhas quadradas',
    art: { kind: 'nails', shape: 'square', finish: 'french', polish: '#F1D6CE', base: '#F0D3CB', bg: ['#F6EEE8', '#DCC6BB'], length: 'medium' }
  },
  {
    id: 'manutencao', name: 'Manutenção de Gel', category: 'Gel',
    description: 'Preenchimento do crescimento natural, correção da forma e nova cor. Recomendado a cada três a quatro semanas.',
    price: 35, from: false, duration: '90 min', image: '',
    alt: 'Unhas de gel rosa antigo em formato amêndoa',
    art: { kind: 'nails', shape: 'almond', finish: 'solid', polish: '#C48C87', bg: ['#F0E1DC', '#C9A59C'], length: 'medium', skin: 'deep' }
  },
  {
    id: 'remocao', name: 'Remoção de Gel', category: 'Gel',
    description: 'Remoção cuidada, sem limar a unha natural em excesso, seguida de hidratação das cutículas.',
    price: 10, from: false, duration: '20 min', image: '',
    alt: 'Unhas naturais curtas após remoção',
    art: { kind: 'nails', shape: 'oval', finish: 'nude', polish: '#EBCBC0', bg: ['#F5ECE6', '#D9C5BA'], length: 'short', skin: 'medium' }
  },
  {
    id: 'spa-maos', name: 'Spa de Mãos', category: 'Cuidados',
    description: 'Esfoliação, máscara nutritiva e massagem hidratante. Um momento de pausa que pode juntar a qualquer serviço.',
    price: 15, from: false, duration: '30 min', image: '',
    alt: 'Frascos de cuidado de mãos sobre pedestal',
    art: { kind: 'bottles', bg: ['#EFE3DC', '#CDB3A6'], colors: ['#EAD1C6', '#D9B3A6', '#F3E4DC'], cap: 'gold' }
  }
];
let categoryOrder = ['Manicure', 'Gel', 'Arte', 'Cuidados'];

let gallery = [
  { id: 'g1', title: 'Pérola Leitosa', category: 'Nude', featured: true, image: '', art: { kind: 'nails', shape: 'almond', finish: 'pearl', polish: '#EDD2C9', bg: ['#F5E9E3', '#D7BCB1'], length: 'long', props: 'strand' } },
  { id: 'g2', title: 'Francesinha Clássica', category: 'Francesinha', featured: true, image: '', art: { kind: 'nails', shape: 'square', finish: 'french', polish: '#F1D6CE', bg: ['#F7F0EA', '#DFCABF'], length: 'medium', px: .58 } },
  { id: 'g3', title: 'Bordeaux Noturno', category: 'Gel', featured: true, arch: true, image: '', art: { kind: 'nails', shape: 'almond', finish: 'solid', polish: '#6E1626', bg: ['#E9D3CE', '#B88A82'], length: 'long', skin: 'medium', tilt: -8 } },
  { id: 'g4', title: 'Folha de Ouro', category: 'Nail Art', featured: true, image: '', art: { kind: 'nails', shape: 'stiletto', finish: 'foil', polish: '#2D2220', accent: '#CFA55A', bg: ['#EADBD3', '#B79E92'], length: 'long', px: .6 } },
  { id: 'g5', title: 'Cromado Rosé', category: 'Gel', featured: true, image: '', art: { kind: 'nails', shape: 'coffin', finish: 'chrome', polish: '#D8B4BB', bg: ['#EDE2E4', '#BFA6AD'], length: 'long', skin: 'deep' } },
  { id: 'g6', title: 'Noiva em Seda', category: 'Noiva', featured: true, arch: true, image: '', art: { kind: 'nails', shape: 'almond', finish: 'french', polish: '#F4E2DA', base: '#F3DCD4', tip: '#FFFDF9', bg: ['#F8F2EE', '#E2D0C6'], length: 'medium', props: 'strand' } },
  { id: 'g7', title: 'Linha Dourada', category: 'Minimal', image: '', art: { kind: 'nails', shape: 'oval', finish: 'line', polish: '#EBCBC1', accent: '#BE9550', bg: ['#F4ECE6', '#D6C1B6'], length: 'medium', skin: 'medium' } },
  { id: 'g8', title: 'Caramelo', category: 'Nude', image: '', art: { kind: 'nails', shape: 'square', finish: 'solid', polish: '#A9704F', bg: ['#EFE0D6', '#C5A28E'], length: 'medium', skin: 'deep' } },
  { id: 'g9', title: 'Rosa Antigo', category: 'Gel', image: '', art: { kind: 'nails', shape: 'oval', finish: 'solid', polish: '#C9908A', bg: ['#F2E4DF', '#CFAAA2'], length: 'short' } },
  { id: 'g10', title: 'Arte Floral', category: 'Nail Art', image: '', art: { kind: 'nails', shape: 'almond', finish: 'art', polish: '#F0D2CD', accent: '#B98E4F', bg: ['#F3E5E1', '#D3AFA8'], length: 'long', skin: 'medium' } },
  { id: 'g11', title: 'Brilho de Cerimónia', category: 'Noiva', image: '', art: { kind: 'nails', shape: 'oval', finish: 'pearl', polish: '#F2DDD6', bg: ['#F7EFEA', '#DFCBC1'], length: 'medium', skin: 'deep' } },
  { id: 'g12', title: 'Um Ponto', category: 'Minimal', image: '', art: { kind: 'nails', shape: 'square', finish: 'line', polish: '#E2C2B8', accent: '#A9824A', bg: ['#F1E8E1', '#CDB8AC'], length: 'short' } }
];

let collections = [
  { id: 'c1', title: 'Francesinha', line: 'O clássico, redesenhado com linhas finas.', h: '54svh', ar: '3 / 4', image: '', art: gallery[1].art },
  { id: 'c2', title: 'Nude', line: 'Tons de pele, brilho limpo, elegância diária.', h: '42svh', ar: '4 / 5', r: '999px 999px 10px 10px', image: '', art: gallery[0].art },
  { id: 'c3', title: 'Nail Art', line: 'Desenhos à mão, do minimal ao statement.', h: '60svh', ar: '2 / 3', image: '', art: services[3].art },
  { id: 'c4', title: 'Noiva', line: 'Delicadas, luminosas e feitas para durar o dia todo.', h: '46svh', ar: '1 / 1', image: '', art: gallery[5].art },
  { id: 'c5', title: 'Gel', line: 'Resistência e forma, com acabamento perfeito.', h: '52svh', ar: '3 / 4', r: '999px 999px 10px 10px', image: '', art: gallery[4].art },
  { id: 'c6', title: 'Minimal', line: 'Uma linha, um ponto. O detalhe certo.', h: '44svh', ar: '4 / 5', image: '', art: gallery[6].art }
];

let promotions = [
  {
    id: 'outono', active: true,
    eyebrow: 'Edição limitada · Outono',
    wordA: 'Exclusivo', wordB: 'Momento',
    title: 'Francesinha', titleEm: '+ Nail Art',
    description: 'A elegância da francesinha com um detalhe de nail art à sua escolha.',
    priceOld: 35, priceNew: 29,
    note: 'Válido até 30 de novembro, mediante marcação.', // EXEMPLO
    message: 'Olá Cátia! Gostaria de marcar a promoção Francesinha + Nail Art.',
    alt: 'Unhas com francesinha e detalhe dourado sobre fundo escuro',
    image: '',
    art: { kind: 'nails', shape: 'almond', finish: 'mixfrench', polish: '#F2D8D0', base: '#EFD2C9', accent: '#CFA55A', bg: ['#4A3631', '#1F1614'], length: 'long', props: 'pearls', light: [.7, .2] }
  }
];

let pages = {
  intro: { image: '', alt: 'Unhas amêndoa em tom pérola sobre seda', art: { kind: 'nails', shape: 'almond', finish: 'pearl', polish: '#EBCFC6', bg: ['#F1E1D9', '#C9A79B'], length: 'long', props: 'strand', reach: .7 } },
  hero: { image: '', alt: 'Mão com unhas amêndoa vermelho cereja sobre seda rosa', art: { kind: 'nails', shape: 'almond', finish: 'solid', polish: '#8A1A2B', bg: ['#F0DAD3', '#C3958B'], length: 'long', props: 'pearls', px: .56, reach: .72 } },
  duoA: { image: '', alt: 'Francesinha clássica', art: gallery[1].art },
  duoB: { image: '', alt: 'Nail art moderna cromada', art: { kind: 'nails', shape: 'stiletto', finish: 'chrome', polish: '#B7A3C4', bg: ['#E3DBE6', '#9E8CA6'], length: 'long', skin: 'medium', tilt: 6 } },
  about: { image: '', alt: 'Monograma CG do Beauty Studio em arco', art: { kind: 'monogram', bg: ['#EFDDDA', '#C9A9A3'], archColor: '#DCC0BA' } }
};

/* =====================================================================
   2. FONTE DE DADOS
   Ordem de carregamento:
     1. dados por omissão (acima)
     2. content.json publicado no site (gerado pelo painel de administração)
     3. rascunho local da administradora (só com sessão iniciada)
   ===================================================================== */
const DEFAULTS = structuredClone({ studio, services, gallery, collections, promotions, pages, categories: categoryOrder });
const LocalImg = new Map();           // caminho publicado → imagem local (enquanto o GitHub Pages atualiza)
let publishedStamp = null;            // updatedAt do content.json publicado
let usingDraft = false;

const idb = (() => {
  let dbp = null;
  const mem = new Map();
  const open = () => dbp || (dbp = new Promise((res, rej) => {
    try {
      const r = indexedDB.open('beauty-studio-admin', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('kv');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    } catch (e) { rej(e); }
  }));
  const tx = async (mode, fn) => {
    const db = await open();
    return new Promise((res, rej) => {
      const t = db.transaction('kv', mode);
      const q = fn(t.objectStore('kv'));
      t.oncomplete = () => res(q && q.result);
      t.onerror = () => rej(t.error);
    });
  };
  return {
    async get(k) { try { return await tx('readonly', st => st.get(k)); } catch { return mem.get(k); } },
    async set(k, v) { try { await tx('readwrite', st => st.put(v, k)); } catch { mem.set(k, v); } },
    async del(k) { try { await tx('readwrite', st => st.delete(k)); } catch { mem.delete(k); } }
  };
})();

const Session = (() => {
  let mem = false;
  return {
    get() { try { return sessionStorage.getItem('bs-admin') === '1'; } catch { return mem; } },
    set(v) { mem = v; try { v ? sessionStorage.setItem('bs-admin', '1') : sessionStorage.removeItem('bs-admin'); } catch { /* sem armazenamento */ } }
  };
})();

function normalize(d = {}) {
  const base = structuredClone(DEFAULTS);
  const out = { ...base, ...d };
  out.studio = { ...base.studio, ...(d.studio || {}) };
  out.pages = { ...base.pages, ...(d.pages || {}) };
  ['services', 'gallery', 'collections', 'promotions'].forEach(k => { if (!Array.isArray(out[k])) out[k] = base[k]; });
  if (!Array.isArray(out.studio.images) || out.studio.images.length < 5) out.studio.images = base.studio.images;
  const objImg = o => { if (o && (typeof o.image !== 'object' || o.image === null)) o.image = { desktop: o.image || '', mobile: '' }; };
  Object.values(out.pages).forEach(objImg);
  out.promotions.forEach(objImg);
  out.promotions.forEach(p => {
    if (p.title == null) {
      const m = (p.titleHTML || '').match(/^(.*?)\s*<em>(.*?)<\/em>/);
      p.title = m ? m[1] : (p.titleHTML || '').replace(/<[^>]+>/g, '');
      p.titleEm = m ? m[2] : '';
    }
  });
  if (!Array.isArray(out.categories) || !out.categories.length) out.categories = base.categories;
  return out;
}

function applyData(d) {
  ({ studio, services, gallery, collections, promotions, pages } = d);
  categoryOrder = d.categories;
}
function currentData() {
  return { studio, services, gallery, collections, promotions, pages, categories: categoryOrder };
}

const DataSource = {
  async load() {
    let data = normalize({});
    try {
      const r = await fetch(`content.json?v=${Date.now()}`, { cache: 'no-store' });
      if (r.ok) {
        const j = await r.json();
        if (j && Array.isArray(j.services)) { data = normalize(j); publishedStamp = j.updatedAt || null; }
      }
    } catch { /* sem content.json: usar dados por omissão */ }
    if (Session.get()) {
      const draft = await idb.get('draft');
      const imgs = await idb.get('localImages');
      if (imgs) Object.entries(imgs).forEach(([k, v]) => LocalImg.set(k, v));
      if (draft && draft.content) { data = normalize(draft.content); usingDraft = true; }
    }
    return data;
  }
};

/* =====================================================================
   Utils
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
const mqFine = matchMedia('(hover: hover) and (pointer: fine)');
const mqDesk = matchMedia('(min-width: 900px)');
const HAS_GSAP = !!(window.gsap && window.ScrollTrigger);
let uidN = 0;
const uid = () => (++uidN).toString(36);

const waUrl = (msg) => `https://wa.me/${studio.whatsapp}?text=${encodeURIComponent(msg || studio.bookingMessage)}`;
const priceText = (s) => `${s.from ? 'desde ' : ''}€${s.price}`;

/* =====================================================================
   3. ARTE — ilustrações editoriais em SVG (substitutas de fotografia)
   ===================================================================== */
const Art = (() => {
  const cache = new Map();
  const RATIOS = { portrait: [800, 1000], tall: [800, 1200], landscape: [1400, 900], square: [1000, 1000] };
  const SKIN = { light: ['#F2D6C6', '#DCB39D'], medium: ['#D8A88C', '#B37C5E'], deep: ['#9B6A51', '#6F4634'] };
  let D = '';
  let rand = Math.random;

  const hex = h => { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const toHex = a => '#' + a.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => { const A = hex(a), B = hex(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
  const lt = (c, t) => mix(c, '#ffffff', t);
  const dk = (c, t) => mix(c, '#000000', t);
  const f = n => +n.toFixed(1);
  const seedRng = (seed) => { let s = 2166136261; for (const ch of seed) s = Math.imul(s ^ ch.charCodeAt(0), 16777619) >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; };

  function nailPath(shape, w, l) {
    const h = w / 2, c = `Q0 ${f(w * .2)} ${f(-h)} 0Z`;
    switch (shape) {
      case 'square': return `M${f(-h)} 0 L${f(-h)} ${f(-l + w * .14)} Q${f(-h)} ${f(-l)} ${f(-h + w * .14)} ${f(-l)} L${f(h - w * .14)} ${f(-l)} Q${f(h)} ${f(-l)} ${f(h)} ${f(-l + w * .14)} L${f(h)} 0 ${c}`;
      case 'coffin': return `M${f(-h)} 0 L${f(-h * .66)} ${f(-l + w * .06)} Q${f(-h * .64)} ${f(-l)} ${f(-h * .5)} ${f(-l)} L${f(h * .5)} ${f(-l)} Q${f(h * .64)} ${f(-l)} ${f(h * .66)} ${f(-l + w * .06)} L${f(h)} 0 ${c}`;
      case 'stiletto': return `M${f(-h)} 0 C${f(-h)} ${f(-l * .45)} ${f(-h * .3)} ${f(-l * .82)} 0 ${f(-l)} C${f(h * .3)} ${f(-l * .82)} ${f(h)} ${f(-l * .45)} ${f(h)} 0 ${c}`;
      case 'oval': return `M${f(-h)} 0 L${f(-h)} ${f(-l + h)} A${f(h)} ${f(h)} 0 0 1 ${f(h)} ${f(-l + h)} L${f(h)} 0 ${c}`;
      default: return `M${f(-h)} 0 L${f(-h)} ${f(-l * .42)} C${f(-h)} ${f(-l * .84)} ${f(-h * .42)} ${f(-l)} 0 ${f(-l)} C${f(h * .42)} ${f(-l)} ${f(h)} ${f(-l * .84)} ${f(h)} ${f(-l * .42)} L${f(h)} 0 ${c}`;
    }
  }

  const pearl = (x, y, r) => `<g filter="url(#soft)"><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="url(#pearl)"/><ellipse cx="${f(x - r * .34)}" cy="${f(y - r * .36)}" rx="${f(r * .26)}" ry="${f(r * .15)}" fill="#fff" opacity=".9" transform="rotate(-35 ${f(x - r * .34)} ${f(y - r * .36)})"/></g>`;

  function silk(W, H, u, bg) {
    return `<g filter="url(#blur)">
      <path d="M${-W * .1} ${f(H * .72)} C ${f(W * .28)} ${f(H * .52)}, ${f(W * .56)} ${f(H * .92)}, ${f(W * 1.1)} ${f(H * .62)} L ${f(W * 1.1)} ${f(H * 1.1)} L ${-W * .1} ${f(H * 1.1)}Z" fill="${dk(bg[1], .1)}" opacity=".5"/>
      <path d="M${-W * .1} ${f(H * .32)} C ${f(W * .32)} ${f(H * .14)}, ${f(W * .6)} ${f(H * .58)}, ${f(W * 1.1)} ${f(H * .28)}" stroke="${lt(bg[0], .6)}" stroke-width="${f(u * .1)}" fill="none" opacity=".55"/>
      <path d="M${-W * .1} ${f(H * .86)} C ${f(W * .3)} ${f(H * .7)}, ${f(W * .7)} ${f(H * 1.02)}, ${f(W * 1.1)} ${f(H * .8)}" stroke="${lt(bg[0], .45)}" stroke-width="${f(u * .06)}" fill="none" opacity=".45"/>
    </g>`;
  }

  function strand(x0, y0, x1, y1, cy, r, n) {
    let b = '';
    for (let i = 0; i <= n; i++) {
      const t = i / n, mt = 1 - t;
      const x = mt * mt * x0 + 2 * mt * t * ((x0 + x1) / 2) + t * t * x1;
      const y = mt * mt * y0 + 2 * mt * t * cy + t * t * y1;
      b += pearl(x, y, r * (0.92 + rand() * .16));
    }
    return b;
  }

  function props(s, W, H, u) {
    const p = s.props || 'pearls';
    const left = (s.px ?? .5) >= .5;
    let b = '';
    if (p === 'pearls') {
      const pts = [[.15, .76, .034], [.24, .85, .027], [.1, .88, .021], [.29, .7, .015]];
      pts.forEach(([x, y, r]) => { b += pearl(W * (left ? x : 1 - x), H * y, u * r); });
    }
    if (p === 'strand') {
      b += strand(-W * .05, H * .78, W * .5, H * 1.02, H * .98, u * .026, 14);
      b += pearl(W * .84, H * .2, u * .024) + pearl(W * .9, H * .27, u * .014);
    }
    return b;
  }

  function nails(s, W, H, u) {
    const skin = SKIN[s.skin || 'light'];
    const pol = s.polish || '#E9C8BE';
    const acc = s.accent || '#C9A15E';
    D += `<linearGradient id="sk" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${dk(skin[1], .1)}"/><stop offset=".26" stop-color="${skin[0]}"/><stop offset=".6" stop-color="${lt(skin[0], .12)}"/><stop offset="1" stop-color="${dk(skin[1], .14)}"/></linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6E4B4"/><stop offset=".45" stop-color="${acc}"/><stop offset="1" stop-color="#7E5D2A"/></linearGradient>`;
    const lenK = { short: 1.02, medium: 1.42, long: 1.86 }[s.length || 'medium'];
    const sc = s.scale || 1;
    const px = W * (s.px ?? .5), py = H * (s.py ?? 1.14);
    const reach = (s.reach ?? .76) * H;
    const fingers = [{ a: -11, L: .93, f: 1 }, { a: -3.6, L: 1, f: 1.05 }, { a: 3.8, L: .97, f: 1.02 }, { a: 11.4, L: .82, f: .88 }];
    const fw0 = u * .12 * sc;
    let body = `<g filter="url(#ds)" transform="rotate(${s.tilt || 0} ${f(px)} ${f(py)})">`;
    fingers.forEach((fg, i) => {
      const a = fg.a * (s.spread || 1), L = reach * fg.L, fw = fw0 * fg.f;
      const r = a * Math.PI / 180, x = px + L * Math.sin(r), y = py - L * Math.cos(r);
      const w = fw * .8, h = w / 2, l = w * lenK * (fg.L >= 1 ? 1.05 : 1);
      const id = 'n' + i;
      const d = nailPath(s.shape, w, l);
      let fin = s.finish;
      if (fin === 'mix') fin = ['solid', 'art', 'solid', 'foil'][i];
      if (fin === 'mixfrench') fin = i === 2 ? 'artfrench' : 'french';
      const sheer = ['french', 'nude', 'pearl', 'line', 'artfrench'].includes(fin);
      const base = sheer ? (s.base || pol) : pol;
      if (fin === 'chrome') {
        D += `<linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${lt(pol, .7)}"/><stop offset=".3" stop-color="${dk(pol, .25)}"/><stop offset=".52" stop-color="${lt(pol, .82)}"/><stop offset=".76" stop-color="${pol}"/><stop offset="1" stop-color="${dk(pol, .38)}"/></linearGradient>`;
      } else {
        D += `<linearGradient id="${id}g" x1="0" y1="1" x2=".35" y2="0"><stop offset="0" stop-color="${dk(base, .16)}"/><stop offset=".5" stop-color="${base}"/><stop offset="1" stop-color="${lt(base, .24)}"/></linearGradient>`;
      }
      D += `<clipPath id="${id}c"><path d="${d}"/></clipPath>`;

      let ex = '';
      if (fin === 'french' || fin === 'artfrench') {
        ex += `<path d="M${f(-h - 4)} ${f(-l * .72)} Q0 ${f(-l * .9)} ${f(h + 4)} ${f(-l * .72)} L${f(h + 4)} ${f(-l - 6)} L${f(-h - 4)} ${f(-l - 6)}Z" fill="${s.tip || '#FBF8F4'}"/>`;
        ex += `<path d="M${f(-h - 4)} ${f(-l * .72)} Q0 ${f(-l * .9)} ${f(h + 4)} ${f(-l * .72)}" stroke="${dk(base, .12)}" stroke-width="${f(w * .015)}" fill="none" opacity=".4"/>`;
      }
      if (fin === 'art' || fin === 'artfrench') {
        ex += `<path d="M${f(-h)} ${f(-l * .22)} C ${f(-h * .1)} ${f(-l * .4)}, ${f(h * .3)} ${f(-l * .16)}, ${f(h)} ${f(-l * .58)}" stroke="url(#gold)" stroke-width="${f(w * .07)}" fill="none"/>`;
        ex += `<path d="M${f(-h)} ${f(-l * .5)} C ${f(-h * .2)} ${f(-l * .66)}, ${f(h * .4)} ${f(-l * .46)}, ${f(h)} ${f(-l * .86)}" stroke="${lt(base, .55)}" stroke-width="${f(w * .12)}" fill="none" opacity=".75"/>`;
        ex += `<circle cx="${f(-h * .3)}" cy="${f(-l * .7)}" r="${f(w * .06)}" fill="url(#gold)"/>`;
      }
      if (fin === 'foil') {
        for (let k = 0; k < 7; k++) {
          const cx = (rand() - .5) * w * .9, cy = -l * (.35 + rand() * .55), rr = w * (.05 + rand() * .09);
          ex += `<polygon points="${f(cx)},${f(cy - rr)} ${f(cx + rr * 1.1)},${f(cy - rr * .2)} ${f(cx + rr * .4)},${f(cy + rr)} ${f(cx - rr)},${f(cy + rr * .3)}" fill="url(#gold)" opacity=".95"/>`;
        }
      }
      if (fin === 'line') {
        ex += `<path d="M${f(w * .14)} ${f(-l * .06)} L${f(w * .14)} ${f(-l * .94)}" stroke="url(#gold)" stroke-width="${f(w * .035)}"/>`;
        if (i === 2) ex += `<circle cx="${f(-w * .12)}" cy="${f(-l * .3)}" r="${f(w * .05)}" fill="url(#gold)"/>`;
      }
      if (fin === 'pearl' && (i === 1 || i === 2)) {
        [-w * .2, 0, w * .2].forEach(dx => { ex += `<circle cx="${f(dx)}" cy="${f(-l * .17)}" r="${f(w * .075)}" fill="url(#pearl)"/>`; });
      }
      ex += `<ellipse cx="${f(-h * .42)}" cy="${f(-l * .52)}" rx="${f(w * .085)}" ry="${f(l * .3)}" fill="#fff" opacity="${fin === 'chrome' ? .55 : .36}"/>`;
      ex += `<ellipse cx="${f(h * .3)}" cy="${f(-l * .8)}" rx="${f(w * .045)}" ry="${f(w * .09)}" fill="#fff" opacity=".42"/>`;

      body += `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})">
        <rect x="${f(-fw / 2)}" y="${f(-w * 1.08)}" width="${f(fw)}" height="${f(L + fw * 2)}" rx="${f(fw / 2)}" fill="url(#sk)"/>
        <path d="M${f(-fw * .26)} ${f(fw * 1.55)} q ${f(fw * .26)} ${f(fw * .1)} ${f(fw * .52)} 0" stroke="${dk(skin[1], .3)}" stroke-width="${f(fw * .02)}" fill="none" opacity=".35"/>
        <path d="${d}" fill="${dk(skin[1], .12)}" transform="translate(0 ${f(w * .03)}) scale(1.07)" opacity=".45"/>
        <g clip-path="url(#${id}c)"><path d="${d}" fill="url(#${id}g)"${sheer ? ' fill-opacity=".9"' : ''}/>${ex}</g>
        <path d="${d}" fill="none" stroke="${dk(base, .32)}" stroke-opacity=".32" stroke-width="${f(w * .012)}"/>
      </g>`;
    });
    body += '</g>';
    body += props(s, W, H, u);
    return body;
  }

  function bottle(x, y, s, col, cap) {
    const id = 'b' + Math.round(rand() * 1e6);
    const bw = s * .6, bh = s * .6, cw = s * .25, ch = s * .58;
    const capCol = cap === 'gold' ? ['#F2DDA4', '#B48A45', '#7E5D2A'] : ['#4A3A35', '#1E1614', '#0E0A09'];
    D += `<linearGradient id="${id}" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${dk(col, .22)}"/><stop offset=".35" stop-color="${col}"/><stop offset=".6" stop-color="${lt(col, .18)}"/><stop offset="1" stop-color="${dk(col, .32)}"/></linearGradient>
      <linearGradient id="${id}c" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${capCol[2]}"/><stop offset=".4" stop-color="${capCol[0]}"/><stop offset=".7" stop-color="${capCol[1]}"/><stop offset="1" stop-color="${capCol[2]}"/></linearGradient>`;
    return `<g filter="url(#ds)">
      <rect x="${f(x - bw / 2)}" y="${f(y - bh)}" width="${f(bw)}" height="${f(bh)}" rx="${f(s * .12)}" fill="url(#${id})"/>
      <rect x="${f(x - bw / 2 + bw * .12)}" y="${f(y - bh + bh * .14)}" width="${f(bw * .1)}" height="${f(bh * .66)}" rx="${f(bw * .05)}" fill="#fff" opacity=".38"/>
      <rect x="${f(x - s * .15)}" y="${f(y - bh - s * .05)}" width="${f(s * .3)}" height="${f(s * .06)}" fill="${dk(col, .25)}"/>
      <rect x="${f(x - cw / 2)}" y="${f(y - bh - s * .05 - ch)}" width="${f(cw)}" height="${f(ch)}" rx="${f(s * .04)}" fill="url(#${id}c)"/>
    </g>`;
  }

  function bottles(s, W, H, u) {
    const bg = s.bg, cols = s.colors || ['#8E1F2F', '#E9C8BE', '#C9958F'];
    const floor = H * .76;
    let b = `<path d="M${f(W * .2)} ${f(floor)} L${f(W * .2)} ${f(H * .38)} A ${f(W * .3)} ${f(W * .3)} 0 0 1 ${f(W * .8)} ${f(H * .38)} L${f(W * .8)} ${f(floor)}Z" fill="${lt(bg[1], .16)}" opacity=".85"/>`;
    b += `<rect x="0" y="${f(floor)}" width="${W}" height="${f(H - floor)}" fill="${dk(bg[1], .04)}"/><rect x="0" y="${f(floor)}" width="${W}" height="${f(u * .005)}" fill="#fff" opacity=".55"/>`;
    [[.36, .32], [.53, .38], [.68, .27]].forEach(([x, sz], i) => { b += bottle(W * x, floor + u * .012, u * sz, cols[i % cols.length], s.cap); });
    [[.22, .87, .03], [.28, .92, .022], [.78, .89, .028], [.84, .84, .018]].forEach(([x, y, r]) => { b += pearl(W * x, H * y, u * r); });
    return b;
  }

  function studioScene(s, W, H, u) {
    const bg = s.bg, floor = H * (s.floor ?? .7);
    const ax = W * (s.ax ?? .64), aw = W * .3;
    let b = '';
    if (s.arch) {
      D += `<linearGradient id="win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFDF8"/><stop offset="1" stop-color="${lt(bg[0], .35)}"/></linearGradient>`;
      b += `<path d="M${f(ax - aw / 2)} ${f(floor)} L${f(ax - aw / 2)} ${f(H * .3)} A ${f(aw / 2)} ${f(aw / 2)} 0 0 1 ${f(ax + aw / 2)} ${f(H * .3)} L${f(ax + aw / 2)} ${f(floor)}Z" fill="url(#win)" stroke="${lt(bg[0], .5)}" stroke-width="${f(u * .012)}"/>`;
      b += `<path d="M${f(ax)} ${f(H * .3 - aw / 2)} L${f(ax)} ${f(floor)} M${f(ax - aw / 2)} ${f(H * .5)} L${f(ax + aw / 2)} ${f(H * .5)}" stroke="${lt(bg[1], .3)}" stroke-width="${f(u * .006)}"/>`;
      b += `<polygon points="${f(ax - aw / 2)},${f(floor)} ${f(ax + aw / 2)},${f(floor)} ${f(ax + aw * 1.6)},${f(H)} ${f(ax - aw * .4)},${f(H)}" fill="#fff" opacity=".28" filter="url(#blur)"/>`;
    }
    if (s.mirror) {
      D += `<radialGradient id="mir" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${lt(bg[0], .7)}"/><stop offset="1" stop-color="${dk(bg[1], .05)}"/></radialGradient>`;
      b += `<circle cx="${f(W * .2)}" cy="${f(H * .36)}" r="${f(u * .14)}" fill="url(#mir)" stroke="#C9A15E" stroke-width="${f(u * .006)}"/>`;
    }
    if (s.lamp) {
      b += `<path d="M${f(W * .74)} ${f(floor)} L${f(W * .74)} ${f(H * .3)}" stroke="${dk(bg[1], .35)}" stroke-width="${f(u * .008)}"/>`;
      b += `<path d="M${f(W * .6)} ${f(H * .3)} A ${f(W * .14)} ${f(W * .14)} 0 0 1 ${f(W * .88)} ${f(H * .3)}Z" fill="${lt(bg[0], .4)}" stroke="${dk(bg[1], .1)}" stroke-width="${f(u * .004)}"/>`;
      b += `<ellipse cx="${f(W * .74)}" cy="${f(H * .5)}" rx="${f(W * .3)}" ry="${f(H * .2)}" fill="#FFF8EC" opacity=".35" filter="url(#blur)"/>`;
    }
    b += `<rect x="0" y="${f(floor)}" width="${W}" height="${f(H - floor)}" fill="${s.table || lt(bg[1], .2)}"/>`;
    b += `<rect x="0" y="${f(floor)}" width="${W}" height="${f(u * .008)}" fill="#fff" opacity=".6"/>`;
    b += `<rect x="0" y="${f(floor + u * .008)}" width="${W}" height="${f(u * .05)}" fill="${dk(bg[1], .2)}" opacity=".15" filter="url(#blur)"/>`;
    if (s.vase) {
      b += `<path d="M${f(W * .14)} ${f(floor)} C ${f(W * .08)} ${f(floor - u * .12)}, ${f(W * .12)} ${f(floor - u * .2)}, ${f(W * .16)} ${f(floor - u * .22)} L${f(W * .2)} ${f(floor - u * .22)} C ${f(W * .24)} ${f(floor - u * .2)}, ${f(W * .28)} ${f(floor - u * .12)}, ${f(W * .22)} ${f(floor)}Z" fill="${lt(bg[0], .5)}" filter="url(#ds)"/>`;
      b += `<path d="M${f(W * .18)} ${f(floor - u * .22)} C ${f(W * .16)} ${f(floor - u * .4)}, ${f(W * .1)} ${f(floor - u * .5)}, ${f(W * .06)} ${f(floor - u * .58)} M${f(W * .18)} ${f(floor - u * .22)} C ${f(W * .2)} ${f(floor - u * .42)}, ${f(W * .27)} ${f(floor - u * .5)}, ${f(W * .3)} ${f(floor - u * .62)}" stroke="${dk(bg[1], .35)}" stroke-width="${f(u * .005)}" fill="none"/>`;
    }
    if (s.cushion) {
      b += `<rect x="${f(W * .18)}" y="${f(floor + u * .05)}" width="${f(W * .42)}" height="${f(u * .1)}" rx="${f(u * .05)}" fill="#E7CFCB" filter="url(#ds)"/>`;
      b += `<rect x="${f(W * .22)}" y="${f(floor + u * .065)}" width="${f(W * .3)}" height="${f(u * .018)}" rx="${f(u * .009)}" fill="#fff" opacity=".45"/>`;
    }
    if (s.towel) {
      [0, 1, 2].forEach(k => { b += `<rect x="${f(W * .56)}" y="${f(floor - u * (.05 + k * .045))}" width="${f(W * .3)}" height="${f(u * .05)}" rx="${f(u * .02)}" fill="${k % 2 ? '#F6EEE8' : '#EADBD2'}" filter="url(#ds)"/>`; });
    }
    const cols = ['#8E1F2F', '#E7C6BC', '#C9958F', '#F1E3DA'];
    for (let k = 0; k < (s.bottles || 0); k++) {
      const x = (s.towel ? W * .2 : W * .3) + k * u * .11;
      b += bottle(x, floor + u * .004, u * .16, cols[k % cols.length], k % 2 ? 'gold' : 'black');
    }
    b += pearl(W * .5, floor + u * .12, u * .02) + pearl(W * .55, floor + u * .14, u * .014);
    return b;
  }

  function monogram(s, W, H, u) {
    const bg = s.bg;
    D += `<linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6E4B4"/><stop offset=".5" stop-color="#C29A57"/><stop offset="1" stop-color="#7E5D2A"/></linearGradient>`;
    const x0 = W * .22, x1 = W * .78, r = (x1 - x0) / 2, top = H * .42;
    let b = `<path d="M${f(x0)} ${f(H * 1.02)} L${f(x0)} ${f(top)} A ${f(r)} ${f(r)} 0 0 1 ${f(x1)} ${f(top)} L${f(x1)} ${f(H * 1.02)}Z" fill="${s.archColor || lt(bg[1], .1)}" filter="url(#ds)"/>`;
    b += `<path d="M${f(x0 + u * .03)} ${f(H * 1.02)} L${f(x0 + u * .03)} ${f(top)} A ${f(r - u * .03)} ${f(r - u * .03)} 0 0 1 ${f(x1 - u * .03)} ${f(top)} L${f(x1 - u * .03)} ${f(H * 1.02)}" fill="none" stroke="url(#mg)" stroke-width="${f(u * .004)}"/>`;
    b += `<text x="${f(W / 2)}" y="${f(H * .6)}" text-anchor="middle" font-family="'Bodoni 72', Didot, 'Bodoni Moda', Georgia, serif" font-style="italic" font-size="${f(u * .3)}" fill="url(#mg)">CG</text>`;
    b += `<text x="${f(W / 2)}" y="${f(H * .68)}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${f(u * .022)}" letter-spacing="${f(u * .012)}" fill="${dk(bg[1], .45)}">BEAUTY STUDIO</text>`;
    b += strand(W * .18, H * .9, W * .82, H * .9, H * 1.0, u * .024, 16);
    return b;
  }

  const KIND = { nails, bottles, studio: studioScene, monogram };

  function build(s, W, H) {
    const u = Math.min(W, H);
    const bg = s.bg || ['#F4E6DF', '#D9B9AE'];
    const light = s.light || [.28, .18];
    rand = seedRng(JSON.stringify(s) + W);
    D = `<radialGradient id="bgg" cx="${light[0]}" cy="${light[1]}" r="1.1"><stop offset="0" stop-color="${lt(bg[0], .25)}"/><stop offset=".55" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></radialGradient>
      <radialGradient id="pearl" cx=".36" cy=".3" r=".75"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#F8F0EA"/><stop offset=".72" stop-color="#DDCDC2"/><stop offset="1" stop-color="#B29D90"/></radialGradient>
      <radialGradient id="vig" cx=".5" cy=".45" r=".78"><stop offset=".55" stop-color="${dk(bg[1], .4)}" stop-opacity="0"/><stop offset="1" stop-color="${dk(bg[1], .45)}" stop-opacity=".42"/></radialGradient>
      <filter id="blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${f(u * .045)}"/></filter>
      <filter id="ds" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="${f(u * .015)}" dy="${f(u * .03)}" stdDeviation="${f(u * .028)}" flood-color="${dk(bg[1], .6)}" flood-opacity=".38"/></filter>
      <filter id="soft" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="${f(u * .01)}" stdDeviation="${f(u * .008)}" flood-color="#4a2c25" flood-opacity=".32"/></filter>`;
    let body = `<rect width="${W}" height="${H}" fill="url(#bgg)"/>` + silk(W, H, u, bg);
    body += (KIND[s.kind] || nails)(s, W, H, u);
    body += `<rect width="${W}" height="${H}" fill="url(#vig)"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${D}</defs>${body}</svg>`;
  }

  function uri(spec = {}, ratio = 'portrait') {
    const key = JSON.stringify(spec) + '|' + ratio;
    if (cache.has(key)) return cache.get(key);
    const [W, H] = RATIOS[ratio] || RATIOS.portrait;
    const out = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(build(spec, W, H));
    cache.set(key, out);
    return out;
  }
  return { uri };
})();

/* =====================================================================
   4. RENDER
   ===================================================================== */
function media(item, { ratio = 'portrait', mobileRatio = null, alt = '', eager = false } = {}) {
  const altText = esc(alt || item.alt || item.title || item.name || '');
  const img = item.image;
  let src = typeof img === 'string' ? (img ? { desktop: img } : null) : img;
  if (src && !src.desktop && src.mobile) src = { desktop: src.mobile };
  if (src) src = { desktop: LocalImg.get(src.desktop) || src.desktop, mobile: src.mobile ? (LocalImg.get(src.mobile) || src.mobile) : '' };
  const loading = eager ? 'eager' : 'lazy';
  if (src && src.desktop) {
    return `<picture>${src.mobile ? `<source media="(max-width: 699px)" srcset="${src.mobile}">` : ''}<img src="${src.desktop}" alt="${altText}" loading="${loading}" decoding="async"></picture>`;
  }
  const d = Art.uri(item.art, ratio);
  const m = mobileRatio ? Art.uri(item.art, mobileRatio) : null;
  return `<picture>${m ? `<source media="(max-width: 699px)" srcset="${m}">` : ''}<img src="${d}" alt="${altText}" decoding="async"></picture>`;
}

function badgeSVG(text = 'Beauty Studio ✦ Cátia Gonçalves ✦ ') {
  const id = 'bp' + uid();
  return `<svg viewBox="0 0 200 200" aria-hidden="true"><g class="badge__ring"><defs><path id="${id}" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"/></defs><text><textPath href="#${id}" textLength="498" lengthAdjust="spacing">${text}</textPath></text></g><circle class="badge__dot" cx="100" cy="100" r="34" fill="none" stroke="currentColor" stroke-opacity=".25"/><text class="badge__mono" x="100" y="111" text-anchor="middle">CG</text></svg>`;
}

function svcItem(s, i) {
  const n = String(i + 1).padStart(2, '0');
  const pid = `svc-${s.id}-${uid()}`;
  return `<li class="svc" data-id="${s.id}" data-cursor="explorar">
    <button class="svc__row" type="button" aria-expanded="false" aria-controls="${pid}">
      <span class="svc__num">${n}</span>
      <span class="svc__name">${esc(s.name)}</span>
      <span class="svc__meta"><b>${priceText(s)}</b><span>${esc(s.duration)}${s.priceNote ? ' · ' + esc(s.priceNote) : ''}</span></span>
      <span class="svc__plus" aria-hidden="true"></span>
    </button>
    <div class="svc__panel" id="${pid}" inert>
      <div class="svc__panel-inner"><div class="svc__detail">
        <div class="svc__media">${media(s, { ratio: 'portrait' })}</div>
        <p class="svc__desc">${esc(s.description)}</p>
        <div class="svc__aside">
          <div class="svc__facts"><span class="svc__price">${s.from ? '<small>desde</small>' : ''}€${s.price}</span><span class="svc__dur">${esc(s.duration)}${s.priceNote ? ' · ' + esc(s.priceNote) : ''}</span></div>
          <a class="btn btn--dark btn--sm svc__cta" data-book="Olá Cátia! Gostaria de marcar: ${esc(s.name)}." data-cursor="abrir">Marcar este serviço</a>
        </div>
      </div></div>
    </div>
    <span class="svc__rule" aria-hidden="true"></span>
  </li>`;
}

const REVEALS = ['curtain', 'mask', 'blur', 'scale', 'organic', 'curtain'];
function tile(g, i) {
  const k = (i % 6) + 1;
  const ratio = (k === 1 || k === 4) ? 'square' : 'portrait';
  return `<figure class="tile tile--${k}${g.arch ? ' tile--arch' : ''}" data-cat="${esc(g.category)}">
    <button class="tile__btn" type="button" data-lightbox="${g.id}" data-cursor="ver" aria-label="Ver trabalho: ${esc(g.title)}">
      <div class="tile__media" data-reveal="${REVEALS[k - 1]}">${media(g, { ratio, alt: `${g.title}, ${g.category}` })}<span class="tile__over" aria-hidden="true"><span>Ver trabalho</span></span></div>
    </button>
    <figcaption><span class="tile__title">${esc(g.title)}</span><span class="tile__meta">${esc(g.category)}</span></figcaption>
  </figure>`;
}

function priceItem(s) {
  return `<li class="price">
    <span class="price__name">${esc(s.name)}</span>
    <span class="price__dur">${esc(s.duration)}${s.priceNote ? ' · ' + esc(s.priceNote) : ''}</span>
    <span class="price__val">${s.from ? '<span class="price__from">desde</span>' : ''}<sup>€</sup><span data-count="${s.price}">${s.price}</span></span>
  </li>`;
}

function infoList(full) {
  const rows = [
    ['Morada', `<span>${esc(studio.address)}</span>`],
    ['Horário', `<ul class="hours">${studio.hours.map(([d, h]) => `<li><span>${d}</span><span>${h}</span></li>`).join('')}</ul>`],
    ['WhatsApp', `<a data-whatsapp data-cursor="contactar">${esc(studio.phone)}</a>`]
  ];
  if (full) {
    rows.push(['Telefone', `<span class="copyable">${esc(studio.phone)}</span><button type="button" class="copy-btn" data-copy="${esc(studio.phone)}">Copiar</button>`]);
    rows.push(['Email', `<span class="copyable">${esc(studio.email)}</span><button type="button" class="copy-btn" data-copy="${esc(studio.email)}">Copiar</button>`]);
    rows.push(['Instagram', `<a data-instagram data-cursor="abrir">${esc(studio.instagram.handle)}</a>`]);
  }
  return rows.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('');
}

function mapMarkup() {
  const q = encodeURIComponent(studio.address.replace('·', ','));
  return `<svg viewBox="0 0 800 550" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="800" height="550" fill="#EFE4DC"/>
      <path d="M0 430 C 180 390, 330 480, 520 440 S 760 390, 800 410 L800 550 L0 550Z" fill="#DCE3E1"/>
      <ellipse cx="170" cy="150" rx="110" ry="70" fill="#DFE3D3"/>
      <g fill="#E6D8CD">
        <rect x="290" y="60" width="120" height="80" rx="6"/><rect x="440" y="60" width="150" height="80" rx="6"/><rect x="620" y="40" width="140" height="120" rx="6"/>
        <rect x="290" y="180" width="90" height="110" rx="6"/><rect x="560" y="200" width="200" height="90" rx="6"/><rect x="60" y="260" width="180" height="90" rx="6"/>
        <rect x="290" y="320" width="160" height="60" rx="6"/><rect x="480" y="320" width="120" height="70" rx="6"/>
      </g>
      <g stroke="#FBF8F4" fill="none" stroke-linecap="round">
        <path d="M0 230 C 200 220, 420 160, 800 180" stroke-width="16"/>
        <path d="M260 0 L270 550" stroke-width="12"/>
        <path d="M420 160 C 430 260, 520 300, 540 550" stroke-width="10"/>
        <path d="M0 380 C 200 370, 400 310, 800 310" stroke-width="8"/>
        <path d="M600 0 L610 300" stroke-width="7"/>
      </g>
      <path d="M270 520 C 300 400, 360 330, 432 253" stroke="#B8935A" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round" fill="none"/>
    </svg>
    <div class="map__pin" aria-hidden="true"><span class="map__pin-dot"></span></div>
    <div class="map__card"><p class="map__addr">${esc(studio.address)}</p><a class="link-arrow" href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener" data-cursor="abrir">Abrir no Google Maps <span aria-hidden="true">→</span></a></div>`;
}

function splitWords(el) {
  if (el.dataset.split) return;
  el.dataset.split = '1';
  const walk = (node) => {
    Array.from(node.childNodes).forEach(n => {
      if (n.nodeType === 3) {
        const parts = n.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'w';
          const wi = document.createElement('span'); wi.className = 'wi'; wi.textContent = p;
          w.appendChild(wi); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
  };
  walk(el);
}

function splitChars(el) {
  if (el.dataset.split) return;
  el.dataset.split = '1';
  const text = el.textContent;
  if (!el.getAttribute('aria-label') && !el.closest('[aria-label]')) el.setAttribute('aria-label', text.trim());
  el.innerHTML = Array.from(text).map(c => c === ' ' ? ' ' : `<span class="ch" aria-hidden="true"><span class="chm"><span class="chi">${esc(c)}</span></span></span>`).join('');
}

function renderAll(data) {
  const { services, gallery, collections, promotions, pages } = data;

  // page media slots
  $$('[data-media]').forEach(el => {
    const p = pages[el.dataset.media]; if (!p) return;
    const opts = { intro: { ratio: 'landscape', mobileRatio: 'tall', eager: true }, hero: { ratio: 'portrait', eager: true }, duoA: { ratio: 'portrait', mobileRatio: 'landscape' }, duoB: { ratio: 'portrait', mobileRatio: 'landscape' }, about: { ratio: 'portrait' } }[el.dataset.media] || {};
    el.innerHTML = media(p, opts);
  });

  // studio text bindings
  const bind = {
    address: studio.address, hoursShort: studio.hoursShort, phone: studio.phone, email: studio.email,
    aboutShort: studio.aboutShort, aboutLead: studio.aboutLead, studioShort: studio.studioShort, quote: studio.quote
  };
  $$('[data-studio]').forEach(el => {
    const k = el.dataset.studio;
    if (k === 'aboutStory') el.innerHTML = studio.aboutStory.map(p => `<p>${esc(p)}</p>`).join('');
    else if (bind[k] != null) { el.textContent = bind[k]; delete el.dataset.split; }
  });
  $$('[data-hours]').forEach(el => { el.innerHTML = studio.hours.map(([d, h]) => `<li><span>${d}</span><span>${h}</span></li>`).join(''); });
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // badges
  $$('[data-badge]').forEach(el => { el.innerHTML = badgeSVG(); });

  // services
  const featured = services.filter(s => s.featured);
  $$('[data-services="home"]').forEach(el => { el.innerHTML = featured.map(svcItem).join(''); });
  const cat = $('[data-catalogue]');
  if (cat) {
    let n = 0;
    const cats = [...new Set([...categoryOrder, ...services.map(s => s.category)])];
    cat.innerHTML = cats.map(c => {
      const list = services.filter(s => s.category === c);
      if (!list.length) return '';
      return `<div class="catalogue__group"><h2 class="catalogue__label">${esc(c)}</h2><ol class="svc-list">${list.map(s => svcItem(s, n++)).join('')}</ol></div>`;
    }).join('');
  }
  $$('[data-prices]').forEach(el => { el.innerHTML = services.slice(0, 6).map(priceItem).join(''); });
  $$('[data-service-options]').forEach(el => { el.innerHTML = `<option value="">Ainda não sei</option>` + services.map(s => `<option>${esc(s.name)}</option>`).join(''); });

  // float images for hover
  const stack = $('.svc-float__stack');
  if (stack) stack.innerHTML = services.map(s => `<div class="svc-float__img" data-id="${s.id}">${media(s, { ratio: 'portrait', alt: '' })}</div>`).join('');

  // featured + gallery
  const feat = gallery.filter(g => g.featured);
  $$('[data-featured]').forEach(el => { el.innerHTML = feat.map(tile).join(''); });
  const gal = $('[data-gallery]');
  if (gal) gal.innerHTML = gallery.map(tile).join('');
  const fil = $('[data-filters]');
  if (fil) {
    const cats = ['Todos', ...new Set(gallery.map(g => g.category))];
    fil.innerHTML = cats.map((c, i) => `<button type="button" class="chip" aria-pressed="${i === 0}" data-filter="${esc(c)}">${esc(c)}</button>`).join('');
  }

  // studio stacks
  const speeds = [-8, 6, -4, 10, -6];
  $$('[data-studio-stack]').forEach(el => {
    el.innerHTML = studio.images.map((im, i) => `<figure class="layer layer--${i + 1}" data-speed="${speeds[i]}">
      <div class="layer__media" data-reveal="${['curtain', 'blur', 'mask', 'scale', 'organic'][i]}">${media(im, { ratio: ['portrait', 'square', 'portrait', 'square', 'landscape'][i] })}</div>
      <figcaption>${String(i + 1).padStart(2, '0')} — ${esc(im.caption)}</figcaption>
    </figure>`).join('');
  });

  // promo
  const p = promotions.find(x => x.active);
  const promoEl = $('[data-promo]');
  if (promoEl) promoEl.hidden = !p;
  if (promoEl && p) {
    promoEl.innerHTML = `<div class="promo__stage">
      <div class="promo__media">${media(p, { ratio: 'landscape', mobileRatio: 'tall' })}</div>
      <div class="promo__type" aria-hidden="true"><span class="promo__w promo__w--a">${esc(p.wordA)}</span><span class="promo__w promo__w--b">${esc(p.wordB)}</span></div>
      <div class="badge promo__badge">${badgeSVG('Edição limitada ✦ Beauty Studio ✦ ')}</div>
      <div class="promo__card">
        <p class="eyebrow">${esc(p.eyebrow)}</p>
        <h2 class="promo__title" id="promo-title">${esc(p.title)}${p.titleEm ? ` <em>${esc(p.titleEm)}</em>` : ''}</h2>
        <p class="promo__desc">${esc(p.description)}</p>
        <div class="promo__prices">
          <span class="price-old"><span class="sr">Preço habitual </span>€${p.priceOld}<i class="strike" aria-hidden="true"></i></span>
          <span class="price-new"><span class="sr">Preço da promoção </span><sup>€</sup>${p.priceNew}</span>
        </div>
        <a class="btn btn--clay" data-book="${esc(p.message)}" data-magnetic data-cursor="abrir">Marcar</a>
        <p class="promo__note">${esc(p.note)}</p>
      </div>
    </div>`;
  } else if (promoEl) promoEl.innerHTML = '';

  // collections
  const col = $('[data-collections]');
  if (col) {
    const pat = [['54svh', '3 / 4', ''], ['42svh', '4 / 5', '999px 999px 10px 10px'], ['60svh', '2 / 3', ''], ['46svh', '1 / 1', ''], ['52svh', '3 / 4', '999px 999px 10px 10px'], ['44svh', '4 / 5', '']];
    col.innerHTML = collections.map((c, i) => { const [ph, pa, pr] = pat[i % pat.length]; const h = c.h || ph, ar = c.ar || pa, r = c.r ?? pr; return `<figure class="panel" style="--h:${h};--ar:${ar}${r ? ';--r:' + r : ''}">
      <div class="panel__media">${media(c, { ratio: 'portrait', alt: c.title })}</div>
      <figcaption><span class="panel__num">${String(i + 1).padStart(2, '0')} —</span><span class="panel__title">${esc(c.title)}</span></figcaption>
      <p class="panel__line">${esc(c.line)}</p>
    </figure>`; }).join('');
    $$('[data-col-total]').forEach(el => { el.textContent = String(collections.length).padStart(2, '0'); });
  }

  // instagram
  const ig = $('[data-insta]');
  if (ig) {
    ig.innerHTML = gallery.slice(-6).reverse().map(g => `<a class="insta__tile" href="${studio.instagram.url}" target="_blank" rel="noopener" data-cursor="ver" aria-label="${esc(g.title)} no Instagram">${media(g, { ratio: 'square', alt: '' })}</a>`).join('');
  }
  const mq = $('[data-marquee]');
  if (mq) {
    const unit = `<span>Siga-nos ✦ <em>${esc(studio.instagram.handle)}</em> ✦</span>`;
    mq.innerHTML = unit.repeat(4) + unit.repeat(4);
  }

  // notes, principles, info, map
  $$('[data-notes]').forEach(el => { el.innerHTML = studio.notes.map(n => `<li data-fade><h3>${esc(n.title)}</h3><p>${esc(n.text)}</p></li>`).join(''); });
  $$('[data-principles]').forEach(el => { el.innerHTML = studio.principles.map(p => `<li data-fade><h3>${esc(p.title)} <em>${esc(p.em)}</em></h3><p>${esc(p.text)}</p></li>`).join(''); });
  $$('[data-info]').forEach(el => { el.innerHTML = infoList(el.dataset.info === 'full'); });
  $$('[data-map]').forEach(el => { el.innerHTML = mapMarkup(); });

  // links
  $$('[data-book]').forEach(a => { a.href = waUrl(a.dataset.book); a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-whatsapp]').forEach(a => { a.href = waUrl(studio.bookingMessage); a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-instagram]').forEach(a => { a.href = studio.instagram.url; a.target = '_blank'; a.rel = 'noopener'; });

  // text splitting
  $$('[data-words]').forEach(splitWords);
  $$('[data-chars], [data-chars-reveal]').forEach(splitChars);
}

/* =====================================================================
   5. ROUTER + TRANSIÇÕES
   ===================================================================== */
const VIEWS = ['inicio', 'servicos', 'trabalhos', 'sobre', 'studio', 'contacto', 'admin'];
const LABELS = { inicio: 'Início', servicos: 'Serviços', trabalhos: 'Trabalhos', sobre: 'Sobre', studio: 'Studio', contacto: 'Contacto', admin: 'Área reservada' };
let siteDirty = false;
let current = null, mm = null, busy = false, firstMount = true;
const viewEl = (n) => $(`.view[data-view="${n}"]`);
const nameFromHash = () => { const h = location.hash.slice(1); return VIEWS.includes(h) ? h : 'inicio'; };

function showView(name) {
  VIEWS.forEach(v => { viewEl(v).hidden = v !== name; });
  current = name;
  root.classList.toggle('is-admin', name === 'admin');
  const pill = $('#draftPill');
  if (pill) pill.hidden = name === 'admin' || !(usingDraft && Session.get());
  $$('[data-nav], .menu__list a').forEach(a => {
    const target = a.dataset.nav || a.getAttribute('href').slice(1);
    if (target === name) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  document.title = name === 'inicio' ? studio.name : `${LABELS[name]} — ${studio.name}`;
}

async function go(name, { instant = false } = {}) {
  if (busy) return;
  if (name === current) { window.scrollTo({ top: 0, behavior: mqReduce.matches ? 'auto' : 'smooth' }); return; }
  busy = true;
  const animate = HAS_GSAP && !instant && !mqReduce.matches;
  const overlay = $('#transition'), word = $('.transition__word', overlay);
  if (animate) {
    word.textContent = LABELS[name];
    await gsap.timeline()
      .set(overlay, { visibility: 'visible' })
      .fromTo(overlay, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .42, ease: 'expo.inOut' })
      .fromTo(word, { yPercent: 60, opacity: 0, filter: 'blur(10px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: .38, ease: 'expo.out' }, '-=.22');
  }
  unmount();
  if (name !== 'admin' && siteDirty) { renderAll(currentData()); initMagnetic(); siteDirty = false; }
  showView(name);
  window.scrollTo(0, 0);
  mount(name);
  if (name === 'admin') Admin.enter();
  $('#conteudo').focus({ preventScroll: true });
  if (animate) {
    await gsap.timeline()
      .to(word, { yPercent: -50, opacity: 0, filter: 'blur(8px)', duration: .3, ease: 'expo.in' })
      .to(overlay, { clipPath: 'inset(0% 0% 100% 0%)', duration: .45, ease: 'expo.inOut' }, '-=.12')
      .set(overlay, { visibility: 'hidden' });
  }
  busy = false;
  if (nameFromHash() !== current) go(nameFromHash());
}

/* =====================================================================
   6. MOTION
   ===================================================================== */
const root = document.documentElement;
const INK = '#2A1F1C';
function setTheme(bg, ink) {
  gsap.to(root, { '--bg': bg, '--ink': ink || INK, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
}

function draw(p, st) {
  p.setAttribute('pathLength', '1');
  gsap.fromTo(p, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: st });
}

function reveal(el, type) {
  const inner = el.querySelector('picture') || el.firstElementChild;
  const st = { trigger: el, start: 'top 88%' };
  const D = 1.6;
  switch (type) {
    case 'curtain':
      gsap.fromTo(el, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: D, ease: 'expo.inOut', scrollTrigger: st });
      gsap.fromTo(inner, { scale: 1.3 }, { scale: 1, duration: D + .4, ease: 'expo.out', scrollTrigger: st });
      break;
    case 'mask':
      gsap.fromTo(el, { clipPath: 'inset(16% 22% 16% 22% round 999px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: D + .2, ease: 'expo.inOut', scrollTrigger: st });
      gsap.fromTo(inner, { scale: 1.4 }, { scale: 1, duration: D + .5, ease: 'expo.out', scrollTrigger: st });
      break;
    case 'blur':
      gsap.fromTo(inner, { filter: 'blur(24px)', scale: 1.12, opacity: 0 }, { filter: 'blur(0px)', scale: 1, opacity: 1, duration: D, ease: 'power3.out', scrollTrigger: st, clearProps: 'filter' });
      break;
    case 'scale':
      gsap.fromTo(el, { scale: .8, opacity: 0 }, { scale: 1, opacity: 1, duration: D, ease: 'expo.out', scrollTrigger: st });
      gsap.fromTo(inner, { scale: 1.4 }, { scale: 1, duration: D + .3, ease: 'expo.out', scrollTrigger: st });
      break;
    case 'organic':
      gsap.fromTo(el, { clipPath: 'ellipse(0% 0% at 50% 100%)' }, { clipPath: 'ellipse(120% 130% at 50% 100%)', duration: D + .3, ease: 'power3.inOut', scrollTrigger: st });
      gsap.fromTo(inner, { scale: 1.25, yPercent: 8 }, { scale: 1, yPercent: 0, duration: D + .4, ease: 'expo.out', scrollTrigger: st });
      break;
  }
}

function common(view, c) {
  // background colour choreography
  $$('[data-bg]', view).forEach(sec => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 58%', end: 'bottom 58%',
      onToggle: self => { if (self.isActive) setTheme(sec.dataset.bg, sec.dataset.ink); }
    });
  });

  $$('[data-chars-reveal]', view).forEach(el => {
    gsap.from($$('.chi', el), { yPercent: 115, rotate: 7, duration: 1.4, ease: 'expo.out', stagger: .045, scrollTrigger: { trigger: el, start: 'top 90%' } });
  });
  $$('[data-words]', view).forEach(el => {
    if (el.closest('.intro')) return;
    gsap.from($$('.wi', el), { yPercent: 110, rotate: 3, opacity: 0, duration: 1.25, ease: 'expo.out', stagger: .075, scrollTrigger: { trigger: el, start: 'top 87%' } });
  });
  $$('[data-fade]', view).forEach(el => {
    gsap.from(el, { y: 36, opacity: 0, filter: 'blur(6px)', duration: 1.2, ease: 'power3.out', clearProps: 'filter', scrollTrigger: { trigger: el, start: 'top 92%' } });
  });
  $$('[data-reveal]', view).forEach(el => { if (!el.closest('.hero')) reveal(el, el.dataset.reveal); });

  $$('[data-speed]', view).forEach(el => {
    const sp = +el.dataset.speed * (c.desk ? 1 : .5);
    gsap.fromTo(el, { yPercent: -sp }, { yPercent: sp, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  $$('.giant span', view).forEach((el, i) => {
    const sec = el.closest('section, header');
    gsap.fromTo(el, { xPercent: i % 2 ? -32 : 4 }, { xPercent: i % 2 ? 4 : -32, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  $$('.goldline path', view).forEach(p => {
    if (p.closest('.hero')) return;
    const sec = p.closest('section, header');
    draw(p, { trigger: sec, start: 'top 72%', end: 'bottom 70%', scrub: 1.2 });
  });
  $$('[data-count]', view).forEach(el => {
    const v = +el.dataset.count, o = { v: 0 };
    gsap.to(o, { v, duration: 1.6, ease: 'power3.out', onStart: () => { el.textContent = '0'; }, onUpdate: () => { el.textContent = Math.round(o.v); }, scrollTrigger: { trigger: el, start: 'top 92%' } });
  });
  $$('.pearl', view).forEach(p => {
    if (p.closest('.depth, .intro, .about')) return;
    const sec = p.closest('section, header');
    gsap.to(p, { y: -(70 + (p.offsetWidth % 5) * 30), ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 1 } });
  });
  $$('.badge svg', view).forEach(b => {
    if (b.closest('.promo')) return;
    gsap.to(b, { rotate: 160, ease: 'none', scrollTrigger: { trigger: b.closest('section, header') || b, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
  });

  // list rows
  const rows = $$('.svc, .price, .notes__list li, .principles__list li, .info-list > div', view).filter(r => !r.hasAttribute('data-fade'));
  if (rows.length) {
    gsap.set(rows, { y: 40, opacity: 0 });
    ScrollTrigger.batch(rows, { start: 'top 92%', onEnter: b => gsap.to(b, { y: 0, opacity: 1, stagger: .08, duration: 1.1, ease: 'expo.out', overwrite: true }) });
  }
  const tiles = $$('.insta__tile, .panel', view).filter(t => !t.closest('.hscroll'));
  if (tiles.length) {
    gsap.set(tiles, { y: 50, opacity: 0 });
    ScrollTrigger.batch(tiles, { start: 'top 94%', onEnter: b => gsap.to(b, { y: 0, opacity: 1, stagger: .07, duration: 1.2, ease: 'expo.out', overwrite: true }) });
  }

  // map pin
  $$('.map__pin', view).forEach(pin => {
    gsap.from(pin, { yPercent: -160, opacity: 0, duration: 1.2, ease: 'bounce.out', scrollTrigger: { trigger: pin.parentElement, start: 'top 75%' } });
  });
}

/* ----- Home scenes ----- */
function introScene(view, c) {
  const sec = $('.intro', view);
  const media = $('.intro__media', sec), pic = $('picture', media);
  const charsA = $$('.intro__row--a .ch', sec), charsB = $$('.intro__row--b .ch', sec);
  const rowC = $('.intro__row--c', sec);
  const tag = $('.intro__tag', sec);
  const startClip = c.desk ? 'inset(30% 46.5% 14% 46.5% round 220px 220px 70px 70px)' : 'inset(30% 38% 18% 38% round 140px 140px 44px 44px)';

  // entrance (stage 1 + 2)
  const delay = firstMount ? 1.25 : .35;
  const enter = gsap.timeline({ delay });
  enter.from($$('.chi', sec), { yPercent: 115, duration: 1.5, ease: 'expo.out', stagger: .05 })
    .from(rowC, { opacity: 0, y: 30, filter: 'blur(8px)', duration: 1.2, ease: 'power3.out', clearProps: 'filter' }, .45)
    .from([$('.intro__badge', sec), $('.intro__pearl', sec), $('.intro__pearl2', sec)], { scale: 0, opacity: 0, duration: 1.2, ease: 'back.out(1.6)', stagger: .12 }, .6)
    .from([$('.scroll-cue', sec), $('.intro__kicker', sec)], { opacity: 0, y: 16, duration: 1, ease: 'power3.out', stagger: .1 }, .9);
  const nail = $('.intro__nail path', sec);
  nail.setAttribute('pathLength', '1');
  enter.fromTo(nail, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, .3);

  // scroll story (stage 3 → 5)
  gsap.set(media, { clipPath: startClip, opacity: 0 });
  gsap.set(tag, { opacity: 1 });
  gsap.set($$('.wi', tag), { yPercent: 110 });
  const spread = () => innerWidth * (c.desk ? .055 : .07);
  const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: c.desk ? '+=230%' : '+=190%', pin: true, scrub: 1, anticipatePin: 1 } });
  tl.to([$('.scroll-cue', sec), $('.intro__kicker', sec)], { opacity: 0, y: 20, duration: .1 }, 0)
    .to(charsA, { x: (i, t, a) => (i - (a.length - 1) / 2) * spread(), y: (i) => -40 - (i % 3) * 30, rotate: (i) => (i % 2 ? 8 : -6), opacity: 0, duration: .5, ease: 'power2.in', stagger: { each: .02, from: 'center' } }, .04)
    .to(charsB, { x: (i, t, a) => (i - (a.length - 1) / 2) * spread(), y: (i) => 40 + (i % 3) * 30, rotate: (i) => (i % 2 ? -8 : 6), opacity: 0, duration: .5, ease: 'power2.in', stagger: { each: .02, from: 'center' } }, .04)
    .to(rowC, { letterSpacing: '.3em', opacity: 0, duration: .4 }, .08)
    .to(media, { opacity: 1, duration: .12 }, .06)
    .to([$('.intro__badge', sec), $('.intro__pearl', sec), $('.intro__pearl2', sec), $('.intro__nail', sec)], { yPercent: -260, opacity: 0, duration: .5, ease: 'power1.in', stagger: .04 }, .1)
    .to(media, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', duration: .6, ease: 'power2.inOut' }, .22)
    .fromTo(pic, { scale: 1.45 }, { scale: 1, duration: .9, ease: 'none' }, .1)
    .to($('.intro__veil', sec), { opacity: 1, duration: .3 }, .6)
    .to($$('.wi', tag), { yPercent: 0, duration: .3, ease: 'power3.out', stagger: .05 }, .7)
    .to({}, { duration: .2 });
}

function heroScene(view, c, cleanups) {
  const hero = $('.hero', view);
  const frame = $('.hero__frame', hero);
  reveal(frame, 'mask');
  const gold = $('.hero__gold path', hero);
  gold.setAttribute('pathLength', '1');
  gsap.fromTo(gold, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.6, ease: 'power2.inOut', scrollTrigger: { trigger: hero, start: 'top 65%' } });
  gsap.from([$('.hero__sphere-wrap', hero), $('.hero__pearl-wrap', hero), $('.hero__pearl2-wrap', hero), $('.hero__badge', hero)], { scale: .4, opacity: 0, duration: 1.4, ease: 'expo.out', stagger: .12, scrollTrigger: { trigger: hero, start: 'top 55%' } });
  gsap.to($('.hero__visual', hero), { yPercent: -10, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to($('.hero__copy', hero), { yPercent: 8, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });

  if (c.desk && c.fine) {
    const layers = $$('.depth', hero).map(el => ({ d: +el.dataset.depth, x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3' }) }));
    const onMove = (e) => {
      const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      layers.forEach(l => { l.x(nx * l.d * 26); l.y(ny * l.d * 20); });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    cleanups.push(() => window.removeEventListener('pointermove', onMove));
  }
}

function duoScene(view, c, cleanups) {
  const sec = $('.duo', view);
  sec.classList.add('is-live');
  cleanups.push(() => sec.classList.remove('is-live'));
  const A = $('.duo__img--a', sec), B = $('.duo__img--b', sec);
  gsap.set(B, { clipPath: 'inset(100% 0% 0% 0%)' });
  gsap.set($('.duo__word--b', sec), { yPercent: 105 });
  gsap.set($('.duo__text--b', sec), { autoAlpha: 0, y: 30 });
  gsap.from([$('.duo__word--a', sec)], { yPercent: 105, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: sec, start: 'top 60%' } });
  gsap.from(A, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: sec, start: 'top 60%' } });

  const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: '+=170%', pin: true, scrub: 1, anticipatePin: 1 } });
  tl.to({}, { duration: .15 })
    .addLabel('s')
    .to(A, { yPercent: -16, scale: .9, ease: 'power1.inOut', duration: 1 }, 's')
    .to($('picture', A), { yPercent: 10, duration: 1, ease: 'none' }, 's')
    .to(B, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' }, 's')
    .fromTo($('picture', B), { scale: 1.3 }, { scale: 1, duration: 1, ease: 'none' }, 's')
    .to($('.duo__word--a', sec), { yPercent: -105, duration: .45, ease: 'power2.in' }, 's+=.2')
    .to($('.duo__word--b', sec), { yPercent: 0, duration: .5, ease: 'power2.out' }, 's+=.55')
    .to($('.duo__text--a', sec), { autoAlpha: 0, y: -30, duration: .35 }, 's+=.2')
    .to($('.duo__text--b', sec), { autoAlpha: 1, y: 0, duration: .4 }, 's+=.6')
    .to($$('.duo__n span', sec), { yPercent: -100, duration: .4 }, 's+=.45')
    .to($('.duo__tint', sec), { opacity: .8, duration: 1 }, 's')
    .to({}, { duration: .2 });
}

function servicesScene(view, c) {
  const title = $('.services .display', view);
  if (title) gsap.to(title, { xPercent: c.desk ? 6 : 3, ease: 'none', scrollTrigger: { trigger: title, start: 'top bottom', end: 'bottom top', scrub: true } });
}

function aboutScene(view, c) {
  const sec = $('.about', view); if (!sec) return;
  const pearl = $('.about__pearl', sec);
  gsap.fromTo(pearl, { x: 0, y: 0, rotate: 0 }, { x: () => -innerWidth * (c.desk ? .32 : .3), y: () => innerHeight * .55, rotate: 220, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
}

function promoScene(view, c) {
  const sec = $('.promo', view); if (!sec || !sec.firstElementChild) return;
  const media = $('.promo__media', sec), pic = $('picture', media);
  const wa = $('.promo__w--a', sec), wb = $('.promo__w--b', sec), card = $('.promo__card', sec);
  const strike = $('.strike', sec), nw = $('.price-new', sec), badge = $('.promo__badge', sec);
  const start = c.desk ? 'inset(24% 34% 24% 34% round 28px)' : 'inset(30% 20% 30% 20% round 24px)';
  const end = c.desk ? 'inset(10% 5% 10% 47% round 28px)' : 'inset(9% 5% 47% 5% round 24px)';
  const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: '+=200%', pin: true, scrub: 1, anticipatePin: 1 } });
  tl.fromTo(media, { clipPath: start }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1, ease: 'power2.inOut' }, 0)
    .fromTo(pic, { scale: 1.35 }, { scale: 1.06, duration: 1, ease: 'none' }, 0)
    .fromTo(wa, { xPercent: -70, opacity: 0 }, { xPercent: 6, opacity: 1, duration: 1, ease: 'power2.out' }, .1)
    .fromTo(wb, { xPercent: 70, opacity: 0 }, { xPercent: -6, opacity: 1, duration: 1, ease: 'power2.out' }, .1)
    .to(media, { clipPath: end, duration: 1, ease: 'power2.inOut' }, 1.3)
    .to(pic, { scale: 1, duration: 1, ease: 'none' }, 1.3)
    .to([wa, wb], { opacity: .16, xPercent: 0, duration: .8 }, 1.35)
    .fromTo(card, { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'power3.out' }, 1.75)
    .fromTo(badge, { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: .5 }, 1.9)
    .fromTo(strike, { scaleX: 0 }, { scaleX: 1, duration: .5, ease: 'power2.inOut' }, 2.15)
    .fromTo(nw, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .5 }, 2.25)
    .to({}, { duration: .35 });
}

function hscrollScene(view, c, cleanups) {
  const sec = $('.hscroll', view); if (!sec) return;
  sec.classList.add('is-pinned');
  cleanups.push(() => sec.classList.remove('is-pinned'));
  const track = $('.hscroll__track', sec);
  const panels = $$('.panel', track);
  const cur = $('.hscroll__cur', sec);
  const dist = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
  const tween = gsap.to(track, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: {
      trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: self => { const i = Math.min(panels.length, Math.max(1, Math.round(self.progress * (panels.length - 1)) + 1)); cur.textContent = String(i).padStart(2, '0'); }
    }
  });
  panels.forEach((p, i) => {
    const img = $('img', p);
    gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
    gsap.from(p, { yPercent: i % 2 ? 14 : -10, opacity: .3, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left right', end: 'center center', scrub: true } });
  });
}

function finalScene(view) {
  const sec = $('.final', view); if (!sec) return;
  gsap.from($$('.final__title .line > span', sec), { yPercent: 115, rotate: 3, duration: 1.5, ease: 'expo.out', stagger: .12, scrollTrigger: { trigger: sec, start: 'top 62%' } });
  gsap.from($('.final__ctas', sec), { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', delay: .4, scrollTrigger: { trigger: sec, start: 'top 62%' } });
  $$('.final__lines path', sec).forEach((p, i) => {
    gsap.fromTo(p, { yPercent: i ? 6 : -6 }, { yPercent: i ? -6 : 6, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

const SCENES = {
  inicio(view, c, cleanups) {
    introScene(view, c);
    heroScene(view, c, cleanups);
    duoScene(view, c, cleanups);
    servicesScene(view, c);
    aboutScene(view, c);
    promoScene(view, c);
    hscrollScene(view, c, cleanups);
    finalScene(view);
  }
};

function mount(name) {
  const view = viewEl(name);
  if (!HAS_GSAP || name === 'admin') { if (HAS_GSAP) gsap.set(root, { '--bg': '#F8F5F0', '--ink': INK }); return; }
  root.style.setProperty('--bg', view.querySelector('[data-bg]')?.dataset.bg || '#F8F5F0');
  mm = gsap.matchMedia();
  mm.add({
    desk: '(min-width: 900px)', mob: '(max-width: 899.98px)',
    fine: '(hover: hover) and (pointer: fine)',
    reduce: '(prefers-reduced-motion: reduce)'
  }, (ctx) => {
    const c = ctx.conditions;
    const cleanups = [];
    gsap.set(root, { '--bg': view.querySelector('[data-bg]')?.dataset.bg || '#F8F5F0', '--ink': INK });
    // theme still follows sections with reduced motion (instant)
    if (c.reduce) {
      $$('[data-bg]', view).forEach(sec => ScrollTrigger.create({ trigger: sec, start: 'top 58%', end: 'bottom 58%', onToggle: s => { if (s.isActive) gsap.set(root, { '--bg': sec.dataset.bg, '--ink': sec.dataset.ink || INK }); } }));
      return;
    }
    SCENES[name]?.(view, c, cleanups);
    common(view, c);
    ScrollTrigger.sort();
    return () => cleanups.forEach(fn => fn());
  });
  // footer contrast for the header
  ScrollTrigger.create({ trigger: '.footer', start: 'top 72px', end: 'bottom top', toggleClass: { targets: '#header', className: 'on-dark' }, id: 'footer-dark' });
  firstMount = false;
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

function unmount() {
  if (!HAS_GSAP) return;
  closeServiceFloat();
  ScrollTrigger.getById('footer-dark')?.kill();
  $('#header').classList.remove('on-dark');
  if (mm) { mm.revert(); mm = null; }
  $$('.svc.is-open').forEach(toggleSvc);
}

/* =====================================================================
   7. UI GLOBAL
   ===================================================================== */
function initHeader() {
  const header = $('#header');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('is-solid', y > 40);
    const menuOpen = !$('#menu').hidden;
    if (!menuOpen) header.classList.toggle('is-hidden', y > lastY && y > 160);
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initMenu() {
  const btn = $('#menuBtn'), menu = $('#menu'), label = $('.menu-btn__label', btn);
  let open = false, tl = null;
  const focusables = () => $$('a, button', menu);
  const setOpen = (v) => {
    open = v;
    btn.setAttribute('aria-expanded', String(v));
    label.textContent = v ? 'Fechar' : 'Menu';
    const r = btn.getBoundingClientRect();
    const at = `at ${Math.round(r.left + r.width / 2)}px ${Math.round(r.top + r.height / 2)}px`;
    if (v) {
      menu.hidden = false;
      root.style.overflow = 'hidden';
      $('#header').classList.remove('is-hidden');
      if (HAS_GSAP && !mqReduce.matches) {
        tl?.kill();
        tl = gsap.timeline()
          .fromTo(menu, { clipPath: `circle(0% ${at})` }, { clipPath: `circle(150% ${at})`, duration: .9, ease: 'expo.inOut' })
          .fromTo($$('.menu__word', menu), { yPercent: 110 }, { yPercent: 0, duration: .9, ease: 'expo.out', stagger: .05 }, .35)
          .fromTo($$('.menu__num', menu), { opacity: 0 }, { opacity: 1, duration: .6, stagger: .05 }, .5)
          .fromTo($('.menu__foot', menu), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'expo.out' }, .6);
      }
      setTimeout(() => focusables()[0]?.focus({ preventScroll: true }), 50);
    } else {
      root.style.overflow = '';
      const done = () => { menu.hidden = true; };
      if (HAS_GSAP && !mqReduce.matches) {
        tl?.kill();
        tl = gsap.timeline({ onComplete: done })
          .to($$('.menu__word', menu), { yPercent: -110, duration: .45, ease: 'expo.in', stagger: .03 })
          .to(menu, { clipPath: `circle(0% ${at})`, duration: .7, ease: 'expo.inOut' }, .2);
      } else done();
    }
  };
  btn.addEventListener('click', () => setOpen(!open));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', e => {
    if (!open) return;
    if (e.key === 'Escape') { setOpen(false); btn.focus(); }
    if (e.key === 'Tab') {
      const items = [btn, ...focusables()];
      const i = items.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    }
  });
  addEventListener('resize', () => { if (open && innerWidth >= 1000) setOpen(false); });
}

function initCursor() {
  if (!HAS_GSAP || !mqFine.matches || mqReduce.matches) return;
  const cur = $('#cursor'), label = $('.cursor__label', cur);
  root.classList.add('has-cursor');
  const xTo = gsap.quickTo(cur, 'x', { duration: .2, ease: 'power3' });
  const yTo = gsap.quickTo(cur, 'y', { duration: .2, ease: 'power3' });
  const LBL = { ver: 'Ver', abrir: 'Abrir', contactar: 'Contactar', explorar: 'Explorar' };
  addEventListener('pointermove', e => { xTo(e.clientX); yTo(e.clientY); cur.classList.add('is-visible'); }, { passive: true });
  document.addEventListener('pointerleave', () => cur.classList.remove('is-visible'));
  document.addEventListener('pointerdown', () => cur.classList.add('is-down'));
  document.addEventListener('pointerup', () => cur.classList.remove('is-down'));
  document.addEventListener('pointerover', e => {
    const t = e.target.closest('[data-cursor], a, button, select, label, input, textarea');
    cur.classList.remove('is-hover', 'is-label');
    if (!t) return;
    if (t.matches('input, textarea, select')) { cur.classList.remove('is-visible'); return; }
    cur.classList.add('is-visible');
    const k = t.dataset.cursor;
    if (k && LBL[k]) { label.textContent = LBL[k]; cur.classList.add('is-label'); }
    else cur.classList.add('is-hover');
  });
}

function initMagnetic() {
  if (!HAS_GSAP || !mqFine.matches || mqReduce.matches) return;
  $$('[data-magnetic]').forEach(el => {
    if (el.dataset.mag) return;
    el.dataset.mag = '1';
    const xTo = gsap.quickTo(el, 'x', { duration: .7, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: .7, ease: 'power3' });
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * .28);
      yTo((e.clientY - (r.top + r.height / 2)) * .38);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

/* services: accordion (all sizes) + floating image (desktop hover) */
function toggleSvc(li) {
  const open = !li.classList.contains('is-open');
  li.classList.toggle('is-open', open);
  $('.svc__row', li).setAttribute('aria-expanded', String(open));
  $('.svc__panel', li).inert = !open;
  if (HAS_GSAP) setTimeout(() => ScrollTrigger.refresh(), 800);
}
let floatState = null;
function closeServiceFloat() {
  if (!floatState) return;
  floatState.list?.classList.remove('is-hovering');
  $$('.svc.is-active').forEach(s => s.classList.remove('is-active'));
  gsap.to('#svcFloat', { autoAlpha: 0, scale: .7, duration: .4, ease: 'power3.out' });
  floatState.list = null;
}
function initServices() {
  document.addEventListener('click', e => {
    const row = e.target.closest('.svc__row');
    if (row) toggleSvc(row.closest('.svc'));
  });
  if (!HAS_GSAP) return;
  const fl = $('#svcFloat'), price = $('.svc-float__price', fl);
  gsap.set(fl, { autoAlpha: 0, scale: .7 });
  const xTo = gsap.quickTo(fl, 'x', { duration: .6, ease: 'power3' });
  const yTo = gsap.quickTo(fl, 'y', { duration: .6, ease: 'power3' });
  const rTo = gsap.quickTo(fl, 'rotation', { duration: .8, ease: 'power3' });
  let lastX = 0;
  floatState = { list: null };
  const enabled = () => mqFine.matches && mqDesk.matches && !mqReduce.matches;
  document.addEventListener('pointermove', e => {
    if (!floatState.list) return;
    xTo(e.clientX); yTo(e.clientY);
    rTo(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * .6)); lastX = e.clientX;
  }, { passive: true });
  document.addEventListener('pointerover', e => {
    if (!enabled()) return;
    const li = e.target.closest('.svc');
    const list = li?.closest('.svc-list');
    if (!li) { if (floatState.list && !e.target.closest('.svc-list')) closeServiceFloat(); return; }
    if (li.classList.contains('is-open')) { closeServiceFloat(); return; }
    if (floatState.list !== list) { gsap.set(fl, { x: e.clientX, y: e.clientY }); lastX = e.clientX; }
    floatState.list = list;
    list.classList.add('is-hovering');
    $$('.svc.is-active').forEach(s => s !== li && s.classList.remove('is-active'));
    li.classList.add('is-active');
    const s = services.find(x => x.id === li.dataset.id);
    $$('.svc-float__img', fl).forEach(im => im.classList.toggle('is-on', im.dataset.id === li.dataset.id));
    price.textContent = s ? `${priceText(s)} · ${s.duration}` : '';
    gsap.to(fl, { autoAlpha: 1, scale: 1, duration: .6, ease: 'expo.out' });
  });
  document.addEventListener('pointerout', e => {
    if (!floatState.list) return;
    const to = e.relatedTarget;
    if (!to || !to.closest || !to.closest('.svc-list')) closeServiceFloat();
  });
}

/* gallery: lightbox + filters */
function initGallery() {
  const dlg = $('#lightbox');
  const mediaBox = $('.lightbox__media', dlg), cap = $('.lightbox__cap', dlg);
  let list = gallery, idx = 0;
  const show = (i) => {
    idx = (i + list.length) % list.length;
    const g = list[idx];
    mediaBox.innerHTML = media(g, { ratio: 'portrait', alt: `${g.title}, ${g.category}` });
    cap.innerHTML = `${esc(g.title)}<span>${esc(g.category)} · ${idx + 1} / ${list.length}</span>`;
    if (HAS_GSAP && !mqReduce.matches) gsap.fromTo(mediaBox, { opacity: 0, scale: .96, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .6, ease: 'expo.out', clearProps: 'filter' });
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-lightbox]');
    if (!b) return;
    const visible = $$('.tile:not(.is-hidden) [data-lightbox]', b.closest('.work__grid')).map(x => x.dataset.lightbox);
    list = gallery.filter(g => visible.includes(g.id));
    show(list.findIndex(g => g.id === b.dataset.lightbox));
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  });
  dlg.addEventListener('click', e => {
    const a = e.target.closest('[data-lb]')?.dataset.lb;
    if (a === 'prev') show(idx - 1);
    else if (a === 'next') show(idx + 1);
    else if (a === 'close' || e.target === dlg) dlg.close();
  });
  dlg.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  const fil = $('[data-filters]'), grid = $('[data-gallery]');
  if (!fil || !grid) return;
  fil.addEventListener('click', e => {
    const b = e.target.closest('[data-filter]'); if (!b) return;
    $$('[data-filter]', fil).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    const f = b.dataset.filter;
    let k = 0;
    const shown = [];
    $$('.tile', grid).forEach(t => {
      const on = f === 'Todos' || t.dataset.cat === f;
      t.classList.toggle('is-hidden', !on);
      t.className = t.className.replace(/tile--\d/, '');
      if (on) { t.classList.add('tile--' + ((k++ % 6) + 1)); shown.push(t); }
    });
    if (HAS_GSAP) {
      gsap.set($$('.tile__media', grid), { clearProps: 'clipPath,opacity,scale' });
      gsap.set($$('.tile__media picture', grid), { clearProps: 'all' });
      if (!mqReduce.matches) gsap.fromTo(shown, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'expo.out', stagger: .06 });
      ScrollTrigger.refresh();
    }
  });
}

/* contact: booking form → WhatsApp message, copy buttons */
function initContact() {
  const form = $('#bookingForm');
  if (form) {
    const date = $('#f-date', form);
    date.min = new Date().toISOString().slice(0, 10);
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = $('#f-name', form), err = $('#f-name-err', form);
      if (!name.value.trim()) {
        err.textContent = 'Indique o seu nome para sabermos quem está a marcar.';
        name.setAttribute('aria-invalid', 'true'); name.setAttribute('aria-describedby', 'f-name-err'); name.focus();
        return;
      }
      err.textContent = ''; name.removeAttribute('aria-invalid');
      const fd = new FormData(form);
      let dateTxt = '';
      if (fd.get('date')) { const [y, m, d] = String(fd.get('date')).split('-'); dateTxt = `${d}/${m}/${y}`; }
      const lines = [
        'Olá Cátia! Gostaria de marcar uma sessão.',
        `Nome: ${fd.get('name').trim()}`,
        fd.get('service') ? `Serviço: ${fd.get('service')}` : '',
        dateTxt || fd.get('time') ? `Preferência: ${[dateTxt, fd.get('time')].filter(Boolean).join(', ')}` : '',
        fd.get('notes') ? `Notas: ${String(fd.get('notes')).trim()}` : ''
      ].filter(Boolean);
      const url = waUrl(lines.join('\n'));
      const res = $('#bookingResult'), link = $('#bookingLink');
      link.href = url;
      res.hidden = false;
      if (HAS_GSAP && !mqReduce.matches) gsap.from(res, { y: 16, opacity: 0, duration: .7, ease: 'expo.out' });
      link.focus();
    });
  }
  document.addEventListener('click', async e => {
    const b = e.target.closest('[data-copy]'); if (!b) return;
    const txt = b.dataset.copy;
    try { await navigator.clipboard.writeText(txt); b.textContent = 'Copiado'; }
    catch {
      const span = b.previousElementSibling;
      const r = document.createRange(); r.selectNodeContents(span);
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
      b.textContent = 'Selecionado';
    }
    setTimeout(() => { b.textContent = 'Copiar'; }, 1800);
  });
}

/* sticky mobile CTA */
function initMobileBar() {
  const bar = $('#mbar');
  const blockers = new Set();
  const update = () => {
    const pastIntro = scrollY > innerHeight * .8 || current !== 'inicio';
    bar.classList.toggle('is-visible', current !== 'admin' && pastIntro && blockers.size === 0 && $('#menu').hidden);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) blockers.add(en.target); else blockers.delete(en.target); });
    update();
  }, { rootMargin: '0px 0px -10% 0px' });
  $$('[data-hide-bar]').forEach(el => io.observe(el));
  addEventListener('scroll', update, { passive: true });
  addEventListener('hashchange', () => setTimeout(update, 900));
  update();
}

/* =====================================================================
   9. ÁREA RESERVADA (ADMINISTRAÇÃO)
   - Acesso: #admin  ·  palavra-passe guardada apenas como hash SHA-256.
   - Nota de segurança: num site estático qualquer pessoa pode ler o código,
     por isso a palavra-passe protege a interface, não os dados. Quem pode
     realmente alterar o site é quem tem o token do GitHub, guardado só no
     dispositivo da administradora.
   - As alterações ficam num rascunho local (IndexedDB) e só chegam às
     clientes quando se carrega em "Publicar" (commit de content.json e das
     fotografias novas no repositório do GitHub Pages).
   ===================================================================== */
const Admin = (() => {
  const PASS_HASH = 'f221fcd0532395082e89e2dfed40116e54eea819de3f390570f66710db0df170';
  const GH_KEY = 'bs-github';
  const PANELS = [
    ['resumo', 'Resumo'], ['geral', 'Contactos e horário'], ['servicos', 'Serviços e preços'],
    ['trabalhos', 'Trabalhos'], ['colecoes', 'Coleções'], ['promocao', 'Promoção'],
    ['textos', 'Textos'], ['imagens', 'Imagens do site'], ['publicar', 'Publicar']
  ];
  const ROOTS = { services: 'Serviços', gallery: 'Trabalhos', collections: 'Coleções', promotions: 'Promoção', studio: 'Contactos e textos', pages: 'Imagens do site' };
  const PAGE_LABEL = { intro: 'Abertura', hero: 'Destaque', duoA: 'Clássico', duoB: 'Moderno', about: 'Sobre' };
  const LIST_LABEL = { services: 'serviço', gallery: 'trabalho', collections: 'coleção', 'studio.hours': 'linha de horário', 'studio.notes': 'ponto “Bom saber”', 'studio.principles': 'princípio' };
  const sampleArt = (polish, finish = 'solid', shape = 'almond') => ({ kind: 'nails', shape, finish, polish, bg: ['#F3E6E1', '#D2B1A8'], length: 'medium' });
  const newId = (p) => p + '-' + Date.now().toString(36);
  const NEW = {
    services: () => ({ id: newId('svc'), name: 'Novo serviço', category: categoryOrder[0] || 'Manicure', featured: false, description: '', price: 0, from: false, priceNote: '', duration: '45 min', image: '', alt: '', art: sampleArt('#D9A3A0') }),
    gallery: () => ({ id: newId('g'), title: 'Novo trabalho', category: 'Nail Art', featured: false, arch: false, image: '', alt: '', art: sampleArt('#E2B7B0', 'art') }),
    collections: () => ({ id: newId('c'), title: 'Nova coleção', line: '', image: '', art: sampleArt('#EBCBC1', 'line', 'oval') }),
    'studio.hours': () => ['Dia', '10h00 – 19h00'],
    'studio.notes': () => ({ title: 'Novo ponto', text: '' }),
    'studio.principles': () => ({ title: 'Novo', em: '', text: '' })
  };

  let draft = null;      // { content, base, savedAt, publishedAt, changed, log }
  let panel = 'resumo';
  let openPath = null;
  let saveTimer = null, toastTimer = null, publishing = false;
  let fails = 0, lockUntil = 0;
  let el = null;
  const LISTS = {};

  /* ---------- helpers ---------- */
  const C = () => draft.content;
  const getPath = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  const setPath = (o, p, v) => {
    const ks = p.split('.'), last = ks.pop();
    const t = ks.reduce((a, k) => { if (a[k] == null) a[k] = {}; return a[k]; }, o);
    t[last] = v;
  };
  const fid = p => 'ad-' + p.replace(/[^a-z0-9]+/gi, '-');
  const fmtDate = t => new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(t);
  const ago = t => {
    const m = Math.round((Date.now() - t) / 60000);
    if (m < 1) return 'agora mesmo';
    if (m < 60) return `há ${m} min`;
    const h = Math.round(m / 60);
    return h < 24 ? `há ${h} h` : fmtDate(t);
  };
  const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'imagem';
  const imgSrc = (it, ratio = 'square') => {
    const v = it.image && typeof it.image === 'object' ? (it.image.desktop || it.image.mobile) : it.image;
    return v ? (LocalImg.get(v) || v) : Art.uri(it.art, ratio);
  };
  const ghMemory = {};
  const ghGet = () => { try { return JSON.parse(localStorage.getItem(GH_KEY)) || { ...ghMemory }; } catch { return { ...ghMemory }; } };
  const ghSet = v => { Object.assign(ghMemory, v); try { localStorage.setItem(GH_KEY, JSON.stringify(v)); } catch { /* só em memória */ } };
  const ghReady = () => { const g = ghGet(); return !!(g.owner && g.repo && g.token); };

  function labelFor(path) {
    const ks = path.split('.');
    const root = ROOTS[ks[0]] || ks[0];
    if (['services', 'gallery', 'collections'].includes(ks[0]) && ks[1] != null) {
      const it = C()[ks[0]][+ks[1]];
      return `${root} › ${it ? (it.name || it.title) : ''}`;
    }
    if (ks[0] === 'studio' && ks[1] === 'images') return `Imagens do site › ${C().studio.images[+ks[2]]?.caption || ''}`;
    if (ks[0] === 'pages') return `Imagens do site › ${PAGE_LABEL[ks[1]] || ks[1]}`;
    if (ks[0] === 'studio' && ['aboutLead', 'aboutShort', 'aboutStory', 'quote', 'studioShort', 'principles', 'notes'].includes(ks[1])) return 'Textos';
    return root;
  }

  function collectUploads(obj, path = [], out = []) {
    if (typeof obj === 'string') {
      if (/^data:image\/(png|jpe?g|webp|gif|avif);base64,/.test(obj)) out.push(path.join('.'));
    } else if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(k => { if (k !== 'art') collectUploads(obj[k], [...path, k], out); });
    }
    return out;
  }

  /* ---------- persistence ---------- */
  function log(msg) {
    const now = Date.now(), last = draft.log[0];
    if (last && last.msg === msg && now - last.t < 120000) last.t = now;
    else draft.log.unshift({ t: now, msg });
    draft.log = draft.log.slice(0, 40);
  }
  function touch(msg) {
    draft.changed = true;
    usingDraft = true;
    siteDirty = true;
    applyData(C());
    if (msg) log(msg);
    status('A guardar…');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persist, 500);
  }
  async function persist() {
    draft.savedAt = Date.now();
    await idb.set('draft', draft);
    status();
  }
  async function loadDraft() {
    const imgs = await idb.get('localImages');
    if (imgs) Object.entries(imgs).forEach(([k, v]) => LocalImg.set(k, v));
    const d = await idb.get('draft');
    if (d && d.content) {
      draft = d;
      draft.content = normalize(d.content);
      draft.log = draft.log || [];
    } else {
      draft = { content: normalize(structuredClone(currentData())), base: publishedStamp, savedAt: null, publishedAt: null, changed: false, log: [] };
    }
    applyData(C());
    usingDraft = true;
    siteDirty = true;
  }

  /* ---------- UI shell ---------- */
  function status(text) {
    const s = $('#adStatus');
    if (!s || !draft) return;
    if (text) { s.textContent = text; s.dataset.state = 'saving'; return; }
    s.textContent = draft.changed ? 'Alterações por publicar' : 'Tudo publicado';
    s.dataset.state = draft.changed ? 'draft' : 'ok';
  }
  function toast(msg, type = '') {
    const t = $('#adToast');
    t.textContent = msg;
    t.className = 'ad-toast is-on' + (type ? ' is-' + type : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.className = 'ad-toast'; }, 4200);
  }

  function init() {
    el = viewEl('admin');
    el.innerHTML = `
    <section class="ad-login" id="adLogin" aria-labelledby="ad-login-title">
      <form class="ad-login__card" id="adLoginForm" novalidate>
        <span class="ad-login__mono" aria-hidden="true">CG</span>
        <div>
          <p class="eyebrow">Beauty Studio</p>
          <h1 class="ad-login__title" id="ad-login-title">Área reservada</h1>
        </div>
        <p class="ad-login__lead">Introduza a palavra-passe para editar textos, preços e fotografias do site.</p>
        <div class="ad-field">
          <label for="adPass">Palavra-passe</label>
          <div class="ad-pass">
            <input id="adPass" type="password" autocomplete="current-password" aria-describedby="adPassErr">
            <button type="button" class="ad-pass__toggle" aria-pressed="false" aria-controls="adPass">Mostrar</button>
          </div>
          <p class="ad-error" id="adPassErr" role="alert"></p>
        </div>
        <button class="btn btn--dark btn--block" type="submit">Entrar</button>
        <a class="ad-login__back" href="#inicio">← Voltar ao site</a>
      </form>
    </section>
    <div class="ad-app" id="adApp" hidden>
      <header class="ad-top">
        <a class="ad-top__brand" href="#inicio" aria-label="Ver o site"><span class="ad-top__mono">CG</span><span class="ad-top__name"><strong>Painel</strong><em>Beauty Studio</em></span></a>
        <span class="ad-status" id="adStatus" role="status"></span>
        <div class="ad-top__actions">
          <a class="ad-btn ad-btn--ghost ad-btn--sm" href="#inicio">Ver site</a>
          <button class="ad-btn ad-btn--primary ad-btn--sm" type="button" data-act="publish">Publicar</button>
          <button class="ad-btn ad-btn--text ad-btn--sm" type="button" data-act="logout">Sair</button>
        </div>
      </header>
      <nav class="ad-nav" aria-label="Secções do painel"><ul>
        ${PANELS.map(([k, l]) => `<li><button type="button" data-panel="${k}">${l}</button></li>`).join('')}
      </ul></nav>
      <div class="ad-main" id="adMain" tabindex="-1"></div>
    </div>
    <div class="ad-toast" id="adToast" role="status" aria-live="polite"></div>`;

    $('#adLoginForm').addEventListener('submit', login);
    $('.ad-pass__toggle', el).addEventListener('click', e => {
      const inp = $('#adPass'), show = inp.type === 'password';
      inp.type = show ? 'text' : 'password';
      e.currentTarget.textContent = show ? 'Esconder' : 'Mostrar';
      e.currentTarget.setAttribute('aria-pressed', String(show));
    });
    el.addEventListener('input', onInput);
    el.addEventListener('change', onChange);
    el.addEventListener('click', onClick);
  }

  async function enter() {
    if (!Session.get()) return showLogin();
    if (!draft) await loadDraft();
    showApp();
  }
  function showLogin() {
    $('#adLogin').hidden = false;
    $('#adApp').hidden = true;
    setTimeout(() => $('#adPass')?.focus(), 80);
  }
  function showApp() {
    $('#adLogin').hidden = true;
    $('#adApp').hidden = false;
    renderPanel(panel);
    status();
  }

  async function sha(t) {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
    return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
  }
  async function login(e) {
    e.preventDefault();
    const inp = $('#adPass'), err = $('#adPassErr');
    if (Date.now() < lockUntil) { err.textContent = `Demasiadas tentativas. Tente novamente dentro de ${Math.ceil((lockUntil - Date.now()) / 1000)} segundos.`; return; }
    if (!window.crypto || !crypto.subtle) { err.textContent = 'Abra o site através de um endereço https:// para iniciar sessão.'; return; }
    if (!inp.value) { err.textContent = 'Escreva a palavra-passe.'; inp.focus(); return; }
    if ((await sha(inp.value)) !== PASS_HASH) {
      fails++;
      if (fails >= 5) { lockUntil = Date.now() + 30000; fails = 0; }
      err.textContent = 'Palavra-passe incorreta.';
      inp.setAttribute('aria-invalid', 'true');
      inp.select();
      return;
    }
    err.textContent = '';
    inp.value = '';
    inp.removeAttribute('aria-invalid');
    Session.set(true);
    await loadDraft();
    log('Sessão iniciada');
    persist();
    showApp();
    $('#adMain').focus({ preventScroll: true });
  }
  function logout() {
    Session.set(false);
    usingDraft = false;
    location.hash = 'inicio';
    location.reload();
  }

  /* ---------- field builders ---------- */
  const head = (title, lead) => `<header class="ad-head"><h1 class="ad-head__title">${title}</h1>${lead ? `<p class="ad-head__lead">${lead}</p>` : ''}</header>`;
  const card = (title, body, { grid = true, hint = '' } = {}) => `<section class="ad-card">${title ? `<h2 class="ad-card__title">${title}</h2>` : ''}${hint ? `<p class="ad-hint">${hint}</p>` : ''}${grid ? `<div class="ad-grid">${body}</div>` : body}</section>`;

  function fText(label, path, o = {}) {
    const v = getPath(C(), path) ?? '';
    const num = o.type === 'number';
    const input = `<input id="${fid(path)}" type="${o.type === 'email' ? 'email' : 'text'}"${num ? ' inputmode="decimal" data-type="number"' : ''} value="${esc(v)}" data-path="${path}"${o.list ? ` list="${o.list}"` : ''}${o.ph ? ` placeholder="${esc(o.ph)}"` : ''}${o.hint ? ` aria-describedby="${fid(path)}-h"` : ''}>`;
    return `<div class="ad-field${o.wide ? ' ad-field--wide' : ''}"><label for="${fid(path)}">${label}</label>${o.prefix ? `<div class="ad-affix"><span aria-hidden="true">${o.prefix}</span>${input}</div>` : input}${o.hint ? `<p class="ad-hint" id="${fid(path)}-h">${o.hint}</p>` : ''}</div>`;
  }
  function fArea(label, path, o = {}) {
    let v = getPath(C(), path);
    if (o.type === 'paras') v = (v || []).join('\n\n');
    return `<div class="ad-field ad-field--wide"><label for="${fid(path)}">${label}</label><textarea id="${fid(path)}" rows="${o.rows || 3}" data-path="${path}"${o.type ? ` data-type="${o.type}"` : ''}${o.hint ? ` aria-describedby="${fid(path)}-h"` : ''}>${esc(v ?? '')}</textarea>${o.hint ? `<p class="ad-hint" id="${fid(path)}-h">${o.hint}</p>` : ''}</div>`;
  }
  function fCheck(label, path, o = {}) {
    const v = !!getPath(C(), path);
    return `<div class="ad-field ad-field--check${o.wide ? ' ad-field--wide' : ''}"><label class="ad-switch"><input type="checkbox" class="sr" data-type="bool" data-path="${path}"${v ? ' checked' : ''}><span class="ad-switch__track" aria-hidden="true"></span><span>${label}</span></label>${o.hint ? `<p class="ad-hint">${o.hint}</p>` : ''}</div>`;
  }
  function fImage(label, path, artPath, o = {}) {
    const v = getPath(C(), path) || '';
    const art = getPath(C(), artPath);
    const ratio = o.ratio || 'portrait';
    const src = v ? (LocalImg.get(v) || v) : Art.uri(art, ratio);
    const state = v ? (v.startsWith('data:') ? 'Fotografia nova · por publicar' : 'Fotografia publicada') : 'A usar a ilustração do site';
    return `<div class="ad-field ad-field--wide"><span class="ad-label">${label}</span>
      <div class="ad-img" data-img="${path}" data-label="${esc(label)}" data-art="${artPath}" data-ratio="${ratio}" data-hint="${esc(o.hint || '')}">
        <div class="ad-img__preview${ratio === 'landscape' ? ' is-wide' : ''}"><img src="${src}" alt=""></div>
        <div class="ad-img__body">
          <p class="ad-img__state${v.startsWith('data:') ? ' is-new' : ''}">${state}</p>
          <div class="ad-img__actions">
            <label class="ad-btn ad-btn--ghost ad-btn--sm">${v ? 'Substituir' : 'Carregar fotografia'}<input type="file" accept="image/*" class="sr" data-upload="${path}"></label>
            ${v ? `<button type="button" class="ad-btn ad-btn--text ad-btn--sm" data-act="img-clear" data-path="${path}">Remover</button>` : ''}
          </div>
          ${o.hint ? `<p class="ad-hint">${o.hint}</p>` : ''}
        </div>
      </div></div>`;
  }
  function refreshImageField(field) {
    const box = $('[data-img]', field);
    if (!box) return;
    field.outerHTML = fImage(box.dataset.label, box.dataset.img, box.dataset.art, { ratio: box.dataset.ratio, hint: box.dataset.hint });
  }

  function list(lp, renderItem, o = {}) {
    LISTS[lp] = o;
    const items = getPath(C(), lp) || [];
    const titleOf = o.titleOf || ((it, i) => it.name || it.title || `Item ${i + 1}`);
    const html = items.map((it, i) => {
      const p = `${lp}.${i}`;
      const thumb = o.thumb ? `<img class="ad-item__thumb" src="${o.thumb(it)}" alt="">` : '';
      const meta = o.metaOf ? o.metaOf(it) : '';
      const tools = o.fixed ? '' : `<div class="ad-item__tools">
          <button type="button" class="ad-btn ad-btn--ghost ad-btn--sm" data-act="up" data-list="${lp}" data-i="${i}"${i === 0 ? ' disabled' : ''}>↑ Subir</button>
          <button type="button" class="ad-btn ad-btn--ghost ad-btn--sm" data-act="down" data-list="${lp}" data-i="${i}"${i === items.length - 1 ? ' disabled' : ''}>↓ Descer</button>
          <button type="button" class="ad-btn ad-btn--ghost ad-btn--sm" data-act="dup" data-list="${lp}" data-i="${i}">Duplicar</button>
          <button type="button" class="ad-btn ad-btn--danger ad-btn--sm" data-act="del" data-list="${lp}" data-i="${i}">Eliminar</button>
        </div>`;
      return `<details class="ad-item" data-list="${lp}" data-i="${i}" data-item="${p}"${openPath === p ? ' open' : ''}>
        <summary>${thumb}<span class="ad-item__text"><span class="ad-item__title">${esc(titleOf(it, i))}</span>${o.metaOf ? `<span class="ad-item__meta">${esc(meta)}</span>` : ''}</span><span class="ad-item__chev" aria-hidden="true"></span></summary>
        <div class="ad-item__body"><div class="ad-grid">${renderItem(p, it, i)}</div>${tools}</div>
      </details>`;
    }).join('');
    const add = o.fixed ? '' : `<button type="button" class="ad-btn ad-btn--add" data-act="add" data-list="${lp}">+ ${o.addLabel || 'Adicionar'}</button>`;
    return `<div class="ad-list">${html || '<p class="ad-hint">Ainda não há nada aqui.</p>'}</div>${add}`;
  }
  function refreshSummary(node) {
    const d = node.closest && node.closest('details.ad-item');
    if (!d) return;
    const lp = d.dataset.list, o = LISTS[lp] || {};
    const it = getPath(C(), lp)[+d.dataset.i];
    if (!it) return;
    const titleOf = o.titleOf || ((x, i) => x.name || x.title || `Item ${i + 1}`);
    $('.ad-item__title', d).textContent = titleOf(it, +d.dataset.i);
    const m = $('.ad-item__meta', d);
    if (m && o.metaOf) m.textContent = o.metaOf(it);
    const th = $('.ad-item__thumb', d);
    if (th && o.thumb) th.src = o.thumb(it);
  }

  /* ---------- panels ---------- */
  const priceMeta = s => `${s.from ? 'desde ' : ''}€${s.price} · ${s.duration}${s.featured ? ' · página inicial' : ''}`;

  const PANEL_HTML = {
    resumo() {
      const c = C();
      const h = new Date().getHours();
      const greet = h < 13 ? 'Bom dia' : h < 20 ? 'Boa tarde' : 'Boa noite';
      const promo = c.promotions[0];
      const stale = publishedStamp && draft.base !== publishedStamp && draft.changed;
      return head(`${greet}, Cátia.`, 'Aqui edita textos, preços e fotografias. As alterações ficam guardadas neste dispositivo e só aparecem às clientes depois de carregar em “Publicar”.')
        + (stale ? `<div class="ad-alert"><p>Existe uma versão publicada mais recente do que este rascunho, feita noutro dispositivo.</p><button type="button" class="ad-btn ad-btn--ghost ad-btn--sm" data-act="discard">Carregar a versão publicada</button></div>` : '')
        + `<div class="ad-stats">
            <div class="ad-stat"><span class="ad-stat__label">Estado</span><span class="ad-stat__value">${draft.changed ? 'Por publicar' : 'Publicado'}</span><span class="ad-stat__meta">${draft.savedAt ? 'Guardado ' + ago(draft.savedAt) : 'Sem alterações'}</span></div>
            <div class="ad-stat"><span class="ad-stat__label">Última publicação</span><span class="ad-stat__value">${draft.publishedAt ? fmtDate(draft.publishedAt) : '—'}</span><span class="ad-stat__meta">${collectUploads(c).length} fotografias novas por enviar</span></div>
            <div class="ad-stat"><span class="ad-stat__label">No site</span><span class="ad-stat__value">${c.services.length} serviços</span><span class="ad-stat__meta">${c.gallery.length} trabalhos · promoção ${promo && promo.active ? 'ativa' : 'desligada'}</span></div>
          </div>`
        + card('Atalhos', `<div class="ad-quick">${[['servicos', 'Alterar preços'], ['trabalhos', 'Adicionar fotografias de trabalhos'], ['promocao', 'Editar a promoção'], ['geral', 'Mudar horário ou contactos'], ['publicar', 'Publicar alterações']].map(([k, l]) => `<button type="button" class="ad-btn ad-btn--ghost" data-go="${k}">${l}</button>`).join('')}</div>`, { grid: false })
        + card('Histórico', draft.log.length ? `<ol class="ad-log">${draft.log.map(l => `<li><time datetime="${new Date(l.t).toISOString()}">${fmtDate(l.t)}</time><span>${esc(l.msg)}</span></li>`).join('')}</ol>` : '<p class="ad-hint">Ainda sem atividade.</p>', { grid: false });
    },

    geral() {
      return head('Contactos e horário', 'Estes dados aparecem no rodapé, na página de contacto e em todos os botões de marcação.')
        + card('Contactos',
          fText('Número de WhatsApp', 'studio.whatsapp', { hint: 'Só algarismos, com o indicativo do país. Ex.: 351912345678' })
          + fText('Telefone (como aparece no site)', 'studio.phone', { ph: '+351 912 345 678' })
          + fText('Email', 'studio.email', { type: 'email' })
          + fText('Instagram', 'studio.instagram.handle', { ph: '@beautystudio' })
          + fText('Morada', 'studio.address', { wide: true })
          + fText('Link do Instagram', 'studio.instagram.url', { wide: true, ph: 'https://www.instagram.com/…' }))
        + card('Horário',
          list('studio.hours', p => fText('Dia(s)', `${p}.0`) + fText('Horas', `${p}.1`, { ph: '10h00 – 19h00 ou Encerrado' }), { titleOf: h => h[0], metaOf: h => h[1], addLabel: 'Adicionar linha' })
          + `<div class="ad-grid">${fText('Resumo do horário (menu do telemóvel)', 'studio.hoursShort', { wide: true })}</div>`, { grid: false })
        + card('Mensagem de marcação', fArea('Texto que abre no WhatsApp', 'studio.bookingMessage', { rows: 2, hint: 'É a mensagem pré-escrita quando uma cliente carrega em “Marcar sessão”.' }));
    },

    servicos() {
      const cats = [...new Set([...categoryOrder, ...C().services.map(s => s.category)])];
      return head('Serviços e preços', 'A ordem aqui é a ordem no site. Os serviços marcados para a página inicial aparecem na lista grande do início; os primeiros seis aparecem no preçário.')
        + `<datalist id="ad-cats">${cats.map(c => `<option value="${esc(c)}">`).join('')}</datalist>`
        + list('services', p =>
          fText('Nome', `${p}.name`)
          + fText('Categoria', `${p}.category`, { list: 'ad-cats', hint: 'Escolha uma existente ou escreva uma nova.' })
          + fText('Preço', `${p}.price`, { type: 'number', prefix: '€' })
          + fText('Duração', `${p}.duration`, { ph: '60 min' })
          + fCheck('Mostrar “desde” antes do preço', `${p}.from`)
          + fText('Nota do preço', `${p}.priceNote`, { ph: 'por unha' })
          + fCheck('Mostrar na página inicial', `${p}.featured`, { wide: true })
          + fArea('Descrição', `${p}.description`)
          + fImage('Fotografia', `${p}.image`, `${p}.art`)
          + fText('Descrição da fotografia', `${p}.alt`, { wide: true, hint: 'Uma frase curta sobre o que a fotografia mostra. Ajuda quem usa leitores de ecrã e o Google.' }),
          { metaOf: priceMeta, thumb: it => imgSrc(it), addLabel: 'Adicionar serviço' });
    },

    trabalhos() {
      const cats = [...new Set(C().gallery.map(g => g.category))];
      return head('Trabalhos', 'A galeria completa aparece na página Trabalhos. Os que estiverem em destaque aparecem também na página inicial (ficam melhor em grupos de seis).')
        + `<datalist id="ad-gcats">${cats.map(c => `<option value="${esc(c)}">`).join('')}</datalist>`
        + list('gallery', p =>
          fText('Título', `${p}.title`)
          + fText('Categoria', `${p}.category`, { list: 'ad-gcats', hint: 'Usada nos filtros da galeria.' })
          + fCheck('Destaque na página inicial', `${p}.featured`)
          + fCheck('Moldura em arco', `${p}.arch`)
          + fImage('Fotografia', `${p}.image`, `${p}.art`)
          + fText('Descrição da fotografia', `${p}.alt`, { wide: true }),
          { metaOf: g => `${g.category}${g.featured ? ' · destaque' : ''}`, thumb: it => imgSrc(it), addLabel: 'Adicionar trabalho' });
    },

    colecoes() {
      return head('Coleções', 'A galeria que desliza na horizontal na página inicial.')
        + list('collections', p =>
          fText('Nome', `${p}.title`)
          + fText('Frase curta', `${p}.line`)
          + fImage('Fotografia', `${p}.image`, `${p}.art`, { hint: 'Fotografias verticais funcionam melhor.' }),
          { metaOf: c => c.line, thumb: it => imgSrc(it), addLabel: 'Adicionar coleção' });
    },

    promocao() {
      if (!C().promotions.length) C().promotions.push({ id: newId('promo'), active: false, eyebrow: 'Edição limitada', wordA: 'Exclusivo', wordB: 'Momento', title: 'Nova promoção', titleEm: '', description: '', priceOld: 0, priceNew: 0, note: '', message: '', alt: '', image: { desktop: '', mobile: '' }, art: structuredClone(DEFAULTS.promotions[0].art) });
      const p = 'promotions.0';
      return head('Promoção', 'A secção escura da página inicial. Pode desligá-la quando não houver campanha.')
        + card('', fCheck('Promoção visível no site', `${p}.active`, { wide: true }))
        + card('Textos',
          fText('Etiqueta', `${p}.eyebrow`, { ph: 'Edição limitada · Outono' })
          + fText('Validade / nota', `${p}.note`, { ph: 'Válido até 30 de novembro' })
          + fText('Palavra grande 1', `${p}.wordA`)
          + fText('Palavra grande 2 (itálico)', `${p}.wordB`)
          + fText('Título', `${p}.title`)
          + fText('Título · parte em itálico', `${p}.titleEm`)
          + fArea('Descrição', `${p}.description`, { rows: 2 })
          + fArea('Mensagem do WhatsApp ao marcar', `${p}.message`, { rows: 2 }))
        + card('Preços',
          fText('Preço habitual (riscado)', `${p}.priceOld`, { type: 'number', prefix: '€' })
          + fText('Preço da promoção', `${p}.priceNew`, { type: 'number', prefix: '€' }))
        + card('Fotografia',
          fImage('Computador (horizontal)', `${p}.image.desktop`, `${p}.art`, { ratio: 'landscape' })
          + fImage('Telemóvel (vertical, opcional)', `${p}.image.mobile`, `${p}.art`, { ratio: 'tall' })
          + fText('Descrição da fotografia', `${p}.alt`, { wide: true }));
    },

    textos() {
      return head('Textos', 'Os textos mais pessoais do site. Escreva como fala com as clientes.')
        + card('Sobre a Cátia',
          fText('Frase de apresentação (página Sobre)', 'studio.aboutLead', { wide: true })
          + fArea('Texto curto (página inicial)', 'studio.aboutShort', { rows: 3 })
          + fArea('História (página Sobre)', 'studio.aboutStory', { rows: 7, type: 'paras', hint: 'Separe os parágrafos com uma linha em branco.' })
          + fArea('Citação', 'studio.quote', { rows: 2 }))
        + card('Studio', fArea('Descrição do espaço', 'studio.studioShort', { rows: 3 }))
        + card('Filosofia', list('studio.principles', p =>
          fText('Palavra', `${p}.title`) + fText('Complemento em itálico', `${p}.em`) + fArea('Texto', `${p}.text`, { rows: 2 }),
          { titleOf: x => `${x.title} ${x.em}`.trim(), addLabel: 'Adicionar princípio' }), { grid: false })
        + card('Bom saber (página Serviços)', list('studio.notes', p =>
          fText('Título', `${p}.title`, { wide: true }) + fArea('Texto', `${p}.text`, { rows: 2 }),
          { addLabel: 'Adicionar ponto' }), { grid: false });
    },

    imagens() {
      const pg = (k, label, desk = 'portrait', mob) => card(label,
        fImage(mob ? 'Computador' : 'Fotografia', `pages.${k}.image.desktop`, `pages.${k}.art`, { ratio: desk })
        + (mob ? fImage('Telemóvel (opcional)', `pages.${k}.image.mobile`, `pages.${k}.art`, { ratio: mob, hint: 'Uma versão vertical da mesma fotografia, para ecrãs pequenos.' }) : '')
        + fText('Descrição da fotografia', `pages.${k}.alt`, { wide: true }));
      return head('Imagens do site', 'Fotografias fixas das secções. Sem fotografia, o site usa as ilustrações originais.')
        + pg('intro', 'Abertura (ecrã inteiro)', 'landscape', 'tall')
        + pg('hero', 'Destaque · “A beleza está nos detalhes”')
        + pg('duoA', 'Clássico')
        + pg('duoB', 'Moderno')
        + pg('about', 'Sobre a Cátia')
        + card('Studio (cinco fotografias)', list('studio.images', p =>
          fText('Legenda', `${p}.caption`) + fText('Descrição da fotografia', `${p}.alt`) + fImage('Fotografia', `${p}.image`, `${p}.art`),
          { titleOf: x => x.caption, thumb: it => imgSrc(it), fixed: true }), { grid: false });
    },

    publicar() {
      const g = ghGet();
      const pending = collectUploads(C()).length;
      const gf = (label, key, o = {}) => `<div class="ad-field${o.wide ? ' ad-field--wide' : ''}"><label for="gh-${key}">${label}</label>${o.secret ? `<div class="ad-pass"><input id="gh-${key}" type="password" autocomplete="off" spellcheck="false" data-gh="${key}" value="${esc(g[key] || '')}"><button type="button" class="ad-pass__toggle" data-act="reveal" aria-controls="gh-${key}" aria-pressed="false">Mostrar</button></div>` : `<input id="gh-${key}" type="text" spellcheck="false" autocapitalize="off" data-gh="${key}" value="${esc(g[key] || (key === 'branch' ? 'main' : ''))}"${o.ph ? ` placeholder="${o.ph}"` : ''}>`}${o.hint ? `<p class="ad-hint">${o.hint}</p>` : ''}</div>`;
      return head('Publicar', 'Publicar envia os textos, os preços e as fotografias novas para o site. As clientes veem as alterações cerca de um a dois minutos depois.')
        + `<section class="ad-card ad-publish">
            <div class="ad-publish__state">
              <span class="ad-publish__dot${draft.changed ? ' is-draft' : ''}" aria-hidden="true"></span>
              <div><p class="ad-publish__title">${draft.changed ? 'Tem alterações por publicar' : 'Não há alterações por publicar'}</p>
              <p class="ad-hint">${pending ? `${pending} fotografia${pending > 1 ? 's' : ''} nova${pending > 1 ? 's' : ''} para enviar.` : 'Nenhuma fotografia nova.'}${draft.publishedAt ? ` Última publicação: ${fmtDate(draft.publishedAt)}.` : ''}</p></div>
            </div>
            <button type="button" class="ad-btn ad-btn--primary ad-btn--lg" data-act="publish" id="adPublishBtn"${ghReady() ? '' : ' disabled'}>Publicar agora</button>
            <p class="ad-hint" id="adGhHint"${ghReady() ? ' hidden' : ''}>Preencha primeiro a ligação ao GitHub, mais abaixo.</p>
            <ol class="ad-steps" id="adSteps" hidden></ol>
          </section>`
        + card('Ligação ao GitHub',
          gf('Utilizador ou organização', 'owner', { ph: 'ex.: catiagoncalves' })
          + gf('Repositório', 'repo', { ph: 'ex.: beauty-studio' })
          + gf('Branch', 'branch', { hint: 'Normalmente “main”.' })
          + gf('Pasta do site', 'folder', { ph: 'vazio = raiz do repositório', hint: 'Só se o index.html estiver dentro de uma pasta.' })
          + gf('Token de acesso', 'token', { wide: true, secret: true, hint: 'Crie em GitHub › Settings › Developer settings › Fine-grained tokens, com acesso apenas a este repositório e a permissão “Contents: Read and write”. Fica guardado só neste dispositivo.' })
          + `<div class="ad-field ad-field--wide ad-row"><button type="button" class="ad-btn ad-btn--ghost" data-act="gh-test">Testar ligação</button><span class="ad-hint" id="adGhResult" role="status"></span></div>`)
        + card('Cópia de segurança',
          `<div class="ad-field ad-field--wide ad-row">
            <button type="button" class="ad-btn ad-btn--ghost" data-act="export">Descarregar content.json</button>
            <label class="ad-btn ad-btn--ghost">Importar content.json<input type="file" accept="application/json,.json" class="sr" data-import></label>
            <button type="button" class="ad-btn ad-btn--danger" data-act="discard">Descartar rascunho</button>
          </div>
          <p class="ad-hint ad-field--wide">Sem GitHub também pode publicar à mão: descarregue o content.json e coloque-o na pasta do site, ao lado do index.html. “Descartar rascunho” apaga as alterações não publicadas e volta à versão que está online.</p>`);
    }
  };

  function renderPanel(name, { keepScroll = false } = {}) {
    panel = name;
    const y = scrollY;
    $$('.ad-nav [data-panel]', el).forEach(b => {
      if (b.dataset.panel === name) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    $('#adMain').innerHTML = PANEL_HTML[name]();
    if (keepScroll) window.scrollTo(0, y); else window.scrollTo(0, 0);
    $('.ad-nav [aria-current]', el)?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }

  /* ---------- events ---------- */
  function readVal(t) {
    const ty = t.dataset.type;
    if (ty === 'bool') return t.checked;
    if (ty === 'number') { const n = parseFloat(String(t.value).replace(',', '.')); return isNaN(n) ? 0 : n; }
    if (ty === 'paras') return t.value.split(/\n\s*\n/).map(x => x.trim()).filter(Boolean);
    return t.value;
  }
  function onInput(e) {
    const t = e.target;
    if (t.matches('[data-gh]')) {
      const g = ghGet(); g[t.dataset.gh] = t.value.trim(); ghSet(g);
      const b = $('#adPublishBtn'); if (b) b.disabled = !ghReady();
      const h = $('#adGhHint'); if (h) h.hidden = ghReady();
      return;
    }
    if (!t.matches('[data-path]') || t.type === 'checkbox') return;
    setPath(C(), t.dataset.path, readVal(t));
    touch(`Editado: ${labelFor(t.dataset.path)}`);
    refreshSummary(t);
  }
  function onChange(e) {
    const t = e.target;
    if (t.matches('[data-upload]')) return onUpload(t);
    if (t.matches('[data-import]')) return onImport(t);
    if (t.matches('input[type="checkbox"][data-path]')) {
      setPath(C(), t.dataset.path, t.checked);
      touch(`Editado: ${labelFor(t.dataset.path)}`);
      refreshSummary(t);
    }
  }

  async function compress(file, max = 1800, q = .82) {
    let src;
    try { src = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
    catch {
      src = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = URL.createObjectURL(file); });
    }
    const k = Math.min(1, max / Math.max(src.width, src.height));
    const cv = document.createElement('canvas');
    cv.width = Math.round(src.width * k); cv.height = Math.round(src.height * k);
    cv.getContext('2d').drawImage(src, 0, 0, cv.width, cv.height);
    let url = cv.toDataURL('image/webp', q);
    if (!url.startsWith('data:image/webp')) url = cv.toDataURL('image/jpeg', .85);
    return url;
  }
  async function onUpload(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    const path = input.dataset.upload;
    const field = input.closest('.ad-field');
    const state = $('.ad-img__state', field);
    if (!file.type.startsWith('image/')) { toast('Escolha um ficheiro de imagem (JPG, PNG ou WebP).', 'error'); return; }
    state.textContent = 'A otimizar a fotografia…';
    try {
      const data = await compress(file);
      setPath(C(), path, data);
      touch(`Fotografia alterada: ${labelFor(path)}`);
      refreshSummary(field);
      refreshImageField(field);
      toast('Fotografia adicionada. Publique para a mostrar às clientes.');
    } catch {
      state.textContent = 'Não foi possível ler esta imagem. Experimente outro ficheiro (JPG ou PNG).';
    }
  }
  async function onImport(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    try {
      const j = JSON.parse(await file.text());
      if (!j || !Array.isArray(j.services)) throw new Error('formato');
      draft.content = normalize(j);
      touch('Conteúdo importado de ficheiro');
      renderPanel(panel);
      toast('Ficheiro importado. Reveja e publique quando estiver pronto.');
    } catch {
      toast('Este ficheiro não é um content.json válido.', 'error');
    }
    input.value = '';
  }

  function onClick(e) {
    const b = e.target.closest('[data-act], [data-panel], [data-go]');
    if (!b || !el.contains(b)) return;
    if (b.dataset.panel) { openPath = null; renderPanel(b.dataset.panel); $('#adMain').focus({ preventScroll: true }); return; }
    if (b.dataset.go) { openPath = null; renderPanel(b.dataset.go); return; }
    const act = b.dataset.act, lp = b.dataset.list, i = +b.dataset.i;
    const arr = lp ? getPath(C(), lp) : null;
    switch (act) {
      case 'logout': return logout();
      case 'publish': return publish();
      case 'export': return exportJSON();
      case 'gh-test': return testGh();
      case 'reveal': {
        const inp = $('#' + b.getAttribute('aria-controls')), show = inp.type === 'password';
        inp.type = show ? 'text' : 'password';
        b.textContent = show ? 'Esconder' : 'Mostrar';
        b.setAttribute('aria-pressed', String(show));
        return;
      }
      case 'discard': {
        if (!b.dataset.armed) return arm(b, 'Confirmar: descartar');
        return discard();
      }
      case 'add': {
        arr.push(NEW[lp]());
        openPath = `${lp}.${arr.length - 1}`;
        touch(`Adicionado: ${LIST_LABEL[lp] || lp}`);
        renderPanel(panel, { keepScroll: true });
        const node = $(`[data-item="${openPath}"]`);
        if (node) { node.scrollIntoView({ block: 'center', behavior: 'smooth' }); $('input, textarea', node)?.focus({ preventScroll: true }); }
        return;
      }
      case 'up': case 'down': {
        const j = act === 'up' ? i - 1 : i + 1;
        if (j < 0 || j >= arr.length) return;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        openPath = `${lp}.${j}`;
        touch(`Ordem alterada: ${ROOTS[lp] || LIST_LABEL[lp] || lp}`);
        renderPanel(panel, { keepScroll: true });
        return;
      }
      case 'dup': {
        const copy = structuredClone(arr[i]);
        if (copy && !Array.isArray(copy) && copy.id) copy.id = newId(copy.id.split('-')[0]);
        if (copy && (copy.name || copy.title)) copy[copy.name ? 'name' : 'title'] += ' (cópia)';
        arr.splice(i + 1, 0, copy);
        openPath = `${lp}.${i + 1}`;
        touch(`Duplicado: ${LIST_LABEL[lp] || lp}`);
        renderPanel(panel, { keepScroll: true });
        return;
      }
      case 'del': {
        if (!b.dataset.armed) return arm(b, 'Confirmar eliminação');
        const it = arr[i];
        const name = Array.isArray(it) ? it[0] : (it.name || it.title || LIST_LABEL[lp]);
        arr.splice(i, 1);
        openPath = null;
        touch(`Eliminado: ${name}`);
        renderPanel(panel, { keepScroll: true });
        toast(`“${name}” foi eliminado.`);
        return;
      }
      case 'img-clear': {
        const field = b.closest('.ad-field');
        setPath(C(), b.dataset.path, '');
        touch(`Fotografia removida: ${labelFor(b.dataset.path)}`);
        refreshSummary(field);
        refreshImageField(field);
        return;
      }
    }
  }
  function arm(b, label) {
    const orig = b.textContent;
    b.dataset.armed = '1';
    b.textContent = label;
    setTimeout(() => { if (b.isConnected) { delete b.dataset.armed; b.textContent = orig; } }, 3500);
  }

  async function discard() {
    let data = normalize({});
    try {
      const r = await fetch(`content.json?v=${Date.now()}`, { cache: 'no-store' });
      if (r.ok) { const j = await r.json(); if (j && Array.isArray(j.services)) { data = normalize(j); publishedStamp = j.updatedAt || null; } }
    } catch { /* usar dados por omissão */ }
    draft.content = data;
    draft.changed = false;
    draft.base = publishedStamp;
    applyData(data);
    siteDirty = true;
    log('Rascunho descartado');
    await persist();
    openPath = null;
    renderPanel(panel);
    toast('Rascunho descartado. Está a ver a versão online.');
  }

  function exportJSON() {
    const content = structuredClone(C());
    content.updatedAt = new Date().toISOString();
    content.version = 1;
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'content.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    log('Cópia de segurança descarregada');
    persist();
  }

  /* ---------- GitHub ---------- */
  async function ghFetch(g, path, opts = {}) {
    const r = await fetch('https://api.github.com' + path, {
      method: opts.method || 'GET',
      headers: { Authorization: `Bearer ${g.token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(opts.body ? { 'Content-Type': 'application/json' } : {}) },
      body: opts.body ? JSON.stringify(opts.body) : undefined
    });
    if (!r.ok) {
      let m = '';
      try { m = (await r.json()).message; } catch { /* sem corpo */ }
      const err = new Error(m || r.statusText);
      err.status = r.status;
      throw err;
    }
    return r.json();
  }
  function explain(e) {
    if (e.status === 401) return 'o token não é válido ou expirou.';
    if (e.status === 403) return 'o token não tem permissão para escrever neste repositório (precisa de “Contents: Read and write”).';
    if (e.status === 404) return 'repositório ou branch não encontrado. Confirme o utilizador, o nome do repositório e o branch.';
    if (e.status === 409) return 'o repositório está vazio. Envie primeiro os ficheiros do site.';
    if (e.status === 422) return 'o GitHub recusou o pedido (' + e.message + ').';
    if (e instanceof TypeError) return 'não foi possível contactar o GitHub. Verifique a ligação à internet.';
    return e.message;
  }
  async function testGh() {
    const out = $('#adGhResult');
    const g = ghGet();
    if (!ghReady()) { out.textContent = 'Preencha o utilizador, o repositório e o token.'; return; }
    out.textContent = 'A testar…';
    try {
      const repo = await ghFetch(g, `/repos/${g.owner}/${g.repo}`);
      await ghFetch(g, `/repos/${g.owner}/${g.repo}/git/ref/heads/${g.branch || 'main'}`);
      out.textContent = repo.permissions && repo.permissions.push === false
        ? 'Ligação feita, mas este token só pode ler. Dê-lhe a permissão “Contents: Read and write”.'
        : `Ligação OK: ${repo.full_name}, branch ${g.branch || 'main'}.`;
    } catch (err) {
      out.textContent = 'Não foi possível ligar: ' + explain(err);
    }
  }

  async function publish() {
    if (publishing) return;
    if (!ghReady()) { renderPanel('publicar'); toast('Configure primeiro a ligação ao GitHub.', 'error'); return; }
    if (panel !== 'publicar') renderPanel('publicar');
    publishing = true;
    const g = ghGet();
    const branch = g.branch || 'main';
    const dir = (g.folder || '').replace(/^\/+|\/+$/g, '');
    const pre = dir ? dir + '/' : '';
    const steps = $('#adSteps');
    steps.hidden = false;
    steps.innerHTML = '';
    const step = (t, cls = '') => { const li = document.createElement('li'); li.textContent = t; if (cls) li.className = cls; steps.appendChild(li); return li; };
    const ok = li => li.classList.add('is-done');
    $$('[data-act="publish"]').forEach(b => { b.disabled = true; });
    const content = structuredClone(C());
    const api = (path, opts) => ghFetch(g, `/repos/${g.owner}/${g.repo}${path}`, opts);
    try {
      let s = step('A ligar ao GitHub…');
      const ref = await api(`/git/ref/heads/${branch}`);
      const baseSha = ref.object.sha;
      const baseCommit = await api(`/git/commits/${baseSha}`);
      ok(s);
      const uploads = collectUploads(content);
      const tree = [], fresh = {};
      for (let i = 0; i < uploads.length; i++) {
        const path = uploads[i];
        s = step(`A enviar fotografia ${i + 1} de ${uploads.length}…`);
        const data = getPath(content, path);
        const [meta, b64] = data.split(',');
        const ext = ((meta.match(/image\/(\w+)/) || [])[1] || 'webp').replace('jpeg', 'jpg');
        const rel = `assets/uploads/${slug(labelFor(path))}-${Date.now().toString(36)}${i}.${ext}`;
        const blob = await api('/git/blobs', { method: 'POST', body: { content: b64, encoding: 'base64' } });
        tree.push({ path: pre + rel, mode: '100644', type: 'blob', sha: blob.sha });
        setPath(content, path, rel);
        fresh[rel] = data;
        ok(s);
      }
      s = step('A guardar textos e preços…');
      content.updatedAt = new Date().toISOString();
      content.version = 1;
      const jb = await api('/git/blobs', { method: 'POST', body: { content: JSON.stringify(content, null, 2), encoding: 'utf-8' } });
      tree.push({ path: pre + 'content.json', mode: '100644', type: 'blob', sha: jb.sha });
      const t = await api('/git/trees', { method: 'POST', body: { base_tree: baseCommit.tree.sha, tree } });
      const cm = await api('/git/commits', { method: 'POST', body: { message: `Conteúdo atualizado no painel (${fmtDate(Date.now())})`, tree: t.sha, parents: [baseSha] } });
      await api(`/git/refs/heads/${branch}`, { method: 'PATCH', body: { sha: cm.sha } });
      ok(s);

      uploads.forEach(path => { if (getPath(C(), path) === fresh[getPath(content, path)]) setPath(C(), path, getPath(content, path)); });
      Object.entries(fresh).forEach(([k, v]) => LocalImg.set(k, v));
      const stored = (await idb.get('localImages')) || {};
      Object.assign(stored, fresh);
      await idb.set('localImages', stored);
      draft.changed = false;
      draft.publishedAt = Date.now();
      draft.base = content.updatedAt;
      publishedStamp = content.updatedAt;
      siteDirty = true;
      log(uploads.length ? `Publicado, com ${uploads.length} fotografia${uploads.length > 1 ? 's' : ''} nova${uploads.length > 1 ? 's' : ''}` : 'Publicado');
      await persist();
      step('Publicado. O site atualiza dentro de 1 a 2 minutos.', 'is-done is-final');
      const done = steps.innerHTML;
      renderPanel('publicar', { keepScroll: true });
      const ns = $('#adSteps'); ns.innerHTML = done; ns.hidden = false;
      toast('Publicado com sucesso.');
    } catch (err) {
      step('Não foi possível publicar: ' + explain(err), 'is-error');
      toast('A publicação falhou. Veja o detalhe em Publicar.', 'error');
    }
    publishing = false;
    $$('[data-act="publish"]').forEach(b => { b.disabled = !ghReady(); });
    status();
  }

  return { init, enter };
})();

/* =====================================================================
   8. ARRANQUE
   ===================================================================== */
async function boot() {
  root.lang = 'pt-PT';
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const data = await DataSource.load();
  applyData(data);
  renderAll(currentData());
  Admin.init();

  if (HAS_GSAP) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  initHeader();
  initMenu();
  initCursor();
  initMagnetic();
  initServices();
  initGallery();
  initContact();

  showView(nameFromHash());
  if (current === 'admin') Admin.enter();

  // loader
  const loader = $('#loader');
  const finishLoader = () => { loader.remove(); root.style.overflow = ''; };
  if (HAS_GSAP && !mqReduce.matches) {
    root.style.overflow = 'hidden';
    const line = $('line', loader);
    gsap.timeline({ onComplete: finishLoader })
      .from($$('.loader__mono span', loader), { yPercent: 60, opacity: 0, duration: .55, ease: 'expo.out', stagger: .08 })
      .from($('.loader__name', loader), { opacity: 0, letterSpacing: '.9em', duration: .5, ease: 'expo.out' }, .2)
      .to(line, { strokeDashoffset: 0, duration: .55, ease: 'power2.inOut' }, .3)
      .to(loader, { clipPath: 'inset(0% 0% 100% 0%)', duration: .6, ease: 'expo.inOut' }, .95);
  } else finishLoader();

  mount(current);
  initMobileBar();

  addEventListener('hashchange', () => go(nameFromHash()));
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const n = a.getAttribute('href').slice(1);
    if (n === current) { e.preventDefault(); go(n); }
  });

  if (HAS_GSAP && document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => HAS_GSAP && ScrollTrigger.refresh());
}

// API pública mínima (útil para futura integração com Firebase / debugging)
window.BeautyStudio = { get data() { return currentData(); }, DataSource, go };

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
})();
