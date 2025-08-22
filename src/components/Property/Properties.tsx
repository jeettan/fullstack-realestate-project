import Navbar from "../Reusable/Nav";
import Footer from "../Reusable/Footer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../axios";

import Carousel from "react-material-ui-carousel";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import Item from "./Item";
import SecurityIcon from "@mui/icons-material/Security";
import PoolIcon from "@mui/icons-material/Pool";
import WorkIcon from "@mui/icons-material/Work";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import DryCleaningIcon from "@mui/icons-material/DryCleaning";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Properties() {
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
    lat: number;
    lng: number;
    line_id: string;
    folder_id: string;
  }

  const featureMap: { [key: string]: { icon: React.ReactNode; text: string } } =
    {
      security: {
        icon: <SecurityIcon sx={{ width: 40, height: 40 }} />,
        text: "security",
      },
      swimming_pool: {
        icon: <PoolIcon sx={{ width: 40, height: 40 }} />,
        text: "Swimming Pool",
      },
      co_working: {
        icon: <WorkIcon sx={{ width: 40, height: 40 }} />,
        text: "Co working",
      },
      fitness: {
        icon: <FitnessCenterIcon sx={{ width: 40, height: 40 }} />,
        text: "Fitness",
      },
      garden: {
        icon: <LocalFloristIcon sx={{ width: 40, height: 40 }} />,
        text: "Garden",
      },
      laundry: {
        icon: <DryCleaningIcon sx={{ width: 40, height: 40 }} />,
        text: "Laundry",
      },
    };

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
    bedrooms: null,
    plot_size: null,
    storeys: null,
    user_id: 0,
    featured_image_url: "",
    developer_name: "",
    completion_year: 0,
    parking_spots: null,
    lat: 0,
    lng: 0,
    folder_id: "",
  });

  const propertyImages = () => {
    if (imageCount > 2) {
      return (
        <div className="grid grid-cols-2 w-full max-w-[700px] aspect-[2/1] mx-auto">
          <div className="h-full">
            <img
              src={imageCarousel[0]}
              className="w-full h-full object-cover"
              alt="Left image"
            />
          </div>
          <div className="flex flex-col h-full">
            <div className="h-1/2">
              <img
                src={imageCarousel[1]}
                className="w-full h-full object-cover"
                alt="Top right"
              />
            </div>
            <div
              className={`relative h-1/2 w-full ${
                imageCount - 3 > 0 ? "cursor-pointer" : ""
              }`}
              onClick={imageCount - 3 > 0 ? handleOpen : undefined}
            >
              <img
                src={imageCarousel[2]}
                className="w-full h-full object-cover"
                alt="Bottom right"
              />

              {imageCount - 3 > 0 ? (
                <>
                  <div className="absolute inset-0 bg-black opacity-50"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white text-[24px] select-none">
                      (+{imageCount - 3} images)
                    </p>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Carousel>
                {imageCarousel.map((item, index) => (
                  <Item key={index} item={{ download_url: item }}></Item>
                ))}
              </Carousel>
            </Box>
          </Modal>
        </div>
      );
    } else if (imageCount <= 2) {
      return (
        <div className="flex flex-row gap-10 item-center justify-center">
          <img src={imageCarousel[0]} className="w-1/3" />
          {imageCount == 2 ? (
            <img src={imageCarousel[1]} className="w-1/3" />
          ) : (
            ""
          )}
        </div>
      );
    } else {
      return <p>Loading image..</p>;
    }
  };

  const [imageCarousel, setImageCarousel] = useState([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [imageCount, setImagecount] = useState(0);
  const [latlng, setlatlng] = useState<[number, number]>([0, 0]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    axios
      .post("/grab-rental-properties-with-property-id", {
        id: id,
      })
      .then((response) => {
        setProperties(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (properties?.id) {
      axios
        .get("/grab-rental-images", {
          params: {
            id: properties["folder_id"],
          },
        })
        .then((response) => {
          setImageCarousel(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [properties]);

  useEffect(() => {
    if (properties["features"] != null && properties["features"] != "") {
      let text = properties["features"].split(",").map((item) => item.trim());
      setFeatures(text);
    }

    if (properties["lat"]) {
      let latlng: [number, number] = [properties["lat"], properties["lng"]];
      setlatlng(latlng);
    }
  }, [properties]);

  useEffect(() => {
    setImagecount(imageCarousel.length);
  }, [imageCarousel]);

  return (
    <>
      <div className="main">
        <Navbar />
        <div className="">
          <h2 className="font-bold text-center text-[45px]">
            {properties ? properties["title"] : ""}
          </h2>
          <div className="items-center flex justify-center m-5">
            <img
              src={properties ? properties["featured_image_url"] : ""}
              width={800}
              className="rounded-md"
            ></img>
          </div>
          <h2 className="font-bold text-4xl m-5 text-center">
            Property Images
          </h2>
          {propertyImages()}

          <h2 className="font-bold text-4xl mx-15 my-4 text-center">
            Description
          </h2>
          <p className="text-center">{properties["description"]}</p>
          <h2 className="font-bold text-4xl mx-15 my-4 text-center">
            About Condo
          </h2>
          <table className="table-auto w-full flex justify-center items-center">
            <tbody>
              <tr className="m-10">
                <td className="font-bold p-4 border border-gray-400">
                  Number of bedrooms
                </td>
                <td className="border border-gray-400 p-4">
                  {properties["bedrooms"]}
                </td>
                <td className="border border-gray-400 font-bold p-4">
                  Rental Price
                </td>
                <td className="border border-gray-400 p-4">
                  {properties["price"]} THB/month
                </td>
              </tr>
              <tr className="border border-gray-400">
                <td className="font-bold border border-gray-400 p-4">
                  Storeys
                </td>
                <td className="border border-gray-400 p-4">
                  {properties["storeys"]}
                </td>
                <td className="border border-gray-400 font-bold p-4">
                  Completion Year
                </td>
                <td className="border border-gray-400 p-4">
                  {properties["completion_year"]}
                </td>
              </tr>
              <tr>
                <td className="font-bold border border-gray-400 p-4">
                  Plot Size
                </td>
                <td className="border border-gray-400 p-4">
                  {properties["plot_size"]} Sq.m
                </td>
                <td className="border border-gray-400 font-bold p-4">
                  Developer Name
                </td>
                <td className="border border-gray-400 p-4">
                  {properties["developer_name"]}
                </td>
              </tr>
              <tr>
                <td className="font-bold border border-gray-400 p-4">
                  Parking
                </td>
                <td className="border border-gray-400 p-4">
                  {properties["parking_spots"]}
                </td>
                <td className="border border-gray-400 p-4 font-bold">
                  Property Type
                </td>
                <td className="border border-gray-400 p-4">
                  {properties["property_type"]}
                </td>
              </tr>
            </tbody>
          </table>
          <h2 className="font-bold text-4xl mx-15 my-4 text-center">
            Features & Amenities
          </h2>

          {features && features.length > 0 ? (
            <div className="grid grid-cols-3 place-items-center">
              {features.map((feature, index) => (
                <div
                  className="flex flex-col justify-center items-center m-5"
                  key={index}
                >
                  <p>
                    {features && features.length > 0
                      ? featureMap[feature]?.["icon"]
                      : ""}
                  </p>
                  <p>
                    {features && features.length > 0
                      ? featureMap[feature]?.["text"]
                      : ""}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">None available</div>
          )}

          <h2 className="font-bold text-4xl mx-15 my-4 text-center">
            Location
          </h2>
          <MapContainer
            key={latlng.toString()}
            center={latlng}
            zoom={14}
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
          <h2 className="font-bold text-4xl mx-15 my-4 text-center">
            Agent Contact
          </h2>
          <div className="text-center">
            <h3 className="text-2xl">
              <span className="font-bold"> Agent: </span>
              {properties["agent_name"]}
            </h3>
            <h3 className="text-2xl">
              <span className="font-bold"> Contact:</span>{" "}
              {properties["agent_contact"]}
            </h3>
            <h3 className="text-2xl">
              {" "}
              <span className="font-bold">LINE:</span> {properties["line_id"]}
            </h3>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
