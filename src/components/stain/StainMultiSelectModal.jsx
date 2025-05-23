
import React from 'react';
import PropTypes from 'prop-types';
import { getTodayDateString } from '../../utils/dateUtils';

const StainMultiSelectModal = ({ 
  stains, 
  tempSelectedStains, 
  formData,
  handleChange,
  handleStainSelect,
  handleModalSubmit,
  modalRef,
  closeModal
}) => {
  const today = getTodayDateString();

  return (
    <>
      <div className="modal-overlay" />
      <div className="stain-modal" ref={modalRef}>
        <h2>Select Multiple Stains</h2>
        <div className="form-group modal-input">
          <label>Tech Initials:</label>
          <input
            type="text"
            name="tech_initials"
            value={formData.tech_initials}
            onChange={handleChange}
            required
            maxLength={3}
            placeholder="Enter initials"
          />
        </div>
        <div className="form-group modal-input">
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
        <div className="stain-checkboxes">
          {stains.map(stain => (
            <label key={stain.id} className="stain-checkbox">
              <input
                type="checkbox"
                checked={tempSelectedStains.has(stain.id)}
                onChange={() => handleStainSelect(stain.id)}
              />
              {stain.name}
            </label>
          ))}
        </div>
        <div className="modal-buttons">
          <button 
            className="modal-button cancel-button"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button 
            className="modal-button save-button"
            onClick={handleModalSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

StainMultiSelectModal.propTypes = {
  stains: PropTypes.array.isRequired,
  tempSelectedStains: PropTypes.instanceOf(Set).isRequired,
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleStainSelect: PropTypes.func.isRequired,
  handleModalSubmit: PropTypes.func.isRequired,
  modalRef: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default StainMultiSelectModal;
