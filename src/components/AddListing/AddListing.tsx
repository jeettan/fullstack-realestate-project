import Nav from "../Reusable/Nav";
import axios from "../../axios";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../Reusable/Spinner";

export default function AddListing() {
  const [latlng, setlatlng] = useState<[number, number]>([0, 0]);
  const [isLoading, setisLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const navigate = useNavigate();

  interface PropertyFormData {
    propName: string;
    description: string;
    address: string;
    rent: number | null;
    bedrooms: number | null;
    plot_size: number | null;
    parking_spots: number | null;
    storeys: number | null;
    year_completed: number | null;
    dev_name: string;
    agent_name: string;
    agent_number: string;
    agent_id: string;
    typeOfHouse: string;
    features: string[];
    featured_photo: File | null;
    photos: File[] | null;
  }

  const [formData, setFormData] = useState<PropertyFormData>({
    propName: "",
    description: "",
    rent: null,
    address: "",
    bedrooms: null,
    plot_size: null,
    parking_spots: null,
    storeys: null,
    year_completed: null,
    dev_name: "",
    agent_name: "",
    agent_number: "",
    agent_id: "",
    typeOfHouse: "",
    features: [],
    featured_photo: null,
    photos: [],
  });

  /*


  const [formData, setFormData] = useState<PropertyFormData>({
    propName: "Test Property",
    description: "This is a luxurious condo located in the heart of the city.",
    rent: 35000,
    address: "The Office thonglor",
    bedrooms: 3,
    plot_size: 4,
    parking_spots: 9,
    storeys: 5,
    year_completed: 1995,
    dev_name: "Mr Jeet",
    agent_name: "Jame",
    agent_number: "064-451-5415",
    agent_id: "james",
    typeOfHouse: "condo",
    features: ["security", "swimming_pool"],
    featured_photo: null,
    photos: [],
  });

  */

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setFormData({
      ...formData,
      featured_photo: e.target.files[0],
    });
  };

  const handleMultiFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return; //

    const fileArray: File[] = Array.from(files);

    setFormData((prev) => ({
      ...prev,
      photos: fileArray,
    }));
  };

  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      features: checked
        ? [...prev.features, value] // add
        : prev.features.filter((item) => item !== value),
    }));
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .post("/users/verify-token", {
          token: token,
        })
        .catch((err) => {
          console.log(err);
          navigate("/");
        });
    } else {
      navigate("/");
    }
  }, []);

  const buildFormData = (formState: PropertyFormData) => {
    if (
      formState.rent == null ||
      formState.bedrooms == null ||
      formState.plot_size == null ||
      formState.storeys == null ||
      formState.parking_spots == null ||
      formState.year_completed == null
    ) {
      return;
    }

    const data = new FormData();

    // Append normal fields
    data.append("propName", formState.propName);
    data.append("description", formState.description);
    data.append("address", formState.address);
    data.append("rent", formState.rent.toString());
    data.append("bedrooms", formState.bedrooms.toString());
    data.append("plot_size", formState.plot_size.toString());
    data.append("parking_spots", formState.parking_spots.toString());
    data.append("storeys", formState.storeys.toString());
    data.append("year_completed", formState.year_completed.toString());
    data.append("dev_name", formState.dev_name);
    data.append("agent_name", formState.agent_name);
    data.append("agent_number", formState.agent_number);
    data.append("agent_id", formState.agent_id);
    data.append("typeOfHouse", formState.typeOfHouse);

    // Append features array
    formState.features.forEach((feature) => {
      data.append("features", feature);
    });

    // Append featured photo (single file)
    if (formState.featured_photo) {
      data.append("featured_photo", formState.featured_photo);
    }

    if (formState.photos) {
      // Append gallery photos (multiple files)
      formState.photos.forEach((file) => {
        data.append("photos", file);
      });
    }

    return data;
  };

  const submitData = async (e: any) => {
    e.preventDefault();
    setisLoading(true);

    if (buttonRef.current) {
      buttonRef.current.disabled = true;
    }

    const data = buildFormData(formData);

    /*

    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }
      */

    try {
      await axios.post("/properties/add-properties", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      console.log(err);
    } finally {
      setisLoading(false);
      setTimeout(() => {
        window.scrollTo(0, 0);
        window.location.reload();
      }, 1000);
    }
  };

  const checkMaps = () => {
    if (formData.address == "") {
      return;
    }

    axios
      .post("/maps/lat-lng", {
        address: formData.address,
      })
      .then((res) => {
        let latlng: [number, number] = [res.data.lat, res.data.lng];
        setlatlng(latlng);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="main">
      <Nav />
      <div className="bg-gray-100 min-h-screen p-3">
        <form onSubmit={(e) => submitData(e)} ref={formRef}>
          <div className="flex flex-col justify-center items-center md:items-start bg-white w-1/2 mx-auto shadow-lg p-16 m-5 w-[100%] md:w-[60%]">
            <h2 className="font-bold text-4xl text-center md:text-start">
              Add Property
            </h2>
            <h3 className="font-bold text-2xl mt-5">Main</h3>
            <label>Property Name*</label>
            <input
              type="text"
              className="bg-gray-100 m-3 py-3 px-5 text-black w-100 rounded-2xl w-full"
              placeholder="Property Name"
              name="propName"
              value={formData.propName}
              onChange={handleFormChange}
              required
            />
            <label className="mb-2">Description*</label>
            <textarea
              className="border mb-2 w-full"
              name="description"
              placeholder="Description"
              style={{ resize: "none", padding: "10px" }}
              value={formData.description}
              onChange={handleFormChange}
              required
            ></textarea>
            <label>Rent / month (THB)*</label>
            <input
              type="number"
              className="bg-gray-100 m-3 py-3 px-5 text-black w-100 rounded-2xl w-full"
              placeholder="Rental price/month"
              name="rent"
              min="0"
              value={formData.rent ?? ""}
              onChange={handleFormChange}
              required
            />
            <label>Your address*</label>
            <textarea
              className="border w-full"
              placeholder="Your Address"
              style={{ resize: "none", padding: "10px" }}
              value={formData.address}
              onChange={handleFormChange}
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
            <label className="mb-3">Housing Type*</label>
            <select
              name="typeOfHouse"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none ml-2 mb-3"
              value={formData.typeOfHouse}
              onChange={handleFormChange}
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
                      id="vehicle1"
                      name="features"
                      value="security"
                      checked={formData.features.includes("security")}
                      onChange={handleAmenityChange}
                    />
                    <label htmlFor="vehicle1"> Security</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="vehicle2"
                      name="features"
                      value="swimming_pool"
                      checked={formData.features.includes("swimming_pool")}
                      onChange={handleAmenityChange}
                    />
                    <label htmlFor="vehicle2"> Swimming Pool</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="vehicle3"
                      name="features"
                      value="laundry"
                      checked={formData.features.includes("laundry")}
                      onChange={handleAmenityChange}
                    />
                    <label htmlFor="vehicle3"> Laundry</label>
                  </div>
                </div>

                <div>
                  <div>
                    <input
                      type="checkbox"
                      id="vehicle3"
                      name="features"
                      value="co_working"
                      checked={formData.features.includes("co_working")}
                      onChange={handleAmenityChange}
                    />
                    <label htmlFor="vehicle3"> Co working</label>
                  </div>

                  <div>
                    <input
                      type="checkbox"
                      id="vehicle3"
                      name="features"
                      value="fitness"
                      checked={formData.features.includes("fitness")}
                      onChange={handleAmenityChange}
                    />
                    <label htmlFor="vehicle3"> Fitness</label>
                  </div>

                  <div>
                    <input
                      type="checkbox"
                      id="vehicle3"
                      name="features"
                      value="garden"
                      checked={formData.features.includes("garden")}
                      onChange={handleAmenityChange}
                    />
                    <label htmlFor="vehicle3"> Garden</label>
                  </div>
                </div>
              </div>
            </div>
            <label># of Bedrooms*</label>
            <input
              type="number"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-100 w-full"
              placeholder="Bedrooms"
              name="bedrooms"
              min={0}
              max={100}
              value={formData.bedrooms ?? ""}
              onChange={handleFormChange}
              required
            />
            <label>Plot size (sq/m)*</label>
            <input
              type="number"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Plot size"
              name="plot_size"
              min="0"
              value={formData.plot_size ?? ""}
              onChange={handleFormChange}
              required
            />
            <label># of Parking Spots*</label>
            <input
              type="number"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Parking spots"
              name="parking_spots"
              min="0"
              value={formData.parking_spots ?? ""}
              onChange={handleFormChange}
              required
            />
            <label>Storeys*</label>
            <input
              type="number"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Storeys"
              name="storeys"
              min="0"
              value={formData.storeys ?? ""}
              onChange={handleFormChange}
              required
            />
            <label>Completion Year*</label>
            <input
              type="number"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Completion Year"
              name="year_completed"
              min="1850"
              value={formData.year_completed ?? ""}
              onChange={handleFormChange}
              required
            />
            <label>Developer Name*</label>
            <input
              type="text"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Developer name"
              name="dev_name"
              value={formData.dev_name}
              onChange={handleFormChange}
              required
            />
            <h3 className="font-bold text-2xl">Upload Photos</h3>
            <label>Featured Photo*</label>
            <input
              type="file"
              className="file:bg-gray-200 file:text-black file:rounded file:px-2 file:py-1 w-full"
              name="fileSingle"
              accept="image/*"
              onChange={handleSingleFileChange}
              required
            />
            <label className="pt-4">
              Supplementary Photos (optional, add up to 6)
            </label>
            <input
              type="file"
              className="file:bg-gray-200 file:text-black file:rounded file:px-2 file:py-1 w-full"
              name="photos"
              accept="image/*"
              onChange={handleMultiFileChange}
              multiple
            />

            <h3 className="font-bold text-2xl">Agent Contact</h3>
            <label>Agent Name*</label>
            <input
              type="text"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Agent Name"
              name="agent_name"
              value={formData.agent_name}
              onChange={handleFormChange}
              required
            />
            <label>Agent Mobile*</label>
            <input
              type="text"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Agent contact"
              name="agent_number"
              value={formData.agent_number}
              onChange={handleFormChange}
              required
            />
            <label>Agent LINE ID*</label>
            <input
              type="text"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="LINE ID"
              name="agent_id"
              value={formData.agent_id}
              onChange={handleFormChange}
              required
            />
            <button
              ref={buttonRef}
              type="submit"
              className="ml-5 mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              {isLoading ? <Spinner /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
