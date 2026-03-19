// Date formatting helpers para hindi na lumabas ang "undefined"

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  if (dateString === 'undefined') return '-';
  if (dateString === 'null') return '-';
  
  // Try to parse the date
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return as-is if not a valid date
    }
    
    // Format as Month DD, YYYY
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
    return dateString;
  }
};

export const formatDateShort = (dateString) => {
  if (!dateString) return '-';
  if (dateString === 'undefined') return '-';
  if (dateString === 'null') return '-';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    // Format as YYYY-MM-DD
    return date.toISOString().split('T')[0];
  } catch (e) {
    return dateString;
  }
};

export const formatMonthYear = (dateString) => {
  if (!dateString) return '-';
  if (dateString === 'undefined') return '-';
  if (dateString === 'null') return '-';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    // Format as Month YYYY
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
    return dateString;
  }
};

export const safeString = (value) => {
  if (value === undefined || value === null) return '-';
  if (value === 'undefined') return '-';
  if (value === 'null') return '-';
  if (typeof value === 'string' && value.trim() === '') return '-';
  return value;
};

export const safeNumber = (value) => {
  if (value === undefined || value === null) return '-';
  if (value === 'undefined') return '-';
  if (value === 'null') return '-';
  if (isNaN(value)) return '-';
  return value;
};

export const formatCurrency = (value) => {
  if (!value) return '-';
  if (value === 'undefined') return '-';
  if (value === 'null') return '-';
  if (isNaN(value)) return '-';
  
  try {
    return `₱${Number(value).toLocaleString()}`;
  } catch (e) {
    return value;
  }
};