import { useAuth } from "hooks/useAuth";

const Login = () => {
  const { SignIn, SignOut } = useAuth();

  return (
    <div>
      <div>Login</div>
      <button onClick={SignIn}>Zaloguj</button>
    </div>
  );
};

export default Login;
