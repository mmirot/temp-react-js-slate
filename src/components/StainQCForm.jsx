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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchStains();
    fetchSubmissions();

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
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
        console.log('Fetched stains:', data);
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
    const newSelectedStains = new Set(selectedStains);
    if (newSelectedStains.has(stainId)) {
      newSelectedStains.delete(stainId);
    } else {
      newSelectedStains.add(stainId);
    }
    setSelectedStains(newSelectedStains);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.stain_qc === 'FAIL' && !formData.comments) {
      alert('Comments are required when failing a stain QC');
      return;
    }

    if (selectedStains.size === 0) {
      alert('Please select at least one stain');
      return;
    }

    const submissions = Array.from(selectedStains).map(stainId => ({
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
      fetchSubmissions();
    }
  };

  const renderStainSelection = () => {
    switch (viewMode) {
      case 'dropdown':
        return (
          <div className="stain-select-wrapper" ref={dropdownRef}>
            <button
              type="button"
              className="stain-select-button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedStains.size === 0
                  ? 'Select stains...'
                  : `${selectedStains.size} stain${selectedStains.size === 1 ? '' : 's'} selected`}
              </span>
              <span>{isDropdownOpen ? '▲' : '▼'}</span>
            </button>
            <div className={`stain-select-dropdown ${isDropdownOpen ? 'show' : ''}`}>
              {stains.map(stain => (
                <div
                  key={stain.id}
                  className={`stain-option ${selectedStains.has(stain.id) ? 'selected' : ''}`}
                  onClick={() => handleStainSelect(stain.id)}
                >
                  {stain.name}
                </div>
              ))}
            </div>
          </div>
        );
      case 'horizontal':
      case 'vertical':
        return (
          <div className="stain-checkboxes" style={{ flexDirection: viewMode === 'vertical' ? 'column' : 'row' }}>
            {stains.map(stain => (
              <label key={stain.id} className={`stain-checkbox ${viewMode}`}>
                <input
                  type="checkbox"
                  checked={selectedStains.has(stain.id)}
                  onChange={() => handleStainSelect(stain.id)}
                />
                {stain.name}
              </label>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="stain-qc-container">
      <div className="form-section">
        <h2>Stain QC Submission</h2>
        <form onSubmit={handleSubmit} className="stain-qc-form">
          <div className="form-group stain-list">
            <div className="view-toggle">
              <button
                type="button"
                className={viewMode === 'dropdown' ? 'active' : ''}
                onClick={() => setViewMode('dropdown')}
              >
                Dropdown
              </button>
              <button
                type="button"
                className={viewMode === 'horizontal' ? 'active' : ''}
                onClick={() => setViewMode('horizontal')}
              >
                Horizontal
              </button>
              <button
                type="button"
                className={viewMode === 'vertical' ? 'active' : ''}
                onClick={() => setViewMode('vertical')}
              >
                Vertical
              </button>
            </div>
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
                <label>Pathologist Initials:</label>
                <input
                  type="text"
                  name="path_initials"
                  value={formData.path_initials}
                  onChange={handleChange}
                  required
                  maxLength={3}
                />
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
                <label>Comments (Required if Failed):</label>
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
                  Repeat Stain Required
                </label>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={isPathologist}
                onChange={(e) => setIsPathologist(e.target.checked)}
              />
              I am a Pathologist
            </label>
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>

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