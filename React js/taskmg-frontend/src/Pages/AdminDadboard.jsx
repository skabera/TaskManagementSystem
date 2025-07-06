import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, CheckCircle, AlertCircle, Clock, User, Briefcase, List } from 'lucide-react';
import axiosInstance from '../axiosInstance'; 

function ManagerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchTasks(), fetchUsers(), fetchProjects()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Existing fetch functions from your code
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

  // Dashboard metrics and statistics
  const getTasksByStatus = () => {
    const statusCount = { Pending: 0, "In Progress": 0, Completed: 0 };
    tasks.forEach(task => {
      if (statusCount[task.Status] !== undefined) {
        statusCount[task.Status]++;
      } else {
        statusCount[task.Status] = 1;
      }
    });
    
    return Object.keys(statusCount).map(status => ({
      name: status,
      value: statusCount[status]
    }));
  };

  const getTasksByProject = () => {
    const projectTasks = {};
    
    tasks.forEach(task => {
      if (projectTasks[task.ProjectId]) {
        projectTasks[task.ProjectId]++;
      } else {
        projectTasks[task.ProjectId] = 1;
      }
    });
    
    return Object.keys(projectTasks).map(projectId => {
      const project = projects.find(p => p.Id === parseInt(projectId)) || { Name: `Project ${projectId}` };
      return {
        name: project.Name,
        tasks: projectTasks[projectId]
      };
    });
  };

  const getUpcomingDeadlines = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return tasks
      .filter(task => task.DueDate && new Date(task.DueDate) > today && new Date(task.DueDate) < nextWeek)
      .sort((a, b) => new Date(a.DueDate) - new Date(b.DueDate));
  };

  const getUsersWithTaskCount = () => {
    const userTaskCount = {};
    
    tasks.forEach(task => {
      if (task.UserID) {
        if (userTaskCount[task.UserID]) {
          userTaskCount[task.UserID]++;
        } else {
          userTaskCount[task.UserID] = 1;
        }
      }
    });
    
    return users.map(user => ({
      ...user,
      taskCount: userTaskCount[user.Id] || 0
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        </div>
      </header>


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Summary Cards */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-medium text-gray-500">Total Projects</h2>
                    <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-medium text-gray-500">Total Users</h2>
                    <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <List className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-medium text-gray-500">Total Tasks</h2>
                    <p className="text-2xl font-semibold text-gray-900">{tasks.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task Status Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Tasks by Status</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getTasksByStatus()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {getTasksByStatus().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tasks by Project Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Tasks by Project</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getTasksByProject()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tasks" fill="#8884d8" name="Tasks" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="mt-6 bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Upcoming Deadlines</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {getUpcomingDeadlines().length > 0 ? (
                  getUpcomingDeadlines().map(task => (
                    <div key={task.Id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{task.Title}</h3>
                          <p className="text-sm text-gray-500">
                            {projects.find(p => p.Id === task.ProjectId)?.Name || 'Unnamed Project'}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">
                            {new Date(task.DueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-4 text-sm text-gray-500">No upcoming deadlines this week.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Add New Project
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {projects.map(project => (
                  <li key={project.Id}>
                    <button
                      onClick={() => setSelectedProject(selectedProject === project.Id ? null : project.Id)}
                      className="block hover:bg-gray-50 w-full text-left"
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-blue-600 truncate">
                            {project.Name}
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {project.StartDate && project.EndDate
                                ? `${new Date(project.StartDate).toLocaleDateString()} - ${new Date(project.EndDate).toLocaleDateString()}`
                                : 'No dates specified'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {tasks.filter(task => task.ProjectId === project.Id).length} tasks
                            </p>
                          </div>
                        </div>
                        
                        {selectedProject === project.Id && (
                          <div className="mt-4 border-t pt-4">
                            <p className="text-sm text-gray-500 mb-2">{project.Description || 'No description provided'}</p>
                            
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Tasks</h4>
                            <div className="space-y-2">
                              {tasks.filter(task => task.ProjectId === project.Id).length > 0 ? (
                                tasks
                                  .filter(task => task.ProjectId === project.Id)
                                  .map(task => (
                                    <div key={task.Id} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                                      <div>
                                        <span className="text-sm font-medium">{task.Title}</span>
                                        <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                          task.Status === 'Completed' ? 'bg-green-100 text-green-800' :
                                          task.Status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-gray-100 text-gray-800'
                                        }`}>
                                          {task.Status}
                                        </span>
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {task.DueDate && new Date(task.DueDate).toLocaleDateString()}
                                      </div>
                                    </div>
                                  ))
                              ) : (
                                <p className="text-sm text-gray-500">No tasks for this project</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Users</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Add New User
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {getUsersWithTaskCount().map(user => (
                  <li key={user.Id}>
                    <button
                      onClick={() => setSelectedUser(selectedUser === user.Id ? null : user.Id)}
                      className="block hover:bg-gray-50 w-full text-left"
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-blue-600 truncate">
                            {user.Name}
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {user.Role}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {user.Email}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p className="flex items-center text-sm text-gray-500">
                              <List className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {user.taskCount} tasks assigned
                            </p>
                          </div>
                        </div>
                        
                        {selectedUser === user.Id && (
                          <div className="mt-4 border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Tasks</h4>
                            <div className="space-y-2">
                              {tasks.filter(task => task.UserID === user.Id).length > 0 ? (
                                tasks
                                  .filter(task => task.UserID === user.Id)
                                  .map(task => (
                                    <div key={task.Id} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                                      <div>
                                        <span className="text-sm font-medium">{task.Title}</span>
                                        <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                          task.Status === 'Completed' ? 'bg-green-100 text-green-800' :
                                          task.Status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-gray-100 text-gray-800'
                                        }`}>
                                          {task.Status}
                                        </span>
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {projects.find(p => p.Id === task.ProjectId)?.Name || 'Unknown Project'}
                                      </div>
                                    </div>
                                  ))
                              ) : (
                                <p className="text-sm text-gray-500">No tasks assigned to this user</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Add New Task
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map(task => (
                    <tr key={task.Id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{task.Title}</div>
                        <div className="text-sm text-gray-500">{task.Description && task.Description.substring(0, 50) + (task.Description.length > 50 ? '...' : '')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {projects.find(p => p.Id === task.ProjectId)?.Name || 'Unknown Project'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.Status === 'Completed' ? 'bg-green-100 text-green-800' :
                          task.Status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.Status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {task.UserID ? (users.find(u => u.Id === task.UserID)?.Name || 'Unknown User') : 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {task.DueDate ? new Date(task.DueDate).toLocaleDateString() : 'No due date'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ManagerDashboard;