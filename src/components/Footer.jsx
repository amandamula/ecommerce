import React, { Component } from "react";
import "../components/css/Footer.css";


class Footer extends Component {
  render() {
    return (
      <div className="main-footer">
        <div className="container">
          <p className="textFooter text-center">
          
            <strong>Embutidos Aguiló S.L. </strong>
            Avinguda d´Astúries, nº 4A 07100 Sóller, Mallorca. {""}
      <br/>
           <a href="tel:+34971630168" className="text-white">Tel. 971 63 01 68</a> {" "}
            <a
              className="text-white textFooter"
              href="http://www.la-luna.es/contact/"
            >
              la-luna.es
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export default Footer;
