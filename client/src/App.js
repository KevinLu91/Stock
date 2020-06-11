import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import MainPage from './components/MainPage';
import Market from './components/Market';



function App() {

  return (
    <Router>
      <Route exact path='/' component={MainPage}/>
      <Route path='/market' component={Market} />
    </Router>
  );
}

export default App;
