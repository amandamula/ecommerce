import React, { Component } from 'react';
import KeyboardArrowUpOutlinedIcon from '@material-ui/icons/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';





class Icon extends Component {

    constructor(props) {
        super();
    }

    render() {
        if (this.props.icon === "down") {
            return (
      
                    <KeyboardArrowDownOutlinedIcon />
               
            );

        } else {
            return (
               
                    <KeyboardArrowUpOutlinedIcon />
              
            );
        }

    }
}

export default Icon;