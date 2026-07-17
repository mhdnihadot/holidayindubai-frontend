import React from 'react';
import { useAddProjectHandler } from './hooks/useAddProjectHandler';


import { PageHeader } from '@/components/ui/PageHeader';
import { TopActionBar } from '@/components/ui/TopActionBar';
import { DynamicForm } from '@/components/DynamicForm/DynamicForm';
import { projectFormSchema } from './validation/projectFormSchema';

const AddProject: React.FC = () => {
  const { formik, isLoading, handleDiscard, handleSave } = useAddProjectHandler();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <PageHeader
          title="Add New Project"
          description="Fill in the details to create a new project in the system."
        />
        <TopActionBar
          hasChanges={formik.dirty}
          onDiscard={handleDiscard}
          hideUnsavedWarning
          onSave={handleSave}
          saveLabel={isLoading ? 'Creating...' : 'Create Project'}
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

export default AddProject;
