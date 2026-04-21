import "./Home.css";
import HeroBg from "../../components/heroBg/HeroBg";
import Slogan from "../../components/slogan/Slogan";
import Tours from "../../components/tours/Tours";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
const Home = ({ loading, setLoading }) => {
  return (
    <div className="home page">
      <HeroBg loading={loading} setLoading={setLoading} />
    </div>
  );
};

export default Home;
