import { useState, useCallback } from 'react';
import type { ValidationResult } from '../utils/validation';

export type ValidatorFunction = (value: number) => ValidationResult;

export interface UseFieldValidationReturn {
  validationResult: ValidationResult;
  validateField: (value: number) => void;
  clearError: () => void;
}

export const useFieldValidation = (
  validator: ValidatorFunction
): UseFieldValidationReturn => {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true
  });

  const validateField = useCallback((value: number) => {
    const result = validator(value);
    setValidationResult(result);
  }, [validator]);

  const clearError = useCallback(() => {
    setValidationResult({ isValid: true });
  }, []);

  return {
    validationResult,
    validateField,
    clearError
  };
};

export interface UseMultiFieldValidationReturn {
  validationResults: Record<string, ValidationResult>;
  validateField: (fieldName: string, value: number, validator: ValidatorFunction) => void;
  clearError: (fieldName: string) => void;
  clearAllErrors: () => void;
  hasErrors: boolean;
}

export const useMultiFieldValidation = (): UseMultiFieldValidationReturn => {
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({});

  const validateField = useCallback((
    fieldName: string, 
    value: number, 
    validator: ValidatorFunction
  ) => {
    const result = validator(value);
    setValidationResults(prev => ({
      ...prev,
      [fieldName]: result
    }));
  }, []);

  const clearError = useCallback((fieldName: string) => {
    setValidationResults(prev => {
      const newResults = { ...prev };
      delete newResults[fieldName];
      return newResults;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setValidationResults({});
  }, []);

  const hasErrors = Object.values(validationResults).some(result => !result.isValid);

  return {
    validationResults,
    validateField,
    clearError,
    clearAllErrors,
    hasErrors
  };
};