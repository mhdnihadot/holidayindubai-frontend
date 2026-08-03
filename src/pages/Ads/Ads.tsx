import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdList from './AdList';
import AddAd from './AddAd';
import EditAd from './EditAd';

const Ads: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AdList />} />
      <Route path="add" element={<AddAd />} />
      <Route path="edit/:id" element={<EditAd />} />
    </Routes>
  );
};

export default Ads;
