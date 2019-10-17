import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MdAddShoppingCart } from "react-icons/md";
import api from "../../services/api";
import { formatPrice } from "../../util/format";

import * as CartActions from "../../store/modules/cart/actions";

import { ProductList } from "./styles";
class Home extends Component {
  state = {
    products: []
  };

  //Fazendo a requisição a api
  async componentDidMount() {
    const response = await api.get("products");

    // tratando o dado price na requisiç~ao, formatando ele antes do render.
    // 00,00 para R$ 00,00
    const data = response.data.map(product => ({
      ...product,
      priceFormatted: formatPrice(product.price)
    }));

    this.setState({
      products: data
    });
  }
  handleAddProduct = id => {
    //dispatch = dispara uma action ao redux
    const { addToCartRequest } = this.props;
    addToCartRequest(id);
  };
  render() {
    const { products } = this.state;
    const { amount } = this.props;
    return (
      <ProductList>
        {products.map(product => (
          <li key={product.id}>
            <img src={product.image} alt={product.title} />
            <strong>{product.title}</strong>
            <span>{product.priceFormatted}</span>
            <button
              type="button"
              onClick={() => this.handleAddProduct(product.id)}
            >
              <div>
                <MdAddShoppingCart size={16} color={"#fff"} />{" "}
                {amount[product.id] || 0}
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        ))}
      </ProductList>
    );
  }
}

const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;
    return amount;
  }, {})
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
