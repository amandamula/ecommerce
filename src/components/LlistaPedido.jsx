import React, { Component } from 'react';
import './css/LlistaPedido.css';
import axios from 'axios';


class LlistaPedido extends Component {

    constructor(props) {
        super(props);
        this.state = {
            codi: "",
            preu: "",
            titol: "",
            preuTotalProducte: "",
            quant: "",

        }


    }


    async componentDidMount() {


        const lang = localStorage.getItem("idioma");


        const id = this.props.id;

        const resp = await axios.get(`${process.env.REACT_APP_API_DOMAIN}/api/ecomfront/articles/detail/${id}?lang=${lang}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("resposta")}` }
        });

        const infoProd = resp.data;

        const preu = infoProd.preuAmbIva.toFixed(2);

        let titol = "";

        if (infoProd.descripcioCurta.length > 20) {
            titol = infoProd.descripcioCurta.substring(0, 20);
            titol = titol + "...";
        } else {
            titol = infoProd.descripcioCurta;
        }


        this.setState({ preu: preu, titol: titol, quant: this.props.quant, codi: infoProd.codi });
        const preuTotal = preu * this.state.quant;

        this.setState({ preuTotalProducte: preuTotal.toFixed(2) });


    }

    render() {


        return (
            <>
                <tr>
                    <td className="titolsLlista">
                        {this.state.titol}
                    </td>
                    <td>
                        {this.state.quant}
                    </td>
                    <td>
                        {this.state.preu} €
                    </td>

                </tr>




            </>
        );
    }
}

export default LlistaPedido;