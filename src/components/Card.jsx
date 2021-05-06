import React, { Component } from "react";
import { Link } from "react-router-dom";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Traduccio from "../components/Traduccio";
import "./css/Card.css";
import DoneOutlineOutlinedIcon from "@material-ui/icons/DoneOutlineOutlined";
import noFoto from "../imatges/no_foto.png";

class CardIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preu: "",
      comprat: false,
    };
  }

  componentDidMount() {
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
        <div className="card cards">
          <header className="card_header">
            <Link to={"/producte/" + this.props.id}>
              {this.props.imatge === undefined ? (
                <img
                  src={noFoto}
                  className="card-img-top h-100"
                  alt={this.props.desc}
                />
              ) : (
                <img
                  src={
                    process.env.REACT_APP_API_DOMAIN_IMAGE +
                    "/" +
                    this.props.imatge
                  }
                  className="card-img-top h-100"
                  alt={this.props.desc}
                />
              )}
            </Link>
          </header>
          <div className="card-body">
            <h6 className="card-title titol text-primary">{this.props.desc}</h6>
            <div className="card-subtitle text-muted preu">
              {this.state.preu}€{" "}
            </div>

            <div className="card__description">
              <div className="row">
                <div className="col-9">
                  <a
                    href={"/producte/" + this.props.codi}//thisprops.id
                    className="btn btn-outline-primary"
                  >
                    <Traduccio string="card.informacion" />
                  </a>
                </div>
                <div className="col-2">
                  <a
                    className="btn btn-outline-primary boto"
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CardIndex;
