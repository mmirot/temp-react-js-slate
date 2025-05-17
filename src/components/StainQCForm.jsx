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
    date_qc: null,  // Changed from empty string to null
    comments: '',
    repeat_stain: false
  });
  const [submissions, setSubmissions] = useState([]);
  const [selectedStains, setSelectedStains] = useState(new Set());
  const [showMultiSelect, setShowMultiSelect] = useState(false);
  const [tempSelectedStains, setTempSelectedStains] = useState(new Set());
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

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    let finalValue;

    // Handle different input types
    if (type === 'checkbox') {
      finalValue = checked;
    } else if (type === 'date') {
      // Set to null if empty, otherwise use the value
      finalValue = value || null;
    } else {
      finalValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleStainSelect = (stainId) => {
    if (!showMultiSelect) {
      // Single select mode (dropdown)
      setSelectedStains(new Set([stainId]));
    } else {
      // Multiple select mode
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

    // Ensure date fields are either valid dates or null
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
        date_qc: null,  // Reset to null instead of empty string
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
  const completedSubmissions = submissions.filter(sub => sub.stain_qc);

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingSubmissions.map(sub => (
                <tr key={sub.id}>
                  <td>{sub.new_stain_list?.name || 'Unknown'}</td>
                  <td>{formatDate(sub.date_prepared)}</td>
                  <td>{sub.tech_initials}</td>
                  <td>Pending</td>
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
              <th>Stain</th>
              <th>Date Prepared</th>
              <th>Tech</th>
              <th>QC Status</th>
              <th>Path</th>
              <th>QC Date</th>
              <th>Comments</th>
              <th>Repeat</th>
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