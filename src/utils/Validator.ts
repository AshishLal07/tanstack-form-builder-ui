import type {FormField} from '../types';
import {FIELD_ENUMS} from './Enum'

export const validateField = (value: any, field: FormField): string | undefined => {
  if (field.required && (value === undefined || (Array.isArray(value) && value.length === 0))) {
    return `${field.label} is required`;
  }
  
  if (!value) return undefined;
  
  const { validation } = field;
  if (!validation) return undefined;
  
  if (field.type === FIELD_ENUMS.text || field.type === FIELD_ENUMS.textarea || field.type === FIELD_ENUMS.email) {
    const strValue = String(value);
    if (validation.min && strValue.length < validation.min) {
      return `Minimum ${validation.min} characters required`;
    }
    if (validation.max && strValue.length > validation.max) {
      return `Maximum ${validation.max} characters allowed`;
    }
    if (validation.regex && !new RegExp(validation.regex).test(strValue)) {
      return `Invalid format`;
    }
  }
  
  if (field.type ===  FIELD_ENUMS.number) {
    const numValue = Number(value);
    if (validation.min && validation.min !== undefined && numValue < validation.min) {
      return `Minimum value is ${validation.min}`;
    }
    if (validation.max && validation.max !== undefined && numValue > validation.max) {
      return `Maximum value is ${validation.max}`;
    }
  }
  
  if (field.type === FIELD_ENUMS.date && validation.minDate) {
    const dateValue = new Date(value);
    const minDate = new Date(validation.minDate);
    if (dateValue < minDate) {
      return `Date must be after ${validation.minDate}`;
    }
  }
  
  if (field.type === FIELD_ENUMS.radio && Array.isArray(value)) {
    if (validation.minSelected && value.length < validation.minSelected) {
      return `Select at least ${validation.minSelected} options`;
    }
    if (validation.maxSelected && value.length > validation.maxSelected) {
      return `Select at most ${validation.maxSelected} options`;
    }
  }
  
  return undefined;
};
