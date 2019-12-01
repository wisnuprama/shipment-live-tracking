import React from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Pages() {
  const home = {
    title: "Home",
    route: {
      exact: true,
      path: "/",
      component: () =>
        ROUTES.map(
          r =>
            !r.route.path.includes(":shipping") && (
              <Link key={r.route.path} to={r.route.path}>
                <h4>{r.title}</h4>
              </Link>
            )
        )
    }
  };
  const routes = [home, ...ROUTES];

  return (
    <BrowserRouter>
      <Switch>
        {routes.map(({ title, route }) => (
          <Route
            key={route.path}
            exact={route.exact}
            path={route.path}
            render={props => (
              <>
                <Helmet>
                  <title>PDB 4 - {title}</title>
                </Helmet>
                <React.Suspense
                  fallback={
                    <div
                      className="spinner-grow ml-auto text-light"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  }
                >
                  <route.component {...props} />
                </React.Suspense>
              </>
            )}
          />
        ))}
      </Switch>
    </BrowserRouter>
  );
}

const ROUTES = [
  {
    title: "Start shipment",
    route: {
      exact: false,
      path: "/start-shipment",
      component: React.lazy(() => import("./ShipmentPage"))
    }
  },
  {
    title: "Shipments",
    route: {
      exact: true,
      path: "/shipments",
      component: React.lazy(() => import("./ShipmentListPage"))
    }
  },
  {
    title: "Shipments / Checkpoints",
    route: {
      exact: true,
      path: "/shipments/:shippingCode",
      component: React.lazy(() => import("./CheckpointListPage"))
    }
  },
  {
    title: "Shipments / Current Location",
    route: {
      exact: false,
      path: "/shipments/:shippingCode/current-location",
      component: React.lazy(() => import("./LivetrackingPage"))
    }
  },
  {
    title: "Goods Receipt",
    route: {
      exact: true,
      path: "/goods-receipt",
      component: React.lazy(() => import("./GoodsReceiptPage"))
    }
  }
];
