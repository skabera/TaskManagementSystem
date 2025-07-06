import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { 
  Briefcase, Calendar, Plus, Search, Filter, 
  Archive, ChevronDown, MoreVertical, X, Edit, 
  Trash2, Info, ClipboardList, Clock, CheckCircle,
  CalendarRange, AlertCircle
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get("/projects/all");
      setProjects(res.data.value || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      showNotification("Failed to fetch projects", "error");
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

  const handleViewDetailsClick = (project) => {
    setSelectedProject(project);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const handleDeleteProject = async () => {
    try {
      await axiosInstance.delete(`/projects/delete/${selectedProject.id}`);
      setShowDeleteModal(false);
      fetchProjects();
      showNotification('Project deleted successfully!', 'success');
    } catch (err) {
      console.error('Error deleting project:', err);
      showNotification('Error deleting project. Please try again.', 'error');
    }
  };

  const getProjectStatus = (project) => {
    const now = new Date();
    
    if (!project.startDate) return "Not Started";
    
    const startDate = new Date(project.startDate);
    
    if (startDate > now) return "Upcoming";
    
    if (!project.endDate) return "In Progress";
    
    const endDate = new Date(project.endDate);
    
    if (endDate < now) return "Completed";
    
    return "In Progress";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Upcoming":
        return <Calendar className="w-4 h-4 text-indigo-500" />;
      case "In Progress":
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "Not Started":
        return <Clock className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Not Started":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getTimeframe = (project) => {
    if (!project.startDate && !project.endDate) return "No dates set";
    
    let timeframe = "";
    
    if (project.startDate) {
      timeframe += new Date(project.startDate).toLocaleDateString();
    } else {
      timeframe += "Not set";
    }
    
    timeframe += " to ";
    
    if (project.endDate) {
      timeframe += new Date(project.endDate).toLocaleDateString();
    } else {
      timeframe += "Not set";
    }
    
    return timeframe;
  };

  const getDuration = (project) => {
    if (!project.startDate || !project.endDate) return "Duration not set";
    
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day";
    return `${diffDays} days`;
  };

  const getProgress = (project) => {
    const status = getProjectStatus(project);
    
    if (status === "Not Started") return 0;
    if (status === "Upcoming") return 0;
    if (status === "Completed") return 100;
    
    if (!project.startDate || !project.endDate) return 0;
    
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const now = new Date();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const totalDuration = end - start;
    const elapsedDuration = now - start;
    
    return Math.round((elapsedDuration / totalDuration) * 100);
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedProjects = projects
    .filter(project => {
      const status = getProjectStatus(project);
      return (filterStatus === "All" || status === filterStatus) &&
        (searchTerm === "" || 
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "status":
          comparison = getProjectStatus(a).localeCompare(getProjectStatus(b));
          break;
        case "startDate":
          const dateA = a.startDate ? new Date(a.startDate) : new Date(8640000000000000);
          const dateB = b.startDate ? new Date(b.startDate) : new Date(8640000000000000);
          comparison = dateA - dateB;
          break;
        case "endDate":
          const endDateA = a.endDate ? new Date(a.endDate) : new Date(8640000000000000);
          const endDateB = b.endDate ? new Date(b.endDate) : new Date(8640000000000000);
          comparison = endDateA - endDateB;
          break;
        default:
          break;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });

  // Count projects by status
  const projectStatusCounts = projects.reduce((acc, project) => {
    const status = getProjectStatus(project);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                <Briefcase className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                <p className="text-gray-500">Manage and track all your projects in one place</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/dashboard/addproject")}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
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
                <p className="text-sm font-medium text-gray-500">Total Projects</p>
                <h3 className="text-2xl font-bold text-gray-900">{projects.length}</h3>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <Briefcase className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Upcoming</p>
                <h3 className="text-2xl font-bold text-gray-900">{projectStatusCounts["Upcoming"] || 0}</h3>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <h3 className="text-2xl font-bold text-gray-900">{projectStatusCounts["In Progress"] || 0}</h3>
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
                <h3 className="text-2xl font-bold text-gray-900">{projectStatusCounts["Completed"] || 0}</h3>
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
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
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
                  <option value="Not Started">Not Started</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {filteredAndSortedProjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort("name")}
                        className="flex items-center focus:outline-none"
                      >
                        Project Name
                        {sortBy === "name" && (
                          <ChevronDown size={14} className={`ml-1 text-gray-400 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
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
                          <ChevronDown size={14} className={`ml-1 text-gray-400 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort("startDate")}
                        className="flex items-center focus:outline-none"
                      >
                        Start Date
                        {sortBy === "startDate" && (
                          <ChevronDown size={14} className={`ml-1 text-gray-400 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort("endDate")}
                        className="flex items-center focus:outline-none"
                      >
                        End Date
                        {sortBy === "endDate" && (
                          <ChevronDown size={14} className={`ml-1 text-gray-400 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredAndSortedProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{project.name}</div>
                        {project.description && (
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                            {project.description.substring(0, 60)}
                            {project.description.length > 60 ? "..." : ""}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(getProjectStatus(project))}`}>
                          {getStatusIcon(getProjectStatus(project))}
                          <span className="ml-1">{getProjectStatus(project)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {project.startDate ? (
                          <div className="text-sm text-gray-900">
                            {new Date(project.startDate).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {project.endDate ? (
                          <div className="text-sm text-gray-900">
                            {new Date(project.endDate).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full" 
                            style={{ width: `${getProgress(project)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{getProgress(project)}% Complete</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetailsClick(project)}
                            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-indigo-600 focus:outline-none"
                            title="View Details"
                          >
                            <Info size={18} />
                          </button>
                          {/* <button
                            onClick={() => navigate(`/dashboard/editproject/${project.id}`)}
                            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-amber-600 focus:outline-none"
                            title="Edit Project"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(project)}
                            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-600 focus:outline-none"
                            title="Delete Project"
                          >
                            <Trash2 size={18} />
                          </button> */}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-500 max-w-sm">
                {searchTerm || filterStatus !== "All" 
                  ? "No projects match your current filters. Try adjusting your search criteria."
                  : "Get started by creating your first project."}
              </p>
              {(searchTerm || filterStatus !== "All") && (
                <button 
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("All");
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

      {/* View Details Modal */}
      {showDetailModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X size={20} />
            </button>
            
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
                <Briefcase className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{selectedProject.name}</h3>
              <div className="mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(getProjectStatus(selectedProject))}`}>
                  {getStatusIcon(getProjectStatus(selectedProject))}
                  <span className="ml-1">{getProjectStatus(selectedProject)}</span>
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {selectedProject.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-800 border border-gray-100">
                    {selectedProject.description}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Timeline</h4>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm border border-gray-100">
                    <div className="flex items-center mb-2">
                      <CalendarRange size={16} className="mr-2 text-gray-500" />
                      <span className="text-gray-800">{getTimeframe(selectedProject)}</span>
                    </div>
                    {selectedProject.startDate && selectedProject.endDate && (
                      <div className="text-xs text-gray-500">
                        Duration: {getDuration(selectedProject)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Progress</h4>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm border border-gray-100">
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div 
                        className="bg-indigo-600 h-3 rounded-full" 
                        style={{ width: `${getProgress(selectedProject)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {getProgress(selectedProject)}% Complete
                    </div>
                  </div>
                </div>
              </div>
              
              
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
              {/* <button
                onClick={() => {
                  setShowDetailModal(false);
                  navigate(`/dashboard/editproject/${selectedProject.id}`);
                }}
                className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Project
              </button> */}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fadeIn">
            <div className="text-center mb-5">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Project</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete <span className="font-medium">{selectedProject.name}</span>? This action cannot be undone.
              </p>
            </div>
            
            <div className="mt-5 flex justify-center space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
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

export default ProjectList;