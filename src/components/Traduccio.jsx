import React, { Component } from "react";
import IdiomaContext from '../context/IdiomaContext';

import en from "../traduccions/en.json";
import ca from "../traduccions/ca.json";
import es from "../traduccions/es.json";

class Traduccio extends Component {
  
  constructor(props) {
    super(props);

   
    this.state = {
      idiomes: {
        en,
        ca,
        es
      }
    };
  }


  render() {
      const {idiomes} = this.state 
      const {string} = this.props
    return (
      <IdiomaContext.Consumer>
        {value => idiomes[value][string]}
      </IdiomaContext.Consumer>
    );
  }

}

export default Traduccio;