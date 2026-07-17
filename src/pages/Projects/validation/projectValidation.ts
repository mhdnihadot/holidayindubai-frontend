import * as Yup from 'yup';

export const projectInitialValues = {
  title: '',
  subtitle: '',
  description: '',
  status: 'active' as 'active' | 'inactive' | 'completed',
};

export const projectValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Project title must be at least 3 characters')
    .max(100, 'Project title cannot exceed 100 characters')
    .required('Project title is required'),
  subtitle: Yup.string().nullable(),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  status: Yup.string()
    .oneOf(['active', 'inactive', 'completed'])
    .required('Status is required'),
  location: Yup.string().nullable(),
  googleMapUrl: Yup.string().nullable(),
  emirate: Yup.string().nullable(),
  category: Yup.string().nullable(),
  duration: Yup.string().nullable(),
  bestTime: Yup.string().nullable(),
  bestSeason: Yup.string().nullable(),
  outdoor: Yup.boolean().nullable(),
  highlights: Yup.array().of(
    Yup.object().shape({
      icon: Yup.string().nullable(),
      text: Yup.string().nullable(),
    })
  ).nullable(),
  idealFor: Yup.array().of(
    Yup.object().shape({
      icon: Yup.string().nullable(),
      text: Yup.string().nullable(),
    })
  ).nullable(),
  distanceFromCity: Yup.string().nullable(),
  nearbyLandmarks: Yup.array().of(Yup.string()).nullable(),
  dressCode: Yup.object().shape({
    recommended: Yup.string().nullable(),
    avoid: Yup.string().nullable(),
  }).nullable(),
  safetyAndComfort: Yup.array().of(
    Yup.object().shape({
      icon: Yup.string().nullable(),
      title: Yup.string().nullable(),
      description: Yup.string().nullable(),
    })
  ).nullable(),
  accessibility: Yup.array().of(
    Yup.object().shape({
      icon: Yup.string().nullable(),
      title: Yup.string().nullable(),
      description: Yup.string().nullable(),
    })
  ).nullable(),
  experienceSteps: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().nullable(),
      content: Yup.string().nullable(),
    })
  ).nullable(),
  images: Yup.array().of(Yup.string()),
});
