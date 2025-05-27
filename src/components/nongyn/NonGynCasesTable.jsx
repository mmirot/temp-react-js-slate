
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { generateAccessionPrefix } from '../../utils/accessionUtils';
import { getTodayDateString } from '../../utils/dateUtils';

const NonGynCasesTable = ({ formData, handleChange, handleSubmit }) => {
  const [isRangeMode, setIsRangeMode] = useState(false);
  
  const prefix = generateAccessionPrefix(formData.date_prepared);

  const handleAccessionChange = (e) => {
    const { value } = e.target;
    // Check if user is entering range format
    const hasRangeIndicators = value.includes('-') || value.includes(',');
    setIsRangeMode(hasRangeIndicators);
    
    handleChange(e);
  };

  return (
    <div className="form-section">
      <h2>Non-Gyn Case Entry</h2>
      <form onSubmit={handleSubmit}>
        <table className="form-table">
          <thead>
            <tr>
              <th>Accession Number</th>
              <th>Date Prepared</th>
              <th>Tech Initials</th>
              <th>Std Slide #</th>
              <th>LB Slide #</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="accession-input-container">
                  <span className="accession-prefix">{prefix}</span>
                  <input
                    type="text"
                    name="accession_number"
                    value={formData.accession_number}
                    onChange={handleAccessionChange}
                    placeholder={isRangeMode ? "001-005 or 001,003,005-007" : "001"}
                    required
                    className="accession-input"
                  />
                </div>
                {isRangeMode && (
                  <small className="range-help">
                    Range format: 001-005 or 001,003,005-007
                  </small>
                )}
              </td>
              <td>
                <input
                  type="date"
                  name="date_prepared"
                  value={formData.date_prepared}
                  onChange={handleChange}
                  max={getTodayDateString()}
                  required
                />
              </td>
              <td>
                <input
                  type="text"
                  name="tech_initials"
                  value={formData.tech_initials}
                  onChange={handleChange}
                  maxLength={3}
                  placeholder="ABC"
                  required
                />
              </td>
              <td>
                <input
                  type="number"
                  name="std_slide_number"
                  value={formData.std_slide_number}
                  onChange={handleChange}
                  min="1"
                  placeholder="1"
                  required
                />
              </td>
              <td>
                <input
                  type="number"
                  name="lb_slide_number"
                  value={formData.lb_slide_number}
                  onChange={handleChange}
                  min="1"
                  placeholder="1"
                  required
                />
              </td>
              <td>
                <button type="submit" className="submit-button">
                  {isRangeMode ? 'Submit Range' : 'Submit'}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
