import { useEffect, useState } from "react";
import axios from "../../axios";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import SpinneRed from "../Reusable/SpinnerRed";

function numberWithCommas(x: number) {
  if (x === null || x === undefined) return "0";
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Props() {
  const [properties, setProperties] = useState([]);
  const [type, setType] = useState("");
  const [order, setOrder] = useState("");
  const [dayAgo, setDayAgo] = useState("");
  const [loading, setIsLoading] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [query, setQuery] = useState<string>(params.get("query") || "");

  useEffect(() => {
    setIsLoading(true);

    axios
      .get("/properties/rental-properties", {
        params: {
          query: query,
          type: type,
          order: order,
          dayAgo: dayAgo,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProperties(response.data);
      })
      .finally(() => setIsLoading(false));
  }, [query, type, order, dayAgo]);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value);
  };

  const handleChangetype = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.currentTarget.value);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrder(e.currentTarget.value);
  };

  const handleDayAgoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDayAgo(e.currentTarget.value);
  };
  return (
    <div className="px-10">
      <div className="">
        <h3>Filter</h3>
        <div className="flex flex-col md:flex-row w-full gap-12 align-start justify-start">
          <input
            type="text"
            className="border border-solid px-2 py-2"
            placeholder="Search"
            value={query || ""}
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <select
            className="border p-3"
            value={type}
            onChange={(e) => handleChangetype(e)}
          >
            <option value="">Sort by Type</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="house">House</option>
            <option value="office">Office</option>
          </select>

          <select
            className="border p-3"
            value={order}
            onChange={(e) => handleOrderChange(e)}
          >
            <option value="">Sort by Price</option>
            <option value="desc">Expensive</option>
            <option value="asc"> Cheapest</option>
          </select>

          <select
            className="border p-3"
            value={dayAgo}
            onChange={handleDayAgoChange}
          >
            <option value="">Days ago listed</option>
            <option value={1}>Within 1 day</option>
            <option value={7}>Within 7 days</option>
            <option value={30}>Within one month</option>
            <option value={365}>Within one year</option>
          </select>
        </div>
      </div>
      <p className="py-5 font-bold">All Condos available for rent</p>

      {loading && (
        <div className="mx-auto w-fit m-10">
          <SpinneRed />
        </div>
      )}

      {properties.map((property) => {
        return (
          <div className="flex flex-row mb-8 shadow-xl" key={property["id"]}>
            <Link to={"/properties/" + property["id"]}>
              <img
                src={property["featured_image_url"]}
                className="flex-1 w-100 h-60"
              />
            </Link>
            <div className="flex flex-col bg-blue-900 p-6 flex-5 text-white">
              <h3 className="text-[28px] font-bold">{property["title"]}</h3>
              <p className="text-sm">
                {numberWithCommas(property["price"])} THB
              </p>
              <p>{property["description"]}</p>
            </div>
          </div>
        );
      })}

      {/* <div className="flex flex-row">

      --test function
        <img
          src="https://fastly.picsum.photos/id/237/536/354.jpg?hmac=i0yVXW1ORpyCZpQ-CknuyV-jbtU7_x9EBQVhvT5aRr0"
          className="w-70 flex-1"
        ></img>
        <div className="flex flex-col bg-gray-100 p-5 flex-5">
          <p className="">Title</p>
          <p>Price</p>
          <p>Test picture hello world!</p>
        </div>
      </div> */}
    </div>
  );
}
