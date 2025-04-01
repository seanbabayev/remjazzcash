export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  // Behåll bara siffror
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format: +46 XX XXX XX XX
  if (cleaned.length === 10) {
    return `+46 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`;
  }
  
  return phoneNumber;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
