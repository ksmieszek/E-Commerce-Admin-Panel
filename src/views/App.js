import { BrowserRouter as Router, Switch, Route, Link, Routes } from "react-router-dom";
import routes from "routes";
import Login from "views/Login";
import Products from "views/Products";
import Categories from "views/Categories";
import AuthProvider from "hooks/useAuth";
import MenuManagement from "./MenuManagement";
import Dashboard from "templates/mui/dashboard/Dashboard";
import SignIn from "templates/mui/signIn/SignIn";
import MainTemplate from "templates/mainTemplate/MainTemplate";

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainTemplate>
          <Routes>
            {/* <Route path={routes.login} element={<Login />} /> */}
            <Route path={routes.root} element={<SignIn />} />
            {/* <Route path={routes.root} element={<Dashboard />} /> */}
            <Route path={routes.products} element={<Products />} />
            <Route path={routes.categories} element={<Categories />} />
            <Route path={routes.menuLinks} element={<MenuManagement />} />
          </Routes>
        </MainTemplate>
      </Router>
    </AuthProvider>
  );
}

export default App;
