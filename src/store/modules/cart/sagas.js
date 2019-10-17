import { call, put, all, takeLatest, select } from "redux-saga/effects";
import { toast } from "react-toastify";
import api from "../../../services/api";
import history from "../../../services/history";
import { formatPrice } from "../../../util/format";
import { addToCartSuccess, updateAmountSuccess } from "./actions";
// * funcionalidade generator do js
// é tipo um async so que mais potente que o async/await
// yield é como se fosse o await
// put dispara uma action no saga
// all cadastra listenrs
// takeLatest elimina missclicks, se ele n terminou a chamda a api, ele n vai fazer nda
// select busca informações dentro do estado
function* addToCart({ id }) {
  const productExists = yield select(state =>
    state.cart.find(p => p.id === id)
  );

  const stock = yield call(api.get, `/stock/${id}`);
  const stockAmount = stock.data.amount;
  const currentAmount = productExists ? productExists.amount : 0;
  const amount = currentAmount + 1;

  if (amount > stockAmount) {
    toast.error("Quantidade solicitada fora de estoque");
    return;
  }

  if (productExists) {
    yield put(updateAmountSuccess(id, amount));
  } else {
    const response = yield call(api.get, `/products/${id}`);

    const data = {
      ...response.data,
      amount: 1,
      priceFormatted: formatPrice(response.data.price)
    };
    yield put(addToCartSuccess(data));

    //Faz o redirecionamento somente depois da req a api
    history.push("/cart");
  }
}

function* updateAmount({ id, amount }) {
  if (amount <= 0) return;

  const stock = yield call(api.get, `stock/${id}`);
  const stockAmount = stock.data.amount;

  if (amount > stockAmount) {
    toast.error("Quantidade solicitada fora de estoque");
    return;
  }

  yield put(updateAmountSuccess(id, amount));
}
//qual ação queremos ouvir e qual action disparar
export default all([
  takeLatest("@cart/ADD_REQUEST", addToCart),
  takeLatest("@cart/UPDATE_AMOUNT_REQUEST", updateAmount)
]);
