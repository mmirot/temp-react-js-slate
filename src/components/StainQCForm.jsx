
import React, { useRef } from 'react';
import toast from 'react-hot-toast';
import './StainQCForm.css';

// Custom hooks
import { useStainData } from '../hooks/useStainData';
import { useStainSubmission } from '../hooks/useStainSubmission';
import { useStainSelection } from '../hooks/useStainSelection';

// Components
import StainQCSubmissionForm from './stain/StainQCSubmissionForm';
import StainMultiSelectModal from './stain/StainMultiSelectModal';
import PendingQCTable from './stain/PendingQCTable';
import CompletedQCTable from './stain/CompletedQCTable';

export default function StainQCForm() {
  const modalRef = useRef(null);
  
  // Load stain data and submission data
  const { 
    stains, 
    pendingSubmissions, 
    completedSubmissions, 
    sortConfig,
    fetchSubmissions, 
    handleSort 
  } = useStainData();

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
    resetFormData
  } = useStainSubmission(fetchSubmissions);

  // Stain selection logic
  const {
    selectedStains,
    tempSelectedStains,
    showMultiSelect,
    handleStainSelect,
    toggleMultiSelect,
    handleSubmit,
    handleModalSubmit
  } = useStainSelection(formData, fetchSubmissions, resetFormData);

  return (
    <div className="stain-qc-container">
      <div className="form-section">
        <StainQCSubmissionForm
          stains={stains}
          formData={formData}
          selectedStains={selectedStains}
          tempSelectedStains={tempSelectedStains}
          showMultiSelect={showMultiSelect}
          handleChange={handleChange}
          handleStainSelect={handleStainSelect}
          toggleMultiSelect={toggleMultiSelect}
          handleSubmit={handleSubmit}
        />
      </div>

      {showMultiSelect && (
        <StainMultiSelectModal
          stains={stains}
          tempSelectedStains={tempSelectedStains}
          formData={formData}
          handleChange={handleChange}
          handleStainSelect={handleStainSelect}
          handleModalSubmit={handleModalSubmit}
          modalRef={modalRef}
          closeModal={() => toggleMultiSelect(false)}
        />
      )}

      <PendingQCTable
        pendingSubmissions={pendingSubmissions}
        pendingUpdates={pendingUpdates}
        handlePendingChange={handlePendingChange}
        handlePendingSubmit={handlePendingSubmit}
        handleDeleteSubmission={handleDeleteSubmission}
        isDeleting={isDeleting}
        getSubmissionValue={getSubmissionValue}
      />

      <CompletedQCTable
        completedSubmissions={completedSubmissions}
        sortConfig={sortConfig}
        handleSort={handleSort}
      />
    </div>
  );
}
