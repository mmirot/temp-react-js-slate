
import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/dateUtils';

const ScreeningPendingTable = ({ 
  pendingSubmissions, 
  pendingUpdates,
  handlePendingChange,
  handlePendingSubmit,
  handleDeleteSubmission,
  isDeleting,
  getSubmissionValue
}) => {
  if (!pendingSubmissions || pendingSubmissions.length === 0) {
    return null;
  }

  return (
    <div className="submissions-section pending-section">
      <h2>Screening completed</h2>
      <table className="submissions-table">
        <thead>
          <tr>
            <th>Accession Number</th>
            <th>Std Slide #</th>
            <th>LB Slide #</th>
            <th>Date Screened</th>
            <th>Path Initial</th>
            <th>Time Min</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingSubmissions.map(sub => (
            <tr key={sub.id}>
              <td>{sub.accession_number}</td>
              <td>{sub.std_slide_number}</td>
              <td>{sub.lb_slide_number}</td>
              <td>
                <input
                  type="date"
                  value={getSubmissionValue(sub, 'date_screened') || ''}
                  onChange={(e) => handlePendingChange(sub.id, 'date_screened', e.target.value)}
                  required
                />
              </td>
              <td>
                <input
                  type="text"
                  value={getSubmissionValue(sub, 'path_initials') || ''}
                  onChange={(e) => handlePendingChange(sub.id, 'path_initials', e.target.value)}
                  maxLength={3}
                  placeholder="Required"
                  required
                />
              </td>
              <td>
                <input
                  type="number"
                  value={getSubmissionValue(sub, 'time_minutes') || ''}
                  onChange={(e) => handlePendingChange(sub.id, 'time_minutes', parseInt(e.target.value) || null)}
                  min="0"
                  placeholder="Minutes"
                />
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    type="button"
                    className="submit-button"
                    onClick={() => handlePendingSubmit(sub.id)}
                  >
                    Complete
                  </button>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDeleteSubmission(sub.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ScreeningPendingTable.propTypes = {
  pendingSubmissions: PropTypes.array.isRequired,
  pendingUpdates: PropTypes.object.isRequired,
  handlePendingChange: PropTypes.func.isRequired,
  handlePendingSubmit: PropTypes.func.isRequired,
  handleDeleteSubmission: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  getSubmissionValue: PropTypes.func.isRequired
};

export default ScreeningPendingTable;
