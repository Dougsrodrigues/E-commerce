// junta todos os sagas em um so

import { all } from "redux-saga/effects";

import cart from "./cart/sagas";

export default function* rootSaga() {
  return yield all([cart]);
}
