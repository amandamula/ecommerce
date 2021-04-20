import React, { Component } from 'react';
import Traduccio from './Traduccio';
import './css/CardCarrito.css';

import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import axios from 'axios';


class CardCarrito extends Component {

    constructor(props) {
        super(props);
        this.state = {
            codi: "",
            familia: "",
            codiFam: "",
            preu: "",
            imatge: "",
            titol: "",
            desc: "",
            preuTotalProducte: "",
            quant: "",

        }

        this.handleChange = this.handleChange.bind(this);
        this.actualitzarCart = this.actualitzarCart.bind(this);
    }

    // Funció per anar agafant les quantitats dels productes, i actualitzanr l'array de productes de la cistella. 

    handleChange(codi, valor) {


        this.setState({ quant: valor });
        const preuNou = this.state.preu * valor;
        this.setState({ preuTotalProducte: preuNou.toFixed(2) })
        this.actualitzarCart(codi, valor);

   

        

    }

    //Funció per trobar un article dins el carreto per codi.

    trobarArticleCart(productes, id) {

        for (var i = 0; i < productes.length; i++) {
            if (productes[i]["codi"] === id) {
                return i;
            }
        }

        return -1;
    }

    // Funció per actualitzar el carreto quant la quantitat canvia.

    actualitzarCart(codi, quant) {

        if (localStorage.getItem("productesCart") !== null) {

            const productesCart = JSON.parse(localStorage.getItem("productesCart"));
            const trobat = this.trobarArticleCart(productesCart, codi);
        

            if (trobat >= 0) {
               
                productesCart[trobat]["unitats"] = quant;

            } else {
              
                productesCart.push({"codi" : codi , "unitats" : quant});

            }

            localStorage.setItem("productesCart", JSON.stringify(productesCart));
            this.props.contador();
            this.props.calcularTotal();
        
          


        }

    }


    async componentDidMount() {

        const lang = localStorage.getItem("idioma");

        

        const resp = await axios.get(`${process.env.REACT_APP_API_DOMAIN}/api/ecomfront/articles/detail/${this.props.id}?lang=${lang}`, {
            headers: { "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("resposta")}` }
        });

        const infoProd = resp.data;

        const preuTotal = infoProd.preuAmbIva * this.props.quant;

       
        const titol = infoProd.descripcioCurta;

        let desc = "";

        if(infoProd.descripcio.length >= 150){
            desc = infoProd.descripcio.substring(0,150);
            desc = desc + "...";
        }else{
             desc = infoProd.descripcio;

        }


        this.setState({ preu : infoProd.preuAmbIva.toFixed(2) ,preuTotalProducte: preuTotal.toFixed(2), titol : titol , desc : desc });


    }

    render() {


        return (
            <div>

                <div className="card cardCarrito" >
                    <div className="row">
                        <div className="col-md-4 col-lg-3 col-xl-3">
                            <a href={"producte/" + this.props.codi}>
                                <img src={process.env.REACT_APP_API_DOMAIN_IMAGE + "/" + this.props.imatge} className="img-fluid imatgeCart" alt={this.props.desc} />
                            </a>
                        </div>

                        <div className="col-md-5 col-lg-7 col-xl-7">
                            <div className="card-body informacioCart">
                                <a href={"producte/" + this.props.codi}>
                                    <h6 className="card-title titolCard">{this.state.titol}</h6>
                                </a>
                                <p className="card-text"><small className="text-muted">{this.state.desc}</small></p>
                                <h6>{this.state.preu} €</h6>
                                <div className="row mt-4">
                                    <label className="label col-5 col-md-6 col-lg-3"><Traduccio string="carrito.quant" /></label>
                                    <input type="number" min="1" className="form-control number col-3 col-md-3 col-lg-2" defaultValue={this.props.quant} onChange={(e) => this.handleChange(this.props.codi, parseInt(e.target.value))} />
                                    <div className="col">
                                        <button className="btn btn-outline-primary col-9 col-md-10 col-lg-7"  onClick={() => this.props.eliminar(this.props.codi)}><DeleteOutlineOutlinedIcon fontSize="small" className="mr-1 mb-1" /><Traduccio string="carrito.eliminar" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-lg-2">
                            <h4>{this.state.preuTotalProducte}€</h4>
                        </div>
                    </div>




                </div>

            </div>
        );
    }
}

export default CardCarrito;