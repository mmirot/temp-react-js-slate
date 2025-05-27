import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { getTodayDateString, isDateInFuture } from '../utils/dateUtils';
import { generateAccessionPrefix, parseAccessionRange, validateAccessionRange } from '../utils/accessionUtils';

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

  const handleSubmit = async (e, customFormData = null) => {
    e.preventDefault();
    
    const dataToSubmit = customFormData || formData;
    
    if (!dataToSubmit.accession_number.trim()) {
      toast.error('Accession number is required');
      return;
    }

    if (!dataToSubmit.tech_initials.trim()) {
      toast.error('Tech initials are required');
      return;
    }

    if (!dataToSubmit.std_slide_number.trim()) {
      toast.error('Standard slide number is required');
      return;
    }

    if (!dataToSubmit.lb_slide_number.trim()) {
      toast.error('LB slide number is required');
      return;
    }

    // Validate date is not in the future
    if (isDateInFuture(dataToSubmit.date_prepared)) {
      toast.error('Date prepared cannot be in the future');
      return;
    }

    // Handle range input for accession numbers
    if (dataToSubmit.accession_number.includes('-') || dataToSubmit.accession_number.includes(',')) {
      if (!validateAccessionRange(dataToSubmit.accession_number)) {
        toast.error('Invalid accession number range format');
        return;
      }

      try {
        const prefix = generateAccessionPrefix(dataToSubmit.date_prepared);
        const accessionNumbers = parseAccessionRange(dataToSubmit.accession_number, prefix);
        
        console.log('Creating multiple cases for range:', accessionNumbers);
        
        const submissions = accessionNumbers.map(accessionNumber => ({
          accession_number: accessionNumber,
          date_prepared: dataToSubmit.date_prepared,
          tech_initials: dataToSubmit.tech_initials.trim(),
          std_slide_number: dataToSubmit.std_slide_number.trim(),
          lb_slide_number: dataToSubmit.lb_slide_number.trim(),
          date_screened: null,
          path_initials: null,
          time_minutes: null
        }));

        const { error } = await supabase
          .from('non_gyn_submissions')
          .insert(submissions);

        if (error) {
          if (error.code === '23505') {
            toast.error('One or more accession numbers already exist');
            return;
          }
          throw error;
        }

        toast.success(`${accessionNumbers.length} non-gyn cases submitted successfully!`);
        if (!customFormData) {
          resetFormData();
        }
        fetchSubmissions();
      } catch (error) {
        toast.error('Error submitting range: ' + error.message);
        console.error('Error submitting range:', error);
      }
      return;
    }

    // Single accession number submission
    const prefix = generateAccessionPrefix(dataToSubmit.date_prepared);
    let accessionNumber = dataToSubmit.accession_number.trim();
    
    // For single numbers, format with leading zeros and add prefix if not already present
    if (!accessionNumber.startsWith(prefix)) {
      // If it's just a number, pad it and add prefix
      const num = parseInt(accessionNumber);
      if (!isNaN(num)) {
        accessionNumber = `${prefix}${num.toString().padStart(3, '0')}`;
      } else {
        accessionNumber = `${prefix}${accessionNumber}`;
      }
    }
    
    const submission = {
      accession_number: accessionNumber,
      date_prepared: dataToSubmit.date_prepared,
      tech_initials: dataToSubmit.tech_initials.trim(),
      std_slide_number: dataToSubmit.std_slide_number.trim(),
      lb_slide_number: dataToSubmit.lb_slide_number.trim(),
      date_screened: null,
      path_initials: null,
      time_minutes: null
    };

    try {
      console.log('Submitting non-gyn case with accession:', accessionNumber);
      
      const { error } = await supabase
        .from('non_gyn_submissions')
        .insert([submission]);

      if (error) {
        if (error.code === '23505') {
          toast.error(`Accession number ${accessionNumber} already exists`);
          return;
        }
        throw error;
      }

      toast.success('Non-gyn case submitted successfully!');
      if (!customFormData) {
        resetFormData();
      }
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
    
    // Check if there are any actual changes to submit
    if (!updates || Object.keys(updates).length === 0) {
      toast.error('No changes to submit');
      return;
    }

    // Validate required fields
    const pathInitials = updates.path_initials?.trim();
    const dateScreened = updates.date_screened;

    if (!pathInitials) {
      toast.error('Path initials are required');
      return;
    }

    if (!dateScreened) {
      toast.error('Date screened is required');
      return;
    }

    if (isDateInFuture(dateScreened)) {
      toast.error('Date screened cannot be in the future');
      return;
    }

    try {
      const { error } = await supabase
        .from('non_gyn_submissions')
        .update({
          date_screened: dateScreened,
          path_initials: pathInitials,
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
