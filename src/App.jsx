import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import { loadDashboardData } from './data/dataGenerator';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const dashboardData = await loadDashboardData();
        setData(dashboardData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading alumni outcomes data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-error">
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Dashboard data={data} />
    </div>
  );
}

export default App;
