import "./Equimpent.css";

const Equimpent = () => {
  const equipment = [
    {
      title: "Quechua Tent100, 2 persons",
      day: 20,
      weekend: 40,
      week: 80,
      img: "https://res.cloudinary.com/dxhhvp8jh/image/upload/v1714490020/8_r8gzdn.jpg",
    },
    {
      title: "Coleman Darwin 3, 3 persons",
      day: 40,
      weekend: 80,
      week: 160,
      img: "https://res.cloudinary.com/dxhhvp8jh/image/upload/v1714490021/71J7iyrcGzL._AC_SL1500__yd8jn4.jpg",
    },
    {
      title: "Lafuma Plus, 4 persons",
      day: 50,
      weekend: 100,
      week: 200,
      img: "https://res.cloudinary.com/dxhhvp8jh/image/upload/v1714490021/usitoo-UAC0087_apfcv3.jpg",
    },
    {
      title: "Columbia Titan Pass 48 litres, unisex",
      day: 30,
      weekend: 60,
      week: 120,
      img: "https://res.cloudinary.com/dxhhvp8jh/image/upload/v1714490021/71EIFeeT40L._AC_SL1100__nlp8ut.jpg",
    },
    {
      title: "Mattress 1 person",
      day: 5,
      weekend: 10,
      week: 20,
      img: "https://res.cloudinary.com/dxhhvp8jh/image/upload/v1714489947/s-l500__29659_wktf2o.jpg",
    },
    {
      title: "Sleeping bag -  1 person",
      day: 10,
      weekend: 20,
      week: 40,
      img: "https://res.cloudinary.com/dxhhvp8jh/image/upload/v1714490021/35414824RR_ALT03_Kelty_S24_CosmicDown_40Reg__16137_gnwqsj.jpg",
    },
  ];
  return (
    <div className="rent_equipment_page page">
      <h4 className="page_title">
        <strong>Hiking equipment for rent</strong>
      </h4>
      <br />
      <p>
        If you are signed for any of our tours eqiupment will be provided for
        free during the tour. However if you wish to rent some equipment for
        personal purposes you can see prices below.
      </p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Day</th>
            <th>Weekend</th>
            <th>Week</th>
            <th>Photo</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map((price, index) => {
            return (
              <tr key={index}>
                <td>
                  <h5>
                    <strong>{price.title}</strong>
                  </h5>
                </td>
                <td>{price.day} GEL</td>
                <td>{price.weekend} GEL</td>
                <td>{price.week} GEL</td>
                <td>
                  <img
                    alt={price.title}
                    src={price.img}
                    loading="lazy" // Added lazy loading
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Equimpent;
