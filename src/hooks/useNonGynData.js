
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { getSortedData } from '../utils/sortUtils';

export const useNonGynData = () => {
  const [submissions, setSubmissions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'date_prepared', direction: 'desc' });
  
  useEffect(() => {
    fetchSubmissions();
  }, []);
  
  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('non_gyn_submissions')
        .select('*')
        .order('date_prepared', { ascending: false });
      
      if (error) {
        console.error('Error fetching non-gyn submissions:', error);
        toast.error('Failed to load non-gyn submissions');
      } else {
        if (data && data.length > 0) {
          console.log('Non-gyn submissions data received:', data.length, 'records');
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

  const pendingSubmissions = submissions.filter(sub => !sub.date_screened);
  const completedSubmissions = getSortedData(
    submissions.filter(sub => sub.date_screened),
    sortConfig
  );

  return {
    submissions,
    sortConfig,
    pendingSubmissions,
    completedSubmissions,
    fetchSubmissions,
    handleSort
  };
};
