import db, { storage } from '../db/firebase';
import { nanoid } from 'nanoid'
export const startAddOrder = (order, pictures) => {
    return dispatch => {
        let filenames = [];
        Promise.all([
            pictures.map(p => {
                // console.log('p', p)
                const name = p.name.split('.');
                const typefile = name[name.length - 1];
                const url = nanoid();
                const filename = url + '.' + typefile;
                // console.log('filename', filename)
                filenames.push({ filename, bucket: process.env.FIREBASE_STORAGE_BUCKET })
                return new Promise((resolve, reject) => {
                    // console.log('aaa')
                    storage.ref('uploads').child(filename).put(p)
                        .then(file => resolve(file))
                })
            }),
            //  new Promise((resolve, reject) => {
            //     console.log('bbb')
            //     setTimeout(resolve('delay' + pictures.length * 2000), pictures.length * 2000)
            // })
        ]).then(values => {
            // console.log('ccc')
            // console.log(values)
            setTimeout(() => db.collection('orderx').add({ ...order, filenames, selected: false }), pictures.length * 2000)
        })

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
        return db.collection('orderx').orderBy('created', 'desc')//.limit(100)
            .onSnapshot(snapShot => {
                let data = [];
                snapShot.forEach(doc => {
                    // const filenames = doc.get('filenames') || [];
                    // filenames.map(m=>({...m,url:storage.ref('uploads').child}))
                    data.push({
                        id: doc.id,
                        ...doc.data(),
                        // filenames: 
                    })
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
export const startCancelOrder = (orderid) => {
    return dispatch => {
        return db.collection('orderx').doc(orderid).update({ canceled: true })
    }
}
export const startRemoveOrder = (orderid) => {
    return dispatch => {
        return db.collection('orderx').doc(orderid).get()
            .then(doc => {
                const filenames = doc.get('filenames') || [];
                filenames.map(f => {
                    storage.ref('uploads').child(f.filename).delete()
                })
                return db.collection('orderx').doc(orderid).delete()
            })
    }
}