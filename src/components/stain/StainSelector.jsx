
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const StainSelector = ({ 
  stains, 
  selectedStains,
  tempSelectedStains,
  showMultiSelect, 
  handleStainSelect,
  toggleMultiSelect 
}) => {
  const modalRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        toggleMultiSelect(false);
      }
    };

    if (showMultiSelect) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMultiSelect, toggleMultiSelect]);

  return (
    <div className="form-group stain-list">
      <button
        type="button"
        className="view-toggle-button"
        onClick={() => toggleMultiSelect(!showMultiSelect)}
      >
        {showMultiSelect ? '-' : '+'}
      </button>
      {!showMultiSelect ? (
        <select
          onChange={(e) => handleStainSelect(e.target.value)}
          value={Array.from(selectedStains)[0] || ''}
        >
          <option value="">Select a stain</option>
          {stains.map(stain => (
            <option key={stain.id} value={stain.id}>
              {stain.name}
            </option>
          ))}
        </select>
      ) : (
        <div className="selected-stains">
          {Array.from(tempSelectedStains).map(stainId => {
            const stain = stains.find(s => s.id === stainId);
            return stain ? (
              <span key={stain.id} className="selected-stain-tag">
                {stain.name}
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

StainSelector.propTypes = {
  stains: PropTypes.array.isRequired,
  selectedStains: PropTypes.instanceOf(Set).isRequired,
  tempSelectedStains: PropTypes.instanceOf(Set).isRequired,
  showMultiSelect: PropTypes.bool.isRequired,
  handleStainSelect: PropTypes.func.isRequired,
  toggleMultiSelect: PropTypes.func.isRequired
};

export default StainSelector;
