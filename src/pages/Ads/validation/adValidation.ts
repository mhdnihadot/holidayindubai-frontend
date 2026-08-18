import * as Yup from 'yup';

export const adInitialValues = {
  title: '',
  websiteImage: '',
  mobileImage: '',
  project: '',
  url: '',
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
  url: Yup.string().url('Must be a valid URL').nullable(),
  order: Yup.number().nullable(),
  status: Yup.string().oneOf(['active', 'inactive']).required('Status is required'),
}).test(
  'project-or-url',
  'Cannot select both a connected project and an external URL at the same time',
  function (value) {
    const { project, url } = value;
    if (project && url) {
      return this.createError({
        path: 'url',
        message: 'Cannot provide an external URL when a connected project is selected',
      });
    }
    return true;
  }
);
