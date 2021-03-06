import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routes from "routes";
import Login from "views/Login";
import Products from "views/Products";
import Collections from "views/Collections";
import MenuManagement from "./MenuManagement";
import Photos from "./Photos";
import Users from "./Users";
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import DashboardTemplate from "templates/muiStarter/dashboard/Dashboard";
import MainTemplate from "templates/main/MainTemplate";
import { useAuth } from "hooks/useAuth";

function App() {
  const { uid } = useAuth();
  return (
    <>
      <Router>
        <MainTemplate>
          {uid === undefined ? (
            <Login />
          ) : (
            <DashboardTemplate>
              <Routes>
                <Route path={routes.products} element={<Products />} />
                <Route path={routes.collections} element={<Collections />} />
                <Route path={routes.menuManagement} element={<MenuManagement />} />
                <Route path={routes.photos} element={<Photos />} />
                <Route path={routes.users} element={<Users />} />
                <Route path={routes.root} element={<Dashboard />} />
                <Route path={routes.orders} element={<Orders />} />
              </Routes>
            </DashboardTemplate>
          )}
        </MainTemplate>
      </Router>
    </>
  );
}

export default App;
