import ProductTypes from "components/lists/collectionsManagement/ProductTypes";
import MenuSearchTypes from "components/lists/collectionsManagement/MenuSearchTypes";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Collections = () => {
  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Collection management
      </Typography>
      <Box sx={{ mt: 6 }}>
        <ProductTypes />
        <MenuSearchTypes />
      </Box>
    </Box>
  );
};

export default Collections;
