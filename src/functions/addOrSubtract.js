/*ADD OR SUBTRACT*/
const addOrSubtract = function(num1, operator, num2){                                 //ADDS OR SUBTRACTS ARGUMENTS DEPENDING ON OPERATOR GIVEN
    if(operator === '+'){
      return  parseFloat(num1, 10) + parseFloat(num2, 10);
    }
    if(operator === '-'){
      return num1 - num2;
    }
  }
  /*END OF ADD OR SUBTRACT*/

  export default addOrSubtract;