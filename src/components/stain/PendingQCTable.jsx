
import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/dateUtils';
import { STAIN_QC_STATUS } from '../../types/stainTypes';

const PendingQCTable = ({ 
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
      <h2>Pending Approval</h2>
      <table className="submissions-table">
        <thead>
          <tr>
            <th>Stain</th>
            <th>Date Prepared</th>
            <th>Tech</th>
            <th>Path Initials</th>
            <th>QC Status</th>
            <th>Comments</th>
            <th>Repeat</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingSubmissions.map(sub => (
            <tr key={sub.id}>
              <td>{sub.new_stain_list?.name || 'Unknown'}</td>
              <td>{formatDate(sub.date_prepared)}</td>
              <td>{sub.tech_initials}</td>
              <td>
                <input
                  type="text"
                  value={getSubmissionValue(sub, 'path_initials') || ''}
                  onChange={(e) => handlePendingChange(sub.id, 'path_initials', e.target.value)}
                  maxLength={3}
                  placeholder="Required"
                />
              </td>
              <td>
                <select
                  value={getSubmissionValue(sub, 'stain_qc') || ''}
                  onChange={(e) => handlePendingChange(sub.id, 'stain_qc', e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value={STAIN_QC_STATUS.PASS}>{STAIN_QC_STATUS.PASS}</option>
                  <option value={STAIN_QC_STATUS.FAIL}>{STAIN_QC_STATUS.FAIL}</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={getSubmissionValue(sub, 'comments') || ''}
                  onChange={(e) => handlePendingChange(sub.id, 'comments', e.target.value)}
                  placeholder={getSubmissionValue(sub, 'stain_qc') === STAIN_QC_STATUS.FAIL ? 'Required for FAIL' : 'Optional'}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={getSubmissionValue(sub, 'repeat_stain') || false}
                  onChange={(e) => handlePendingChange(sub.id, 'repeat_stain', e.target.checked)}
                />
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    type="button"
                    className="submit-button"
                    onClick={() => handlePendingSubmit(sub.id)}
                  >
                    Submit QC
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

PendingQCTable.propTypes = {
  pendingSubmissions: PropTypes.array.isRequired,
  pendingUpdates: PropTypes.object.isRequired,
  handlePendingChange: PropTypes.func.isRequired,
  handlePendingSubmit: PropTypes.func.isRequired,
  handleDeleteSubmission: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  getSubmissionValue: PropTypes.func.isRequired
};

export default PendingQCTable;
