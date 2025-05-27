
import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { getTodayDateString, isDateInFuture } from '../utils/dateUtils';

export const useNonGynSubmission = (fetchSubmissions) => {
  const [formData, setFormData] = useState({
    accession_number: '',
    date_prepared: getTodayDateString(),
    tech_initials: '',
    std_slide_number: '',
    lb_slide_number: ''
  });
  const [pendingUpdates, setPendingUpdates] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetFormData = () => {
    setFormData({
      accession_number: '',
      date_prepared: getTodayDateString(),
      tech_initials: '',
      std_slide_number: '',
      lb_slide_number: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.accession_number.trim()) {
      toast.error('Accession number is required');
      return;
    }

    if (!formData.tech_initials.trim()) {
      toast.error('Tech initials are required');
      return;
    }

    if (!formData.std_slide_number.trim()) {
      toast.error('Standard slide number is required');
      return;
    }

    if (!formData.lb_slide_number.trim()) {
      toast.error('LB slide number is required');
      return;
    }

    // Validate date is not in the future
    if (isDateInFuture(formData.date_prepared)) {
      toast.error('Date prepared cannot be in the future');
      return;
    }
    
    const submission = {
      accession_number: formData.accession_number.trim(),
      date_prepared: formData.date_prepared,
      tech_initials: formData.tech_initials.trim(),
      std_slide_number: formData.std_slide_number.trim(),
      lb_slide_number: formData.lb_slide_number.trim(),
      date_screened: null,
      path_initials: null,
      time_minutes: null
    };

    try {
      console.log('Submitting non-gyn case with date:', formData.date_prepared);
      
      const { error } = await supabase
        .from('non_gyn_submissions')
        .insert([submission]);

      if (error) {
        throw error;
      }

      toast.success('Non-gyn case submitted successfully!');
      resetFormData();
      fetchSubmissions();
    } catch (error) {
      toast.error('Error submitting: ' + error.message);
      console.error('Error submitting:', error);
    }
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

  const getSubmissionValue = (submission, field) => {
    return pendingUpdates[submission.id]?.[field] ?? submission[field] ?? '';
  };

  const handlePendingSubmit = async (submissionId) => {
    const updates = pendingUpdates[submissionId];
    if (!updates) {
      toast.error('No changes to submit');
      return;
    }

    if (!updates.path_initials?.trim()) {
      toast.error('Path initials are required');
      return;
    }

    if (!updates.date_screened) {
      toast.error('Date screened is required');
      return;
    }

    if (isDateInFuture(updates.date_screened)) {
      toast.error('Date screened cannot be in the future');
      return;
    }

    try {
      const { error } = await supabase
        .from('non_gyn_submissions')
        .update({
          date_screened: updates.date_screened,
          path_initials: updates.path_initials.trim(),
          time_minutes: updates.time_minutes || null
        })
        .eq('id', submissionId);

      if (error) {
        throw error;
      }

      toast.success('Screening completed successfully!');
      setPendingUpdates(prev => {
        const newUpdates = { ...prev };
        delete newUpdates[submissionId];
        return newUpdates;
      });
      fetchSubmissions();
    } catch (error) {
      toast.error('Error completing screening: ' + error.message);
      console.error('Error updating submission:', error);
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    if (!confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('non_gyn_submissions')
        .delete()
        .eq('id', submissionId);

      if (error) {
        throw error;
      }

      toast.success('Submission deleted successfully');
      fetchSubmissions();
    } catch (error) {
      toast.error('Error deleting submission: ' + error.message);
      console.error('Error deleting submission:', error);
    } finally {
      setIsDeleting(false);
    }
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
    resetFormData,
    handleSubmit
  };
};
