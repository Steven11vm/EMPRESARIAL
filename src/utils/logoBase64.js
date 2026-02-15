// Logo SVG como data URL para usar en PDF (evita CORS y carga async)
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb"/>
      <stop offset="100%" style="stop-color:#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="24" fill="url(#lg)"/>
  <text x="60" y="76" font-family="system-ui, sans-serif" font-size="48" font-weight="700" fill="white" text-anchor="middle">EC</text>
</svg>`;

export function getLogoDataUrl() {
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(LOGO_SVG)));
}
