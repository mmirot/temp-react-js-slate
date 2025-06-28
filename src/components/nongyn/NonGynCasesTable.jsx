import React, { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { generateAccessionPrefix } from '../../utils/accessionUtils';
import { getTodayDateString } from '../../utils/dateUtils';

const NonGynCasesTable = ({ formData, handleChange, handleSubmit, addRow, removeRow }) => {
  // Generate the current prefix for display
  const currentPrefix = generateAccessionPrefix();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleAccessionChange = (e, index) => {
    const { value } = e.target;
    // If user clears the field completely, restore the prefix
    if (value === '') {
      handleChange({ target: { name: 'accession_number', value: currentPrefix } }, index);
    } else {
      handleChange(e, index);
    }
  };
  return (
    <div className="form-section mb-8">
      <h2 className="text-xl font-bold mb-4">Non-Gyn Case Entry</h2>
      
      <form onSubmit={handleFormSubmit} className="stain-qc-form">
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
              {formData.map((row, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="text"
                      name="accession_number"
                      value={row.accession_number}
                      onChange={(e) => handleAccessionChange(e, index)}
                      maxLength={10}
                      noValidate
                      className="w-[150px] border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                      placeholder={`${currentPrefix}###`}
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="date"
                      name="date_prepared"
                      value={row.date_prepared}
                      onChange={(e) => handleChange(e, index)}
                      max={getTodayDateString()}
                      noValidate
                      className="w-[120px] border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="text"
                      name="tech_initials"
                      value={row.tech_initials}
                      onChange={(e) => handleChange(e, index)}
                      maxLength={3}
                      noValidate
                      className="w-[80px] border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      name="std_slide_number"
                      value={row.std_slide_number}
                      onChange={(e) => handleChange(e, index)}
                      min="0"
                      max="999"
                      className="w-[80px] border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      name="lb_slide_number"
                      value={row.lb_slide_number}
                      onChange={(e) => handleChange(e, index)}
                      min="0"
                      max="999"
                      className="w-[80px] border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="action-buttons flex flex-row gap-2 justify-center">
                      {formData.length > 1 && (
                        <button type="button\" onClick={() => removeRow(index)} className="delete-button">
                          Remove
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-between items-center">
            <button type="button" onClick={addRow} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Add Row
            </button>
            <button type="submit" className="submit-button">
              Submit All
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

NonGynCasesTable.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  addRow: PropTypes.func.isRequired,
  removeRow: PropTypes.func.isRequired
};

export default NonGynCasesTable;