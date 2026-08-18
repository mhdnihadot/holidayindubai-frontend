import React, { useMemo } from 'react';
import { useAddAdHandler } from './hooks/useAddAdHandler';
import { PageHeader } from '@/components/ui/PageHeader';
import { TopActionBar } from '@/components/ui/TopActionBar';
import { DynamicForm } from '@/components/DynamicForm/DynamicForm';
import { getAdFormSchema } from './validation/adFormSchema';

const AddAd: React.FC = () => {
  const { formik, isLoading, projectOptions, handleDiscard, handleSave } = useAddAdHandler();

  const schema = useMemo(() => getAdFormSchema(projectOptions, formik.values), [projectOptions, formik.values]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <PageHeader
          title="Add New Advertisement"
          description="Upload website & mobile banners and select connected project destination."
        />
        <TopActionBar
          hasChanges={formik.dirty}
          onDiscard={handleDiscard}
          hideUnsavedWarning
          onSave={handleSave}
          saveLabel={isLoading ? 'Creating...' : 'Create Advertisement'}
        />
      </div>

      <div className="max-w-2xl">
        <DynamicForm
          schema={schema}
          values={formik.values}
          onChange={formik.setFieldValue}
          onBlur={formik.setFieldTouched}
          errors={formik.errors as Record<string, string>}
          touched={formik.touched as Record<string, boolean>}
        />
      </div>
    </div>
  );
};

export default AddAd;
