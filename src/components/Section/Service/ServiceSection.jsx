"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";

 

export default function ServiceSection() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(null);
  const [error, setError] = useState("");

  const BaseUrl = useMemo(() => {
    if (typeof window === "undefined") return "https://waveledserver.vercel.app";
    const protocol = window.location.protocol === "https:" ? "https" : "http";
    return protocol === "https"
      ? "https://waveledserver.vercel.app"
      : "http://localhost:4000";
  }, []);

  async function loadServicesPage() {
    setLoading(true);
    setError("");
    try { 
      const res = await axios.get(`${BaseUrl}/api/cms/services`, {
        withCredentials: true,  
      });

      const doc = res?.data?.data || null;
      setPage(doc);
    } catch (e) {
      setError(
        e?.response?.data?.error ||
          e?.message ||
          "Não foi possível carregar a página de serviços."
      );
      setPage(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServicesPage(); 
  }, [BaseUrl]);

  const hero = page?.hero || { title: "", description: "" };
  const boxes = Array.isArray(page?.boxes) ? page.boxes : [];
  const blocks = Array.isArray(page?.content_blocks) ? page.content_blocks : [];
  const sectionsOrder = Array.isArray(page?.sections_order)
    ? page.sections_order
    : ["hero", "boxes", "content"];
 
  const serviceBlocks = blocks.filter((b) => (b?.type || "service") === "service"); 
  const overlayBlocks = blocks.filter((b) => b?.type === "overlay");

  if (loading) {
    return (
      <div className="section bg-light1 tekup-section-padding2">
        <div className="container">
          <div className="tekup-section-title">
            <h2>A carregar serviços…</h2>
            <p>Por favor aguarde.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section bg-light1 tekup-section-padding2">
        <div className="container">
          <div className="tekup-section-title">
            <h2>Serviços</h2>
            <p style={{ marginBottom: 12 }}>{error}</p>
            <button className="tekup-default-btn" onClick={loadServicesPage}>
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!page) return null;

  const renderHero = () => {
    if (!hero?.title && !hero?.description) return null;

    return (
      <div className="section bg-light1 tekup-section-padding2">
        <div className="container">
          <div className="tekup-section-title">
            {hero?.title ? <h2>{hero.title}</h2> : null}
            {hero?.description ? <p>{hero.description}</p> : null}
          </div>
        </div>
      </div>
    );
  };

 

  const renderServiceBlock = (item, index) => {
    const title = item?.title || "";
    const description = item?.description || "";
    const image = item?.image || "";
    const reverse = index % 2 === 1;  
    if (!title && !description && !image) return null;

    return (
      <div key={item?._id || `service-${index}`}>
        <div className="section bg-light1 tekup-section-padding2">
          <div className="container">
            <div className={`content-area ${reverse ? "reverse" : ""}`}>
              <div className="tekup-section-title">
                {title ? <h2>{title}</h2> : null}
                {description ? <p>{description}</p> : null}
                <Link href="/contact-us" className="tekup-default-btn">
                  Saiba mais
                </Link>
              </div>

              <div style={{ padding: "20px" }} className="image serv-img">
                {image ? (
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={image}
                    alt={title || "Serviço"}
                    loading="lazy"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOverlayBlock = (item, index) => {
    const bgImage = item?.image || ""; 
    const text1 = item?.title || "";
    const text2 = item?.subtitle || "";

    if (!bgImage && !text1 && !text2) return null;

    return (
      <section className="video-area" key={item?._id || `overlay-${index}`}>
        {bgImage ? <img src={bgImage} alt={text1 || "Overlay"} loading="lazy" /> : null}

        <div className="over-video-large">
          <div className="tekup-section-padding">
            <div className="container">
              {text1 ? <h2>{text1}</h2> : null}
              {text2 ? <h2>{text2}</h2> : null}
              <br />
              <Link href="/contact-us">
                <button className="tekup-default-btn">Solicitar Orçamento</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderContent = () => {
    // Ordem final:
    // para manter o comportamento “secção + overlay” repetido,
    // fazemos: renderiza services (cada um) e, por baixo, se existir um overlay com o mesmo index, renderiza também.
    if (!serviceBlocks.length && !overlayBlocks.length) return null;

    const max = Math.max(serviceBlocks.length, overlayBlocks.length);
    const out = [];

    for (let i = 0; i < max; i++) {
      const s = serviceBlocks[i];
      const o = overlayBlocks[i];

      if (s) out.push(renderServiceBlock(s, i));
      if (o) out.push(renderOverlayBlock(o, i));
    }

    return <>{out}</>;
  };

  return (
    <>
      {sectionsOrder.map((sectionKey) => { 
        if (sectionKey === "content") return <div key="content">{renderContent()}</div>;
        return null;
      })}
    </>
  );
}