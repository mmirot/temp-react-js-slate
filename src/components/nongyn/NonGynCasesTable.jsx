import React, { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { generateAccessionPrefix } from '../../utils/accessionUtils';
import { getTodayDateString } from '../../utils/dateUtils';
import { Trash2, Plus } from 'lucide-react';

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

  const handleMultiSubmit = (e) => {
    e.preventDefault();
    
    // Validate all rows
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
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
    rows.forEach((row, index) => {
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
                <th className="border border-gray-300 p-2 text-left w-[50px]">#</th>
                <th className="border border-gray-300 p-2 text-left w-[200px]">Accession Number</th>
                <th className="border border-gray-300 p-2 text-left w-[140px]">Date Prepared</th>
                <th className="border border-gray-300 p-2 text-left w-[120px]">Tech Initials</th>
                <th className="border border-gray-300 p-2 text-left w-[120px]">Std Slide #</th>
                <th className="border border-gray-300 p-2 text-left w-[120px]">LB Slide #</th>
                <th className="border border-gray-300 p-2 text-center w-[100px]">Actions</th>
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
                      required
                      className="w-full border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                      placeholder="Enter accession number"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="date"
                      value={row.date_prepared}
                      onChange={(e) => updateRow(row.id, 'date_prepared', e.target.value)}
                      max={getTodayDateString()}
                      required
                      className="w-full border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="text"
                      value={row.tech_initials}
                      onChange={(e) => updateRow(row.id, 'tech_initials', e.target.value)}
                      maxLength={3}
                      required
                      className="w-full border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={row.std_slide_number}
                      onChange={(e) => updateRow(row.id, 'std_slide_number', e.target.value)}
                      min="0"
                      max="999"
                      className="w-full border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={row.lb_slide_number}
                      onChange={(e) => updateRow(row.id, 'lb_slide_number', e.target.value)}
                      min="0"
                      max="999"
                      className="w-full border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex justify-center items-center gap-1">
                      {rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          className="h-8 w-8 flex items-center justify-center text-red-600 hover:bg-red-100 rounded"
                          title="Remove row"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-center gap-2 mt-4">
          <button
            type="button"
            onClick={addRow}
            className="submit-button"
            style={{width: '90px', height: '36px'}}
          >
            <Plus size={16} />
            Add Row
          </button>
          <button
            type="submit"
            className="submit-button"
            style={{width: '120px', height: '36px'}}
          >
            Submit All ({rows.length} row{rows.length !== 1 ? 's' : ''})
          </button>
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
