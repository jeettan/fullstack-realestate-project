import type { FormEvent, RefObject } from "react";

interface LoginDashboardProps {
  LoginFunction: (
    event: FormEvent<HTMLFormElement>,
    loginRef: RefObject<HTMLFormElement | null>,
    setErrorLogin: (msg: string) => void,
    navigate: (path: string) => void
  ) => void;
  errorLogin: string;
  setMainTab: (value: boolean) => void;
  mainTab: boolean;
  loginRef: RefObject<HTMLFormElement | null>;
  setErrorLogin: (msg: string) => void;
  navigate: (path: string) => void;
}

const LoginDashboard: React.FC<LoginDashboardProps> = ({
  LoginFunction,
  errorLogin,
  setMainTab,
  mainTab,
  loginRef,
  setErrorLogin,
  navigate,
}) => {
  return (
    <form
      onSubmit={(e) => LoginFunction(e, loginRef, setErrorLogin, navigate)}
      ref={loginRef}
    >
      <div
        className="flex flex-col justify-center items-center text-white shadow-lg p-15 mt-15"
        style={{ backgroundColor: "#573736" }}
      >
        <h3 className="text-3xl font-bold">Login</h3>
        <input
          type="text"
          className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-100"
          placeholder="username"
          name="username"
          required
        ></input>
        <input
          type="password"
          className=" bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-100"
          placeholder="password"
          name="password"
          required
        ></input>
        <div className="flex justify-end space-x-4">
          <div>
            <input type="checkbox" id="options" />
            <label>Remember me</label>
          </div>
          <label>Forgot password</label>
        </div>
        <p className="text-red-600">{errorLogin}</p>
        <button className="mt-5 w-[70%] bg-gradient-to-t from-red-900 to-red-800 text-white py-3 font-semibold shadow-md !rounded-none">
          Login
        </button>
        <p className="mt-5">
          Don't have an account?{" "}
          <span
            onClick={() => setMainTab(!mainTab)}
            className="cursor-pointer hover:underline"
          >
            Click here
          </span>{" "}
          to register
        </p>
      </div>
    </form>
  );
};

export default LoginDashboard;
