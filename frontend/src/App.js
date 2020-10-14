import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navigation from './Components/Navigation';
import QuestionCard from './Components/QuestionCard';

function App() {
  return (
    <div className="App">
      <Navigation />
      <QuestionCard/>
    </div>
  );
}

export default App;
