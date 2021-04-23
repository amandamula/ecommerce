import React, { Component, createRef } from "react";
import { withRouter } from "react-router-dom";
import Header from "../components/HeaderNou";
import axios from "axios";
import Traduccio from "../components/Traduccio";

import $ from "jquery";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import en from "../traduccions/en.json";
import ca from "../traduccions/ca.json";
import es from "../traduccions/es.json";
import PeopleIcon from "@material-ui/icons/People";
import DoneIcon from "@material-ui/icons/Done";
import SendIcon from "@material-ui/icons/Send";

class FormulariRegistre extends Component {
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
      pedido: "",
      mostrar1: false,
      mostrar2: false,
      mostrar3: true,
      pressupost: [],
      lang: "",

      idiomes: {
        en,
        ca,
        es,
      },
    };

    this.form = createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.canviarPoblacio = this.canviarPoblacio.bind(this);
    this.submit = this.submit.bind(this);
    this.canviarPattern = this.canviarPattern.bind(this);
    this.agafarValorsForm = this.agafarValorsForm.bind(this);
    this.traduir = this.traduir.bind(this);
  }

  traduir(string) {
    const lang = localStorage.getItem("idioma");

    return this.state.idiomes[lang][string];
  }

//Carregar provincies.
  async handleChange(codi) {
    $("#prov").val("");
    this.setState({ altresPob: false, altresProv: false });

    const provincies = await axios.get(
      `${process.env.REACT_APP_API_DOMAIN}/api/ecom/provincies?query=pais.codi==${codi}&page=0&size=100`,
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
        `${process.env.REACT_APP_API_DOMAIN}/api/ecom/codisPostal?query=provincia.codi==${valorSeleccionat}&page=0&size=100`,
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

    const puntVenta = await axios.get(
      `${process.env.REACT_APP_API_DOMAIN}/api/ecom/puntsVenda/${process.env.REACT_APP_PUNTVENTA_ID}`,
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
      `${process.env.REACT_APP_API_DOMAIN}/api/ecom/divises/${divisa}`,
      {
        headers: {
          Authorization: `${localStorage.getItem(
            "tokenType"
          )} ${localStorage.getItem("resposta")}`,
        },
      }
    );

    const idiomes = await axios.get(
      `${process.env.REACT_APP_API_DOMAIN}/api/ecom/idiomes?query=codiIso=ic=${lang}&page=0&size=100`,
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
  }

  async componentDidMount() {
    const productes = JSON.parse(localStorage.getItem("productesCart"));
    const total = this.props.calcularTotal();
    const lang = localStorage.getItem("idioma");

    this.setState({ productes: productes, total: total, lang: lang });

    if (productes != null) {
      const resposta = await axios({
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

      const tokenRefresh = resposta.data;
      localStorage.setItem("resposta", tokenRefresh.token);

      const paisos = await axios.get(
        `${process.env.REACT_APP_API_DOMAIN}/api/ecom/paisos?page=0&size=100`,
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
        `${process.env.REACT_APP_API_DOMAIN}/api/ecom/paisosNif?page=0&size=100`,
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
        `${process.env.REACT_APP_API_DOMAIN}/api/ecom/tipusAdreces?page=0&size=100`,
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

  render() {
    return (
      <div>
        <Header
          canviarLlenguatge={this.props.canviarLlenguatge}
          count={this.props.count}
        />
        <div className="container">
          <div className="row">
            <div className="col-md-12">
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
                        <ul
                          className="nav nav-pills mb-3"
                          id="pills-tab"
                          role="tablist"
                        >
                          <div className="container">
                            <div className="row">
                              <div className="col-md-4">
                              <li className="nav-item" role="presentation">
                                <a
                                  class="nav-link active mb-4"
                                  id="pills-home-tab"
                                  data-toggle="pill"
                                  href="#Dades-usuari"
                                  role="tab"
                                  aria-controls="pills-home"
                                  aria-selected="true"
                                  onClick={() =>
                                    $("#pills-profile").removeClass(
                                      "show active"
                                    ) + $("#pills-home").addClass("show active") + $("#pills-home-tab").toggleClass("active")
                                  }
                                  style={{display:"inline" }}
                                >
                                  <PeopleIcon /><br/>
                                </a>
                               <p className="mt-3"> <Traduccio string="formulari.usuari"/></p>
                              </li>
                              </div>
                              <div className="col-4">
                              <li className="nav-item" role="presentation">
                                <a
                                  className="nav-link"
                                  id="pills-profile-tab"
                                  data-toggle="pill"
                                  href="#Dades-enviament"
                                  role="tab"
                                  aria-controls="pills-profile"
                                  aria-selected="false"
                                  onClick={() =>
                                    $("#pills-home").removeClass(
                                      "show active"
                                    ) +
                                    $("#pills-profile").addClass("show active") + $(this).toggleClass("active")
                                  }
                                >
                                  <SendIcon className="mr-2"/> {" "} <Traduccio string="formulari.envio"/>
                                </a>
                              </li>
                              </div>
                              <div className="col-4">
                              <li className="nav-item" role="presentation">
                                <a
                                  class="nav-link"
                                  id="pills-contact-tab"
                                  data-toggle="pill"
                                  href="#Correu-confirmacio"
                                  role="tab"
                                  aria-controls="pills-contact"
                                  aria-selected="false"
                                >
                                  <DoneIcon className="mr-2"/> {" "} <Traduccio string="correu.confirm"/>
                                </a>
                              </li>
                            </div>
                            </div>
                          </div>
                        </ul>

                        <div className="tab-content" id="pills-tabContent">
                          <div
                            className="tab-pane fade show active"
                            id="pills-home"
                            role="tabpanel"
                            aria-labelledby="pills-home-tab"
                          >
                            <h4 className="titolCart2">
                              <Traduccio string="formulari.usuari" />
                            </h4>

                            <div className="row mt-4">
                              <div className="col-md-4">
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
                              <div className="col-md-4">
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
                                      {this.traduir("formulari.opcio")}
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
                                      {this.traduir("formulari.opcio")}
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
                            <div className="row">
                              <div className="col-md-3 offset-md-9 ">
                                <a                                  
                                  className="btn btn-primary mt-2 col"
                                  onClick={() =>
                                    $("#pills-home").removeClass(
                                      "show active"
                                    ) +
                                    $("#pills-profile").addClass("show active") + $("#pills-profile-tab").addClass("active") + + $("#pills-home-tab").removeClass("active")
                                  }
                                >
                                  <Traduccio string="formulari.següent" />
                                </a>
                              </div>
                            </div>

                          </div>
                          <div
                            class="tab-pane fade"
                            id="pills-profile"
                            role="tabpanel"
                            aria-labelledby="pills-profile-tab"
                          >
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
                                      )
                                    }
                                    required
                                  >
                                    <option selected disabled value="">
                                      {this.traduir("formulari.opcio")}
                                    </option>
                                    {this.state.paisos.map(function (
                                      paisos,
                                      index
                                    ) {
                                      return (
                                        <option
                                          key={paisos.codi}
                                          value={paisos.id + "&" + paisos.codi}
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
                                      )
                                    }
                                    required
                                  >
                                    <option selected disabled value="">
                                      {this.traduir("formulari.opcio")}
                                    </option>

                                    {this.state.provincies.length > 0 &&
                                      this.state.provincies.map(function (
                                        prov,
                                        index
                                      ) {
                                        return (
                                          <option
                                            key={prov.codi}
                                            value={prov.id + "&" + prov.codi}
                                          >
                                            {prov.nom}
                                          </option>
                                        );
                                      })}

                                    <option value={"altres&altres"}>
                                      {this.traduir("formulari.altres")}
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
                                        )
                                      }
                                      required
                                    >
                                      <option selected disabled value="">
                                        {this.traduir("formulari.opcio")}
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
                                        {this.traduir("formulari.altres")}
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
                                            ? this.state.poblacio2
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
                                          ? this.state.poblacio2
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
                          </div>
                        </div>
                      </form>
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

export default withRouter(FormulariRegistre);
