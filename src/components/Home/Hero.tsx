import House from "../../assets/house.jpg";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  const changeInput = (e) => {
    setQuery(e.target.value);
  };

  const submitInformation = () => {
    navigate(`/rent?query=${query}`);
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg bg-cover bg-no-repeat p-12 text-center"
      style={{ backgroundImage: `url(${House})`, height: "600px" }}
    >
      <div className="absolute inset-0 bg-black opacity-80 rounded-lg"></div>
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `url(${House})`,
          opacity: 0.5,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="flex flex-col items-center justify-center h-full space-y-6 relative z-10">
        <h2 className="text-white text-6xl font-bold text-shadow-sm">
          Bangkok Number One Real Estate
        </h2>
        <h3 className="text-white text-3xl font-bold">
          Rent, Lease, or Sell Property within Minutes.
        </h3>
        <div className="flex">
          <input
            name="searchbar"
            placeholder="Search for properties here"
            className="bg-white p-3 rounded-lg shadow-xs w-100"
            onChange={(e) => changeInput(e)}
            value={query}
          />
          <button onClick={submitInformation}>
            <SearchIcon
              className="cursor-pointer rounded-lg"
              sx={{
                backgroundColor: "blue",
                width: "45px",
                height: "100%",
                marginLeft: "-10%",
                padding: "10px",
                color: "white",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
