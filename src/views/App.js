import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routes from "routes";
import Login from "views/Login";
import Products from "views/Products";
import Categories from "views/Categories";
import MenuManagement from "./MenuManagement";
import DashboardTemplate from "templates/mui/dashboard/Dashboard";
import MainTemplate from "templates/mainTemplate/MainTemplate";
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
                <Route path={routes.categories} element={<Categories />} />
                <Route path={routes.menuLinks} element={<MenuManagement />} />
              </Routes>
            </DashboardTemplate>
          )}
        </MainTemplate>
      </Router>
    </>
  );
}

export default App;
