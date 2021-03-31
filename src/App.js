import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, useHistory, Redirect, withRouter } from "react-router-dom";
import Index from './pages/Index';
import Fitxa from './pages/Fitxa';
import './Custom.scss';
import IdiomaContext from './context/IdiomaContext';
import react, { Component } from 'react';
import Carrito from './pages/Carrito';


class App extends Component {

  constructor(props) {
    super(props);

    var count = 0;

    if (localStorage.getItem("count") !== null) {
      count = parseInt(localStorage.getItem("count"))

    }

    this.state = {
      iniciat: false,
      error: false,
      llenguatge: "",
      carritoCount: count,

    };


    this.afegirCistella = this.afegirCistella.bind(this);



    if (localStorage.getItem("idioma") === null) {

      const lang = window.navigator.language;
      if (lang.includes("es")) {
        this.state.llenguatge = "es";
      } else if (lang.includes("ca")) {
        this.state.llenguatge = "ca";
      } else {
        this.state.llenguatge = "en";
      }

      localStorage.setItem("idioma", this.state.llenguatge);
    } else {
      this.state.llenguatge = localStorage.getItem("idioma");

    }



  }


  canviarLlenguatge = (id) => {
    localStorage.setItem("idioma", id);
    this.setState({
      llenguatge: localStorage.getItem("idioma")
    });
  };

  trobarArticleCart(productes,id){

    for(var i = 0; i < productes.length; i++){
      if(productes[i][0] === id){
        return i;
      }
    }

    return -1;
  }

  afegirCistella(id, quant) {
   

    const count = this.state.carritoCount;

    const c = count + quant;

    this.setState({ carritoCount: c })
    localStorage.setItem("count", c);

    if(localStorage.getItem("productesCart") === null){
      const productes = [[id,quant]];
      localStorage.setItem("productesCart",JSON.stringify(productes));
    }else{

      const productesCart = JSON.parse(localStorage.getItem("productesCart"));
      const trobat = this.trobarArticleCart(productesCart,id);

      if(trobat >= 0){
        productesCart[trobat][1]+= quant;

      }else{
        productesCart.push([id,quant]);

      }

      localStorage.setItem("productesCart",JSON.stringify(productesCart));
    }


  }

  render() {
    return (
      <IdiomaContext.Provider value={this.state.llenguatge}>

        <Router>

          <div className="App">
            <Route exact path="/" render={() => <Index key={"Index-" + this.state.llenguatge} canviarLlenguatge={this.canviarLlenguatge} afegirCistella={this.afegirCistella} count={this.state.carritoCount} />} />
            <Route exact path="/familia/:codiFam" render={() => <Index key={"Index-" + this.state.llenguatge} canviarLlenguatge={this.canviarLlenguatge} afegirCistella={this.afegirCistella} count={this.state.carritoCount} />} />
            <Route path="/producte/:codi" render={() => <Fitxa key={"Fitxa-" + this.state.llenguatge} canviarLlenguatge={this.canviarLlenguatge} afegirCistella={this.afegirCistella}  count={this.state.carritoCount} />} />
            <Route path="/producte/:codi" render={() => <Fitxa key={"Fitxa-" + this.state.llenguatge} canviarLlenguatge={this.canviarLlenguatge} afegirCistella={this.afegirCistella}  count={this.state.carritoCount} />} />
            <Route path="/carrito" render={() => <Carrito key={"Carrito-" + this.state.llenguatge} canviarLlenguatge={this.canviarLlenguatge} afegirCistella={this.afegirCistella}  count={this.state.carritoCount} />} />



          </div>



        </Router>
      </IdiomaContext.Provider>

    );
  }
}

export default App;
