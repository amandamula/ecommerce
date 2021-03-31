import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Traduccio from '../components/Traduccio';
import axios from 'axios';

import Header from '../components/HeaderNou';
import CardCarrito from '../components/CardCarrito';
import './css/Carrito.css'



class Carrito extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productes: [],
            imatge: "",
            preu: "",
            quant: "",
            titol: "",
            desc: "",
            info: [],
            infoProducte: []
        }

        this.mostrarDetallsProducte = this.mostrarDetallsProducte.bind(this);
    }

    componentDidMount() {


        const productes = JSON.parse(localStorage.getItem("productesCart"));
        this.setState({ productes: productes });


    }


    async mostrarDetallsProducte(codi) {

        const lang = localStorage.getItem("idioma");


        const res = await axios.get(`https://aguilo.limit.es/api/ecom/articlesInformacio?query=article.codi==${codi}&page=0&size=100&lang=${lang}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("resposta")}` }
        });

        const info = res.data;

        const id = info._embedded.articleInformacios[0].article.id;

        const resp = await axios.get(`https://aguilo.limit.es/api/ecomfront/articles/detail/${id}?lang=${lang}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("resposta")}` }
        });

        const infoProd = resp.data;

        const preu = infoProd.preuAmbIva.toFixed(2);


        this.setState({ info: info._embedded.articleInformacios, infoProducte: infoProd, preu: preu });

    }


    render() {
        if (this.state.productes.length >= 0) {
            return (
                <div>
                    <Header canviarLlenguatge={this.props.canviarLlenguatge} count={this.props.count} />

                    <div className="container cardsCart">
                        <h4 className="titolCart">CARRITO {this.state.productes}</h4>

                        {this.state.productes.map(function (articles, index) {
                            
                            const artic = articles.map(function (art){
                                return (
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3">
    
                                        <h6>{articles[0][0]} </h6>
                                    </div>
    
                                );

                            });

                            })}
                       </div>

                </div>
            );

        } else {


            return (
                <div>
                    <Header canviarLlenguatge={this.props.canviarLlenguatge} count={this.props.count} />
                    <h6> CAP PRODUCTE</h6>
                </div>
            );
        }
    }
}

export default Carrito;