import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { ClipboardList, Eye, Calendar, CheckCircle, Clock, AlertCircle, X, ChevronRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchTasks(), fetchUsers(), fetchProjects()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get("/tasks/all");
      const allTasks = Array.isArray(res.data?.value) ? res.data.value : [];
      const userId = localStorage.getItem("userId");
      const filteredTasks = allTasks.filter((task) => task.userID == userId);
      setTasks(filteredTasks);
      return filteredTasks;
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setTasks([]); 
      return [];
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users/all");
      setUsers(res.data.value || []);
      return res.data.value || [];
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
      return [];
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get("/projects/all");
      setProjects(res.data.value || []);
      return res.data.value || [];
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setProjects([]);
      return [];
    }
  };

  const handleViewDetailsClick = (task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const handleChangeStatusClick = (task) => {
    setSelectedTask(task);
    setNewStatus(task.status);
    setShowStatusModal(true);
  };

  const updateTaskStatus = async () => {
    try {
      await axiosInstance.put(`/tasks/${selectedTask.id}`, {
        ...selectedTask,
        status: newStatus
      });
      
      // Update local state
      setTasks(tasks.map(task => 
        task.id === selectedTask.id ? { ...task, status: newStatus } : task
      ));
      
      setShowStatusModal(false);
      // Refresh the task list
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    return project ? project.name : "N/A";
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unassigned";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "InProgress":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4 text-amber-600" />;
      case "InProgress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border border-red-200";
      case "Medium":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "Low":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today && !due.toDateString() === today.toDateString();
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <ClipboardList className="text-indigo-600 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setFilter("all")}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                filter === "all"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } transition-colors duration-200`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setFilter("Pending")}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                filter === "Pending"
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } transition-colors duration-200`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("InProgress")}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                filter === "InProgress"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } transition-colors duration-200`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter("Completed")}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                filter === "Completed"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } transition-colors duration-200`}
            >
              Completed
            </button>
          </nav>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ClipboardList className="text-gray-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
            <p className="text-gray-500 mb-6">
              {filter === "all" 
                ? "You don't have any assigned tasks yet." 
                : `You don't have any ${filter.toLowerCase()} tasks.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl shadow-sm hover:shadow transition-shadow border border-gray-100 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{task.title}</h3>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${getStatusBadge(
                        task.status
                      )}`}
                    >
                      {getStatusIcon(task.status)}
                      {task.status}
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium">
                      {getProjectName(task.projectId)}
                    </span>
                    {task.priority && (
                      <span className={`text-xs ml-2 px-2.5 py-1 rounded-full font-medium ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-5 line-clamp-2">
                    {task.description || "No description provided"}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm ${isOverdue(task.dueDate) ? "text-red-600 font-medium" : "text-gray-500"}`}>
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleChangeStatusClick(task)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded transition-colors"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleViewDetailsClick(task)}
                        className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-1 px-2 rounded transition-colors flex items-center gap-1"
                      >
                        <Eye size={14} /> View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {showDetailModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Task Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 max-h-[70vh] overflow-y-auto">
              {/* Status Badge */}
              <div className="flex justify-end mb-4">
                <span
                  className={`text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 ${getStatusBadge(
                    selectedTask.status
                  )}`}
                >
                  {getStatusIcon(selectedTask.status)}
                  {selectedTask.status}
                </span>
              </div>
              
              {/* Title */}
              <h4 className="text-xl font-semibold text-gray-800 mb-3">{selectedTask.title}</h4>
              
              {/* Description */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700 whitespace-pre-line">
                  {selectedTask.description || "No description provided"}
                </p>
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Project</p>
                  <p className="text-sm font-medium text-gray-800">{getProjectName(selectedTask.projectId)}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Assigned To</p>
                  <p className="text-sm font-medium text-gray-800">{getUserName(selectedTask.userID)}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Priority</p>
                  <p className="text-sm font-medium text-gray-800">{selectedTask.priority || "None"}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Due Date</p>
                  <p className={`text-sm font-medium ${isOverdue(selectedTask.dueDate) ? "text-red-600" : "text-gray-800"}`}>
                    {formatDate(selectedTask.dueDate)}
                  </p>
                </div>
              </div>
              
              {/* Action Button */}
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleChangeStatusClick(selectedTask);
                }}
                className="w-full mt-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
              >
                Update Status <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Update Task Status</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5">
              <div className="mb-4">
                <h4 className="text-base font-medium text-gray-800 mb-2">Task: {selectedTask.title}</h4>
                <p className="text-sm text-gray-500 mb-6">Select a new status for this task</p>
                
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="Pending"
                      checked={newStatus === "Pending"}
                      onChange={() => setNewStatus("Pending")}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-3 flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full bg-amber-500`}></span>
                      <span className="font-medium text-gray-700">Pending</span>
                    </span>
                  </label>
                  
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="InProgress"
                      checked={newStatus === "InProgress"}
                      onChange={() => setNewStatus("InProgress")}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-3 flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full bg-blue-500`}></span>
                      <span className="font-medium text-gray-700">In Progress</span>
                    </span>
                  </label>
                  
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="Completed"
                      checked={newStatus === "Completed"}
                      onChange={() => setNewStatus("Completed")}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-3 flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full bg-emerald-500`}></span>
                      <span className="font-medium text-gray-700">Completed</span>
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateTaskStatus}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;