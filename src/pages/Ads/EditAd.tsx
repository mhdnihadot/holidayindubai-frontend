import React, { useMemo } from 'react';
import { useEditAdHandler } from './hooks/useEditAdHandler';
import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { TopActionBar } from '@/components/ui/TopActionBar';
import { DynamicForm } from '@/components/DynamicForm/DynamicForm';
import { getAdFormSchema } from './validation/adFormSchema';

const EditAd: React.FC = () => {
  const { formik, isLoading, isFetching, projectOptions, handleDiscard, handleSave } = useEditAdHandler();

  const schema = useMemo(() => getAdFormSchema(projectOptions), [projectOptions]);

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <PageHeader
          title="Edit Advertisement"
          description="Update website & mobile banner images and connected project."
        />
        <TopActionBar
          hasChanges={formik.dirty}
          onDiscard={handleDiscard}
          onSave={handleSave}
          saveLabel={isLoading ? 'Updating...' : 'Update Advertisement'}
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

export default EditAd;
