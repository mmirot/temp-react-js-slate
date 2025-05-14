import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TaskForm({ onSubmitted }) {
  const [name, setName] = useState('');
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('task_submissions').insert([{ name, response }]);

    if (error) {
      alert('Error submitting: ' + error.message);
    } else {
      setSubmitted(true);
      setName('');
      setResponse('');
      onSubmitted(); // Notify parent to refresh task list
    }
  };

  if (submitted) return <p>✅ Submission received. Thank you!</p>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, marginBottom: '2rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Task Response:</label>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          required
          style={{ width: '100%', height: 100 }}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
