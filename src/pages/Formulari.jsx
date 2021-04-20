import React, { Component, createRef } from "react";
import Traduccio from "../components/Traduccio";
import Header from "../components/HeaderNou";
import "./css/Carrito.css";
import "./css/FormulariPedido.css";
import { withRouter } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import Footer from "../components/Footer";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import LlistaPedido from "../components/LlistaPedido";
import Pag from "../components/Pagament";
import KeyboardArrowDownOutlinedIcon from "@material-ui/icons/KeyboardArrowDownOutlined";
import { Modal } from "react-bootstrap";

class FormulariPedido extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productes: [],
      paisos: [],
      paisosNif: [],
      adreces: [],
      provincies: [],
      hiHaProv: false,
      altresProv: false,
      poblacions: [],
      altresPob: false,
      pagament: false,
      pedido: "",
      mostrar1: false,
      mostrar2: false,
      mostrar3: true,
      pressupost: [],
      importEnvio: "",
      show: false,
      altres: "Altres",
      otros: "Otros",
      other: "Other",
      lang: "",
      opcion: "Elige una opción",
      opcio: "Tria una opció",
      option: "Choose an option",
      descripcioGastos: "",
    };

    this.form = createRef();

    this.handleChange = this.handleChange.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.canviarPoblacio = this.canviarPoblacio.bind(this);
    this.submit = this.submit.bind(this);
    this.canviarPattern = this.canviarPattern.bind(this);
    this.agafarValorsForm = this.agafarValorsForm.bind(this);
    this.agafarValorResum = this.agafarValorResum.bind(this);
    this.canviarIcon = this.canviarIcon.bind(this);
    this.canviarIcon2 = this.canviarIcon2.bind(this);
    this.canviarIcon3 = this.canviarIcon3.bind(this);
    this.tornarDades = this.tornarDades.bind(this);

    if (props != null) {
      if (props.match.params.pagament != null) {
        this.state.pagament = true;
      }
    }
  }

  // Carregam les provincies en funcí del codi del pais.
  async handleChange(codi) {
    $("#prov").val("");
    this.setState({ altresPob: false, altresProv: false });

    const provincies = await axios.get(
      `https://aguilo.limit.es/api/ecom/provincies?query=pais.codi==${codi}&page=0&size=100`,
      {
        headers: {
          Authorization: `${localStorage.getItem(
            "tokenType"
          )} ${localStorage.getItem("resposta")}`,
        },
      }
    );

    const prov = provincies.data;

    if (prov.page.size > 0) {
      this.setState({ provincies: prov._embedded.provincias, hiHaProv: true });
    } else {
      this.setState({ provincies: "", hiHaProv: false, altresProv: true });
    }

    this.setState({ poblacions: [] });
  }

  // Carregam poblacions en funció del codi Provincia.
  async handleOnChange(codi) {
    $("#poblacio").val("");
    this.setState({ altresPob: false });
    const valorSeleccionat = codi;

    if (valorSeleccionat === "altres") {
      this.setState({ altresProv: true });
    } else {
      this.setState({ altresProv: false });

      const poblacions = await axios.get(
        `https://aguilo.limit.es/api/ecom/codisPostal?query=provincia.codi==${valorSeleccionat}&page=0&size=100`,
        {
          headers: {
            Authorization: `${localStorage.getItem(
              "tokenType"
            )} ${localStorage.getItem("resposta")}`,
          },
        }
      );

      const pob = poblacions.data;

      if (pob.page.size > 0) {
        this.setState({ poblacions: pob._embedded.codiPostals });
      } else {
        this.setState({ poblacions: [] });
      }
    }
  }

  //Mostrar input poblacio, en el cas de que el valor seleccionat sigui "altres".

  canviarPoblacio(codiPoblacio) {
    if (codiPoblacio === "altres") {
      this.setState({ altresPob: true });
    } else {
      this.setState({ altresPob: false });
    }
  }

  // Canviam el patern del input segons el tipus document seleccionat.

  canviarPattern(valor) {
    if (valor === "NIF") {
      $("#numDocument").attr("pattern", "[0-9]{8}[A-Za-z]{1}");
    } else {
      $("#numDocument").attr("pattern", "^[A-HJ-NP-SUVW][0-9]{7}[0-9A-J]$");
    }
  }

  // Agafam tots els valors del formulari.

  agafarValorsForm(id, valor) {
    this.setState({
      [id]: valor,
    });
  }

  agafarValorResum(id, valor) {
    this.setState({
      [id + "2"]: valor,
    });
    console.log(valor.target);
  }

  // feim la validació de formulari i si és vàlid, feim el POST.

  async submit(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.form.current.checkValidity() === true) {
      sessionStorage.setItem("nomClient", this.state.nomUsuari);
      sessionStorage.setItem("email", this.state.email);
      event.preventDefault();
      this.peticions();
    }

    this.form.current.classList.add("was-validated");
  }

  //Peticions necessàries per fer el pressupost, petició POST pressupost i linies pressupost.
  async peticions() {
    const lang = localStorage.getItem("idioma");

    const importMinim = this.importEnvioMinim();
    const importEnvioGratis = this.importEnvioGratis();
    let afegirImportEnvio = false;

    if (this.props.total < importMinim) {
      this.setState({ show: true });
    } else {
      if (this.props.total >= importEnvioGratis) {
        afegirImportEnvio = false;
      } else {
        afegirImportEnvio = true;
      }

      const puntVenta = await axios.get(
        "https://aguilo.limit.es/api/ecom/puntsVenda/eyJpZGVudGlmaWNhZG9yQ29kaSI6IjgzMDAiLCJjb2RpIjoiMDEwMCIsImVtcHJlc2FDb2RpIjoiMDAwMSJ9",
        {
          headers: {
            Authorization: `${localStorage.getItem(
              "tokenType"
            )} ${localStorage.getItem("resposta")}`,
          },
        }
      );

      const venta = puntVenta.data;

      const divisa = venta.divisa.id;
      const respostaDivises = await axios.get(
        `https://aguilo.limit.es/api/ecom/divises/${divisa}`,
        {
          headers: {
            Authorization: `${localStorage.getItem(
              "tokenType"
            )} ${localStorage.getItem("resposta")}`,
          },
        }
      );

      const idiomes = await axios.get(
        `https://aguilo.limit.es/api/ecom/idiomes?query=codiIso=ic=${lang}&page=0&size=100`,
        {
          headers: {
            Authorization: `${localStorage.getItem(
              "tokenType"
            )} ${localStorage.getItem("resposta")}`,
          },
        }
      );
      const divises = respostaDivises.data;
      const idioma = idiomes.data;
      const idiomaId = idioma._embedded.idiomas[0].id;

      let escala = null;
      let pis = null;
      let porta = null;

      if (this.state.escala) {
        escala = this.state.escala;
      } else {
        escala = null;
      }
      if (this.state.pis) {
        pis = this.state.pis;
      }
      if (this.state.porta) {
        porta = this.state.porta;
      }

      let dia = new Date();
      dia = dia.toISOString();
      let dni = this.state.numDocument.toUpperCase();
try{
      const pressupost = await axios({
        method: "post",
        url: "https://aguilo.limit.es/api/ecom/pressupostos",
        data: {
          codi: null,
          versio: 0,
          numero: null,
          data: dia,
          dataInici: dia,
          estat: "PENDENT",
          observacions: "Pago",
          divisa: { id: divisa },
          serieVenda: { id: venta.serie.id },
          operari: { id: venta.operari.id },
          magatzem: { id: venta.magatzem.id },
          idioma: { id: idiomaId },
          pais: { id: this.state.pais },
          provincia: {},
          codiPostal: {},
          documentPagamentCobrament: { id: venta.documentPagamentCobrament.id },
          valorDivisaEuros: divises.valorEuros,
          nomFiscal: this.state.nomUsuari,
          nomClient: venta.client.description,
          nomComercial: this.state.nomUsuari,
          classe: "0",
          tipusNif: this.state.document,
          nif: dni,
          nomDomicili: this.state.domicili,

          numeroDomicili: this.state.num,
          escalaDomicili: escala,
          pisDomicili: pis,
          portaDomicili: porta,
          domiciliFiscal: this.state.domicili,
          emailFactura: this.state.emailFactura,
          codiPostalClient: {},
          email: this.state.email,
          telefon: this.state.telf,
          tipusAdresa: { id: this.state.tipoVia },
          paisNif: { id: this.state.paisNif },
          puntVenda: { id: venta.id },
          client: { id: venta.client.id },
          empresa: { id: venta.empresa.id },
        },
        headers: {
          Authorization: `${localStorage.getItem(
            "tokenType"
          )} ${localStorage.getItem("resposta")}`,
        },
      });
      const pressup = pressupost.data;

 
      sessionStorage.setItem("pressupost", JSON.stringify(pressup));
      this.setState({ pressupost: pressup, pedido: pressup.codi });
    }catch(error){

        var fallo = JSON.parse(error.request.responseText);

        console.log(fallo.errors);
        if(fallo.errors[0].code === "DocumentIdentitat"){
          $("#numDocument").css("border", "1px solid red");
          $(".dni .invalid-feedback").css("display", "inherit");

        }
        
      }

 
      

    
      for (var i = 0; i < this.state.productes.length; i++) {
        const linia = await axios({
          method: "post",
          url: "https://aguilo.limit.es/api/ecom/pressupostosLinia",
          data: {
            article: { id: this.state.productes[i]["id"] },
            decimalsPreuCataleg: this.state.productes[i][
              "decimalsPreuSenseIva"
            ],
            decimalsPreuSenseIvaCataleg: this.state.productes[i][
              "decimalsPreuCataleg"
            ],
            descripcio: this.state.productes[i]["descripcio"],
            factorConversioSortides: 0,
            iva: { id: this.state.productes[i]["ivaId"] },
            pressupost: { id: this.state.pressupost.id },
            preu: this.state.productes[i]["preuSenseIva"],
            preuAmbIva: this.state.productes[i]["preu"],
            preuCataleg: this.state.productes[i]["preuCataleg"],
            preuSenseIVaCataleg: this.state.productes[i]["preuSenseIvaCataleg"],
            preuTotalLinia: (
              this.state.productes[i]["preuSenseIva"] *
              this.state.productes[i]["unitats"]
            ).toFixed(2),
            preuTotalLiniaAmbIva: (
              this.state.productes[i]["preu"] *
              this.state.productes[i]["unitats"]
            ).toFixed(2),
            unitats: this.state.productes[i]["unitats"],
          },
          headers: {
            Authorization: `${localStorage.getItem(
              "tokenType"
            )} ${localStorage.getItem("resposta")}`,
          },
        });
      }

      if (afegirImportEnvio) {
        const costRepartiment = this.importRepartiment();

        const gastosEnvio = await axios.get(
          `https://aguilo.limit.es/api/ecomfront/articles?query=codi=='GASTOS_ENVIO'`,
          {
            headers: {
              Authorization: `${localStorage.getItem(
                "tokenType"
              )} ${localStorage.getItem("resposta")}`,
            },
          }
        );

        const gastos = gastosEnvio.data._embedded.articles[0];

        const gastosEnvioLinea = await axios({
          method: "post",
          url: "https://aguilo.limit.es/api/ecom/pressupostosLinia",
          data: {
            article: { id: gastos.id },
            decimalsPreuCataleg: gastos.decimalsPreuIva,
            decimalsPreuSenseIvaCataleg: gastos.decimalsPreu,
            descripcio: gastos.descripcio,
            factorConversioSortides: 0,
            iva: { id: gastos.iva.id },
            pressupost: { id: this.state.pressupost.id },
            preu: gastos.pvp,
            preuAmbIva: costRepartiment,
            preuCataleg: costRepartiment,
            preuSenseIVaCataleg: gastos.pvp,
            preuTotalLinia: gastos.pvp.toFixed(2),
            preuTotalLiniaAmbIva: costRepartiment.toFixed(2),
            unitats: 1,
          },
          headers: {
            Authorization: `${localStorage.getItem(
              "tokenType"
            )} ${localStorage.getItem("resposta")}`,
          },
        });

        this.setState({
          importEnvio: costRepartiment.toFixed(2),
          descripcioGastos: gastos.descripcio,
        });
      }

      this.setState({ pagament: true });
    }
  }

  //Miram quin és l'import mínim per envio gratis, primer en funcio al C.P, després provincia i finalent Pais.
  importEnvioGratis() {
    if (this.state.poblacions !== null) {
      for (var i = 0; i < this.state.poblacions.length; i++) {
        if (this.state.poblacions[i]["id"] === this.state.poblacio) {
          if (
            this.state.poblacions[i]["importCompraNoPreuRepartiment"] !==
            undefined
          ) {
            return this.state.poblacions[i]["importCompraNoPreuRepartiment"];
          }
        }
      }
    }

    if (this.state.provincies !== null) {
      for (var i = 0; i < this.state.provincies.length; i++) {
        if (this.state.provincies[i]["id"] === this.state.prov) {
          if (
            this.state.provincies[i]["importCompraNoPreuRepartiment"] !==
            undefined
          ) {
            return this.state.provincies[i]["importCompraNoPreuRepartiment"];
          }
        }
      }
    }

    if (this.state.paisos !== null) {
      for (var i = 0; i < this.state.paisos.length; i++) {
        if (this.state.paisos[i]["id"] === this.state.pais) {
          return this.state.paisos[i]["importCompraNoPreuRepartiment"];
        }
      }
    }

    return -1;
  }

  //mirar l'import minim per realitzar l'envio.
  importEnvioMinim() {
    if (this.state.poblacions !== null) {
      for (var i = 0; i < this.state.poblacions.length; i++) {
        if (this.state.poblacions[i]["id"] === this.state.poblacio) {
          if (
            this.state.poblacions[i]["importMinimRepartiment"] !== undefined
          ) {
            return this.state.poblacions[i]["importMinimRepartiment"];
          }
        }
      }
    }

    if (this.state.provincies !== null) {
      for (var i = 0; i < this.state.provincies.length; i++) {
        if (this.state.provincies[i]["id"] === this.state.prov) {
          if (
            this.state.provincies[i]["importMinimRepartiment"] !== undefined
          ) {
            return this.state.provincies[i]["importMinimRepartiment"];
          }
        }
      }
    }

    if (this.state.paisos !== null) {
      for (var i = 0; i < this.state.paisos.length; i++) {
        if (this.state.paisos[i]["id"] === this.state.pais) {
          return this.state.paisos[i]["importMinimRepartiment"];
        }
      }
    }

    return -1;
  }

  //calcular el cost de l'enviament
  importRepartiment() {
    if (this.state.poblacions !== null) {
      for (var i = 0; i < this.state.poblacions.length; i++) {
        if (this.state.poblacions[i]["id"] === this.state.poblacio) {
          if (this.state.poblacions[i]["importRepartiment"] !== undefined) {
            return this.state.poblacions[i]["importRepartiment"];
          }
        }
      }
    }

    if (this.state.provincies !== null) {
      for (var i = 0; i < this.state.provincies.length; i++) {
        if (this.state.provincies[i]["id"] === this.state.prov) {
          if (this.state.provincies[i]["importRepartiment"] !== undefined) {
            return this.state.provincies[i]["importRepartiment"];
          }
        }
      }
    }

    if (this.state.paisos !== null) {
      for (var i = 0; i < this.state.paisos.length; i++) {
        if (this.state.paisos[i]["id"] === this.state.pais) {
          return this.state.paisos[i]["importRepartiment"];
        }
      }
    }

    return -1;
  }

  async componentDidMount() {
    const productes = JSON.parse(localStorage.getItem("productesCart"));
    const total = this.props.calcularTotal();
    const lang = localStorage.getItem("idioma");

    this.setState({ productes: productes, total: total, lang: lang });

    if (productes != null) {
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

      const paisos = await axios.get(
        `https://aguilo.limit.es/api/ecom/paisos?page=0&size=100`,
        {
          headers: {
            Authorization: `${localStorage.getItem(
              "tokenType"
            )} ${localStorage.getItem("resposta")}`,
          },
        }
      );

      const paiss = paisos.data;

      const paisosNif = await axios.get(
        `https://aguilo.limit.es/api/ecom/paisosNif?page=0&size=100`,
        {
          headers: {
            Authorization: `${localStorage.getItem(
              "tokenType"
            )} ${localStorage.getItem("resposta")}`,
          },
        }
      );

      const paisNif = paisosNif.data;

      const tipusAdreces = await axios.get(
        `https://aguilo.limit.es/api/ecom/tipusAdreces?page=0&size=100`,
        {
          headers: {
            Authorization: `${localStorage.getItem(
              "tokenType"
            )} ${localStorage.getItem("resposta")}`,
          },
        }
      );

      const adreces = tipusAdreces.data;
      this.setState({
        paisos: paiss._embedded.paises,
        paisosNif: paisNif._embedded.paisNifs,
        adreces: adreces._embedded.tipusAdresas,
      });
    }
  }

  // Canviam el icones de la pàgina de pagament.

  canviarIcon() {
    if (this.state.mostrar1) {
      this.setState({ mostrar1: false });
    } else {
      this.setState({ mostrar1: true, mostrar2: false, mostrar3: false });
    }
  }

  canviarIcon2() {
    if (this.state.mostrar2) {
      this.setState({ mostrar2: false });
    } else {
      this.setState({ mostrar2: true, mostrar1: false, mostrar3: false });
    }
  }

  canviarIcon3() {
    if (this.state.mostrar3) {
      this.setState({ mostrar3: false });
    } else {
      this.setState({ mostrar3: true, mostrar2: false, mostrar1: false });
    }
  }

  //
  tornarDades() {
    this.setState({ pagament: false });
  }

  render() {
    //Estils icones, transicions.
    const arrowStyle = {
      transition: "transform 0.5s",
      transform: this.state.mostrar1 ? "rotate(180deg)" : "",
    };

    const arrowStyle2 = {
      transition: "transform 0.5s",
      transform: this.state.mostrar2 ? "rotate(180deg)" : "",
    };

    const arrowStyle3 = {
      transition: "transform 0.5s",
      transform: this.state.mostrar3 ? "rotate(180deg)" : "",
    };

    const d = {
      float: "right",
    };

    if (this.state.productes === null) {
      return (
        <div>
          <Header
            canviarLlenguatge={this.props.canviarLlenguatge}
            count={this.props.count}
          />
          <div className="container cardsCart">
            <h6 className="titolCartBuid">
              {" "}
              <Traduccio string="carrito.cistellaBuida" />.
            </h6>
            <a href="/" className="btn btn-primary mt-3 mb-5">
              {" "}
              <Traduccio string="carrito.veureArt" />
            </a>
          </div>
        </div>
      );
    } else {
      if (!this.state.pagament) {
        return (
          <div>
            <Header
              canviarLlenguatge={this.props.canviarLlenguatge}
              count={this.props.count}
            />
            <div className="container">
              <div className="row">
                <div className="col-md-12 col-lg-8">
                  <div className="container">
                    <div className="row">
                      <div className="col-12">
                        <div className="container cardsCart">
                          <form
                            ref={this.form}
                            onSubmit={this.submit}
                            className="needs-validation"
                            noValidate
                          >
                            <h4 className="titolCart2">
                              <Traduccio string="formulari.usuari" />
                            </h4>

                            <div className="row mt-4">
                              <div className="col-md-8">
                                <div className="form-group labelForm">
                                  <label
                                    htmlFor="nomUsuari"
                                    className="labelForm"
                                  >
                                    <Traduccio string="formulari.nom" /> *
                                  </label>
                                  <input
                                    type="text"
                                    id="nomUsuari"
                                    className="form-control input"
                                    required
                                    defaultValue={this.state.nomUsuari}
                                    onChange={(e) =>
                                      this.agafarValorsForm(
                                        e.target.id,
                                        e.target.value
                                      )
                                    }
                                  />
                                  <div className="invalid-feedback">
                                    <WarningRoundedIcon
                                      fontSize="small"
                                      className="mb-1"
                                    />{" "}
                                    <Traduccio string="formulari.campObl" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-group labelForm">
                                  <label htmlFor="telf" className="labelForm">
                                    <Traduccio string="formulari.telefono" /> *
                                  </label>
                                  <input
                                    type="tel"
                                    id="telf"
                                    className="form-control input"
                                    required
                                    defaultValue={this.state.telf}
                                    pattern="[0-9]{9}"
                                    onChange={(e) =>
                                      this.agafarValorsForm(
                                        e.target.id,
                                        e.target.value
                                      )
                                    }
                                  />

                                  <div className="invalid-feedback">
                                    <WarningRoundedIcon
                                      fontSize="small"
                                      className="mb-1"
                                    />{" "}
                                    <Traduccio string="formulari.minCaract" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-4">
                                <div className="form-group labelForm">
                                  <label
                                    htmlFor="paisNif"
                                    className="labelForm"
                                  >
                                    <Traduccio string="formulari.paisNif" /> *
                                  </label>
                                  <select
                                    id="paisNif"
                                    className="custom-select input"
                                    required
                                    defaultValue={this.state.paisNif}
                                    onChange={(e) =>
                                      this.agafarValorsForm(
                                        e.target.id,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option selected disabled value="">
                                      {(this.state.lang === "es" &&
                                        this.state.opcion) ||
                                        (this.state.lang === "ca" &&
                                          this.state.opcio) ||
                                        (this.state.lang === "en" &&
                                          this.state.option)}
                                    </option>
                                    {this.state.paisosNif.map(function (
                                      pais,
                                      index
                                    ) {
                                      return (
                                        <option
                                          key={pais.codi}
                                          value={pais.codi}
                                        >
                                          {pais.nom}
                                        </option>
                                      );
                                    })}
                                  </select>
                                  <div className="invalid-feedback">
                                    <WarningRoundedIcon
                                      fontSize="small"
                                      className="mb-1"
                                    />{" "}
                                    <Traduccio string="formulari.campObl" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-group labelForm">
                                  <label
                                    htmlFor="document"
                                    className="labelForm"
                                  >
                                    <Traduccio string="formulari.tipusDoc" /> *
                                  </label>
                                  <select
                                    id="document"
                                    className="custom-select input"
                                    required
                                    defaultValue={this.state.document}
                                    onChange={(e) =>
                                      this.canviarPattern(e.target.value) +
                                      this.agafarValorsForm(
                                        e.target.id,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option selected disabled value="">
                                      {(this.state.lang === "es" &&
                                        this.state.opcion) ||
                                        (this.state.lang === "ca" &&
                                          this.state.opcio) ||
                                        (this.state.lang === "en" &&
                                          this.state.option)}
                                    </option>
                                    <option value="NIF">NIF</option>
                                    <option value="NIF_operador">
                                      NIF OPERADOR INTERCOMUNITARI
                                    </option>
                                    <option value="expedit_pais">
                                      DOCUMENT OFICIAL EXPEDIT PAIS
                                    </option>
                                    <option value="passaport">PASSAPORT</option>
                                    <option value="cert_residencia">
                                      CERTIFICAT RESIDENCIA FISCAL
                                    </option>
                                    <option value="altres">
                                      {(this.state.lang === "es" &&
                                        this.state.otros) ||
                                        (this.state.lang === "ca" &&
                                          this.state.altres) ||
                                        (this.state.lang === "en" &&
                                          this.state.other)}
                                    </option>
                                  </select>
                                  <div className="invalid-feedback">
                                    <WarningRoundedIcon
                                      fontSize="small"
                                      className="mb-1"
                                    />{" "}
                                    <Traduccio string="formulari.campObl" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-group labelForm dni">
                                  <label
                                    htmlFor="numDocument"
                                    className="labelForm"
                                    required
                                  >
                                    <Traduccio string="formulari.numDoc" /> *
                                  </label>
                                  <input
                                    type="text"
                                    id="numDocument"
                                    className="form-control input"
                                    pattern="[0-9]{8}[A-Za-z]{1}"
                                    required
                                    defaultValue={this.state.numDocument}
                                    onChange={(e) =>
                                      this.agafarValorsForm(
                                        e.target.id,
                                        e.target.value
                                      )
                                    }
                                  />

                                  <div className="invalid-feedback">
                                    <WarningRoundedIcon
                                      fontSize="small"
                                      className="mb-1"
                                    />{" "}
                                    <Traduccio string="formulari.numInvalid" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group labelForm">
                                  <label htmlFor="email" className="labelForm">
                                    <Traduccio string="formulari.email" /> *
                                  </label>
                                  <input
                                    type="email"
                                    id="email"
                                    className="form-control input"
                                    required
                                    defaultValue={this.state.email}
                                    onChange={(e) =>
                                      this.agafarValorsForm(
                                        e.target.id,
                                        e.target.value
                                      )
                                    }
                                  />
                                  <div className="invalid-feedback">
                                    <WarningRoundedIcon
                                      fontSize="small"
                                      className="mb-1"
                                    />{" "}
                                    <Traduccio string="formulari.campObl" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group labelForm">
                                  <label
                                    htmlFor="emailFactura"
                                    className="labelForm"
                                  >
                                    <Traduccio string="formulari.emailFactura" />{" "}
                                    *
                                  </label>
                                  <input
                                    type="email"
                                    id="emailFactura"
                                    className="form-control input"
                                    required
                                    defaultValue={this.state.emailFactura}
                                    onChange={(e) =>
                                      this.agafarValorsForm(
                                        e.target.id,
                                        e.target.value
                                      )
                                    }
                                  />
                                  <div className="invalid-feedback">
                                    <WarningRoundedIcon
                                      fontSize="small"
                                      className="mb-1"
                                    />{" "}
                                    <Traduccio string="formulari.campObl" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <h4 className="titolCart2 mt-5">
                              <Traduccio string="formulari.envio" />
                            </h4>

                            <div className="row mt-4">
                              <div className="col-md-4">
                                <div className="form-group labelForm">
                                  <label htmlFor="pais" className="labelForm">
                                    <Traduccio string="formulari.pais" /> *
                                  </label>
                                  <select
                                    id="pais"
                                    className="custom-select input"
                                    defaultValue={this.state.pais}
                                    onChange={(e) =>
                                      this.agafarValorsForm(
                                        e.target.id,
                                        e.target.value.split("&")[0]
                                      ) +
                                      this.handleChange(
                                        e.target.value.split("&")[1]
                                      ) +
                                      this.agafarValorResum(
                                        e.target.id,
                                        e.target.value.split("&")[2]
                                      )
                                    }
                                    required
                                  >
                                    <option selected disabled value="">
                                      {(this.state.lang === "es" &&
                                        this.state.opcion) ||
                                        (this.state.lang === "ca" &&
                                          this.state.opcio) ||
                                        (this.state.lang === "en" &&
                                          this.state.option)}
                                    </option>
                                    {this.state.paisos.map(function (
                                      paisos,
                                      index
                                    ) {
                                      return (
                                        <option
                                          key={paisos.codi}
                                          value={
                                            paisos.id +
                                            "&" +
                                            paisos.codi +
                                            "&" +
                                            paisos.nom
                                          }
                                        >
                                          {paisos.nom}
                                        </option>
                                      );
                                    })}
                                  </select>
                                  <div className="invalid-feedback">
                                    <WarningRoundedIcon
                                      fontSize="small"
                                      className="mb-1"
                                    />{" "}
                                    <Traduccio string="formulari.campObl" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-group labelForm">
                                  <label htmlFor="prov" className="labelForm">
                                    <Traduccio string="formulari.provincia" /> *
                                  </label>
                                  <select
                                    id="prov"
                                    className="custom-select input"
                                    defaultValue={this.state.prov}
                                    onChange={(e) =>
                                      this.handleOnChange(
                                        e.target.value.split("&")[1]
                                      ) +
                                      this.agafarValorsForm(
                                        e.target.id,
                                        e.target.value.split("&")[0]
                                      ) +
                                      this.agafarValorResum(
                                        e.target.id,
                                        e.target.value.split("&")[2]
                                      )
                                    }
                                    required
                                  >
                                    <option selected disabled value="">
                                      {(this.state.lang === "es" &&
                                        this.state.opcion) ||
                                        (this.state.lang === "ca" &&
                                          this.state.opcio) ||
                                        (this.state.lang === "en" &&
                                          this.state.option)}
                                    </option>

                                    {this.state.provincies.length > 0 &&
                                      this.state.provincies.map(function (
                                        prov,
                                        index
                                      ) {
                                        return (
                                          <option
                                            key={prov.codi}
                                            value={
                                              prov.id +
                                              "&" +
                                              prov.codi +
                                              "&" +
                                              prov.nom
                                            }
                                          >
                                            {prov.nom}
                                          </option>
                                        );
                                      })}

                                    <option value={"altres&altres&altres"}>
                                      {(this.state.lang === "es" &&
                                        this.state.otros) ||
                                        (this.state.lang === "ca" &&
                                          this.state.altres) ||
                                        (this.state.lang === "en" &&
                                          this.state.other)}
                                    </option>
                                  </select>
                                  <div className="invalid-feedback">
                                    <WarningRoundedIcon
                                      fontSize="small"
                                      className="mb-1"
                                    />{" "}
                                    Camp obligatori
                                  </div>
                                </div>
                              </div>
                              {!this.state.altresProv ? (
                                <div className="col-md-4">
                                  <div className="form-group labelForm">
                                    <label
                                      htmlFor="poblacio"
                                      className="labelForm"
                                    >
                                      <Traduccio string="formulari.poblacio" />{" "}
                                      *
                                    </label>

                                    <select
                                      id="poblacio"
                                      className="custom-select  input"
                                      defaultValue=""
                                      onChange={(e) =>
                                        this.canviarPoblacio(
                                          e.target.value.split("&")[0]
                                        ) +
                                        this.agafarValorsForm(
                                          e.target.id,
                                          e.target.value.split("&")[0]
                                        ) +
                                        this.agafarValorResum(
                                          e.target.id,
                                          e.target.value.split("&")[1]
                                        )
                                      }
                                      required
                                    >
                                      <option selected disabled value="">
                                        {(this.state.lang === "es" &&
                                          this.state.opcion) ||
                                          (this.state.lang === "ca" &&
                                            this.state.opcio) ||
                                          (this.state.lang === "en" &&
                                            this.state.option)}
                                      </option>

                                      {this.state.poblacions.length > 0 &&
                                        this.state.poblacions.map(function (
                                          pob,
                                          index
                                        ) {
                                          return (
                                            <option
                                              key={pob.codi}
                                              value={
                                                pob.id +
                                                "&" +
                                                pob.poblacioCodiTxt
                                              }
                                            >
                                              {pob.poblacioCodiTxt}
                                            </option>
                                          );
                                        })}

                                      <option value={"altres&altres"}>
                                        {(this.state.lang === "es" &&
                                          this.state.otros) ||
                                          (this.state.lang === "ca" &&
                                            this.state.altres) ||
                                          (this.state.lang === "en" &&
                                            this.state.other)}
                                      </option>
                                    </select>
                                    <div className="invalid-feedback">
                                      <WarningRoundedIcon
                                        fontSize="small"
                                        className="mb-1"
                                      />{" "}
                                      <Traduccio string="formulari.campObl" />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="col-md-4">
                                    <div className="form-group labelForm">
                                      <label
                                        htmlFor="nomProvincia"
                                        className="labelForm"
                                      >
                                        <Traduccio string="formulari.nomProv" />{" "}
                                        *
                                      </label>
                                      <input
                                        type="text"
                                        id="prov"
                                        className="form-control input"
                                        required
                                        defaultValue={this.state.provincia}
                                        onChange={(e) =>
                                          this.agafarValorsForm(
                                            e.target.id,
                                            e.target.value
                                          ) +
                                          this.agafarValorResum(
                                            e.target.id,
                                            e.target.value
                                          )
                                        }
                                      />
                                      <div className="invalid-feedback">
                                        <WarningRoundedIcon
                                          fontSize="small"
                                          className="mb-1"
                                        />{" "}
                                        <Traduccio string="formulari.campObl" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="form-group labelForm">
                                      <label
                                        htmlFor="nomPoblacio"
                                        className="labelForm"
                                      >
                                        <Traduccio string="formulari.nomPob" />{" "}
                                        *
                                      </label>
                                      <input
                                        type="text"
                                        id="poblacio"
                                        className="form-control input"
                                        required
                                        defaultValue={
                                          this.state.poblacio !== "altres"
                                            ? this.state.poblacio
                                            : ""
                                        }
                                        onChange={(e) =>
                                          this.agafarValorsForm(
                                            e.target.id,
                                            e.target.value
                                          )
                                        }
                                      />
                                      <div className="invalid-feedback">
                                        <WarningRoundedIcon
                                          fontSize="small"
                                          className="mb-1"
                                        />{" "}
                                        <Traduccio string="formulari.campObl" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="form-group labelForm">
                                      <label htmlFor="cp" className="labelForm">
                                        <Traduccio string="formulari.cp" />
                                      </label>
                                      <input
                                        type="text"
                                        id="cp"
                                        className="form-control input"
                                        required
                                        onChange={(e) =>
                                          this.agafarValorsForm(
                                            e.target.id,
                                            e.target.value
                                          )
                                        }
                                      />
                                      <div className="invalid-feedback">
                                        <WarningRoundedIcon
                                          fontSize="small"
                                          className="mb-1"
                                        />{" "}
                                        <Traduccio string="formulari.campObl" />
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                            {this.state.altresPob && (
                              <div className="row">
                                <div className="col-md-4">
                                  <div className="form-group labelForm">
                                    <label
                                      htmlFor="poblacio"
                                      className="labelForm"
                                    >
                                      <Traduccio string="formulari.nomPob" /> *
                                    </label>
                                    <input
                                      type="text"
                                      id="poblacio"
                                      className="form-control input"
                                      required
                                      defaultValue={
                                        this.state.poblacio !== "altres"
                                          ? this.state.poblacio
                                          : ""
                                      }
                                      onChange={(e) =>
                                        this.agafarValorsForm(
                                          e.target.id,
                                          e.target.value
                                        )
                                      }
                                    />
                                    <div className="invalid-feedback">
                                      <WarningRoundedIcon
                                        fontSize="small"
                                        className="mb-1"
                                      />{" "}
                                      <Traduccio string="formulari.campObl" />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group labelForm">
                                    <label htmlFor="cp" className="labelForm">
                                      <Traduccio string="formulari.cp" /> *
                                    </label>
                                    <input
                                      type="text"
                                      id="cp"
                                      className="form-control input"
                                      required
                                      onChange={(e) =>
                                        this.agafarValorsForm(
                                          e.target.id,
                                          e.target.value
                                        )
                                      }
                                    />
                                    <div className="invalid-feedback">
                                      <WarningRoundedIcon
                                        fontSize="small"
                                        className="mb-1"
                                      />{" "}
                                      <Traduccio string="formulari.campObl" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="row">
                              <div className="col-md-4">
                                <div className="form-group labelForm">
                                  <label
                                    htmlFor="tipoVia"
                                    className="labelForm"
                                  >
                                    <Traduccio string="formulari.via" /> *
                                  </label>
                                  <select
                                    id="tipoVia"
                                    className="custom-select input"
                                    required
                                    defaultValue={this.state.tipoVia}
                                    onChange={(e) =>
                                      this.agafarValorsForm(
                                        e.target.id,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option selected disabled value="">
                                      {(this.state.lang === "es" &&
                                        this.state.opcion) ||
                                        (this.state.lang === "ca" &&
                                          this.state.opcio) ||
                                        (this.state.lang === "en" &&
                                          this.state.option)}
                                    </option>
                                    {this.state.adreces.map(function (
                                      tipus,
                                      index
                                    ) {
                                      return (
                                        <option
                                          key={tipus.codi}
                                          value={tipus.codi}
                                        >
                                          {tipus.descripcio}
                                        </option>
                                      );
                                    })}
                                  </select>
                                  <div className="invalid-feedback">
                                    <WarningRoundedIcon
                                      fontSize="small"
                                      className="mb-1"
                                    />{" "}
                                    <Traduccio string="formulari.campObl" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-8">
                                <div className="form-group labelForm">
                                  <label
                                    htmlFor="domicili"
                                    className="labelForm"
                                  >
                                    <Traduccio string="formulari.domicili" /> *
                                  </label>
                                  <input
                                    type="text"
                                    id="domicili"
                                    className="form-control input"
                                    required
                                    defaultValue={this.state.domicili}
                                    onChange={(e) =>
                                      this.agafarValorsForm(
                                        e.target.id,
                                        e.target.value
                                      )
                                    }
                                  />
                                  <div className="invalid-feedback">
                                    <WarningRoundedIcon
                                      fontSize="small"
                                      className="mb-1"
                                    />{" "}
                                    <Traduccio string="formulari.campObl" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-6 col-md-2">
                                <div className="form-group labelForm">
                                  <label htmlFor="num" className="labelForm">
                                    <Traduccio string="formulari.numDom" /> *
                                  </label>
                                  <input
                                    type="text"
                                    id="num"
                                    className="form-control input"
                                    defaultValue={this.state.num}
                                    required
                                    onChange={(e) =>
                                      this.agafarValorsForm(
                                        e.target.id,
                                        e.target.value
                                      )
                                    }
                                  />

                                  <div className="invalid-feedback">
                                    <WarningRoundedIcon
                                      fontSize="small"
                                      className="mb-1"
                                    />{" "}
                                    <Traduccio string="formulari.campObl" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-6 col-md-2">
                                <div className="form-group labelForm">
                                  <label htmlFor="escala" className="labelForm">
                                    <Traduccio string="formulari.escala" />
                                  </label>
                                  <input
                                    type="text"
                                    id="escala"
                                    className="form-control input"
                                    defaultValue={this.state.escala}
                                    onChange={(e) =>
                                      this.agafarValorsForm(
                                        e.target.id,
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-6 col-md-2">
                                <div className="form-group labelForm">
                                  <label htmlFor="porta" className="labelForm">
                                    <Traduccio string="formulari.porta" />
                                  </label>
                                  <input
                                    type="text"
                                    id="porta"
                                    defaultValue={this.state.porta}
                                    className="form-control input"
                                    onChange={(e) =>
                                      this.agafarValorsForm(
                                        e.target.id,
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-6 col-md-2">
                                <div className="form-group labelForm">
                                  <label htmlFor="pis" className="labelForm">
                                    <Traduccio string="formulari.pis" />
                                  </label>
                                  <input
                                    type="text"
                                    id="pis"
                                    className="form-control input"
                                    defaultValue={this.state.pis}
                                    onChange={(e) =>
                                      this.agafarValorsForm(
                                        e.target.id,
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-3 offset-md-9 ">
                                <button
                                  type="submit"
                                  className="btn btn-primary mt-2 col"
                                >
                                  <Traduccio string="formulari.següent" />
                                </button>
                              </div>
                            </div>
                          </form>
                          <Modal
                            show={this.state.show}
                            onHide={() => this.setState({ show: false })}
                          >
                            <Modal.Body>
                              <p className="mt-4 titolCart2">
                                <Traduccio string="formulari.modal" />
                              </p>
                              <p className="titolCart2">
                                {" "}
                                <Traduccio string="formulari.importMin" />
                                {this.state.importRepartiment}
                              </p>
                            </Modal.Body>
                            <Modal.Footer>
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => this.setState({ show: false })}
                              >
                                <Traduccio string="formulari.tancar" />
                              </button>
                            </Modal.Footer>
                          </Modal>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-4">
                  <div className="container resum">
                    <div className="container">
                      <h5 className="titolCart2">
                        <Traduccio string="formulari.pedido" />
                      </h5>

                      <div className="row mt-4">
                        <table className="table">
                          <thead>
                            <tr>
                              <th className="th">
                                <Traduccio string="formulari.articles" />
                              </th>
                              <th className="th">
                                <Traduccio string="formulari.unitats" />
                              </th>
                              <th className="th">
                                <Traduccio string="formulari.preu" />
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.productes.map(function (
                              articles,
                              index
                            ) {
                              return (
                                <LlistaPedido
                                  key={articles["codi"]}
                                  codi={articles["codi"]}
                                  quant={articles["unitats"]}
                                  id={articles["id"]}
                                />
                              );
                            })}

                            <tr>
                              <th className="titolTotal">
                                <Traduccio string="carrito.total" />
                              </th>

                              <th colSpan="2" className="preuTotal">
                                {this.props.total} €
                              </th>
                            </tr>
                          </tbody>
                        </table>
                        <a
                          href="/carrito"
                          className="btn btn-outline-primary ml-auto"
                        >
                          {" "}
                          <Traduccio string="formulari.modPedido" />
                        </a>
                      </div>
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
            <div className="container">
              <div className="row">
                <div className="col-md-12 col-lg-8">
                  <div className="container">
                    <div className="row">
                      <div className="col-12">
                        <div className="container cardsCart">
                          <div className="accordion" id="accordionExample">
                            <div className="card">
                              <div className="card-header" id="headingOne">
                                <h2 className="mb-0">
                                  <a
                                    className="btn btn-link btn-block titolCart2 linkAcordeon"
                                    data-toggle="collapse"
                                    data-target="#collapseOne"
                                    aria-expanded="true"
                                    aria-controls="collapseOne"
                                    onClick={this.canviarIcon}
                                  >
                                    <Traduccio string="formulari.usuari" />{" "}
                                    <span style={d}>
                                      {" "}
                                      <KeyboardArrowDownOutlinedIcon
                                        style={arrowStyle}
                                      />
                                    </span>
                                  </a>
                                </h2>
                              </div>

                              <div
                                id="collapseOne"
                                className="collapse"
                                aria-labelledby="headingOne"
                                data-parent="#accordionExample"
                              >
                                <div className="card-body">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <p className="info">
                                        <strong className="upper">
                                          <Traduccio string="formulari.nom" />:{" "}
                                        </strong>{" "}
                                        {this.state.nomUsuari}
                                      </p>
                                      <p className="info">
                                        <strong className="upper">
                                          <Traduccio string="formulari.tipusDoc" />
                                          :
                                        </strong>{" "}
                                        {this.state.document}
                                      </p>
                                      <p className="info">
                                        <strong className="upper">
                                          <Traduccio string="formulari.email" />
                                          :
                                        </strong>{" "}
                                        {this.state.email}
                                      </p>
                                      <p className="info">
                                        <strong className="upper">
                                          <Traduccio string="formulari.telefono" />
                                          :
                                        </strong>{" "}
                                        {this.state.telf}
                                      </p>
                                    </div>
                                    <div className="col-md-6">
                                      {" "}
                                      <p className="info">
                                        <strong className="upper">
                                          <Traduccio string="formulari.paisNif" />
                                          :
                                        </strong>{" "}
                                        {this.state.paisNif}
                                      </p>
                                      <p className="info">
                                        <strong className="upper">
                                          <Traduccio string="formulari.numDoc" />
                                          :
                                        </strong>{" "}
                                        {this.state.numDocument}
                                      </p>
                                      <p className="info">
                                        <strong className="upper">
                                          <Traduccio string="formulari.emailFactura" />
                                          :
                                        </strong>{" "}
                                        {this.state.emailFactura}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <button
                                      className="btn btn-outline-primary mb-4"
                                      style={d}
                                      onClick={this.tornarDades}
                                    >
                                      {" "}
                                      <Traduccio string="formulari.modDades" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="card">
                              <div className="card-header" id="headingTwo">
                                <h2 className="mb-0">
                                  <a
                                    className="btn btn-link btn-block titolCart2 linkAcordeon"
                                    data-toggle="collapse"
                                    data-target="#collapseTwo"
                                    aria-expanded="true"
                                    aria-controls="collapseTwo"
                                    onClick={this.canviarIcon2}
                                  >
                                    <Traduccio string="formulari.envio" />{" "}
                                    <span style={d}>
                                      {" "}
                                      <KeyboardArrowDownOutlinedIcon
                                        style={arrowStyle2}
                                      />
                                    </span>
                                  </a>
                                </h2>
                              </div>
                              <div
                                id="collapseTwo"
                                className="collapse"
                                aria-labelledby="headingTwo"
                                data-parent="#accordionExample"
                              >
                                <div className="card-body">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <p className="info">
                                        <strong className="upper">
                                          <Traduccio string="formulari.pais" />:{" "}
                                        </strong>{" "}
                                        {this.state.pais2}
                                      </p>
                                      <p className="info">
                                        <strong className="upper">
                                          <Traduccio string="formulari.poblacio" />
                                          :
                                        </strong>{" "}
                                        {this.state.poblacio2}
                                      </p>

                                      <p className="info">
                                        <strong className="upper">
                                          <Traduccio string="formulari.domicili" />
                                          :
                                        </strong>{" "}
                                        {this.state.domicili}
                                      </p>
                                      <p className="info">
                                        <strong className="upper">
                                          <Traduccio string="formulari.pis" />:
                                        </strong>{" "}
                                        {this.state.pis}
                                      </p>

                                      <p className="info">
                                        <strong className="upper">
                                          <Traduccio string="formulari.porta" />
                                          :
                                        </strong>{" "}
                                        {this.state.porta}
                                      </p>
                                    </div>
                                    <div className="col-md-6">
                                      {" "}
                                      <p className="info">
                                        <strong className="upper">
                                          <Traduccio string="formulari.provincia" />
                                          :
                                        </strong>{" "}
                                        {this.state.prov2}
                                      </p>
                                      <p className="info">
                                        <strong className="upper">
                                          <Traduccio string="formulari.via" />:
                                        </strong>{" "}
                                        {this.state.tipoVia}
                                      </p>
                                      <p className="info">
                                        <strong className="upper">
                                          <Traduccio string="formulari.numDom" />
                                          :
                                        </strong>{" "}
                                        {this.state.num}
                                      </p>
                                      <p className="info">
                                        <strong className="upper">
                                          <Traduccio string="formulari.escala" />
                                          :
                                        </strong>{" "}
                                        {this.state.escala}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <button
                                      className="btn btn-outline-primary mb-4"
                                      style={d}
                                      onClick={this.tornarDades}
                                    >
                                      {" "}
                                      <Traduccio string="formulari.modDades" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="card">
                              <div className="card-header" id="headingThree">
                                <h2 className="mb-0">
                                  <a
                                    className="btn btn-link btn-block titolCart2 linkAcordeon"
                                    data-toggle="collapse"
                                    data-target="#collapseThree"
                                    aria-expanded="true"
                                    aria-controls="collapseThree"
                                    onClick={this.canviarIcon3}
                                  >
                                    <Traduccio string="formulari.pagament" />{" "}
                                    <span style={d}>
                                      {" "}
                                      <KeyboardArrowDownOutlinedIcon
                                        style={arrowStyle3}
                                      />
                                    </span>
                                  </a>
                                </h2>
                              </div>
                              <div
                                id="collapseThree"
                                className="collapse show"
                                aria-labelledby="headingThree"
                                data-parent="#accordionExample"
                              >
                                <div className="card-body">
                                  <div className="mt-4">
                                    <Pag
                                      order={this.state.pedido}
                                      amount={this.props.total}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-4">
                  <div className="container resum">
                    <div className="container">
                      <h5 className="titolCart2">
                        <Traduccio string="formulari.pedido" />
                      </h5>

                      <div className="row mt-4">
                        <table className="table">
                          <thead>
                            <tr>
                              <th className="th">
                                <Traduccio string="formulari.articles" />
                              </th>
                              <th className="th">
                                <Traduccio string="formulari.unitats" />
                              </th>
                              <th className="th">
                                <Traduccio string="formulari.preu" />
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.productes.map(function (
                              articles,
                              index
                            ) {
                              return (
                                <LlistaPedido
                                  key={articles["codi"]}
                                  codi={articles["codi"]}
                                  quant={articles["unitats"]}
                                  id={articles["id"]}
                                />
                              );
                            })}
                            <tr>
                              <td className="titolsLlista">
                                {this.state.descripcioGastos}
                              </td>
                              <td>1</td>
                              <td>{this.state.importEnvio} €</td>
                            </tr>
                            <tr>
                              <th className="titolTotal">
                                <Traduccio string="carrito.total" />{" "}
                              </th>

                              <th colSpan="2" className="preuTotal">
                                {this.props.total} €
                              </th>
                            </tr>
                          </tbody>
                        </table>
                        <a
                          href="/carrito"
                          className="btn btn-outline-primary ml-auto"
                        >
                          {" "}
                          <Traduccio string="formulari.modPedido" />
                        </a>
                      </div>
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
}

export default withRouter(FormulariPedido);
