import React, { Component } from 'react';
import './button.css';

class Button extends Component {
    render () {
        return (
            <button className="button" autoFocus>
                {this.props.children}
            </button>
        )
    }
}

export default Button