import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { projectValidationSchema } from '../validation/projectValidation';
import { updateProjectThunk } from '@/store/thunks/project.thunks';
import { projectService } from '@/services/project.service';

export const useEditProjectHandler = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();

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
      highlights: [] as { icon: string; text: string }[],
      idealFor: [] as { icon: string; text: string }[],
      distanceFromCity: '',
      nearbyLandmarks: [] as string[],
      dressCode: { recommended: '', avoid: '' },
      safetyAndComfort: [] as { icon: string; title: string; description: string }[],
      accessibility: [] as { icon: string; title: string; description: string }[],
      experienceSteps: [] as { title: string; content: string }[],
      platformUrl: '',
      status: 'active' as 'active' | 'inactive' | 'completed',
      images: [] as string[],
    },
    validationSchema: projectValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!id) return;
      setIsLoading(true);
      try {
        await dispatch(updateProjectThunk({ id, data: values })).unwrap();
        toast.success('Project updated successfully!');
        navigate('/dashboard/projects');
      } catch (error: any) {
        toast.error(error || 'Failed to update project. Please try again.');
        console.error('Project update failed:', error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      setIsFetching(true);
      try {
        const response = await projectService.getById(id);
        const project = response.data || response;
        if (project) {
          formik.setValues({
            title: project.title || '',
            subtitle: project.subtitle || '',
            description: project.description || '',
            location: project.location || '',
            googleMapUrl: project.googleMapUrl || '',
            emirate: project.emirate || '',
            category: project.category || '',
            duration: project.duration || '',
            bestTime: project.bestTime || '',
            bestSeason: project.bestSeason || '',
            outdoor: project.outdoor || false,
            highlights: project.highlights || [],
            idealFor: project.idealFor || [],
            distanceFromCity: project.distanceFromCity || '',
            nearbyLandmarks: project.nearbyLandmarks || [],
            dressCode: project.dressCode || { recommended: '', avoid: '' },
            safetyAndComfort: project.safetyAndComfort || [],
            accessibility: project.accessibility || [],
            experienceSteps: project.experienceSteps || [],
            platformUrl: project.platformUrl || '',
            status: project.status || 'active',
            images: project.images || [],
          });
        }
      } catch (error) {
        toast.error('Failed to load project details.');
        navigate('/dashboard/projects');
      } finally {
        setIsFetching(false);
      }
    };
    fetchProject();
  }, [id, navigate]);

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
    isFetching,
    handleDiscard,
    handleSave,
  };
};
