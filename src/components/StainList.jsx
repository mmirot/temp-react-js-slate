
import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './StainList.css';

export default function StainList() {
  const [stains, setStains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchStains();
  }, []);

  const fetchStains = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const filteredStains = stains.filter(stain => 
    stain.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="stain-list-container">
      <h1>SV Pathlab Stain Library</h1>
      <p className="stain-list-description">
        Complete catalog of stains available at Silicon Valley Pathology Laboratory.
        Use the search box to filter stains by name.
      </p>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search stains..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading stains...</p>
        </div>
      ) : filteredStains.length > 0 ? (
        <div className="stains-grid">
          {filteredStains.map(stain => (
            <div key={stain.id} className="stain-card">
              <h3>{stain.name}</h3>
              <div className="stain-info">
                <span className="stain-id">ID: {stain.id.substring(0, 8)}</span>
                <span className="stain-date">
                  Added: {new Date(stain.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No stains found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
}
