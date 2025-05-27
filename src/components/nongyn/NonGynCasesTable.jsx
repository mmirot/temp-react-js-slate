
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
    <div className="form-section">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Non-Gyn Case Entry</h2>
        <button
          type="button"
          onClick={handleModeToggle}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {isRangeMode ? 'Switch to Single Entry' : 'Switch to Range Entry'}
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Accession Number</th>
                <th className="border border-gray-300 p-3 text-left">Date Prepared</th>
                <th className="border border-gray-300 p-3 text-left">Tech Initials</th>
                <th className="border border-gray-300 p-3 text-left">Std Slide #</th>
                <th className="border border-gray-300 p-3 text-left">LB Slide #</th>
                <th className="border border-gray-300 p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <span className="bg-gray-100 px-2 py-1 border rounded-l text-sm font-mono">
                        {prefix}
                      </span>
                      <input
                        type="text"
                        name="accession_number"
                        value={formData.accession_number}
                        onChange={handleAccessionChange}
                        placeholder={isRangeMode ? "1-5 or 1,3,5-7" : "1"}
                        required
                        className="flex-1 px-2 py-1 border border-l-0 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {isRangeMode && (
                      <small className="text-gray-600 text-xs">
                        Range format: 1-5 or 1,3,5-7 (no leading zeros required)
                      </small>
                    )}
                  </div>
                </td>
                <td className="border border-gray-300 p-3">
                  <input
                    type="date"
                    name="date_prepared"
                    value={formData.date_prepared}
                    onChange={handleChange}
                    max={getTodayDateString()}
                    required
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <input
                    type="text"
                    name="tech_initials"
                    value={formData.tech_initials}
                    onChange={handleChange}
                    maxLength={3}
                    placeholder="ABC"
                    required
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <input
                    type="number"
                    name="std_slide_number"
                    value={formData.std_slide_number}
                    onChange={handleChange}
                    min="1"
                    placeholder="1"
                    required
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <input
                    type="number"
                    name="lb_slide_number"
                    value={formData.lb_slide_number}
                    onChange={handleChange}
                    min="1"
                    placeholder="1"
                    required
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <button 
                    type="submit" 
                    className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    {isRangeMode ? 'Submit Range' : 'Submit'}
                  </button>
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
