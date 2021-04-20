import React, { Component } from "react";
import { withRouter } from "react-router";

import Header from "../components/HeaderNou";
import List from "../components/List";
import Card from "../components/Card";
import "../pages/css/Index.css";
import axios from "axios";
import Titol from "../components/Titol";
import Traduccio from "../components/Traduccio";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

class Index extends Component {
  constructor(props) {
    super();
    console.log(props);
    this.state = {
      infoProductes: [],
      infoFamilies: [],
      filtrat: false,
      codiFam: "",
      infoFiltrat: [],
      famDesc: "",
      carregant: true,
    };
    if (props != null) {
      if (props.match.params.codiFam != null) {
        this.state.codiFam = props.match.params.codiFam;
        this.state.filtrat = true;
        sessionStorage.setItem("codiFam", props.match.params.codiFam);
      }
    }
  }

  trobarFam() {
    for (var x = 0; x < this.state.infoFamilies.length; x++) {
      if (
        this.state.infoFamilies[x]["codi"] === this.props.match.params.codiFam
      ) {
        return this.state.infoFamilies[x]["descripcio"];
      }
    }
  }

  async componentDidMount() {
    //Peticions de token, de refreshToken, de articles, de Families d'articles
    // i finalment, dels articles filtrat per familia.
    const lang = localStorage.getItem("idioma");

    const res = await axios.get(
      `${process.env.REACT_APP_API_DOMAIN}/api/auth?user=adminaguilo&pass=adminaguilo`,
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
        session: { e: "645", i: "643" },
      },
      headers: {
        Authorization: `${localStorage.getItem(
          "tokenType"
        )} ${localStorage.getItem("token")}`,
      },
    });

    const tokenRefresh = resp.data;
    localStorage.setItem("resposta", tokenRefresh.token);

    const articles = await axios.get(
      `${process.env.REACT_APP_API_DOMAIN}/api/ecomfront/articles?query=bloquejat==false&page=0&size=100&lang=${lang}&sort=familia.descripcio,ASC&sort=descripcioCurta,ASC`,
      {
        headers: {
          Authorization: `${localStorage.getItem(
            "tokenType"
          )} ${localStorage.getItem("resposta")}`,
        },
      }
    );

    const productes = articles.data;

    const resFam = await axios.get(
      `${process.env.REACT_APP_API_DOMAIN}/api/ecomfront/articlesFamilia?page=0&size=100&lang=${lang}`,
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
      infoProductes: productes._embedded.articles,
      infoFamilies: families._embedded.articleFamilias,
      carregant: false,
    });

    if (this.state.filtrat) {
      this.setState({ carregant: true });
      const respFiltrat = await axios.get(
        `${process.env.REACT_APP_API_DOMAIN}/api/ecomfront/articles?query=familia.codi=ic=${this.state.codiFam};bloquejat==false&page=0&size=100&lang=${lang}&sort=familia.descripcio,ASC&sort=descripcioCurta,ASC`,
        {
          headers: {
            Authorization: `${localStorage.getItem(
              "tokenType"
            )} ${localStorage.getItem("resposta")}`,
          },
        }
      );

      const productesFiltrats = respFiltrat.data;
      this.setState({
        infoFiltrat: productesFiltrats._embedded.articles,
        carregant: false,
      });
    }
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
          <div className="container margeCarregant">
          <div className="text-center text-primary mt-5">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
          </div>
        </div>
      );
    }
    if (!this.state.filtrat) {
      return (
        <div>
          <Header
            canviarLlenguatge={this.props.canviarLlenguatge}
            count={this.props.count}
          />
          <Helmet>
            <title> Embutidos La Luna Sóller</title>
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
                      <Traduccio string="index.titulo" />
                    </h1>
                  </div>
                </div>
                <div className="container">
                  <div className="row d-flex">
                    {this.state.infoProductes.map(function (articles, index) {
                      return (
                        <div
                          key={articles.id}
                          className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3"
                        >
                          <Card
                            decimalsPreuCataleg={articles.decimalsPreu}
                            decimalsPreuSenseIvaCataleg={
                              articles.decimalsPreuIva
                            }
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
    } else {
      return (
        <div>
          <Header
            canviarLlenguatge={this.props.canviarLlenguatge}
            count={this.props.count}
          />
          <Helmet>
            <title>
              {" "}
              {`${
                familia === undefined ? "" : familia + " - "
              } La Luna Sóller`}{" "}
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
                    <Titol titol={familia} />
                  </div>
                </div>
                <div className="container">
                  <div className="row d-flex">
                    {this.state.infoFiltrat.map(function (articles, index) {
                      return (
                        <div key={articles.codi} className="col-md-6 col-lg-3">
                          <Card
                            imatge={articles.rutaInforme}
                            desc={articles.descripcioCurta}
                            preu={articles.preuAmbIva}
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
}

export default withRouter(Index);
