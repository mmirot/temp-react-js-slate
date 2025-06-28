
import { useState } from 'react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { getTodayDateString, isDateInFuture } from '../utils/dateUtils';
import { generateAccessionPrefix } from '../utils/accessionUtils';

export const useNonGynSubmission = (fetchSubmissions) => {
  const [nextAccessionSuffix, setNextAccessionSuffix] = useState(1);
  const [isLoadingNextNumber, setIsLoadingNextNumber] = useState(true);

  // Helper function to format accession number
  const getFormattedAccessionNumber = (suffix) => {
    const prefix = generateAccessionPrefix();
    return `${prefix}${suffix.toString().padStart(3, '0')}`;
  };

  // Fetch the last used accession number on component mount
  useEffect(() => {
    const fetchLastAccessionNumber = async () => {
      try {
        setIsLoadingNextNumber(true);
        const { data, error } = await supabase
          .from('non_gyn_submissions')
          .select('accession_number')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error fetching last accession number:', error);
          setNextAccessionSuffix(1);
        } else if (data && data.length > 0) {
          const lastAccession = data[0].accession_number;
          console.log('Last accession number found:', lastAccession);
          
          // Extract the numeric suffix from the accession number
          // Format is like "CN25-001" or "CN25-123"
          const match = lastAccession.match(/-(\d+)$/);
          if (match) {
            const lastNumber = parseInt(match[1], 10);
            setNextAccessionSuffix(lastNumber + 1);
            console.log('Next accession suffix will be:', lastNumber + 1);
          } else {
            console.log('Could not parse accession number, starting from 1');
            setNextAccessionSuffix(1);
          }
        } else {
          console.log('No previous accession numbers found, starting from 1');
          setNextAccessionSuffix(1);
        }
      } catch (error) {
        console.error('Error in fetchLastAccessionNumber:', error);
        setNextAccessionSuffix(1);
      } finally {
        setIsLoadingNextNumber(false);
      }
    };

    fetchLastAccessionNumber();
  }, []);

  const [formData, setFormData] = useState([{
    accession_number: '',
    date_prepared: getTodayDateString(),
    tech_initials: '',
    std_slide_number: '',
    lb_slide_number: ''
  }]);

  // Update formData when nextAccessionSuffix is loaded
  useEffect(() => {
    if (!isLoadingNextNumber && formData.length > 0) {
      setFormData(prev => prev.map((item, index) => ({
        ...item,
        accession_number: item.accession_number || getFormattedAccessionNumber(nextAccessionSuffix + index)
      })));
    }
  }, [nextAccessionSuffix, isLoadingNextNumber]);

  const [pendingUpdates, setPendingUpdates] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setFormData(prev => prev.map((item, i) => 
      i === index ? { ...item, [name]: value } : item
    ));
  };

  const addRow = () => {
    setFormData(prev => [...prev, {
      accession_number: getFormattedAccessionNumber(nextAccessionSuffix + prev.length),
      date_prepared: getTodayDateString(),
      tech_initials: '',
      std_slide_number: '',
      lb_slide_number: ''
    }]);
  };

  const removeRow = (index) => {
    if (formData.length > 1) {
      setFormData(prev => prev.filter((_, i) => i !== index));
    }
  };

  const resetFormData = () => {
    setFormData([{
      accession_number: getFormattedAccessionNumber(nextAccessionSuffix),
      date_prepared: getTodayDateString(),
      tech_initials: '',
      std_slide_number: '',
      lb_slide_number: ''
    }]);
  };

  const validateSlideNumbers = (stdSlides, lbSlides) => {
    // Convert to numbers, treating empty/null/undefined as 0
    const stdNum = (stdSlides === null || stdSlides === undefined || stdSlides === '') ? 0 : parseInt(stdSlides) || 0;
    const lbNum = (lbSlides === null || lbSlides === undefined || lbSlides === '') ? 0 : parseInt(lbSlides) || 0;
    
    console.log('🔍 Validating slide numbers - Std:', stdSlides, '→', stdNum, 'LB:', lbSlides, '→', lbNum);
    
    // At least one must be positive (greater than 0)
    if (stdNum <= 0 && lbNum <= 0) {
      console.log('❌ Validation failed: Both slide numbers are zero or negative');
      return false;
    }
    
    console.log('✅ Slide validation passed');
    return true;
  };

  const validateDateScreened = (dateScreened, datePrepared) => {
    // Date screened must be greater than or equal to date prepared
    const isValid = dateScreened >= datePrepared;
    console.log('🗓️ Date validation - Screened:', dateScreened, 'Prepared:', datePrepared, 'Valid:', isValid);
    return isValid;
  };

  // Helper function to properly convert slide numbers for storage
  const convertSlideNumber = (slideValue) => {
    if (slideValue === null || slideValue === undefined || slideValue === '') {
      return 0; // Store as number 0
    }
    const num = parseInt(slideValue);
    return isNaN(num) ? 0 : num;
  };

  const handleSubmit = async (e, customFormData = null) => {
    e.preventDefault();
    
    const dataArray = customFormData || formData;
    const errors = [];
    
    // Validate all entries first
    for (let i = 0; i < dataArray.length; i++) {
      const data = dataArray[i];
      
      if (!data.accession_number.trim()) {
        errors.push(`Row ${i + 1}: Accession number is required`);
        continue;
      }

      if (!data.tech_initials.trim()) {
        errors.push(`Row ${i + 1}: Tech initials are required`);
        continue;
      }

      if (!validateSlideNumbers(data.std_slide_number, data.lb_slide_number)) {
        errors.push(`Row ${i + 1}: At least one slide number (Std or LB) must be a positive integer`);
        continue;
      }

      if (isDateInFuture(data.date_prepared)) {
        errors.push(`Row ${i + 1}: Date prepared cannot be in the future`);
        continue;
      }
    }

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    // Process all valid entries
    const submissions = [];
    for (const data of dataArray) {
      const prefix = generateAccessionPrefix(data.date_prepared);
      let accessionNumber = data.accession_number.trim();
      
      if (!accessionNumber.startsWith(prefix)) {
        const num = parseInt(accessionNumber);
        if (!isNaN(num)) {
          accessionNumber = `${prefix}${num.toString().padStart(3, '0')}`;
        } else {
          accessionNumber = `${prefix}${accessionNumber}`;
        }
      }
      
      const stdNum = convertSlideNumber(data.std_slide_number);
      const lbNum = convertSlideNumber(data.lb_slide_number);
      
      submissions.push({
        accession_number: accessionNumber,
        date_prepared: data.date_prepared,
        tech_initials: data.tech_initials.trim(),
        std_slide_number: stdNum.toString(),
        lb_slide_number: lbNum.toString(),
        date_screened: null,
        path_initials: null,
        time_minutes: null
      });
    }

    try {
      console.log('📤 SUPABASE TRANSMISSION - Multiple submissions:', submissions);
      
      const { error } = await supabase
        .from('non_gyn_submissions')
        .insert(submissions);

      if (error) {
        console.error('❌ SUPABASE ERROR - Multiple submissions:', error);
        if (error.code === '23505') {
          toast.error('One or more accession numbers already exist');
          return;
        }
        throw error;
      }

      console.log('✅ SUPABASE SUCCESS - Multiple submissions:', submissions.length);
      toast.success(`${submissions.length} non-gyn case(s) submitted successfully!`);
      
      // Update the next accession suffix for future entries
      setNextAccessionSuffix(prev => prev + submissions.length);
      
      if (!customFormData) {
        resetFormData();
      }
      fetchSubmissions();
    } catch (error) {
      console.error('❌ Multiple submission error:', error);
      toast.error('Error submitting: ' + error.message);
    }
  };

  const handlePendingChange = (submissionId, field, value) => {
    console.log('📝 Pending update change:', submissionId, field, value);
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
    
    // Get the specific submission data
    const { data: currentSubmission, error: fetchError } = await supabase
      .from('non_gyn_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();
    
    if (fetchError || !currentSubmission) {
      toast.error('Submission not found');
      return;
    }

    // Merge pending updates with current submission values
    const finalData = {
      date_screened: updates.date_screened || currentSubmission.date_screened,
      path_initials: updates.path_initials || currentSubmission.path_initials,
      time_minutes: updates.time_minutes !== undefined ? updates.time_minutes : currentSubmission.time_minutes
    };

    // Validate required fields - path_initials, date_screened, and time_minutes are all required
    const pathInitials = finalData.path_initials?.trim();
    const dateScreened = finalData.date_screened;
    const timeMinutes = finalData.time_minutes;

    if (!pathInitials) {
      toast.error('Path initials are required');
      return;
    }

    if (!dateScreened) {
      toast.error('Date screened is required');
      return;
    }

    if (!timeMinutes || timeMinutes <= 0) {
      toast.error('Time minutes is required and must be greater than 0');
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
      const updateData = {
        date_screened: dateScreened,
        path_initials: pathInitials,
        time_minutes: timeMinutes
      };
      
      const { error } = await supabase
        .from('non_gyn_submissions')
        .update(updateData)
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
    nextAccessionSuffix,
    isLoadingNextNumber,
    isDeleting,
    pendingUpdates,
    handleChange,
    handlePendingChange,
    handleDeleteSubmission,
    handlePendingSubmit,
    getSubmissionValue,
    resetFormData,
    handleSubmit,
    addRow,
    removeRow
  };
};
