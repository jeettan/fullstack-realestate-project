import { useEffect, useState } from "react";
import axios from "../../axios";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Recommended() {
  const [recommendedProperties, setRecommendedProperties] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageSet, setImageSet] = useState<React.JSX.Element[]>([]);

  const initialState = [
    { index: 0, pos: 0, active: true },
    { index: 1, pos: 1, active: true },
    { index: 2, pos: 2, active: true },
    { index: 3, pos: 3, active: true },
    { index: 4, pos: 4, active: true },
    { index: 5, pos: "inactive", active: false },
  ];

  const handleLeftClick = () => {
    setActiveIndex((prevIndex) => {
      if (prevIndex + 1 > initialState.length - 1) {
        return 0;
      }
      return prevIndex + 1;
    });
  };

  const handleRightClick = () => {
    setActiveIndex((prevIndex) => {
      if (prevIndex - 1 < 0) {
        return initialState.length - 1;
      }
      return prevIndex - 1;
    });
  };

  useEffect(() => {
    initialState.forEach((item) => {
      item["active"] = false;
      item["pos"] = "inactive";
    });

    for (let i = 0; i < 5; i++) {
      const idx = (activeIndex + i) % initialState.length;
      initialState[idx]["active"] = true;
      initialState[idx]["pos"] = i;
    }

    updateImages();
  }, [activeIndex]);

  const updateImages = () => {
    let images = [];

    for (let j = 0; j < initialState.length; j++) {
      for (let i = 0; i < initialState.length; i++) {
        if (initialState[i].active && initialState[i].pos == j) {
          images.push(
            <img
              key={i}
              src={recommendedProperties[i]}
              className="w-9 h-13 md:w-30 md:h-30 lg:w-55 lg:h-64 object-cover m-3 rounded-lg cursor-pointer"
            />,
          );
        }
      }
    }
    setImageSet(images);
  };

  useEffect(() => {
    updateImages();
  }, [recommendedProperties]);

  useEffect(() => {
    axios.get(`/frontpage/recommended_properties`).then((response) => {
      setRecommendedProperties(response.data);
    });
  }, []);

  return (
    <div className=" pl-0 mt-5 md:pt-10">
      <h2 className="text-2xl md:text-4xl font-bold text-center pb-5">
        Recommended Properties
      </h2>
      <div className="flex flex-row justify-center items-center w-100%">
        <div
          className="text-2xl md:text-4xl cursor-pointer"
          onClick={() => handleLeftClick()}
        >
          <ArrowBackIcon />
        </div>
        {imageSet}
        <div
          className="text-2xl md:text-4xl cursor-pointer"
          onClick={() => handleRightClick()}
        >
          <ArrowForwardIcon />
        </div>
      </div>
    </div>
  );
}
