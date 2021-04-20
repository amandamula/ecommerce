import React, { Component } from "react";
import { withRouter } from "react-router";
import Header from "../components/HeaderNou";
import axios from "axios";
import Traduccio from "../components/Traduccio";

import Footer from "../components/Footer";
import en from "../traduccions/en.json";
import ca from "../traduccions/ca.json";
import es from "../traduccions/es.json";

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
    };

    if (props.location.search === "") {
      this.state.pagamentOK = false;
    }
  }

  traduir(string) {
    const lang = localStorage.getItem("idioma");

    return this.state.idiomes[lang][string];
  }

  async componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const pedido = params.get("r");
    const cost = params.get("i");
    const preu = cost / 10 / 10;

    const pressupost = JSON.parse(sessionStorage.getItem("pressupost"));

    if (pressupost !== null) {
      if (pressupost["estat"] === "PENDENT") {
        if (pressupost["codi"] == pedido) {
          const bestretes = await axios({
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

          const CaixaMoviment = await axios({
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

          const p = await axios({
            method: "put",
            url: `${process.env.REACT_APP_API_DOMAIN}/api/ecom/pressupostos/${idPressupost}`,
            data: obj,
            headers: {
              Authorization: `${localStorage.getItem(
                "tokenType"
              )} ${localStorage.getItem("resposta")}`,
            },
          });

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

          this.setState({ pagamentOK: true });

          const headCorreuComprador = `<div class="container">
          <div class="row text-center">
              <div class="col-sm-6 col-sm-offset-3">        				
                  <h2 style="color:#0fad00">${this.traduir("email.ok")}</h2>
                  <h3>${
                    this.traduir("email.hola") + " " + pressupost["nomFiscal"]
                  }</h3>		 		 
                  <p style="font-size:20px;color:#5C5C5C;">${this.traduir(
                    "email.gracias"
                  )}</p>
                  <p style="font-size:15px;color:#5C5C5C;">EMBUTIDOS AGUILÓ, S.L. <br/>
                      Avenida de Asturias, 4-A <br/>
                      07100-Soller (Illes Balears) <br/>
                      Nif:B-07002827 <br/>
                      Telf (34) 971630168 <br/>
                      Email:laluna@la-luna.es <br/></p>
              </div>
          </div>
      </div>`;

          const headerVenedor = `<div class="container">
			<div class="row text-center">
				<div class="col-sm-6 col-sm-offset-3">       				
					<h2 style="color:#0fad00">${this.traduir("email.venedor")}</h2>				
				</div>
			</div>
		</div>`;

          const bodyCorreu = `<div class="container">
      <div class="row text-center">
         <div class="col-sm-6 col-sm-offset-3">
           <p style="font-size:20px;color:#5C5C5C;">${
             this.traduir("email.gestionado") + " " + pedido
           }</p>											
         </div>
      </div>
  </div>			
  
  <div class="container">
      <div class="row text-center">
         <div class="col-sm-6 col-sm-offset-3">
            <p style="font-size:20px;color:#5C5C5C;">${this.traduir(
              "formulari.usuari"
            )}</p>
          </div>
      </div>
  </div>		
  
  <table style="width: 100%; border: 1px solid black;">
      <thead>
         <tr style="border: 1px solid black;">
              <th style ="font-weight: bold; text-align: left;"> ${this.traduir(
                "formulari.nom"
              )} </th>
              <th style ="font-weight: bold; text-align: left;">${this.traduir(
                "formulari.tipusDoc"
              )} </th>					
              <th style ="font-weight: bold; text-align: left;">${this.traduir(
                "formulari.paisNif"
              )}</th> 
              <th style ="font-weight: bold; text-align: left;">${this.traduir(
                "formulari.numDoc"
              )}</th>
          </tr>
      </thead>
      <tbody>
         <tr>
          <td style="text-align: left;">${pressupost.nomComercial}</td>
          <td style="text-align: left;">${pressupost["tipusNif"]}</td>					 
          <td style="text-align: left;">${
            pressupost["paisNif"]["description"]
          }</td>
          <td style="text-align: left;">${pressupost["nif"]}</td> 
         </tr>
         
      </tbody>	
      <thead>
         <tr style="border: 1px solid black;">
            <th style ="font-weight: bold; text-align: left;">${this.traduir(
              "formulari.pais"
            )} </th>
            <th style ="font-weight: bold; text-align: left;">${this.traduir(
              "formulari.provincia"
            )} </th>
            <th style ="font-weight: bold; text-align: left;">${this.traduir(
              "formulari.poblacio"
            )} </th>         
         </tr>
      </thead>
      <tbody>
         <tr>
            <td style="text-align: left;">${
              pressupost["pais"]["description"]
            } </td>
            <td style="text-align: left;">${
              pressupost.provincia === undefined
                ? ""
                : pressupost.provincia.description
            } </td>
            <td style="text-align: left;">${
              pressupost.codiPostal === undefined
                ? ""
                : pressupost.codiPostal.description
            } </td>     
          </tr>
         
   </tbody>
   <thead>
         <tr style="border: 1px solid black;">
            <th style ="font-weight: bold; text-align: left;">${this.traduir(
              "formulari.via"
            )}</th>
            <th style ="font-weight: bold; text-align: left;">${this.traduir(
              "formulari.domicili"
            )} </th>
            <th style ="font-weight: bold; text-align: left;">${this.traduir(
              "formulari.num"
            )}</th>        
            <th style ="font-weight: bold; text-align: left;">${this.traduir(
              "formulari.escala"
            )}</th>
            <th style ="font-weight: bold; text-align: left;">${this.traduir(
              "formulari.pis"
            )}</th>
            <th style ="font-weight: bold; text-align: left;">${this.traduir(
              "formulari.porta"
            )} </th>
          </tr> 
  </thead>
  <tbody>
      <tr>
          <td style="text-align: left;">${
            pressupost.tipusAdresa.description
          }</td>
          <td style="text-align: left;">${pressupost.nomDomicili}  </td>
          <td style="text-align: left;">${pressupost.numeroDomicili}  </td>
          <td style="text-align: left;">${
            pressupost.escalaDomicili === undefined
              ? ""
              : pressupost.escalaDomicili
          }  </td>
          <td style="text-align: left;">${
            pressupost.pisDomicili === undefined ? "" : pressupost.pisDomicili
          } </td>
          <td style="text-align: left;">${
            pressupost.portaDomicili === undefined
              ? ""
              : pressupost.portaDomicili
          } </td>
  
      </tr>
       
  </tbody>
  <thead>
       <tr style="border: 1px solid black;">
          <th style ="font-weight: bold; text-align: left;">${this.traduir(
            "formulari.email"
          )}</th>
          <th style ="font-weight: bold; text-align: left;">${this.traduir(
            "formulari.emailFactura"
          )}</th>
          <th style ="font-weight: bold; text-align: left;">${this.traduir(
            "formulari.telefono"
          )}</th>       
       </tr>
    </thead>
    <tbody>
       <tr>
          <td style="text-align: left;">${pressupost.email}</td>
          <td style="text-align: left;">${pressupost.emailFactura}</td>
          <td style="text-align: left;">${pressupost.telefon}</td>      
       </tr>
    </tbody>
</table>
<br/>	
 
<div class="container">
    <div class="row text-center">
     <div class="col-sm-6 col-sm-offset-3">       
         <p style="font-size:20px;color:#5C5C5C;">${this.traduir(
           "formulari.pedido"
         )}</p>
       </div>
    </div>
</div>
 
<table style="width: 100%; border: 1px solid black;">
 <thead>
    <tr style="border: 1px solid black;">
        <th style ="font-weight: bold; text-align: left;">${this.traduir(
          "formulari.articles"
        )}</th>
        <th style ="font-weight: bold; text-align: right;">${this.traduir(
          "formulari.preu"
        )}</th>
        <th style ="font-weight: bold;text-align: center;">${this.traduir(
          "formulari.unitats"
        )}</th>
        <th style ="font-weight: bold; text-align: right;">${this.traduir(
          "carrito.total"
        )}</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      `;

          const footerCorreuClient = `<div class="container">
      <div class="row text-center">
         <div class="col-sm-6 col-sm-offset-3">
         <p style="font-size:20px;color:#5C5C5C;">${this.traduir(
           "email.confianza"
         )}</p>			
       </div>
      </div>
  </div>`;

          let liniesCorreu = ``;
          console.log(linies);

          for (var i = 0; i < linies.length; i++) {
            console.log(linies);

            liniesCorreu =
              liniesCorreu +
              `<td>${
                linies[i].descripcio
              }</td><td style="text-align: right;">${linies[
                i
              ].preuAmbIva.toFixed(2)} € </td>
        <td style="text-align: center;">${linies[i].unitats}</td> `;

            var totalPerProducte = linies[i].unitats * linies[i].preuAmbIva;

            liniesCorreu =
              liniesCorreu +
              `<td style="text-align: right;">${parseFloat(
                totalPerProducte.toString()
              ).toFixed(2)} € </td>`;

            if (i < linies.length - 1) {
              liniesCorreu = liniesCorreu + `</tr><tr>`;
            }
          }
          liniesCorreu = liniesCorreu + `</tr>`;
          liniesCorreu = liniesCorreu + `<tr></tr><tr></tr>`;
          liniesCorreu =
            liniesCorreu +
            `<tr><td style ="font-weight: bold;"><h2>${this.traduir(
              "carrito.total"
            )}:</h2></td><td></td><td></td><td style ="font-weight: bold;text-align: right;"><h2>${preu.toFixed(
              2
            )} €</h2></td></tr></tbody></table>`;

          const correuClient = await axios({
            method: "post",
            url: `${process.env.REACT_APP_API_DOMAIN}/api/ecomfront/sendEmail/send`,
            data: {
              body:
                headCorreuComprador +
                bodyCorreu +
                liniesCorreu +
                footerCorreuClient,
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

          const correuVenedor = await axios({
            method: "post",
            url: `${process.env.REACT_APP_API_DOMAIN}/api/ecomfront/sendEmail/send`,
            data: {
              body: headerVenedor + bodyCorreu + liniesCorreu,
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
          window.location.href="/urlko";
          this.setState({ pagamentOK: false });
        }
       
      
      }
    
    }
    window.location.href="/urlko";
  }
  render() {
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
