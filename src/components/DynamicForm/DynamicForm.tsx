import React from 'react';
import { FormField } from './FormField';
import type { FormSchema, FormFieldConfig } from './types';
import { isFormSectionConfigArray } from './types';

interface DynamicFormProps {
  schema: FormSchema;
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onBlur?: (name: string) => void;
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ schema, values, onChange, onBlur, errors = {}, touched = {} }) => {

  const handleFieldChange = (name: string) => (value: any) => {
    onChange(name, value);
  };

  const handleFieldBlur = (name: string) => () => {
    if (onBlur) onBlur(name);
  };

  const renderFields = (fields: FormFieldConfig[]) => {
    return fields.map((field) => (
      <FormField
        key={field.name}
        field={field}
        value={values[field.name] !== undefined ? values[field.name] : field.defaultValue}
        onChange={handleFieldChange(field.name)}
        onBlur={handleFieldBlur(field.name)}
        error={touched[field.name] ? errors[field.name] : undefined}
      />
    ));
  };

  if (schema.length === 0) return null;

  // Handle Grouped / Sectioned Form
  if (isFormSectionConfigArray(schema)) {
    return (
      <>
        {schema.map((section, idx) => (
          <div
            key={idx}
            className={`bg-white dark:bg-[#1e293b] rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-border-subtle dark:border-gray-800 p-6 -full ${section.className?.section || ''}`}
          >
            {section.title && (
              <h2 className={`text-lg font-bold text-gray-900 dark:text-white mb-2 ${section.className?.title || ''}`}>
                {section.title}
              </h2>
            )}

            {section.description && (
              <p className={`text-xs text-gray-500 dark:text-gray-400 mb-6 ${section.className?.description || ''}`}>
                {section.description}
              </p>
            )}

            {/* If there's no description but there's a title, we need margin bottom */}
            {section.title && !section.description && <div className="mb-6" />}

            <div className="w-full">
              {renderFields(section.fields)}
            </div>
          </div>
        ))}
      </>
    );
  }

  // Handle Flat Form
  return (
    <>
      {renderFields(schema as FormFieldConfig[])}
    </>
  );
};
