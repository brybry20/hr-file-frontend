import React from 'react';

const DateFormatter = ({ date, format = 'full' }) => {
  const formatDate = (dateString) => {
    if (!dateString) return <span className="text-muted">—</span>;
    if (dateString === 'undefined') return <span className="text-muted">—</span>;
    if (dateString === 'null') return <span className="text-muted">—</span>;
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return <span>{dateString}</span>;
      }
      
      if (format === 'full') {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return <span>{date.toLocaleDateString('en-US', options)}</span>;
      } else if (format === 'short') {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return <span>{date.toLocaleDateString('en-US', options)}</span>;
      } else if (format === 'month') {
        const options = { year: 'numeric', month: 'long' };
        return <span>{date.toLocaleDateString('en-US', options)}</span>;
      } else if (format === 'year') {
        return <span>{date.getFullYear()}</span>;
      }
      
      return <span>{date.toLocaleDateString()}</span>;
    } catch (e) {
      return <span>{dateString}</span>;
    }
  };
  
  return formatDate(date);
};

export default DateFormatter;