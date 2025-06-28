
import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/dateUtils';

const NonGynWorkloadTable = ({ 
  rawCompletedSubmissions,
  aggregatedWorkload,
  sortConfig,
  handleSort,
  handleDeleteAll
}) => {
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  if (!aggregatedWorkload || aggregatedWorkload.length === 0) {
    return (
      <div className="submissions-section">
        <h2>Non-Gyn Workload log</h2>
        <p className="text-center my-4 text-gray-500">No completed screenings yet.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Daily Aggregated Workload Section */}
      <div className="submissions-section">
        <div className="flex justify-between items-center mb-4">
          <h2>Non-Gyn Daily Workload Summary</h2>
          <button
            type="button"
            onClick={handleDeleteAll}
            className="delete-button"
          >
            Delete All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="submissions-table w-full border-collapse border border-gray-300 table-fixed min-w-[750px]">
            <thead>
              <tr className="bg-gray-100">
                <th onClick={() => handleSort('path_initials')} className="sortable border border-gray-300 p-2 text-left w-[90px] cursor-pointer hover:bg-gray-200">
                  Path{getSortIndicator('path_initials')}
                </th>
                <th onClick={() => handleSort('date_screened')} className="sortable border border-gray-300 p-2 text-left w-[140px] cursor-pointer hover:bg-gray-200">
                  Date Screened{getSortIndicator('date_screened')}
                </th>
                <th onClick={() => handleSort('slide_total')} className="sortable border border-gray-300 p-2 text-left w-[110px] cursor-pointer hover:bg-gray-200">
                  Slide Total{getSortIndicator('slide_total')}
                </th>
                <th onClick={() => handleSort('time_minutes')} className="sortable border border-gray-300 p-2 text-left w-[90px] cursor-pointer hover:bg-gray-200">
                  Time Min{getSortIndicator('time_minutes')}
                </th>
                <th onClick={() => handleSort('limit')} className="sortable border border-gray-300 p-2 text-left w-[80px] cursor-pointer hover:bg-gray-200">
                  Limit{getSortIndicator('limit')}
                </th>
                <th onClick={() => handleSort('date_prepared_earliest')} className="sortable border border-gray-300 p-2 text-left w-[140px] cursor-pointer hover:bg-gray-200">
                  Date Prepared{getSortIndicator('date_prepared_earliest')}
                </th>
              </tr>
            </thead>
            <tbody>
              {aggregatedWorkload.map(entry => (
                <tr key={entry.id}>
                  <td className="border border-gray-300 p-2">{entry.path_initials}</td>
                  <td className="border border-gray-300 p-2">{formatDate(entry.date_screened)}</td>
                  <td className="border border-gray-300 p-2">{entry.slide_total.toFixed(1)}</td>
                  <td className="border border-gray-300 p-2">{Math.min(entry.time_minutes || 0, 999)}</td>
                  <td className={`border border-gray-300 p-2 ${entry.limit.toLowerCase() === 'yes' ? 'text-red-600 font-semibold' : 'text-green-600'}`}>
                    {entry.limit}
                  </td>
                  <td className="border border-gray-300 p-2">{entry.date_prepared_display}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Accession Details Section */}
      {rawCompletedSubmissions && rawCompletedSubmissions.length > 0 && (
        <div className="submissions-section mt-8">
          <h2>Individual Accession Details</h2>
          <div className="overflow-x-auto">
            <table className="submissions-table w-full border-collapse border border-gray-300 table-fixed min-w-[800px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left w-[160px]">
                    Accession Number
                  </th>
                  <th className="border border-gray-300 p-2 text-left w-[140px]">
                    Date Screened
                  </th>
                  <th className="border border-gray-300 p-2 text-left w-[100px]">
                    Std Slide #
                  </th>
                  <th className="border border-gray-300 p-2 text-left w-[100px]">
                    LB Slide #
                  </th>
                  <th className="border border-gray-300 p-2 text-left w-[100px]">
                    Path Initial
                  </th>
                  <th className="border border-gray-300 p-2 text-left w-[100px]">
                    Time Min
                  </th>
                </tr>
              </thead>
              <tbody>
                {rawCompletedSubmissions.map(submission => (
                  <tr key={submission.id}>
                    <td className="border border-gray-300 p-2">{submission.accession_number}</td>
                    <td className="border border-gray-300 p-2">{formatDate(submission.date_screened)}</td>
                    <td className="border border-gray-300 p-2 text-center">
                      {submission.std_slide_number === '0' ? '-' : submission.std_slide_number}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {submission.lb_slide_number === '0' ? '-' : submission.lb_slide_number}
                    </td>
                    <td className="border border-gray-300 p-2">{submission.path_initials}</td>
                    <td className="border border-gray-300 p-2">{submission.time_minutes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

NonGynWorkloadTable.propTypes = {
  rawCompletedSubmissions: PropTypes.array.isRequired,
  aggregatedWorkload: PropTypes.array.isRequired,
  sortConfig: PropTypes.object.isRequired,
  handleSort: PropTypes.func.isRequired,
  handleDeleteAll: PropTypes.func.isRequired
};

export default NonGynWorkloadTable;
