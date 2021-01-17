export default (state = [], action) => {
    switch (action.type) {
        case 'SET_ORDERS':
            return action.orders;
        case 'ADD_ORDER':
            return state.concat(action.order)
        case 'UPDATE_ORDER':
            return state.map(m => m.id == action.order.id ? { ...m, ...action.order } : m)
        default:
            return state;
    }
};