import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Header from "../components/HeaderNou";
import List from "../components/List";
import "../pages/css/Index.css";
import axios from "axios";
import Traduccio from "../components/Traduccio";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import Spinner from "../components/Spinner";
import ContainerCards from "../components/ContainerCards";
import { animateScroll as scroll } from "react-scroll";
import KeyboardArrowUpOutlinedIcon from "@material-ui/icons/KeyboardArrowUpOutlined";

class Index extends Component {
  constructor(props) {
    super();
    console.log(props);
    this.state = {
      productes: [],
      infoProductes: [],
      infoFamilies: [],
      filtrat: false,
      codiFam: "",
      infoFiltrat: [],
      famDesc: "",
      carregant: true,
      orderCol: "descripcioCurta",
      orderDir: "ASC",
      carregantFiltres: false,
      filtres: false,
      infoGamma: [],
      infoMarca: [],
      infoModel: [],
      producteFiltre: "",
    };

    this.filtrar = this.filtrar.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);

    if (props != null) {
      if (props.match.params.codiFam != null) {
        this.state.codiFam = props.match.params.codiFam;
        this.state.filtrat = true;
        this.state.carregant = false;
        this.state.carregantFiltres = true;
        sessionStorage.setItem("codiFam", props.match.params.codiFam);
      }
    } else {
      this.state.carregant = true;
    }
  }

  scrollToTop() {
    scroll.scrollToTop();
  }

  //Agafar la descripció de Familia a partir del codi.
  trobarFam(tipus) {
    if (tipus === "familia") {
      for (var x = 0; x < this.state.infoFamilies.length; x++) {
        if (
          this.state.infoFamilies[x]["codi"] === this.props.match.params.codiFam
        ) {
          return this.state.infoFamilies[x]["descripcio"];
        }
      }
    } 

    if (tipus === "marca") {
      for (var x = 0; x < this.state.infoMarca.length; x++) {
        if (
          this.state.infoMarca[x]["codi"] === this.props.match.params.codiFam
        ) {
          return this.state.infoMarca[x]["descripcio"];
        }
      }
    }

    if (tipus === "model") {
      for (var x = 0; x < this.state.infoModel.length; x++) {
        if (
          this.state.infoModel[x]["codi"] === this.props.match.params.codiFam
        ) {
          return this.state.infoModel[x]["descripcio"];
        }
      }
    }

    if (tipus === "gamma") {
      for (var x = 0; x < this.state.infoGamma.length; x++) {
        if (
          this.state.infoGamma[x]["codi"] === this.props.match.params.codiFam
        ) {
          return this.state.infoGamma[x]["descripcio"];
        }
      }
    }

    return null;
  }

  componentDidMount() {
    this.actualitzar();
  }

  async actualitzar() {
    //Peticions de token, de refreshToken, de articles(filtrar per Familia o Ordenat) i de Families d'articles.
    const lang = localStorage.getItem("idioma");

    const res = await axios.get(
      `${process.env.REACT_APP_API_DOMAIN}/api/auth?user=${process.env.REACT_APP_USER}&pass=${process.env.REACT_APP_PASSWORD}`,
      {}
    );

    const token = res.data;

    localStorage.setItem("token", token.token);
    localStorage.setItem("tokenType", token.tokenType);

    const resp = await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_DOMAIN}/api/auth/refresh`,
      data: {
        token: localStorage.getItem("token"),
        session: {
          e: `${process.env.REACT_APP_EMPRESA_ID}`,
          i: `${process.env.REACT_APP_IDENTIFICADOR_ID}`,
        },
      },
      headers: {
        Authorization: `${localStorage.getItem(
          "tokenType"
        )} ${localStorage.getItem("token")}`,
      },
    });

    const tokenRefresh = resp.data;
    localStorage.setItem("resposta", tokenRefresh.token);

    const resFam = await axios.get(
      `${process.env.REACT_APP_API_DOMAIN}/api/ecomfront/articlesFamilia?page=0&size=100&lang=${lang}&sort=descripcio,ASC`,
      {
        headers: {
          Authorization: `${localStorage.getItem(
            "tokenType"
          )} ${localStorage.getItem("resposta")}`,
        },
      }
    );

    const families = resFam.data;

    const resGam = await axios.get(
      `${process.env.REACT_APP_API_DOMAIN}/api/ecom/articlesGamma?page=0&size=100&lang=${lang}&sort=descripcio,ASC`,
      {
        headers: {
          Authorization: `${localStorage.getItem(
            "tokenType"
          )} ${localStorage.getItem("resposta")}`,
        },
      }
    );

    if (resGam.data.page.totalElements > 0) {
      this.setState({
        infoGamma: resGam.data._embedded.articleGammas,
      });
    }

    const resMarca = await axios.get(
      `${process.env.REACT_APP_API_DOMAIN}/api/ecomfront/articlesMarca?page=0&size=100&lang=${lang}&sort=descripcio,ASC`,
      {
        headers: {
          Authorization: `${localStorage.getItem(
            "tokenType"
          )} ${localStorage.getItem("resposta")}`,
        },
      }
    );

    if (resMarca.data.page.totalElements > 0) {
      this.setState({
        infoMarca: resMarca.data._embedded.articleMarcas,
      });
    }

    const resModel = await axios.get(
      `${process.env.REACT_APP_API_DOMAIN}/api/ecomfront/articlesModel?page=0&size=100&lang=${lang}&sort=descripcio,ASC`,
      {
        headers: {
          Authorization: `${localStorage.getItem(
            "tokenType"
          )} ${localStorage.getItem("resposta")}`,
        },
      }
    );

    if (resModel.data.page.totalElements > 0) {
      this.setState({
        infoModel: resModel.data._embedded.articleModels,
      });
    }

    this.setState({
      infoFamilies: families._embedded.articleFamilias,
    });

    if (this.state.codiFam === "tots") {
      this.setState({ filtrat: false });
    }

    const respFiltrat = await axios.get(
      process.env.REACT_APP_API_DOMAIN + "/api/ecomfront/articles",
      {
        params: {
          query:
            (this.state.filtrat
              ? `${this.props.match.params.familia}.codi=ic=${this.state.codiFam};`
              : "") + `bloquejat==false`,
          page: 0,
          size: 100,
          lang: lang,
          sort: this.state.orderCol + "," + this.state.orderDir,
        },
        headers: {
          Authorization: `${localStorage.getItem(
            "tokenType"
          )} ${localStorage.getItem("resposta")}`,
        },
      }
    );

    const productesFiltrats = respFiltrat.data;

    if (productesFiltrats._embedded === undefined) {
      this.setState({
        carregant: false,
        carregantFiltres: false,
      });
    } else {
      this.setState({
        productes: productesFiltrats._embedded.articles,
        infoFiltrat: productesFiltrats._embedded.articles,
        carregant: false,
        carregantFiltres: false,
      });
    }
  }

  async filtrar(codi, familia, columna, direccio) {
    const lang = localStorage.getItem("idioma");
    this.setState({ productes: [] });
    let fil;
    // let col = "descripcioCurta";
    //let dir ="ASC";

    if (codi === "tots") {
      fil = false;
    } else {
      fil = true;
    }

    /* if(columna !== "null"){
      col = columna;
    }

    if(direccio !== "null"){
      dir = direccio;
    }*/

    this.setState({ filtres: fil, carregantFiltres: true });

    const respFiltrat = await axios.get(
      process.env.REACT_APP_API_DOMAIN + "/api/ecomfront/articles",
      {
        params: {
          query:
            (codi !== "tots" ? `${familia}.codi=ic=${codi};` : "") +
            `bloquejat==false`,
          page: 0,
          size: 100,
          lang: lang,
          sort: columna + "," + direccio,
        },
        headers: {
          Authorization: `${localStorage.getItem(
            "tokenType"
          )} ${localStorage.getItem("resposta")}`,
        },
      }
    );

    const productesFiltrats = respFiltrat.data;

    if (productesFiltrats._embedded === undefined) {
      this.setState({
        carregantFiltres: false,
      });
    } else {
      this.setState({
        productes: productesFiltrats._embedded.articles,
        infoFiltrat: productesFiltrats._embedded.articles,
        carregantFiltres: false,
      });
    }

    this.setState({});
  }

  render() {
    let codiFam = "tots";
    let tipus = "";
    if (this.props != null) {
      if (this.props.match.params.codiFam != null) {
        codiFam = this.props.match.params.codiFam;
        sessionStorage.setItem("codiFam", this.props.match.params.codiFam);
      }

      if (this.props.match.params.familia != null) {
        tipus = this.props.match.params.familia;
      }
    }
    const that = this;
    const familia = this.trobarFam(tipus);

    if (this.state.carregant) {
      return (
        <div>
          <Header
            canviarLlenguatge={this.props.canviarLlenguatge}
            count={this.props.count}
          />
          <Helmet>
            <title> Embutidos La Luna Sóller</title>
          </Helmet>
          <Spinner />
        </div>
      );
    }

    return (
      <div>
        <Header
          canviarLlenguatge={this.props.canviarLlenguatge}
          count={this.props.count}
          total={this.props.total}
          productes={this.props.productes}
        />
        <Helmet>
          <title>
            {" "}
            {this.state.filtrat
              ? `${familia === null ? "" : familia + " - "} La Luna Sóller`
              : "Embutidos La Luna Sóller"}
          </title>
        </Helmet>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 col-lg-2 llistes">
              <List
                info={this.state.infoFamilies}
                tipus={<Traduccio string="list.familias" />}
                filtrar={this.filtrar}
                codi="familia"
              />

              {this.state.infoMarca.length > 0 && (
                <List
                  info={this.state.infoMarca}
                  tipus={"Marca"}
                  filtrar={this.filtrar}
                  codi="marca"
                />
              )}
              {this.state.infoModel.length > 0 && (
                <List
                  info={this.state.infoModel}
                  tipus={"Model"}
                  filtrar={this.filtrar}
                  codi="model"
                />
              )}
              {this.state.infoGamma.length > 0 && (
                <List
                  info={this.state.infoGamma}
                  tipus={"Gamma"}
                  filtrar={this.filtrar}
                  codi="gamma"
                />
              )}
            </div>

            <div className="col-md-12 col-lg-10">
              <div className="row">
                <div className="col">
                  <h1 className="titolFamilia">
                    {familia !== null ? (
                      familia
                    ) : (
                      <Traduccio string="index.titulo" />
                    )}
                  </h1>
                </div>
              </div>

              <div className="container">
                <div className="row">
                  <div className="col">
                    <div className="dropdown" style={{ float: "right" }}>
                      <button
                        className="btn btn-outline-primary dropdown-toggle"
                        type="button"
                        id="dropdownMenu2"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <Traduccio string="index.ordenar" />
                      </button>
                      <div
                        className="dropdown-menu dropdown-menu-right"
                        aria-labelledby="dropdownMenu2"
                      >
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => {
                            this.setState({
                              orderDir: "ASC",
                              orderCol: "preuAmbIva",
                            });
                            this.filtrar(codiFam, tipus, "preuAmbIva", "ASC");
                          }}
                        >
                          <Traduccio string="index.ordenarPreuAsc" />
                        </button>
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => {
                            this.setState({
                              orderDir: "DESC",
                              orderCol: "preuAmbIva",
                            });
                            this.filtrar(codiFam, tipus, "preuAmbIva", "DESC");
                          }}
                        >
                          <Traduccio string="index.ordenarPreuDesc" />
                        </button>
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => {
                            this.setState({
                              orderDir: "ASC",
                              orderCol: "descripcioCurta",
                            });
                            this.filtrar(
                              codiFam,
                              tipus,
                              "descripcioCurta",
                              "ASC"
                            );
                          }}
                        >
                          <Traduccio string="index.ordenarAlfa" />
                        </button>
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => {
                            this.setState({
                              orderDir: "ASC",
                              orderCol: "familia.descripcio",
                            });
                            this.filtrar(
                              codiFam,
                              tipus,
                              "familia.descripcio",
                              "ASC"
                            );
                          }}
                        >
                          <Traduccio string="index.ordenarFamilia" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {this.state.carregantFiltres ? (
                  <Spinner style={{ marginBottom: "200px" }} />
                ) : this.state.productes.length === 0 ? (
                  <div className="container noCoincidencies">
                    <h6 className="titolCartBuid">
                      {" "}
                      <Traduccio string="index.noCoinci" />
                    </h6>
                    <Link
                      to="/familia/tots"
                      onClick={() =>
                        this.filtrar("tots", "descripcioCurta", "ASC")
                      }
                      className="btn btn-primary mt-3 mb-5"
                    >
                      {" "}
                      <Traduccio string="index.veureTot" />
                    </Link>
                  </div>
                ) : (
                  <ContainerCards
                    productes={this.state.productes}
                    afegirCistella={that.props.afegirCistella}
                    codiF={codiFam}
                    filtrar={this.filtrar}
                    canviarEstat={this.canviarEstatOrdenar}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col offset-lg-11 offset-9">
              <a className="btn btn-primary" onClick={this.scrollToTop}>
                <KeyboardArrowUpOutlinedIcon />
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(Index);
