import React, { Component } from "react";
import { withRouter } from "react-router";
import Header from "../components/HeaderNou";
import Traduccio from "../components/Traduccio";
import Footer from "../components/Footer";

//9aaa3663f78bbc6b17e239267051e35a

class PagKO extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numPedido: "",
      urlko: false,
    };
  }

  componentDidMount() {
    const pressupost = JSON.parse(sessionStorage.getItem("pressupost"));

    if (pressupost !== null) {

      const pedido =  pressupost.codi
      this.setState({urlko: true , numPedido : pedido});
    } else {
      this.setState({urlko: false});
    }
  }

  render() {
    if (this.state.urlko) {
      return (

        <div>
        <Header
          canviarLlenguatge={this.props.canviarLlenguatge}
          count={this.props.count}
        />
        <div className="container cardsCart marges">
          <h6 className="titolCartBuid"> <strong><Traduccio string="urlko.error"/></strong></h6>
          <p className="mb-0 mt-4 mr-5 ml-5">
          <Traduccio string="urlko.problema"/> {this.state.numPedido}
          </p>
          <a href="/" className="btn btn-primary mt-3 mb-5">
            {" "}
            <Traduccio string="urlok.tornar"/>
          </a>
        </div>
        <Footer/>
      </div>
      );
    } else {
      return (
        <div>
        <Header
          canviarLlenguatge={this.props.canviarLlenguatge}
          count={this.props.count}
        />
        <div className="container cardsCart marges">
          <h6 className="titolCartBuid"> <Traduccio string="urlok.error"/></h6>
          <a href="/" className="btn btn-primary mt-3 mb-5">
            {" "}
            <Traduccio string="urlok.tornar"/>
          </a>
        </div>
        <Footer/>
      </div>
      );
    }
  }
}

export default withRouter(PagKO);
