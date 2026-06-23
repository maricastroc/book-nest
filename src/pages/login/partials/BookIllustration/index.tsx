export function BookIllustration() {
  return (
    <svg
      viewBox="30 20 290 256"
      width="100%"
      preserveAspectRatio="xMinYMid meet"
      style={{ flex: 1, minHeight: 0 }}
      role="img"
      aria-hidden="true"
    >
      {/* ambient glow behind book */}
      <ellipse
        cx="170"
        cy="185"
        rx="90"
        ry="50"
        fill="#8381D9"
        opacity="0.07"
      />

      {/* book shadow */}
      <ellipse cx="170" cy="242" rx="72" ry="8" fill="#0a0d16" opacity="0.5" />

      {/* left page */}
      <path
        d="M170 80 C170 80 100 90 88 200 C88 210 170 218 170 218 Z"
        fill="#1e2540"
        stroke="#303F73"
        strokeWidth="1"
      />
      {/* left page lines */}
      <line
        x1="104"
        y1="128"
        x2="162"
        y2="124"
        stroke="#303F73"
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="102"
        y1="140"
        x2="161"
        y2="136"
        stroke="#303F73"
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="100"
        y1="152"
        x2="160"
        y2="148"
        stroke="#303F73"
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="99"
        y1="164"
        x2="159"
        y2="161"
        stroke="#303F73"
        strokeWidth="1"
        opacity="0.5"
      />
      <line
        x1="98"
        y1="176"
        x2="158"
        y2="173"
        stroke="#303F73"
        strokeWidth="1"
        opacity="0.4"
      />
      <line
        x1="97"
        y1="188"
        x2="157"
        y2="186"
        stroke="#303F73"
        strokeWidth="1"
        opacity="0.3"
      />

      {/* right page */}
      <path
        d="M170 80 C170 80 240 90 252 200 C252 210 170 218 170 218 Z"
        fill="#232b4a"
        stroke="#303F73"
        strokeWidth="1"
      />
      {/* right page lines */}
      <line
        x1="178"
        y1="124"
        x2="236"
        y2="128"
        stroke="#303F73"
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="179"
        y1="136"
        x2="238"
        y2="140"
        stroke="#303F73"
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="180"
        y1="148"
        x2="240"
        y2="152"
        stroke="#303F73"
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="181"
        y1="161"
        x2="241"
        y2="164"
        stroke="#303F73"
        strokeWidth="1"
        opacity="0.5"
      />
      <line
        x1="182"
        y1="173"
        x2="242"
        y2="176"
        stroke="#303F73"
        strokeWidth="1"
        opacity="0.4"
      />
      <line
        x1="183"
        y1="186"
        x2="243"
        y2="188"
        stroke="#303F73"
        strokeWidth="1"
        opacity="0.3"
      />

      {/* spine */}
      <path
        d="M170 80 Q166 149 170 218 Q174 149 170 80"
        fill="#8381D9"
        opacity="0.5"
      />

      {/* cover bottom */}
      <path
        d="M88 200 C88 212 105 228 170 230 C235 228 252 212 252 200"
        fill="#161D2F"
        stroke="#252D4A"
        strokeWidth="1"
      />

      {/* floating elements from book */}

      {/* star 1 */}
      <g transform="translate(128, 52) rotate(15)">
        <polygon
          points="0,-8 2,-3 7,-3 3,1 5,6 0,3 -5,6 -3,1 -7,-3 -2,-3"
          fill="#8381D9"
          opacity="0.9"
        />
      </g>

      {/* star 2 small */}
      <g transform="translate(210, 44) rotate(-10)">
        <polygon
          points="0,-5 1.5,-2 4.5,-2 2,1 3,4 0,2 -3,4 -2,1 -4.5,-2 -1.5,-2"
          fill="#50B2C0"
          opacity="0.8"
        />
      </g>

      {/* star 3 tiny */}
      <g transform="translate(152, 35) rotate(5)">
        <polygon
          points="0,-4 1,-1.5 3.5,-1.5 1.5,0.5 2.5,3 0,1.5 -2.5,3 -1.5,0.5 -3.5,-1.5 -1,-1.5"
          fill="#B2AFF0"
          opacity="0.7"
        />
      </g>

      {/* floating mini book left */}
      <g transform="translate(72, 110) rotate(-18)">
        <rect x="-14" y="-18" width="28" height="36" rx="2" fill="#4F47A3" />
        <rect x="-14" y="-18" width="5" height="36" rx="1" fill="#2A2879" />
        <line
          x1="-5"
          y1="-10"
          x2="10"
          y2="-10"
          stroke="#8381D9"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <line
          x1="-5"
          y1="-4"
          x2="10"
          y2="-4"
          stroke="#8381D9"
          strokeWidth="1.5"
          opacity="0.4"
        />
        <line
          x1="-5"
          y1="2"
          x2="10"
          y2="2"
          stroke="#8381D9"
          strokeWidth="1.5"
          opacity="0.3"
        />
      </g>

      {/* floating mini book right */}
      <g transform="translate(268, 118) rotate(14)">
        <rect x="-12" y="-16" width="24" height="32" rx="2" fill="#255D6A" />
        <rect x="-12" y="-16" width="4" height="32" rx="1" fill="#0A313C" />
        <line
          x1="-4"
          y1="-9"
          x2="8"
          y2="-9"
          stroke="#50B2C0"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <line
          x1="-4"
          y1="-3"
          x2="8"
          y2="-3"
          stroke="#50B2C0"
          strokeWidth="1.5"
          opacity="0.4"
        />
        <line
          x1="-4"
          y1="3"
          x2="8"
          y2="3"
          stroke="#50B2C0"
          strokeWidth="1.5"
          opacity="0.3"
        />
      </g>

      {/* floating mini book top */}
      <g transform="translate(170, 28) rotate(4)">
        <rect
          x="-10"
          y="-13"
          width="20"
          height="26"
          rx="2"
          fill="#843d3d"
          opacity="0.85"
        />
        <rect
          x="-10"
          y="-13"
          width="3"
          height="26"
          rx="1"
          fill="#501313"
          opacity="0.85"
        />
        <line
          x1="-4"
          y1="-7"
          x2="7"
          y2="-7"
          stroke="#F09595"
          strokeWidth="1.5"
          opacity="0.4"
        />
        <line
          x1="-4"
          y1="-2"
          x2="7"
          y2="-2"
          stroke="#F09595"
          strokeWidth="1.5"
          opacity="0.3"
        />
      </g>

      {/* sparkle dots */}
      <circle cx="95" cy="72" r="2.5" fill="#8381D9" opacity="0.6" />
      <circle cx="245" cy="68" r="2" fill="#50B2C0" opacity="0.6" />
      <circle cx="140" cy="22" r="1.5" fill="#B2AFF0" opacity="0.5" />
      <circle cx="198" cy="26" r="2" fill="#8381D9" opacity="0.4" />
      <circle cx="78" cy="150" r="1.5" fill="#50B2C0" opacity="0.4" />
      <circle cx="262" cy="155" r="1.5" fill="#8381D9" opacity="0.4" />

      {/* reading arc / glow on book */}
      <path
        d="M130 90 Q170 72 210 90"
        fill="none"
        stroke="#8381D9"
        strokeWidth="1"
        opacity="0.3"
        strokeDasharray="3 4"
      />
    </svg>
  )
}
