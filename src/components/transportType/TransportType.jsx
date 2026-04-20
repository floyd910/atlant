import "./TransportType.css";

export default function TransportType({ handleImageClick }) {
  const delicaImages = [
    "https://res.cloudinary.com/dxhhvp8jh/image/upload/v1706876576/tranport/DSCF7879_gk3va8.jpg",
    "https://res.cloudinary.com/dxhhvp8jh/image/upload/v1706876574/tranport/DSCF9725_o8edgw.jpg",
    "https://res.cloudinary.com/dxhhvp8jh/image/upload/v1706876632/tranport/DSCF9396_ryohvh.jpg",
  ];

  const sprinterImages = [
    "https://res.cloudinary.com/dxhhvp8jh/image/upload/v1706876576/tranport/DSCF2845_st5ooh.jpg",
    "https://res.cloudinary.com/dxhhvp8jh/image/upload/v1706876575/tranport/DSCF2465_zcbhpi.jpg",
  ];

  return (
    <div className="transport_type">
      <h4>Transport Type</h4>
      <div className="transport_description">
        <ul>
          <li>
            <b>Model:</b> Mitsubishi Delica
          </li>
          <li>
            <b>Type:</b> 4X4 Van
          </li>
          <li>
            <b>Capacity:</b> 5+1 passengers
          </li>
        </ul>
        <div className="images">
          {delicaImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="Mitsubishi Delica - PinGeorgia.ge"
              onClick={() => handleImageClick(img)}
            />
          ))}
        </div>

        <div>
          <p>
            <b>Mercedes-Benz Sprinter 17 PAX</b>
          </p>
          <div className="images">
            {sprinterImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Mercedes-Benz Sprinter 17 PAX - PinGeorgia.ge"
                onClick={() => handleImageClick(img)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
