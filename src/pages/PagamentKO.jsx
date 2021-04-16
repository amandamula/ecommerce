import React, { Component } from "react";
import { withRouter } from "react-router";
import Header from "../components/HeaderNou";

//9aaa3663f78bbc6b17e239267051e35a

class PagKO extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numPedido: "",
    };
  }

  /*componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const pedido = params.get("r");
    const total = params.get("i");
    const h = params.get("h");


    console.log(pedido);
    this.setState({numPedido : pedido});
    console.log(this.props.location.search);
  }*/

  render() {
    return (
      <div>
        <Header
          canviarLlenguatge={this.props.canviarLlenguatge}
          count={this.props.count}
        />
        <div className="container cardsCart">
          <h6 className="titolCartBuid">
            {" "}
            ERROR
          </h6>
          <p className="mb-0 mt-4">El seu num de pedido és : {this.state.numPedido}</p>
          <p>... </p>
          <a href="/" className="btn btn-primary mt-3 mb-5">
            {" "}
            Tornar
          </a>
        </div>
      </div>
    );
  }
}

export default withRouter(PagKO);
