import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { Routes } from './router';

import './index.css';

function App() {
  return (
    <Router>
      <Routes />
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
