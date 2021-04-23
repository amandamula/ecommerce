import React, { Component } from "react";


class Spinner extends Component {


  render() {

    return (
      <div>
        <div className="container margeCarregant">
            <div className="text-center text-primary mt-5">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
      </div>
    );
  }
}

export default Spinner;