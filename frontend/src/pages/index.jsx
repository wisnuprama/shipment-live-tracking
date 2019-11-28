import React from "react";
import { Router, Route, Switch} from "react-router-dom";
import { Helmet } from "react-helmet";
import Home from './Home';


export default function Pages() {
  return (
    <Router>
      <Switch>
        {ROUTES.map(({ title, route }) => (
          <Route
            key={route.path}
            exact={route.exact}
            path={route.path}
            render={() => (
              <React.Fragment>
                <Helmet>
                  <title>{title}</title>
                </Helmet>
                <route.component />
              </React.Fragment>
            )}
          />
        ))}
        <Route
            render={() => (
              <React.Fragment>
                <Helmet>
                  <title>404</title>
                </Helmet>
              </React.Fragment>
            )}
          />
      </Switch>
    </Router>
  );
}

const ROUTES = [
  {
    title: "HOME",
    route: {
      exact: true,
      path: '/',
      component: Home,
    },
  },
];
