import styled from "styled-components";
import { useForm, useFieldArray } from "react-hook-form";
import { useContext, useState } from "react";
import CategoryForm from "./CategoryForm";
import { useEffect } from "react/cjs/react.development";
import { db } from "firebase";
import { doc, setDoc, getDoc, deleteDoc, updateDoc, deleteField } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

const StyledWrapper = styled.div`
  background: grey;
  padding: 50px;
  margin: 50px;
`;

const Category = ({ cat }) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();
  const { fields: colorsFields, append: colorsAppend, replace: replaceColors } = useFieldArray({ control, name: "colors" });

  useEffect(() => {
    if (cat === undefined) return;

    for (const [key, value] of Object.entries(cat.value)) {
      //   appendCategory(null, key, value);
      colorsAppend({ key, value });
    }
  }, [cat]);

  const onSubmit = (data) => {
    console.log(data);
  };

  const appendCategory = async (id, key, value) => {
    if (!editValues) {
      console.log(id, key, value);
      colorsAppend({ key, value });
      setEditValues(undefined);
    } else {
      const tempArray = [...colorsFields];
      const foundedIndex = tempArray.findIndex((item) => item.id === id);

      const docRef = doc(db, "categories", cat.key);
      //remove old field in case of changed key
      await updateDoc(docRef, {
        [tempArray[foundedIndex].key]: deleteField(),
      });
      //add new field
      await updateDoc(docRef, {
        [key]: value,
      });

      if (foundedIndex !== -1) tempArray[foundedIndex].key = key;
      if (foundedIndex !== -1) tempArray[foundedIndex].value = value;
      replaceColors(tempArray);
      setEditValues(undefined);
    }
  };

  const dispalyFields = () => {
    return colorsFields.map((item, index) => (
      <div key={index}>
        {item.key} : {item.value}
        <button
          onClick={(e) => {
            e.preventDefault();
            setEditValues({
              id: item.id,
              key: item.key,
              value: item.value,
            });
            setShowForm(true);
          }}
        >
          edytuj
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            removeField(item.id);
          }}
        >
          usun
        </button>
      </div>
    ));
  };

  const removeField = async (fieldId) => {
    console.log(fieldId);
    const tempArray = [...colorsFields];
    const foundedIndex = tempArray.findIndex((item) => item.id === fieldId);
    //
    const docRef = doc(db, "categories", cat.key);
    //remove field
    await updateDoc(docRef, {
      [tempArray[foundedIndex].key]: deleteField(),
    });
    //
    if (foundedIndex !== -1) tempArray.splice(foundedIndex, 1);
    replaceColors(tempArray);
  };

  const removeDocument = async () => {
    // console.log(cat.key);
    await deleteDoc(doc(db, "categories", cat.key));
    window.location.reload();
  };

  const [showForm, setShowForm] = useState(false);
  const [editValues, setEditValues] = useState(undefined);

  return (
    <>
      <StyledWrapper>
        <div>
          Komponent trzymający stan formularza {cat.key} <button onClick={removeDocument}>usun cat</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <>{dispalyFields()}</>
          <input type="submit" />
        </form>
        <button onClick={() => setShowForm(true)}>showForm</button>
      </StyledWrapper>
      {showForm && <CategoryForm save={appendCategory} setShowForm={setShowForm} editValues={editValues} />}
    </>
  );
};

export default Category;
