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

  // Group submissions by range_group_id
  const groupedSubmissions = pendingSubmissions.reduce((groups, sub) => {
    const key = sub.range_group_id || sub.id;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(sub);
    return groups;
  }, {});

  const renderGroupBracket = (submissions, isFirst, isLast) => {
    if (submissions.length === 1) return null;
    
    return (
      <div className="absolute left-[-15px] top-0 bottom-0 flex items-center">
        <div className="h-full flex flex-col justify-center">
          {isFirst && (
            <div className="border-l-2 border-t-2 border-gray-400 w-3 h-1/2"></div>
          )}
          {!isFirst && !isLast && (
            <div className="border-l-2 border-gray-400 w-3 h-full"></div>
          )}
          {isLast && (
            <div className="border-l-2 border-b-2 border-gray-400 w-3 h-1/2"></div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="submissions-section pending-section">
      <h2>Screening completed</h2>
      <div className="overflow-x-auto">
        <table className="submissions-table w-full border-collapse border border-gray-300 table-fixed min-w-[750px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left w-[160px]">Accession Number</th>
              <th className="border border-gray-300 p-2 text-left w-[100px]">Std Slide #</th>
              <th className="border border-gray-300 p-2 text-left w-[100px]">LB Slide #</th>
              <th className="border border-gray-300 p-2 text-left w-[140px]">Date Screened</th>
              <th className="border border-gray-300 p-2 text-left w-[100px]">Path Initial</th>
              <th className="border border-gray-300 p-2 text-left w-[90px]">Time Min</th>
              <th className="border border-gray-300 p-2 text-left w-[200px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(groupedSubmissions).map(groupSubmissions => 
              groupSubmissions.map((sub, index) => (
                <tr key={sub.id} className="relative">
                  {renderGroupBracket(groupSubmissions, index === 0, index === groupSubmissions.length - 1)}
                  <td className="border border-gray-300 p-2">{sub.accession_number}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    {sub.std_slide_number === '*' ? (
                      <span className="text-gray-500 text-lg">*</span>
                    ) : (
                      sub.std_slide_number
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {sub.lb_slide_number === '*' ? (
                      <span className="text-gray-500 text-lg">*</span>
                    ) : (
                      sub.lb_slide_number
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="date"
                      value={getSubmissionValue(sub, 'date_screened') || today}
                      onChange={(e) => handlePendingChange(sub.id, 'date_screened', e.target.value)}
                      max={today}
                      required
                      style={{width: '120px', padding: '8px', fontSize: '14px', textAlign: 'center'}}
                      className="border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="text"
                      value={getSubmissionValue(sub, 'path_initials') || ''}
                      onChange={(e) => handlePendingChange(sub.id, 'path_initials', e.target.value)}
                      maxLength={3}
                      required
                      style={{width: '80px', padding: '8px', fontSize: '14px', textAlign: 'center'}}
                      className="border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={getSubmissionValue(sub, 'time_minutes') || ''}
                      onChange={(e) => handlePendingChange(sub.id, 'time_minutes', parseInt(e.target.value) || null)}
                      min="0"
                      max="999"
                      style={{width: '70px', padding: '8px', fontSize: '14px', textAlign: 'center'}}
                      className="border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="action-buttons flex flex-row gap-2 justify-center">
                      <button
                        type="button"
                        className="submit-button h-9"
                        onClick={() => handlePendingSubmit(sub.id)}
                      >
                        Complete
                      </button>
                      <button
                        type="button"
                        className="delete-button h-9"
                        onClick={() => handleDeleteSubmission(sub.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
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