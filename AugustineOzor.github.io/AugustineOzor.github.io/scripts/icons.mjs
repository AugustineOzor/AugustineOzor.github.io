// Original line icons for frameworks and regulations (not official logos).
const P = {
  law: '<path d="M12 3v18M7 21h10M4 7h16M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z"/>',
  chip: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/><path d="M10 13.5l1-3h2l1 3M10.5 12.5h3"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3M12 15v2"/>',
  shieldCheck: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  userLock: '<circle cx="9" cy="8" r="3.5"/><path d="M3 20v-1a6 6 0 0 1 8.5-5.4"/><rect x="14" y="15" width="7" height="6" rx="1"/><path d="M15.5 15v-1.5a2 2 0 0 1 4 0V15"/>',
  medical: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M12 8v8M8 12h8"/>',
  bug: '<path d="M8 10h8v5a4 4 0 0 1-8 0z"/><path d="M12 10V8M9 5l1.5 2.5M15 5l-1.5 2.5M4 13h4M16 13h4M5 19l3-2M19 19l-3-2M10 8h4"/>',
  clipboard: '<rect x="5.5" y="4.5" width="13" height="16.5" rx="2"/><path d="M9 3.5h6v3H9zM9 13l2 2 4-4"/>',
  listCheck: '<path d="M11 6h9M11 12h9M11 18h9M4 6l1.5 1.5L8 5M4 12l1.5 1.5L8 11M4 18l1.5 1.5L8 17"/>',
  card: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  people: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20v-1a5 5 0 0 1 10 0v1M14.5 20v-1a4 4 0 0 1 6.5-3"/>',
  sparkle: '<path d="M12 3l2 5.5 5.5 2-5.5 2L12 18l-2-5.5-5.5-2 5.5-2z"/><path d="M19 15v4M17 17h4"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
};
const MAP = {
  "EU AI Act": "law",
  "ISO/IEC 42001": "chip",
  "NIST AI RMF": "compass",
  "ISO/IEC 27001": "lock",
  "NIST CSF": "shieldCheck",
  "GDPR": "userLock",
  "HIPAA": "medical",
  "OWASP LLM Top 10": "bug",
  "SOC 2": "clipboard",
  "CIS Controls": "listCheck",
  "PCI DSS": "card",
  "OECD AI Principles": "globe",
  "EEOC guidance": "people",
  "Responsible AI principles": "sparkle",
  "NIST SP 800-53": "shieldCheck",
  "COBIT 2019": "clipboard",
};
export function fwIcon(name) {
  const key = MAP[name] || "doc";
  return `<svg class="fw-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${P[key]}</svg>`;
}
