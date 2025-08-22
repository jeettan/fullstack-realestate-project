import axios from "../../axios.ts";

function CheckLogin() {
  const token = localStorage.getItem("token");

  if (!token) {
    return false;
  }

  axios
    .post("/verify-token")
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}

export default CheckLogin;
