import React, { Component } from 'react';
import Traduccio from '../components/Traduccio';
import Header from '../components/HeaderNou';
import './css/Carrito.css';
import './css/FormulariPedido.css';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import $ from 'jquery';

import WarningRoundedIcon from '@material-ui/icons/WarningRounded';



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
            usuari: "",
            telf: "",
            telfError: false,
            numDocument: "",
            numDocumentError: false,
            document: "",
            email: "",
            emailError: false,
            emailFactura: "",
            emailFacturaError: false,
            paisError: false,
            pais: "",
            prov: "",
            provError: false,
            pobError: false,
            pob: "",
            cp: "",
            cpError: false,
            tipoViaError: false,
            tipoVia: "",
            domiciliError: false,
            domicili: "",
            numError: false,
            num: "",
            validat : false,


        }

        this.handleChange = this.handleChange.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.canviarPoblacio = this.canviarPoblacio.bind(this);
        this.validacioForm = this.validacioForm.bind(this);
        this.submit = this.submit.bind(this);


    }

    async handleChange(event) {
        $("#prov").val('0');
        this.setState({ altresPob: false, altresProv: false });


        console.log(event.target.value);
        const codiPais = event.target.value;

        const provincies = await axios.get(`https://aguilo.limit.es/api/ecom/provincies?query=pais.codi==${codiPais}&page=0&size=100`, {
            headers: { "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("resposta")}` }
        })

        const prov = provincies.data;


        if (prov.page.size > 0) {

            this.setState({ provincies: prov._embedded.provincias, hiHaProv: true });

        } else {

            this.setState({ provincies: "", hiHaProv: false, altresProv: true });
        }

        this.setState({ poblacions: [] })

    }

    async handleOnChange(event) {

        this.setState({ altresPob: false });
        const valorSeleccionat = event.target.value;

        if (valorSeleccionat === "altres") {
            this.setState({ altresProv: true });
        } else {
            this.setState({ altresProv: false });

            const poblacions = await axios.get(`https://aguilo.limit.es/api/ecom/codisPostal?query=provincia.codi==${valorSeleccionat}&page=0&size=100`, {
                headers: { "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("resposta")}` }
            })

            const pob = poblacions.data;

            if (pob.page.size > 0) {
                this.setState({ poblacions: pob._embedded.codiPostals });
            } else {
                this.setState({ poblacions: [] });
            }


        }

    }

    canviarPoblacio(event) {
        const codiPoblacio = event.target.value;

        if (codiPoblacio === "altres") {
            this.setState({ altresPob: true });
        } else {
            this.setState({ altresPob: false });
        }

    }

    validacioForm(id, valor) {
        switch (id) {
            case 'nomUsuari':
                if (valor === "") {
                    this.setState({ usuari: "error" });
                } else {
                    this.setState({ usuari: valor });
                }

                break;

            case 'telf':
                if (valor === "") {
                    this.setState({ telf: "error", telfError: false });
                } else if (valor.length < 9) {
                    this.setState({ telf: valor, telfError: true });
                } else {
                    this.setState({ telf: valor, telfError: false });
                }
                break;

            case 'document':

                if (valor === "0") {
                    this.setState({ document: "error" });

                } else {
                    this.setState({ document: valor });
                }
                break;

            case 'numDocument':

                if (valor === "") {
                    this.setState({ numDocument: "error", numDocumentError: false });
                } else {

                    if (this.state.document === "NIF") {

                        if (valor.match(/[0-9]{8}[A-Za-z]{1}/) && valor.length <= 9) {
                            this.setState({ numDocumentError: false, numDocument: valor });
                        } else {
                            this.setState({ numDocumentError: true, numDocument: valor });
                        }
                    } else {

                        if (valor === "") {
                            this.setState({ numDocumentError: true, numDocument: "error" });
                        } else {
                            this.setState({ numDocumentError: false, numDocument: valor });
                        }

                    }

                }
                break;

            case 'email':

                if (valor !== "") {
                    this.setState({ emailError: false, email: valor });

                } else {
                    this.setState({ emailError: true, email: valor });
                }
                break;


            case 'emailfactura':

                if (valor !== "") {
                    this.setState({ emailFacturaError: false, emailFactura: valor });

                } else {
                    this.setState({ emailFacturaError: true, emailFactura: valor });
                }
                break;
                ;

            case 'nomProvincia':

                if (valor === "") {
                    this.setState({ provError: true })
                } else {
                    this.setState({ provError: false, prov: valor })
                }
                break;

            case 'poblacio':

                if (valor === "0") {
                    this.setState({ pobError: true })
                } else {
                    this.setState({ pobError: false, pob: valor })
                }
                break;

            case 'nomPoblacio':

                if (valor === "") {
                    this.setState({ pobError: true })
                } else {
                    this.setState({ pob: valor })
                }
                break;

            case 'cp':

                if (valor === "") {
                    this.setState({ cpError: true })
                } else {
                    this.setState({ cpError: false, cp: valor })
                }
                break;

            case 'tipoVia':

                if (valor === "0") {
                    this.setState({ tipoViaEror: true });
                } else {
                    this.setState({ tipoViaEror: false, tipoVia: valor });
                }
                break;

            case 'domicili':

                if (valor === "") {
                    this.setState({ domiciliError: true });
                } else {
                    this.setState({ domiciliError: false, domicili: valor });
                }
                break;


            case 'num':

                if (valor === "") {
                    this.setState({ numError: true });
                } else {
                    this.setState({ numError: false, num: valor });
                }
                break;






            default:
                console.log('no hay valores')
        }


    }

    submit(e){
        //e.preventDefault();

      

        console.log(e);
        console.log("HOLA");
    }

    async componentDidMount() {

        const productes = JSON.parse(localStorage.getItem("productesCart"));

        this.setState({ productes: productes });

        const resposta = await axios({
            method: 'post',
            url: 'https://aguilo.limit.es/api/auth/refresh',
            data: {
                token: localStorage.getItem("token"),
                session: { e: "645", i: "643" },

            },
            headers: { "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("token")}` }
        });

        const tokenRefresh = resposta.data;
        localStorage.setItem("resposta", tokenRefresh.token);




        const paisos = await axios.get(`https://aguilo.limit.es/api/ecom/paisos?page=0&size=100`, {
            headers: { "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("resposta")}` }
        })

        const paiss = paisos.data;

        const paisosNif = await axios.get(`https://aguilo.limit.es/api/ecom/paisosNif?page=0&size=100`, {
            headers: { "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("resposta")}` }
        })

        const paisNif = paisosNif.data;

        const tipusAdreces = await axios.get(`https://aguilo.limit.es/api/ecom/tipusAdreces?page=0&size=100`, {
            headers: { "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("resposta")}` }
        })

        const adreces = tipusAdreces.data;
        this.setState({ paisos: paiss._embedded.paises, paisosNif: paisNif._embedded.paisNifs, adreces: adreces._embedded.tipusAdresas });







    }

    render() {

        return (
            <div>
                <Header canviarLlenguatge={this.props.canviarLlenguatge} count={this.props.count} />
                <div className="container">
                    <div className="row">
                        <div className="col-md-9">


                            <div className="container">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="container cardsCart">
                                            <form class="needs-validation" novalidate>

                                                <h4 className="titolCart2">DADES DE L'USUARI</h4>


                                                <div className="row mt-4">
                                                    <div className="col-md-8">
                                                        <div className="form-group labelForm">
                                                            <label htmlFor="nomUsuari" className="labelForm">Nom Complet</label>
                                                            <input type="text" id="nomUsuari" className="form-control input" onChange={(e) => this.validacioForm(e.target.id, e.target.value)} />
                                                            {this.state.usuari === "error" &&
                                                                <div className="alert alert-danger mt-2" role="alert">
                                                                    <WarningRoundedIcon className="mr-1 mb-1" /> Aquest camp és obligatori.
                                                        </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group labelForm">
                                                            <label htmlFor="telf" className="labelForm">Telèfon</label>
                                                            <input type="tel" id="telf" className="form-control input" onChange={(e) => this.validacioForm(e.target.id, e.target.value)} />
                                                            {this.state.telf === "error" &&
                                                                <div className="alert alert-danger mt-2" role="alert">
                                                                    <WarningRoundedIcon className="mr-1 mb-1" /> Camp obligatori.
                                                        </div>
                                                            }
                                                            {this.state.telfError &&
                                                                <div className="alert alert-danger mt-2" role="alert">
                                                                    <WarningRoundedIcon className="mr-1 mb-1" /> Mínim 9 nums.
                                                        </div>
                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div className="form-group labelForm">
                                                            <label htmlFor="paisNif" className="labelForm">Pais DNI</label>
                                                            <select id="paisNif" className="form-control input">
                                                                <option selected disabled value="0">Tria una opció</option>
                                                                {this.state.paisosNif.map(function (pais, index) {


                                                                    return (
                                                                        <option value={pais.codi}>{pais.nom}</option>

                                                                    );



                                                                })}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group labelForm">
                                                            <label htmlFor="document" className="labelForm">Tipus de document</label>
                                                            <select id="document" className="form-control input" onChange={(e) => this.validacioForm(e.target.id, e.target.value)}>
                                                                <option selected disabled value="0">Tria una opció</option>
                                                                <option value="NIF">NIF</option>
                                                                <option value="NIF_operador">NIF OPERADOR INTERCOMUNITARI</option>
                                                                <option value="expedit_pais">DOCUMENT OFICIAL EXPEDIT PAIS</option>
                                                                <option value="passaport">PASSAPORT</option>
                                                                <option value="cert_residencia">CERTIFICAT RESIDENCIA FISCAL</option>
                                                                <option value="altres">ALTRE DOCUMENT</option>
                                                            </select>
                                                            {this.state.document === "error" &&
                                                                <div className="alert alert-danger mt-2" role="alert">
                                                                    <WarningRoundedIcon className="mr-1 mb-1" /> Camp obligatori.
                                                        </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group labelForm">
                                                            <label htmlFor="numDocument" className="labelForm">Nº Document</label>
                                                            <input type="text" id="numDocument" className="form-control input" onChange={(e) => this.validacioForm(e.target.id, e.target.value)} />
                                                            {this.state.numDocument === "error" &&
                                                                <div className="alert alert-danger mt-2" role="alert">
                                                                    <WarningRoundedIcon className="mr-1 mb-1" /> Camp obligatori.
                                                        </div>
                                                            }
                                                            {this.state.numDocumentError &&
                                                                <div className="alert alert-danger mt-2" role="alert">
                                                                    <WarningRoundedIcon className="mr-1 mb-1" /> Número document invàlid
                                                        </div>
                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group labelForm">
                                                            <label htmlFor="email" className="labelForm">E-mail</label>
                                                            <input type="email" id="email" className="form-control input" onChange={(e) => this.validacioForm(e.target.id, e.target.value)} />
                                                            {this.state.emailError &&
                                                                <div className="alert alert-danger mt-2" role="alert">
                                                                    <WarningRoundedIcon className="mr-1 mb-1" /> Camp obligatori.
                                                        </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group labelForm">
                                                            <label htmlFor="emailfactura" className="labelForm">E-mail factura</label>
                                                            <input type="email" id="emailfactura" className="form-control input" onChange={(e) => this.validacioForm(e.target.id, e.target.value)} />

                                                            {this.state.emailFacturaError &&
                                                                <div className="alert alert-danger mt-2" role="alert">
                                                                    <WarningRoundedIcon className="mr-1 mb-1" /> Camp obligatori.
                                                        </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>

                                                <h4 className="titolCart2 mt-5">DIRECCIÓ D'ENVIAMENT</h4>

                                                <div className="row mt-4">
                                                    <div className="col-md-4">
                                                        <div className="form-group labelForm">
                                                            <label htmlFor="pais" className="labelForm">Pais</label>
                                                            <select id="pais" className="form-control input" onChange={this.handleChange}>
                                                                <option selected disabled value="0">Tria una opció</option>
                                                                {this.state.paisos.map(function (paisos, index) {


                                                                    return (
                                                                        <option value={paisos.codi}>{paisos.nom}</option>

                                                                    );



                                                                })}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group labelForm">
                                                            <label htmlFor="prov" className="labelForm">Provincia</label>
                                                            <select id="prov" className="form-control input" onChange={this.handleOnChange}>
                                                                <option selected disabled value="0">Tria una opció</option>

                                                                {this.state.provincies.length > 0 &&

                                                                    this.state.provincies.map(function (prov, index) {

                                                                        return (
                                                                            <option value={prov.codi}>{prov.nom}</option>

                                                                        );


                                                                    })}

                                                                <option value="altres">Altres</option>


                                                            </select>

                                                        </div>
                                                    </div>
                                                    {!this.state.altresProv ?
                                                        <div className="col-md-4">
                                                            <div className="form-group labelForm">
                                                                <label htmlFor="poblacio" className="labelForm">Població</label>
                                                                <select id="poblacio" className="form-control input" onChange={this.canviarPoblacio}>
                                                                    <option selected disabled value="0">Tria una opció</option>

                                                                    {this.state.poblacions.length > 0 &&

                                                                        this.state.poblacions.map(function (pob, index) {

                                                                            return (
                                                                                <option value={pob.codi}>{pob.poblacioCodiTxt}</option>

                                                                            );


                                                                        })}

                                                                    <option value="altres">Altres</option>


                                                                </select>

                                                            </div>

                                                        </div>


                                                        :
                                                        <>

                                                            <div className="col-md-4">
                                                                <div className="form-group labelForm">
                                                                    <label htmlFor="nomProvincia" className="labelForm">Nom Provincia</label>
                                                                    <input type="text" id="nomProvincia" className="form-control input" onChange={(e) => this.validacioForm(e.target.id, e.target.value)} />
                                                                    {this.state.provError &&
                                                                        <div className="alert alert-danger mt-2" role="alert">
                                                                            <WarningRoundedIcon className="mr-1 mb-1" /> Camp obligatori.
                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group labelForm">
                                                                    <label htmlFor="nomPoblacio" className="labelForm">Nom Població</label>
                                                                    <input type="text" id="nomPoblacio" className="form-control input" onChange={(e) => this.validacioForm(e.target.id, e.target.value)} />
                                                                    {this.state.pobError &&
                                                                        <div className="alert alert-danger mt-2" role="alert">
                                                                            <WarningRoundedIcon className="mr-1 mb-1" /> Camp obligatori.
                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group labelForm">
                                                                    <label htmlFor="cp" className="labelForm">Codi Postal</label>
                                                                    <input type="text" id="cp" className="form-control input" onChange={(e) => this.validacioForm(e.target.id, e.target.value)} />
                                                                    {this.state.cpError &&
                                                                        <div className="alert alert-danger mt-2" role="alert">
                                                                            <WarningRoundedIcon className="mr-1 mb-1" /> Camp obligatori.
                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </>




                                                    }
                                                </div>
                                                {this.state.altresPob &&
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <div className="form-group labelForm">
                                                                <label htmlFor="nomPoblacio" className="labelForm">Nom Població</label>
                                                                <input type="text" id="nomPoblacio" className="form-control input" onChange={(e) => this.validacioForm(e.target.id, e.target.value)} />
                                                                {this.state.pobError &&
                                                                    <div className="alert alert-danger mt-2" role="alert">
                                                                        <WarningRoundedIcon className="mr-1 mb-1" /> Camp obligatori.
                                                        </div>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group labelForm">
                                                                <label htmlFor="cp" className="labelForm">Codi Postal</label>
                                                                <input type="text" id="cp" className="form-control input" onChange={(e) => this.validacioForm(e.target.id, e.target.value)} />

                                                                {this.state.cpError &&
                                                                    <div className="alert alert-danger mt-2" role="alert">
                                                                        <WarningRoundedIcon className="mr-1 mb-1" /> Camp obligatori.
                                                        </div>
                                                                }</div>
                                                        </div>
                                                    </div>
                                                }

                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div className="form-group labelForm">
                                                            <label htmlFor="tipoVia" className="labelForm">Tipo Via</label>
                                                            <select id="tipoVia" className="form-control input" onChange={(e) => this.validacioForm(e.target.id, e.target.value)} >

                                                                {this.state.adreces.map(function (tipus, index) {
                                                                    return (
                                                                        <option value={tipus.codi}>{tipus.descripcio}</option>
                                                                    );
                                                                })}

                                                            </select>
                                                            {this.state.tipoViaError &&
                                                                <div className="alert alert-danger mt-2" role="alert">
                                                                    <WarningRoundedIcon className="mr-1 mb-1" /> Camp obligatori.
                                                        </div>
                                                            }

                                                        </div>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <div className="form-group labelForm">
                                                            <label htmlFor="domicili" className="labelForm">Domicili</label>
                                                            <input type="text" id="domicili" className="form-control input" onChange={(e) => this.validacioForm(e.target.id, e.target.value)} />
                                                            {this.state.domiciliError &&
                                                                <div className="alert alert-danger mt-2" role="alert">
                                                                    <WarningRoundedIcon className="mr-1 mb-1" /> Camp obligatori.
                                                        </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-2">
                                                        <div className="form-group labelForm">
                                                            <label htmlFor="num" className="labelForm">Num</label>
                                                            <input type="text" id="num" className="form-control input" onChange={(e) => this.validacioForm(e.target.id, e.target.value)} />

                                                            {this.state.numError &&
                                                                <div className="alert alert-danger mt-2" role="alert">
                                                                    <WarningRoundedIcon className="mr-1 mb-1" /> Camp obligatori.
                                                        </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-2">
                                                        <div className="form-group labelForm">
                                                            <label htmlFor="escala" className="labelForm">Escala</label>
                                                            <input type="text" id="escala" className="form-control input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-2">
                                                        <div className="form-group labelForm">
                                                            <label htmlFor="porta" className="labelForm">Porta</label>
                                                            <input type="text" id="porta" className="form-control input" />
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-2">
                                                        <div className="form-group labelForm">
                                                            <label htmlFor="pis" className="labelForm">Pis</label>
                                                            <input type="text" id="pis" className="form-control input" />
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="row">
                                                    <div className="col-md-3 offset-md-9 ">
                                                        <button className="btn btn-primary mt-2 col" onClick={this.submit}>Següent</button>
                                                    </div>
                                                </div>
                                                </form>
                                           
                                        </div>




                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-3">
                            <div className="container resumCart">
                                <div className="container">
                                    <h5 className="titolResum"><strong><Traduccio string="carrito.total" /> : </strong></h5>
                                    <h5>({this.props.count} <Traduccio string="carrito.productes" /> )</h5>
                                    <h2 className="preuFitxa text-primary text-center">{this.props.total} €</h2>
                                    <div className="row">

                                        <a href="/carrito/pedido" className="btn btn-primary mt-3 col" ><Traduccio string="carrito.comprar" /></a>

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

export default withRouter(FormulariPedido);
