import React, { Component } from "react";
import { Link, withRouter, NavLink } from "react-router-dom";
import "./css/ResumCarrito.css";
import $ from "jquery";
import Traduccio from "../components/Traduccio";
import CloseIcon from "@material-ui/icons/Close";
import noFoto from "../imatges/no_foto.png";
import Spinner from "../components/Spinner";

class ResumCarrito extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buit: false,
      total: 0.0,
      carregant: false,
    };
  }

  componentDidMount() {

    if (this.props.productes !== undefined) {
      this.setState({ buit: false });
    } else {
      this.setState({ buit: true });
    }
  }

  render() {
    const arrowStyle = {
      transition: "transform 0.5s",
      transform: this.state.icon === "up" ? "rotate(180deg)" : "",
    };
    const that = this;

    return (
      <div>
        <div className="container">
          <div id="mySidenav" className="sidenav">
            <div className="submenu">
              <div className="cart-side-header">
                <div>
                  <Traduccio string="carrito.carrito" />
                </div>
                <button
                  type="button"
                  className="close"
                  aria-label="Close"
                  onClick={() => $("#mySidenav").css("width", "0")}
                >
                  <CloseIcon fontSize="small" />
                </button>
              </div>

              <ul className="llistaResum">
                {this.props.productes !== undefined ? (
                  this.props.productes.map(function (articles) {
                    return (
                      <li key={articles.codi}>
                        <div className="card cardResum">
                          <div className="row">
                            <div className="col-5">
                              {articles.imatge === undefined ? (
                                <img
                                  src={noFoto}
                                  className="img"
                                  style={{ width: "120px" }}
                                />
                              ) : (
                                <img
                                  src={
                                    process.env.REACT_APP_API_DOMAIN_IMAGE +
                                    "/" +
                                    articles.imatge
                                  }
                                  className="img imgResum"
                                  style={{ width: "120px" }}
                                />
                              )}
                            </div>

                            <div className="col-7 mb-2">
                              <div className="card-body infoResum">
                                <h6 className="nomProducte">
                                  {articles.descripcioCurta}
                                </h6>
                                <h6 className="unitats">
                                  <Traduccio string="carrito.quant" />{" "}
                                  {articles.unitats}
                                </h6>
                                <h6>
                                  <strong>{articles.preu} €</strong>
                                </h6>
                              </div>
                            </div>
                          </div>
                          <a
                            href={"/producte/" + articles.codi}
                            className="stretched-link"
                          ></a>
                        </div>
                      </li>
                    );
                  })
                ) 
                 : (
                  <li>
                    <div className="container margeTitol">
                      <h6 className="titolCartBuid ">
                        {" "}
                        <Traduccio string="carrito.cistellaBuida" />
                      </h6>
                      <a href="/" className="btn btn-primary mt-3 mb-5">
                        {" "}
                        <Traduccio string="carrito.veureArt" />
                      </a>
                    </div>{" "}
                  </li>
                )}
              </ul>
              <div className="totalResum">
                <div className="row">
                  <div className="col-6">
                    <h6 className="unitats">
                      {" "}
                      <Traduccio string="carrito.unitats" />{" "}
                    </h6>
                    <h6 className="tot">
                      {" "}
                      <Traduccio string="carrito.total" />
                    </h6>
                  </div>
                  <div className="col-6">
                    <h6 className="numUnitats"> {this.props.count} </h6>
                    <h6 className="num">
                      {" "}
                      {this.props.total === undefined
                        ? this.state.total
                        : this.props.total}{" "}
                      €
                    </h6>
                  </div>
                </div>

                <div className="col-11">
                  <Link to="/carrito">
                    <button className="col btn btn-primary mt-1">
                      {" "}
                      <Traduccio string="carrito.anar" />
                    </button>{" "}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResumCarrito;
