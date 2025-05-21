
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function TaskList() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data, error } = await supabase
        .from('task_submissions')
        .select(`
          id,
          task_id,
          name,
          completed_goals,
          blockers,
          mood,
          submitted_at
        `)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error.message);
      } else {
        setSubmissions(data);
      }

      setLoading(false);
    };

    fetchSubmissions();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!submissions.length) return <p>No submissions found.</p>;

  return (
    <div>
      <h2>Submitted Tasks</h2>
      <ul>
        {submissions.map((submission) => (
          <li key={submission.id}>
            <strong>{submission.name}</strong> submitted a task on{' '}
            {new Date(submission.submitted_at).toLocaleString()}.
            <br />
            <em>Mood:</em> {submission.mood}<br />
            <em>Goals:</em> {submission.completed_goals}<br />
            <em>Blockers:</em> {submission.blockers}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
