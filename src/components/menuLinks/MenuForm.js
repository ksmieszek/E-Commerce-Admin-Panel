import styled from "styled-components";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

let schema = yup.object().shape({
  order: yup.number().required().positive().integer(),
  title: yup.string().required(),
  link: yup.string().required(),
  //   website: yup.string().url(),
});

const StyledWrapper = styled.div`
  position: fixed;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: lightgrey;
  padding: 50px;
`;

const MenuForm = ({ save, setShowForm, editValues }) => {
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
      order: editValues?.order || null,
      title: editValues?.title || null,
      link: editValues?.link || null,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    const { id, order, title, link } = data;
    save({ id, order, title, link });
  };

  return (
    <StyledWrapper>
      <div>form</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        order
        <input {...register("order")} />
        title
        <input {...register("title")} />
        link
        <input {...register("link")} />
        <input type="submit" />
      </form>
    </StyledWrapper>
  );
};

export default MenuForm;
