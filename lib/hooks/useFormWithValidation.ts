import { useState, useCallback, useEffect } from 'react';
import { validateRequired, validateEmail, validatePhoneNumber } from '@/lib/utils/validation';
import { logger } from '@/lib/utils/logger';

type ValidationRule = {
  required?: boolean;
  email?: boolean;
  phone?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule;
};

type FormErrors<T> = {
  [K in keyof T]?: string;
};

interface UseFormWithValidationOptions<T> {
  initialValues: T;
  validationRules: ValidationRules<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

export const useFormWithValidation = <T extends Record<string, any>>({
  initialValues,
  validationRules,
  onSubmit
}: UseFormWithValidationOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((_name: keyof T, value: any, rules?: ValidationRule): string => {
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

    if (rules.minLength && String(value).length < rules.minLength) {
      return `Minst ${rules.minLength} tecken krävs`;
    }

    if (rules.maxLength && String(value).length > rules.maxLength) {
      return `Max ${rules.maxLength} tecken tillåtna`;
    }

    if (rules.pattern && !rules.pattern.test(String(value))) {
      return 'Ogiltigt format';
    }

    if (rules.custom) {
      const result = rules.custom(value);
      if (typeof result === 'string') return result;
      if (!result) return 'Ogiltigt värde';
    }

    return '';
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors<T> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((key) => {
      const fieldName = key as keyof T;
      const error = validateField(fieldName, values[fieldName], validationRules[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value, validationRules[name]);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validationRules, validateField]);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name], validationRules[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [values, validationRules, validateField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      if (!validateForm()) {
        return;
      }

      await onSubmit(values);
    } catch (err) {
      logger.error('Form submission failed', err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({} as Record<keyof T, boolean>);
  }, [initialValues]);

  useEffect(() => {
    validateForm();
  }, [values, validateForm]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  };
};
