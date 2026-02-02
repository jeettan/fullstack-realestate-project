import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function Footer() {
  return (
    <div className="w-full flex flex-row bg-gray-800 justify-center items-center p-4 space-x-5  text-white mt-7">
      <p>Developed by Jeet Tan</p>
      <div className="flex space-x-3">
        <a
          className="cursor-pointer"
          href="https://github.com/jeettan"
          target="_blank"
        >
          <GitHubIcon sx={{ color: "white" }}></GitHubIcon>
        </a>
        <a
          className="cursor-pointer"
          href="https://www.linkedin.com/in/jeettanofficial/"
          target="_blank"
        >
          <LinkedInIcon sx={{ color: "white" }}></LinkedInIcon>
        </a>
      </div>
    </div>
  );
}
