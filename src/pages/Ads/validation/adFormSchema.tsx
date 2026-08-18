import type { FormSchema } from '@/components/DynamicForm/types';

export const getAdFormSchema = (projectOptions: { label: string; value: string }[] = [], values?: any): FormSchema => [
  {
    title: 'Advertisement Banner Images',
    description: 'Pick and upload promotional banner images for Desktop Website and/or Mobile App. You may choose to provide either one or both depending on your targeted platforms.',
    fields: [
      {
        name: 'title',
        label: 'Ad Title / Internal Name',
        type: 'text',
        placeholder: 'Enter advertisement title (e.g., Summer Yacht Deal)',
      },
      {
        name: 'websiteImage',
        label: 'Website Banner Image (Desktop Sidebar Portrait)',
        description: 'Upload tall vertical portrait banner image for desktop website display (368x600 ratio).',
        type: 'single-image',
        aspectRatio: 368 / 600,
        cropWidth: 368,
        cropHeight: 600,
        previewWidth: 368,
        previewHeight: 600,
      },
      {
        name: 'mobileImage',
        label: 'Mobile Banner Image (Mobile App & Screen Strip)',
        description: 'Upload wide horizontal strip banner image for mobile screens (600x190 ratio).',
        type: 'single-image',
        aspectRatio: 600 / 190,
        cropWidth: 600,
        cropHeight: 190,
        previewWidth: 600,
        previewHeight: 190,
      },
    ],
  },
  {
    title: 'Connected Project & Settings',
    description: 'Link this advertisement to a specific project so users are immediately redirected when they tap or click the banner. Alternatively, you can provide an external URL to redirect them instead.',
    fields: [
      {
        name: 'project',
        label: 'Select Connected Project (Optional)',
        type: 'select',
        disabled: !!values?.url,
        options: projectOptions.length > 0 ? projectOptions : [{ label: 'Select a connected project (or None)', value: '' }],
      },
      {
        name: 'url',
        label: 'External Redirect URL (Optional)',
        type: 'text',
        disabled: !!values?.project,
        placeholder: 'e.g., https://example.com (used if no project is selected)',
      },
      {
        name: 'order',
        label: 'Display Order / Priority',
        type: 'number',
        placeholder: '1',
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ],
      },
    ],
  },
];
