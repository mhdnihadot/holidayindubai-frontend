import * as Yup from 'yup';

export const adInitialValues = {
  title: '',
  websiteImage: '',
  mobileImage: '',
  project: '',
  order: 1,
  status: 'active' as 'active' | 'inactive',
};

export const adValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .required('Title is required'),
  websiteImage: Yup.string().nullable(),
  mobileImage: Yup.string().nullable(),
  project: Yup.string().nullable(),
  order: Yup.number().nullable(),
  status: Yup.string().oneOf(['active', 'inactive']).required('Status is required'),
});
