
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { getSortedData } from '../utils/sortUtils';

export const useStainData = () => {
  const [stains, setStains] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'date_prepared', direction: 'desc' });
  
  useEffect(() => {
    fetchStains();
    fetchSubmissions();
  }, []);
  
  const fetchStains = async () => {
    try {
      const { data, error } = await supabase
        .from('new_stain_list')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching stains:', error);
        toast.error('Failed to load stains list');
      } else {
        setStains(data || []);
      }
    } catch (error) {
      console.error('Error in fetchStains:', error);
      toast.error('An unexpected error occurred while loading stains');
    }
  };

  const fetchSubmissions = async (startDate = null, endDate = null) => {
    try {
      let query = supabase
        .from('stain_submissions')
        .select(`
          *,
          new_stain_list (
            name
          )
        `);
      
      if (startDate && endDate) {
        query = query
          .gte('date_qc', startDate)
          .lte('date_qc', endDate);
      }
      
      const { data, error } = await query.order('date_prepared', { ascending: false });
      
      if (error) {
        console.error('Error fetching submissions:', error);
        toast.error('Failed to load submissions');
      } else {
        if (data && data.length > 0) {
          console.log('Submissions data received:', data.length, 'records');
        }
        setSubmissions(data || []);
      }
    } catch (error) {
      console.error('Error in fetchSubmissions:', error);
      toast.error('An unexpected error occurred while loading submissions');
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const pendingSubmissions = submissions.filter(sub => !sub.stain_qc);
  const completedSubmissions = getSortedData(
    submissions.filter(sub => sub.stain_qc),
    sortConfig
  );

  return {
    stains,
    submissions,
    sortConfig,
    pendingSubmissions,
    completedSubmissions,
    fetchStains,
    fetchSubmissions,
    handleSort
  };
};
