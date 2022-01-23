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

// import app from "../firebase";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { useEffect, useState } from "react";
// import { db } from "../firebase";
// import { collection, addDoc, doc, getDoc, getDocs } from "firebase/firestore";

// // Get a reference to the storage service, which is used to create references in your storage bucket
// const storage = getStorage();
// // Create a storage reference from our storage service
// // const storageRef = ref(storage);
// // const imagesRef = ref(storage, "images");
// // const mountainImagesRef = ref(storage, "images/mountains.jpg");

function App() {
  // const [products, setproducts] = useState([]);
  // useEffect(() => {
  //   (async () => {
  //     // const docSnap = await getDoc(doc(db, "products", "3pJX6DTs4SHWJ7ib8qzZ"));
  //     const querySnapshot = await getDocs(collection(db, "products"));
  //     querySnapshot.forEach((doc) => {
  //       // doc.data() is never undefined for query doc snapshots
  //       console.log(doc.id, " => ", doc.data());
  //     });
  //     // setproducts([{ images, name }]);
  //   })();
  // }, []);

  return (
    // <div className="App">
    //   <div>
    //     Root
    //     {products.map((item, index) => (
    //       <div key={index}>
    //         {item.name}
    //         {item.images.map((image, index) => (
    //           <img key={index} src={image} alt="" />
    //         ))}
    //       </div>
    //     ))}
    //   </div>
    // </div>
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
