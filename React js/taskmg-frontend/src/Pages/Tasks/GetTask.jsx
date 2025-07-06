import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { 
  CheckCircle, ClipboardList, AlertCircle, Calendar, 
  Plus, Eye, UserPlus, Filter, Search, Archive, 
  ChevronDown, MoreVertical, X, Check, ArrowUpDown,
  Clock, Briefcase, Flag
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterProject, setFilterProject] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortDirection, setSortDirection] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    const res = await axiosInstance.get("/tasks/all");
    setTasks(res.data.value || []);
  };

  const fetchUsers = async () => {
    const res = await axiosInstance.get("/users/all");
    setUsers(res.data.value || []);
  };

  const fetchProjects = async () => {
    const res = await axiosInstance.get("/projects/all");
    setProjects(res.data.value || []);
  };

  const handleAssignClick = (task) => {
    setSelectedTask(task);
    setSelectedUserId(task.userID || "");
    setShowAssignModal(true);
  };

  const handleViewDetailsClick = (task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const handleAssignUser = async () => {
    try {
      await axiosInstance.put(`/tasks/update/user/${selectedTask.id}`, selectedUserId, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setShowAssignModal(false);
      fetchTasks();
      showNotification('User assigned successfully!', 'success');
    } catch (err) {
      console.error('Error assigning user:', err);
      showNotification('Error assigning user. Please try again.', 'error');
    }
  };

  const showNotification = (message, type) => {
    const notificationEl = document.createElement('div');
    notificationEl.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white ${
      type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
    } animate-fadeIn`;
    notificationEl.textContent = message;
    document.body.appendChild(notificationEl);
    
    setTimeout(() => {
      notificationEl.classList.add('animate-fadeOut');
      setTimeout(() => {
        document.body.removeChild(notificationEl);
      }, 500);
    }, 2500);
  };

  const getProjectName = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    return project ? project.name : "N/A";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "InProgress":
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "InProgress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-amber-600";
      case "Low":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getTimeRemaining = (dueDate) => {
    if (!dueDate) return "No deadline";
    
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `${diffDays} days left`;
  };

  const getTimeRemainingClass = (dueDate) => {
    if (!dueDate) return "text-gray-500";
    
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "text-red-600";
    if (diffDays <= 2) return "text-amber-600";
    return "text-emerald-600";
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedTasks = tasks
    .filter(task => 
      (filterStatus === "All" || task.status === filterStatus) &&
      (filterProject === "All" || task.projectId === parseInt(filterProject)) &&
      (searchTerm === "" || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        getProjectName(task.projectId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        users.find(u => u.id === task.userID)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "project":
          comparison = getProjectName(a.projectId).localeCompare(getProjectName(b.projectId));
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "priority":
          const priorityOrder = { "High": 1, "Medium": 2, "Low": 3, "": 4 };
          comparison = (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
          break;
        case "dueDate":
          const dateA = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000);
          const dateB = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);
          comparison = dateA - dateB;
          break;
        case "assignee":
          const nameA = users.find(u => u.id === a.userID)?.name || "zzz";
          const nameB = users.find(u => u.id === b.userID)?.name || "zzz";
          comparison = nameA.localeCompare(nameB);
          break;
        default:
          break;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const taskStatusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const getAssigneeAvatar = (userId) => {
    if (!userId) return null;
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    
    const initials = user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
      
    return (
      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-xs">
        {initials}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                <ClipboardList className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
                <p className="text-gray-500">Manage and track all your tasks in one place</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/dashboard/addtask")}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                <h3 className="text-2xl font-bold text-gray-900">{tasks.length}</h3>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <ClipboardList className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <h3 className="text-2xl font-bold text-gray-900">{taskStatusCounts["Pending"] || 0}</h3>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <h3 className="text-2xl font-bold text-gray-900">{taskStatusCounts["InProgress"] || 0}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <h3 className="text-2xl font-bold text-gray-900">{taskStatusCounts["Completed"] || 0}</h3>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="flex-1 mb-4 md:mb-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <div className="relative inline-block">
                <div className="flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-4 w-4 text-gray-500" />
                  </div>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>
              
              <div className="relative inline-block">
                <div className="flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                  </div>
                  <select 
                    value={filterProject}
                    onChange={(e) => setFilterProject(e.target.value)}
                    className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="All">All Projects</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {filteredAndSortedTasks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort("title")}
                        className="flex items-center focus:outline-none"
                      >
                        Title 
                        {sortBy === "title" && (
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort("project")}
                        className="flex items-center focus:outline-none"
                      >
                        Project
                        {sortBy === "project" && (
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort("status")}
                        className="flex items-center focus:outline-none"
                      >
                        Status
                        {sortBy === "status" && (
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort("priority")}
                        className="flex items-center focus:outline-none"
                      >
                        Priority
                        {sortBy === "priority" && (
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort("dueDate")}
                        className="flex items-center focus:outline-none"
                      >
                        Due Date
                        {sortBy === "dueDate" && (
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort("assignee")}
                        className="flex items-center focus:outline-none"
                      >
                        Assignee
                        {sortBy === "assignee" && (
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredAndSortedTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        {task.description && (
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                            {task.description.substring(0, 40)}
                            {task.description.length > 40 ? "..." : ""}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                          <Briefcase size={12} className="mr-1" />
                          {getProjectName(task.projectId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(task.status)}`}>
                          {getStatusIcon(task.status)}
                          <span className="ml-1">{task.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {task.priority ? (
                          <div className={`inline-flex items-center ${getPriorityClass(task.priority)}`}>
                            <Flag size={14} className="mr-1" />
                            <span className="text-sm">{task.priority}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {task.dueDate ? (
                          <div>
                            <div className="text-sm text-gray-900">{task.dueDate?.split("T")[0]}</div>
                            <div className={`text-xs ${getTimeRemainingClass(task.dueDate)}`}>
                              {getTimeRemaining(task.dueDate)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No deadline</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {task.userID ? (
                          <div className="flex items-center">
                            {getAssigneeAvatar(task.userID)}
                            <span className="ml-2 text-sm text-gray-900">
                              {users.find((u) => u.id === task.userID)?.name}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-500">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                              <UserPlus size={14} />
                            </div>
                            <span className="ml-2 text-sm">Unassigned</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetailsClick(task)}
                            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-indigo-600 focus:outline-none"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleAssignClick(task)}
                            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-indigo-600 focus:outline-none"
                            title="Assign User"
                          >
                            <UserPlus size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Archive className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500 max-w-sm">
                {searchTerm || filterStatus !== "All" || filterProject !== "All" 
                  ? "No tasks match your current filters. Try adjusting your search criteria."
                  : "Get started by creating your first task."}
              </p>
              {(searchTerm || filterStatus !== "All" || filterProject !== "All") && (
                <button 
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("All");
                    setFilterProject("All");
                  }}
                  className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Assign User Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowAssignModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-4">
              <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Assign Task</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a team member to assign this task to
              </p>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Task</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-800">
                {selectedTask?.title}
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
              <div className="relative">
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">-- Unassigned --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignUser}
                className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <div className="flex items-center">
                  <Check size={16} className="mr-1.5" />
                  Confirm
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X size={20} />
            </button>
            
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{selectedTask.title}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(selectedTask.status)}`}>
                  {getStatusIcon(selectedTask.status)}
                  <span className="ml-1">{selectedTask.status}</span>
                </div>
                
                {selectedTask.priority && (
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityClass(selectedTask.priority)} bg-white`}>
                    <Flag size={14} className="mr-1" />
                    <span>{selectedTask.priority} Priority</span>
                  </div>
                )}
                
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                  <Briefcase size={12} className="mr-1" />
                  {getProjectName(selectedTask.projectId)}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {selectedTask.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-800 border border-gray-100">
                    {selectedTask.description}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Assignee</h4>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm flex items-center border border-gray-100">
                    {selectedTask.userID ? (
                      <>
                        {getAssigneeAvatar(selectedTask.userID)}
                        <span className="ml-2">
                          {users.find((u) => u.id === selectedTask.userID)?.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-500">Unassigned</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Due Date</h4>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm border border-gray-100">
                    {selectedTask.dueDate ? (
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-gray-500" />
                        <div>
                          <div>{selectedTask.dueDate?.split("T")[0]}</div>
                          <div className={`text-xs ${getTimeRemainingClass(selectedTask.dueDate)}`}>
                            {getTimeRemaining(selectedTask.dueDate)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">No deadline set</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS for Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-10px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-fadeOut {
          animation: fadeOut 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TaskList;