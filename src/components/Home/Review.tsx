import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import GoogleIcon from "@mui/icons-material/Google";

export default function Review() {
  return (
    <div>
      <h2 className="text-4xl font-bold text-center">Google Reviews</h2>
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-10 m-6">
        <div className="bg-gray-50 w-75 p-5 rounded-md shadow-md">
          <div className="grid grid-cols-6">
            <Avatar>J</Avatar>
            <div className="flex flex-col col-span-4">
              <p className="font-bold">Mr James</p>
              <p className="text-sm">1/1/2025</p>
            </div>
            <GoogleIcon color="primary" />
          </div>
          <Rating defaultValue={5} />
          <p>
            This marketplace is really good and I recommend it! Amazing staff
            and I got the home I wanted
          </p>
        </div>

        <div className="bg-gray-50 w-75 p-5 rounded-md shadow-md">
          <div className="grid grid-cols-6">
            <Avatar>G</Avatar>
            <div className="flex flex-col col-span-4">
              <p className="font-bold">Mr Geet</p>
              <p className="text-sm">1/1/2025</p>
            </div>
            <GoogleIcon color="primary" />
          </div>
          <Rating defaultValue={5} />
          <p>
            I loved everything about this marketplace. It was easy to use and
            easy to buy.
          </p>
        </div>

        <div className="bg-gray-50 w-75 p-5 rounded-md shadow-md">
          <div className="grid grid-cols-6">
            <Avatar>K</Avatar>
            <div className="flex flex-col col-span-4">
              <p className="font-bold">K</p>
              <p className="text-sm">1/1/2025</p>
            </div>
            <GoogleIcon color="primary" />
          </div>
          <Rating defaultValue={5} />
          <p>
            Recommend to anyone looking for a new home. The process was smooth
            and the staff were very helpful. -Generated with AI
          </p>
        </div>
      </div>
    </div>
  );
}
