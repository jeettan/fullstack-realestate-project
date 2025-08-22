import Nav from "../Reusable/Nav";
import "../../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Reusable/Footer";
import axios from "../../axios.ts";
import { Link } from "react-router-dom";

export default function Lease() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    axios
      .post("/verify-token", { token })
      .then(() => {
        return axios.post("/grab-rental-properties-with-id", {
          token: localStorage.getItem("token"),
          query: query,
        });
      })
      .catch((err) => {
        console.log(err);
        navigate("/");
        return;
      })
      .then((response) => {
        if (response) {
          setProperties(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .post("/grab-rental-properties-with-id", {
        query: query,
      })
      .then((res) => {
        setProperties(res.data);
      });
  }, [query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="main">
      <Nav />
      <div>
        <h2 className="font-bold">My listings</h2>
        <div className="flex justify-between">
          <input
            type="text"
            className="border border-solid px-2 py-1"
            placeholder="Search"
            value={query}
            onChange={(e) => handleChange(e)}
          />
          <Link to="/add-listing">
            <button className="bg-blue-500 text-white p-3 shadow-md cursor-pointer">
              Add Listing
            </button>
          </Link>
        </div>
        <div className="bg-gray-300 h-full flex flex-col items-center mt-7 pb-5">
          {properties.map((property) => {
            return (
              <div
                className="flex justify-between items-center shadow-xl rounded-lg bg-white w-[75%] mt-10"
                key={property["id"]}
              >
                <img
                  src={property["featured_image_url"]}
                  width={300}
                  alt="Random placeholder"
                  className="p-5"
                />
                <div className="p-10 text-right">
                  <Link to={`/edit-listing/${property["id"]}`}>
                    <button className="bg-red-800 p-3 text-white shadow-lg cursor-pointer">
                      Edit details
                    </button>
                  </Link>
                  <p className="text-2xl text-right font-bold">
                    {property["title"]}
                  </p>
                  <p className="text-md text-right italic">
                    Listed on{" "}
                    {new Date(property["date_listed"]).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between items-center shadow-xl rounded-lg bg-white w-[75%] mt-10">
            <img
              src={"https://picsum.photos/300/200"}
              width={300}
              alt="Random placeholder"
              className="p-5"
            />

            <div className="p-10 text-right">
              <button className="bg-red-800 p-3 text-white shadow-lg cursor-pointer">
                Edit details
              </button>
              <p className="text-2xl text-right font-bold">
                The Cayote House and all of its surroundings
              </p>
              <p className="text-md text-right italic">Listed on 3/3/2025</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
