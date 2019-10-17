//Caso sua aplicação tenha varios reducers
// usar o combine reducers para combinar todos os reducers em apenas 1
import { combineReducers } from "redux";
import cart from "./cart/reducer";

export default combineReducers({
  cart
});
