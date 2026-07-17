import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminProjectService } from '../../services/admin.project.service';
import { type Project } from '../../services/project.service';

export const fetchProjectsThunk = createAsyncThunk(
  'project/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminProjectService.getAll();
      return response.data; // Assuming backend returns { status: 'success', data: [...] }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

export const createProjectThunk = createAsyncThunk(
  'project/create',
  async (data: Partial<Project>, { rejectWithValue }) => {
    try {
      const response = await adminProjectService.create(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);

export const updateProjectThunk = createAsyncThunk(
  'project/update',
  async ({ id, data }: { id: string; data: Partial<Project> }, { rejectWithValue }) => {
    try {
      const response = await adminProjectService.update(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update project');
    }
  }
);

export const deleteProjectThunk = createAsyncThunk(
  'project/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await adminProjectService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
    }
  }
);
