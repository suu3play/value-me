export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export type ValidatorFunction = (value: number) => ValidationResult;

export const validateSalary = (value: number): ValidationResult => {
  if (isNaN(value) || value < 0) {
    return {
      isValid: false,
      errorMessage: '年収は0円以上で入力してください'
    };
  }
  
  if (value > 100000000) {
    return {
      isValid: false,
      errorMessage: '年収は1億円以下で入力してください'
    };
  }
  
  return { isValid: true };
};

export const validateHolidays = (value: number): ValidationResult => {
  if (isNaN(value) || value < 0) {
    return {
      isValid: false,
      errorMessage: '年間休日は0日以上で入力してください'
    };
  }
  
  if (value > 366) {
    return {
      isValid: false,
      errorMessage: '年間休日は366日以下で入力してください'
    };
  }
  
  return { isValid: true };
};

export const validateWorkingHours = (value: number): ValidationResult => {
  if (isNaN(value) || value < 0.5) {
    return {
      isValid: false,
      errorMessage: '労働時間は0.5時間以上で入力してください'
    };
  }
  
  if (value > 24) {
    return {
      isValid: false,
      errorMessage: '労働時間は24時間以下で入力してください'
    };
  }
  
  return { isValid: true };
};

export const validateAllowance = (value: number): ValidationResult => {
  if (isNaN(value) || value < 0) {
    return {
      isValid: false,
      errorMessage: '手当は0円以上で入力してください'
    };
  }
  
  if (value > 10000000) {
    return {
      isValid: false,
      errorMessage: '手当は1,000万円以下で入力してください'
    };
  }
  
  return { isValid: true };
};

export const validateBonus = (value: number): ValidationResult => {
  if (isNaN(value) || value < 0) {
    return {
      isValid: false,
      errorMessage: 'ボーナスは0円以上で入力してください'
    };
  }
  
  if (value > 10000000) {
    return {
      isValid: false,
      errorMessage: 'ボーナスは1,000万円以下で入力してください'
    };
  }
  
  return { isValid: true };
};

export const validateCustomHolidays = (value: number): ValidationResult => {
  if (isNaN(value) || value < 0) {
    return {
      isValid: false,
      errorMessage: 'カスタム休日は0日以上で入力してください'
    };
  }
  
  if (value > 365) {
    return {
      isValid: false,
      errorMessage: 'カスタム休日は365日以下で入力してください'
    };
  }
  
  return { isValid: true };
};

export const validateWelfareAmount = (value: number): ValidationResult => {
  if (isNaN(value) || value < 0) {
    return {
      isValid: false,
      errorMessage: '福利厚生額は0円以上で入力してください'
    };
  }
  
  if (value > 10000000) {
    return {
      isValid: false,
      errorMessage: '福利厚生額は1,000万円以下で入力してください'
    };
  }
  
  return { isValid: true };
};