import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Traduccio from '../components/Traduccio';
import './css/Card.css';


class CardIndex extends Component {

    constructor(props) {
        super(props);
        this.state = {
            preu: "",
        }
    }

    componentDidMount() {
        const preu = this.props.preu.toFixed(2);
        this.setState({ preu: preu });

    }





    render() {
        return (
            <div>
                <div className="card cards" >
                    <header className="card_header">

                        <img src={"https://aguilo-botiga.limit.es/api/ecomfront/image/show/" + this.props.imatge} className="card-img-top h-100" />
                        <div className="card-img-overlay">
                            <a className="text-primary botoCart" onClick={() => this.props.afegirCistella(this.props.codi, 1)}><AddShoppingCartIcon /></a>

                        </div>

                    </header>
                    <div className="card-body">
                        <h6 className="card-title titol text-primary">{this.props.desc}</h6>
                        <div className="card-subtitle text-muted preu">
                            <p>{this.state.preu}€</p>

                        </div >

                        <p className="card__description"><a href={"/producte/" + this.props.codi} className="btn btn-primary"><Traduccio string="card.informacion" /></a></p>


                    </div>

                </div>
            </div>
        );
    }
}

export default CardIndex;