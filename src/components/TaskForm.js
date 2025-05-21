
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TaskForm({ onSubmitted }) {
  const [formData, setFormData] = useState({
    name: '',
    completed_goals: '',
    blockers: '',
    mood: '',
    task_id: '',
  });
  const [tasks, setTasks] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from('tasks').select('id, title');
      if (error) {
        console.error('Error fetching tasks:', error.message);
      } else {
        setTasks(data);
      }
    };
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('task_submissions').insert([formData]);

    if (error) {
      alert('Error submitting: ' + error.message);
    } else {
      setSubmitted(true);
      setFormData({
        name: '',
        completed_goals: '',
        blockers: '',
        mood: '',
        task_id: '',
      });
      onSubmitted(); // Refresh task list
    }
  };

  if (submitted) return <p>✅ Submission received. Thank you!</p>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, marginBottom: '2rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Select Task:</label>
        <select
          name="task_id"
          value={formData.task_id}
          onChange={handleChange}
          required
          style={{ width: '100%' }}
        >
          <option value="">-- Select a task --</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Completed Goals:</label>
        <textarea
          name="completed_goals"
          value={formData.completed_goals}
          onChange={handleChange}
          required
          style={{ width: '100%', height: 80 }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Blockers:</label>
        <textarea
          name="blockers"
          value={formData.blockers}
          onChange={handleChange}
          required
          style={{ width: '100%', height: 80 }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Mood:</label>
        <input
          type="text"
          name="mood"
          value={formData.mood}
          onChange={handleChange}
          required
          style={{ width: '100%' }}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
