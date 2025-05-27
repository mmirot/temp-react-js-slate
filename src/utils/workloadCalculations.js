
// Utility functions for workload calculations
import { formatDate } from './dateUtils';

// Calculate slide total: Standard slides + 0.5 × LB slides
// Treat null, undefined, empty string, or "0" as 0
export const calculateSlideTotal = (stdSlides = 0, lbSlides = 0) => {
  // Convert to number, treating null, undefined, empty string as 0
  const stdNum = (stdSlides === null || stdSlides === undefined || stdSlides === '') ? 0 : parseInt(stdSlides) || 0;
  const lbNum = (lbSlides === null || lbSlides === undefined || lbSlides === '') ? 0 : parseInt(lbSlides) || 0;
  
  const total = stdNum + (lbNum * 0.5);
  console.log('🧮 Slide calculation - Std:', stdSlides, '→', stdNum, 'LB:', lbSlides, '→', lbNum, 'Total:', total);
  
  return total;
};

// Aggregate daily workload data by pathologist and date
export const aggregateDailyWorkload = (submissions) => {
  console.log('📊 Starting aggregation for', submissions.length, 'submissions');
  const aggregated = {};
  
  submissions.forEach((submission, index) => {
    if (!submission.date_screened || !submission.path_initials) {
      console.log(`⚠️ Skipping submission ${index} - missing date_screened or path_initials:`, submission);
      return;
    }
    
    const key = `${submission.path_initials}-${submission.date_screened}`;
    
    if (!aggregated[key]) {
      aggregated[key] = {
        id: key,
        path_initials: submission.path_initials,
        date_screened: submission.date_screened,
        slide_total: 0,
        time_minutes: 0,
        case_count: 0,
        date_prepared_earliest: submission.date_prepared,
        date_prepared_latest: submission.date_prepared
      };
      console.log('📝 Created new aggregation entry for:', key);
    }
    
    const entry = aggregated[key];
    
    // Calculate slide total properly for each submission, treating null/empty as 0
    const submissionSlideTotal = calculateSlideTotal(
      submission.std_slide_number, 
      submission.lb_slide_number
    );
    
    console.log(`📋 Processing submission ${index}:`, {
      accession: submission.accession_number,
      std_slides: submission.std_slide_number,
      lb_slides: submission.lb_slide_number,
      slide_total: submissionSlideTotal,
      time_minutes: submission.time_minutes
    });
    
    // Add to slide total
    entry.slide_total += submissionSlideTotal;
    
    // Add to time minutes
    entry.time_minutes += submission.time_minutes || 0;
    
    // Increment case count
    entry.case_count += 1;
    
    // Track date prepared range
    if (submission.date_prepared < entry.date_prepared_earliest) {
      entry.date_prepared_earliest = submission.date_prepared;
    }
    if (submission.date_prepared > entry.date_prepared_latest) {
      entry.date_prepared_latest = submission.date_prepared;
    }
    
    console.log(`📈 Updated aggregation for ${key}:`, {
      slide_total: entry.slide_total,
      time_minutes: entry.time_minutes,
      case_count: entry.case_count
    });
  });
  
  // Convert to array and add limit calculation
  const result = Object.values(aggregated).map(entry => ({
    ...entry,
    limit: (entry.slide_total <= 100 && entry.time_minutes <= 480) ? 'NO' : 'YES',
    date_prepared_display: entry.date_prepared_earliest === entry.date_prepared_latest 
      ? formatDate(entry.date_prepared_earliest)
      : `${formatDate(entry.date_prepared_earliest)} - ${formatDate(entry.date_prepared_latest)}`
  }));
  
  console.log('🏁 Final aggregation result:', result);
  return result;
};

// Sort aggregated workload data
export const sortAggregatedData = (data, sortConfig) => {
  if (!data || !sortConfig || !sortConfig.key) return data;
  
  const sortedData = [...data];
  sortedData.sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (!aValue) return 1;
    if (!bValue) return -1;

    if (sortConfig.key.includes('date')) {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sortedData;
};
