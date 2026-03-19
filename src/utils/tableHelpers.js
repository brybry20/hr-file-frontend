// Helper para sa table displays

export const safeRender = (value, fallback = '—') => {
  if (value === undefined || value === null) return fallback;
  if (value === 'undefined') return fallback;
  if (value === 'null') return fallback;
  if (typeof value === 'string' && value.trim() === '') return fallback;
  return value;
};

export const renderDate = (value) => {
  if (!value) return '—';
  if (value === 'undefined') return '—';
  if (value === 'null') return '—';
  
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
    return value;
  }
};

export const renderBool = (value) => {
  if (value === 'TRUE' || value === true) return '✓ Yes';
  if (value === 'FALSE' || value === false) return '✗ No';
  return '—';
};

export const renderCurrency = (value) => {
  if (!value) return '—';
  if (isNaN(value)) return value;
  
  try {
    return `₱${Number(value).toLocaleString()}`;
  } catch (e) {
    return value;
  }
};

export const renderName = (firstName, lastName) => {
  if (!firstName && !lastName) return '—';
  return `${lastName || ''}, ${firstName || ''}`.trim().replace(/^,/, '').trim() || '—';
};