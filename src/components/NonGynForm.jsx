
import React, { useRef } from 'react';
import toast from 'react-hot-toast';
import './StainQCForm.css';

// Custom hooks
import { useNonGynData } from '../hooks/useNonGynData';
import { useNonGynSubmission } from '../hooks/useNonGynSubmission';

// Components
import NonGynCasesTable from './nongyn/NonGynCasesTable';
import ScreeningPendingTable from './nongyn/ScreeningPendingTable';
import NonGynWorkloadTable from './nongyn/NonGynWorkloadTable';

export default function NonGynForm() {
  
  // Load non-gyn data and submission data
  const { 
    submissions, 
    pendingSubmissions, 
    completedSubmissions, 
    sortConfig,
    fetchSubmissions, 
    handleSort,
    handleDeleteAll
  } = useNonGynData();

  // Form submission and validation logic
  const { 
    formData, 
    isDeleting,
    pendingUpdates,
    handleChange, 
    handlePendingChange,
    handleDeleteSubmission, 
    handlePendingSubmit,
    getSubmissionValue,
    resetFormData,
    handleSubmit
  } = useNonGynSubmission(fetchSubmissions);

  return (
    <div className="stain-qc-container">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">Non-Gyn Workload</h1>
      
      <div className="form-section">
        <NonGynCasesTable
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>

      <ScreeningPendingTable
        pendingSubmissions={pendingSubmissions}
        pendingUpdates={pendingUpdates}
        handlePendingChange={handlePendingChange}
        handlePendingSubmit={handlePendingSubmit}
        handleDeleteSubmission={handleDeleteSubmission}
        isDeleting={isDeleting}
        getSubmissionValue={getSubmissionValue}
      />

      <NonGynWorkloadTable
        completedSubmissions={completedSubmissions}
        sortConfig={sortConfig}
        handleSort={handleSort}
        handleDeleteAll={handleDeleteAll}
      />
    </div>
  );
}
