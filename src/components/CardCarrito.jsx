import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Traduccio from '../components/Traduccio';
import './css/CardCarrito.css';
import img from '../imatges/img1.jpg';


class CardCarrito extends Component {

    constructor(props) {
        super(props);
        this.state = {
            preu: "",
        }
    }

    componentDidMount() {
        //const preu = this.props.preu.toFixed(2);
        //this.setState({ preu: preu });

    }

    render() {
        return (
            <div>
               
                <div className="card cardCarrito" >
                    <div className="row no-gutters">
                        <div className="col-md-3">
                            <img src={"https://aguilo-botiga.limit.es/api/ecomfront/image/show/" + this.props.imatge} className="card-img" alt={this.props.desc} />
                            </div>

                            <div className="col-md-9">
                                <div className="card-body">
                                    <h5 className="card-title">{this.props.titol}</h5>
                                    <p className="card-text"><small className="text-muted">{this.props.desc}</small></p>
                                </div>
                            </div>
                        </div>


                  

                </div>

            </div>
        );
    }
}

export default CardCarrito;