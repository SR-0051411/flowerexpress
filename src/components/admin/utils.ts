
// Helper function to safely render values, excluding File objects
export const getSafeDisplayValue = (value: any): string => {
  if (value instanceof File) {
    return ''; // Don't render File objects
  }
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};

// Helper function to get numeric values safely
export const getNumericValue = (value: any): number => {
  if (typeof value === 'number') {
    return value;
  }
  const parsed = parseFloat(String(value));
  return isNaN(parsed) ? 0 : parsed;
};

// Helper function to get string values safely
export const getStringValue = (value: any): string => {
  if (value instanceof File) {
    return '';
  }
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};
