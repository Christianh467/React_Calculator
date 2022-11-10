import React from 'react';

class Calculator_Button extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: this.props.value
        }
        
    }

    render(){
        return(
            <button className='col-3' onClick={() => this.props.onClick(this.state.value)}>{this.state.value}</button>
        )
    }
}

export default Calculator_Button;