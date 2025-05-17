import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './StainList.css';

export default function StainList() {
  const [stains, setStains] = useState([]);

  useEffect(() => {
    fetchStains();
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

  return (
    <div className="stain-list-container">
      <h1>Available Stains</h1>
      <div className="stains-grid">
        {stains.map(stain => (
          <div key={stain.id} className="stain-card">
            {stain.name}
          </div>
        ))}
      </div>
    </div>
  );
}