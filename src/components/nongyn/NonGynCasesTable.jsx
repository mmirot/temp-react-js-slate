
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { generateAccessionPrefix } from '../../utils/accessionUtils';
import { getTodayDateString } from '../../utils/dateUtils';

const NonGynCasesTable = ({ formData, handleChange, handleSubmit }) => {
  const [isRangeMode, setIsRangeMode] = useState(false);
  
  const prefix = generateAccessionPrefix(formData.date_prepared);

  const handleAccessionChange = (e) => {
    const { value } = e.target;
    // Only set range mode if user explicitly uses range indicators and has actual content
    const hasRangeIndicators = value.trim().length > 0 && (value.includes('-') || value.includes(','));
    setIsRangeMode(hasRangeIndicators);
    
    handleChange(e);
  };

  const handleModeToggle = () => {
    setIsRangeMode(!isRangeMode);
    // Clear the accession number when switching modes
    handleChange({ target: { name: 'accession_number', value: '' } });
  };

  return (
    <div className="form-section mb-8">
      <h2 className="text-xl font-bold mb-4">Non-Gyn Case Entry</h2>
      
      <form onSubmit={handleSubmit} className="stain-qc-form">
        <div className="overflow-x-auto">
          <table className="submissions-table w-full border-collapse border border-gray-300 table-fixed min-w-[800px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left w-[200px]">Accession Number</th>
                <th className="border border-gray-300 p-2 text-left w-[140px]">Date Prepared</th>
                <th className="border border-gray-300 p-2 text-left w-[120px]">Tech Initials</th>
                <th className="border border-gray-300 p-2 text-left w-[120px]">Std Slide #</th>
                <th className="border border-gray-300 p-2 text-left w-[120px]">LB Slide #</th>
                <th className="border border-gray-300 p-2 text-left w-[110px]">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">
                  <div className="form-group">
                    <input
                      type="text"
                      name="accession_number"
                      value={formData.accession_number || ''}
                      onChange={handleAccessionChange}
                      maxLength={10}
                      required
                      className="border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter accession number"
                    />
                  </div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="form-group">
                    <input
                      type="date"
                      name="date_prepared"
                      value={formData.date_prepared || ''}
                      onChange={handleChange}
                      max={getTodayDateString()}
                      required
                      className="border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="form-group">
                    <input
                      type="text"
                      name="tech_initials"
                      value={formData.tech_initials || ''}
                      onChange={handleChange}
                      maxLength={3}
                      required
                      className="border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="form-group">
                    <input
                      type="number"
                      name="std_slide_number"
                      value={formData.std_slide_number || ''}
                      onChange={handleChange}
                      min="0"
                      max="999"
                      className="border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="form-group">
                    <input
                      type="number"
                      name="lb_slide_number"
                      value={formData.lb_slide_number || ''}
                      onChange={handleChange}
                      min="0"
                      max="999"
                      className="border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="action-buttons">
                    <button
                      type="button"
                      onClick={handleModeToggle}
                      className="submit-button"
                    >
                      {isRangeMode ? 'Single' : 'Range'}
                    </button>
                    <button 
                      type="submit" 
                      className="submit-button"
                    >
                      {isRangeMode ? 'Submit Range' : 'Submit'}
                    </button>
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
