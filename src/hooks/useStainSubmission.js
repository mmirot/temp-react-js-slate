
import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { getTodayDateString, isDateInFuture } from '../utils/dateUtils';

export const useStainSubmission = (fetchSubmissions) => {
  const [formData, setFormData] = useState({
    date_prepared: getTodayDateString(),
    tech_initials: '',
    stain_qc: null,
    path_initials: '',
    date_qc: null,
    comments: '',
    repeat_stain: false
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState({});
  
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    let finalValue;

    if (type === 'checkbox') {
      finalValue = checked;
    } else if (type === 'date') {
      // Additional validation for date
      if (name === 'date_prepared' && isDateInFuture(value)) {
        toast.error('Date cannot be in the future');
        return;
      }
      finalValue = value || null;
    } else {
      finalValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handlePendingChange = (submissionId, field, value) => {
    setPendingUpdates(prev => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        [field]: value
      }
    }));
  };

  const handleDeleteSubmission = async (submissionId) => {
    if (!confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    try {
      setIsDeleting(true);
      console.log('Attempting to delete submission with ID:', submissionId);
      
      // Delete the record from Supabase with debugging
      console.log('Sending delete request to Supabase...');
      const { error, data } = await supabase
        .from('stain_submissions')
        .delete()
        .eq('id', submissionId)
        .select();
      
      console.log('Delete response:', { error, data });

      if (error) {
        console.error('Supabase delete error:', error);
        toast.error(`Error deleting submission: ${error.message}`);
        setIsDeleting(false);
        return;
      }

      toast.success('Submission deleted successfully');
      await fetchSubmissions();
      
    } catch (error) {
      console.error('Error in handleDeleteSubmission:', error);
      toast.error(`Error deleting submission: ${error.message || 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePendingSubmit = async (submissionId) => {
    const pendingUpdate = pendingUpdates[submissionId] || {};
    const submission = await fetchSubmissionById(submissionId);
    
    if (!submission) {
      toast.error('Submission not found');
      return;
    }
    
    const updatedSubmission = {
      ...submission,
      ...pendingUpdate
    };
    
    if (!updatedSubmission.path_initials?.trim()) {
      toast.error('Pathologist initials are required');
      return;
    }

    if (!updatedSubmission.stain_qc) {
      toast.error('QC status (PASS/FAIL) is required');
      return;
    }

    if (updatedSubmission.stain_qc === 'FAIL' && !updatedSubmission.comments?.trim()) {
      toast.error('Comments are required when failing a stain QC');
      return;
    }

    const updates = {
      stain_qc: updatedSubmission.stain_qc,
      path_initials: updatedSubmission.path_initials.trim(),
      comments: updatedSubmission.comments,
      repeat_stain: updatedSubmission.repeat_stain || false,
      date_qc: getTodayDateString()
    };

    try {
      const { error } = await supabase
        .from('stain_submissions')
        .update(updates)
        .eq('id', submissionId);

      if (error) {
        throw error;
      }

      setPendingUpdates(prev => {
        const newUpdates = { ...prev };
        delete newUpdates[submissionId];
        return newUpdates;
      });

      toast.success('QC submission successful!');
      
      // Refresh data to ensure consistency with database
      await fetchSubmissions();
      
    } catch (error) {
      toast.error('Error updating submission: ' + error.message);
      console.error('Error updating submission:', error);
    }
  };

  const fetchSubmissionById = async (submissionId) => {
    try {
      const { data, error } = await supabase
        .from('stain_submissions')
        .select('*')
        .eq('id', submissionId)
        .single();
      
      if (error) {
        toast.error(`Error fetching submission: ${error.message}`);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in fetchSubmissionById:', error);
      return null;
    }
  };

  // Function to get submission value (either from pending updates or original submission)
  const getSubmissionValue = (submission, field) => {
    const pendingUpdate = pendingUpdates[submission.id];
    if (pendingUpdate && field in pendingUpdate) {
      return pendingUpdate[field];
    }
    return submission[field];
  };

  const resetFormData = () => {
    setFormData({
      date_prepared: getTodayDateString(),
      tech_initials: '',
      stain_qc: null,
      path_initials: '',
      date_qc: null,
      comments: '',
      repeat_stain: false
    });
  };

  return {
    formData,
    isDeleting,
    pendingUpdates,
    handleChange,
    handlePendingChange,
    handleDeleteSubmission,
    handlePendingSubmit,
    getSubmissionValue,
    resetFormData
  };
};
