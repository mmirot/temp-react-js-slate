import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Daily Task Submission</h1>
          <Routes>
            <Route path="/" element={<TaskForm />} />
            <Route path="/tasks" element={<TaskList />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
