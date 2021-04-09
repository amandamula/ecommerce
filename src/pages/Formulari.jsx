import React, { Component } from 'react';
import Traduccio from '../components/Traduccio';
import Header from '../components/HeaderNou';
import './css/Carrito.css';
import './css/FormulariPedido.css';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import $ from 'jquery';

import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import LlistaPedido from '../components/LlistaPedido'



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
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.canviarPoblacio = this.canviarPoblacio.bind(this);
        this.submit = this.submit.bind(this);
        this.canviarPattern = this.canviarPattern.bind(this);
        this.agafarValorsForm = this.agafarValorsForm.bind(this);


    }

    async handleChange(codi) {
        $("#prov").val('');
        this.setState({ altresPob: false, altresProv: false });




        const provincies = await axios.get(`https://aguilo.limit.es/api/ecom/provincies?query=pais.codi==${codi}&page=0&size=100`, {
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

    async handleOnChange(codi) {

        this.setState({ altresPob: false });
        const valorSeleccionat = codi;

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

    canviarPoblacio(codiPoblacio) {


        if (codiPoblacio === "altres") {
            this.setState({ altresPob: true });
        } else {
            this.setState({ altresPob: false });
        }

    }

    canviarPattern(valor) {
        if (valor === "NIF") {
            $("#numDocument").attr("pattern", "[0-9]{8}[A-Za-z]{1}");
        } else {
            $("#numDocument").attr("pattern", "^[A-HJ-NP-SUVW][0-9]{7}[0-9A-J]$");
        }
    }

    agafarValorsForm(id, valor) {
        this.setState({
            [id]: valor
        });

    }

    async submit() {



        var forms = document.getElementsByClassName('needs-validation');
        var validation = Array.prototype.filter.call(forms, (form) => {
            form.addEventListener('submit', (event) => {

                event.preventDefault();
                event.stopPropagation();

                if (form.checkValidity() === true) {

                    const pressupost = axios({
                        method: 'post',
                        url: 'https://aguilo.limit.es/api/ecom/pressupostos',
                        data: {
                            tipusNif: this.state.document,
                            nif: this.state.numdocument,
                            paisNif: this.state.paisosNif,
                            nomClient: this.state.nomUsuari,
                            tipusAdresa: this.state.tipoVia,
                            nomDomicili: this.state.domicili,
                            numeroDomicili: this.state.num,
                            pisDomicli: this.state.pis,
                            escalaDomicili: this.state.escala,
                            portaDomicili: this.state.porta,

                            telefon: this.state.telf,
                            pais: this.state.pais,
                            provincia: this.state.prov,
                            codiPostal: this.state.poblacio,
                            email: this.state.email,
                            emailFactura: this.state.emailFactura,



                        },
                        headers: { "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("token")}` }
                    }) 
                        .then((result) => {
                            //Reload the doggies to show also the new one
                            console.log(result);
                            this.setState({ pagament: false });
                          })
                          .catch((error) => {
                         
                      
                                this.setState({ pagament: true });
                      
                         
                          })
                    ;

             
                



                }
                form.classList.add('was-validated');
            }, false);
        });




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
        if (!this.state.pagament) {
            return (
                <div>
                    <Header canviarLlenguatge={this.props.canviarLlenguatge} count={this.props.count} />
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 col-lg-8">


                                <div className="container">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="container cardsCart">
                                                <form className="needs-validation" noValidate>

                                                    <h4 className="titolCart2">DADES DE L'USUARI</h4>


                                                    <div className="row mt-4">
                                                        <div className="col-md-8">
                                                            <div className="form-group labelForm">
                                                                <label htmlFor="nomUsuari" className="labelForm">Nom Complet</label>
                                                                <input type="text" id="nomUsuari" className="form-control input" required onChange={(e) => this.agafarValorsForm(e.target.id, e.target.value)} />
                                                                <div className="invalid-feedback">
                                                                    <WarningRoundedIcon fontSize="small" className="mb-1" /> Camp obligatori
                                                            </div>

                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group labelForm">
                                                                <label htmlFor="telf" className="labelForm">Telèfon</label>
                                                                <input type="tel" id="telf" className="form-control input" required pattern="[0-9]{9}" onChange={(e) => this.agafarValorsForm(e.target.id, e.target.value)} />

                                                                <div className="invalid-feedback">
                                                                    <WarningRoundedIcon fontSize="small" className="mb-1" /> Mínim 9 caracters.
                                                            </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <div className="form-group labelForm">
                                                                <label htmlFor="paisNif" className="labelForm">Pais DNI</label>
                                                                <select id="paisNif" className="custom-select input" required onChange={(e) => this.agafarValorsForm(e.target.id, e.target.value)}>
                                                                    <option selected disabled value="">Tria una opció</option>
                                                                    {this.state.paisosNif.map(function (pais, index) {


                                                                        return (
                                                                            <option key={pais.codi} value={pais.codi}>{pais.nom}</option>

                                                                        );



                                                                    })}
                                                                </select>
                                                                <div className="invalid-feedback">
                                                                    <WarningRoundedIcon fontSize="small" className="mb-1" /> Camp obligatori
                                                            </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group labelForm">
                                                                <label htmlFor="document" className="labelForm">Tipus de document</label>
                                                                <select id="document" className="custom-select input" required onChange={(e) => this.canviarPattern(e.target.value) + this.agafarValorsForm(e.target.id, e.target.value)} >
                                                                    <option selected disabled value="">Tria una opció</option>
                                                                    <option value="NIF">NIF</option>
                                                                    <option value="NIF_operador">NIF OPERADOR INTERCOMUNITARI</option>
                                                                    <option value="expedit_pais">DOCUMENT OFICIAL EXPEDIT PAIS</option>
                                                                    <option value="passaport">PASSAPORT</option>
                                                                    <option value="cert_residencia">CERTIFICAT RESIDENCIA FISCAL</option>
                                                                    <option value="altres">ALTRE DOCUMENT</option>
                                                                </select>
                                                                <div className="invalid-feedback">
                                                                    <WarningRoundedIcon fontSize="small" className="mb-1" /> Camp obligatori
                                                            </div>

                                                            </div>

                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group labelForm">
                                                                <label htmlFor="numDocument" className="labelForm" required>Nº Document</label>
                                                                <input type="text" id="numDocument" className="form-control input" pattern="[0-9]{8}[A-Za-z]{1}" required onChange={(e) => this.agafarValorsForm(e.target.id, e.target.value)} />

                                                                <div className="invalid-feedback">
                                                                    <WarningRoundedIcon fontSize="small" className="mb-1" /> Num document invàlid
                                                            </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="form-group labelForm">
                                                                <label htmlFor="email" className="labelForm">E-mail</label>
                                                                <input type="email" id="email" className="form-control input" required onChange={(e) => this.agafarValorsForm(e.target.id, e.target.value)} />
                                                                <div className="invalid-feedback">
                                                                    <WarningRoundedIcon fontSize="small" className="mb-1" /> Camp obligatori
                                                            </div>

                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group labelForm">
                                                                <label htmlFor="emailFactura" className="labelForm">E-mail Factura</label>
                                                                <input type="email" id="emailFactura" className="form-control input" required onChange={(e) => this.agafarValorsForm(e.target.id, e.target.value)} />
                                                                <div className="invalid-feedback">
                                                                    <WarningRoundedIcon fontSize="small" className="mb-1" /> Camp obligatori
                                                            </div>

                                                            </div>
                                                        </div>

                                                    </div>

                                                    <h4 className="titolCart2 mt-5">DIRECCIÓ D'ENVIAMENT</h4>

                                                    <div className="row mt-4">
                                                        <div className="col-md-4">
                                                            <div className="form-group labelForm">
                                                                <label htmlFor="pais" className="labelForm">Pais</label>
                                                                <select id="pais" className="custom-select input" onChange={(e) => this.agafarValorsForm(e.target.id, e.target.value) + this.handleChange(e.target.value)} required>
                                                                    <option selected disabled value="">Tria una opció</option>
                                                                    {this.state.paisos.map(function (paisos, index) {


                                                                        return (
                                                                            <option key={paisos.codi} value={paisos.codi}>{paisos.nom}</option>

                                                                        );



                                                                    })}
                                                                </select>
                                                                <div className="invalid-feedback">
                                                                    <WarningRoundedIcon fontSize="small" className="mb-1" /> Camp obligatori
                                                            </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group labelForm">
                                                                <label htmlFor="prov" className="labelForm">Provincia</label>
                                                                <select id="prov" className="custom-select input" onChange={(e) => this.handleOnChange(e.target.value) + this.agafarValorsForm(e.target.id, e.target.value)} required>
                                                                    <option selected disabled value="">Tria una opció</option>

                                                                    {this.state.provincies.length > 0 &&

                                                                        this.state.provincies.map(function (prov, index) {

                                                                            return (
                                                                                <option key={prov.codi} value={prov.codi}>{prov.nom}</option>

                                                                            );


                                                                        })}

                                                                    <option value="altres">Altres</option>


                                                                </select>
                                                                <div className="invalid-feedback">
                                                                    <WarningRoundedIcon fontSize="small" className="mb-1" /> Camp obligatori
                                                            </div>

                                                            </div>
                                                        </div>
                                                        {!this.state.altresProv ?
                                                            <div className="col-md-4">
                                                                <div className="form-group labelForm">
                                                                    <label htmlFor="poblacio" className="labelForm">Població</label>
                                                                    <select id="poblacio" className="custom-select  input" onChange={(e) => this.canviarPoblacio(e.target.value) + this.agafarValorsForm(e.target.id, e.target.value)} required>
                                                                        <option selected disabled value="">Tria una opció</option>

                                                                        {this.state.poblacions.length > 0 &&

                                                                            this.state.poblacions.map(function (pob, index) {

                                                                                return (
                                                                                    <option key={pob.codi} value={pob.codi}>{pob.poblacioCodiTxt}</option>

                                                                                );


                                                                            })}

                                                                        <option value="altres">Altres</option>


                                                                    </select>
                                                                    <div className="invalid-feedback">
                                                                        <WarningRoundedIcon fontSize="small" className="mb-1" /> Camp obligatori
                                                            </div>

                                                                </div>

                                                            </div>


                                                            :
                                                            <>

                                                                <div className="col-md-4">
                                                                    <div className="form-group labelForm">
                                                                        <label htmlFor="nomProvincia" className="labelForm">Nom Provincia</label>
                                                                        <input type="text" id="nomProvincia" className="form-control input" required onChange={(e) => this.agafarValorsForm(e.target.id, e.target.value)} />
                                                                        <div className="invalid-feedback">
                                                                            <WarningRoundedIcon fontSize="small" className="mb-1" /> Camp obligatori
                                                            </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group labelForm">
                                                                        <label htmlFor="nomPoblacio" className="labelForm">Nom Població</label>
                                                                        <input type="text" id="nomPoblacio" className="form-control input" required onChange={(e) => this.agafarValorsForm(e.target.id, e.target.value)} />
                                                                        <div className="invalid-feedback">
                                                                            <WarningRoundedIcon fontSize="small" className="mb-1" /> Camp obligatori
                                                            </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group labelForm">
                                                                        <label htmlFor="cp" className="labelForm">Codi Postal</label>
                                                                        <input type="text" id="cp" className="form-control input" required onChange={(e) => this.agafarValorsForm(e.target.id, e.target.value)} />
                                                                        <div className="invalid-feedback">
                                                                            <WarningRoundedIcon fontSize="small" className="mb-1" /> Camp obligatori
                                                            </div>
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
                                                                    <input type="text" id="nomPoblacio" className="form-control input" required onChange={(e) => this.agafarValorsForm(e.target.id, e.target.value)} />
                                                                    <div className="invalid-feedback">
                                                                        <WarningRoundedIcon fontSize="small" className="mb-1" /> Camp obligatori
                                                            </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group labelForm">
                                                                    <label htmlFor="cp" className="labelForm">Codi Postal</label>
                                                                    <input type="text" id="cp" className="form-control input" required onChange={(e) => this.agafarValorsForm(e.target.id, e.target.value)} />
                                                                    <div className="invalid-feedback">
                                                                        <WarningRoundedIcon fontSize="small" className="mb-1" /> Camp obligatori
                                                            </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }

                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <div className="form-group labelForm">
                                                                <label htmlFor="tipoVia" className="labelForm">Tipo Via</label>
                                                                <select id="tipoVia" className="custom-select input" required onChange={(e) => this.agafarValorsForm(e.target.id, e.target.value)} >

                                                                    <option selected disabled value="">Tria una opció</option>
                                                                    {this.state.adreces.map(function (tipus, index) {
                                                                        return (
                                                                            <option key={tipus.codi} value={tipus.codi}>{tipus.descripcio}</option>
                                                                        );
                                                                    })}

                                                                </select>
                                                                <div className="invalid-feedback">
                                                                    <WarningRoundedIcon fontSize="small" className="mb-1" /> Camp obligatori
                                                            </div>

                                                            </div>
                                                        </div>
                                                        <div className="col-md-8">
                                                            <div className="form-group labelForm">
                                                                <label htmlFor="domicili" className="labelForm">Domicili</label>
                                                                <input type="text" id="domicili" className="form-control input" required onChange={(e) => this.agafarValorsForm(e.target.id, e.target.value)} />
                                                                <div className="invalid-feedback">
                                                                    <WarningRoundedIcon fontSize="small" className="mb-1" /> Camp obligatori
                                                            </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6 col-md-2">
                                                            <div className="form-group labelForm">
                                                                <label htmlFor="num" className="labelForm">Num</label>
                                                                <input type="text" id="num" className="form-control input" required onChange={(e) => this.agafarValorsForm(e.target.id, e.target.value)} />

                                                                <div className="invalid-feedback">
                                                                    <WarningRoundedIcon fontSize="small" className="mb-1" /> Camp obligatori
                                                            </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6 col-md-2">
                                                            <div className="form-group labelForm">
                                                                <label htmlFor="escala" className="labelForm">Escala</label>
                                                                <input type="text" id="escala" className="form-control input" onChange={(e) => this.agafarValorsForm(e.target.id, e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="col-6 col-md-2">
                                                            <div className="form-group labelForm">
                                                                <label htmlFor="porta" className="labelForm">Porta</label>
                                                                <input type="text" id="porta" className="form-control input" onChange={(e) => this.agafarValorsForm(e.target.id, e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="col-6 col-md-2">
                                                            <div className="form-group labelForm">
                                                                <label htmlFor="pis" className="labelForm">Pis</label>
                                                                <input type="text" id="pis" className="form-control input" onChange={(e) => this.agafarValorsForm(e.target.id, e.target.value)} />
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-3 offset-md-9 ">
                                                            <button onClick={this.submit} className="btn btn-primary mt-2 col" >Següent</button>
                                                        </div>
                                                    </div>
                                                </form>

                                            </div>




                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-4">
                                <div className="container resum">
                                    <div className="container">
                                        <h5 className="titolCart2">DADES PEDIDO</h5>

                                        <div className="row mt-4">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th className="th">Artícles</th>
                                                        <th className="th">Unit.</th>
                                                        <th className="th">Preu</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.productes.map(function (articles, index) {


                                                        return (

                                                            <LlistaPedido codi={articles[0]} quant={articles[1]} />


                                                        );

                                                    })}
                                                    <tr>
                                                        <td className="titolsLlista">
                                                            Gastos de envio
                                                    </td>
                                                        <td>
                                                            1
                                                    </td>
                                                        <td>
                                                            0.00 €
                                                     </td>

                                                    </tr>
                                                    <tr>
                                                        <th className="titolTotal">TOTAL </th>

                                                        <th colspan="2" className="preuTotal">{this.props.total} €</th>

                                                    </tr>


                                                </tbody>
                                            </table>
                                            <a href="/carrito" className="btn btn-outline-primary ml-auto"> Modificar pedido</a>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            );
        } else {
            return(
            <div>
                <Header canviarLlenguatge={this.props.canviarLlenguatge} count={this.props.count} />
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-lg-8">


                            <div className="container">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="container cardsCart">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-4">
                            <div className="container resum">
                                <div className="container">
                                    <h5 className="titolCart2">DADES PEDIDO</h5>

                                    <div className="row mt-4">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th className="th">Artícles</th>
                                                    <th className="th">Unit.</th>
                                                    <th className="th">Preu</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.productes.map(function (articles, index) {


                                                    return (

                                                        <LlistaPedido codi={articles[0]} quant={articles[1]} />


                                                    );

                                                })}
                                                <tr>
                                                    <td className="titolsLlista">
                                                        Gastos de envio
                                                    </td>
                                                    <td>
                                                        1
                                                    </td>
                                                    <td>
                                                        0.00 €
                                                     </td>

                                                </tr>
                                                <tr>
                                                    <th className="titolTotal">TOTAL </th>

                                                    <th colspan="2" className="preuTotal">{this.props.total} €</th>

                                                </tr>


                                            </tbody>
                                        </table>
                                        <a href="/carrito" className="btn btn-outline-primary ml-auto"> Modificar pedido</a>
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
}

export default withRouter(FormulariPedido);
