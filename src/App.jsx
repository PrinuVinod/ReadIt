import React from 'react';
import Dashboard from '../src/components/dashboard/dashboard'; // Ensure the path matches your project structure
import './App.css'; // You can create this file for styling

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Book Tracker App</h1>
      </header>
      <main>
        <Dashboard />
      </main>
    </div>
  );
};

export default App;
