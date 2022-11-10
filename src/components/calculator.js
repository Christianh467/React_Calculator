import React from 'react';
import multiplyOrDivide from '../functions/multiplyOrDivide';
import addOrSubtract from '../functions/addOrSubtract';
import '../styles/calculator.css';

const numberTest = new RegExp('[0-9.]'); 
const operatorTest = new RegExp('[-+/x]');    

class Calculator extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      currentValue: [],
      currentEquation: [],
      lastTotal: false,
      error: false
    }
    this.handleEnteredValue = this.handleEnteredValue.bind(this);
    this.addToCurrentEquation = this.addToCurrentEquation.bind(this);
    this.searchEquationForOperations = this.searchEquationForOperations.bind(this);
    this.resetCalculator = this.resetCalculator.bind(this);
  }

  /*THE DISPLAYS LOGIC*/
  handleEnteredValue(enteredValue){
    const previousValue = [...this.state.currentValue];                                    //Initialize previousValue as an array 
      /*IF VALUE IS A NUMBER [0-9.]*/                                                  /*IF VALUE IS A NUMBER...*/
      if(numberTest.test(enteredValue)){     
        if(this.state.currentValue.length > 16 || this.state.currentEquation.length > 30){ //If character limit is reached...
          return this.setState({error: true})                                                  //Return ERROR for too many characters
        }
        else if(this.state.lastTotal === true){                                            //If the currentValue is our lastTotal and we entered a number
          this.resetCalculator();                                                              //Reset the calculator and handle this number
          return this.setState({currentEquation: [enteredValue], currentValue: [enteredValue], lastTotal: false})
        }         
        else if(enteredValue === '.' && previousValue.indexOf('.') !== -1){                //If enteredValue is a '.' && if currentValue already contains a '.'
          return null;
          /*return this.setState({error: true})*/                                              //throw an error for having 2 decimals in a number
        }                                                                                  
        else if(this.state.currentValue.concat(0).join('').match('^00') !== null){         //If enteredValue is a zero && if adding it would make currentValue a number that starts with multiple zeroes
          return null;
          /*return this.setState({error: true})*/                                              //throw an error for starting a number with multiple zeroes    
        }                                           
        else if(operatorTest.test(previousValue)){                                         //If previousValue was an operator...                                                                                     //Set this current value to currentValue
          this.setState({currentValue: [enteredValue]})                                        //Set currentValue to equal this value
        }
        else{                                                                              //OTHERWISE...
          this.setState({currentValue: this.state.currentValue.concat(enteredValue)})          //Concat this number to our currentValue number
        }
        this.addToCurrentEquation(enteredValue);                                           //LASTLY...concat this number to currentEquation
      }
      
      /*IF VALUE IS AN OPERATOR [-+/x]....*/                                           /*IF VALUE IS AN OPERATOR AND NOT A NUMBER*/           
      else if(operatorTest.test(enteredValue)){                           
        const lengthOfCurrentEquation = this.state.currentEquation.length;
        const lonelyOperatorTest = new RegExp('[-+/x]$');   
        const multipleMinusesTest = new RegExp('---');
        
        this.setState({                                                                                //ALWAYS set currentValue to this enteredValue
          currentValue: [enteredValue]
        })
  
        if(lonelyOperatorTest.test(previousValue) && enteredValue !== '-'){                            //If the previous value was also an operator(excluding '-')...
          return this.state.currentEquation.splice(lengthOfCurrentEquation - 1, 1, enteredValue)           //replace the previous value in our equation with this one
        }                                                                               
        if(enteredValue === '-' && multipleMinusesTest.test(this.state.currentEquation.concat('-').join(''))){
          return this.setState({error: true});                                                         //If enteredValue is a '-' && if adding it would cause 3 sequential minuses in currentValue, throw an error
        }
        else{                                                                                          //OTHERWISE...add this value to currentEquation
          this.addToCurrentEquation(enteredValue);                                 
        }
      }
      this.setState({lastTotal: false})    //LASTLY...regardless of what was entered, now that there is an entry we are no longer dealing with a previousTotal                                                                          
  }
  /*END OF THE DISPLAYS LOGIC*/


  /*ADD VALUE TO CURRENT EQUATION*/
addToCurrentEquation(value){                          //Concat value to currentEauation           
  this.setState({
    currentEquation: this.state.currentEquation.concat(value)
  })}
  /*END OF ADDING VALUES TO EQUATION*/


