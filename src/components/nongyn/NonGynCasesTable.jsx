import React, { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { generateAccessionPrefix } from '../../utils/accessionUtils';
import { getTodayDateString } from '../../utils/dateUtils';

const isRowComplete = (row) => {
  return row.accession_number.trim() !== '' &&
         row.tech_initials.trim() !== '' &&
         (parseInt(row.std_slide_number) > 0 || parseInt(row.lb_slide_number) > 0);
};

const NonGynCasesTable = ({ formData, handleChange, handleSubmit }) => {
  const [rows, setRows] = useState([
    {
      id: 1,
      accession_number: '',
      date_prepared: getTodayDateString(),
      tech_initials: '',
      std_slide_number: '',
      lb_slide_number: ''
    }
  ]);
  const [showDialog, setShowDialog] = useState(false);
  
  const prefix = generateAccessionPrefix(getTodayDateString());

  const addRow = () => {
    const newRow = {
      id: Date.now(),
      accession_number: '',
      date_prepared: getTodayDateString(),
      tech_initials: '',
      std_slide_number: '',
      lb_slide_number: ''
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (rowId) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== rowId));
    }
  };

  const updateRow = (rowId, field, value) => {
    setRows(rows.map(row => 
      row.id === rowId ? { ...row, [field]: value } : row
    ));
  };

  const handleIncompleteRows = () => {
    const incompleteRows = rows.filter(row => !isRowComplete(row));
    if (incompleteRows.length > 0) {
      setShowDialog(true);
      return false;
    }
    return true;
  };

  const handleDialogConfirm = () => {
    setShowDialog(false);
    if (rows.filter(row => isRowComplete(row)).length > 0) {
        setRows(rows.filter(row => isRowComplete(row)));
        handleMultiSubmit(new Event('submit'));
    }
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
  };

  const handleMultiSubmit = (e) => {
    e.preventDefault();
    
    // Check for incomplete rows first
    if (!handleIncompleteRows()) {
      return;
    }
    
    // Get only complete rows
    const completeRows = rows.filter(row => isRowComplete(row));
    
    if (completeRows.length === 0) {
      toast.error('No complete entries to submit');
      return;
    }
    
    // Validate all rows
    for (let i = 0; i < completeRows.length; i++) {
      const row = completeRows[i];
      
      if (!row.accession_number.trim()) {
        toast.error(`Row ${i + 1}: Accession number is required`);
        return;
      }
      
      if (!row.tech_initials.trim()) {
        toast.error(`Row ${i + 1}: Tech initials are required`);
        return;
      }
      
      // Validate slide numbers - at least one must be positive
      const stdNum = row.std_slide_number === '' ? 0 : parseInt(row.std_slide_number) || 0;
      const lbNum = row.lb_slide_number === '' ? 0 : parseInt(row.lb_slide_number) || 0;
      
      if (stdNum <= 0 && lbNum <= 0) {
        toast.error(`Row ${i + 1}: At least one slide number (Std or LB) must be a positive integer`);
        return;
      }
    }
    
    // Submit each row
    completeRows.forEach((row, index) => {
      // Create a synthetic event for each row submission
      const syntheticEvent = { preventDefault: () => {} };
      handleSubmit(syntheticEvent, row);
    });
    
    // Clear all rows after successful submission
    setRows([{
      id: Date.now(),
      accession_number: '',
      date_prepared: getTodayDateString(),
      tech_initials: '',
      std_slide_number: '',
      lb_slide_number: ''
    }]);
  };

  return (
    <div className="form-section mb-8">
      <h2 className="text-xl font-bold mb-4">Non-Gyn Case Entry</h2>
      
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Incomplete Entries</h3>
            <p className="mb-6">There are incomplete entries. Would you like to delete them and submit the completed entries?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDialogCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDialogConfirm}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Delete & Submit
              </button>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleMultiSubmit} className="stain-qc-form">
        <div className="overflow-x-auto">
          <table className="submissions-table w-full border-collapse border border-gray-300 table-fixed min-w-[900px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left w-[40px]">#</th>
                <th className="border border-gray-300 p-2 text-left w-[160px]">Accession Number</th>
                <th className="border border-gray-300 p-2 text-left w-[130px]">Date Prepared</th>
                <th className="border border-gray-300 p-2 text-left w-[90px]">Tech Initials</th>
                <th className="border border-gray-300 p-2 text-left w-[90px]">Std Slide #</th>
                <th className="border border-gray-300 p-2 text-left w-[90px]">LB Slide #</th>
                <th className="border border-gray-300 p-2 text-left w-[180px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td className="border border-gray-300 p-2 text-center font-medium">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="text"
                      value={row.accession_number}
                      onChange={(e) => updateRow(row.id, 'accession_number', e.target.value)}
                      maxLength={10}
                      noValidate
                      className="w-[150px] border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                      placeholder="Enter accession number"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="date"
                      value={row.date_prepared}
                      onChange={(e) => updateRow(row.id, 'date_prepared', e.target.value)}
                      max={getTodayDateString()}
                      noValidate
                      className="w-[120px] border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="text"
                      value={row.tech_initials}
                      onChange={(e) => updateRow(row.id, 'tech_initials', e.target.value)}
                      maxLength={3}
                      noValidate
                      className="w-[80px] border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={row.std_slide_number}
                      onChange={(e) => updateRow(row.id, 'std_slide_number', e.target.value)}
                      min="0"
                      max="999"
                      className="w-[80px] border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={row.lb_slide_number}
                      onChange={(e) => updateRow(row.id, 'lb_slide_number', e.target.value)}
                      min="0"
                      max="999"
                      className="w-[80px] border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="action-buttons flex flex-row gap-2 justify-center">
                      {index === 0 && (
                        <>
                          <button type="button" onClick={addRow} className="submit-button">+ Row</button>
                          <button type="submit" className="submit-button">Submit</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
    </div>
  );
};

NonGynCasesTable.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default NonGynCasesTable;