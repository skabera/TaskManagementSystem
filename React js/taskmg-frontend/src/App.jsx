// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddRole from './Pages/Roles/AddRole';
import GetRole from './Pages/Roles/GetRoles';
import AddUser from './Pages/User/AddUser';
import LandingPage from './Pages/LandingPage';
import Login from './Pages/User/Login'
import Dashboard from './Pages/Component/Dashboard';
import AddProject from './Pages/Project/AddProject';
import AddTask from './Pages/Tasks/AddTask';
import GetTask from './Pages/Tasks/GetTask';
import AssignedTask from './Pages/User/AssignTask';
import AdminDashboard from './Pages/AdminDadboard';
import GetProject from './Pages/Project/GetProject';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/addrole" element={<AddRole />} />
        <Route path="/addUser" element={<AddUser />} />
        <Route path='/login' element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<div>Welcome to the Dashboard!</div>} />
          <Route path="addrole" element={<AddRole />} />
          <Route path="adduser" element={<AddUser />} />          
          <Route path="addproject" element={<AddProject />} />
          <Route path="addtask" element={<AddTask />} />
          <Route path="gettask" element={<GetTask />} />
          <Route path="assignedTask" element={<AssignedTask />} />
          <Route path="AdminDashboard" element={<AdminDashboard />} />
          <Route path="GetProject" element={<GetProject />} />


          

          <Route path="analytics" element={<div>Analytics Page</div>} />
          <Route path="products" element={<div>Products Page</div>} />
          <Route path="calendar" element={<div>Calendar Page</div>} />
          <Route path="messages" element={<div>Messages Page</div>} />
          <Route path="tasks" element={<div>Tasks Page</div>} />
          <Route path="projects" element={<div>Projects Page</div>} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>


      </Routes>
    </Router>
  );
}

export default App;
