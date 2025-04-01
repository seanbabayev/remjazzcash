export const validatePhoneNumber = (phone: string): boolean => {
  // Svensk mobilnummer format
  const phoneRegex = /^(?:\+46|0)[7-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateAmount = (amount: number, currency: string): boolean => {
  if (isNaN(amount) || amount <= 0) return false;
  
  // Kontrollera maxbelopp baserat på valuta
  const maxAmounts: Record<string, number> = {
    'SEK': 150000,
    'EUR': 15000,
    'USD': 15000,
  };
  
  return amount <= (maxAmounts[currency] || 150000);
};

export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};
