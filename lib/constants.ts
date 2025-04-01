export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register'
  },
  TRANSFER: {
    CREATE: '/api/transfer/create',
    STATUS: '/api/transfer/status',
    HISTORY: '/api/transfer/history',
    VALIDATE_RECIPIENT: '/api/transfer/validate-recipient'
  },
  PAYMENT: {
    CREATE_INTENT: '/api/create-payment-intent',
    CONFIRM: '/api/payment/confirm',
    CANCEL: '/api/payment/cancel'
  },
  CONTACTS: {
    LIST: '/api/contacts',
    ADD: '/api/contacts/add',
    REMOVE: '/api/contacts/remove'
  }
} as const;

export const CURRENCIES = {
  SEK: 'SEK',
  EUR: 'EUR',
  USD: 'USD'
} as const;

export const TRANSFER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: 'Detta fält är obligatoriskt',
  INVALID_EMAIL: 'Ogiltig e-postadress',
  INVALID_PHONE: 'Ogiltigt telefonnummer',
  INVALID_AMOUNT: 'Ogiltigt belopp',
  MIN_AMOUNT: 'Beloppet är för litet',
  MAX_AMOUNT: 'Beloppet överskrider maxgränsen'
} as const;
