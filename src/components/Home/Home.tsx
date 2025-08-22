import Navbar from "../Reusable/Nav";
import Hero from "./Hero";
import Featured from "./Featured";
import Recommended from "./Recommended";
import Review from "./Review";
import Benefit from "./Benefit";
import Footer from "../Reusable/Footer";

export default function Home() {
  return (
    <>
      <div className="main">
        <Navbar />
        <Hero />
        <Featured />
        <Recommended />
        <Benefit />
        <Review />
      </div>
      <Footer />
    </>
  );
}
