import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getTodayDateString } from '../../utils/dateUtils';
import { generateAccessionPrefix, parseAccessionRange, validateAccessionRange } from '../../utils/accessionUtils';

const NonGynCasesTable = ({ 
  formData,
  handleChange,
  handleSubmit
}) => {
  const [accessionRange, setAccessionRange] = useState('');
  const [isRangeMode, setIsRangeMode] = useState(false);
  const [rangeError, setRangeError] = useState('');
  
  const today = getTodayDateString();
  const accessionPrefix = generateAccessionPrefix(formData.date_prepared);

  const handleAccessionRangeChange = (e) => {
    const value = e.target.value;
    setAccessionRange(value);
    
    if (value.trim()) {
      if (validateAccessionRange(value)) {
        setRangeError('');
      } else {
        setRangeError('Invalid range format. Use formats like "001-005" or "001,003,005-007"');
      }
    } else {
      setRangeError('');
    }
  };

  const handleRangeSubmit = async (e) => {
    e.preventDefault();
    
    if (!accessionRange.trim()) {
      setRangeError('Please enter an accession range');
      return;
    }

    if (!validateAccessionRange(accessionRange)) {
      setRangeError('Invalid range format');
      return;
    }

    try {
      const accessionNumbers = parseAccessionRange(accessionRange, accessionPrefix);
      
      // Create submissions for each accession number
      const submissions = accessionNumbers.map(accessionNumber => ({
        accession_number: accessionNumber,
        date_prepared: formData.date_prepared,
        tech_initials: formData.tech_initials,
        std_slide_number: formData.std_slide_number,
        lb_slide_number: formData.lb_slide_number,
        date_screened: null,
        path_initials: null,
        time_minutes: null
      }));

      // Call the submission handler for each
      for (const submission of submissions) {
        const mockEvent = {
          preventDefault: () => {},
          target: { value: submission }
        };
        
        // Create a temporary form data object for this submission
        const tempFormData = { ...formData, accession_number: submission.accession_number };
        await handleSubmit(mockEvent, tempFormData);
      }

      // Reset range form
      setAccessionRange('');
      setIsRangeMode(false);
      
    } catch (error) {
      setRangeError(error.message);
    }
  };

  const handleSingleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.accession_number.startsWith(accessionPrefix)) {
      const fullAccessionNumber = `${accessionPrefix}${formData.accession_number}`;
      const updatedFormData = { ...formData, accession_number: fullAccessionNumber };
      handleSubmit(e, updatedFormData);
    } else {
      handleSubmit(e);
    }
  };

  return (
    <div className="submissions-section">
      <h2>Enter case slides</h2>
      
      <div className="form-toggle mb-4">
        <button
          type="button"
          className={`toggle-button ${!isRangeMode ? 'active' : ''}`}
          onClick={() => setIsRangeMode(false)}
        >
          Single Entry
        </button>
        <button
          type="button"
          className={`toggle-button ${isRangeMode ? 'active' : ''}`}
          onClick={() => setIsRangeMode(true)}
        >
          Range Entry
        </button>
      </div>

      {!isRangeMode ? (
        <form onSubmit={handleSingleSubmit} className="stain-qc-form">
          <div className="form-group">
            <label>Accession #:</label>
            <div className="accession-input-group">
              <span className="accession-prefix">{accessionPrefix}</span>
              <input
                type="text"
                name="accession_number"
                value={formData.accession_number.replace(accessionPrefix, '')}
                onChange={(e) => handleChange({
                  target: {
                    name: 'accession_number',
                    value: e.target.value
                  }
                })}
                required
                placeholder="Enter number (e.g., 001)"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Date Prepared:</label>
            <input
              type="date"
              name="date_prepared"
              value={formData.date_prepared || today}
              onChange={handleChange}
              required
              max={today} 
            />
          </div>

          <div className="form-group horizontal">
            <label>Tech Initial:</label>
            <input
              type="text"
              name="tech_initials"
              value={formData.tech_initials}
              onChange={handleChange}
              required
              maxLength={3}
              placeholder="Tech"
            />
          </div>

          <div className="form-group">
            <label>Std Slide #:</label>
            <input
              type="text"
              name="std_slide_number"
              value={formData.std_slide_number}
              onChange={handleChange}
              required
              placeholder="Standard slide number"
            />
          </div>

          <div className="form-group">
            <label>LB Slide #:</label>
            <input
              type="text"
              name="lb_slide_number"
              value={formData.lb_slide_number}
              onChange={handleChange}
              required
              placeholder="LB slide number"
            />
          </div>

          <button type="submit" className="submit-button">Submit Case</button>
        </form>
      ) : (
        <form onSubmit={handleRangeSubmit} className="stain-qc-form">
          <div className="form-group">
            <label>Date Prepared:</label>
            <input
              type="date"
              name="date_prepared"
              value={formData.date_prepared || today}
              onChange={handleChange}
              required
              max={today} 
            />
          </div>

          <div className="form-group horizontal">
            <label>Tech Initial:</label>
            <input
              type="text"
              name="tech_initials"
              value={formData.tech_initials}
              onChange={handleChange}
              required
              maxLength={3}
              placeholder="Tech"
            />
          </div>

          <div className="form-group">
            <label>Std Slide #:</label>
            <input
              type="text"
              name="std_slide_number"
              value={formData.std_slide_number}
              onChange={handleChange}
              required
              placeholder="Standard slide number"
            />
          </div>

          <div className="form-group">
            <label>LB Slide #:</label>
            <input
              type="text"
              name="lb_slide_number"
              value={formData.lb_slide_number}
              onChange={handleChange}
              required
              placeholder="LB slide number"
            />
          </div>

          <div className="form-group">
            <label>Accession Range:</label>
            <div className="accession-input-group">
              <span className="accession-prefix">{accessionPrefix}</span>
              <input
                type="text"
                value={accessionRange}
                onChange={handleAccessionRangeChange}
                required
                placeholder="e.g., 001-005 or 001,003,005-007"
              />
            </div>
            {rangeError && <div className="error-message">{rangeError}</div>}
          </div>

          <button type="submit" className="submit-button" disabled={!!rangeError}>
            Submit Range
          </button>
        </form>
      )}
    </div>
  );
};

NonGynCasesTable.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default NonGynCasesTable;
