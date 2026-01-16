import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AppDetails from './components/AppDetails';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app/:id" element={<AppDetails />} />
      </Routes>
    </HashRouter>
  );
};

export default App;