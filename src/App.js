import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch submissions from Supabase
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

  // Call fetchSubmissions on initial render and when form is submitted
  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Daily Task Submission</h1>
        <TaskForm onSubmitted={fetchSubmissions} />
        <h2 style={{ marginTop: '2rem' }}>Submitted Tasks</h2>
        {loading ? <p>Loading...</p> : <TaskList tasks={submissions} />}
      </header>
    </div>
  );
}

export default App;
