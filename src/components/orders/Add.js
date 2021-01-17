import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import { startAddOrder } from '../../actions/orders';
import NumberFormat from 'react-number-format';
import moment from 'moment';
moment.locale('th');
export class AddPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: {
                customer: '',
                price: 0,
                bank: '',
                desc: ''
            }
        }
        // this.props.startGetProducts()
    }
    componentWillReceiveProps(nextProps) {
        // if (JSON.stringify(nextProps.products) != JSON.stringify(this.state.products)) {
        //     this.setState({ products: nextProps.products });
        // }
    }
    onCustomerChange = (e) => {
        this.setState({ order: { ...this.state.order, customer: e.target.value } })
    }
    onDescChange = (e) => {
        this.setState({ order: { ...this.state.order, desc: e.target.value } })
    }
    onBankChange = (e) => {
        this.setState({ order: { ...this.state.order, bank: e.target.value.toUpperCase() } })
    }
    onSubmit = (e) => {
        e.preventDefault();

        this.props.startAddOrder({ ...this.state.order, created: moment().unix(), date: moment().format('YYYYMMDD') })
        this.setState({
            order: {
                customer: '',
                price: 0,
                bank: '',
                desc: '',
                // selected: false
            }
        })
    }
    render() {

        return (

            <form>
                <div className="row mb-3">
                    <div className="col-12">
                        {/* <label htmlFor="txtCustomer" className="form-label">Example textarea</label> */}
                        <textarea className="form-control" id="txtCustomer" placeholder="ชื่อ/ที่อยู่" rows="3"
                            value={this.state.order.customer} onChange={this.onCustomerChange}></textarea>
                    </div>
                </div>

                <div className="row justify-content-center mb-3">
                    <div className="col-auto">
                        <input type="text" id="txtDesc" className="form-control" placeholder="หมายเหตุ" value={this.state.order.desc} onChange={this.onDescChange} />
                    </div>
                    <div className="col-auto">
                        <input type="text" id="txtBank" className="form-control" placeholder="ธนาคาร" value={this.state.order.bank} onChange={this.onBankChange} />
                    </div>
                    <div className="col-auto">
                        <NumberFormat className="form-control" id="txtPrice" placeholder="จำนวนเงิน"
                            value={this.state.order.price}
                            // allowLeadingZeros={true}
                            thousandSeparator={true}
                            onValueChange={(values) => {
                                const { formattedValue, value, floatValue } = values;
                                this.setState({ order: { ...this.state.order, price: floatValue } })
                            }} />
                    </div>
                    <div className="col-sm-2">
                        <button className="btn btn-primary" onClick={this.onSubmit}>เพิ่มข้อมูล</button>
                    </div>
                </div>
            </form>

        );
    }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    startAddOrder: (order) => dispatch(startAddOrder(order))
});
export default connect(mapStateToProps, mapDispatchToProps)(AddPage);
