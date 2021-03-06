
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Index from './pages/Index';
import Fitxa from './pages/Fitxa';
import './Custom.scss';
import IdiomaContext from './context/IdiomaContext';
import { Component } from 'react';
import Carrito from './pages/Carrito';
import Formulari from './pages/Formulari';
import PagamentOK from './pages/PagamentOK';
import PagamentKO from './pages/PagamentKO';
import FormulariRegistre from './pages/FormulariRegistre';



class App extends Component {

  constructor(props) {
    super(props);

    var count = 0;
    var totalCarrito = 0;

    if (localStorage.getItem("count") !== null) {
      count = parseInt(localStorage.getItem("count"))

    }

    if (localStorage.getItem("total") !== null) {
      totalCarrito = localStorage.getItem("total");

    }

    this.state = {
      iniciat: false,
      error: false,
      llenguatge: "",
      carritoCount: count,
      total : totalCarrito,
    

    };


    this.afegirCistella = this.afegirCistella.bind(this);
    this.actualizarContador = this.actualizarContador.bind(this);
    this.borrarProducte = this.borrarProducte.bind(this);
    this.borrarTot = this.borrarTot.bind(this);
    this.calcularTotal = this.calcularTotal.bind(this);

    //Agafam l'idioma per defecte del navegador, sempre el localStorage sigui buit.

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


  //Funció per canviar l'idioma.
  canviarLlenguatge = (id) => {
    localStorage.setItem("idioma", id);
    this.setState({
      llenguatge: localStorage.getItem("idioma")
    });
  };

  //Funció per trobar un article dins l'array del carretó.
  trobarArticleCart(productes, id) {

    for (var i = 0; i < productes.length; i++) {
      if (productes[i]["codi"] === id) {
        return i;
      }
    }

    return -1;
  }

  // Funció per contar la quantitat total d'articles dins la cistella.
  contarArticles() {
    const productes = JSON.parse(localStorage.getItem("productesCart"));
    let count = 0;
    for (var i = 0; i < productes.length; i++) {
      count = count + productes[i]["unitats"];

    }

    return count;
  }

  // Afegir un producte dins la cistella.
  afegirCistella(id, quant, preu, decimalsPreu, decimalsPreuSenseIva, descripcio, desc, codi,imatge, ivaId, preuCataleg, preuSenseIvaCataleg, preuSenseIva ) {


    if (localStorage.getItem("productesCart") === null) {
      const productes = [{"codi" : id, "unitats" : quant, "preu" : preu, "decimalsPreuCataleg" : decimalsPreu, "decimalsPreuSenseIva" : decimalsPreuSenseIva , "descripcio": descripcio,"descripcioCurta" : desc , "id" : codi , "imatge" : imatge , "ivaId" : ivaId, "preuCataleg" : preuCataleg , "preuSenseIvaCataleg" : preuSenseIvaCataleg, "preuSenseIva" : preuSenseIva}];
      localStorage.setItem("productesCart", JSON.stringify(productes));
    } else {

      const productesCart = JSON.parse(localStorage.getItem("productesCart"));
      const trobat = this.trobarArticleCart(productesCart, id);

      if (trobat >= 0) {
        productesCart[trobat]["unitats"] += quant;

      } else {
        productesCart.push({"codi" : id, "unitats" : quant, "preu" : preu, "decimalsPreuCataleg" : decimalsPreu, "decimalsPreuSenseIva" : decimalsPreuSenseIva , "descripcio": descripcio,"descripcioCurta" : desc , "id" : codi , "imatge" : imatge , "ivaId" : ivaId, "preuCataleg" : preuCataleg , "preuSenseIvaCataleg" : preuSenseIvaCataleg, "preuSenseIva" : preuSenseIva});

      }

      localStorage.setItem("productesCart", JSON.stringify(productesCart));
   
    }

    const contador = this.contarArticles();
    this.setState({ carritoCount: contador })
    localStorage.setItem("count", contador);
    this.calcularTotal();


  }

  // Funció per actualitzar el contador del total darticles de dins la cistella.

  actualizarContador() {
    const contador = this.contarArticles();
    this.setState({ carritoCount: contador })
    localStorage.setItem("count", contador);
  }


  // Funció per borrar un article seleccionat de dins l'array de la cistella.

  borrarProducte(codi) {
    const productesCart = JSON.parse(localStorage.getItem("productesCart"));
    const trobat = this.trobarArticleCart(productesCart, codi);


    if (trobat >= 0) {

      productesCart.splice(trobat, 1);

    }

    localStorage.setItem("productesCart", JSON.stringify(productesCart));
    const contador = this.contarArticles();
    this.setState({ carritoCount: contador })
    localStorage.setItem("count", contador);
    this.calcularTotal();
    window.location.reload();


  }

  //Funció per eliminar tots els productes de la cistella

  borrarTot() {
    localStorage.removeItem("productesCart");
    localStorage.removeItem("count");
    window.location.reload();
  }

  //Funció per calcular el total
  calcularTotal(){

 
    const productes = JSON.parse(localStorage.getItem("productesCart"));
    let total = 0;
    for (var i = 0; i < productes.length; i++) {
      total = total + (productes[i]["preu"] * productes[i]["unitats"]);

    }

    localStorage.setItem("total",total.toFixed(2));
    this.setState({total : total.toFixed(2)});
    return total;

}


  

  render() {
    return (
      <IdiomaContext.Provider value={this.state.llenguatge}>

        <Router>

          <div className="App">
            <Route exact path="/" render={() => <Index key={"Index-" + this.state.llenguatge} canviarLlenguatge={this.canviarLlenguatge} afegirCistella={this.afegirCistella} count={this.state.carritoCount} />} />
            <Route exact path="/familia/:codiFam" render={() => <Index key={"Index-" + this.state.llenguatge} canviarLlenguatge={this.canviarLlenguatge} afegirCistella={this.afegirCistella} count={this.state.carritoCount} />} />
            <Route path="/producte/:codi" render={() => <Fitxa key={"Fitxa-" + this.state.llenguatge} canviarLlenguatge={this.canviarLlenguatge} afegirCistella={this.afegirCistella} count={this.state.carritoCount} />} />
            <Route exact path="/carrito" render={() => <Carrito key={"Carrito-" + this.state.llenguatge} canviarLlenguatge={this.canviarLlenguatge} afegirCistella={this.afegirCistella} contador={this.actualizarContador} eliminar={this.borrarProducte} eliminarTots={this.borrarTot} calcularTotal={this.calcularTotal} count={this.state.carritoCount} total={this.state.total} />} />
            <Route exact path="/pedido" render={() => <Formulari key={"Formulari-" + this.state.llenguatge} canviarLlenguatge={this.canviarLlenguatge} afegirCistella={this.afegirCistella} contador={this.actualizarContador} eliminar={this.borrarProducte} eliminarTots={this.borrarTot} calcularTotal={this.calcularTotal} count={this.state.carritoCount} total={this.state.total} />} />
            <Route exact path="/pedido/:pagament" render={() => <Formulari key={"Formulari-" + this.state.llenguatge} canviarLlenguatge={this.canviarLlenguatge} afegirCistella={this.afegirCistella} contador={this.actualizarContador} eliminar={this.borrarProducte} eliminarTots={this.borrarTot} calcularTotal={this.calcularTotal} count={this.state.carritoCount} total={this.state.total} />} />
            <Route exact path="/urlok" render={() => <PagamentOK key={"PagamentOk-" + this.state.llenguatge} canviarLlenguatge={this.canviarLlenguatge} afegirCistella={this.afegirCistella} contador={this.actualizarContador} eliminar={this.borrarProducte} eliminarTots={this.borrarTot} calcularTotal={this.calcularTotal} count={this.state.carritoCount} total={this.state.total} />} />
            <Route exact path="/urlko" render={() => <PagamentKO key={"PagamentKo-" + this.state.llenguatge} canviarLlenguatge={this.canviarLlenguatge} afegirCistella={this.afegirCistella} contador={this.actualizarContador} eliminar={this.borrarProducte} eliminarTots={this.borrarTot} calcularTotal={this.calcularTotal} count={this.state.carritoCount} total={this.state.total} />} />
            <Route exact path="/registre" render={() => <FormulariRegistre key={"Registre-" + this.state.llenguatge} canviarLlenguatge={this.canviarLlenguatge}  contador={this.actualizarContador} calcularTotal={this.calcularTotal} count={this.state.carritoCount} total={this.state.total} />} />

          </div>



        </Router>
      </IdiomaContext.Provider>

    );
  }
}

export default App;
