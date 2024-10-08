import React from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader'; 
import { BrowserRouter, Route,Router,Routes } from 'react-router-dom';
import AddLabel from './components/AddLabel';
import Header from './components/Header';
import MapTable from './components/MapTable';
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<ImageUploader />} /> 
        <Route path="/dimensionless_img" element={<AddLabel />} /> 
        <Route path="/table" element={<MapTable />} /> 
      </Routes>
  </BrowserRouter>
  );
}

export default App;

