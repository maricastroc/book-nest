export function BookIllustration() {
  const accent = '#e8b14c'
  const accentLight = '#f3d08a'
  const warm = '#cc803d'
  const green = '#4a9e6e'
  const red = '#ca4036'
  const pageDark = '#16161a'
  const pageLight = '#1f1f24'
  const stroke = '#403a2c'

  return (
    <svg
      viewBox="30 20 290 256"
      preserveAspectRatio="xMidYMid meet"
      className="h-full max-h-full w-full"
      role="img"
      aria-hidden="true"
    >
      <ellipse cx="170" cy="185" rx="90" ry="50" fill={accent} opacity="0.07" />

      <ellipse cx="170" cy="242" rx="72" ry="8" fill="#000000" opacity="0.5" />

      <path
        d="M170 80 C170 80 100 90 88 200 C88 210 170 218 170 218 Z"
        fill={pageDark}
        stroke={stroke}
        strokeWidth="1"
      />
      <line
        x1="104"
        y1="128"
        x2="162"
        y2="124"
        stroke={stroke}
        strokeWidth="1"
        opacity="0.7"
      />
      <line
        x1="102"
        y1="140"
        x2="161"
        y2="136"
        stroke={stroke}
        strokeWidth="1"
        opacity="0.7"
      />
      <line
        x1="100"
        y1="152"
        x2="160"
        y2="148"
        stroke={stroke}
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="99"
        y1="164"
        x2="159"
        y2="161"
        stroke={stroke}
        strokeWidth="1"
        opacity="0.5"
      />
      <line
        x1="98"
        y1="176"
        x2="158"
        y2="173"
        stroke={stroke}
        strokeWidth="1"
        opacity="0.4"
      />
      <line
        x1="97"
        y1="188"
        x2="157"
        y2="186"
        stroke={stroke}
        strokeWidth="1"
        opacity="0.3"
      />

      <path
        d="M170 80 C170 80 240 90 252 200 C252 210 170 218 170 218 Z"
        fill={pageLight}
        stroke={stroke}
        strokeWidth="1"
      />
      <line
        x1="178"
        y1="124"
        x2="236"
        y2="128"
        stroke={stroke}
        strokeWidth="1"
        opacity="0.7"
      />
      <line
        x1="179"
        y1="136"
        x2="238"
        y2="140"
        stroke={stroke}
        strokeWidth="1"
        opacity="0.7"
      />
      <line
        x1="180"
        y1="148"
        x2="240"
        y2="152"
        stroke={stroke}
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="181"
        y1="161"
        x2="241"
        y2="164"
        stroke={stroke}
        strokeWidth="1"
        opacity="0.5"
      />
      <line
        x1="182"
        y1="173"
        x2="242"
        y2="176"
        stroke={stroke}
        strokeWidth="1"
        opacity="0.4"
      />
      <line
        x1="183"
        y1="186"
        x2="243"
        y2="188"
        stroke={stroke}
        strokeWidth="1"
        opacity="0.3"
      />

      <path
        d="M170 80 Q166 149 170 218 Q174 149 170 80"
        fill={accent}
        opacity="0.5"
      />

      <path
        d="M88 200 C88 212 105 228 170 230 C235 228 252 212 252 200"
        fill="#0e0e10"
        stroke="#26262c"
        strokeWidth="1"
      />

      <g transform="translate(128, 52) rotate(15)">
        <polygon
          points="0,-8 2,-3 7,-3 3,1 5,6 0,3 -5,6 -3,1 -7,-3 -2,-3"
          fill={accent}
          opacity="0.9"
        />
      </g>
      {/* star 2 small */}
      <g transform="translate(210, 44) rotate(-10)">
        <polygon
          points="0,-5 1.5,-2 4.5,-2 2,1 3,4 0,2 -3,4 -2,1 -4.5,-2 -1.5,-2"
          fill={warm}
          opacity="0.85"
        />
      </g>
      <g transform="translate(152, 35) rotate(5)">
        <polygon
          points="0,-4 1,-1.5 3.5,-1.5 1.5,0.5 2.5,3 0,1.5 -2.5,3 -1.5,0.5 -3.5,-1.5 -1,-1.5"
          fill={accentLight}
          opacity="0.7"
        />
      </g>

      <g transform="translate(72, 110) rotate(-18)">
        <rect x="-14" y="-18" width="28" height="36" rx="2" fill="#b3852f" />
        <rect x="-14" y="-18" width="5" height="36" rx="1" fill="#7a5a1c" />
        <line
          x1="-5"
          y1="-10"
          x2="10"
          y2="-10"
          stroke={accent}
          strokeWidth="1.5"
          opacity="0.5"
        />
        <line
          x1="-5"
          y1="-4"
          x2="10"
          y2="-4"
          stroke={accent}
          strokeWidth="1.5"
          opacity="0.4"
        />
        <line
          x1="-5"
          y1="2"
          x2="10"
          y2="2"
          stroke={accent}
          strokeWidth="1.5"
          opacity="0.3"
        />
      </g>

      <g transform="translate(268, 118) rotate(14)">
        <rect x="-12" y="-16" width="24" height="32" rx="2" fill="#2f6b4c" />
        <rect x="-12" y="-16" width="4" height="32" rx="1" fill="#1d4530" />
        <line
          x1="-4"
          y1="-9"
          x2="8"
          y2="-9"
          stroke={green}
          strokeWidth="1.5"
          opacity="0.5"
        />
        <line
          x1="-4"
          y1="-3"
          x2="8"
          y2="-3"
          stroke={green}
          strokeWidth="1.5"
          opacity="0.4"
        />
        <line
          x1="-4"
          y1="3"
          x2="8"
          y2="3"
          stroke={green}
          strokeWidth="1.5"
          opacity="0.3"
        />
      </g>

      <g transform="translate(170, 28) rotate(4)">
        <rect
          x="-10"
          y="-13"
          width="20"
          height="26"
          rx="2"
          fill="#8a322b"
          opacity="0.9"
        />
        <rect
          x="-10"
          y="-13"
          width="3"
          height="26"
          rx="1"
          fill="#54201b"
          opacity="0.9"
        />
        <line
          x1="-4"
          y1="-7"
          x2="7"
          y2="-7"
          stroke={red}
          strokeWidth="1.5"
          opacity="0.45"
        />
        <line
          x1="-4"
          y1="-2"
          x2="7"
          y2="-2"
          stroke={red}
          strokeWidth="1.5"
          opacity="0.35"
        />
      </g>

      <circle cx="95" cy="72" r="2.5" fill={accent} opacity="0.6" />
      <circle cx="245" cy="68" r="2" fill={warm} opacity="0.6" />
      <circle cx="140" cy="22" r="1.5" fill={accentLight} opacity="0.5" />
      <circle cx="198" cy="26" r="2" fill={accent} opacity="0.4" />
      <circle cx="78" cy="150" r="1.5" fill={warm} opacity="0.4" />
      <circle cx="262" cy="155" r="1.5" fill={accent} opacity="0.4" />

      <path
        d="M130 90 Q170 72 210 90"
        fill="none"
        stroke={accent}
        strokeWidth="1"
        opacity="0.3"
        strokeDasharray="3 4"
      />
    </svg>
  )
}
