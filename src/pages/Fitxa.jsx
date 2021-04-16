import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

import Header from "../components/HeaderNou";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.css";
import "../pages/css/Fitxa.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Traduccio from "../components/Traduccio";

class Fitxa extends Component {
  constructor(props) {
    super();
    this.state = {
      codi: "",
      id: "",
      info: [],
      infoProducte: [],
      familia: "",
      codiFam: "",
      preu: "",
      quant: 1,


    };
    if (props != null) {
      if (props.match.params.codi != null) {
        this.state.codi = props.match.params.codi;
      }
    }

    this.handleChange = this.handleChange.bind(this);
  }

  // Agafam la quantitat del producte.

  handleChange(valor) {
    this.setState({ quant: valor });
  }

  async componentDidMount() {
    // Peticions de la informació de l'articles i de les imatges.

    const lang = localStorage.getItem("idioma");

    const resposta = await axios({
      method: "post",
      url: "https://aguilo.limit.es/api/auth/refresh",
      data: {
        token: localStorage.getItem("token"),
        session: { e: "645", i: "643" },
      },
      headers: {
        Authorization: `${localStorage.getItem(
          "tokenType"
        )} ${localStorage.getItem("token")}`,
      },
    });

    const tokenRefresh = resposta.data;
    localStorage.setItem("resposta", tokenRefresh.token);

    const res = await axios.get(
      `https://aguilo.limit.es/api/ecom/articlesInformacio?query=article.codi==${this.state.codi}&page=0&size=100&lang=${lang}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("resposta")}`,
        },
      }
    );

    const info = res.data;

    const id = info._embedded.articleInformacios[0].article.id;

    const resp = await axios.get(
      `https://aguilo.limit.es/api/ecomfront/articles/detail/${id}?lang=${lang}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("resposta")}`,
        },
      }
    );

    const infoProd = resp.data;

    const preu = infoProd.preuAmbIva.toFixed(2);

    this.setState({
      info: info._embedded.articleInformacios,
      infoProducte: infoProd,
      familia: infoProd.familia.description,
      codiFam: infoProd.familia.pk.codi,
      preu: preu,
    });
  }

  render() {
    return (
      <div>
        <Header
          canviarLlenguatge={this.props.canviarLlenguatge}
          count={this.props.count}
        />
        <div className="container fitxa">
          <div className="row">
            <div className="col-md-5">
              <div className="carousel-wrapper">
                <Carousel showStatus={false} showIndicators={false}>
                  {this.state.info.map(function (articles, index) {
                    return (
                      <div>
                        <img
                          key={articles.rutaInforme}
                          src={
                            "https://aguilo-botiga.limit.es/api/ecomfront/image/show/" +
                            articles.rutaInforme
                          }
                          alt={articles.descripcio}
                        />
                      </div>
                    );
                  })}
                </Carousel>
              </div>
            </div>
            <div className="col-md-7">
              <div className="container">
                <div className="row">
                  <div className="col">
                    <Breadcrumb>
                      <Breadcrumb.Item href="/">
                        <Traduccio string="list.familias" />
                      </Breadcrumb.Item>
                      <Breadcrumb.Item href={"/familia/" + this.state.codiFam}>
                        {this.state.familia}
                      </Breadcrumb.Item>
                      <Breadcrumb.Item active>
                        <strong>
                          {" "}
                          {this.state.infoProducte.descripcioCurta}
                        </strong>
                      </Breadcrumb.Item>
                    </Breadcrumb>
                    <h3 className="titolFitxa text-primary">
                      {this.state.infoProducte.descripcioCurta}
                    </h3>
                    <h5 className="descripcioFitxa">
                      {" "}
                      {this.state.infoProducte.descripcio}
                    </h5>
                    <div className="row rowPreu">
                      <div className="col-6">
                        <h2 className="preuFitxa text-primary">
                          {this.state.preu} €{" "}
                        </h2>
                        <p className="ivaFitxa">
                          {" "}
                          <Traduccio string="fitxa.iva" />
                        </p>
                      </div>
                    </div>
                    <div className="row rowPreu">
                      <div className="col-3 col-md-3 col-lg-2 mb-1">
                        <input
                          type="number"
                          min="1"
                          className="form-control number"
                          defaultValue="1"
                          onChange={(e) =>
                            this.handleChange(parseInt(e.target.value))
                          }
                        />
                      </div>
                      <div className="col-sm-10 col-md-4 col-lg-5 mb-1">
                        <a href="/carrito"
                          className="btn btn-primary col"
                          onClick={() =>
                            this.props.afegirCistella(
                              this.state.codi,
                              this.state.quant,
                              this.state.preu,
                              this.state.infoProducte.decimalsPreu,
                              this.state.infoProducte.decimalsPreuIva,
                              this.state.infoProducte.descripcio,
                              this.state.infoProducte.descripcioCurta,
                              this.state.infoProducte.id,
                              this.state.info[0].rutaInforme,
                              this.state.infoProducte.iva.id,
                              this.state.infoProducte.preuAmbIva,
                              this.state.infoProducte.pvp,
                              this.state.infoProducte.pvp
          
                            )
                          }
                        >
                          <Traduccio string="fitxa.añadir" />
                        </a>
                        </div>
                        <div className="col-sm-6 col-md-5 col-lg-4 mb-1">
                        <a href="/" className="btn btn-outline-primary col"> <Traduccio string="carrito.seguirComprant" /></a>
                        </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Fitxa);
