import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Pages() {
  return (
    <BrowserRouter>
      <Switch>
        {ROUTES.map(({ title, route }) => (
          <Route
            key={route.path}
            exact={route.exact}
            path={route.path}
            render={() => (
              <>
                <Helmet>
                  <title>PDB 4 - {title}</title>
                </Helmet>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <route.component />
                </React.Suspense>
              </>
            )}
          />
        ))}
        <Route
          render={() => (
            <Helmet>
              <title>404</title>
            </Helmet>
          )}
        />
      </Switch>
    </BrowserRouter>
  );
}

const ROUTES = [
  {
    title: "Home",
    route: {
      exact: true,
      path: "/",
      component: () => "PDB 4"
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
    title: "Send the Goods",
    route: {
      exact: true,
      path: "/goods",
      component: React.lazy(() => import("./GoodsPage"))
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
