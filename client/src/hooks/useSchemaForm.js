import { useState, useCallback, useMemo } from 'react';

export function useSchemaForm(schema) {
  // Normalize schema to array
  const schemaArray = useMemo(() => {
    if (!schema) return [];
    if (Array.isArray(schema)) return schema;
    const schemaMap = schema.properties || schema;
    return Object.entries(schemaMap).map(([key, val]) => ({ id: key, ...val }));
  }, [schema]);

  const [values, setValues] = useState(() => {
    const initial = {};
    schemaArray.forEach(field => {
      initial[field.id] = field.default !== undefined ? field.default : '';
    });
    return initial;
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const reset = useCallback((newSchema) => {
    let newSchemaArray = [];
    if (newSchema) {
      if (Array.isArray(newSchema)) newSchemaArray = newSchema;
      else {
        const schemaMap = newSchema.properties || newSchema;
        newSchemaArray = Object.entries(schemaMap).map(([key, val]) => ({ id: key, ...val }));
      }
    }
    const initial = {};
    newSchemaArray.forEach(field => {
      initial[field.id] = field.default !== undefined ? field.default : '';
    });
    setValues(initial);
    setErrors({});
    setTouched({});
  }, []);

  const setValue = useCallback((id, value) => {
    setValues(prev => ({ ...prev, [id]: value }));
    setTouched(prev => ({ ...prev, [id]: true }));
    // Clear error on change
    setErrors(prev => {
      if (prev[id]) {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const validate = useCallback(() => {
    if (schemaArray.length === 0) return true;
    const newErrors = {};
    let isValid = true;

    schemaArray.forEach(field => {
      const value = values[field.id];
      if (field.required && (value === undefined || value === null || value === '')) {
        newErrors[field.id] = 'This field is required';
        isValid = false;
      }
    });

    setErrors(newErrors);
    
    // Mark all as touched if validating for submit
    const allTouched = {};
    schemaArray.forEach(field => allTouched[field.id] = true);
    setTouched(allTouched);

    return isValid;
  }, [schemaArray, values]);

  const validateField = useCallback((id) => {
    const field = schemaArray.find(f => f.id === id);
    if (!field) return;

    const value = values[id];
    let error = null;

    if (field.required && (value === undefined || value === null || value === '')) {
      error = 'This field is required';
    }

    setErrors(prev => ({
      ...prev,
      [id]: error,
    }));
  }, [schemaArray, values]);

  return {
    values,
    errors,
    touched,
    setValue,
    validate,
    validateField,
    setTouched: (id) => setTouched(prev => ({ ...prev, [id]: true })),
    reset
  };
}
