import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';

import './App.css';
import 'semantic-ui-css/semantic.min.css';
import MenuBar from './components/MenuBar';
import { AuthProvider } from './context/auth';
import AuthRoute from './utils/authRoute';
import SinglePost from './pages/SinglePost';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/posts/:postId" component={SinglePost} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
