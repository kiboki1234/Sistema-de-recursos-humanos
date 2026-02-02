import React from "react";
import ButtonWhatsApp from "../ButtonWhatsApp";
import Footer from "../Footer";
import "../css/styleModelos.css";
import "../css/styleWhatsappBtn.css";

const DebateModels = () => {
  return (
    <div>

      <div className="container mt-5 pt-4">
        <h1 className="text-center header-title">Modelos de Debate</h1>
        <p className="text-center">Descubre los distintos modelos de debate que practicamos en CPED, diseñados para fomentar el análisis crítico, la oratoria y el trabajo en equipo.</p>

        <div className="info-section">
            <h2 className="section-title">Modelo ONU</h2>
            <p>El Modelo de Naciones Unidas (MUN) es una simulación de las reuniones de la ONU, donde los participantes representan a países y debaten sobre temas internacionales. Se enfoca en el desarrollo de habilidades como la diplomacia, el debate y la negociación.</p>
            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card">
                        <img src="https://res.cloudinary.com/dp8wdwo5h/image/upload/v1733710579/724114_kqyfsp.jpg" className="card-img-top" alt="Asamblea General"/>
                        <div className="card-body">
                            <h5 className="card-title">Asamblea General</h5>
                            <p className="card-text">La principal arena de debate donde todos los países tienen representación igualitaria. Se discuten temas de paz, seguridad y desarrollo.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <img src="https://res.cloudinary.com/dp8wdwo5h/image/upload/v1733710579/thumbs_b_c_f8f8c904b2deb135acd53668bdf84a96_jcj7co.jpg" className="card-img-top" alt="Consejo de Seguridad"/>
                        <div className="card-body">
                            <h5 className="card-title">Consejo de Seguridad</h5>
                            <p className="card-text">Discute asuntos relacionados con la seguridad internacional y la resolución de conflictos. Tiene la facultad de tomar decisiones vinculantes.</p>
                        </div>
                    </div>
                </div>
              </div>
          </div>

          <div className="info-section">
              <h2 className="section-title">Modelo Parlamento Británico</h2>
              <p>El Parlamento Británico (BP) es un formato de debate competitivo que se enfoca en la argumentación y el pensamiento rápido. Los participantes forman equipos y debaten en torno a una moción asignada al momento.</p>
              <div className="row g-4">
                  <div className="col-md-6">
                      <div className="card">
                          <img src="https://res.cloudinary.com/dp8wdwo5h/image/upload/v1733722467/torneo-bp-pagina-noticia_imagen_j0v1nc.jpg" className="card-img-top" alt="Cámara Alta"/>
                          <div className="card-body">
                              <h5 className="card-title">Cámara Alta</h5>
                              <p className="card-text">Conformada por los equipos que apoyan y argumentan a favor de la moción. Trabajan en conjunto para presentar las ideas más persuasivas.</p>
                          </div>
                      </div>
                  </div>
                  <div className="col-md-6">
                      <div className="card">
                          <img src="https://res.cloudinary.com/dp8wdwo5h/image/upload/v1733722381/British_Parliamentary_style_debate__Khmelnytskyi__Ukraine_c57efz.jpg" className="card-img-top" alt="Cámara Baja"/>
                          <div className="card-body">
                              <h5 className="card-title">Cámara Baja</h5>
                              <p className="card-text">Argumenta en contra de la moción presentada, desafiando las ideas de la Cámara Alta con creatividad y lógica.</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Botón de WhatsApp */}
      <ButtonWhatsApp />
      <Footer/>
    </div>
  );
};

export default DebateModels;
