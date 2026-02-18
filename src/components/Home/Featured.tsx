import { useEffect, useState } from "react";
import axios from "../../axios";

export default function Featured() {
  const [featuredImages, setFeaturedImages] = useState([]);
  useEffect(() => {
    axios
      .get(`/frontpage/featured`)
      .then((response) => {
        setFeaturedImages(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="featured pt-10">
      <h2 className="font-bold text-4xl pl-10 pb-3">Featured Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="col-span-1 h-full cursor-pointer group relative">
          <img src={featuredImages[0]} className="h-full w-full"></img>
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-75 transition-opacity">
            <p className="text-white text-lg font-semibold">View property</p>
          </div>
        </div>
        <div className="col-span-1 flex flex-col h-full cursor-pointer">
          <div className="group relative h-1/2">
            <img
              src={featuredImages[1]}
              className="h-full w-full object-cover"
            ></img>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-75 transition-opacity">
              <p className="text-white text-lg font-semibold">View property</p>
            </div>
          </div>
          <div className="group relative h-1/2">
            <img
              src={featuredImages[2]}
              className="object-cover w-full h-full"
            ></img>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-75 transition-opacity">
              <p className="text-white text-lg font-semibold">View property</p>
            </div>
          </div>
        </div>
        <div className="col-span-1 group relative cursor-pointer">
          <img src={featuredImages[3]} className="h-full w-full"></img>
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-75 transition-opacity">
            <p className="text-white text-lg font-semibold">View property</p>
          </div>
        </div>
      </div>
    </div>
  );
}
