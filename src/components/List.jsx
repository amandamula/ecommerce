import React, { Component } from "react";

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
      $("#collapseExample").collapse("show");
    } else {
      this.setState({ icon: "down" });
      $("#collapseExample").collapse("hide");
    }
  }

  render() {
    const arrowStyle = {
      transition: "transform 0.5s",
      transform: this.state.icon === "up" ? "rotate(180deg)" : "",
    };

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

          <div className="collapse show" id="collapseExample">
            {this.props.info.map(function (families) {
              return (
                <li key={families.codi} className="llista list-group-item">
                  <a href={"/familia/" + families.codi} className="linkLlista">
                    {families.descripcio}
                  </a>
                </li>
              );
            })}

            <li className="llista list-group-item">
              <a href="/" className="linkLlista">
                <Traduccio string="list.productos" />
              </a>
            </li>
          </div>
        </ul>
      </div>
    );
  }
}

export default List;
