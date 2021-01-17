import db from '../db/firebase';
import { FaSnapchat } from 'react-icons/fa';
export const startAddOrder = (order) => {
    return dispatch => {
        return db.collection('orderx').add(order)
        // .then(doc => {
        //     dispatch(ADD_ORDER({ ...order, id: doc.id }))
        // })
    }
}
export const ADD_ORDER = (order) => ({
    type: 'ADD_ORDER',
    order
});

export const startListOrder = () => {
    return dispatch => {
        return db.collection('orderx').orderBy('created', 'desc').limit(100)
            .onSnapshot(snapShot => {
                let data = [];
                snapShot.forEach(doc => {
                    data.push({ id: doc.id, ...doc.data() })
                })
                dispatch(SET_ORDERS(data))
            })
    }
}
export const SET_ORDERS = (orders) => ({
    type: 'SET_ORDERS',
    orders
});

export const startCopyOrder = (orderid) => {
    return dispatch => {
        return db.collection('orderx').doc(orderid).update({ selected: true })
    }
}

export const startResetOrder = (orderid) => {
    return dispatch => {
        return db.collection('orderx').doc(orderid).update({ selected: false })
    }
}
export const startRemoveOrder = (orderid) => {
    return dispatch => {
        return db.collection('orderx').doc(orderid).delete()
    }
}