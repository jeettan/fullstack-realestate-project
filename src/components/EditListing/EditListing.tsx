import Nav from "../Reusable/Nav";
import axios from "../../axios";
import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Spinner from "../Reusable/Spinner";

export default function EditListing() {
  const [firstRun, setFirstRun] = useState(false);
  const [imageCarousel, setImageCarousel] = useState<string[]>([]);
  const [latlng, setlatlng] = useState<[number, number]>([0, 0]);
  const [tokenid, settokenid] = useState<number>(0);
  const [featuredImage, setFeaturedImage] = useState("");
  const [error, setErrorMessage] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [checkbox, setcheckbox] = useState({
    security: false,
    swimming_pool: false,
    laundry: false,
    co_working: false,
    fitness: false,
    garden: false,
  });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;

    setcheckbox((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const navigate = useNavigate();
  const { id } = useParams();

  const [properties, setProperties] = useState<PropertyInterface>({
    id: 0,
    title: "",
    description: "",
    price: 0,
    address: "",
    date_listed: "",
    property_type: "",
    agent_name: "",
    agent_contact: "",
    line_id: "",
    features: null,
    bedrooms: 0,
    plot_size: 0,
    storeys: 0,
    user_id: 0,
    featured_image_url: "",
    developer_name: "",
    completion_year: 0,
    parking_spots: 0,
    lat: 0,
    lng: 0,
    folder_id: "",
  });

  interface PropertyInterface {
    id: number;
    title: string;
    description: string;
    price: number;
    address: string;
    date_listed: string; // or Date, depending on how you want to handle it
    property_type: string;
    agent_name: string;
    agent_contact: string;
    features: string | null;
    bedrooms: number | null;
    plot_size: number | null;
    parking_spots: number | null;
    storeys: number | null;
    user_id: number;
    featured_image_url: string;
    developer_name: string;
    completion_year: number;
    lat: number | null;
    lng: number | null;
    line_id: string;
    folder_id: string;
  }

  const checkMaps = () => {
    if (properties["address"] == "") {
      return;
    }

    axios
      .post("/maps/lat-lng", {
        address: properties["address"],
      })
      .then((res) => {
        let latlng: [number, number] = [res.data.lat, res.data.lng];
        setlatlng(latlng);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setProperties((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!(latlng[0] === 0 && latlng[1] === 0) && firstRun == false) {
      setFirstRun(true);
    }
  }, [latlng, checkbox, properties]);

  useEffect(() => {
    if (tokenid && properties["user_id"]) {
      if (tokenid != properties["user_id"]) {
        navigate("/");
      }
    }
  }, [properties, tokenid]);

  useEffect(() => {
    if (firstRun === false) {
      if (properties["lat"] != null && properties["lng"] != null) {
        setlatlng([properties["lat"], properties["lng"]] as [number, number]);
      }

      const features_in_array = properties["features"]
        ?.split(",")
        .map((feature) => feature.trim());

      if (features_in_array) {
        const newCheckboxState: Record<string, boolean> = {};

        for (let i = 0; i < features_in_array.length; i++) {
          const key = features_in_array[i];
          newCheckboxState[key] = true;
        }

        setcheckbox((prev) => ({
          ...prev,
          ...newCheckboxState,
        }));
      }
    }
  }, [properties]);

  useEffect(() => {
    setFeaturedImage(properties["featured_image_url"]);
  }, [properties]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .post("/users/verify-token", {
          token: token,
        })
        .then((res) => {
          settokenid(res.data.token.id);
        })
        .catch((err) => {
          console.log(err);
          navigate("/");
        });
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    axios
      .post("/properties/rental-properties-with-property-id", {
        id: id,
      })
      .then((res) => {
        setProperties(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (properties["folder_id"]) {
      axios
        .get("/properties/rental-images", {
          params: {
            id: properties["folder_id"],
          },
        })
        .then((res) => {
          setImageCarousel(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [properties]);

  const editProperties = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setisLoading(true);

    if (buttonRef.current) {
      buttonRef.current.disabled = true;
    }

    const formData = new FormData(event.currentTarget);
    formData.append("id", id ?? "");
    formData.append("carousel", JSON.stringify(imageCarousel));

    

    axios
      .patch("/properties/edit-property", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setisLoading(false);
        setTimeout(() => {
          window.scrollTo(0, 0);
          window.location.reload();
        }, 1000);
      });
  };

  const deleteProperties = () => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      setisLoading(true);

      axios
        .delete("/properties/delete-property", {
          params: { id: id },
        })
        .then(() => {
          console.log("Deleted property");
          navigate("/lease");
        })
        .finally(() => {
          setisLoading(false);
        });
    } else {
      console.log("Deletion canceled");
    }
  };

  return (
    <div className="main">
      <Nav />
      <div className="bg-gray-100 min-h-screen p-3">
        <form onSubmit={editProperties}>
          <div className="flex flex-col justify-center items-center md:items-start bg-white w-1/2 mx-auto shadow-lg p-16 m-5 w-[100%] md:w-[60%]">
            <h2 className="font-bold text-4xl">Edit Property</h2>
            <h3 className="font-bold text-2xl mt-5">Main</h3>
            <label>Property Name</label>
            <input
              type="text"
              className="bg-gray-100 m-3 py-3 px-5 text-black w-100 rounded-2xl w-full"
              placeholder="Property Name"
              name="title"
              value={properties["title"]}
              onChange={handleChange}
              required
            />
            <label className="mb-2">Description</label>
            <textarea
              className="border mb-2 w-full"
              name="description"
              placeholder="Description"
              style={{ resize: "none", padding: "10px" }}
              value={properties["description"]}
              onChange={handleChange}
              required
            ></textarea>
            <label>Rent / month (THB)</label>
            <input
              type="number"
              className="bg-gray-100 m-3 py-3 px-5 text-black w-100 rounded-2xl w-full"
              placeholder="Rental price/month"
              name="price"
              min="0"
              value={properties["price"]}
              onChange={handleChange}
              required
            />
            <label>Your address</label>
            <textarea
              className="border w-full"
              placeholder="Your Address"
              style={{ resize: "none", padding: "10px" }}
              onChange={handleChange}
              value={properties["address"]}
              name="address"
              required
            />
            <button
              type="button"
              className="bg-gray-200 p-2 shadow-md hover my-4 hover:bg-gray-400"
              onClick={checkMaps}
            >
              Check address
            </button>
            <MapContainer
              key={latlng.toString()}
              center={latlng}
              zoom={15}
              scrollWheelZoom={false}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={latlng}>
                <Popup>Your location</Popup>
              </Marker>
            </MapContainer>
            <h3 className="font-bold text-2xl mt-5">Additional Info</h3>
            <label className="mb-3">Housing Type</label>
            <select
              name="property_type"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none ml-2 mb-3"
              value={properties["property_type"]}
              onChange={handleChange}
            >
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="house">House</option>
              <option value="office">Office</option>
            </select>
            <label className="mb-3">
              Features & Anemenities (check all that apply)
            </label>
            <div>
              <div className="grid grid-cols-2 gap-20 justify-items-center">
                <div className="flex flex-col mb-3">
                  <div>
                    <input
                      type="checkbox"
                      name="features"
                      id="security"
                      value="security"
                      checked={checkbox["security"]}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="vehicle1"> Security</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name="features"
                      id="swimming_pool"
                      value="swimming_pool"
                      checked={checkbox["swimming_pool"]}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="vehicle2"> Swimming Pool</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name="features"
                      value="laundry"
                      id="laundry"
                      checked={checkbox["laundry"]}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="vehicle3"> Laundry</label>
                  </div>
                </div>

                <div>
                  <div>
                    <input
                      type="checkbox"
                      name="features"
                      value="co_working"
                      id="co_working"
                      checked={checkbox["co_working"]}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="vehicle3"> Co working</label>
                  </div>

                  <div>
                    <input
                      type="checkbox"
                      name="features"
                      value="fitness"
                      id="fitness"
                      checked={checkbox["fitness"]}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="vehicle3"> Fitness</label>
                  </div>

                  <div>
                    <input
                      type="checkbox"
                      name="features"
                      value="garden"
                      id="garden"
                      checked={checkbox["garden"]}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="vehicle3"> Garden</label>
                  </div>
                </div>
              </div>
            </div>
            <label># of Bedrooms</label>
            <input
              type="number"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-100 w-full"
              placeholder="Bedrooms"
              name="bedrooms"
              value={properties["bedrooms"] ?? ""}
              onChange={handleChange}
              min="0"
            />
            <label>Plot size (sq/m)</label>
            <input
              type="number"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Plot size"
              name="plot_size"
              value={properties["plot_size"] ?? ""}
              onChange={handleChange}
              min="0"
            />
            <label># of Parking Spots</label>
            <input
              type="number"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Parking spots"
              name="parking_spots"
              value={properties["parking_spots"] ?? ""}
              onChange={handleChange}
              min="0"
            />
            <label>Storeys</label>
            <input
              type="number"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Storeys"
              name="storeys"
              value={properties["storeys"] ?? ""}
              onChange={handleChange}
              min="0"
            />
            <label>Completion Year</label>
            <input
              type="number"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Completion Year"
              name="completion_year"
              value={properties["completion_year"] ?? ""}
              onChange={handleChange}
              min="1850"
            />
            <label>Developer Name</label>
            <input
              type="text"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Developer name"
              value={properties["developer_name"]}
              onChange={handleChange}
              name="developer_name"
            />
            <h3 className="font-bold text-2xl">Uploaded Photos</h3>
            <label>Featured Photo</label>
            <img src={featuredImage} width={300} className="mb-5"></img>
            <input
              type="file"
              name="fileSingle"
              className="file:bg-gray-200 file:text-black file:rounded file:px-2 file:py-1"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setFeaturedImage(
                  file
                    ? URL.createObjectURL(file)
                    : properties["featured_image_url"],
                );
              }}
            />

            <label className="pt-4">
              Supplementary Photos (optional, add up to 6)
            </label>

            <div className="grid grid-cols-6 items-stretch">
              {imageCarousel.map((image, index) => (
                <div key={index} className="relative inline-block">
                  <button
                    type="button"
                    onClick={() => {
                      setImageCarousel((prev) =>
                        prev.filter((_, i) => i !== index),
                      );
                    }}
                    className="absolute top-1 right-1 text-white rounded-full px-2 py-1 text-xs hover:bg-white hover:text-black"
                  >
                    x
                  </button>

                  <img
                    src={image}
                    alt="carousel"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              ))}
            </div>

            <input
              type="file"
              className="file:bg-gray-200 file:text-black file:rounded file:px-2 file:py-1 w-full my-5"
              name="fileBulk"
              onChange={(e) => {
                const files = e.target.files;
                let fileLength = files?.length;

                if (fileLength) {
                  if (fileLength + imageCarousel.length > 6) {
                    setErrorMessage(
                      "You've reached the file upload limit (6 files)",
                    );
                    return;
                  }
                }

                setErrorMessage("");

                if (files) {
                  const newImages = Array.from(files).map((file) =>
                    URL.createObjectURL(file),
                  );
                  setImageCarousel((prev) => [...prev, ...newImages]);
                }
              }}
              multiple
            />

            <p className="text-red-500">{error}</p>

            <h3 className="font-bold text-2xl">Agent Contact</h3>
            <label>Agent Name</label>
            <input
              type="text"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Agent Name"
              name="agent_name"
              value={properties["agent_name"]}
              onChange={handleChange}
            />
            <label>Agent Mobile</label>
            <input
              type="text"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Agent contact"
              value={properties["agent_contact"]}
              onChange={handleChange}
              name="agent_contact"
            />
            <label>Agent LINE ID</label>
            <input
              type="text"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="LINE ID"
              value={properties["line_id"]}
              onChange={handleChange}
              name="line_id"
            />
            <div className="flex flex-row justify-start items-center mt-5 gap-3">
              <button
                ref={buttonRef}
                type="submit"
                className="ml-4 py-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                {isLoading ? <Spinner /> : "Update"}
              </button>

              <Link to="/lease">
                <button
                  className="text-white py-3 bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 text-center mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </Link>

              <button
                onClick={deleteProperties}
                type="button"
                className="text-white py-3 bg-purple-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 text-center mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                disabled={isLoading}
              >
                {isLoading ? <Spinner /> : "Delete"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
