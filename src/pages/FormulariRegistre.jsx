import React, { Component, createRef } from "react";
import { withRouter, Link } from "react-router-dom";
import Header from "../components/HeaderNou";
import Traduccio from "../components/Traduccio";
import Footer from "../components/Footer";

import axios from "axios";
import $ from "jquery";

import en from "../traduccions/en.json";
import ca from "../traduccions/ca.json";
import es from "../traduccions/es.json";
import PeopleIcon from "@material-ui/icons/People";
import DoneIcon from "@material-ui/icons/Done";
import SendIcon from "@material-ui/icons/Send";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { emailRegistre } from "../components/EmailRegistre";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";

import "./css/proves.css";

class Prova extends Component {
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
      pressupost: [],
      lang: "",
      emailExisteix: false,

      idiomes: {
        en,
        ca,
        es,
      },
    };

    this.form = createRef();
    this.form2 = createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.canviarPoblacio = this.canviarPoblacio.bind(this);
    this.submit = this.submit.bind(this);
    this.canviarPattern = this.canviarPattern.bind(this);
    this.agafarValorsForm = this.agafarValorsForm.bind(this);
    this.traduir = this.traduir.bind(this);
    this.validacioFormulariPart2 = this.validacioFormulariPart2.bind(this);
    this.mostrarOcultarPanel = this.mostrarOcultarPanel.bind(this);
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

      const comprovarEmail = await axios.get(
        `${process.env.REACT_APP_API_DOMAIN}/api/ecom/clients?query=email==${this.state.email}`,
        {
          headers: {
            Authorization: `${localStorage.getItem(
              "tokenType"
            )} ${localStorage.getItem("resposta")}`,
          },
        }
      );

      const pattern = $("#numDocument").attr("pattern");

      if (pattern === "[0-9]{8}[A-Za-z]{1}") {
        let num = this.state.numDocument.substring(0, 8);
        let lletra = this.state.numDocument.substring(8, 9).toUpperCase();

        let residu = num % 23;

        console.log(lletra);
        let lletraCorresponent = "";

        switch (residu) {
          case 0:
            lletraCorresponent = "T";
            break;
          case 1:
            lletraCorresponent = "R";
            break;
          case 2:
            lletraCorresponent = "W";
            break;
          case 3:
            lletraCorresponent = "A";
            break;
          case 4:
            lletraCorresponent = "G";
            break;
          case 5:
            lletraCorresponent = "M";
            break;
          case 6:
            lletraCorresponent = "Y";
            break;
          case 7:
            lletraCorresponent = "F";
            break;
          case 8:
            lletraCorresponent = "P";
            break;
          case 9:
            lletraCorresponent = "D";
            break;
          case 10:
            lletraCorresponent = "X";
            break;
          case 11:
            lletraCorresponent = "B";
            break;
          case 12:
            lletraCorresponent = "N";
            break;
          case 13:
            lletraCorresponent = "J";
            break;
          case 14:
            lletraCorresponent = "Z";
            break;
          case 15:
            lletraCorresponent = "S";
            break;
          case 16:
            lletraCorresponent = "Q";
            break;
          case 17:
            lletraCorresponent = "V";
            break;
          case 18:
            lletraCorresponent = "H";
            break;
          case 19:
            lletraCorresponent = "L";
            break;
          case 20:
            lletraCorresponent = "C";
            break;
          case 21:
            lletraCorresponent = "K";
            break;
          case 22:
            lletraCorresponent = "E";
            break;
        }

        if (lletraCorresponent !== lletra) {
          $("#numDocument").css("border", "1px solid red");
          $(".dni .invalid-feedback").css("display", "inherit");
        } else {
          $("#numDocument").css("border", "1px solid #28a745");
          $(".dni .invalid-feedback").css("display", "none");

          if (comprovarEmail.data.page.totalElements === 0) {
            this.mostrarOcultarPanel(1, "next");
            this.setState({ emailExisteix: false });
          } else {
            this.setState({ emailExisteix: true });
          }
        }
      }
    }

    this.form.current.classList.add("was-validated");
  }

  async validacioFormulariPart2(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.form2.current.checkValidity() === true) {
      event.preventDefault();

      const afegirClient = await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_DOMAIN}/api/ecom/clients`,

        data: {
          codi: "0111",
          documentPagament: {
            id: "eyJpZGVudGlmaWNhZG9yQ29kaSI6IjgzMDAiLCJjb2RpIjoiMTAwMCJ9",
          },
          domiciliFiscal:
            this.state.tipoVia +
            " " +
            this.state.domicili +
            " " +
            this.state.num +
            (this.state.pis === undefined ? "" : " " + this.state.pis) +
            (this.state.escala === undefined ? "" : " " + this.state.escala) +
            (this.state.porta === undefined ? "" : " " + this.state.porta),
          email: this.state.email,
          emailFactura: this.state.emailFactura,
          escalaDomicili: this.state.escala,
          familiaClient: {
            id: "eyJpZGVudGlmaWNhZG9yQ29kaSI6IjgzMDAiLCJjb2RpIjoiMDAwMSJ9",
          },
          paisNif: { id: this.state.paisNif },
          codiPostal: { id: this.state.poblacio },

          tipusAdresa: { id: this.state.tipoVia },
          nif: this.state.numDocument.toUpperCase(),
          nomComercial: this.state.nomUsuari,
          nomDomicili: this.state.tipoVia + " " + this.state.domicili,
          nomFiscal: this.state.nomUsuari,
          numeroDomicili: this.state.num,
          pisDomicili: this.state.pis,
          portaDomicili: this.state.porta,
          regimIva: {
            id: "eyJpZGVudGlmaWNhZG9yQ29kaSI6IjgzMDAiLCJjb2RpIjoiMDEifQ==",
          },
          telefon: this.state.telf,
          tipusFacturacio: {
            id: "eyJpZGVudGlmaWNhZG9yQ29kaSI6IjgzMDAiLCJjb2RpIjoiMDAwMSJ9",
          },

          tipusNif: this.state.document,
          tipusVenciment: {
            id: "eyJpZGVudGlmaWNhZG9yQ29kaSI6IjgzMDAiLCJjb2RpIjoiMDAwMSJ9",
          },
        },
        headers: {
          Authorization: `${localStorage.getItem(
            "tokenType"
          )} ${localStorage.getItem("resposta")}`,
        },
      });

      const ok = afegirClient.data;
      this.mostrarOcultarPanel(2, "next");
      this.enviarEmail();
    }

    this.form2.current.classList.add("was-validated");
  }

  //Peticions necessàries per carregar l'infomració dels selects.

  async peticions() {
    const lang = localStorage.getItem("idioma");

    this.setState({ lang: lang });

    const resposta = await axios({
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

  async componentDidMount() {
    this.peticions();
  }

  async enviarEmail() {
    const em = emailRegistre(
      this.state.nomUsuari,
      this.state.email,
      this.traduir("correu.benv"),
      this.traduir("correu.confirmarCompte"),
      this.traduir("correu.correcte")
    );

    await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_DOMAIN}/api/ecomfront/sendEmail/send`,
      data: {
        body: em,
        htmlBody: true,
        subject: `${this.traduir("correu.benv")}`,
        to: `${this.state.email}`,
        to_cc: "",
      },
      headers: {
        Authorization: `${localStorage.getItem(
          "tokenType"
        )} ${localStorage.getItem("resposta")}`,
      },
    });
  }

  mostrarOcultarPanel(numPanel, direccio) {
    if (direccio === "prev") {
      $(".multisteps-form__panel").eq(numPanel).addClass("js-active");
      $(".multisteps-form__panel")
        .eq(numPanel + 1)
        .removeClass("js-active");

      if (numPanel === 0) {
        $(".multisteps-form__progress-btn").eq(1).removeClass("js-active");
        $(".multisteps-form__progress-btn").eq(2).removeClass("js-active");
      }
    } else {
      $(".multisteps-form__panel").eq(numPanel).addClass("js-active");
      $(".multisteps-form__panel")
        .eq(numPanel - 1)
        .removeClass("js-active");
      $(".multisteps-form__progress-btn").eq(numPanel).addClass("js-active");
    }
  }

  render() {
    return (
      <div>
        <Header
          canviarLlenguatge={this.props.canviarLlenguatge}
          count={this.props.count}
          total={this.props.total}
          productes={this.props.productes}
        />
        <div className="content">
          <div className="content__inner">
            <div className="container">
              <div className="container overflow-hidden">
                <div className="multisteps-form">
                  <div className="row mt-5">
                    <div className="col-12 col-lg-8 ml-auto mr-auto mb-4">
                      <div className="multisteps-form__progress">
                        <button
                          className="multisteps-form__progress-btn js-active"
                          type="button"
                          title="Dades Usuari"
                        >
                          {" "}
                          <PeopleIcon /> <Traduccio string="formulari.usuari" />
                        </button>
                        <button
                          className="multisteps-form__progress-btn"
                          type="button"
                          title="Dades Enviament"
                          disabled
                        >
                          {" "}
                          <SendIcon /> <Traduccio string="formulari.envio" />
                        </button>
                        <button
                          className="multisteps-form__progress-btn"
                          type="button"
                          title="Correu Confirmació"
                        >
                          <DoneIcon /> <Traduccio string="correu.confirm" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 col-lg-10 m-auto">
                      <form
                        className="multisteps-form__form needs-validation"
                        ref={this.form}
                        onSubmit={this.submit}
                        noValidate
                      >
                        <div
                          className="multisteps-form__panel shadow p-5 rounded bg-white js-active"
                          data-animation="scaleIn"
                        >
                          <h3 className="multisteps-form__title titolCart">
                            <Traduccio string="formulari.usuari" />
                          </h3>
                          <div className="multisteps-form__content">
                            {this.state.emailExisteix && (
                              <div className="row mt-4">
                                <div className="col-5">
                                  <div
                                    className="alert alert-danger alerta"
                                    role="alert"
                                  >
                                    <ReportProblemIcon className="mb-1" />{" "}
                                    <Traduccio string="registre.email" />
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="row mt-3">
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
                                      {this.traduir("formulari.opcio")}
                                    </option>
                                    {this.state.paisosNif.map(function (pais) {
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
                            <div className="row">
                              <div className="col-md-3 offset-md-9 ">
                                <button
                                  className="btn btn-primary mt-2 col"
                                  type="submit"
                                  title="Next"
                                >
                                  {" "}
                                  <Traduccio string="formulari.següent" />
                                </button>
                              </div>
                              <div className="col-10 offset-1 text-center mt-3">
                                <h6 className="horari">
                                  <Traduccio string="registre.compte"/>
                                  <Link to="/inicio-sesion" className="ml-2" >
                                    <Traduccio string="inici.inici" />
                                  </Link>
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                      <div
                        className="multisteps-form__panel shadow p-5 rounded bg-white"
                        data-animation="scaleIn"
                      >
                        <form
                          className="multisteps-form__form needs-validation"
                          ref={this.form2}
                          onSubmit={this.validacioFormulariPart2}
                          noValidate
                        >
                          <h3 className="multisteps-form__title titolCart">
                            <Traduccio string="formulari.envio" />
                          </h3>
                          <div className="multisteps-form__content">
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
                                      {this.traduir("formulari.opcio")}
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
                            <div className="button-row d-flex mt-4">
                              <button
                                className="btn btn-outline-primary js-btn-prev col-md-3"
                                type="button"
                                title="Prev"
                                onClick={() =>
                                  this.mostrarOcultarPanel(0, "prev")
                                }
                              >
                                <Traduccio string="urlok.tornar" />
                              </button>
                              <button
                                className="btn btn-primary ml-auto  col-md-3"
                                title="Next"
                                type="submit"
                              >
                                <Traduccio string="formulari.següent" />
                              </button>
                            </div>
                            <div className="col-10 offset-1 text-center mt-4">
                                <h6 className="horari">
                                  <Traduccio string="registre.compte"/>
                                  <Link to="/inicio-sesion" className="ml-2" >
                                    <Traduccio string="inici.inici" />
                                  </Link>
                                </h6>
                              </div>
                          </div>
                        </form>
                      </div>

                      <div
                        className="multisteps-form__panel shadow p-5 rounded bg-white"
                        data-animation="scaleIn"
                      >
                        <div className="multisteps-form__content">
                          <div className="row">
                            <div className="col-12 mt-5">
                              <div className="multisteps-form__content text-center">
                                <p className="registreOK">
                                  <CheckCircleIcon
                                    fontSize="large"
                                    className="mr-1 mb-2"
                                    style={{ color: "green" }}
                                  />{" "}
                                  <Traduccio string="registre.ok" />
                                </p>

                                <p className="registreEmail">
                                  <Traduccio string="registre.compr" />{" "}
                                  <strong>{this.state.email}</strong>
                                </p>
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
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(Prova);
