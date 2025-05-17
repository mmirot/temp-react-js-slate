import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import './StainQCForm.css';

export default function StainQCForm() {
  const [stains, setStains] = useState([]);
  const [formData, setFormData] = useState({
    date_prepared: new Date().toISOString().split('T')[0],
    tech_initials: '',
    stain_qc: null,
    path_initials: '',
    date_qc: null,
    comments: '',
    repeat_stain: false
  });
  const [submissions, setSubmissions] = useState([]);
  const [selectedStains, setSelectedStains] = useState(new Set());
  const [showMultiSelect, setShowMultiSelect] = useState(false);
  const [tempSelectedStains, setTempSelectedStains] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'date_prepared', direction: 'desc' });
  const modalRef = useRef(null);

  useEffect(() => {
    fetchStains();
    fetchSubmissions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowMultiSelect(false);
      }
    };

    if (showMultiSelect) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMultiSelect]);

  const fetchStains = async () => {
    try {
      const { data, error } = await supabase
        .from('new_stain_list')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching stains:', error);
      } else {
        setStains(data || []);
      }
    } catch (error) {
      console.error('Error in fetchStains:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('stain_submissions')
        .select(`
          *,
          new_stain_list (
            name
          )
        `)
        .order('date_prepared', { ascending: false });
      
      if (error) {
        console.error('Error fetching submissions:', error);
      } else {
        setSubmissions(data || []);
      }
    } catch (error) {
      console.error('Error in fetchSubmissions:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedSubmissions = (submissions) => {
    const sortedSubmissions = [...submissions];
    sortedSubmissions.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle special cases
      if (sortConfig.key === 'new_stain_list.name') {
        aValue = a.new_stain_list?.name || '';
        bValue = b.new_stain_list?.name || '';
      }

      if (!aValue) return 1;
      if (!bValue) return -1;

      if (sortConfig.key.includes('date')) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortedSubmissions;
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    let finalValue;

    if (type === 'checkbox') {
      finalValue = checked;
    } else if (type === 'date') {
      finalValue = value || null;
    } else {
      finalValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handlePendingChange = (submissionId, field, value) => {
    // Only update local state, not the database
    setSubmissions(prevSubmissions => 
      prevSubmissions.map(sub => 
        sub.id === submissionId 
          ? { ...sub, [field]: value }
          : sub
      )
    );
  };

  const handlePendingSubmit = async (submissionId) => {
    const submission = submissions.find(s => s.id === submissionId);
    
    // Validate required fields
    if (!submission.path_initials?.trim()) {
      alert('Please enter pathologist initials');
      return;
    }

    if (!submission.stain_qc) {
      alert('Please select a QC status');
      return;
    }

    if (submission.stain_qc === 'FAIL' && !submission.comments?.trim()) {
      alert('Comments are required when failing a stain QC');
      return;
    }

    // Prepare the update data
    const updates = {
      stain_qc: submission.stain_qc,
      path_initials: submission.path_initials.trim(),
      comments: submission.comments,
      repeat_stain: submission.repeat_stain || false,
      date_qc: new Date().toISOString().split('T')[0]
    };

    // Submit to database only when the submit button is clicked
    const { error } = await supabase
      .from('stain_submissions')
      .update(updates)
      .eq('id', submissionId);

    if (error) {
      alert('Error updating submission: ' + error.message);
    } else {
      alert('QC submission successful!');
      fetchSubmissions(); // Refresh the list
    }
  };

  const handleStainSelect = (stainId) => {
    if (!showMultiSelect) {
      setSelectedStains(new Set([stainId]));
    } else {
      const newTempSelectedStains = new Set(tempSelectedStains);
      if (newTempSelectedStains.has(stainId)) {
        newTempSelectedStains.delete(stainId);
      } else {
        newTempSelectedStains.add(stainId);
      }
      setTempSelectedStains(newTempSelectedStains);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedStains.size === 0) {
      alert('Please select at least one stain');
      return;
    }

    const submissionData = {
      ...formData,
      date_prepared: formData.date_prepared || null,
      date_qc: formData.date_qc || null
    };

    const submissions = Array.from(selectedStains).map(stainId => ({
      ...submissionData,
      stain_id: stainId
    }));

    const { error } = await supabase
      .from('stain_submissions')
      .insert(submissions);

    if (error) {
      alert('Error submitting: ' + error.message);
    } else {
      alert('Submission successful!');
      setFormData({
        date_prepared: new Date().toISOString().split('T')[0],
        tech_initials: '',
        stain_qc: null,
        path_initials: '',
        date_qc: null,
        comments: '',
        repeat_stain: false
      });
      setSelectedStains(new Set());
      fetchSubmissions();
    }
  };

  const toggleMultiSelect = () => {
    if (!showMultiSelect) {
      setTempSelectedStains(new Set(selectedStains));
    }
    setShowMultiSelect(!showMultiSelect);
  };

  const saveMultiSelection = () => {
    setSelectedStains(tempSelectedStains);
    setShowMultiSelect(false);
  };

  const pendingSubmissions = submissions.filter(sub => !sub.stain_qc);
  const completedSubmissions = getSortedSubmissions(submissions.filter(sub => sub.stain_qc));

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  return (
    <div className="stain-qc-container">
      <div className="form-section">
        <form onSubmit={handleSubmit} className="stain-qc-form">
          <div className="form-group stain-list">
            <button
              type="button"
              className="view-toggle-button"
              onClick={toggleMultiSelect}
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

          <div className="form-group">
            <label>Date Prepared:</label>
            <input
              type="date"
              name="date_prepared"
              value={formData.date_prepared || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Tech Initials:</label>
            <input
              type="text"
              name="tech_initials"
              value={formData.tech_initials}
              onChange={handleChange}
              required
              maxLength={3}
            />
          </div>

          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>

      {showMultiSelect && (
        <>
          <div className="modal-overlay" />
          <div className="stain-modal" ref={modalRef}>
            <h2>Select Multiple Stains</h2>
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
                onClick={() => setShowMultiSelect(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-button save-button"
                onClick={saveMultiSelection}
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}

      {pendingSubmissions.length > 0 && (
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
                      value={sub.path_initials || ''}
                      onChange={(e) => handlePendingChange(sub.id, 'path_initials', e.target.value)}
                      maxLength={3}
                      placeholder="Required"
                      required
                    />
                  </td>
                  <td>
                    <select
                      value={sub.stain_qc || ''}
                      onChange={(e) => handlePendingChange(sub.id, 'stain_qc', e.target.value)}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="PASS">PASS</option>
                      <option value="FAIL">FAIL</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={sub.comments || ''}
                      onChange={(e) => handlePendingChange(sub.id, 'comments', e.target.value)}
                      placeholder={sub.stain_qc === 'FAIL' ? 'Required for FAIL' : 'Optional'}
                      required={sub.stain_qc === 'FAIL'}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={sub.repeat_stain || false}
                      onChange={(e) => handlePendingChange(sub.id, 'repeat_stain', e.target.checked)}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="submit-button"
                      onClick={() => handlePendingSubmit(sub.id)}
                    >
                      Submit QC
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
    </div>
  );
}