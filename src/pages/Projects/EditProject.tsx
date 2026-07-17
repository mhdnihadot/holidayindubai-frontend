import React from 'react';
import { useEditProjectHandler } from './hooks/useEditProjectHandler';

import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { TopActionBar } from '@/components/ui/TopActionBar';
import { DynamicForm } from '@/components/DynamicForm/DynamicForm';
import { projectFormSchema } from './validation/projectFormSchema';

const EditProject: React.FC = () => {
  const { formik, isLoading, isFetching, handleDiscard, handleSave } = useEditProjectHandler();

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
          title="Edit Project"
          description="Update the details of the project."
        />
        <TopActionBar
          hasChanges={formik.dirty}
          onDiscard={handleDiscard}
          onSave={handleSave}
          saveLabel={isLoading ? 'Updating...' : 'Update Project'}
        />
      </div>

      <div className="max-w-2xl">
        <DynamicForm
          schema={projectFormSchema}
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

export default EditProject;
