
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

  const validateSlideNumbers = (stdSlides, lbSlides) => {
    // Convert to numbers, treating empty/null/undefined as 0
    const stdNum = (stdSlides === null || stdSlides === undefined || stdSlides === '') ? 0 : parseInt(stdSlides) || 0;
    const lbNum = (lbSlides === null || lbSlides === undefined || lbSlides === '') ? 0 : parseInt(lbSlides) || 0;
    
    // At least one must be positive (greater than 0)
    if (stdNum <= 0 && lbNum <= 0) {
      return false;
    }
    
    return true;
  };

  const validateDateScreened = (dateScreened, datePrepared) => {
    // Date screened must be greater than or equal to date prepared
    return dateScreened >= datePrepared;
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

    // Validate slide numbers - at least one must be positive
    if (!validateSlideNumbers(dataToSubmit.std_slide_number, dataToSubmit.lb_slide_number)) {
      toast.error('At least one slide number (Std or LB) must be a positive integer');
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
          std_slide_number: dataToSubmit.std_slide_number === '' ? '0' : (dataToSubmit.std_slide_number || '0'),
          lb_slide_number: dataToSubmit.lb_slide_number === '' ? '0' : (dataToSubmit.lb_slide_number || '0'),
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
      std_slide_number: dataToSubmit.std_slide_number === '' ? '0' : (dataToSubmit.std_slide_number || '0'),
      lb_slide_number: dataToSubmit.lb_slide_number === '' ? '0' : (dataToSubmit.lb_slide_number || '0'),
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
    const updates = pendingUpdates[submissionId] || {};
    
    // Get the current submission data to check for existing values
    const submissions = await getCurrentSubmissions();
    const currentSubmission = submissions.find(s => s.id === submissionId);
    
    if (!currentSubmission) {
      toast.error('Submission not found');
      return;
    }

    // Merge pending updates with current submission values
    const finalData = {
      date_screened: updates.date_screened || currentSubmission.date_screened,
      path_initials: updates.path_initials || currentSubmission.path_initials,
      time_minutes: updates.time_minutes !== undefined ? updates.time_minutes : currentSubmission.time_minutes
    };

    // Validate required fields
    const pathInitials = finalData.path_initials?.trim();
    const dateScreened = finalData.date_screened;

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

    // Validate that date screened is >= date prepared
    if (!validateDateScreened(dateScreened, currentSubmission.date_prepared)) {
      toast.error('Date screened must be greater than or equal to date prepared');
      return;
    }

    try {
      const { error } = await supabase
        .from('non_gyn_submissions')
        .update({
          date_screened: dateScreened,
          path_initials: pathInitials,
          time_minutes: finalData.time_minutes || null
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

  const getCurrentSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('non_gyn_submissions')
        .select('*');
      
      if (error) {
        console.error('Error fetching submissions:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getCurrentSubmissions:', error);
      return [];
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
