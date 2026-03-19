import React from 'react';
import DateFormatter from './DateFormatter';
import { safeRender, renderBool, renderCurrency } from '../utils/tableHelpers';

const TableCell = ({ 
  value, 
  type = 'text', // text, date, boolean, currency, name
  fallback = '—',
  className = '',
  ...props 
}) => {
  
  const renderContent = () => {
    switch (type) {
      case 'date':
        return <DateFormatter date={value} format="short" />;
        
      case 'boolean':
        return renderBool(value);
        
      case 'currency':
        return renderCurrency(value);
        
      case 'name':
        if (typeof value === 'object') {
          return renderName(value.first, value.last);
        }
        return safeRender(value, fallback);
        
      case 'text':
      default:
        return safeRender(value, fallback);
    }
  };
  
  return (
    <td className={className} {...props}>
      {renderContent()}
    </td>
  );
};

export default TableCell;