import React, { Component } from "react";
import { Link, withRouter, NavLink } from "react-router-dom";
import "./css/Llista.css";
import $ from "jquery";
import Traduccio from "../components/Traduccio";
import KeyboardArrowDownOutlinedIcon from "@material-ui/icons/KeyboardArrowDownOutlined";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: "up",
    };

    this.canviarIcon = this.canviarIcon.bind(this);
  }

  canviarIcon() {

    if (this.state.icon === "down") {
      this.setState({ icon: "up" });
      $(`#${this.props.codi}Example`).collapse("show");
    } else {
      this.setState({ icon: "down" });
      $(`#${this.props.codi}Example`).collapse("hide");
    }
  }

  render() {
    const arrowStyle = {
      transition: "transform 0.5s",
      transform: this.state.icon === "up" ? "rotate(180deg)" : "",
    };
    const that = this;
    return (
      <div>
        <ul className="llistaGrup list-group">
          <li className="llista list-group-item">
            <a
              className="linkLlista"
              data-toggle="collapse"
              role="button"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              <h5 className="llistaTitol" onClick={this.canviarIcon}>
                {this.props.tipus}
                <KeyboardArrowDownOutlinedIcon style={arrowStyle} />
              </h5>
            </a>
          </li>

          <div className="collapse show" id={this.props.codi+"Example"}>
            {this.props.info.map(function (families) {
              return (
                <li key={families.codi} className="llista list-group-item">
                  <NavLink
                    to={`/${that.props.codi}/` + families.codi}
                    className="linkLlista"
                    activeStyle={{
                      fontWeight: "bold",
                   
                    }}
                    onClick={() =>
                      that.props.filtrar(
                        families.codi,
                        that.props.codi,
                        "descripcioCurta",
                        "ASC"
                      )
                    }
                  >
                    {families.descripcio}
                  </NavLink>
                </li>
              );
            })}

            <li className="llista list-group-item">
              <NavLink
                to="/familia/tots"
                className="linkLlista"
                activeStyle={{
                  fontWeight: "bold",
                 
               
                }}
                onClick={() =>
                  that.props.filtrar("tots", "descripcioCurta", "ASC")
                }
              >
                <Traduccio string="list.productos" />
              </NavLink>
            </li>
          </div>
        </ul>
      </div>
    );
  }
}

export default withRouter(List);
