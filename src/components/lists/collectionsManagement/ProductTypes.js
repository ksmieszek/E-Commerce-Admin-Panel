import { useState, useEffect } from "react";
import { db } from "firebase";
import { collection, getDocs } from "firebase/firestore";
import ProductType from "components/lists/collectionsManagement/ProductType";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const ProductTypes = () => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    (async () => {
      const types = await getDocs(collection(db, "types"));
      const list = [];
      types.forEach((doc) => list.push({ key: doc.id, value: doc.data() }));
      setFields(list);
    })();
  }, []);

  return (
    <Box>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 400 }}>
        Product types management
      </Typography>
      <Box>
        {fields.map((item) => (
          <ProductType key={item.key} category={item} />
        ))}
      </Box>
    </Box>
  );
};

export default ProductTypes;
