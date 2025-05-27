
import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/dateUtils';

const NonGynWorkloadTable = ({ 
  completedSubmissions,
  sortConfig,
  handleSort
}) => {
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  if (!completedSubmissions || completedSubmissions.length === 0) {
    return (
      <div className="submissions-section">
        <h2>Non-Gyn Workload log</h2>
        <p className="text-center my-4 text-gray-500">No completed screenings yet.</p>
      </div>
    );
  }

  return (
    <div className="submissions-section">
      <h2>Non-Gyn Workload log</h2>
      <table className="submissions-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('path_initials')} className="sortable">
              Path{getSortIndicator('path_initials')}
            </th>
            <th onClick={() => handleSort('date_screened')} className="sortable">
              Date Screened{getSortIndicator('date_screened')}
            </th>
            <th onClick={() => handleSort('slide_total')} className="sortable">
              Slide Total{getSortIndicator('slide_total')}
            </th>
            <th onClick={() => handleSort('time_minutes')} className="sortable">
              Time Min{getSortIndicator('time_minutes')}
            </th>
            <th onClick={() => handleSort('limit')} className="sortable">
              Limit{getSortIndicator('limit')}
            </th>
            <th onClick={() => handleSort('date_prepared_earliest')} className="sortable">
              Date Prepared{getSortIndicator('date_prepared_earliest')}
            </th>
          </tr>
        </thead>
        <tbody>
          {completedSubmissions.map(entry => (
            <tr key={entry.id}>
              <td>{entry.path_initials}</td>
              <td>{formatDate(entry.date_screened)}</td>
              <td>{entry.slide_total.toFixed(1)}</td>
              <td>{entry.time_minutes || 0}</td>
              <td className={`limit-${entry.limit.toLowerCase()}`}>{entry.limit}</td>
              <td>{entry.date_prepared_display}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

NonGynWorkloadTable.propTypes = {
  completedSubmissions: PropTypes.array.isRequired,
  sortConfig: PropTypes.object.isRequired,
  handleSort: PropTypes.func.isRequired
};

export default NonGynWorkloadTable;