/*LOOK FOR OPERATIONS WITHIN EQUATION*/  
searchEquationForOperations(){                             //FOLLOWS PEMDAS AND DOES OPERATIONS AS NECESSARY UNTIL THERE ARE NO MORE OPERATIONS LEFT TO DO
  let equation = this.state.currentEquation.join('');   

  const multiplyAndDivideTest = new RegExp('(-?[0-9.]+)([-+/x]*[x/])(-*[0-9.]+)');   //regex used to look for divide or mulitply operations within equation
  const addAndSubtractTest = new RegExp   ('(-?[0-9.]+)([-+/x]*[-+])(-*[0-9.]+)');   //regex used to look for add or subtract operations within equation
  while(multiplyAndDivideTest.test(equation)){             //While this equation has * or / operations available to complete...
    let currentSolve = equation.match(multiplyAndDivideTest);  //Finds the first subsection within our equation that satisfies our multiplyAndDivideTest regex: (num)(* or /)(num)
    equation = equation.replace(currentSolve[0], () => multiplyOrDivide(currentSolve[1], currentSolve[2].charAt(currentSolve[2].length - 1), currentSolve[3])); //Solves this subsection and replace the subsection entirely with its answer:
  }                                                                                                                                                             // 9+12x4/2 === 9 + (48) / 2 === 9 + (24)
  while(addAndSubtractTest.test(equation)){                //Then, while the equation has + or - operations available to complete...
    let currentSolve = equation.match(addAndSubtractTest);     //Same as above except with addition and subtraction now
    equation = equation.replace(currentSolve[0], () => addOrSubtract(currentSolve[1], currentSolve[2].charAt(currentSolve[2].length - 1), currentSolve[3]));    
  }                                                                                                                                                            // 9 + 24 = 33 ...This would leave us with the answer: 33                       
  
  this.setState({                                          //Now that our equation is down to just a single answer, make it equal to currentValue, lastTotal, and currentEquation
    currentValue: [equation],
    lastTotal: true,
    currentEquation: [equation]
  })
}
/*END OF LOOKING FOR OPERATIONS TO SOLVE*/


/*RESET CALCULATOR*/
resetCalculator(){                                         //RESETS CALCULATOR DISPLAY, BUT NOT lastTotal
    this.setState({
      currentValue: [],
      currentEquation: []
    })
}
/*END OF RESET CALCULATOR*/


componentDidUpdate(){                                                //CHECKS EVERY UPDATE TO SEE IF CALC SHOULD TEMPORARILY DISPLAY 'ERROR'
  const equation = this.state.currentEquation;
  const value = this.state.currentValue;
  if(this.state.error){                                                  //IF ERROR IS SET TO TRUE...DISPLAY 'ERROR'...THEN RETURN TO ORIGINAL DISPLAY AFTER 1 SECOND
    this.setState({currentEquation: 'ERROR', currentValue: 'ERROR', error: false})
    setTimeout(() => this.setState({currentEquation: [equation], currentValue: [value]}), 1000)
  }
}

  render(){
    return (
      <div className="calculator">
        <div className='calculator-display'>
          <p id='display' className='display-text smaller-display'>{this.state.currentEquation.length ? this.state.currentEquation : 0}</p> {/*If there is a currentEquation...display it*/}
          <p className='display-text larger-display-text'>{this.state.currentValue.length ? this.state.currentValue : 0}</p>      {/*If there is a currentValue...display it...or 0*/}
        </div>
        <div className='calculator-bottom'>
          <div className='button-grid'>
            <div className='row normal-row'>
              <button id='clear' className='col-6' onClick={() => this.resetCalculator()}>AC</button>
              <button id='divide' className='col-3' onClick={() => this.handleEnteredValue('/')}>/</button>
              <button id='multiply' className='col-3' onClick={() => this.handleEnteredValue('x')}>x</button>
            </div>
            <div className='row normal-row'>
              <button id='seven' className='col-3' onClick={() => this.handleEnteredValue('7')}>7</button>
              <button id='eight' className='col-3' onClick={() => this.handleEnteredValue('8')}>8</button>
              <button id='nine' className='col-3' onClick={() => this.handleEnteredValue('9')}>9</button>
              <button id='subtract' className='col-3' onClick={() => this.handleEnteredValue('-')}>-</button>
            </div>
            <div className='row normal-row'>
              <button id='four' className='col-3' onClick={() => this.handleEnteredValue('4')}>4</button>
              <button id='five' className='col-3' onClick={() => this.handleEnteredValue('5')}>5</button>
              <button id='six' className='col-3' onClick={() => this.handleEnteredValue('6')}>6</button>
              <button id='add' className='col-3' onClick={() => this.handleEnteredValue('+')}>+</button>
            </div>
            <div className='row double-row'>                        
              <div className='col-9 p-0'>
                <div className='row bg-secondary h-50'>
                  <button id='one' className='col-4' onClick={() => this.handleEnteredValue('1')}>1</button>
                  <button id='two' className='col-4' onClick={() => this.handleEnteredValue('2')}>2</button>
                  <button id='three' className='col-4' onClick={() => this.handleEnteredValue('3')}>3</button>
                </div>
                <div className='row normal-row h-50'>
                  <button id='zero' className='col-8' onClick={() => this.handleEnteredValue('0')}>0</button>
                  <button id='decimal' className='col-4' onClick={() => this.handleEnteredValue('.')}>.</button>
                </div>
              </div>
              <button id='equals' className='col-3' onClick={() => this.searchEquationForOperations()}>=</button> {/*IF THERE'S NO CURRENTEQUATION, MAKE = BUTTON BRING BACK PREVIOUS ANSWER*/}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Calculator;
