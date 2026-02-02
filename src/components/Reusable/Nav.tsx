import logo from "../../assets/logo.jpg";
import { Link } from "react-router-dom";
import CheckLogin from "../Reusable/CheckLogin";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  let login = CheckLogin();

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 px-6">
      <div className="w-full flex flex-wrap items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src={logo} className="h-20 md:h-25" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Real Estate Homes
          </span>
        </Link>
        <div
          className="block md:hidden text-3xl cursor-pointer sm:align-center"
          onClick={() => setOpen(!open)}
        >
          ☰
        </div>
        <div
          className={`rounded absolute z-50 top-0 right-0 w-42 shadow-[0_0_15px_rgba(0,0,0,0.35)] translate-y-18 -translate-x-5 bg-white md:hidden ${open ? "block" : "hidden"}`}
        >
          <ul className="text-black text-right px-5 pt-2 divide-y divide-gray-300">
            <li
              className="py-2 hover:text-gray-400 cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </li>

            <li
              className="py-2 hover:text-gray-400 cursor-pointer"
              onClick={() => navigate("/rent")}
            >
              Rent
            </li>
            <li
              className="py-2 hover:text-gray-400 cursor-pointer"
              onClick={() => navigate("/lease")}
            >
              Lease
            </li>
            <li
              className="py-2 hover:text-gray-400 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </li>
          </ul>
        </div>
        <div className="hidden w-full md:block md:w-auto">
          <ul className="flex flex-col font-medium md:p-0 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to="/dashboard"
                className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                aria-current="page"
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/rent"
                className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                aria-current="page"
              >
                Rent
              </Link>
            </li>
            <li>
              <Link
                to="/lease"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Lease
              </Link>
            </li>
            <li>
              {login === false ? (
                <Link
                  to="/login"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Login
                </Link>
              ) : (
                <Link
                  to="/signout"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Signout
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
