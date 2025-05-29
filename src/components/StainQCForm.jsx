import React, { useRef, useState } from 'react';
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
import { convertToCSV, downloadCSV } from '../utils/csvUtils';
import { getTodayDateString } from '../utils/dateUtils';

export default function StainQCForm() {
  const modalRef = useRef(null);
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [endDate, setEndDate] = useState(getTodayDateString());
  
  // Load stain data and submission data
  const { 
    stains, 
    pendingSubmissions, 
    completedSubmissions, 
    sortConfig,
    fetchSubmissions, 
    handleSort 
  } = useStainData();

  const handleDownloadCSV = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    
    if (startDate > endDate) {
      toast.error('Start date must be before or equal to end date');
      return;
    }

    const headers = [
      { label: 'Stain Name', key: 'new_stain_list.name' },
      { label: 'Date Prepared', key: 'date_prepared' },
      { label: 'Tech', key: 'tech_initials' },
      { label: 'QC Status', key: 'stain_qc' },
      { label: 'Path', key: 'path_initials' },
      { label: 'QC Date', key: 'date_qc' },
      { label: 'Comments', key: 'comments' },
      { label: 'Repeat', key: 'repeat_stain' }
    ];

    const csvString = convertToCSV(completedSubmissions, headers);
    const filename = `stain_qc_log_${startDate}_to_${endDate}.csv`;
    downloadCSV(csvString, filename);
  };

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
      
      <div className="download-section mb-4 p-4 bg-white rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-3">Download QC Log</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={getTodayDateString()}
              className="border rounded p-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              max={getTodayDateString()}
              className="border rounded p-1"
            />
          </div>
          <button
            onClick={handleDownloadCSV}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            Download CSV
          </button>
        </div>
      </div>

      <CompletedQCTable
        completedSubmissions={completedSubmissions}
        sortConfig={sortConfig}
        handleSort={handleSort}
      />
    </div>
  );
}