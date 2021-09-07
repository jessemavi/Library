import { Switch } from 'react-router';

import Index from '../pages/Index';
import Home from '../pages/Home';
import Login from '../pages/Login';
import PrivateRoute from '../components/PrivateRoute';
import PublicRoute from '../components/PublicRoute';

export function Routes() {
  return (
    <Switch>
      <PublicRoute exact path='/' component={Index} />
      <PrivateRoute exact path='/home' component={Home} />
      <PublicRoute exact path='/login' component={Login} />
    </Switch>
  );
}