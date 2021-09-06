import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import { Routes } from './router';
import client from './graphql/apollo';

import './index.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes />
      </Router>
    </ApolloProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
