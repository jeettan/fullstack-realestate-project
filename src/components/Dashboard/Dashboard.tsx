import Nav from "../Reusable/Nav";
import "../../App.css";
import axios from "../../axios.ts";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useRef } from "react";

export default function Dashboard() {
  const navigate = useNavigate();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {
      xs: "90%",
      sm: "70%",
      md: "50%",
    },
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [userInfo, setUserInfo] = useState<{
    email: string;
    first_name: string;
    id: Number;
    last_name: string;
    username: string;
  }>({
    email: "",
    first_name: "",
    id: 0,
    last_name: "",
    username: "",
  });

  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const [firstName, setFirstName] = useState("");
  const [tabs, setTabs] = useState(0);

  const [error, setErrorMessage] = useState("");
  const [frontPageError, setFrontPageError] = useState("");
  const [frontPageSuccess, setFrontPageSuccess] = useState("");
  const [success, setSuccessMessage] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setProfile();
  };

  const handleClose = () => {
    setOpen(false);
    setProfile();
    setSuccessMessage("");
    setErrorMessage("");
    setFrontPageSuccess("");
    setFrontPageError("");
    setTabs(0);
  };

  const handleFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const handleLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  //Verify the page is logged in or not logged in.

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .post("/users/verify-token", {
          token: token,
        })
        .then((res) => {
          getAndSetFields(res.data.id);
        })
        .catch((err) => {
          console.log(err);
          navigate("/");
        });
    } else {
      navigate("/");
    }
  }, []);

  const setProfile = () => {
    setFirstName(userInfo["first_name"]);
    setLastName(userInfo["last_name"]);
    setEmail(userInfo["email"]);
    setUsername(userInfo["username"]);
  };

  const getAndSetFields = (userId: Number) => {
    axios
      .post("/users/user-details", {
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        setUserInfo({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          id: userId,
          username: res.data.username,
          email: res.data.email,
        });
        setName(res.data.first_name + " " + res.data.last_name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateFields = () => {
    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!regex.test(email)) {
      setFrontPageError("Invalid email format try again");
      setFrontPageSuccess("");
      return;
    }

    let fnlnregex = /[A-Za-z]+$/;

    if (!fnlnregex.test(firstName) || !fnlnregex.test(lastName)) {
      setFrontPageError("Invalid first name/last name format try again");
      setFrontPageSuccess("");
      return;
    }

    axios
      .patch("/users/update-user-details", {
        id: userInfo.id,
        first_name: firstName,
        last_name: lastName,
        email: email,
        token: localStorage.getItem("token"),
      })
      .then(() => {
        setFrontPageError("");
        setFrontPageSuccess("Details successfully updated!");
        getAndSetFields(userInfo.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const formRef = useRef<HTMLFormElement>(null);

  const updatePassword = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const pwd = formData.get("pwd");
    const newpwd = formData.get("newpwd");
    const newpwdagain = formData.get("newpwdagain");

    if (newpwd === newpwdagain) {
      axios
        .patch("/users/change-password", {
          username: userInfo.username,
          password: pwd,
          newpwd: newpwd,
          token: localStorage.getItem("token"),
        })
        .then(() => {
          setSuccessMessage("Password successfully updated");
          setErrorMessage("");
          formRef.current?.reset();
        })
        .catch((err) => {
          console.log(err);
          setErrorMessage(err.response.data);
          setSuccessMessage("");
        });
    } else {
      setErrorMessage("Your new password does not match");
      setSuccessMessage("");
      return;
    }
  };

  const changePwdBlock = (
    <>
      <form onSubmit={updatePassword} ref={formRef}>
        <div className="flex flex-col gap-3 justify-start items-start">
          <div className="flex flex-col ">
            <label htmlFor="pwd">Current password</label>
            <input
              type="password"
              id="pwd"
              name="pwd"
              className=" border border-solid py-1 px-2 w-[70%]"
              placeholder="Current Password"
              required
            ></input>
          </div>
          <div className="flex flex-col">
            <label htmlFor="newpwd">New password</label>
            <input
              type="password"
              id="newpwd"
              name="newpwd"
              className=" border border-solid py-1 px-2 w-[70%]"
              placeholder="New password"
              minLength={6}
              required
            ></input>
          </div>
          <div className="flex flex-col">
            <label htmlFor="newpwdagain">Password Confirm </label>
            <input
              type="password"
              id="newpwdagain"
              name="newpwdagain"
              className=" border border-solid py-1 px-2 w-[70%]"
              placeholder="Confirm Password"
              minLength={6}
              required
            ></input>
          </div>
          <p>
            <button
              className="hover:underline cursor-pointer"
              onClick={() => setTabs(0)}
            >
              Back
            </button>
          </p>
          <div>
            <span className="text-red-600">{error}</span>
            <span className="text-green-600">{success}</span>
          </div>
          <div className="flex flex-row gap-3">
            <button className="bg-blue-600 p-2 text-white" type="submit">
              Update
            </button>
            <button className="bg-gray-600 p-2 text-white" type="reset">
              Clear
            </button>
          </div>
        </div>
      </form>
    </>
  );

  const changeDetailBlock = (
    <>
      <div className="flex flex-col gap-3">
        <div className="grid grid grid-cols-1 md:grid-cols-2">
          <div className="space-y-2 flex flex-col">
            <label>First Name</label>
            <input
              type="text"
              className=" border border-solid py-1 px-2 w-[70%]"
              placeholder="First Name"
              value={firstName}
              pattern="[A-Za-z ]*"
              onChange={handleFirstName}
            />
            <label>Username</label>
            <input
              type="text"
              className=" border border-solid py-1 px-2 w-[70%] bg-gray-200"
              placeholder="Username"
              value={username}
              readOnly
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <label>Last Name</label>
            <input
              type="text"
              className=" border border-solid py-1 px-2 w-[70%]"
              placeholder="Last Name"
              value={lastName}
              pattern="[A-Za-z ]*"
              onChange={handleLastName}
            />
            <label>Email Address</label>
            <input
              type="text"
              className=" border border-solid py-1 px-2 w-[70%]"
              placeholder="Email"
              value={email}
              onChange={handleEmail}
            />
          </div>
        </div>
        <p className={`text-red-500 ${!frontPageError ? "hidden" : ""}`}>
          {frontPageError}
        </p>
        <p className={`text-green-500 ${!frontPageSuccess ? "hidden" : ""}`}>
          {frontPageSuccess}
        </p>
        <div className="mt-3">
          <button
            className="p-2 bg-blue-600 text-white mr-5 shadow-sm"
            onClick={updateFields}
          >
            Update
          </button>
          <button
            className="bg-red-600 p-2 text-white shadow-sm"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <button
            className="hover:underline cursor-pointer"
            onClick={() => setTabs(1)}
          >
            Click here{" "}
          </button>{" "}
          to reset your password
        </Typography>
      </div>
    </>
  );

  return (
    <div className="main">
      <Nav />
      <div className="w-full">
        <h1 className="font-bold text-center m-5">
          Welcome to the Admin Dashboard, {name}
        </h1>
        <div className="flex flex-row sm:justify-between items-center align-center h-70 text-center gap-10 sm:gap-5 mx-5 my-10 sm:m-20">
          <div className="flex flex-col justify-center items-center text-center gap-2 w-full sm:w-1/3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/84/84380.png"
              onClick={handleOpen}
              className="cursor-pointer w-18 md:w-28"
            />
            <p className="text-[20px] md:text-[25px]">Edit profile</p>
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Edit Profile
              </Typography>
              {tabs == 0 ? changeDetailBlock : changePwdBlock}
            </Box>
          </Modal>
          <div className="flex flex-col justify-center items-center text-center gap-2 w-full sm:w-1/3">
            <Link to="/add-listing">
              <img
                className="w-16 md:w-28"
                src="https://cdn-icons-png.flaticon.com/512/1828/1828817.png"
              ></img>
            </Link>
            <p className="text-[20px] md:text-[25px]">Add properties</p>
          </div>
          <div className="flex flex-col justify-center items-center text-center gap-2 w-full sm:w-1/3">
            <Link to="/lease">
              <img
                className="w-16 md:w-28"
                src="https://cdn-icons-png.flaticon.com/512/709/709586.png"
              ></img>
            </Link>
            <p className="text-[20px] md:text-[25px]">View properties</p>
          </div>
        </div>
      </div>
    </div>
  );
}
