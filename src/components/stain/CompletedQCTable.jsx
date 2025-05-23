
import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/dateUtils';

const CompletedQCTable = ({ 
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
        <h2>Stain QC Log</h2>
        <p className="text-center my-4 text-gray-500">No completed QC submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="submissions-section">
      <h2>Stain QC Log</h2>
      <table className="submissions-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('new_stain_list.name')} className="sortable">
              Stain{getSortIndicator('new_stain_list.name')}
            </th>
            <th onClick={() => handleSort('date_prepared')} className="sortable">
              Date Prepared{getSortIndicator('date_prepared')}
            </th>
            <th onClick={() => handleSort('tech_initials')} className="sortable">
              Tech{getSortIndicator('tech_initials')}
            </th>
            <th onClick={() => handleSort('stain_qc')} className="sortable">
              QC Status{getSortIndicator('stain_qc')}
            </th>
            <th onClick={() => handleSort('path_initials')} className="sortable">
              Path{getSortIndicator('path_initials')}
            </th>
            <th onClick={() => handleSort('date_qc')} className="sortable">
              QC Date{getSortIndicator('date_qc')}
            </th>
            <th onClick={() => handleSort('comments')} className="sortable">
              Comments{getSortIndicator('comments')}
            </th>
            <th onClick={() => handleSort('repeat_stain')} className="sortable">
              Repeat{getSortIndicator('repeat_stain')}
            </th>
          </tr>
        </thead>
        <tbody>
          {completedSubmissions.map(sub => (
            <tr key={sub.id} className={sub.stain_qc === 'FAIL' ? 'failed' : ''}>
              <td>{sub.new_stain_list?.name || 'Unknown'}</td>
              <td>{formatDate(sub.date_prepared)}</td>
              <td>{sub.tech_initials}</td>
              <td>{sub.stain_qc}</td>
              <td>{sub.path_initials || '-'}</td>
              <td>{formatDate(sub.date_qc)}</td>
              <td>{sub.comments || '-'}</td>
              <td>{sub.repeat_stain ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

CompletedQCTable.propTypes = {
  completedSubmissions: PropTypes.array.isRequired,
  sortConfig: PropTypes.object.isRequired,
  handleSort: PropTypes.func.isRequired
};

export default CompletedQCTable;
