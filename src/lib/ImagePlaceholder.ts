// utils/imagePlaceholder.ts
export function getInitials(text?: string, max = 3) {
  if (!text) return '';
  const parts = text.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, max).toUpperCase();
  return (
    (parts[0][0] || '') +
    (parts[parts.length - 1][0] || '')
  ).slice(0, max).toUpperCase();
}

function hashToColorSeed(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
  return Math.abs(hash);
}

function pickGradient(title = '', category = '') {
  const seed = hashToColorSeed(title + category);
  const palettes = [
    ['#0382472', '#032848'], // purple
    ['#0E92A4', '#082484'], // teal
    ['#F97316', '#FB923C'], // orange
    ['#EF4444', '#F43F5E'], // red
    ['#06B6D4', '#3B82F6'], // blue
    ['#10B981', '#34D399'], // green
  ];
  return palettes[seed % palettes.length];
}

export function makePlaceholderDataUrl(title?: string, category?: string) {
  const initials = getInitials(title || '', 2) || '?';
  const [c1, c2] = pickGradient(title || '', category || '');
  const catLabel = (category || '').replace('_', ' ').toUpperCase();

  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='600' height='900' viewBox='0 0 600 900'>
    <defs>
      <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
        <stop offset='0' stop-color='${c1}'/>
        <stop offset='1' stop-color='${c2}'/>
      </linearGradient>
      <filter id="grain">
        <feTurbulence baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
        <feBlend mode="soft-light"/>
      </filter>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)' rx='24' ry='24'/>
    <g opacity='0.06'><rect width='100%' height='100%' fill='black' /></g>
    <g transform='translate(0,0)'>
      <text x='50%' y='48%' dominant-baseline='middle' text-anchor='middle'
            font-family='Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
            font-size='120' font-weight='700' fill='rgba(255,255,255,0.95)'>${initials}</text>
    </g>
   
  </svg>`;

  // encode as data url (URI encoded to keep short)
  const encoded = encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22');
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[&<>'"]/g, (c) => {
    switch (c) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case "'": return '&#39;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}