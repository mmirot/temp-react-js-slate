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
  const [formState, setFormState] = useState({
      accession_number: '',
      date_prepared: getTodayDateString(),
      tech_initials: '',
      std_slide_number: '',
      lb_slide_number: ''
  });
  
  const prefix = generateAccessionPrefix(getTodayDateString());

  const updateField = (field, value) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIncompleteRows = () => {
    return isRowComplete(formState);
  };

  const handleMultiSubmit = (e) => {
    e.preventDefault();
    
    if (!isRowComplete(formState)) {
      toast.error('Please complete all fields before submitting');
      return;
    }
    
    // Create synthetic event for submission
    const syntheticEvent = { preventDefault: () => {} };
    handleSubmit(syntheticEvent, formState);

    // Reset form after successful submission
    setFormState({
      accession_number: '',
      date_prepared: getTodayDateString(),
      tech_initials: '',
      std_slide_number: '',
      lb_slide_number: ''
    });
  };
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
      
      <form onSubmit={handleMultiSubmit} className="stain-qc-form">
        <div className="overflow-x-auto">
          <table className="submissions-table w-full border-collapse border border-gray-300 table-fixed min-w-[900px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left w-[160px]">Accession Number</th>
                <th className="border border-gray-300 p-2 text-left w-[130px]">Date Prepared</th>
                <th className="border border-gray-300 p-2 text-left w-[90px]">Tech Initials</th>
                <th className="border border-gray-300 p-2 text-left w-[90px]">Std Slide #</th>
                <th className="border border-gray-300 p-2 text-left w-[90px]">LB Slide #</th>
                <th className="border border-gray-300 p-2 text-left w-[180px]">Actions</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="text"
                      value={formState.accession_number}
                      onChange={(e) => updateField('accession_number', e.target.value)}
                      maxLength={10}
                      noValidate
                      className="w-[150px] border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                      placeholder="Enter accession number"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="date"
                      value={formState.date_prepared}
                      onChange={(e) => updateField('date_prepared', e.target.value)}
                      max={getTodayDateString()}
                      noValidate
                      className="w-[120px] border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="text"
                      value={formState.tech_initials}
                      onChange={(e) => updateField('tech_initials', e.target.value)}
                      maxLength={3}
                      noValidate
                      className="w-[80px] border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={formState.std_slide_number}
                      onChange={(e) => updateField('std_slide_number', e.target.value)}
                      min="0"
                      max="999"
                      className="w-[80px] border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={formState.lb_slide_number}
                      onChange={(e) => updateField('lb_slide_number', e.target.value)}
                      min="0"
                      max="999"
                      className="w-[80px] border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="action-buttons flex flex-row gap-2 justify-center">
                      <button type="submit" className="submit-button">Submit</button>
                    </div>
                  </td>
                </tr>
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