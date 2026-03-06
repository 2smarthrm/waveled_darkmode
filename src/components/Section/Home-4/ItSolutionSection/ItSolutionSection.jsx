"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const ItSolutionSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const handleScroll = () => {
      const section = document.getElementById("counter-home-four");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const visible = rect.top <= window.innerHeight && rect.bottom >= 0;
      setIsVisible(visible);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="section py-2 pb-0 tekup-section-padding" id="counter-home-four">
      <br />
      <div id="tekup-counter"></div>
      <br /><br /><br />
      <div className="container">
        <div className="row"> 
          <div className="col-lg-6 d-flex align-items-center">
            <div className="tekup-default-content mr-60">
              <h2>Especialistas em <br/> Painéis LED</h2>
              <p>
                Somos uma equipa especializada no planeamento,
                implementação e gestão de projectos em Soluções LED para
                ambientes de interior e exterior, garantindo soluções
                personalizadas, inovação e equipamentos de elevada fiabilidade,
                impulsionando a presença da sua sua marca.
              </p>

              <div className="tekup-extra-mt">
                <Link
                  className="tekup-default-btn"
                  href="/single-shop?product=691c61119864e86ab50c879d"
                >
                  Saiba mais <i className="ri-arrow-right-up-line"></i>
                </Link>
              </div>
            </div>
          </div> 
          <div className="col-lg-6 order-lg-2">
            <div className="tekup-thumb ml-60">
              <img
                className="sport-img"
                src="https://res.cloudinary.com/dcl5uszfj/image/upload/v1769182102/waveled/uploads/glcylamgtwrx7rmmpscm.jpg"
                alt="Painel LED instalado em contexto desportivo"
              />
            </div>
          </div>  
        </div>
          <br /><br /> 
      </div> 
           <div >
               <img className="image-home" src="https://ik.imagekit.io/fsobpyaa5i/image-gen%20-%202026-02-27T144951.695.png" alt="" />
           </div>
          <div className="container"> 
          <br /><br />
          <div className="row row-reverse"> 
          <div className="col-lg-6 order-lg-2">
            <div className="tekup-thumb ml-60">
              <img
                className="sport-img"
                src="https://ik.imagekit.io/fsobpyaa5i/image-gen%20(66).png"
                alt="Painel LED instalado em contexto desportivo"
              />
            </div>
          </div>  
          <div className="col-lg-6 d-flex align-items-center">
            <div className="tekup-default-content mr-60">
              <h2>Soluções em Paineis LED <br/> para várias Aplicações</h2>
              <p>
                Contamos com um portfolio de soluções especializadas e
                inovadoras adaptadas ás suas necessidades em destaque nas
                áreas de Retalho, Corporate, Rental, Hotelaria, Cultura, Educação,
                Saúde, Desporto, Transportes e Broadcast, com o objectivo de
                promover a visibilidade e o impacto da sua comunicação. 
              </p>

              <div className="tekup-extra-mt">
                <Link
                  className="tekup-default-btn"
                  href="/single-shop?product=691c61119864e86ab50c879d"
                >
                  Saiba mais <i className="ri-arrow-right-up-line"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div> 
    <section className="section py-2 pb-0 tekup-section-padding">
      <div className="home-top-product"> 
        <article className="top-product-card">
          <div className="image">
            <img
              src="https://ik.imagekit.io/fsobpyaa5i/image-gen%20-%202026-02-06T111509.472.jpg"
              alt="Painel LED publicitário exterior"
              loading="lazy"
            />
          </div>
    
          <div className="over-card">
            <h3>Painéis LED Billboard <br/> para publicidade exterior</h3>
            <p>
              <small>
                Painéis LED Digital Billboard de grande formato,
                ideais para outdoors, fachadas e estruturas urbanas.
                Garantem alta luminosidade, permitindo excelente
                visibilidade à distância.
              </small>
            </p>
    
            <Link className="tekup-default-btn" href="/contact-us">
              Solicitar projeto <i className="ri-arrow-right-up-line"></i>
            </Link>
          </div>
        </article> 
        <article className="top-product-card">
          <div className="image">
            <img
              src="https://ik.imagekit.io/fsobpyaa5i/image-gen%20-%202026-02-05T171414.231.png"
              alt="Tela LED em sala de reuniões corporativa"
              loading="lazy"
            />
          </div>

          <div className="over-card">
            <h3>Soluções LED para salas de <br/> reunião e ambientes corporativos</h3>
            <p>
              <small>
                  Ecrãs LED profissionais para salas de reunião,
                  auditórios e espacos corporativos. <br/> Ideais para
                  apresentações, videoconferência e visualização de
                  dados em tempo real.
              </small>
            </p>

            <Link className="tekup-default-btn" href="/contact-us">
              Solicitar projeto <i className="ri-arrow-right-up-line"></i>
            </Link>
          </div>
        </article>
      </div>
    </section> 
      <br />
      <br />
      <br /> 
      <section className="section py-2 rack-section pb-0 tekup-section-padding">
        <div className="container">
          <div className="rack-rows">
            <div className="image">
               <img src="https://ik.imagekit.io/fsobpyaa5i/image-gen%20-%202026-02-06T092715.800%20(1).png" alt="#" />
            </div>
            <div className="text-area">
              <h2>Prateleiras digitais  para Comercio com Impacto</h2>
              <p> 
                <small>
                   Eleve a comunicação a outro nivel no ponto de venda, as
                    prateleiras digitais Display LED combinam design
                    discreto e moderno com alta definição e conteúdos
                    dinâmicos para destacar preços, promoções e
                    campanhas no momento exato da decisão, potenciando
                    o volume de vendas
                </small>
              </p>
              <Link className="tekup-default-btn" href="/contact-us">
                Solicitar projeto <i className="ri-arrow-right-up-line"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <br />
      <br />
      <br />
    </div>
  );
};

export default ItSolutionSection;
