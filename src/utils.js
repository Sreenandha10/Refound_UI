export const fmtDate = (d) => new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
export const fmtDay = (d) => new Date(d).toLocaleDateString(undefined, { dateStyle: 'medium' });

export const timeAgo = (d) => {
  const s = Math.max(1, Math.floor((Date.now() - new Date(d)) / 1000));
  const units = [['y', 31536000], ['mo', 2592000], ['d', 86400], ['h', 3600], ['m', 60]];
  for (const [label, size] of units) if (s >= size) return `${Math.floor(s / size)}${label} ago`;
  return 'just now';
};

export const toLocalInput = (d) => new Date(new Date(d) - new Date(d).getTimezoneOffset() * 60000).toISOString().slice(0, 16);

export const WEIGHTS = { category: 30, location: 25, brand: 15, color: 15, date: 10, description: 5 };
export const LABELS = { category: 'Category', location: 'Location', brand: 'Brand', color: 'Color', date: 'Date', description: 'Description' };
