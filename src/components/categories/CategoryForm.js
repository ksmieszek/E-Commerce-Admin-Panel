import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useState } from "react";

const StyledWrapper = styled.div`
  position: fixed;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* width: 200px; */
  /* height: 200px; */
  background: lightgrey;
  padding: 50px;
`;

const CategoryForm = ({ save, setShowForm, editValues }) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: editValues?.id || null,
      key: editValues?.key || null,
      value: editValues?.value || null,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    save(data.id, data.key, data.value);
    setShowForm(false);
  };

  return (
    <StyledWrapper>
      <div>form</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("key")} />
        <input {...register("value")} />
        <input type="submit" />
      </form>
    </StyledWrapper>
  );
};

export default CategoryForm;
