import React, { Component } from 'react';

import './css/Llista.css';



class List extends Component {

    constructor(props) {
        super();

    }


    

    render() {


        return (
            <div>
            <h1 className="titolFamilia">{this.props.titol}</h1>
            </div>
        );


    }

}


export default List;