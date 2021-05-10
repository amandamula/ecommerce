import React, { Component } from "react";
import "./css/Pagament.css";
import $ from "jquery";

class Paginacio extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  comprovarBotons() {
    if (this.props.paginaActual === 1) {
      $("#prev").addClass("disabled");
    } else {
      $("#prev").removeClass("disabled");
    }

    if (this.props.paginaActual === this.props.totalPagines) {
      $("#next").addClass("disabled");
    } else {
      $("#next").removeClass("disabled");
    }
  }

  componentDidMount() {
    this.comprovarBotons();
  }

  render() {
    let pag = [];

    for (let i = 1; i <= this.props.totalPagines; i++) {
      if (this.props.paginaActual == i) {
        pag.push(
          <li className="page-item active" key={i}>
            {" "}
            <button
              className="page-link"
              onClick={() => this.props.paginacio(i - 1)}
            >
              {" "}
              {i}
            </button>{" "}
          </li>
        );
      } else {
        pag.push(
          <li className="page-item" key={i}>
            {" "}
            <button
              className="page-link"
              onClick={() => this.props.paginacio(i - 1)}
            >
              {" "}
              {i}
            </button>{" "}
          </li>
        );
      }
    }

   this.comprovarBotons();

    return (
      <div>
        <nav aria-label="Page navigation example mr-auto">
          <ul className="pagination">
            <li id="prev" className="page-item">
              <button
                className="page-link"
                aria-label="Previous"
                onClick={() => this.props.pagNext("prev")}
              >
                <span aria-hidden="true">&laquo;</span>
                <span className="sr-only">Previous</span>
              </button>
            </li>
            {pag}

            <li id="next" className="page-item">
              <button
                className="page-link "
                onClick={() => this.props.pagNext("next")}
                aria-label="Next"
              >
                <span aria-hidden="true">&raquo;</span>
                <span className="sr-only">Next</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Paginacio;
