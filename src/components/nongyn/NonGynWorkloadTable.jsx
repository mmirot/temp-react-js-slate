
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
            <th onClick={() => handleSort('accession_number')} className="sortable">
              Accession #{getSortIndicator('accession_number')}
            </th>
            <th onClick={() => handleSort('date_prepared')} className="sortable">
              Date Prepared{getSortIndicator('date_prepared')}
            </th>
            <th onClick={() => handleSort('tech_initials')} className="sortable">
              Tech{getSortIndicator('tech_initials')}
            </th>
            <th onClick={() => handleSort('std_slide_number')} className="sortable">
              Std Slide #{getSortIndicator('std_slide_number')}
            </th>
            <th onClick={() => handleSort('lb_slide_number')} className="sortable">
              LB Slide #{getSortIndicator('lb_slide_number')}
            </th>
            <th onClick={() => handleSort('date_screened')} className="sortable">
              Date Screened{getSortIndicator('date_screened')}
            </th>
            <th onClick={() => handleSort('path_initials')} className="sortable">
              Path{getSortIndicator('path_initials')}
            </th>
            <th onClick={() => handleSort('time_minutes')} className="sortable">
              Time Min{getSortIndicator('time_minutes')}
            </th>
          </tr>
        </thead>
        <tbody>
          {completedSubmissions.map(sub => (
            <tr key={sub.id}>
              <td>{sub.accession_number}</td>
              <td>{formatDate(sub.date_prepared)}</td>
              <td>{sub.tech_initials}</td>
              <td>{sub.std_slide_number}</td>
              <td>{sub.lb_slide_number}</td>
              <td>{formatDate(sub.date_screened)}</td>
              <td>{sub.path_initials}</td>
              <td>{sub.time_minutes || '-'}</td>
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
