import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import { startListOrder, startCopyOrder, startResetOrder, startRemoveOrder } from '../../actions/orders';
import moment from 'moment';
import { storage } from '../../db/firebase';
import Money from '../../selectors/money'
import _ from 'underscore'
moment.locale('th');
export class ListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: 'all',
            bank: 'all',
            copied: true,
            notcopy: true,
            search: '',
            desc: '',
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
        alert('คัดลอกข้อความ!\n"' + copyText.innerText + '"')
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
    onBankChange = (e) => {
        this.setState({ bank: e.target.value })
    }
    onCopyChange = (e) => {
        this.setState({ copied: e.target.checked })
    }
    onNotCopyChange = (e) => {
        this.setState({ notcopy: e.target.checked })
    }
    onSearchChange = (e) => {
        this.setState({ search: e.target.value })
    }
    onDescChange = (e) => {
        this.setState({ desc: e.target.value })
    }
    render() {
        let sumPrice = 0;
        var groupDate = _.chain(this.state.orders).groupBy("date").map((offers, date) => ({ date })).value();
        var groupBank = _.chain(this.state.orders).groupBy("bank").map((offers, bank) => ({ bank })).value();
        // console.log(groupDate)
        var orders = this.state.orders.length > 0 ? this.state.orders.filter(f => {
            return (f.date == this.state.date || this.state.date == 'all')
                && (f.bank == this.state.bank || this.state.bank == 'all')
                && ((f.selected == this.state.copied) || (f.selected == !this.state.notcopy))
                && (f.customer.toLowerCase().includes(this.state.search.toLowerCase()))
                && (f.desc.toLowerCase().includes(this.state.desc.toLowerCase()))
        }) : this.state.orders;
        return (
            <div className="row">
                <div className="col-12">
                    <table className="table table-bordered ">
                        <thead>

                            {this.state.orders.length > 0 &&
                                <tr>
                                    <th>ค้นหา</th>
                                    <th>
                                        <select className="form-select" onChange={this.onDateChange} value={this.state.date}>
                                            <option value="all">ทุกวัน</option>
                                            {groupDate.map(m => {
                                                return (<option key={m.date} value={m.date}>{moment(m.date).format('ll')}</option>)
                                            })}
                                        </select>
                                    </th>
                                    <th><input type="text" placeholder="ชื่อที่อยู่" className="form-control" value={this.state.search} onChange={this.onSearchChange} /></th>
                                    <th><input type="text" placeholder="หมายเหตุ" className="form-control" value={this.state.desc} onChange={this.onDescChange} /></th>
                                    <th>
                                        <select className="form-select" onChange={this.onBankChange} value={this.state.bank}>
                                            <option value="all">ทั้งหมด</option>
                                            {groupBank.map(m => {
                                                return (<option key={m.bank} value={m.bank}>{m.bank}</option>)
                                            })}
                                        </select>
                                    </th>
                                    <th></th>
                                    <th>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" checked={this.state.copied} value={this.state.copied} id="flexCheckDefault" onChange={this.onCopyChange} />
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                สั่งแล้ว
                                        </label>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" checked={this.state.notcopy} value={this.state.notcopy} id="flexCheckChecked" onChange={this.onNotCopyChange} />
                                            <label className="form-check-label" htmlFor="flexCheckChecked">
                                                ยังไม่สั่ง
                                        </label>
                                        </div>
                                    </th>
                                </tr>}

                            <tr>
                                <th scope="col">ลำดับ.</th>
                                <th scope="col">วันที่</th>
                                <th scope="col">ชื่อที่อยู่</th>
                                <th scope="col">หมายเหตุ</th>
                                <th scope="col">ธนาคาร</th>
                                <th scope="col">ราคา</th>
                                <th scope="col">รูปภาพ</th>
                                <th scope="col">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.orders.length > 0 ?
                                orders.map((o, i) => {
                                    sumPrice += o.price;
                                    return (<tr key={o.id} className={`${o.selected && 'table-success'}`}>
                                        <td>{orders.length - i}</td>
                                        <td>{moment.unix(o.created).format('lll')}</td>
                                        <td id={'cp' + o.id}>{o.customer}</td>
                                        <td>{o.desc}</td>
                                        <td>{o.bank}</td>
                                        <td className="text-right">{Money(o.price, 2)}</td>
                                        <td>
                                            {o.filenames.length > 0 && o.filenames.map(f => {
                                                return (<a key={f.filename} className="m-2" href={`https://firebasestorage.googleapis.com/v0/b/${f.bucket}/o/uploads%2F${f.filename}?alt=media`} target="_blank">
                                                    <img style={{ maxWidth: '100px' }} tag="download" src={`https://firebasestorage.googleapis.com/v0/b/${f.bucket}/o/uploads%2F${f.filename}?alt=media`}></img>
                                                </a>)
                                            })}
                                        </td>
                                        <td>
                                            {o.selected == false && <button type="button" onClick={() => this.onCopy(o.id)} className="btn btn-success btn-sm">สั่งแล้ว</button>}
                                            {o.selected == true && <button type="button" onClick={() => this.onReset(o.id)} className="btn btn-warning btn-sm">ยกเลิก</button>}
                                            <button type="button" onClick={() => this.onRemove(o.id)} className="btn btn-danger m-1 btn-sm">ลบ</button>
                                        </td>
                                    </tr>)
                                })
                                : (
                                    <tr>
                                        <td colSpan="7" className="text-center">ไม่มีรายการ</td>
                                    </tr>
                                )}
                            <tr>
                                <td colSpan={5} className="font-weight-bold text-center">รวม</td>
                                <td className="font-weight-bold text-right">{Money(sumPrice, 2)}</td>
                                <td></td>
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
