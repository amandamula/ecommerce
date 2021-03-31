import React, {Component} from 'react';
import logo from '../imatges/logolaluna.png';
import 'bootstrap/js/src/dropdown.js';
import 'bootstrap/js/src/collapse.js';
import 'popper.js/dist/popper.js';


class Header extends Component {

    constructor(props){
        super();
    }

    render() {
      return (
        <div>
                <nav className="navbar navbar-expand-md navbar-primary fixed-top" >
                    <a href="/" > < img className="navbar-brand" src={logo} /></a >
                    <button className="navbar-toggler" >
                        <span class="navbar-toggler-icon" > </span> </button>
                    <div className="collapse navbar-collapse"
                        id="navbarSupportedContent" >
                        <ul className="navbar-nav ml-auto ">
                            <li className="nav-item" >
                                <a href="http://www.google.es/" className="btn btn-outline-primary nav-link mr-3" > Iniciar Sessió </a>
                            </li>
                        
                        </ul>
                    </div>
                </nav>
            
        </div>
      );
    }
}

export default Header;