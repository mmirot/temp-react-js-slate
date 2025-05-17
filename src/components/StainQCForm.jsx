import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import './StainQCForm.css';

export default function StainQCForm() {
  const [stains, setStains] = useState([]);
  const [formData, setFormData] = useState({
    date_prepared: new Date().toISOString().split('T')[0],
    tech_initials: '',
    stain_qc: 'PASS',
    path_initials: '',
    date_qc: '',
    comments: '',
    repeat_stain: false
  });
  const [isPathologist, setIsPathologist] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [selectedStains, setSelectedStains] = useState(new Set());
  const [viewMode, setViewMode] = useState('dropdown');
  const [showModal, setShowModal] = useState(false);
  const [tempSelectedStains, setTempSelectedStains] = useState(new Set());
  const modalRef = useRef(null);

  useEffect(() => {
    fetchStains();
    fetchSubmissions();

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleStainSelect = (stainId) => {
    if (viewMode === 'dropdown') {
      const newSelectedStains = new Set(selectedStains);
      if (newSelectedStains.has(stainId)) {
        newSelectedStains.delete(stainId);
      } else {
        newSelectedStains.add(stainId);
      }
      setSelectedStains(newSelectedStains);
    } else {
      const newTempSelected = new Set(tempSelectedStains);
      if (newTempSelected.has(stainId)) {
        newTempSelected.delete(stainId);
      } else {
        newTempSelected.add(stainId);
      }
      setTempSelectedStains(newTempSelected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.stain_qc === 'FAIL' && !formData.comments) {
      alert('Comments are required when failing a stain QC');
      return;
    }

    const stainsToSubmit = viewMode === 'dropdown' ? selectedStains : tempSelectedStains;
    if (stainsToSubmit.size === 0) {
      alert('Please select at least one stain');
      return;
    }

    const submissions = Array.from(stainsToSubmit).map(stainId => ({
      ...formData,
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
        stain_qc: 'PASS',
        path_initials: '',
        date_qc: '',
        comments: '',
        repeat_stain: false
      });
      setSelectedStains(new Set());
      setTempSelectedStains(new Set());
      setShowModal(false);
      fetchSubmissions();
    }
  };

  const toggleViewMode = () => {
    if (viewMode === 'dropdown') {
      setViewMode('horizontal');
      setShowModal(true);
      setTempSelectedStains(new Set(selectedStains));
    } else {
      setViewMode('dropdown');
      setShowModal(false);
    }
  };

  const handleSaveSelection = () => {
    setSelectedStains(new Set(tempSelectedStains));
    setShowModal(false);
    setViewMode('dropdown');
  };

  const renderStainSelection = () => {
    return (
      <div className="stain-select-wrapper">
        <button
          type="button"
          className="stain-select-button"
          onClick={() => setShowModal(true)}
        >
          <span>
            {selectedStains.size === 0
              ? 'Select stains...'
              : `${selectedStains.size} stain${selectedStains.size === 1 ? '' : 's'} selected`}
          </span>
          <span>▼</span>
        </button>
      </div>
    );
  };

  return (
    <div className="stain-qc-container">
      <div className="form-section">
        <form onSubmit={handleSubmit} className="stain-qc-form">
          <button
            type="button"
            className="view-toggle-button"
            onClick={toggleViewMode}
          >
            {viewMode === 'dropdown' ? '+' : '-'}
          </button>

          <div className="form-group stain-list">
            <label>Select Stains:</label>
            {renderStainSelection()}
          </div>

          <div className="form-group">
            <label>Date Prepared:</label>
            <input
              type="date"
              name="date_prepared"
              value={formData.date_prepared}
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

          <div className="form-group">
            <label>Path Initials:</label>
            <input
              type="text"
              name="path_initials"
              value={formData.path_initials}
              onChange={handleChange}
              maxLength={3}
            />
          </div>

          {isPathologist && (
            <>
              <div className="form-group">
                <label>QC Status:</label>
                <select
                  name="stain_qc"
                  value={formData.stain_qc}
                  onChange={handleChange}
                  required
                >
                  <option value="PASS">PASS</option>
                  <option value="FAIL">FAIL</option>
                </select>
              </div>

              <div className="form-group">
                <label>QC Date:</label>
                <input
                  type="date"
                  name="date_qc"
                  value={formData.date_qc}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Comments:</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  required={formData.stain_qc === 'FAIL'}
                />
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="repeat_stain"
                    checked={formData.repeat_stain}
                    onChange={handleChange}
                  />
                  Repeat Required
                </label>
              </div>
            </>
          )}

          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <h2>Select Stains</h2>
            <div className="modal-stains-grid">
              {stains.map(stain => (
                <label key={stain.id} className="modal-stain-checkbox">
                  <input
                    type="checkbox"
                    checked={tempSelectedStains.has(stain.id)}
                    onChange={() => handleStainSelect(stain.id)}
                  />
                  {stain.name}
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={handleSaveSelection} className="save-button">
                Save Selection
              </button>
              <button onClick={() => setShowModal(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="submissions-section">
        <h2>Recent Submissions</h2>
        <table className="submissions-table">
          <thead>
            <tr>
              <th>Stain</th>
              <th>Date Prepared</th>
              <th>Tech</th>
              <th>QC Status</th>
              <th>Pathologist</th>
              <th>QC Date</th>
              <th>Comments</th>
              <th>Repeat</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(sub => (
              <tr key={sub.id} className={sub.stain_qc === 'FAIL' ? 'failed' : ''}>
                <td>{sub.new_stain_list?.name || 'Unknown'}</td>
                <td>{new Date(sub.date_prepared).toLocaleDateString()}</td>
                <td>{sub.tech_initials}</td>
                <td>{sub.stain_qc || 'Pending'}</td>
                <td>{sub.path_initials || '-'}</td>
                <td>{sub.date_qc ? new Date(sub.date_qc).toLocaleDateString() : '-'}</td>
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