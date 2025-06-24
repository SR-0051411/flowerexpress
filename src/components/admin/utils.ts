
// Utility functions for admin components
export const getSafeDisplayValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};

export const getNumericValue = (value: any): number => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return 0;
  }
  return Number(value);
};

export const getStringValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};
