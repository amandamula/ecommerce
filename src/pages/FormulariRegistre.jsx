import React, { Component, createRef } from "react";
import { withRouter } from "react-router-dom";
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

      if (comprovarEmail.data.page.totalElements === 0) {
        this.mostrarOcultarPanel(1, "next");
      } else {
        alert("L'email ja existeix!!");
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
      console.log(ok);
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
    const email = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
    <head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <title>New email template 2021-04-27</title>
    <!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]-->
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
    <!--[if gte mso 9]>
    <xml>
    <o:OfficeDocumentSettings>
    <o:AllowPNG></o:AllowPNG>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <!--[if !mso]><!-- -->
    <link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i" rel="stylesheet">
    <!--<![endif]-->
    <style type="text/css">
    #outlook a {
    padding:0;
    }
    .ExternalClass {
    width:100%;
    }
    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
    line-height:100%;
    }
    .es-button {
    mso-style-priority:100!important;
    text-decoration:none!important;
    transition:all 100ms ease-in;
    }
    a[x-apple-data-detectors] {
    color:inherit!important;
    text-decoration:none!important;
    font-size:inherit!important;
    font-family:inherit!important;
    font-weight:inherit!important;
    line-height:inherit!important;
    }
    .es-button:hover {
    background:#555555!important;
    border-color:#555555!important;
    }
    .es-desk-hidden {
    display:none;
    float:left;
    overflow:hidden;
    width:0;
    max-height:0;
    line-height:0;
    mso-hide:all;
    }
    [data-ogsb] .es-button {
    border-width:0!important;
    padding:15px 30px 15px 30px!important;
    }
    [data-ogsb] .es-button.es-button-1 {
    padding:15px 25px!important;
    }
    @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:left; line-height:120%!important } h3 { font-size:20px!important; text-align:left; line-height:120%!important } h1 a { text-align:center } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important } h2 a { text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:20px!important } h3 a { text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:17px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:17px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:14px!important; display:inline-block!important; border-width:15px 25px 15px 25px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
    </style>
    </head>
    <body style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
    <div class="es-wrapper-color" style="background-color:#F1F1F1">
    <!--[if gte mso 9]>
    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
    <v:fill type="tile" color="#f1f1f1"></v:fill>
    </v:background>
    <![endif]-->
    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top">
    <tr style="border-collapse:collapse">
    <td valign="top" style="padding:0;Margin:0">
    <table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
    <tr style="border-collapse:collapse">
    <td align="center" style="padding:0;Margin:0">
    <table class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
    <tr style="border-collapse:collapse">
    <td style="Margin:0;padding-bottom:5px;padding-top:10px;padding-left:40px;padding-right:40px;background-color:#FFFFFF" bgcolor="#ffffff" align="left">
    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
    <tr style="border-collapse:collapse">
    <td valign="top" align="center" style="padding:0;Margin:0;width:520px">
    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
    <tr style="border-collapse:collapse">
    <td align="center" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://lhneef.stripocdn.email/content/guids/347b6ca3-7230-4801-906a-6ec7413f5a28/images/97601619513916017.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="315"></td>
    </tr>
    </table></td>
    </tr>
    </table></td>
    </tr>
    </table></td>
    </tr>
    </table>
    <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
    <tr style="border-collapse:collapse">
    <td align="center" style="padding:0;Margin:0">
    <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
    <tr style="border-collapse:collapse">
    <td align="left" bgcolor="#790726" style="Margin:0;padding-top:40px;padding-bottom:40px;padding-left:40px;padding-right:40px;background-color:#790726">
    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
    <tr style="border-collapse:collapse">
    <td valign="top" align="center" style="padding:0;Margin:0;width:520px">
    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
    <tr style="border-collapse:collapse">
    <td align="center" style="padding:0;Margin:0;padding-bottom:10px"><h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#FFFFFF">${this.traduir(
      "correu.benv"
    )}.</h1></td>
    </tr>
    <tr style="border-collapse:collapse">
    <td esdev-links-color="#757575" align="center" style="Margin:0;padding-top:10px;padding-bottom:20px;padding-left:30px;padding-right:30px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:23px;color:#FFFFFF;font-size:15px">${
      this.state.nomUsuari
    }${this.traduir("correu.correcte")}${this.state.email}.</p></td>
    </tr>
    <tr style="border-collapse:collapse">
    <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:20px"><span class="es-button-border" style="border-style:solid;border-color:#26A4D3;background:#0B5394;border-width:0px;display:inline-block;border-radius:50px;width:auto"><a href="http://localhost:3000/" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;transition:all 100ms ease-in;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:14px;border-style:solid;border-color:#0B5394;border-width:15px 30px 15px 30px;display:inline-block;background:#0B5394;border-radius:50px;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center">${this.traduir(
      "correu.confirmarCompte"
    )}</a></span></td>
    </tr>
    </table></td>
    </tr>
    </table></td>
    </tr>
    </table></td>
    </tr>
    </table>
    <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
    <tr style="border-collapse:collapse">
    <td align="center" style="padding:0;Margin:0">
    <table class="es-footer-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
    <tr style="border-collapse:collapse">
    <td align="left" style="Margin:0;padding-top:40px;padding-bottom:40px;padding-left:40px;padding-right:40px">
    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
    <tr style="border-collapse:collapse">
    <td valign="top" align="center" style="padding:0;Margin:0;width:520px">
    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
    <tr style="border-collapse:collapse">
    <td align="center" style="padding:0;Margin:0;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:18px;color:#666666;font-size:12px">EMBUTIDOS AGUILÓ, S.L.<br>Avenida de Asturias, 4-A<br>07100-Soller (Illes Balears)<br>Nif:B-07002827<br>Telf (34) 971630168<br>Email:laluna@la-luna.es<br></p></td>
    </tr>
    </table></td>
    </tr>
    </table></td>
    </tr>
    </table></td>
    </tr>
    </table></td>
    </tr>
    </table>
    </div>
    </body>
    </html>

`;

    await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_DOMAIN}/api/ecomfront/sendEmail/send`,
      data: {
        body: email,
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
                                    <Traduccio string="registre.compr" /> <strong>{this.state.email}</strong>
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
