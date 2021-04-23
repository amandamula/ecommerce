import React, { Component } from "react";
import { withRouter } from "react-router";

import Header from "../components/HeaderNou";
import List from "../components/List";
import Card from "../components/Card";
import "../pages/css/Index.css";
import axios from "axios";
import Traduccio from "../components/Traduccio";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import Spinner from "../components/Spinner";

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
    };
    if (props != null) {
      if (props.match.params.codiFam != null) {
        this.state.codiFam = props.match.params.codiFam;
        this.state.filtrat = true;
        sessionStorage.setItem("codiFam", props.match.params.codiFam);
      }
    }
  }

  //Agafar la descripció de Familia a partir del codi.
  trobarFam() {
    for (var x = 0; x < this.state.infoFamilies.length; x++) {
      if (
        this.state.infoFamilies[x]["codi"] === this.props.match.params.codiFam
      ) {
        return this.state.infoFamilies[x]["descripcio"];
      }
    }
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

    this.setState({
      infoFamilies: families._embedded.articleFamilias,
      carregant: false,
    });

    this.setState({ carregant: true });

    const respFiltrat = await axios.get(
      process.env.REACT_APP_API_DOMAIN + "/api/ecomfront/articles",
      {
        params: {
          query:
            (this.state.filtrat
              ? `familia.codi=ic=${this.state.codiFam};`
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

    this.setState({
      productes: productesFiltrats._embedded.articles,
      infoFiltrat: productesFiltrats._embedded.articles,
      carregant: false,
    });
  }

  render() {
    const familia = this.trobarFam();

    const that = this;
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
        />
        <Helmet>
          <title>
            {" "}
            {this.state.filtrat
              ? `${familia === undefined ? "" : familia + " - "} La Luna Sóller`
              : "Embutidos La Luna Sóller"}
          </title>
        </Helmet>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 col-lg-2">
              <List
                info={this.state.infoFamilies}
                tipus={<Traduccio string="list.familias" />}
              />
            </div>

            <div className="col-md-12 col-lg-10">
              <div className="row">
                <div className="col">
                  <h1 className="titolFamilia">
                    {this.state.filtrat ? (
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
                <div className="dropdown" style={{float : "right"}}>
                  <button
                    className="btn btn-outline-primary dropdown-toggle"
                    type="button"
                    id="dropdownMenu2"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <Traduccio string="index.ordenar"/>
                  </button>
                  <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu2">
                    <button className="dropdown-item" type="button"  onClick={() => {
                    this.setState({
                      orderDir: "ASC",
                      orderCol : "preuAmbIva"
                    });
                    this.actualitzar();
                  }}>
                      <Traduccio string="index.ordenarPreuAsc"/>
                    </button>
                    <button className="dropdown-item" type="button"  onClick={() => {
                    this.setState({
                      orderDir: "DESC",
                      orderCol : "preuAmbIva"
                    });
                    this.actualitzar();
                  }}>
                       <Traduccio string="index.ordenarPreuDesc"/>
                    </button>
                    <button className="dropdown-item" type="button"  onClick={() => {
                    this.setState({
                      orderDir: "ASC",
                      orderCol : "descripcioCurta"
                    });
                    this.actualitzar();
                  }}>
                      <Traduccio string="index.ordenarAlfa"/>
                    </button>
                    <button className="dropdown-item" type="button"  onClick={() => {
                    this.setState({
                      orderDir: "ASC",
                      orderCol : "familia.descripcio"
                    });
                    this.actualitzar();
                  }}>
                      <Traduccio string="index.ordenarFamilia"/>
                    </button>
                  </div>
                </div>
                </div>
                </div>
            
                <div className="row d-flex">
                  {this.state.productes.map(function (articles) {
                    return (
                      <div
                        key={articles.id}
                        className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3"
                      >
                        <Card
                          decimalsPreuCataleg={articles.decimalsPreu}
                          decimalsPreuSenseIvaCataleg={articles.decimalsPreuIva}
                          descripcio={articles.descripcio}
                          desc={articles.descripcioCurta}
                          id={articles.id}
                          imatge={articles.rutaInforme}
                          ivaId={articles.iva.id}
                          preu={articles.preuAmbIva}
                          preuCataleg={articles.fixedPreuAmbIva}
                          preuSenseIvaCataleg={articles.fixedPvp}
                          preuSenseIva={articles.pvp}
                          codi={articles.codi}
                          afegirCistella={that.props.afegirCistella}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(Index);
