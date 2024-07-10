import React from 'react';
import { BrowserRouter as Router, Route, Routes, Switch, Link } from 'react-router-dom';
import HomePage from './components/HomePage.js';
import Login from './components/login.js';
import TestComponent from './TestComponent.js';
import InspectorList from './components/InspectorList.js';
import { ImportInspectors } from './components/InspectorList.js';
import CreateInspector from './components/CreateInspector.js';
import EditInspector from './components/EditInspector.js';
import InspectorFind from './components/inspectorFind.js';


function App() {
  return (
    <Router>
      <div>
        <nav>
          <li>
            <Link to = "/">Home</Link>
          </li>
          <li>
            <Link to = "/login">Login</Link>
          </li>
          <li>
            <Link to = "/inspector-find">Find Inspector</Link>
          </li>
          <li>
            <Link to = "/inspectors">Inspectors</Link>
          </li>
          <li>
            <Link to = "/add-inspector">Create Inspector</Link>
          </li>
          <li>
            <Link to = "/edit-inspector/:id">Edit Inspector</Link>
          </li>
        </nav>
      </div>
      <Routes>
        <Route path = "/" element={<HomePage />} />
        <Route path = "/login" element = {<Login />} /> 
        <Route path = "/inspector-find" element = {<InspectorFind />} />
        <Route path = "/inspectors" element = {<InspectorList />} />
        <Route path = "/add-inspector" element = {<CreateInspector />}/>
        <Route path = "/edit-inspector/:id" element = {<EditInspector />} /> 
      </Routes>
    </Router>

  );
}


export default App;
