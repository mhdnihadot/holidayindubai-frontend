import React from 'react';

export type FieldType = 
  | 'text' 
  | 'email' 
  | 'number' 
  | 'password' 
  | 'textarea' 
  | 'select'
  | 'multi-select'
  | 'multi-image'
  | 'single-image'
  | 'dynamic-list'
  | 'custom'
  | string;

export interface FormFieldConfig {
  name: string;
  label?: string;
  type?: FieldType;
  placeholder?: string;
  defaultValue?: any;
  disabled?: boolean;
  validation?: {
    required?: boolean | string;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    min?: number;
    max?: number;
  };
  className?: {
    container?: string;
    label?: string;
    input?: string;
  };
  options?: { label: string; value: string | number }[];
  extraProps?: any; // rows, cols, etc.
  customRender?: (props: {
    field: FormFieldConfig;
    value: any;
    onChange: (val: any) => void;
    error?: any;
  }) => React.ReactNode;
  
  description?: string; // Optional subtitle text below or next to the field
  /**
   * Optional crop aspect ratio for the 'single-image' field.
   * 
   * Common Aspect Ratios & Standard Output Resolutions:
   * - `16 / 9` : Widescreen (e.g. Banners, Hero images). Output suggestions: 1920x1080, 1200x675, 960x540
   * - `4 / 3` : Standard (e.g. Property Cards, Lists). Output suggestions: 1024x768, 800x600, 640x480
   * - `1` : Square (e.g. Logos, Avatars). Output suggestions: 800x800, 500x500, 200x200
   * - `3 / 2` : Classic DSLR photo (e.g. Gallery items). Output suggestions: 1080x720, 900x600
   * - `21 / 9` : Ultra-wide (e.g. Top section headers). Output suggestions: 2560x1080, 1920x820
   */
  aspectRatio?: number;
  /**
   * Target output width in pixels for the cropped image.
   * If both `cropWidth` and `cropHeight` are set, `aspectRatio` will be automatically calculated.
   */
  cropWidth?: number;
  /**
   * Target output height in pixels for the cropped image.
   * If both `cropWidth` and `cropHeight` are set, `aspectRatio` will be automatically calculated.
   */
  cropHeight?: number;
  /**
   * Custom CSS width for the visual preview/upload box (e.g., '300px', '100%', 200).
   * Restricts the horizontal layout size on the form.
   */
  previewWidth?: string | number;
  /**
   * Custom CSS height for the visual preview/upload box (e.g., '200px', 'auto').
   * Restricts the vertical layout size on the form.
   */
  previewHeight?: string | number;
}

export interface FormSectionConfig {
  title?: string;
  description?: string;
  fields: FormFieldConfig[];
  className?: {
    section?: string;
    title?: string;
    description?: string;
  };
}

export type FormSchema = FormFieldConfig[] | FormSectionConfig[];

export const isFormSectionConfigArray = (schema: FormSchema): schema is FormSectionConfig[] => {
  return schema.length > 0 && 'fields' in schema[0];
};
