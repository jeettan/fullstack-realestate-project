import Left from "../../assets/left.png";
import GroupIcon from "@mui/icons-material/Group";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import EuroIcon from "@mui/icons-material/Euro";

export default function Benefit() {
  return (
    <div className="flex flex-row m-10 bg-gray-800">
      <div className="flex-1">
        <img src={Left} />
      </div>
      <div className="flex-1 p-9 text-white">
        <h2 className="text-4xl font-bold">Why work with us?</h2>
        <div className="mt-15">
          <div className="mb-3">
            <GroupIcon />
            <span className="ml-3">
              One of the most comprehensive marketplaces in Bangkok.
            </span>
          </div>
          <div className="mb-3">
            <ThumbUpOffAltIcon />
            <span className="ml-3">4.5/5 star rating on Google Reviews.</span>
          </div>
          <div>
            <EuroIcon />
            <span className="ml-3">
              Free to get started, sell your first property today!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
