"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Slider from "react-slick/lib/slider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoPlay } from "react-icons/io5"; 

 
function FiveSolutionsSlider({ items }) {
  const Settings = {
    dots: false,
    infinite: true,
    arrows: true,
    speed: 3500,
    autoplaySpeed: 3500,
    autoplay: true,
    slidesToShow: 2,
    slidesToScroll: 2,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024, 
        settings: { slidesToShow: 3, slidesToScroll: 3, infinite: true, dots: true } 
      },
      { 
        breakpoint: 600, 
        settings: { slidesToShow: 1, slidesToScroll: 1, initialSlide: 1 }
      },
      { 
        breakpoint: 480, 
        settings: { slidesToShow: 1, slidesToScroll: 1 }
      },
    ],
  };

  return (
    <div className="categorie-five-sliders">
      <div className="container">
        <div className="space-div">
          <div>
            <h3 className="text-light">Soluções pensadas para atrair clientes</h3>
            <div>
            <p>
              Soluções que transformam espaços, captam atenção e comunicam a sua marca <br /> com impacto, inovação e máxima
              qualidade visual.
            </p>
          </div>
          </div>
        </div> 
        <Slider {...Settings}>
          {items.map((item, index) => (
            <article key={index}>
              <div className="inner-item">
                <div className="image">
                  <img src={item.image} alt={item.title} />
                </div>
                <strong className="text-light">{item.title}</strong>
                <Link href={item._productLink}>
                  <button className="tekup-default-btn" type="button">
                    Saiba mais
                  </button>
                </Link>
              </div> 
              <br /><br /><br /><br /><br /><br />
            </article>
          ))}
        </Slider>
      </div>
    </div>
  );
}

function MainItemCategoryPage({ item }) {
  const settings = {
    dots: true,
    infinite: true,
    fade: true,
    speed: 2500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2500,
  };

  return (
    <div className="categorie-main-item">
      <div className="image-slider">
        <Slider {...settings}>
          {(item?.images || []).map((image, index) => (
            <div className="image" key={index}>
              <img src={image} alt={item?.title} />
            </div>
          ))}
        </Slider>
      </div>

      <div className="text-content">
        <h2>{item?.title}</h2>
        <p>{item?.description}</p>
        <div className="mt-2 mb-2">
          <hr />
        </div>
        <br />
        <Link href={item._productLink}>
          <button className="tekup-default-btn" type="button">
            Saiba mais
          </button>
        </Link>
      </div>
    </div>
  );
}

