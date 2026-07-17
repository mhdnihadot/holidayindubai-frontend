import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProjectList from './ProjectList';
import AddProject from './AddProject';
import EditProject from './EditProject';

const Projects: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ProjectList />} />
      <Route path="add" element={<AddProject />} />
      <Route path="edit/:id" element={<EditProject />} />
    </Routes>
  );
};

export default Projects;
