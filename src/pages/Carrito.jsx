import React, { Component } from "react";

import Traduccio from "../components/Traduccio";

import Header from "../components/HeaderNou";
import CardCarrito from "../components/CardCarrito";
import "./css/Carrito.css";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import { withRouter } from "react-router-dom";
import Footer from "../components/Footer";

class Carrito extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productes: [],
      total: 0,
      carregant :  true
    };
  }

  async componentDidMount() {
    const productes = JSON.parse(localStorage.getItem("productesCart"));

    this.setState({ productes: productes , carregant : false });
  }

  render() {
    const that = this;
    if (this.state.carregant) {
      return (
        <div>
          <Header
            canviarLlenguatge={this.props.canviarLlenguatge}
            count={this.props.count}
          />
      
          <div className="container margeCarregant">
          <div className="text-center text-primary mt-5">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
          </div>
        </div>
      );
    }

    if (this.state.productes !== null && localStorage.getItem("count") > 0) {
      return (
        <div>
          <Header
            canviarLlenguatge={this.props.canviarLlenguatge}
            count={this.props.count}
          />
          <div className="container">
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-9">
                <div className="container cardsCart">
                  <h4 className="titolCart">
                    <Traduccio string="carrito.carrito" />
                  </h4>

                  {this.state.productes.map(function (articles) {
                    return (
                      <div key={articles["codi"]} className="col-12">
                        <CardCarrito
                          codi={articles["codi"]}
                          quant={articles["unitats"]}
                          desc={articles["descripcioCurta"]}
                          descripcio={articles["descripcio"]}
                          preu={articles["preu"]}
                          imatge={articles["imatge"]}
                          id={articles["id"]}
                          contador={that.props.contador}
                          eliminar={that.props.eliminar}
                          calcularTotal={that.props.calcularTotal}
                        />
                      </div>
                    );
                  })}
                  <div className="row accionsCart">
                    <div className="mr-auto">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => this.props.eliminarTots()}
                      >
                        {" "}
                        <DeleteForeverOutlinedIcon
                          fontSize="small"
                          className="mr-1 mb-1"
                        />
                        <Traduccio string="carrito.vaciar" />
                      </button>
                    </div>
                    <div className="ml-auto">
                      <a href="/" className="btn btn-primary">
                        <Traduccio string="carrito.seguirComprant" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-12 col-lg-3">
                <div className="container resumCart">
                  <div className="container">
                    <h5 className="titolResum">
                      <strong>
                        <Traduccio string="carrito.total" /> :{" "}
                      </strong>
                    </h5>
                    <h5>
                      ({this.props.count}{" "}
                      <Traduccio string="carrito.productes" /> )
                    </h5>
                    <h2 className="preuFitxa text-primary text-center">
                      {this.props.total} €
                    </h2>
                    <div className="row">
                      <a href="/pedido" className="btn btn-primary mt-3 col">
                        <Traduccio string="carrito.comprar" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    } else {
      return (
        <div>
          <Header
            canviarLlenguatge={this.props.canviarLlenguatge}
            count={this.props.count}
          />
          <div className="marges">
            <div className="container cardsCart">
              <h4 className="titolCart">
                <Traduccio string="carrito.carrito" />
              </h4>

              <h6 className="titolCartBuid">
                {" "}
                <Traduccio string="carrito.cistellaBuida" />
              </h6>
              <a href="/" className="btn btn-primary mt-3 mb-5">
                {" "}
                <Traduccio string="carrito.veureArt" />
              </a>
            </div>
          </div>
          <Footer />
        </div>
      );
    }
  }
}

export default withRouter(Carrito);
