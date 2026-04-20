import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import "./AboutUs.css";
import Loader from "../../components/loader/Loader";

const AboutUs = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const members = [
    {
      name: "George Megrelidze",
      img: "https://res.cloudinary.com/dxhhvp8jh/image/upload/v1706877023/about_us/DSCF12410_ony8jy.jpg",
      description:
        " - General Manager of the company and a certified hiking guide, specialising in outdoor activities and mountain adventures. 10 years of guiding experience and a professional driver with off-road skills.",
      achievements: [
        "Certified hiking guide",
        "Certified canyoning instructor",
        "The founder of the Hiking Guides Association of Ajara",
        "The best tour guide award of 2022 by The Tourist Guides Association of Ajara",
        "4X4 off-road and defensive driving certified driver by the British Military Training Organization",
        "Trainer in tour guiding and instructor for schools in hiking and camping activities",
      ],
    },
    {
      name: "Beka Gelashvili",
      img: "https://res.cloudinary.com/dxhhvp8jh/image/upload/v1706877021/about_us/DSCF0024_ximgzm.jpg",
      description:
        " is a certified tour guide, specialising in outdoor activities and mountain adventures. 10 years of guiding experience and a professional driver with off-road skills.",
      achievements: [
        "Certified hiking guide",
        "The member of the Hiking Guides Association of Ajara",
        "More than 5 years of experience in Pin Georgia",
      ],
    },
    {
      name: "Vakhtang Mikeladze",
      img: "https://res.cloudinary.com/dxhhvp8jh/image/upload/v1706877020/about_us/411933081_1513806912805447_7088844198843146979_n_ic3mqb.jpg",
      description:
        " - Since 2003 he has been working in the Emergency Management Service, in the position of Senior Inspector of the Special Situation Response Department of Western Georgia.  Rescue Diver since 2006.",
      achievements: [
        "Certified hiking guide",
        "Certified canyoning instructor",
        "Certified birdwatching guide",
        "The Co-founder of the Hiking Guides Association of Ajara",
      ],
    },
    {
      name: "Beka Bolkvadze",
      img: "https://res.cloudinary.com/dxhhvp8jh/image/upload/v1706877020/about_us/DSCF2983_u5cqno.jpg",
      description:
        "  is a professional hiker and a tour guide in Pin Georgia Tours. Specialising in trekking and camping.",
      achievements: [
        "Professional off-road driver",
        "Certified hiking guide",
        "Certified off-road driver",
        "The Member of the Hiking Guides Association of Ajara",
      ],
    },
  ];

  useEffect(() => {
    const imageUrls = [
      "https://res.cloudinary.com/dxhhvp8jh/image/upload/v1706877203/about_us/DSCF0092_cover_soizjk.jpg",
      ...members.map((m) => m.img),
    ];

    let loadedCount = 0;

    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imageUrls.length) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === imageUrls.length) {
          setImagesLoaded(true);
        }
      };
    });
  }, []);

  if (!imagesLoaded) {
    return <Loader />;
  }

  return (
    <>
      <Header />
      <div className="about_us page">
        <div className="team">
          <div className="team_header">
            <h4 className="page_title orange_title">About Us</h4>
            <h5 className="about_us_slogan">
              Georgia is our home and the mountains are our passion!
            </h5>
            <img
              className="team_img"
              src="https://res.cloudinary.com/dxhhvp8jh/image/upload/v1706877203/about_us/DSCF0092_cover_soizjk.jpg"
              alt="PinGeorgia.ge"
            />
          </div>

          <div className="about_us_content">
            <p>
              We are a friendly team of qualified guides specialising in outdoor
              activities and mountain adventures. We as professional guides
              together with our off-road certified drivers will get you on
              unforgettable trips. With us, you can discover unknown Georgia.
              <br />
              <br />
              The company has been operating in tourism since 2014 and has great
              experience in outdoor activities as well as in sightseeing tours
              and corporate events.
              <br />
              <br />
              The team was granted a certificate of appreciation for the
              development of adventure tourism and the popularisation of hiking
              in Ajara, Georgia by the National Department of Tourism and
              Resorts of Ajara
            </p>

            <div className="members">
              {members.map((member) => (
                <div className="member" key={member.name}>
                  <img
                    className="member_img"
                    src={member.img}
                    alt={member.name}
                  />
                  <div className="member_info">
                    <p className="member_description">
                      <b>{member.name}</b>
                      {member.description}
                    </p>
                    <ul className="member_achievements">
                      {member.achievements.map((achievement) => (
                        <li key={achievement} className="member_achievement">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
