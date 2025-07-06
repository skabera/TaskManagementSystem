import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { FilePlus, Calendar, ClipboardList, Flag, FolderPlus, LoaderCircle, Info,ArrowLeft } from 'lucide-react';

const AddTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: '',
    dueDate: '',
    projectId: '',
  });

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/projects/all')
      .then(res => setProjects(res.data.value || []))
      .catch(err => console.error('Error loading projects:', err));

    axiosInstance.get('/users/all')
      .then(res => setUsers(res.data.value || []))
      .catch(err => console.error('Error loading users:', err));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.status || !formData.projectId) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      await axiosInstance.post('/tasks/create', formData);
      alert("✅ Task Created Successfully!");
    } catch (err) {
      console.error('Failed to add task:', err);
      setError('Error adding task.');
    }
  };

  return (
    <div>
        <div className="flex justify-between max-w-5xl mx-auto items-center mb-6">
            <div className="flex items-center gap-2">
                <FilePlus className="text-indigo-600 w-6 h-6" />
                <h2 className="text-2xl font-bold text-gray-800">Add New Task</h2>
            </div>
            <button
                onClick={() => navigate('/dashboard/getTask')}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-lg transition"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Tasks
            </button>
        </div>

    <div className="p-6 max-w-4xl mx-auto">     

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm flex items-center gap-2">
            <Info size={16} />
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <ClipboardList size={16} /> Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Info size={16} /> Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="3"
          />
        </div>

        {/* Priority and Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Flag size={16} /> Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Calendar size={16} /> Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>

        {/* Project and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <FolderPlus size={16} /> Project *
            </label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            >
              <option value="">Select project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <LoaderCircle size={16} /> Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            >
              <option value="Pending">Pending</option>
              <option value="InProgress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white text-lg font-semibold py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
        >
          Create Task
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddTask;
