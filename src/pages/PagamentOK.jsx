import React, { Component } from "react";
import { withRouter } from "react-router";
import Header from "../components/HeaderNou";
import axios from "axios";
import Traduccio from "../components/Traduccio";

import Footer from "../components/Footer";
import en from "../traduccions/en.json";
import ca from "../traduccions/ca.json";
import es from "../traduccions/es.json";
import { email } from "../components/EmailComprador";
import { emailVenedor } from "../components/EmailVenedor";

class Pag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numPedido: "",
      pagamentOK: false,
      email: "",
      idiomes: {
        en,
        ca,
        es,
      },
      carregant: true,
    };

    if (props.location.search === "") {
      this.state.pagamentOK = false;
    }
  }

  //Funció per traduir el correu de pagament.

  traduir(string) {
    const lang = localStorage.getItem("idioma");

    return this.state.idiomes[lang][string];
  }

  /* POST de brestres i de caixes moviment, canviam l'estat del Pressupost a ACCEPTAT.
  Feim un GET per tenir l'informació de les linies del pressupost i enviam 2 E-mails, 
  un al comprador i l'altre al venedor.*/

  async componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const pedido = params.get("r");
    const cost = params.get("i");
    const preu = cost / 10 / 10;

    const pressupost = JSON.parse(sessionStorage.getItem("pressupost"));

    if (pressupost !== null) {
      if (pressupost["estat"] === "PENDENT") {
        if (pressupost["codi"] == pedido) {
          await axios({
            method: "post",
            url: `${process.env.REACT_APP_API_DOMAIN}/api/ecom/bestretes`,
            data: {
              numero: null,
              caixa: { id: pressupost["puntVenda"]["id"] },
              descripcio: "Pagament",
              dia: pressupost["data"],
              est: 0,
              pressupost: { id: pressupost["id"] },
              preuAmbIva: preu,
            },
            headers: {
              Authorization: `${localStorage.getItem(
                "tokenType"
              )} ${localStorage.getItem("resposta")}`,
            },
          });

        
          await axios({
            method: "post",
            url: `${process.env.REACT_APP_API_DOMAIN}/api/ecom/caixesMoviment`,
            data: {
              anc: true,
              numero: null,
              caixa: {
                id: pressupost["puntVenda"]["id"],
              },
              cls: "0",
              dia: pressupost["data"],
              documentPagamentCobrament: {
                id: pressupost["documentPagamentCobrament"]["id"],
              },
              divisa: {
                id: pressupost["divisa"]["id"],
              },
              operari: {
                id: pressupost["operari"]["id"],
              },
              pressupost: {
                id: pressupost["id"],
              },
              preuAmbIva: preu,
              trs: false,
              valorDivisaEuros: 10,
            },
            headers: {
              Authorization: `${localStorage.getItem(
                "tokenType"
              )} ${localStorage.getItem("resposta")}`,
            },
          });

          const obj = JSON.parse(sessionStorage.getItem("pressupost"));
          obj.estat = "ACCEPTAT";

          const idPressupost = pressupost["id"];

          await axios({
            method: "put",
            url: `${process.env.REACT_APP_API_DOMAIN}/api/ecom/pressupostos/${idPressupost}`,
            data: obj,
            headers: {
              Authorization: `${localStorage.getItem(
                "tokenType"
              )} ${localStorage.getItem("resposta")}`,
            },
          });

          this.setState({ pagamentOK: true });

          const pressupostLinies = await axios.get(
            `${process.env.REACT_APP_API_DOMAIN}/api/ecom/pressupostosLinia?query=pressupost.codi==${pedido}&page=undefined&size=100`,
            {
              headers: {
                Authorization: `${localStorage.getItem(
                  "tokenType"
                )} ${localStorage.getItem("resposta")}`,
              },
            }
          );

          const linies = pressupostLinies.data._embedded.pressupostLinias;
          const prov =
            pressupost.provincia === undefined
              ? ""
              : pressupost.provincia.description;
          const cp =
            pressupost.codiPostal === undefined
              ? ""
              : pressupost.codiPostal.description;

          const em = email(
            this.traduir("email.ok"),
            this.traduir("email.hola"),
            pressupost["nomFiscal"],
            this.traduir("email.gracias"),
            this.traduir("email.numero"),
            pressupost.email,
            preu,
            pedido,
            this.traduir("formulari.usuari"),
            pressupost["nif"],
            pressupost.telefon,
            pressupost.tipusAdresa.description,
            linies,
            pressupost["pais"]["description"],
            prov,
            cp,
            pressupost.nomDomicili,
            pressupost.numeroDomicili,
            pressupost.pisDomicili,
            pressupost.escalaDomicili,
            pressupost.portaDomicili,
            this.traduir("email.confianza")
          );

          const emVenedor = emailVenedor(
            this.traduir("email.venedor"),
            this.traduir("email.numero"),
            preu,
            pedido,
            linies,
            this.traduir("formulari.usuari"),
            pressupost["nif"],
            pressupost.telefon,
            pressupost.tipusAdresa.description,
            pressupost["pais"]["description"],
            prov,
            cp,
            pressupost.nomDomicili,
            pressupost.numeroDomicili,
            pressupost.pisDomicili,
            pressupost.escalaDomicili,
            pressupost.portaDomicili,
            pressupost["nomFiscal"],
            pressupost.email,
            this.traduir(
              "formulari.nom"
            ),
            this.traduir(
              "formulari.numDoc"
            ),
            this.traduir(
              "formulari.pais"
            ),
            this.traduir(
              "formulari.provincia"
            ),
            this.traduir(
              "formulari.poblacio"
            ),
            this.traduir(
              "formulari.via"
            ),
            this.traduir(
              "formulari.domicili"
            ),
            this.traduir(
              "formulari.escala"
            ),
            this.traduir(
              "formulari.pis"
            ),
            this.traduir(
              "formulari.porta"
            ),
            this.traduir(
              "formulari.numDom"
            ),
            this.traduir(
              "formulari.email"
            ),
            this.traduir(
              "formulari.telefono"
            )

          );

          await axios({
            method: "post",
            url: `${process.env.REACT_APP_API_DOMAIN}/api/ecomfront/sendEmail/send`,
            data: {
              body: em,
              htmlBody: true,
              subject: `${this.traduir("email.ok")}: ${pedido}`,
              to: `${pressupost.emailFactura}`,
              to_cc: "",
            },
            headers: {
              Authorization: `${localStorage.getItem(
                "tokenType"
              )} ${localStorage.getItem("resposta")}`,
            },
          });

          await axios({
            method: "post",
            url: `${process.env.REACT_APP_API_DOMAIN}/api/ecomfront/sendEmail/send`,
            data: {
              body: emVenedor,
              htmlBody: true,
              subject: `${this.traduir("email.ok")}: ${pedido}`,
              to: "amula@limit.es",
              to_cc: "",
            },
            headers: {
              Authorization: `${localStorage.getItem(
                "tokenType"
              )} ${localStorage.getItem("resposta")}`,
            },
          });

          sessionStorage.removeItem("pressupost");
          sessionStorage.removeItem("email");
          sessionStorage.removeItem("nomClient");
          localStorage.removeItem("total");
          localStorage.removeItem("count");
          localStorage.removeItem("productesCart");

          this.setState({
            numPedido: pedido,
            email: pressupost["emailFactura"],
          });
        } else {
          this.setState({ pagamentOK: false, carregant: false });
        }
      }
    }
    this.setState({ carregant: false });
  }
  render() {
    if (this.state.carregant) {
      return (
        <div>
          <Header
            canviarLlenguatge={this.props.canviarLlenguatge}
            count={this.props.count}
          />
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
    if (this.state.pagamentOK) {
      return (
        <div>
          <Header
            canviarLlenguatge={this.props.canviarLlenguatge}
            count={this.props.count}
          />
          <div className="container cardsCart marges">
            <h6 className="titolCartBuid">
              {" "}
              <strong>
                {" "}
                <Traduccio string="urlok.ok" />
              </strong>
            </h6>
            <p className="mb-0 mt-4">
              <Traduccio string="urlok.pedido" />
              {this.state.numPedido}
            </p>
            <p>
              <Traduccio string="urlok.correu" /> {this.state.email}{" "}
            </p>
            <a href="/" className="btn btn-primary mt-3 mb-5">
              {" "}
              <Traduccio string="urlok.tornar" />
            </a>
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
          <div className="container cardsCart marges">
            <h6 className="titolCartBuid">
              {" "}
              <strong>
                {" "}
                <Traduccio string="urlok.error" />
              </strong>
            </h6>
            <a href="/" className="btn btn-primary mt-3 mb-5">
              {" "}
              <Traduccio string="urlok.tornar" />
            </a>
          </div>
          <Footer />
        </div>
      );
    }
  }
}

export default withRouter(Pag);
