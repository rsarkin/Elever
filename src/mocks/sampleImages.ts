// Helper to generate realistic side-scan sonar waterfall texture via SVG canvas Data URIs

export function generateSonarSampleDataUrl(type: 'ghost_net' | 'shipwreck' | 'debris' | 'seabed'): string {
  const width = 1200;
  const height = 800;

  // We construct SVG representations of side-scan sonar imagery
  // Dual-channel acoustic waterfall with nadir central line, reverberation noise, and target highlights
  let svgContent = '';

  if (type === 'ghost_net') {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="sonarBg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#14110f" />
            <stop offset="47%" stop-color="#2a241f" />
            <stop offset="50%" stop-color="#080706" />
            <stop offset="53%" stop-color="#2a241f" />
            <stop offset="100%" stop-color="#14110f" />
          </linearGradient>
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="0.4 0 0 0 0.15  0 0.35 0 0 0.12  0 0 0.3 0 0.1  0 0 0 0.4 0" />
          </filter>
        </defs>
        
        <!-- Base Sonar Channels -->
        <rect width="${width}" height="${height}" fill="url(#sonarBg)" />
        
        <!-- Acoustic Reverberation / Seabed Texture -->
        <rect width="${width}" height="${height}" fill="#3d352e" opacity="0.3" filter="url(#noise)" />
        
        <!-- Nadir Track (Central Blind Zone) -->
        <rect x="585" y="0" width="30" height="${height}" fill="#080706" opacity="0.95" />
        <line x1="600" y1="0" x2="600" y2="${height}" stroke="#38bdf8" stroke-width="1" stroke-dasharray="8 4" opacity="0.4" />

        <!-- Port & Starboard Range Lines -->
        <line x1="200" y1="0" x2="200" y2="${height}" stroke="#e5d9cc" stroke-width="0.5" opacity="0.15" />
        <line x1="400" y1="0" x2="400" y2="${height}" stroke="#e5d9cc" stroke-width="0.5" opacity="0.15" />
        <line x1="800" y1="0" x2="800" y2="${height}" stroke="#e5d9cc" stroke-width="0.5" opacity="0.15" />
        <line x1="1000" y1="0" x2="1000" y2="${height}" stroke="#e5d9cc" stroke-width="0.5" opacity="0.15" />

        <!-- TARGET 1: Derelict Fishing Trap / Ghost Gear (Port Channel) -->
        <!-- Acoustic High Bright Reflection -->
        <path d="M 380 220 C 400 210, 440 230, 460 215 C 470 240, 430 270, 390 255 Z" fill="#a7f3d0" opacity="0.95" />
        <path d="M 390 225 L 450 220 L 440 250 L 395 245 Z" fill="#ffffff" opacity="0.85" />
        <path d="M 385 220 Q 420 200 455 218" stroke="#38bdf8" stroke-width="3" fill="none" opacity="0.9" />
        <!-- Acoustic Shadow (Dark zone behind object away from nadir) -->
        <path d="M 380 220 L 260 210 L 270 260 L 390 255 Z" fill="#080706" opacity="0.85" />

        <!-- TARGET 2: Artificial Metal Cage (Starboard Channel) -->
        <rect x="750" y="480" width="90" height="60" rx="4" fill="#fde047" opacity="0.9" transform="rotate(-12 795 510)" />
        <rect x="755" y="485" width="80" height="50" fill="#ffffff" opacity="0.75" transform="rotate(-12 795 510)" />
        <!-- Acoustic Shadow Starboard -->
        <polygon points="840,470 980,450 990,520 830,540" fill="#080706" opacity="0.9" />

        <!-- Target 3: Small Debris Patch -->
        <circle cx="320" cy="590" r="18" fill="#e0f2fe" opacity="0.85" />
        <polygon points="305,585 210,575 205,605 310,600" fill="#080706" opacity="0.8" />
        
        <!-- Text overlay elements simulated on raw sonar -->
        <text x="30" y="40" fill="#38bdf8" font-family="monospace" font-size="14" opacity="0.7">RANGE: 75m | FREQ: 455kHz | SPEED: 4.2kts</text>
        <text x="30" y="770" fill="#a89887" font-family="monospace" font-size="12" opacity="0.6">ELVER SSS WATERFALL DEMO CHANNEL [PORT / STBD]</text>
      </svg>
    `;
  } else if (type === 'shipwreck') {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="sonarBg2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#14110f" />
            <stop offset="47%" stop-color="#241e1a" />
            <stop offset="50%" stop-color="#060504" />
            <stop offset="53%" stop-color="#241e1a" />
            <stop offset="100%" stop-color="#14110f" />
          </linearGradient>
          <filter id="noise2">
            <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="0.35 0 0 0 0.12  0 0.3 0 0 0.1  0 0 0.3 0 0.1  0 0 0 0.45 0" />
          </filter>
        </defs>

        <rect width="${width}" height="${height}" fill="url(#sonarBg2)" />
        <rect width="${width}" height="${height}" fill="#2b2521" opacity="0.35" filter="url(#noise2)" />
        <rect x="585" y="0" width="30" height="${height}" fill="#060504" opacity="0.95" />

        <!-- Submerged Ship Hull Acoustic Reflection (Starboard) -->
        <path d="M 710 180 C 760 160, 840 220, 880 340 C 890 420, 840 520, 780 560 C 740 540, 700 440, 690 320 Z" fill="#bae6fd" opacity="0.9" />
        <path d="M 720 200 L 850 340 L 800 520 L 710 320 Z" fill="#ffffff" opacity="0.65" />
        <line x1="720" y1="260" x2="810" y2="290" stroke="#0284c7" stroke-width="4" />
        <line x1="735" y1="330" x2="840" y2="360" stroke="#0284c7" stroke-width="4" />
        <line x1="745" y1="400" x2="830" y2="430" stroke="#0284c7" stroke-width="4" />

        <path d="M 880 340 L 1180 300 L 1190 620 L 780 560 Z" fill="#060504" opacity="0.9" />
        
        <text x="30" y="40" fill="#38bdf8" font-family="monospace" font-size="14" opacity="0.7">SURVEY: DEEP_SHELF_04 | CHAN: DUAL 900kHz</text>
      </svg>
    `;
  } else {
    // Default Debris & Seabed
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="sonarBg3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#14110f" />
            <stop offset="47%" stop-color="#241e1a" />
            <stop offset="50%" stop-color="#060504" />
            <stop offset="53%" stop-color="#241e1a" />
            <stop offset="100%" stop-color="#14110f" />
          </linearGradient>
          <filter id="noise3">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" result="noise" />
            <feColorMatrix type="matrix" values="0.35 0 0 0 0.1  0 0.3 0 0 0.08  0 0 0.25 0 0.08  0 0 0 0.35 0" />
          </filter>
        </defs>

        <rect width="${width}" height="${height}" fill="url(#sonarBg3)" />
        <rect width="${width}" height="${height}" fill="#3d352e" opacity="0.25" filter="url(#noise3)" />
        <rect x="585" y="0" width="30" height="${height}" fill="#060504" />

        <polygon points="340,310 420,300 430,360 350,370" fill="#fde047" opacity="0.85" />
        <polygon points="340,310 220,290 230,380 350,370" fill="#060504" opacity="0.85" />

        <text x="30" y="40" fill="#38bdf8" font-family="monospace" font-size="14" opacity="0.7">SURVEY: HARBOR_APPROACH_02</text>
      </svg>
    `;
  }

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}
