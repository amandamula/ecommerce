import React, { Component } from 'react';

import './css/Llista.css';
import $ from 'jquery';
import Icon from '../components/Icon';
import Traduccio from '../components/Traduccio';


class List extends Component {

    constructor(props) {
        super(props);
        this.state = {
           icon : "up",
            
        }

        this.canviarIcon = this.canviarIcon.bind(this);
        
    }

    canviarIcon() {

       
        if(this.state.icon == "down"){
            this.setState({icon : "up"});
            $('#collapseExample').collapse('show');
          
            
        
        }else{
            this.setState({icon : "down"});
            $('#collapseExample').collapse('hide');
          
        
        }

      
    }

    

    render() {


        return (
            <div>

                <ul className="llistaGrup list-group">
                    <li className="llista list-group-item"><a className="linkLlista" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="collapseExample"><h5 className="llistaTitol" onClick={this.canviarIcon}>{this.props.tipus}<Icon id="iconoDown" icon={this.state.icon}/></h5></a></li>
                    <div className="collapse show" id="collapseExample">

                    {this.props.info.map(function (families, index) {
                                        return (
                                            <li className="llista list-group-item"><a href={"/familia/"+families.codi} className="linkLlista">{families.descripcio}</a></li>

                                        );
                                    })}

                        <li className="llista list-group-item"><a href="/" className="linkLlista"><Traduccio string="list.productos"/></a></li>

                    </div>
                </ul>

            </div>
        );


    }

}


export default List;