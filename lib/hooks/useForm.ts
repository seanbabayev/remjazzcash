import { useState, useCallback } from 'react';
import { validateRequired, validateEmail, validatePhoneNumber } from '../utils/validation';

interface ValidationRules {
  required?: boolean;
  email?: boolean;
  phone?: boolean;
  custom?: (value: any) => boolean;
}

interface FormErrors {
  [key: string]: string;
}

export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, ValidationRules> = {} as Record<keyof T, ValidationRules>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

  const validateField = useCallback((_name: keyof T, value: any, rules?: ValidationRules) => {
    if (!rules) return '';

    if (rules.required && !validateRequired(value)) {
      return 'Detta fält är obligatoriskt';
    }

    if (rules.email && !validateEmail(value)) {
      return 'Ogiltig e-postadress';
    }

    if (rules.phone && !validatePhoneNumber(value)) {
      return 'Ogiltigt telefonnummer';
    }

    if (rules.custom && !rules.custom(value)) {
      return 'Ogiltigt värde';
    }

    return '';
  }, []);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value, validationRules[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validationRules, validateField]);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name], validationRules[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [values, validationRules, validateField]);

  const isValid = useCallback(() => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(values).forEach(key => {
      const error = validateField(key as keyof T, values[key], validationRules[key as keyof T]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    isValid,
    setValues,
  };
};
