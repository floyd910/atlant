import "./TourItem.css";
import { Link } from "react-router-dom";

const TourItem = ({ item }) => {
  return (
    <>
      <div className="tour_item">
        <Link to={`/tour/${item.link}`} className="link">
          <img alt={item.title + " PinGeorgia tours"} src={item.cover} />
        </Link>
        <h3>{item.title}</h3>
        {/* <p className="date">Nearest date: 14 May, 2024</p> */}
        {/* <div className="difficulty">
          <p>Difficulty: moderate</p>
        </div> */}
      </div>
    </>
  );
};

export default TourItem;
