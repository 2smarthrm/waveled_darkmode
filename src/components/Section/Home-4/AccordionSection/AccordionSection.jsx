"use client";
import Link from "next/link";
import { Accordion } from "react-bootstrap";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const AccordionSection = () => {
  return (
    <div className="section bg-light1 tekup-section-padding accordion-one price-accordion">
      <div className="container">
        <div className="row"> 
          <div className="col-lg-6">
            <div className="tekup-default-content mr-60">
              <h2 className="mb-3">
                 Aluguer de Painéis LED para Eventos (Rental)
              </h2>
 
              
              <p className="mb-3">
                 Criar impacto visual sem investir em equipamento próprio ? <br/>
                  <strong>Sim, é possivel !</strong> <br/> O Aluguer de soluções LED (Rental) é a
                  opção mais económica, prática e flexível para eventos, feiras,
                  novos lançamentos de produto, conferências, espetáculos entre
                  outras aplicações.
              </p>

              <p className="mb-3">
                A Waveled conta com soluções de última geração, ajustadas a
                cada necessidade, oferecendo uma gama completa de servicos
                como consultoria, operação, instalação e desinstalação.
              </p>

              <p className="mb-3">
                Contando com amplo portfolio de soluções para ambiente interior
                ou exterior, garantimos brilho, contraste e fiabilidade para elevar a
                experiência do público e destacar a sua comunicação.
              </p>


              <div className="tekup-extra-mt d-flex gap-3 flex-wrap">
                <Link className="tekup-default-btn" href="/contact-us">
                  Pedir orçamento rápido <i className="ri-arrow-right-up-line"></i>
                </Link>

                <Link className="d-none tekup-default-btn outline" href="/solutions">
                  Ver casos & setups <i className="ri-image-line"></i>
                </Link>
              </div> 
            </div>
          </div>
 
          <div className="col-lg-6">
            <Accordion defaultActiveKey="0">
              <div className="tekup-accordion-column">
                <div className="tekup-accordion-wrap mt-0 init-wrap">
                  <Accordion.Item eventKey="0">
                    <div className="p-0">
                      <img
                        src="https://ik.imagekit.io/fsobpyaa5i/image-gen%20(41).png"
                        alt="Palco com painel LED alugado"
                        style={{ maxHeight: "250px", objectFit: "cover" }}
                        className="img-fluid w-100 rounded"
                      />
                    </div> 

                    <Accordion.Header>
                      <div className="d-block">
                        <br />
                        <div className="text-uppercase fw-semibold small text-muted">
                          Aluguer de LED · Guia Rápido
                        </div>
                        <br />
                        <div>
                          Como funciona o aluguer e quais são os principais benefícios?
                        </div>
                      </div>
                    </Accordion.Header>

                    <Accordion.Body>
                       <IoMdCheckmarkCircleOutline /> <span className="ml-1">Menor investimento inicial</span> <br/>
                       <IoMdCheckmarkCircleOutline /> <span className="ml-1">Maior flexibilidade </span> <br/>
                       <IoMdCheckmarkCircleOutline /> <span className="ml-1">Custo  previsivel</span> <br/> 
                       <IoMdCheckmarkCircleOutline /> <span className="ml-1">Acesso a tecnologia atualizada</span> <br/> 
                       <IoMdCheckmarkCircleOutline /> <span className="ml-1">Soluções ajustadas á necessidade actual</span> <br/> 
                       <IoMdCheckmarkCircleOutline /> <span className="ml-1">Manutenção incluída </span><br/> 
                      <br />
                      <hr />
                      <br />
                      <strong>A nossa equipa especializada assegura todo o processo: </strong>
                      transporte, montagem e desmontagem, com possibilidade de
                      operar os equipamentos durante o evento.
                    </Accordion.Body>
                  </Accordion.Item>
                </div>
              </div>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionSection;
