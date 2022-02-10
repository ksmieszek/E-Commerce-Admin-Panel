import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import CategoryIcon from "@mui/icons-material/Category";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LayersIcon from "@mui/icons-material/Layers";
import { Link } from "react-router-dom";
import routes from "routes";

export const mainListItems = (
  <div>
    <ListItem button component={Link} to={routes.root}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button component={Link} to={routes.users}>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Users" />
    </ListItem>
    <ListItem button component={Link} to={routes.orders}>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Orders" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Management</ListSubheader>
    <ListItem button component={Link} to={routes.products}>
      <ListItemIcon>
        <CheckroomIcon />
      </ListItemIcon>
      <ListItemText primary="Products" />
    </ListItem>
    <ListItem button component={Link} to={routes.menuManagement}>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Main menu" />
    </ListItem>
    <ListItem button component={Link} to={routes.collections}>
      <ListItemIcon>
        <CategoryIcon />
      </ListItemIcon>
      <ListItemText primary="Collecions" />
    </ListItem>
    <ListItem button component={Link} to={routes.photos}>
      <ListItemIcon>
        <InsertPhotoIcon />
      </ListItemIcon>
      <ListItemText primary="Photos" />
    </ListItem>
  </div>
);
