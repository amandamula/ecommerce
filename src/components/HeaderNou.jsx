import logo from "../imatges/logolaluna.png"
import ca from "../imatges/ca.png"
import en from "../imatges/reino-unido.png"
import es from "../imatges/es.png"

import React, { useState } from 'react';
import './css/Header.css'
import 'bootstrap/js/dist/dropdown.js';
import 'bootstrap/js/dist/collapse.js';
import 'popper.js/dist/popper.js';
import MenuIcon from '@material-ui/icons/Menu';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import Badge from '@material-ui/core/Badge';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import Traduccio from '../components/Traduccio';

const Img = () => {

    if (localStorage.getItem("idioma") === "es") {
        return (
            es
        )

    } else if (localStorage.getItem("idioma") === "ca") {
        return (
            ca
        )

    } else {
        return (
            en
        )
    }

};


function NouHeader(props) {


    const Loginiciat = true;



    const [idioma, setIdioma] = useState(Img);





    if (Loginiciat) {
        return (<div >
            <nav className="navbar navbar-expand-md" >
                <a href="/" > < img width="200px" className="navbar-brand logo" src={logo} alt="Logo"/></a >
                <button className="btn btn-outline-primary navbar-toggler custom-toggler text-center" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <MenuIcon />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent" >
                    <ul className="navbar-nav ml-auto">

                        <li className="nav-item">
                            <div className="dropdown">
                                <a className="nav-link link mr-4">
                                    <PersonOutlineIcon /> amula@limit.es
                                </a>

                            </div>
                        </li>
                        <li className="nav-item">
                            <div className="dropdown">
                                <button className="btn dropdown-toggle mr-4" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <img src={idioma} width="30px" className="bandera" alt="bandera" />
                                </button>
                                <div className="dropdown-menu " aria-labelledby="dropdownMenuButton">
                                    <a className="dropdown-item" id="en" onClick={() => props.canviarLlenguatge("en") + setIdioma(en)}> <img src={en} width="30px" className="bandera mr-2" alt="en"/><Traduccio string="header.idioma.ingles"/></a>
                                    <a className="dropdown-item" id="ca" onClick={() => props.canviarLlenguatge("ca") + setIdioma(ca)}>  <img src={ca} width="30px" className="bandera mr-2" alt="ca"/><Traduccio string="header.idioma.catalan"/></a>
                                    <a className="dropdown-item" id="ca" onClick={() => props.canviarLlenguatge("es") + setIdioma(es)}>  <img src={es} width="30px" className="bandera mr-2" alt="es"/><Traduccio string="header.idioma.español"/></a>

                                </div>
                            </div>

                        </li>
                        <li className="nav-item">
                            <a href="/carrito" className="nav-link link mr-4">
                                <Badge badgeContent={props.count} color="error" showZero>
                                    <ShoppingCartOutlinedIcon />
                                </Badge>
                            </a>


                        </li>






                    </ul>
                </div>
            </nav>
        </div>);
    }
    return (<div >
        <nav className="navbar navbar-expand-md  fixed-top" >
            <a href="/" > < img width="200px" className="navbar-brand" src={logo} alt="logo" /></a >
            <button className="navbar-toggler custom-toggler text-center" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <i class="fas fa-bars"></i>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent" >
                <ul className="navbar-nav ml-auto ">
                    <li className="nav-item">
                        <div className="dropdown">
                            <button className="btn dropdown-toggle btn-outline-primary mr-3 text-primary" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src={idioma} width="20px" className="bandera" />
                            </button>
                            <div className="dropdown-menu " aria-labelledby="dropdownMenuButton">
                                <a className="dropdown-item" id="en" onClick={() => props.canviarLlenguatge("en") + setIdioma(en)}> <img src={en} width="20px" className="bandera mr-2" alt="en" />Anglès</a>
                                <a className="dropdown-item" id="ca" onClick={() => props.canviarLlenguatge("ca") + setIdioma(ca)}>  <img src={ca} width="20px" className="bandera mr-2" alt="ca"/>Català</a>

                            </div>
                        </div>

                    </li>


                </ul>
            </div>
        </nav>
    </div>);

}


export default NouHeader;