import axios from "axios";
import { useState } from "react";

interface ForgetPasswordProps {
  setMainTab: React.Dispatch<React.SetStateAction<number>>;
  Spinner: React.ComponentType;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ForgetPassword: React.FC<ForgetPasswordProps> = ({
  setMainTab,
  Spinner,
  isLoading,
  setIsLoading,
}) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function forgotEmail() {
    setIsLoading(true);
    axios
      .post("/users/forget-password", { email })
      .then(() => {
        setIsLoading(false);
        setSuccessMessage("Password reset details sent to your email");
        setErrorMessage("");
        setEmail("");
      })
      .catch((err) => {
        const e_message =
          err.response?.data?.message ||
          err.response?.data ||
          err.message ||
          "Something went wrong";

        console.log(err);
        setIsLoading(false);
        setErrorMessage(e_message);
        setEmail("");
        setSuccessMessage("");
      });
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <form>
      <div
        className="flex flex-col justify-center items-center text-white shadow-lg p-8 md:p-15 mt-15"
        style={{ backgroundColor: "#573736" }}
      >
        <h3 className="text-3xl font-bold">Forget Password</h3>
        <input
          type="email"
          className="bg-gray-100 m-3 py-2 md:py-3 px-5 text-black rounded-2xl w-[90%] md:w-80"
          placeholder="Enter your email address"
          name="email"
          value={email}
          onChange={handleEmailChange}
          required
        ></input>
        <button
          className="mt-5 w-[70%] bg-gradient-to-t from-red-900 to-red-800 text-white py-3 font-semibold shadow-md !rounded-none flex justify-center"
          onClick={forgotEmail}
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : "Submit"}
        </button>
        <p className="text-green-600">{successMessage}</p>
        <p className="text-red-600">{errorMessage}</p>
        <p
          className="mt-5 hover:underline cursor-pointer"
          onClick={() => setMainTab(1)}
        >
          Go back
        </p>
      </div>
    </form>
  );
};

export default ForgetPassword;
