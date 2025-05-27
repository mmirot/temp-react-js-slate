
import React from 'react';
import PropTypes from 'prop-types';
import StainSelector from './StainSelector';
import { getTodayDateString } from '../../utils/dateUtils';

const StainQCSubmissionForm = ({ 
  stains,
  formData,
  selectedStains,
  tempSelectedStains,
  showMultiSelect,
  handleChange,
  handleStainSelect,
  toggleMultiSelect,
  handleSubmit
}) => {
  const today = getTodayDateString();

  return (
    <form onSubmit={handleSubmit} className="stain-qc-form">
      <StainSelector
        stains={stains}
        selectedStains={selectedStains}
        tempSelectedStains={tempSelectedStains}
        showMultiSelect={showMultiSelect}
        handleStainSelect={handleStainSelect}
        toggleMultiSelect={toggleMultiSelect}
      />

      <div className="form-group">
        <label>Date Prepared:</label>
        <input
          type="date"
          name="date_prepared"
          value={formData.date_prepared || ''}
          onChange={handleChange}
          required
          max={today}
          style={{textAlign: 'center'}}
          className="border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="form-group horizontal">
        <label>Tech Initials:</label>
        <input
          type="text"
          name="tech_initials"
          value={formData.tech_initials}
          onChange={handleChange}
          required
          maxLength={3}
          style={{textAlign: 'center'}}
          className="border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
};

StainQCSubmissionForm.propTypes = {
  stains: PropTypes.array.isRequired,
  formData: PropTypes.object.isRequired,
  selectedStains: PropTypes.instanceOf(Set).isRequired,
  tempSelectedStains: PropTypes.instanceOf(Set).isRequired,
  showMultiSelect: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleStainSelect: PropTypes.func.isRequired,
  toggleMultiSelect: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default StainQCSubmissionForm;
