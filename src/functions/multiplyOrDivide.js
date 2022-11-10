/*MULTIPLY OR DIVIDE*/ 
const multiplyOrDivide = function(num1, operator, num2){                              //MULTIPLIES OR DIVIDES DEPENDING ON OPERATOR GIVEN
    if(operator === 'x'){
      return num1 * num2;
    }
    if(operator === '/'){
      return num1 / num2;
    } 
  }
  /*END OF MULTIPLY*/

export default multiplyOrDivide;