import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function Footer() {
  return (
    <div className="w-full flex flex-row bg-gray-800 justify-center items-center p-4 space-x-5  text-white mt-7">
      <p>Developed by Jeet Tan</p>
      <div className="flex space-x-3">
        <a className="cursor-pointer">
          <InstagramIcon sx={{ color: "white" }}></InstagramIcon>
        </a>
        <a className="cursor-pointer">
          <LinkedInIcon sx={{ color: "white" }}></LinkedInIcon>
        </a>
      </div>
    </div>
  );
}
