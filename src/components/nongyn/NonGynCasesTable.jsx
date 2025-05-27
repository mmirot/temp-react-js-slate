
import React from 'react';
import PropTypes from 'prop-types';
import { getTodayDateString } from '../../utils/dateUtils';

const NonGynCasesTable = ({ 
  formData,
  handleChange,
  handleSubmit
}) => {
  const today = getTodayDateString();

  return (
    <div className="submissions-section">
      <h2>Non-gyn cases</h2>
      <form onSubmit={handleSubmit} className="stain-qc-form">
        <div className="form-group">
          <label>Accession #:</label>
          <input
            type="text"
            name="accession_number"
            value={formData.accession_number}
            onChange={handleChange}
            required
            placeholder="Enter accession number"
          />
        </div>

        <div className="form-group">
          <label>Date Prepared:</label>
          <input
            type="date"
            name="date_prepared"
            value={formData.date_prepared || ''}
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
    </div>
  );
};

NonGynCasesTable.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default NonGynCasesTable;
