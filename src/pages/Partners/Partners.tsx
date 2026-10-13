import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PartnerList from './PartnerList';
import PartnerDetails from './PartnerDetails';
import ChangeRequests from './ChangeRequests';

const Partners: React.FC = () => {
  return (
    <Routes>
      <Route index element={<PartnerList />} />
      <Route path="requests" element={<ChangeRequests />} />
      <Route path=":id" element={<PartnerDetails />} />
    </Routes>
  );
};

export default Partners;
