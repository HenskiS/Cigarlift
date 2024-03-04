import Google from "../assets/google.png";

const Auth = () => {
  const google = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  return (
    <div className="login">
      <h1 className="loginTitle">Login With Google</h1>
      <div className="loginButton google" onClick={google}>
        <img src={Google} alt="" className="icon" />
        Google
      </div>
    </div>
  );
};

export default Auth;