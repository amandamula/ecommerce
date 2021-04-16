import React, { Component } from "react";
import { withRouter } from "react-router";
import Header from "../components/HeaderNou";

//9aaa3663f78bbc6b17e239267051e35a

class Pag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numPedido: "",
      pagamentOK: false,
      email : "",
    };

    if (props.location.search === "") {
      this.state.pagamentOK = false;
    } 
  }

  componentDidMount() {

    const params = new URLSearchParams(this.props.location.search);
    const pedido = params.get("r");

    const pressupost = JSON.parse(sessionStorage.getItem("pressupost"));


    if(pressupost["codi"] == pedido){
      this.setState({pagamentOK: true});
    }else{
      this.setState({pagamentOK: false});
    }

    this.setState({ numPedido: pedido , email : pressupost["emailFactura"]});
  }
  render() {
    if (this.state.pagamentOK) {
      return (
        <div>
          <Header
            canviarLlenguatge={this.props.canviarLlenguatge}
            count={this.props.count}
          />
          <div className="container cardsCart">
            <h6 className="titolCartBuid">
              {" "}
              La compra s'ha realitzat correctament.
            </h6>
            <p className="mb-0 mt-4">
              El seu num de pedido és : {this.state.numPedido}
            </p>
            <p>
              Rebrà un correu de confirmació del pagament a : amula@limit.es{" "}
            </p>
            <a href="/" className="btn btn-primary mt-3 mb-5">
              {" "}
              Tornar
            </a>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Header
            canviarLlenguatge={this.props.canviarLlenguatge}
            count={this.props.count}
          />
          <div className="container cardsCart">
            <h6 className="titolCartBuid">
              {" "}
              S'ha produit un error. El pagament no s'ha efectuat.
            </h6>
            <a href="/" className="btn btn-primary mt-3 mb-5">
              {" "}
              Tornar
            </a>
          </div>
          </div>
        
      );
    }
  }
}

export default withRouter(Pag);
