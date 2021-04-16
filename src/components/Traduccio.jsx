import React, { Component } from "react";
import IdiomaContext from "../context/IdiomaContext";

import en from "../traduccions/en.json";
import ca from "../traduccions/ca.json";
import es from "../traduccions/es.json";

class Traduccio extends Component {
  idiomes = {
    en,
    ca,
    es,
  };

  render() {
    const { string } = this.props;

    return (
      <IdiomaContext.Consumer>
        {(value) => this.idiomes[value][string]}
      </IdiomaContext.Consumer>
    );
  }
}

window.Traduccio = Traduccio;

export default Traduccio;
