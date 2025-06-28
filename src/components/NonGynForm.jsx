import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import './StainQCForm.css';
import { convertToCSV, downloadCSV } from '../utils/csvUtils';
import { getTodayDateString } from '../utils/dateUtils';

// Custom hooks
import { useNonGynData } from '../hooks/useNonGynData';
import { useNonGynSubmission } from '../hooks/useNonGynSubmission';

// Components
import NonGynCasesTable from './nongyn/NonGynCasesTable';
import ScreeningPendingTable from './nongyn/ScreeningPendingTable';
import NonGynWorkloadTable from './nongyn/NonGynWorkloadTable';

export default function NonGynForm() {
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [endDate, setEndDate] = useState(getTodayDateString());
  
  // Load non-gyn data and submission data
  const { 
    submissions, 
    pendingSubmissions, 
    rawCompletedSubmissions,
    aggregatedWorkload,
    sortConfig,
    fetchSubmissions, 
    handleSort,
    handleDeleteAll
  } = useNonGynData();

  // Form submission and validation logic
  const { 
    formData, 
    nextAccessionSuffix,
    isLoadingNextNumber,
    isDeleting,
    pendingUpdates,
    handleChange, 
    handlePendingChange,
    handleDeleteSubmission, 
    handlePendingSubmit,
    getSubmissionValue,
    resetFormData,
    handleSubmit,
    addRow,
    removeRow
  } = useNonGynSubmission(fetchSubmissions);

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
      { label: 'Path Initials', key: 'path_initials' },
      { label: 'Date Screened', key: 'date_screened' },
      { label: 'Slide Total', key: 'slide_total' },
      { label: 'Time (min)', key: 'time_minutes' },
      { label: 'Limit', key: 'limit' },
      { label: 'Date Prepared', key: 'date_prepared_display' }
    ];

    const csvString = convertToCSV(completedSubmissions, headers);
    const filename = `non_gyn_workload_${startDate}_to_${endDate}.csv`;
    downloadCSV(csvString, filename);
  };

  return (
    <div className="stain-qc-container">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">Non-Gyn Workload</h1>
      
      <div className="form-section">
        <NonGynCasesTable
          formData={formData}
          nextAccessionSuffix={nextAccessionSuffix}
          isLoadingNextNumber={isLoadingNextNumber}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          addRow={addRow}
          removeRow={removeRow}
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

      <div className="download-section mb-4 p-4 bg-white rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-3">Download Workload Log</h3>
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

      <NonGynWorkloadTable
        rawCompletedSubmissions={rawCompletedSubmissions}
        aggregatedWorkload={aggregatedWorkload}
        sortConfig={sortConfig}
        handleSort={handleSort}
        handleDeleteAll={handleDeleteAll}
      />
    </div>
  );
}