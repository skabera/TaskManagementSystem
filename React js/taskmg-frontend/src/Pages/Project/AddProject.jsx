import React, { useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  FilePlus,
  Calendar,
  ClipboardList,
  Flag,
  FolderPlus,
  LoaderCircle,
  Info,
  ArrowLeft,
} from "lucide-react";
const AddProject = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      await axiosInstance.post("/Project/create", formData);
      // navigate('/projects'); // Redirect to project list
      alert("Project Created successful!");
    } catch (err) {
      console.error("Error creating project", err);
      setError("Failed to create project.");
    }
  };

  return (
    <div>
      <div className="flex justify-between max-w-4xl mx-auto items-center mb-6">
        <div className="flex items-center gap-2">
          <FilePlus className="text-indigo-600 w-6 h-6" />
          <h2 className="text-xl font-bold text-gray-800">Add New Project</h2>
        </div>
        <button
          onClick={() => navigate("/dashboard/getProject")}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-lg transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Project
        </button>
      </div>
      <div className="p-6 max-w-2xl mx-auto">
       
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md space-y-4"
        >
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Project Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
