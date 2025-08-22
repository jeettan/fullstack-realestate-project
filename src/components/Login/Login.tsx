import Nav from "../Reusable/Nav";
import BgLogin from "../../assets/bg-login.jpg";
import { useState } from "react";
import "../../App.css";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useRef } from "react";
import type { RefObject } from "react";
import LoginDashboard from "./LoginDashboard";
import RegisterDashboard from "./RegisterDashboard";

export default function Login() {
  const formRef = useRef<HTMLFormElement>(null);
  const loginRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .post("/verify-token", {
          token: token,
        })
        .then(() => {
          console.log("You are already logged in");
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const [mainTab, setMainTab] = useState(true);
  const navigate = useNavigate();

  const [errorMessageRegister, seterrorMessageRegister] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  function LoginFunction(
    event: React.FormEvent<HTMLFormElement>,
    loginRef: RefObject<HTMLFormElement | null>,
    setErrorLogin: (msg: string) => void,
    navigate: (path: string) => void
  ) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const username = formData.get("username");
    const password = formData.get("password");

    loginRef.current?.reset();

    axios
      .post("/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        setErrorLogin("");
        localStorage.setItem("token", response.data.token);
        navigate("/");
      })
      .catch((error) => {
        setErrorLogin(error.response.data);
        console.log(error);
      });
  }

  function RegisterFunction(
    event: React.FormEvent<HTMLFormElement>,
    setRegisterSuccess: (msg: string) => void,
    seterrorMessageRegister: (msg: string) => void,
    formRef: RefObject<HTMLFormElement | null>
  ) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const emailValue = formData.get("email");

    if (typeof emailValue !== "string" || !regex.test(emailValue)) {
      setRegisterSuccess("");
      seterrorMessageRegister("Invalid email format");
      return;
    }

    if (formData.get("password") !== formData.get("passwordagain")) {
      setRegisterSuccess("");
      seterrorMessageRegister("Password does not match, try again");
      return;
    }

    axios
      .post("/register", {
        username: formData.get("username"),
        password: formData.get("password"),
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        passwordagain: formData.get("passwordagain"),
        email: formData.get("email"),
      })
      .then((response) => {
        formRef.current?.reset();
        setRegisterSuccess(
          "Successfully registered user: " + formData.get("username")
        );
        seterrorMessageRegister("");
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response.data.message);
        if (error.status == 401) {
          setRegisterSuccess("");
          seterrorMessageRegister(error.response.data.message);
        }
      });
  }

  return (
    <div className="main">
      <Nav />
      <div
        className="h-[100vh] flex flex-col items-center justify-start"
        style={{
          backgroundImage: `url(${BgLogin})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {mainTab ? (
          <LoginDashboard
            LoginFunction={LoginFunction}
            errorLogin={errorLogin}
            setMainTab={setMainTab}
            mainTab={mainTab}
            loginRef={loginRef}
            setErrorLogin={setErrorLogin}
            navigate={navigate}
          />
        ) : (
          <RegisterDashboard
            RegisterFunction={RegisterFunction}
            setRegisterSuccess={setRegisterSuccess}
            seterrorMessageRegister={seterrorMessageRegister}
            formRef={formRef}
            errorMessageRegister={errorMessageRegister}
            registerSuccess={registerSuccess}
            setMainTab={setMainTab}
            mainTab={mainTab}
          />
        )}
      </div>
    </div>
  );
}
