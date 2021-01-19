import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import { startAddOrder } from '../../actions/orders';
import NumberFormat from 'react-number-format';
import ImageUploader from 'react-images-upload';
import moment from 'moment';
moment.locale('th');
export class AddPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: {
                customer: '',
                price: '',
                bank: '',
                desc: '',
            },
            pictures: [],
            disabled: false
        }
        this.myRef = React.createRef();
        this.onDrop = this.onDrop.bind(this);
        // this.props.startGetProducts()
    }
    componentWillReceiveProps(nextProps) {
        // if (JSON.stringify(nextProps.products) != JSON.stringify(this.state.products)) {
        //     this.setState({ products: nextProps.products });
        // }
    }
    onDrop(picture) {
        this.setState({
            pictures: this.state.pictures.concat(picture)
        });
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
        this.setState({ disabled: true })
        e.preventDefault();
        // this.state.pictures.map((p, i) => console.log(p))
        this.props.startAddOrder({ ...this.state.order, created: moment().unix(), date: moment().format('YYYYMMDD') }, this.state.pictures)
            // .then(() => console.log('add ok'))
        this.setState({
            order: {
                customer: '',
                price: '',
                bank: '',
                desc: '',
                // selected: false
            },
            pictures: [],
            disabled: false
        })
        this.myRef.current.state.pictures = [];
        this.myRef.current.state.files = [];
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

                <div className="row mb-3">
                    <div className="col-sm-12 col-md-6 mt-sm-2 mt-2">
                        <input type="text" id="txtDesc" className="form-control" placeholder="หมายเหตุ" value={this.state.order.desc} onChange={this.onDescChange} />
                    </div>
                    <div className="col-sm-6 col-md-3 mt-sm-2 mt-2">
                        <input type="text" id="txtBank" className="form-control" placeholder="ธนาคาร" value={this.state.order.bank} onChange={this.onBankChange} />
                    </div>
                    <div className="col-sm-6 col-md-3 mt-sm-2 mt-2">
                        <NumberFormat className="form-control text-right" id="txtPrice" placeholder="จำนวนเงิน"
                            value={this.state.order.price}
                            // allowLeadingZeros={true}
                            thousandSeparator={true}
                            onValueChange={(values) => {
                                const { formattedValue, value, floatValue } = values;
                                this.setState({ order: { ...this.state.order, price: floatValue } })
                            }} />
                    </div>
                    <div className="col-sm-12 col-md-12 col-12 mt-sm-2 mt-2">
                        <ImageUploader
                            withIcon={true}
                            withPreview={true}
                            buttonText='อัพโหลดรูปภาพ'
                            onChange={this.onDrop}
                            imgExtension={['.jpg', '.png', '.jpeg']}
                            maxFileSize={5242880}
                            ref={this.myRef}
                        />
                    </div>
                    <div className="col-sm-12 col-md-12 col-12 row justify-content-center mt-sm-2 mt-2">
                        <button className={`btn btn-primary d-grid gab-2 ${this.state.disabled && 'disabled'}`} onClick={this.onSubmit}>เพิ่ม</button>
                    </div>
                </div>
            </form>

        );
    }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    startAddOrder: (order, pictures) => dispatch(startAddOrder(order, pictures))
});
export default connect(mapStateToProps, mapDispatchToProps)(AddPage);
