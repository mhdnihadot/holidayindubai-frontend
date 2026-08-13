import type { FormSchema } from '@/components/DynamicForm/types';
import { DynamicIconList } from '@/components/DynamicForm/DynamicIconList';
import { DynamicStepsList } from '@/components/DynamicForm/DynamicStepsList';
import { GoogleMapPreviewInput } from '@/components/DynamicForm/GoogleMapPreviewInput';
import { CategoryAutocompleteInput } from '@/components/DynamicForm/CategoryAutocompleteInput';

export const projectFormSchema: FormSchema = [
  {
    title: 'Project Details',
    description: 'Basic information about the project.',
    fields: [
      {
        name: 'title',
        label: 'Project Title',
        type: 'text',
        placeholder: 'Enter project title',
      },
      {
        name: 'subtitle',
        label: 'Project Subtitle',
        type: 'text',
        placeholder: 'Enter project subtitle',
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Enter project description',
        extraProps: { rows: 4 },
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Completed', value: 'completed' },
        ],
      },
      {
        name: 'images',
        label: 'Project Images',
        type: 'multi-image',
      },
    ],
  },
  {
    title: 'Project Specifics',
    description: 'Specific details about location and timing.',
    fields: [
      {
        name: 'location',
        label: 'Location',
        type: 'text',
        placeholder: 'E.g., Dubai Marina',
      },
      {
        name: 'googleMapUrl',
        label: 'Google Map Embedded URL',
        type: 'custom',
        customRender: ({ value, onChange }) => (
          <GoogleMapPreviewInput 
            value={value} 
            onChange={onChange} 
            placeholder="Paste Google Maps embedded URL or iframe here" 
          />
        ),
      },
      {
        name: 'platformUrl',
        label: 'Platform URL',
        type: 'text',
        placeholder: 'E.g., https://booking.com/...',
      },
      {
        name: 'whatsappNumber',
        label: 'WhatsApp Number',
        type: 'text',
        placeholder: 'E.g., +971501234567',
      },
      {
        name: 'distanceFromCity',
        label: 'Distance from City',
        type: 'text',
        placeholder: 'E.g., 5Km from Dubai',
      },
      {
        name: 'nearbyLandmarks',
        label: 'Nearby Landmarks',
        type: 'dynamic-list',
        placeholder: 'E.g., JBR, Bluewaters Island',
      },
      {
        name: 'emirate',
        label: 'Emirate',
        type: 'select',
        options: [
          { label: 'Dubai', value: 'Dubai' },
          { label: 'Abu Dhabi', value: 'Abu Dhabi' },
          { label: 'Sharjah', value: 'Sharjah' },
          { label: 'Ajman', value: 'Ajman' },
          { label: 'Umm Al Quwain', value: 'Umm Al Quwain' },
          { label: 'Ras Al Khaimah', value: 'Ras Al Khaimah' },
          { label: 'Fujairah', value: 'Fujairah' },
        ],
      },
      {
        name: 'category',
        label: 'Category',
        type: 'custom',
        customRender: ({ value, onChange }) => (
          <CategoryAutocompleteInput value={value} onChange={onChange} />
        ),
      },
      {
        name: 'duration',
        label: 'Duration',
        type: 'text',
        placeholder: 'E.g., 4hrs',
      },
      {
        name: 'bestTime',
        label: 'Best time of the day',
        type: 'text',
        placeholder: 'E.g., Night',
      },
      {
        name: 'bestSeason',
        label: 'Best season',
        type: 'text',
        placeholder: 'E.g., Year Around',
      },
      {
        name: 'outdoor',
        label: 'Is it outdoor?',
        type: 'select',
        options: [
          { label: 'Yes (Outdoor)', value: 'true' },
          { label: 'No (Indoor)', value: 'false' },
        ],
      },
    ],
  },
  {
    title: 'Highlights & Amenities',
    description: 'Add dynamic icons and text for features.',
    fields: [
      {
        name: 'highlights',
        label: 'Highlights',
        type: 'custom',
        customRender: ({ value, onChange }) => (
          <DynamicIconList value={value} onChange={onChange} label="Highlight" placeholder="E.g., Marina skyline at night" />
        ),
      },
      {
        name: 'idealFor',
        label: 'Ideal For',
        type: 'custom',
        customRender: ({ value, onChange }) => (
          <DynamicIconList value={value} onChange={onChange} label="Audience" placeholder="E.g., Couples, Families" />
        ),
      },
    ],
  },
  {
    title: 'Experience Steps',
    description: 'Add a step-by-step timeline of what the user will experience.',
    fields: [
      {
        name: 'experienceSteps',
        label: 'Experience Steps',
        type: 'custom',
        customRender: ({ value, onChange }) => (
          <DynamicStepsList value={value} onChange={onChange} label="Step" />
        ),
      },
    ],
  },
  {
    title: 'Additional Details',
    description: 'Provide info on dress code, safety, and accessibility.',
    fields: [
      {
        name: 'dressCode.recommended',
        label: 'Dress Code (Recommended)',
        type: 'text',
        placeholder: 'E.g., Smart casual',
      },
      {
        name: 'dressCode.avoid',
        label: 'Dress Code (Avoid)',
        type: 'text',
        placeholder: 'E.g., Loose Scarves etc',
      },
      {
        name: 'safetyAndComfort',
        label: 'Safety & Comfort',
        type: 'custom',
        customRender: ({ value, onChange }) => (
          <DynamicIconList value={value} onChange={onChange} label="Safety/Comfort" placeholder="E.g., Walking level - Low" hasDescription />
        ),
      },
      {
        name: 'accessibility',
        label: 'Accessibility',
        type: 'custom',
        customRender: ({ value, onChange }) => (
          <DynamicIconList value={value} onChange={onChange} label="Accessibility" placeholder="E.g., Wheelchair friendly" hasDescription />
        ),
      },
    ],
  },
];
