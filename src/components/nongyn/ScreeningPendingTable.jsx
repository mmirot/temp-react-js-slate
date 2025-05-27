
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatDate, getTodayDateString } from '../../utils/dateUtils';

const ScreeningPendingTable = ({ 
  pendingSubmissions, 
  pendingUpdates,
  handlePendingChange,
  handlePendingSubmit,
  handleDeleteSubmission,
  isDeleting,
  getSubmissionValue
}) => {
  const today = getTodayDateString();

  // Auto-populate today's date for new pending submissions
  useEffect(() => {
    pendingSubmissions.forEach(sub => {
      if (!sub.date_screened && !pendingUpdates[sub.id]?.date_screened) {
        handlePendingChange(sub.id, 'date_screened', today);
      }
    });
  }, [pendingSubmissions, pendingUpdates, today, handlePendingChange]);

  if (!pendingSubmissions || pendingSubmissions.length === 0) {
    return null;
  }

  return (
    <div className="submissions-section pending-section">
      <h2>Screening completed</h2>
      <div className="overflow-x-auto">
        <table className="submissions-table w-full border-collapse border border-gray-300 table-fixed min-w-[750px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left w-[160px]">Accession Number</th>
              <th className="border border-gray-300 p-2 text-left w-[90px]">Std Slide #</th>
              <th className="border border-gray-300 p-2 text-left w-[90px]">LB Slide #</th>
              <th className="border border-gray-300 p-2 text-left w-[140px]">Date Screened</th>
              <th className="border border-gray-300 p-2 text-left w-[100px]">Path Initial</th>
              <th className="border border-gray-300 p-2 text-left w-[80px]">Time Min</th>
              <th className="border border-gray-300 p-2 text-left w-[90px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingSubmissions.map(sub => (
              <tr key={sub.id}>
                <td className="border border-gray-300 p-2">{sub.accession_number}</td>
                <td className="border border-gray-300 p-2">{sub.std_slide_number}</td>
                <td className="border border-gray-300 p-2">{sub.lb_slide_number}</td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="date"
                    value={getSubmissionValue(sub, 'date_screened') || today}
                    onChange={(e) => handlePendingChange(sub.id, 'date_screened', e.target.value)}
                    max={today}
                    required
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={getSubmissionValue(sub, 'path_initials') || ''}
                    onChange={(e) => handlePendingChange(sub.id, 'path_initials', e.target.value)}
                    maxLength={3}
                    required
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={getSubmissionValue(sub, 'time_minutes') || ''}
                    onChange={(e) => handlePendingChange(sub.id, 'time_minutes', parseInt(e.target.value) || null)}
                    min="0"
                    max="999"
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="action-buttons flex flex-col space-y-1">
                    <button
                      type="button"
                      className="w-full px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-xs"
                      onClick={() => handlePendingSubmit(sub.id)}
                    >
                      Complete
                    </button>
                    <button
                      type="button"
                      className="w-full px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs"
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
