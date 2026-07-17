import React from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TopActionBarProps {
  hasChanges: boolean;
  onDiscard: () => void;
  onSave: () => void;
  saveLabel?: string;
  discardLabel?: string;
  hideUnsavedWarning?: boolean;
}

export const TopActionBar: React.FC<TopActionBarProps> = ({
  hasChanges,
  onDiscard,
  onSave,
  saveLabel = 'Save',
  discardLabel = 'Discard',
  hideUnsavedWarning = false,
}) => {
  return (
    <div className="flex items-center justify-between transition-colors sticky top-0 z-10">
      <div className="flex items-center gap-2">
        {hasChanges && !hideUnsavedWarning && (
          <>
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-xs font-medium text-black dark:text-gray-300">Unsaved changes</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="secondary" className="px-6 py-4 text-xs font-medium bg-gray-100 hover:bg-gray-300" />}>
            {discardLabel}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to discard your changes? All form data and uploaded images will be permanently cleared.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDiscard} className="bg-red-600 text-white hover:bg-red-700">
                Discard
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          onClick={onSave}
          className="px-8 py-4 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {saveLabel}
        </Button>
      </div>
    </div>
  );
};
