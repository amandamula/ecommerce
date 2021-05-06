import React, { Component } from "react";
import { Link } from "react-router-dom";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";

import "./css/CardNova.css";
import DoneOutlineOutlinedIcon from "@material-ui/icons/DoneOutlineOutlined";
import noFoto from "../imatges/no_foto.png";
import axios from "axios";


class CardIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preu: "",
      comprat: false,
      foto1: "",
      foto2: "",
    };
  }

  async componentDidMount() {
    const res = await axios.get(
      `${process.env.REACT_APP_API_DOMAIN}/api/ecom/articlesInformacio?query=article.codi==${this.props.codi}&page=0&size=100`,
      {
        headers: {
          Authorization: `${localStorage.getItem(
            "tokenType"
          )} ${localStorage.getItem("resposta")}`,
        },
      }
    );

    const info = res.data;

    if (info.page.totalElements == 1) {
      var foto = info._embedded.articleInformacios[0].rutaInforme;
      this.setState({ foto1: foto, foto2: foto });
    } else {
      var foto = info._embedded.articleInformacios[0].rutaInforme;
      var foto2 = info._embedded.articleInformacios[1].rutaInforme;
  
      this.setState({ foto1: foto, foto2: foto2 });
    }

    const preu = this.props.preu.toFixed(2);
    this.setState({ preu: preu });
  }

  canviarIcon() {
    this.setState({ comprat: true });
    setTimeout(() => this.setState({ comprat: false }), 500);
  }

  render() {
    return (
      <div>
        <div className="cardsNoves">
          <div className="card card1">
            <a href={"/producte/" + this.props.codi} className="linkCard streched-link">
              <div className="img-container">
                <img
                  src={
                    process.env.REACT_APP_API_DOMAIN_IMAGE +
                    "/" +
                    this.state.foto2
                  }
                  className="card-img-top h-100 img-main"
                  alt={this.props.desc}
                />
                <img
                  src={
                    process.env.REACT_APP_API_DOMAIN_IMAGE +
                    "/" +
                    this.state.foto1
                  }
                  className="card-img-top h-100 img-secondary"
                  alt={this.props.desc}
                />
              </div>

              <h6 className="titol text-primary titol1">{this.props.desc}</h6>
              <div className="text-muted descripcioFam">
                {this.props.familia}
              </div>
              <h6 className="preuCard">{this.state.preu}€ </h6>
            </a>
           
          </div>

          <a
            className="btn btn-outline-primary botoComprar mb-2"
            id={this.props.codi}
            onClick={() =>
              this.props.afegirCistella(
                this.props.codi,
                1,
                this.state.preu,
                this.props.decimalsPreuCataleg,
                this.props.decimalsPreuSenseIvaCataleg,
                this.props.descripcio,
                this.props.desc,
                this.props.id,
                this.props.imatge,
                this.props.ivaId,
                this.props.preuCataleg,
                this.props.preuSenseIvaCataleg,
                this.props.preuSenseIva
              ) + this.canviarIcon(this.props.codi)
            }
          >
            {this.state.comprat ? (
              <DoneOutlineOutlinedIcon />
            ) : (
              <AddShoppingCartIcon />
            )}
          </a>
        </div>
      </div>
    );
  }
}

export default CardIndex;
