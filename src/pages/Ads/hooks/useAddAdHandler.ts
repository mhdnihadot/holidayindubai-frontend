import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { adValidationSchema, adInitialValues } from '../validation/adValidation';
import { adminAdService } from '@/services/admin.ad.service';
import { adminProjectService } from '@/services/admin.project.service';

export const useAddAdHandler = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [projectOptions, setProjectOptions] = useState<{ label: string; value: string }[]>([
    { label: 'None (No connected project)', value: '' }
  ]);
  const navigate = useNavigate();

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

  const formik = useFormik({
    initialValues: adInitialValues,
    validationSchema: adValidationSchema,
    onSubmit: async (values) => {
      if (!values.websiteImage && !values.mobileImage) {
        toast.error('Please upload at least one banner image (for Desktop Website or Mobile App)');
        return;
      }
      setIsLoading(true);
      try {
        const payload = {
          ...values,
          project: values.project === '' ? null : values.project,
        };
        await adminAdService.create(payload as any);
        toast.success('Advertisement created successfully!');
        navigate('/dashboard/ads');
      } catch (error: any) {
        const message = error?.response?.data?.message || 'Failed to create advertisement. Please try again.';
        toast.error(message);
        console.error('Ad creation failed:', error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleDiscard = () => {
    formik.resetForm();
    navigate('/dashboard/ads');
  };

  const handleSave = () => {
    formik.handleSubmit();
  };

  return {
    formik,
    isLoading,
    projectOptions,
    handleDiscard,
    handleSave,
  };
};
