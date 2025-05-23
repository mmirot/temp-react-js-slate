
import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { isDateInFuture } from '../utils/dateUtils';

export const useStainSelection = (formData, fetchSubmissions, resetFormData) => {
  const [selectedStains, setSelectedStains] = useState(new Set());
  const [tempSelectedStains, setTempSelectedStains] = useState(new Set());
  const [showMultiSelect, setShowMultiSelect] = useState(false);

  const handleStainSelect = (stainId) => {
    if (!showMultiSelect) {
      setSelectedStains(new Set([stainId]));
    } else {
      const newTempSelectedStains = new Set(tempSelectedStains);
      if (newTempSelectedStains.has(stainId)) {
        newTempSelectedStains.delete(stainId);
      } else {
        newTempSelectedStains.add(stainId);
      }
      setTempSelectedStains(newTempSelectedStains);
    }
  };

  const toggleMultiSelect = (value) => {
    const newValue = value !== undefined ? value : !showMultiSelect;
    if (!showMultiSelect && newValue) {
      setTempSelectedStains(new Set(selectedStains));
    }
    setShowMultiSelect(newValue);
  };

  const saveMultiSelection = () => {
    setSelectedStains(tempSelectedStains);
    setShowMultiSelect(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedStains.size === 0) {
      toast.error('Please select at least one stain');
      return;
    }

    if (!formData.tech_initials.trim()) {
      toast.error('Tech initials are required');
      return;
    }

    // Validate date is not in the future
    const selectedDate = formData.date_prepared;
    if (isDateInFuture(selectedDate)) {
      toast.error('Date prepared cannot be in the future');
      return;
    }
    
    console.log('Selected date from input:', selectedDate);
    
    // Create submissions with the selected date
    const submissions = Array.from(selectedStains).map(stainId => {
      return {
        stain_id: stainId,
        // Send the date exactly as selected in the input
        date_prepared: selectedDate,
        tech_initials: formData.tech_initials.trim(),
        stain_qc: null,
        path_initials: null,
        date_qc: null,
        comments: null,
        repeat_stain: false
      };
    });

    try {
      console.log('Submitting with date:', selectedDate);
      
      const { error } = await supabase
        .from('stain_submissions')
        .insert(submissions);

      if (error) {
        throw error;
      }

      toast.success('Submission successful!');
      resetFormData();
      setSelectedStains(new Set());
      fetchSubmissions();
    } catch (error) {
      toast.error('Error submitting: ' + error.message);
      console.error('Error submitting:', error);
    }
  };

  const handleModalSubmit = async () => {
    if (tempSelectedStains.size === 0) {
      toast.error('Please select at least one stain');
      return;
    }

    if (!formData.tech_initials.trim()) {
      toast.error('Tech initials are required');
      return;
    }

    // Validate date is not in the future
    const selectedDate = formData.date_prepared;
    if (isDateInFuture(selectedDate)) {
      toast.error('Date prepared cannot be in the future');
      return;
    }
    
    // Create submissions with the selected date
    const submissions = Array.from(tempSelectedStains).map(stainId => {
      return {
        stain_id: stainId,
        // Send the date exactly as selected in the input
        date_prepared: selectedDate,
        tech_initials: formData.tech_initials.trim(),
        stain_qc: null,
        path_initials: null,
        date_qc: null,
        comments: null,
        repeat_stain: false
      };
    });

    try {
      console.log('Modal submitting with date:', selectedDate);
      
      const { error } = await supabase
        .from('stain_submissions')
        .insert(submissions);

      if (error) {
        throw error;
      }

      resetFormData();
      setSelectedStains(new Set());
      setTempSelectedStains(new Set());
      setShowMultiSelect(false);
      fetchSubmissions();
      toast.success('Multiple stains submitted successfully!');
    } catch (error) {
      toast.error('Error submitting: ' + error.message);
      console.error('Error submitting:', error);
    }
  };

  return {
    selectedStains,
    tempSelectedStains,
    showMultiSelect,
    handleStainSelect,
    toggleMultiSelect,
    saveMultiSelection,
    handleSubmit,
    handleModalSubmit,
    setTempSelectedStains
  };
};
