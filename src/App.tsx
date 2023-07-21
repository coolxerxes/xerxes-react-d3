import React from 'react';
import logo from './logo.svg';
import './App.css';
import RadialStackedAreaChart from './RadialStackedAreaChart';

function App() {
  const data = [
    {
      category: 'Detection & Response',
      value: 25.0,
    },
    {
      category: 'Vulnerability Management',
    },
    {
      category: 'Training & Awareness',
      value: 40.0,
    },
    {
      category: 'Cloud Security',
      value: 80,
    },
    {
      category: 'Detection & Response',
    },
    {
      category: 'Vulnerability Management',
    },
    {
      category: 'Training & Awareness',
    },
    {
      category: 'Cloud Security',
    },
  ]

  return (
    <div>
      <RadialStackedAreaChart data={data}/>
    </div>
  );

}

export default App;
