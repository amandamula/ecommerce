import React, { Component } from "react";
import Header from "../components/HeaderNou";
import Traduccio from "../components/Traduccio";
import Footer from "../components/Footer";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";
import "../pages/css/iniciSessio.css";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import $ from "jquery";

class IniciSessio extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.mostarContrasenya = this.mostarContrasenya.bind(this);
    //this.handleOnClick = this.handleOnClick.bind(this);

    this.state = {
      usuari: "",
      password: "",
      mostrarPass: false,
    };
  }

  handleChange(name, value) {
    switch (name) {
      case "usuari":
        this.setState({ usuari: value });

        break;
      case "password":
        this.setState({ password: value });
        break;
      default:
        console.log("no hi ha valors");
    }
  }

  /*handleOnClick() {
    const { iniciaSessio } = this.props;

    iniciaSessio(this.state.usuari, this.state.password);
  }

  componentDidMount() {
    const { comprovarSessio } = this.props;

    comprovarSessio();
  }*/

  mostarContrasenya() {
    let x = document.getElementById("password");

    if (x.type === "password") {
      x.type = "text";

      this.setState({ mostrarPass: true });
    } else {
      x.type = "password";

      this.setState({ mostrarPass: false });
    }
  }

  render() {
    return (
      <div>
        <Header
          canviarLlenguatge={this.props.canviarLlenguatge}
          count={this.props.count}
          total={this.props.total}
          productes={this.props.productes}
        />
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-10 m-auto cardsCart margeContainer">
              <div className="container">
                <div className="row">
                  <div className="col-md-5">
                    <h4 className="titolInici text-primary mt-3">
                      <Traduccio string="inici.inici" />
                    </h4>
                    <div className="form-group mt-3">
                      <label htmlFor="usuari" className="label">
                        <Traduccio string="inici.email" />
                      </label>
                      <input
                        type="email"
                        name="usuari"
                        className="form-control input"
                        onChange={(e) =>
                          this.handleChange(e.target.name, e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password" className="label">
                        <Traduccio string="inici.contrasenya" />
                      </label>

                      <div className="input-group">
                        <input
                          type="password"
                          name="password"
                          className="form-control input inputBorder"
                          id="password"
                          onChange={(e) =>
                            this.handleChange(e.target.name, e.target.value)
                          }
                          required
                        />
                        <div className="input-group-prepend">
                          <div
                            className="input-group-text"
                            onClick={this.mostarContrasenya}
                          >
                            {" "}
                            {this.state.mostrarPass ? (
                              <VisibilityOffOutlinedIcon />
                            ) : (
                              <VisibilityOutlinedIcon />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {this.props.error && (
                      <div>
                        <p className="errorStyle">
                          <i className="fas fa-exclamation-triangle"></i>
                          <Traduccio string="inici.error" />
                        </p>
                      </div>
                    )}
                    <button className="btn btn-primary mt-2">
                      <Traduccio string="inici.inici" />
                    </button>
                  </div>
                  <div className="col-md-2">

                  </div>
                  <div className="col-md-5">
                    <h4 className="titolInici text-primary mt-3">
                      <Traduccio string="inici.registre" />
                    </h4>
                    <h6 className="desc">
                     
                      <Traduccio string="inici.text1" />
               
                    </h6>

                    <Link
                      to="/registro"
                      className="btn btn-outline-primary mt-3"
                    >
                      <Traduccio string="inici.registre" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default withRouter(IniciSessio);
