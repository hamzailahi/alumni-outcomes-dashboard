import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import './Dashboard.css';

const Dashboard = ({ data }) => {
  const [selectedSchool, setSelectedSchool] = useState('harvard');
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMajor, setSelectedMajor] = useState('cs');
  const [view, setView] = useState('student'); // student, college, counselor

  if (!data) {
    return <div className="dashboard">Loading...</div>;
  }

  const school = data.schools[selectedSchool];
  const placementKey = `${selectedSchool}_${selectedYear}`;
  const placement = data.placements[placementKey];

  if (!placement) {
    return <div className="dashboard">No data available</div>;
  }

  const majorData = placement.byMajor[selectedMajor];
  const citiesByCount = [...placement.byCity].sort((a, b) => b.count - a.count);
  const topCities = citiesByCount.slice(0, 6);

  // Prepare chart data
  const cityChartData = topCities.map((city) => ({
    name: city.name,
    count: city.count,
    pct: city.pct,
  }));

  const majorChartData = Object.entries(placement.byMajor).map(([key, data]) => ({
    major: data.majors?.[key]?.name || key,
    salary: data.medianSalary,
    count: data.count,
  }));

  const employerChartData = placement.byEmployer.slice(0, 8).map((emp) => ({
    name: emp.name,
    count: emp.count,
    salary: emp.medianSalary,
  }));

  const insightText = {
    student: `${school.name} graduates primarily land in ${topCities[0]?.name} (${topCities[0]?.pct}%). If you're interested in ${placement.byMajor[selectedMajor]?.topEmployers?.[0]}, this school has a proven pipeline.`,
    college: `${school.name}'s ${selectedYear} cohort had ${placement.totalGraduates} graduates. Your strongest placement is in ${topCities[0]?.name} with ${topCities[0]?.count} grads. Compare this to peer institutions to identify gaps.`,
    counselor: `Students with ${Object.keys(data.majors)[selectedMajor]} interests should consider ${school.name}. Average time-to-hire is ${placement.timeToHireMonths.toFixed(1)} months, and median salary for this major is $${majorData?.medianSalary?.toLocaleString()}.`,
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Alumni Outcomes Explorer</h1>
          <p>Where do graduates actually go? Select a school and explore.</p>
        </div>
      </header>

      <div className="controls-section">
        <div className="view-tabs">
          {['student', 'college', 'counselor'].map((v) => (
            <button
              key={v}
              className={`view-tab ${view === v ? 'active' : ''}`}
              onClick={() => setView(v)}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)} View
            </button>
          ))}
        </div>

        <div className="school-selector">
          <label>Select School:</label>
          <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)}>
            {Object.entries(data.schools).map(([key, school]) => (
              <option key={key} value={key}>
                {school.name}
              </option>
            ))}
          </select>
        </div>

        <div className="year-selector">
          <label>Year:</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
            {[2022, 2023, 2024].map((year) => (
              <option key={year} value={year}>
                Class of {year}
              </option>
            ))}
          </select>
        </div>

        <div className="major-selector">
          <label>Focus Major:</label>
          <select value={selectedMajor} onChange={(e) => setSelectedMajor(e.target.value)}>
            {Object.entries(data.majors).map(([key, major]) => (
              <option key={key} value={key}>
                {major.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Panel: Main Chart */}
        <div className="main-panel">
          <div className="chart-container">
            <h3>Top Destination Cities</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0D9488" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Salary by Major</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={majorChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="major" />
                <YAxis />
                <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Bar dataKey="salary" fill="#D85A30" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Panel: Stats & Insights */}
        <aside className="sidebar">
          <div className="stats-card">
            <p className="stat-label">Median Salary</p>
            <p className="stat-value">${majorData?.medianSalary?.toLocaleString()}</p>
          </div>

          <div className="stats-card">
            <p className="stat-label">Time to First Job</p>
            <p className="stat-value">{placement.timeToHireMonths.toFixed(1)} months</p>
          </div>

          <div className="stats-card">
            <p className="stat-label">Total Graduates</p>
            <p className="stat-value">{placement.totalGraduates}</p>
          </div>

          <div className="stats-card">
            <p className="stat-label">Top Destination</p>
            <p className="stat-value">{topCities[0]?.name}</p>
          </div>

          <div className="employers-card">
            <h4>Top Employers</h4>
            <div className="employer-list">
              {employerChartData.slice(0, 6).map((emp) => (
                <div key={emp.name} className="employer-item">
                  <span className="emp-name">{emp.name}</span>
                  <span className="emp-count">{emp.count} grads</span>
                </div>
              ))}
            </div>
          </div>

          <div className="insight-card">
            <h4>{view.charAt(0).toUpperCase() + view.slice(1)} Insight</h4>
            <p>{insightText[view]}</p>
          </div>
        </aside>
      </div>

      <div className="footer">
        <p>Data sourced from College Scorecard API + alumni placement research. Class of {selectedYear}.</p>
      </div>
    </div>
  );
};

export default Dashboard;
