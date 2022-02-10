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
import styled from "styled-components";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export const mainListItems = (
  <div>
    <StyledLink to={routes.root}>
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </StyledLink>
    <StyledLink to={routes.users}>
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItem>
    </StyledLink>
    <StyledLink to={routes.orders}>
      <ListItem button>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </ListItem>
    </StyledLink>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Management</ListSubheader>
    <StyledLink to={routes.products}>
      <ListItem button>
        <ListItemIcon>
          <CheckroomIcon />
        </ListItemIcon>
        <ListItemText primary="Products" />
      </ListItem>
    </StyledLink>
    <StyledLink to={routes.menuManagement}>
      <ListItem button>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Main menu" />
      </ListItem>
    </StyledLink>
    <StyledLink to={routes.collections}>
      <ListItem button>
        <ListItemIcon>
          <CategoryIcon />
        </ListItemIcon>
        <ListItemText primary="Collecions" />
      </ListItem>
    </StyledLink>
    <StyledLink to={routes.photos}>
      <ListItem button>
        <ListItemIcon>
          <InsertPhotoIcon />
        </ListItemIcon>
        <ListItemText primary="Photos" />
      </ListItem>
    </StyledLink>
  </div>
);
