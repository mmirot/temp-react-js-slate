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
  const [showModal, setShowModal] = useState(false);
  const [tempSelectedStains, setTempSelectedStains] = useState(new Set());
  const modalRef = useRef(null);

  useEffect(() => {
    fetchStains();
    fetchSubmissions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

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
    if (!showModal) {
      // Single select mode
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

  const openModal = () => {
    setTempSelectedStains(new Set(selectedStains));
    setShowModal(true);
  };

  const saveSelection = () => {
    setSelectedStains(tempSelectedStains);
    setShowModal(false);
  };

  return (
    <div className="stain-qc-container">
      <div className="form-section">
        <form onSubmit={handleSubmit} className="stain-qc-form">
          <div className="form-group stain-list">
            <button
              type="button"
              className="view-toggle-button"
              onClick={openModal}
            >
              +
            </button>
            <label>Select Stains:</label>
            {!showModal && (
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
            )}
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
        <>
          <div className="modal-overlay" />
          <div className="stain-modal" ref={modalRef}>
            <h2>Select Stains</h2>
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
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-button save-button"
                onClick={saveSelection}
              >
                Save
              </button>
            </div>
          </div>
        </>
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