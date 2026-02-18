import Navbar from "../Reusable/Nav";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(false);
  const [resetCompleted, setResetCompleted] = useState(false);

  let navigate = useNavigate();
  const formRef = useRef(0);

  useEffect(() => {
    if (!searchParams.get("token")) navigate("/");
    let token = searchParams.get("token");

    axios
      .post(
        "/users/verify-reset-token",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        setError(true);
        console.log(err.response.data.message);
      });
  }, [searchParams]);

  const resetPassword = (e) => {
    e.preventDefault();
    const token = searchParams.get("token");

    if (formRef.current.pwd.value !== formRef.current.pwdagain.value) {
      toast.error("Passwords do not match, try again");
      return;
    }

    axios
      .patch(
        "/users/reset-password-by-email",
        { password: formRef.current.pwd.value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setResetCompleted(true);
        console.log(res);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        console.log(err);
      });
  };

  return (
    <>
      <Navbar />
      <div className="h-[100vh] flex justify-center items-center flex-col">
        <ToastContainer />
        {!error ? (
          !resetCompleted ? (
            <>
              <div className="flex justify-center items-center flex-col gap-5 bg-purple-800 p-15 text-white w-120">
                <h3 className="text-3xl">Reset your password</h3>
                <form
                  className="w-full m-0 flex flex-col justify-center items-center gap-5"
                  onSubmit={resetPassword}
                  ref={formRef}
                >
                  <input
                    type="password"
                    name="pwd"
                    className="bg-neutral-secondary-medium border
            border-default-medium text-heading text-sm rounded-base
            focus:ring-brand focus:border-brand block px-3 py-2.5 shadow-xs
            w-[80%]"
                    placeholder="Enter your new password"
                    minLength={6}
                    required
                  />
                  <input
                    type="password"
                    name="pwdagain"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block px-3 py-2.5 shadow-xs w-[80%]"
                    placeholder="Reconfirm your new password"
                    minLength={6}
                    required
                  />
                  <button
                    type="submit"
                    className=" w-[50%] bg-white text-purple-800 font-semibold py-2.5 rounded-lg shadow-md hover:bg-purple-100 transition duration-200 active:scale-95"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div>Your password has successfully been reset.</div>
          )
        ) : (
          <div>Incorrect Reset token or has expired</div>
        )}
      </div>
    </>
  );
}
