import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { adValidationSchema, adInitialValues } from '../validation/adValidation';
import { adminAdService } from '@/services/admin.ad.service';
import { adminProjectService } from '@/services/admin.project.service';

export const useEditAdHandler = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [projectOptions, setProjectOptions] = useState<{ label: string; value: string }[]>([
    { label: 'None (No connected project)', value: '' }
  ]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await adminProjectService.getAll();
        const projects = response.data || response;
        if (Array.isArray(projects)) {
          const opts = projects.map((p: any) => ({
            label: p.title || `Project #${p.id || p._id}`,
            value: (p.id || p._id).toString(),
          }));
          setProjectOptions([{ label: 'None (No connected project)', value: '' }, ...opts]);
        }
      } catch (err) {
        console.error('Failed to load projects list:', err);
      }
    };
    loadProjects();
  }, []);

  const [initialFormValues, setInitialFormValues] = useState(adInitialValues);

  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: adValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!values.websiteImage && !values.mobileImage) {
        toast.error('Please upload at least one banner image (for Desktop Website or Mobile App)');
        return;
      }
      if (!id) return;
      setIsLoading(true);
      try {
        const payload = {
          ...values,
          project: values.project === '' ? null : values.project,
        };
        await adminAdService.update(id, payload as any);
        toast.success('Advertisement updated successfully!');
        navigate('/dashboard/ads');
      } catch (error: any) {
        const message = error?.response?.data?.message || 'Failed to update ad. Please try again.';
        toast.error(message);
        console.error('Ad update failed:', error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchAd = async () => {
      if (!id) return;
      setIsFetching(true);
      try {
        const response = await adminAdService.getById(id);
        const ad = response.data || response;
        if (ad) {
          let projectId = '';
          if (ad.project) {
            projectId = (ad.project.id || ad.project._id || ad.project).toString();
          }
          const loadedValues = {
            title: ad.title || '',
            websiteImage: ad.websiteImage || '',
            mobileImage: ad.mobileImage || '',
            project: projectId,
            order: ad.order ?? 1,
            status: ad.status || 'active',
          };
          setInitialFormValues(loadedValues);
          formik.setValues(loadedValues);
        }
      } catch (error) {
        toast.error('Failed to load advertisement details.');
        console.error(error);
        navigate('/dashboard/ads');
      } finally {
        setIsFetching(false);
      }
    };

    fetchAd();
  }, [id]);

  const handleDiscard = () => {
    navigate('/dashboard/ads');
  };

  const handleSave = () => {
    formik.handleSubmit();
  };

  return {
    formik,
    isLoading,
    isFetching,
    projectOptions,
    handleDiscard,
    handleSave,
  };
};
