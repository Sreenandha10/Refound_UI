const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const Logo = ({ size = 28 }) => (
  <svg {...base} width={size} height={size}>
    <path d="M12 4a8 8 0 1 0 8 8" />
    <path d="M20 4v5h-5" />
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
  </svg>
);
export const Bell = () => (<svg {...base}><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M10 19a2 2 0 0 0 4 0" /></svg>);
export const Menu = () => (<svg {...base}><path d="M4 7h16M4 12h16M4 17h16" /></svg>);
export const Close = () => (<svg {...base}><path d="M6 6l12 12M18 6L6 18" /></svg>);
