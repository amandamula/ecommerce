import React, { Component } from "react";
import { Link } from "react-router-dom";

import $ from "jquery";
import Traduccio from "../components/Traduccio";
import Card from "../components/Card";
import CardNova from "../components/CardNova";

class ContainerCards extends Component {
  constructor(props) {
    super(props);

  }


  render() {
    const that = this;
    return (
      <div>
        
          <div className="row d-flex">
            {this.props.productes.map(function (articles) {
              return (
                <div
                  key={articles.id}
                  className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3"
                >
                  <CardNova
                    decimalsPreuCataleg={articles.decimalsPreu}
                    decimalsPreuSenseIvaCataleg={articles.decimalsPreuIva}
                    descripcio={articles.descripcio}
                    desc={articles.descripcioCurta}
                    id={articles.id}
                    imatge={articles.rutaInforme}
                    ivaId={articles.iva.id}
                    preu={articles.preuAmbIva}
                    preuCataleg={articles.fixedPreuAmbIva}
                    preuSenseIvaCataleg={articles.fixedPvp}
                    preuSenseIva={articles.pvp}
                    codi={articles.codi}
                    afegirCistella={that.props.afegirCistella}
                    familia={articles.familia.description}
                  />
                </div>
              );
            })}
          </div>
        </div>

    );
  }
}

export default ContainerCards;
