import Category from "components/categories/Category";
import CategoryForm from "components/categories/CategoryForm";
import { useState, useEffect } from "react";
import { db } from "firebase";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

const Categories = () => {
  const [showMC, setShowMC] = useState(false);
  const [catFir, setCatFir] = useState([]);

  useEffect(() => {
    (async () => {
      const categories = [];
      const querySnapshot = await getDocs(collection(db, "categories"));
      //   console.log(querySnapshot);
      querySnapshot.forEach((doc) => categories.push({ key: doc.id, value: doc.data() }));
      //   console.log(categories);
      setCatFir(categories);
      //   setCatFir(catFir.push({key:doc.id, value: doc.data()}));
    })();
  }, []);

  const dodaj = async () => {
    const docName = "newCat";
    const data = {
      red: "red",
    };

    await setDoc(doc(db, "categories", docName), data);
    //loading
    //refresh page
    window.location.reload();
    // setCatFir([...catFir, { key: docName, value: data }]);
  };

  return (
    <div>
      <h1>Categories</h1>
      <button onClick={() => setShowMC(!showMC)}>add main category</button>
      {/* raczej wyskoczy popup i trzeba bedzie wpisac nazwe i jedno key value i sie strona przeładuje */}
      {showMC && (
        <>
          <div>dodananie dokumentu popup</div>
          <button onClick={dodaj}>Add</button>
        </>
      )}

      {catFir && catFir.map((item, index) => <Category key={index} cat={item} />)}
    </div>
  );
};

export default Categories;
