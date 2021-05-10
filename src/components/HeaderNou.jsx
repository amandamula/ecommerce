import logo from "../imatges/logolaluna.png";
import ca from "../imatges/ca.png";
import en from "../imatges/reino-unido.png";
import es from "../imatges/es.png";

import React, { useState } from "react";
import "./css/Header.css";
import "bootstrap/js/dist/dropdown.js";
import "bootstrap/js/dist/collapse.js";
import "popper.js/dist/popper.js";
import MenuIcon from "@material-ui/icons/Menu";
import Badge from "@material-ui/core/Badge";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import Traduccio from "../components/Traduccio";
import ResumCarrito from "../components/ResumCarrito";
import $ from "jquery";
import { Link } from "react-router-dom";

const Img = () => {
  if (localStorage.getItem("idioma") === "es") {
    return es;
  } else if (localStorage.getItem("idioma") === "ca") {
    return ca;
  } else {
    return en;
  }
};

function NouHeader(props) {
  const Loginiciat = false;

  const [idioma, setIdioma] = useState(Img);

  return (
    <div>
      <nav className="navbar navbar-expand-md">
        <a href="/">
          {" "}
          <img
            width="200px"
            className="navbar-brand logo"
            src={logo}
            alt="Logo"
          />
        </a>
        <button
          className="btn btn-outline-primary navbar-toggler custom-toggler text-center"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <MenuIcon />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <div className="dropdown">
                <button
                  className="btn botoDrop dropdown-toggle mr-1"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img
                    src={idioma}
                    width="30px"
                    className="bandera"
                    alt="bandera"
                  />
                </button>
                <div
                  className="dropdown-menu "
                  aria-labelledby="dropdownMenuButton"
                >
                  <a
                    className="dropdown-item"
                    id="en"
                    onClick={() =>
                      props.canviarLlenguatge("en") + setIdioma(en)
                    }
                  >
                    {" "}
                    <img
                      src={en}
                      width="30px"
                      className="bandera mr-2"
                      alt="en"
                    />
                    <Traduccio string="header.idioma.ingles" />
                  </a>
                  <a
                    className="dropdown-item"
                    id="ca"
                    onClick={() =>
                      props.canviarLlenguatge("ca") + setIdioma(ca)
                    }
                  >
                    {" "}
                    <img
                      src={ca}
                      width="30px"
                      className="bandera mr-2"
                      alt="ca"
                    />
                    <Traduccio string="header.idioma.catalan" />
                  </a>
                  <a
                    className="dropdown-item"
                    id="es"
                    onClick={() =>
                      props.canviarLlenguatge("es") + setIdioma(es)
                    }
                  >
                    {" "}
                    <img
                      src={es}
                      width="30px"
                      className="bandera mr-2"
                      alt="es"
                    />
                    <Traduccio string="header.idioma.español" />
                  </a>
                </div>
              </div>
            </li>
            {Loginiciat ? (
              <li className="nav-item mr-2">
                <Link to="/inicio-sesion" className="nav-link text-black correuSessio">
                  <AccountCircleOutlinedIcon size="Large"/>{" "}
                  amula@limit.es
                </Link>
              </li>
            ) : (
              <li className="nav-item mr-2">
                <Link to="/inicio-sesion" className="nav-link text-black">
                  <AccountCircleOutlinedIcon size="Large" />
                </Link>
              </li>
            )}

            <li className="nav-item">
              <a
                href="#"
                className="nav-link mr-3 swing"
                onClick={() => $("#mySidenav").css("width", "350px")}
              >
                <Badge badgeContent={props.count} color="error" showZero>
                  <ShoppingCartOutlinedIcon size="Large" />
                </Badge>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <ResumCarrito
        count={props.count}
        total={props.total}
        productes={props.productes}
      />
    </div>
  );
}

export default NouHeader;