function HeaderAreaAndTitle({ title, areas, active }) {
  return (
    <aside className="catgorie-page-header">
      <div className="category-page-title">
        <h3>Soluções que transformam espaços.</h3>
        <h6 className="text-secondary">soluções para - {title}</h6>
        <br />
      </div>
      <hr />
      <div className="category-page-cats">
        <ul>
          {areas.map((item, index) => (
            <Link href={item?.link} key={index}>
              <li className={`link-badge ${item?.id === active ? "active" : ""}`}>{item?.title}</li>
            </Link>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function CardSliderVertical({ item }){
  return (
    <div className="card-slider-vertical">
      <article className="card-inner">
        <div className="image">
          <div className="over-image">
            <small>{item?.product}</small>
            <Link href={item._productLink}>
              <h5>{item?.title}</h5>
            </Link>
            <Link href={item._productLink}>
              <button className="bg-primary text-light" type="button">
                Saiba mais
              </button>
            </Link>
          </div>
          <img src={item?.image} alt={item?.title} />
        </div>
      </article>
    </div>
  );
}

function TwoNiceProducts({ items }) { 
  return (
    <div className="categorie-page-two">
      {items.map((item, index) => (
        <article key={index}>
          <img className="tw-image" src={item?.image} alt={item.title} />
          <h5 className="mb-4">{item.title}</h5>
          <Link href={item._productLink}>
            <button className="tekup-default-btn" type="button">
              Saiba mais
            </button>
          </Link>
        </article>
      ))}
    </div>
  );
}

 
function MoreProducts({ items }) {
  return (
    <div className="categorie-page-products">
      <h2>Soluções mais utilizadas</h2>
      <div className="items-wrap">
        {items?.map((item, index) => (
          <article key={index}>
            <div className="image">
              <img src={item?.image} alt="" />
              <div className="over-image">
                <Link href={item._productLink}>
                  <button className="tekup-default-btn" type="button">
                    Saiba mais
                  </button>
                </Link>
              </div>
            </div>
            <Link href={item._productLink}>
              <strong className="text-dark">{item?.title}</strong>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function ShopSection() {
  const searchParams = useSearchParams();
  const areaId = searchParams.get("area");

  const isBrowser = typeof window !== "undefined";
  const protocol = isBrowser && window.location.protocol === "https:" ? "https" : "http";
  const API_BASE = protocol === "https" ? "https://waveledserver.vercel.app" : "http://localhost:4000";

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(null);
  const [areas, setAreas] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const verticalSliderSettings = {
    dots: true,
    infinite: true,    
    arrows: false,
    speed: 6000, 
    cssEase: "linear",  
    autoplay: true,  
    autoplaySpeed: 6000, 
    slidesToShow: 3,
    slidesToScroll: 1,    
    pauseOnHover: true,    
    pauseOnFocus: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };
 
  function buildProductLink(productOrId, fallbackLink) {
    const pid = productOrId;
    if (pid && String(pid).trim()) return `/single-shop?product=${encodeURIComponent(String(pid))}`;
    if (fallbackLink) return fallbackLink;
    return "#";
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const areasRes = await axios.get(API_BASE + `/api/cms/application-areas`);
        setAreas(areasRes.data?.data || []);
        if (!areaId) {
          setPage(null);
          return;
        }

        const pageRes = await axios.get(API_BASE + `/api/cms/area-pages/${areaId}`);
        setPage(pageRes.data?.data || null);
      } catch (e) {
        setPage(null);
        setTimeout(() => {
          console.clear();
          console.error("Erro ao carregar área", e);
          setErrorMsg("Não foi possível carregar esta área. Tenta novamente.");
        }, 500);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [areaId, API_BASE]);

  if (loading) {  
    return (
      <div className="container text-center">
        <div className="loader-wrap" role="status" aria-live="polite" aria-label="Carregando conteúdo">
          <div className="spinner-border" role="status" aria-hidden="false">
            <span className="visually-hidden">A carregar…</span>
          </div>
        </div>

        <style jsx>{`
          .loader-wrap {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            margin-top: 200px;
            margin-bottom: 100px;
            gap: 12px;
          }

          /* large circular spinner (Bootstrap-like) */
          .spinner-border {
            display: inline-block;
            width: 200px;
            height: 200px;
            vertical-align: text-bottom;
            border: 20px solid rgba(0,0,0,0.08);
            border-top-color: #0019ff; /* azul primário */
            border-radius: 50%;
            animation: spinner-border 0.75s linear infinite;
            box-sizing: border-box;
            background: transparent;
          }

          @keyframes spinner-border {
            to { transform: rotate(360deg); }
          }

          /* visually-hidden for accessibility */
          .visually-hidden {
            position: absolute !important;
            height: 1px; width: 1px;
            overflow: hidden; clip: rect(1px, 1px, 1px, 1px);
            white-space: nowrap; border: 0; padding: 0; margin: -1px;
          }

          @media (max-width: 800px) {
            .spinner-border { width: 220px; height: 220px; border-width: 12px; }
            .loader-wrap { margin-top: 80px; margin-bottom: 40px; }
          }
        `}</style>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="container py-5 text-center">
        <p>{errorMsg}</p>
      </div>
    );
  }

  if (!areaId) {
    return (
      <div className="categorie-page">
        <div className="container">
          <br /><br /><br /><br /><br /><br />

          <HeaderAreaAndTitle
            title={"Escolhe uma área de aplicação"}
            areas={(areas || []).map((a) => ({
              title: a?.wl_solution_title || a?.wl_title || a?.wl_name || "Área",
              link: `/solution?area=${a._id}`,
              id: a._id,
            }))}
            active={""}
          />

          <div className="py-5 text-center">
            <p>Seleciona uma área para veres as soluções.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container py-5 text-center">
        <p>Área não encontrada ou ainda sem conteúdo.</p>
      </div>
    );
  }

 
  const topVerticalSolutions =
    page.top_solutions?.map((x) => {
      const pid = x.solution?.wl_product?._id || x.solution?.wl_product;
      const fallback = x.solution?.wl_product?.wl_link;
      return {
        title: x.solution?.wl_title || "",
        image: x.solution?.wl_image || "",
        productId: pid || "",
        _productLink: buildProductLink(pid, fallback),
        product: x.solution?.wl_product?.wl_name,
      };
    }) || [];

  const mainItem = {
    images: page.featured_product?.images || [],
    title: page.featured_product?.title || "",
    description: page.featured_product?.description || "",
    productId: page.featured_product?.product?._id || page.featured_product?.product || "",
    _productLink: buildProductLink(page.featured_product?.product?._id || page.featured_product?.product, page.featured_product?.product?.wl_link || "#"),
  };

  const sliderSolutions =
    page.slider_solutions?.map((s) => {
      const pid = s.product?._id || s.product;
      const fallback = s.product?.wl_link;
      return {
        title: s.title || "",
        image: s.image || "",
        productId: pid || "",
        _productLink: buildProductLink(pid, fallback),
      };
    }) || [];

  const twoSpecial =
    page.two_special_products?.map((s) => {
      const pid = s.product?._id || s.product;
      const fallback = s.product?.wl_link;
      return {
        image: s.image || "",
        title: s.title || "",
        productId: pid || "",
        _productLink: buildProductLink(pid, fallback),
      };
    }) || [];

  const mostUsed =
    page.most_used_solutions?.map((x) => {
      const pid = x.solution?.wl_product?._id || x.solution?.wl_product;
      const fallback = x.solution?.wl_product?.wl_link;
      return {
        title: x.solution?.wl_title || "",
        image: x.solution?.wl_image || "",
        productId: pid || "",
        _productLink: buildProductLink(pid, fallback),
      };
    }) || [];

  const activeAreaTitle =
    page.wl_area?.wl_solution_title || page.wl_area?.wl_title || page.wl_area?.wl_name || "Área";

  const hasAnyContent =
    topVerticalSolutions.length > 0 ||
    mainItem.images.length > 0 ||
    sliderSolutions.length > 0 ||
    twoSpecial.length > 0 ||
    mostUsed.length > 0;

  return (
    <div className="categorie-page">
      <div className="container">
        <div className="br-1"> <br /><br /></div>
        <div className="br-2"><br /><br /></div>
        <div className="br-3"><br /><br /></div>

        <HeaderAreaAndTitle
          title={activeAreaTitle}
          areas={(areas || []).map((a) => ({
            title: a?.wl_solution_title || a?.wl_title || a?.wl_name || "Área",
            link: `/solution?area=${a._id}`,
            id: a._id,
          }))}
          active={areaId}
        />

        {!hasAnyContent && (
          <div className="py-5 text-center">
            <p>De momento, esta área ainda não tem conteúdo publicado.</p>
          </div>
        )}

        {topVerticalSolutions.length > 0 && (
          <aside className="card-slides-vertical">
            <Slider {...verticalSliderSettings}>
              {topVerticalSolutions.map((item, index) => (
                <CardSliderVertical key={index} item={item} />
              ))}
            </Slider>
          </aside>
        )}

        {mainItem.images?.length > 0 && (
          <aside>
            <MainItemCategoryPage item={mainItem} />
          </aside>
        )}
      </div>

      {sliderSolutions.length > 0 && (
        <aside>
          <FiveSolutionsSlider items={sliderSolutions} />
        </aside>
      )}

      {twoSpecial.length > 0 && (
        <div className="container">
          <aside>
            <TwoNiceProducts items={twoSpecial} />
          </aside>
        </div>
      )}

   
      {mostUsed.length > 0 && (
        <div className="container">
          <aside>
            <MoreProducts items={mostUsed} />
          </aside>
        </div>
      )}
    </div>
  );
} 
 