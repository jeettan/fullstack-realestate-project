import Nav from "../Reusable/Nav";
import axios from "../../axios";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import AddIcon from "@mui/icons-material/Add";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function AddListing() {
  const [address, setAddress] = useState("");
  const [latlng, setlatlng] = useState<[number, number]>([0, 0]);
  const [fileUpload, setFileUpload] = useState<React.ReactElement[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setisLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .post("/verify-token", {
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

  const addDiv = () => {
    setFileUpload((prev) => {
      if (prev.length >= 5) {
        return prev;
      }

      return [
        ...prev,
        <input
          key={prev.length}
          type="file"
          ref={inputRef}
          name="fileBulk"
          className="file:bg-gray-200 file:text-black file:rounded file:px-2 file:py-1 w-full my-2 bg-gray-200 rounded-md"
        />,
      ];
    });
  };

  const Spinner = () => (
    <div role="status">
      <svg
        aria-hidden="true"
        className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );

  const handleAddress = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAddress(event.target.value);
  };

  const submitData = async (e: any) => {
    console.log(e.target);
    e.preventDefault();
    const formData = new FormData(e.target);

    setisLoading(true);

    if (buttonRef.current) {
      buttonRef.current.disabled = true;
    }

    try {
      await axios.post("/add-properties", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFileUpload([]);
      formRef.current?.reset();

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };

  const checkMaps = () => {
    if (address == "") {
      return;
    }

    axios
      .post("/get-lat-long", {
        address: address,
      })
      .then((res) => {
        let latlng: [number, number] = [res.data.lat, res.data.lng];
        setlatlng(latlng);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    const files = e.target.files[0];
    setSelectedFile(files);
  };

  return (
    <div className="main">
      <Nav />
      <div className="bg-gray-100 min-h-screen p-3">
        <form onSubmit={(e) => submitData(e)} ref={formRef}>
          <div className="flex flex-col justify-center items-start bg-white w-1/2 mx-auto shadow-lg p-16 m-5">
            <h2 className="font-bold text-4xl">Add Property</h2>
            <h3 className="font-bold text-2xl mt-5">Main</h3>
            <label>Property Name*</label>
            <input
              type="text"
              className="bg-gray-100 m-3 py-3 px-5 text-black w-100 rounded-2xl w-full"
              placeholder="Property Name"
              name="propName"
            />
            <label className="mb-2">Description*</label>
            <textarea
              className="border mb-2 w-full"
              name="description"
              placeholder="Description"
              style={{ resize: "none", padding: "10px" }}
            ></textarea>
            <label>Rent / month (THB)*</label>
            <input
              type="number"
              className="bg-gray-100 m-3 py-3 px-5 text-black w-100 rounded-2xl w-full"
              placeholder="Rental price/month"
              name="rent"
              min="0"
            />
            <label>Your address*</label>
            <textarea
              className="border w-full"
              placeholder="Your Address"
              style={{ resize: "none", padding: "10px" }}
              value={address}
              onChange={handleAddress}
              name="address"
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
                    />
                    <label htmlFor="vehicle1"> Security</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="vehicle2"
                      name="features"
                      value="swimming_pool"
                    />
                    <label htmlFor="vehicle2"> Swimming Pool</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="vehicle3"
                      name="features"
                      value="laundry"
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
                    />
                    <label htmlFor="vehicle3"> Co working</label>
                  </div>

                  <div>
                    <input
                      type="checkbox"
                      id="vehicle3"
                      name="features"
                      value="fitness"
                    />
                    <label htmlFor="vehicle3"> Fitness</label>
                  </div>

                  <div>
                    <input
                      type="checkbox"
                      id="vehicle3"
                      name="features"
                      value="garden"
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
              min="0"
            />
            <label>Plot size (sq/m)*</label>
            <input
              type="number"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Plot size"
              name="plot_size"
              min="0"
            />
            <label># of Parking Spots*</label>
            <input
              type="number"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Parking spots"
              name="parking_spots"
              min="0"
            />
            <label>Storeys*</label>
            <input
              type="number"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Storeys"
              name="storeys"
              min="0"
            />
            <label>Completion Year*</label>
            <input
              type="number"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Completion Year"
              name="year_completed"
              min="1850"
            />
            <label>Developer Name*</label>
            <input
              type="text"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Developer name"
              name="dev_name"
            />
            <h3 className="font-bold text-2xl">Upload Photos</h3>
            <label>Featured Photo*</label>
            <input
              type="file"
              className="file:bg-gray-200 file:text-black file:rounded file:px-2 file:py-1"
              onChange={handleFileSelected}
              name="fileSingle"
              required
            />
            <label className="pt-4">
              Supplementary Photos (optional, add up to 6)
            </label>
            <input
              type="file"
              className="file:bg-gray-200 file:text-black file:rounded file:px-2 file:py-1 w-full"
              name="fileBulk"
            />

            {fileUpload}

            <div className="flex flex-row mt-8">
              <AddIcon className="cursor-pointer" onClick={addDiv} />
              <span className="text-blue font-bold">ADD MORE IMAGES</span>
            </div>

            <h3 className="font-bold text-2xl">Agent Contact</h3>
            <label>Agent Name*</label>
            <input
              type="text"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Agent Name"
              name="agent_name"
            />
            <label>Agent Mobile*</label>
            <input
              type="text"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="Agent contact"
              name="agent_number"
            />
            <label>Agent LINE ID*</label>
            <input
              type="text"
              className="bg-gray-100 m-3 py-3 px-5 text-black rounded-2xl w-full"
              placeholder="LINE ID"
              name="agent_id"
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
