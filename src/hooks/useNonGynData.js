
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { aggregateDailyWorkload, sortAggregatedData } from '../utils/workloadCalculations';

export const useNonGynData = () => {
  const [submissions, setSubmissions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'date_screened', direction: 'desc' });
  
  useEffect(() => {
    fetchSubmissions();
  }, []);
  
  const fetchSubmissions = async (startDate = null, endDate = null) => {
    try {
      let query = supabase
        .from('non_gyn_submissions')
        .select('*');
      
      if (startDate && endDate) {
        query = query
          .gte('date_screened', startDate)
          .lte('date_screened', endDate);
      }
      
      const { data, error } = await query.order('date_prepared', { ascending: false });
      
      if (error) {
        console.error('Error fetching non-gyn submissions:', error);
        toast.error('Failed to load non-gyn submissions');
      } else {
        if (data && data.length > 0) {
          console.log('Non-gyn submissions data received:', data.length, 'records');
          console.log('Sample data structure:', data.slice(0, 2));
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

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL workload data? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('non_gyn_submissions')
        .delete()
        .gte('created_at', '1900-01-01'); // Delete all records

      if (error) {
        throw error;
      }

      toast.success('All workload data deleted successfully');
      fetchSubmissions();
    } catch (error) {
      toast.error('Error deleting workload data: ' + error.message);
    }
  };

  const pendingSubmissions = submissions.filter(sub => !sub.date_screened);
  
  // Transform completed submissions into daily aggregated workload data
  const completedSubmissions = submissions.filter(sub => sub.date_screened);
  
  const aggregatedWorkload = aggregateDailyWorkload(completedSubmissions);
  const sortedAggregatedWorkload = sortAggregatedData(aggregatedWorkload, sortConfig);


  return {
    submissions,
    sortConfig,
    pendingSubmissions,
    completedSubmissions: sortedAggregatedWorkload,
    fetchSubmissions,
    handleSort,
    handleDeleteAll
  };
};
