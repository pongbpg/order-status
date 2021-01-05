// import db from '../firebase/firebase';
import { getProducts, getProductsById, createProduct, updateProduct } from '../api/products';
import _ from 'underscore';

export const startGetProducts = () => {
    return dispatch => {
        return getProducts()
            .then(row => {
                dispatch(setProducts(row.data))
            })
    }
}


export const setProducts = (products) => ({
    type: 'SET_PRODUCTS',
    products
});
