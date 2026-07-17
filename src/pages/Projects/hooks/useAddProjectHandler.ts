import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { projectValidationSchema } from '../validation/projectValidation';
import { createProjectThunk } from '@/store/thunks/project.thunks';

export const useAddProjectHandler = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      title: '',
      subtitle: '',
      description: '',
      location: '',
      googleMapUrl: '',
      emirate: '',
      category: '',
      duration: '',
      bestTime: '',
      bestSeason: '',
      outdoor: false,
      highlights: [],
      idealFor: [],
      distanceFromCity: '',
      nearbyLandmarks: [],
      dressCode: { recommended: '', avoid: '' },
      safetyAndComfort: [],
      accessibility: [],
      experienceSteps: [],
      status: 'active' as 'active' | 'inactive' | 'completed',
      images: [],
    },
    validationSchema: projectValidationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await dispatch(createProjectThunk(values)).unwrap();
        toast.success('Project created successfully!');
        navigate('/dashboard/projects');
      } catch (error: any) {
        toast.error(error || 'Failed to create project. Please try again.');
        console.error('Project creation failed:', error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleDiscard = () => {
    formik.resetForm();
    navigate('/dashboard/projects');
  };

  const handleSave = () => {
    formik.handleSubmit();
  };

  return {
    formik,
    isLoading,
    handleDiscard,
    handleSave,
  };
};
