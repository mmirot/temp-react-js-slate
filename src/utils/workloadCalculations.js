
// Utility functions for workload calculations
import { formatDate } from './dateUtils';

// Calculate slide total: Standard slides + 0.5 × LB slides
export const calculateSlideTotal = (stdSlides = 1, lbSlides = 1) => {
  return stdSlides + (lbSlides * 0.5);
};

// Aggregate daily workload data by pathologist and date
export const aggregateDailyWorkload = (submissions) => {
  const aggregated = {};
  
  submissions.forEach(submission => {
    if (!submission.date_screened || !submission.path_initials) return;
    
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
    }
    
    const entry = aggregated[key];
    
    // Add to slide total (1 std slide + 0.5 for each LB slide)
    entry.slide_total += calculateSlideTotal(1, 1);
    
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
  });
  
  // Convert to array and add limit calculation
  return Object.values(aggregated).map(entry => ({
    ...entry,
    limit: (entry.slide_total <= 100 && entry.time_minutes <= 480) ? 'NO' : 'YES',
    date_prepared_display: entry.date_prepared_earliest === entry.date_prepared_latest 
      ? formatDate(entry.date_prepared_earliest)
      : `${formatDate(entry.date_prepared_earliest)} - ${formatDate(entry.date_prepared_latest)}`
  }));
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
