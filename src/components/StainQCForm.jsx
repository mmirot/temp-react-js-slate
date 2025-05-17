import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './StainQCForm.css';

export default function StainQCForm() {
  const [stains, setStains] = useState([]);
  const [formData, setFormData] = useState({
    stain_id: '',
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

  useEffect(() => {
    fetchStains();
    fetchSubmissions();
  }, []);

  const fetchStains = async () => {
    try {
      const { data, error } = await supabase
        .from('new_stain_list')  // Updated to use new_stain_list table
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching stains:', error);
      } else {
        console.log('Fetched stains:', data); // Debug log
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
          stains (
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.stain_qc === 'FAIL' && !formData.comments) {
      alert('Comments are required when failing a stain QC');
      return;
    }

    const { error } = await supabase
      .from('stain_submissions')
      .insert([formData]);

    if (error) {
      alert('Error submitting: ' + error.message);
    } else {
      alert('Submission successful!');
      setFormData({
        stain_id: '',
        date_prepared: new Date().toISOString().split('T')[0],
        tech_initials: '',
        stain_qc: 'PASS',
        path_initials: '',
        date_qc: '',
        comments: '',
        repeat_stain: false
      });
      fetchSubmissions();
    }
  };

  return (
    <div className="stain-qc-container">
      <div className="form-section">
        <h2>Stain QC Submission</h2>
        <form onSubmit={handleSubmit} className="stain-qc-form">
          <div className="form-group">
            <label>Stain:</label>
            <select
              name="stain_id"
              value={formData.stain_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a stain</option>
              {stains && stains.map(stain => (
                <option key={stain.id} value={stain.id}>
                  {stain.name}
                </option>
              ))}
            </select>
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
                <td>{sub.stains?.name || 'Unknown'}</td>
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