/**
 * RJSF-Powered Configuration Form
 * 
 * New form implementation using React JSON Schema Form
 * Part of Task 018: Form Component Integration
 */

import React, { useState, useEffect, useCallback } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import type { IChangeEvent } from '@rjsf/core';

import { saveConfigData } from '@/utils/storage';
import type { ConfigData } from '@/types';

// Import RJSF components and utilities
import widgets from '@/form/widgets';
import SimpleFieldTemplate from '@/form/SimpleFieldTemplate';
import SimpleObjectFieldTemplate from '@/form/SimpleObjectFieldTemplate';
import SimpleArrayFieldTemplate from '@/form/SimpleArrayFieldTemplate';
import { rjsfToConfigData, configDataToRjsf, validateDataCompatibility } from '@/form/data-transformers';

// Import schemas
import configSchema from '@/schemas/config-schema.json';
import uiSchema from '@/schemas/ui-schema.json';

interface ConfigFormRJSFProps {
  data: ConfigData;
  onDataChange: (data: ConfigData) => void;
  className?: string;
}

export function ConfigFormRJSF({ data, onDataChange, className }: ConfigFormRJSFProps) {
  // Convert flat ConfigData to nested RJSF format
  const [formData, setFormData] = useState(() => {
    try {
      return configDataToRjsf(data, configSchema);
    } catch (error) {
      console.error('Error converting ConfigData to RJSF format:', error);
      return {};
    }
  });
  
  // Track if form has been initialized
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize form data when data prop changes
  useEffect(() => {
    if (!isInitialized) {
      const rjsfData = configDataToRjsf(data, configSchema);
      setFormData(rjsfData);
      setIsInitialized(true);
    }
  }, [data, isInitialized]);
  
  // Handle form data changes
  const handleChange = useCallback((changeEvent: IChangeEvent<any>) => {
    const newFormData = changeEvent.formData;
    setFormData(newFormData);
    
    // Convert RJSF format back to flat ConfigData format
    try {
      const flatData = rjsfToConfigData(newFormData);
      
      // Validate data compatibility
      if (validateDataCompatibility(newFormData, data)) {
        onDataChange(flatData);
        saveConfigData(flatData);
      } else {
        console.warn('Form data compatibility check failed');
      }
    } catch (error) {
      console.error('Error converting RJSF data to ConfigData:', error);
    }
  }, [data, onDataChange]);
  
  // Handle form submission (mainly for validation)
  const handleSubmit = useCallback((submitEvent: IChangeEvent<any>) => {
    console.log('Form submitted with data:', submitEvent.formData);
    // The form data has already been processed by handleChange
  }, []);
  
  // Handle form errors
  const handleError = useCallback((errors: any) => {
    console.error('Form validation errors:', errors);
  }, []);
  
  // Custom form context for advanced features
  const formContext = {
    // Add any custom context data needed by templates or widgets
    readOnly: false,
    showAdvanced: true,
  };
  
  return (
    <div className={className}>
      <Form
        schema={configSchema}
        uiSchema={uiSchema}
        formData={formData}
        formContext={formContext}
        widgets={widgets}
        templates={{
          FieldTemplate: SimpleFieldTemplate,
          ObjectFieldTemplate: SimpleObjectFieldTemplate,
          ArrayFieldTemplate: SimpleArrayFieldTemplate,
        }}
        validator={validator}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onError={handleError}
        showErrorList={false} // We handle errors through field templates
        liveValidate={false} // Avoid excessive validation during typing
        noHtml5Validate={true} // Use JSON Schema validation instead
        autoComplete="off"
      >
        {/* Hide the default submit button - we handle submission through onChange */}
        <div style={{ display: 'none' }}>
          <button type="submit">Hidden Submit</button>
        </div>
      </Form>
    </div>
  );
}

export default ConfigFormRJSF;