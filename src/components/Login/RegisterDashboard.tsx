import type { FormEvent, RefObject } from "react";

interface RegisterDashboardProps {
  RegisterFunction: (
    event: FormEvent<HTMLFormElement>,
    setRegisterSuccess: (msg: string) => void,
    seterrorMessageRegister: (msg: string) => void,
    formRef: RefObject<HTMLFormElement | null>
  ) => void;
  setRegisterSuccess: (msg: string) => void;
  seterrorMessageRegister: (msg: string) => void;
  formRef: RefObject<HTMLFormElement | null>;
  errorMessageRegister: string;
  registerSuccess: string;
  setMainTab: (value: boolean) => void;
  mainTab: boolean;
}

const RegisterDashboard: React.FC<RegisterDashboardProps> = ({
  RegisterFunction,
  setRegisterSuccess,
  seterrorMessageRegister,
  formRef,
  errorMessageRegister,
  registerSuccess,
  setMainTab,
  mainTab,
}) => {
  return (
    <form
      className="flex flex-col justify-center items-center text-white shadow-lg p-9 mt-7"
      style={{ backgroundColor: "#573736" }}
      onSubmit={(e) =>
        RegisterFunction(
          e,
          setRegisterSuccess,
          seterrorMessageRegister,
          formRef
        )
      }
      ref={formRef}
    >
      <div className="strike w-85">
        <h3 className="text-3xl font-bold"> Register</h3>
      </div>

      <p>Create your account, it's easy and free.</p>

      <div className="flex flex-row items-center justify-center space-x-4 w-full">
        <input
          type="text"
          className="bg-gray-100 m-3 py-2 px-5 text-black w-1/3"
          placeholder="First Name"
          minLength={3}
          name="first_name"
          pattern="[A-Za-z ]*"
          required
        />

        <input
          type="text"
          className="bg-gray-100 m-3 py-2 px-5 text-black w-1/3"
          placeholder="Last Name"
          minLength={3}
          name="last_name"
          pattern="[A-Za-z ]*"
          required
        />
      </div>

      <input
        type="text"
        className="bg-gray-100 m-3 py-2 px-5 text-black w-87"
        placeholder="Email Address"
        name="email"
        minLength={7}
        required
      />

      <input
        type="text"
        className="bg-gray-100 m-3 py-2 px-5 text-black w-87"
        placeholder="Username"
        minLength={4}
        name="username"
        required
      />

      <input
        type="password"
        className="bg-gray-100 m-3 py-2 px-5 text-black w-87"
        placeholder="Password"
        minLength={6}
        name="password"
        required
      />

      <input
        type="password"
        className="bg-gray-100 m-3 py-2 px-5 text-black w-87"
        placeholder="Confirm Password"
        minLength={6}
        name="passwordagain"
        required
      />

      <p className="text-red-600">{errorMessageRegister}</p>
      <p className="text-green-400">{registerSuccess}</p>

      <button className="mt-5 w-[70%] bg-gradient-to-t from-red-900 to-red-800 text-white py-3 font-semibold shadow-md !rounded-none">
        Register
      </button>
      <p
        className="mt-5 hover:underline cursor-pointer"
        onClick={() => setMainTab(!mainTab)}
      >
        Go back
      </p>
    </form>
  );
};

export default RegisterDashboard;
