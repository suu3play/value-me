import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import type { ValidationResult, ValidatorFunction } from '../utils/validation';

interface ValidatedInputProps {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  validator: ValidatorFunction;
  type?: 'integer' | 'float';
  step?: number;
  unit?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  sx?: object;
  showIncrementButtons?: boolean;
  multiStepButtons?: number[]; // 複数のステップボタン（例: [1000, 10000, 100000]）
  inlineMultiStepButtons?: boolean; // multiStepButtonsを入力欄内に表示
  helperText?: string;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  id,
  label,
  value,
  onChange,
  validator,
  type = 'integer',
  step = type === 'integer' ? 1000 : 0.5,
  unit = '',
  disabled = false,
  fullWidth = true,
  sx = {},
  showIncrementButtons = false,
  multiStepButtons,
  inlineMultiStepButtons = false,
  helperText,
}) => {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true
  });
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    
    if (inputValue === '') {
      onChange(0);
      setValidationResult({ isValid: true });
      return;
    }

    const numericValue = type === 'float' 
      ? parseFloat(inputValue) 
      : parseInt(inputValue, 10);

    if (!isNaN(numericValue)) {
      onChange(numericValue);
      
      // リアルタイムバリデーション（値が入力された場合のみ）
      if (inputValue !== '' && numericValue !== 0) {
        const result = validator(numericValue);
        setValidationResult(result);
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const numericValue = typeof value === 'string' ? 
      (type === 'float' ? parseFloat(value) : parseInt(value, 10)) : 
      value;
    
    if (!isNaN(numericValue)) {
      const result = validator(numericValue);
      setValidationResult(result);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setValidationResult({ isValid: true });
  };

  const handleIncrement = () => {
    const currentValue = typeof value === 'string' ? 
      (type === 'float' ? parseFloat(value) : parseInt(value, 10)) : 
      value;
    const newValue = isNaN(currentValue) ? step : currentValue + step;
    onChange(newValue);
    
    const result = validator(newValue);
    setValidationResult(result);
  };

  const handleDecrement = () => {
    const currentValue = typeof value === 'string' ? 
      (type === 'float' ? parseFloat(value) : parseInt(value, 10)) : 
      value;
    const newValue = Math.max(0, isNaN(currentValue) ? 0 : currentValue - step);
    onChange(newValue);
    
    const result = validator(newValue);
    setValidationResult(result);
  };

  const hasError = !validationResult.isValid;
  const showHelperText = hasError || (isFocused && helperText);

  const handleMultiStepIncrement = (stepValue: number) => {
    const currentValue = typeof value === 'string' ?
      (type === 'float' ? parseFloat(value) : parseInt(value, 10)) :
      value;
    const newValue = isNaN(currentValue) ? stepValue : currentValue + stepValue;
    onChange(newValue);

    const result = validator(newValue);
    setValidationResult(result);
  };

  const handleMultiStepDecrement = (stepValue: number) => {
    const currentValue = typeof value === 'string' ?
      (type === 'float' ? parseFloat(value) : parseInt(value, 10)) :
      value;
    const newValue = Math.max(0, isNaN(currentValue) ? 0 : currentValue - stepValue);
    onChange(newValue);

    const result = validator(newValue);
    setValidationResult(result);
  };

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <FormControl
        fullWidth={fullWidth}
        variant="outlined"
        error={hasError}
        sx={sx}
      >
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <OutlinedInput
          id={id}
          type="number"
          value={value || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          sx={{
            '& input[type=number]': {
              MozAppearance: 'textfield',
            },
            '& input[type=number]::-webkit-outer-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
            '& input[type=number]::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
          }}
          endAdornment={
            <InputAdornment position="end">
              {inlineMultiStepButtons && multiStepButtons && !disabled && (
                <Box sx={{ display: 'flex', gap: 0.5, mr: unit ? 1 : 0 }}>
                  {multiStepButtons.map((stepValue) => (
                    <Box key={stepValue} sx={{ display: 'flex', gap: 0.3 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleMultiStepDecrement(stepValue)}
                        sx={{
                          p: 0.3,
                          minWidth: 'auto',
                          fontSize: '0.7rem',
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 0.5
                        }}
                      >
                        <KeyboardArrowDown sx={{ fontSize: '0.9rem' }} />
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', ml: 0.2 }}>
                          {stepValue >= 1000 ? `${stepValue / 1000}k` : stepValue}
                        </Typography>
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleMultiStepIncrement(stepValue)}
                        sx={{
                          p: 0.3,
                          minWidth: 'auto',
                          fontSize: '0.7rem',
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 0.5
                        }}
                      >
                        <KeyboardArrowUp sx={{ fontSize: '0.9rem' }} />
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', ml: 0.2 }}>
                          {stepValue >= 1000 ? `${stepValue / 1000}k` : stepValue}
                        </Typography>
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
              {showIncrementButtons && !disabled && !inlineMultiStepButtons && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    mr: unit ? 1 : 0,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={handleIncrement}
                    sx={{ p: 0.2, height: 20 }}
                  >
                    <KeyboardArrowUp fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleDecrement}
                    sx={{ p: 0.2, height: 20 }}
                  >
                    <KeyboardArrowDown fontSize="small" />
                  </IconButton>
                </Box>
              )}
              {unit && unit}
            </InputAdornment>
          }
          label={label}
          inputProps={{
            min: 0,
            step: type === 'float' ? 0.1 : 1,
          }}
        />
        {showHelperText && (
          <FormHelperText>
            {hasError
              ? validationResult.errorMessage
              : (isFocused && helperText ? helperText : '')
            }
          </FormHelperText>
        )}
      </FormControl>
      {multiStepButtons && !disabled && !inlineMultiStepButtons && (
        <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
          {multiStepButtons.map((stepValue) => (
            <Box key={stepValue} sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => handleMultiStepDecrement(stepValue)}
                sx={{
                  p: 0.5,
                  fontSize: '0.75rem',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1
                }}
              >
                <KeyboardArrowDown fontSize="small" />
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  {stepValue.toLocaleString()}
                </Typography>
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleMultiStepIncrement(stepValue)}
                sx={{
                  p: 0.5,
                  fontSize: '0.75rem',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1
                }}
              >
                <KeyboardArrowUp fontSize="small" />
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  {stepValue.toLocaleString()}
                </Typography>
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ValidatedInput;