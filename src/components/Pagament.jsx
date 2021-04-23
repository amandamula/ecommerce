
import React, { Component } from "react";
import sha512 from 'js-sha512';
import './css/Pagament.css';
import axios from 'axios';


//327234688-001

class Pag extends Component {
  constructor(props) {
    super(props);
    this.state = {
        code : `${process.env.REACT_APP_MERCHANT_CODE}`,
        terminal : `${process.env.REACT_APP_MERCHANT_TERMINAL}`,
        operation : "1",
        password : `${process.env.REACT_APP_MERCHANT_PASSWORD}`,
        signature : "",
        currency: "EUR",
        productDesc: "Pago",
        secure : "1",
        urlOk : window.location.protocol +'//' + window.location.host + "/urlok",
        urlKo : window.location.protocol +'//' + window.location.host + "/urlko",
        src : "" ,


    };
  }


  async componentDidMount(){

    const productes = JSON.parse(localStorage.getItem("productesCart"));
    const lang = localStorage.getItem("idioma");
    let preuTotal= 0;
    

    for(var x = 0 ; x < productes.length ; x++){

      const resp = await axios.get(`${process.env.REACT_APP_API_DOMAIN}/api/ecomfront/articles/detail/${productes[x]["id"]}?lang=${lang}`, {
            headers: { "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("resposta")}` }
        });

       const articles = resp.data;

       const preuUnitat = (articles.preuAmbIva * productes[x]["unitats"]);
        preuTotal = preuTotal + preuUnitat;

    }
    


    const totalAmount = preuTotal * 10 * 10;
 
    const sig  = sha512(this.state.code + this.state.terminal + this.state.operation + this.props.order + totalAmount + this.state.currency + this.state.password);
   
    this.setState({src : `https://api.paycomet.com/gateway/ifr-bankstore?MERCHANT_MERCHANTCODE=${this.state.code}&MERCHANT_TERMINAL=${this.state.terminal}&OPERATION=${this.state.operation}&LANGUAGE=${lang}&MERCHANT_MERCHANTSIGNATURE=${sig}&MERCHANT_ORDER=${this.props.order}&MERCHANT_AMOUNT=${totalAmount}&MERCHANT_CURRENCY=${this.state.currency}&MERCHANT_PRODUCTDESCRIPTION=${this.state.productDesc}&3DSECURE=${this.state.secure}&URLOK=${this.state.urlOk}&URLKO=${this.state.urlKo}` })



  }

  render() {


    return (
      <div>
        <iframe
          title="titulo"
          src={this.state.src}
          width="500"
          height="360"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          scrolling="no"
          style={{border: "0px solid #000000", padding: "0px", margin: "0px"}}
        
        ></iframe>
      </div>
    );
  }
}

export default Pag;
