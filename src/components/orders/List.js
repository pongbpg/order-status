import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import { startListOrder, startCopyOrder, startResetOrder, startRemoveOrder } from '../../actions/orders';
import moment from 'moment';
import Money from '../../selectors/money'
import _ from 'underscore'
moment.locale('th');
export class ListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: 'all',
            orders: props.orders
        }
        this.props.startListOrder()
    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.orders) != JSON.stringify(this.state.orders)) {
            this.setState({ orders: nextProps.orders });
        }
    }
    onCopy = (id) => {
        console.log('orderid', id)
        const copyText = document.getElementById('cp' + id);
        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(copyText);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("copy");
        alert('Copied! ' + copyText.innerText)
        this.props.startCopyOrder(id)
    }
    onReset = (id) => {
        if (confirm('Are you sure to reset this item?'))
            this.props.startResetOrder(id)
    }
    onRemove = (id) => {
        if (confirm('Are you sure to delete this item?'))
            this.props.startRemoveOrder(id)
    }
    onDateChange = (e) => {
        this.setState({ date: e.target.value })
    }
    render() {
        let sumPrice = 0;
        var groupDate = _.chain(this.state.orders).groupBy("date").map(function (offers, date) {
            return {
                date: date
            };
        }).value();
        // console.log(groupDate)
        return (
            <div className="row">
                <div className="col-12">
                    <table className="table table-bordered ">
                        <thead>
                            <tr>
                                <th scope="col">ลำดับ.</th>
                                <th scope="col">วันที่</th>
                                <th scope="col">ชื่อที่อยู่</th>
                                <th scope="col">ธนาคาร</th>
                                <th scope="col">ราคา</th>
                                <th scope="col">จัดการ</th>
                            </tr>
                            {this.state.orders.length > 0 && <tr>
                                <th></th>
                                <th>
                                    <select className="form-select" onChange={this.onDateChange} value={this.state.date}>
                                        <option value="all">ทุกวัน</option>
                                        {groupDate.map(m => {
                                            return (<option key={m.date} value={m.date}>{moment(m.date).format('ll')}</option>)
                                        })}
                                    </select>
                                </th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>}
                        </thead>
                        <tbody>
                            {this.state.orders.length > 0 ?
                                this.state.orders.filter(f => f.date == this.state.date || this.state.date == 'all').map((o, i) => {
                                    sumPrice += o.price;
                                    return (<tr key={o.id} className={`${o.selected && 'table-success'}`}>
                                        <td>{this.state.orders.length - i}</td>
                                        <td>{moment(o.date).format('ll')}</td>
                                        <td id={'cp' + o.id}>{o.customer}</td>
                                        <td>{o.bank}</td>
                                        <td className="text-right">{Money(o.price, 2)}</td>
                                        <td>
                                            <button type="button" onClick={() => this.onCopy(o.id)} className="btn btn-success btn-md mr-1">Copy</button>
                                            <button type="button" onClick={() => this.onReset(o.id)} className="btn btn-warning mr-1">Reset</button>
                                            <button type="button" onClick={() => this.onRemove(o.id)} className="btn btn-danger mr-1">Delete</button>
                                        </td>
                                    </tr>)
                                })
                                : (
                                    <tr>
                                        <td colSpan="6" className="text-center">ไม่มีรายการ</td>
                                    </tr>
                                )}
                            <tr>
                                <td colSpan={4} className="font-weight-bold text-center">รวม</td>
                                <td className="font-weight-bold text-right">{Money(sumPrice, 2)}</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    orders: state.orders.sort((a, b) => a.created > b.created ? -1 : 1)
});

const mapDispatchToProps = (dispatch) => ({
    startListOrder: () => dispatch(startListOrder()),
    startCopyOrder: (orderid) => dispatch(startCopyOrder(orderid)),
    startResetOrder: (orderid) => dispatch(startResetOrder(orderid)),
    startRemoveOrder: (orderid) => dispatch(startRemoveOrder(orderid)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
