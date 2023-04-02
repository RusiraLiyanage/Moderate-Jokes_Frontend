import logo from './logo.svg';
import JokesModerate from './JokesModerate.js';
import Login from './adminAuth.js';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import './App.css';
function App() {
  return (
    <Routes>
      <Route exact path="/" element = {<Login/>}/>
      <Route path="/jokesModerate" element= {<JokesModerate/>} />
    </Routes>
  );
}

export default App;
