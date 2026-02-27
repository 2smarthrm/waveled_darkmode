 "use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";

const ChooseUsSection = ({ className }) => {
  const [page, setPage] = useState(null);

  const BaseUrl = useMemo(() => {
    if (typeof window === "undefined") return "https://waveledserver.vercel.app";
    const protocol = window.location.protocol === "https:" ? "https" : "http";
    return protocol === "https"
      ? "https://waveledserver.vercel.app"
      : "http://localhost:4000";
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await axios.get(`${BaseUrl}/api/cms/services`);
        setPage(res?.data?.data || null);
      } catch (e) {
        setPage(null);
      }
    }
    loadData();
  }, [BaseUrl]);

  const hero = page?.hero || {};
  const boxes = Array.isArray(page?.boxes) ? page.boxes.slice(0, 3) : [];

  const fallbackIcons = [
    "/images/iconbox/icon8.png",
    "/images/iconbox/icon9.png",
    "/images/iconbox/icon10.png",
  ];

  return (
    <div className={"main-area"}>
      <div className="container">
        <div className="text-center">
          <div className="br-1x">
            <br /><br /><br /><br /><br /> 
          </div>
          <div className="text-content service-header">
            <span className="service-badge">Serviços</span>
            <h4 className="text-dark rainbow-run rainbow-text">
              {hero?.title}
            </h4>
            <p>{hero?.description}</p>
            <Link href={"/contact-us"} className="tekup-default-btn">
              Saiba mais
            </Link>
          </div>
          <br />
        </div>

        <div className="row services-row-items">
          {boxes.map((item, index) => (
            <div className="col-lg-6 col-md-6" key={index}>
              <div className="tekup-iconbox-wrap4">
                <div className="tekup-iconbox-icon4">
                  <img
                    src={item?.image || fallbackIcons[index]}
                    alt={item?.title || "Serviço"}
                  />
                </div>
                <div className="tekup-iconbox-data4">
                  <h4>{item?.title}</h4>
                  <p>{item?.description}</p>
                </div>
              </div>
            </div>
          ))}
             <div className="col-lg-6 col-md-6" key={""}>
              <div className="tekup-iconbox-wrap4">
                <div className="tekup-iconbox-icon4">
                  <img
                    src={"https://ik.imagekit.io/fsobpyaa5i/icons8-display-100.png"}
                    alt={""}
                  />
                </div>
                <div className="tekup-iconbox-data4">
                  <h4>{"Renting"}</h4>
                  <p>{"Disponibilizamos serviço profissional de renting de displays LED para eventos, empresas, instituições e campanhas publicitárias."}</p>
                </div>
              </div>
            </div>
        </div>
        <br />
      </div>
    </div>
  );
};

export default ChooseUsSection;