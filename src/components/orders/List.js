import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { history } from '../../routers/AppRouter';
import { startListOrder, startCopyOrder, startCancelOrder, startRemoveOrder } from '../../actions/orders';
import moment from 'moment';
import { storage } from '../../db/firebase';
import Money from '../../selectors/money'
import { Button, Modal } from 'react-bootstrap'
import { useTable, usePagination } from 'react-table'
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
            orders: props.orders,
            bankModal: false,
            bankInput: '',
            id: ''
        }
        this.props.startListOrder();
        this.onBankClick = this.onBankClick.bind(this)
        this.handleModalShowHide = this.handleModalShowHide.bind(this)
    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.orders) != JSON.stringify(this.state.orders)) {
            this.setState({ orders: nextProps.orders });
        }
    }
    componentDidMount() {
        this.props.startListOrder();
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
    onBankClick = (id) => {
        console.log(id)
        this.setState({ bankModal: true, bankInput: '', id })
    }
    handleModalShowHide = () => {
        this.setState({ bankModal: null, bankInput: '', id: '' })
    }
    render() {
        var groupDate = _.chain(this.state.orders).groupBy("date").map((offers, date) => ({ date })).value().sort((a, b) => a.date > b.date ? -1 : 1);
        // var groupBank = _.chain(this.state.orders).groupBy("bank").map((offers, bank) => ({ bank })).value();
        // console.log(groupDate)
        var orders = (this.state.orders.length > 0 ? this.state.orders.filter(f => {
            return (f.date == this.state.date || this.state.date == 'all')
                && (f.bank == this.state.bank || this.state.bank == 'all')
                && ((f.selected == this.state.copied) || (f.selected == !this.state.notcopy))
                && (f.customer.toLowerCase().includes(this.state.search.toLowerCase()))
                && (f.desc.toLowerCase().includes(this.state.desc.toLowerCase()))
        }) : this.state.orders).map((m, i) => ({ rowNo: i + 1, ...m }));
        const sumPrice = _.chain(orders).filter(f => f.canceled == null).reduce((l, r) => l + r.price, 0).value();

        return (
            <div>
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
                    </thead>
                </table>
                <App list={orders} sum={sumPrice}
                    startCopyOrder={this.props.startCopyOrder}
                    startCancelOrder={this.props.startCancelOrder}
                    startRemoveOrder={this.props.startRemoveOrder} />
            </div>
        );
    }
}
function App({ list, sum, startCopyOrder, startCancelOrder, startRemoveOrder }) {
    // console.log(onCopy)
    const onCopy = (id) => {
        console.log('orderid', id)
        const copyText = document.getElementById('cp' + id);
        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(copyText);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("copy");
        alert('คัดลอกข้อความ!\n"' + copyText.innerText + '"')
        startCopyOrder(id)
    }
    const onCancel = (id) => {
        console.log('cancel orderid', id)
        if (confirm('Are you sure to cancel this item?')) {
            startCancelOrder(id)
        }
    }
    const onRemove = (id) => {
        if (confirm('Are you sure to delete this item?'))
            startRemoveOrder(id)
    }
    const data = React.useMemo(() => list)
    const columns = React.useMemo(
        () => [
            {
                Header: 'ลำดับ',
                accessor: 'rowNo'
                // Cell: (row) => {
                //     return <div>{row.index + 1}</div>;
                // }
            },
            {
                Header: 'วันที่',
                accessor: row => moment.unix(row.created).format('lll'),
            },
            {
                Header: 'ลูกค้า',
                accessor: row => {
                    return (
                        <div id={'cp' + row.id}>{row.customer}</div>
                    )
                }
            },
            {
                Header: 'หมายเหตุ',
                accessor: 'desc'
            },
            {
                Header: 'ราคา',
                className: "text-right",
                accessor: row => Money(row.price, 2)
            },
            {
                Header: 'รูปภาพ',
                accessor: row => {
                    return <div>
                        {row.filenames.length > 0 &&
                            row.filenames.map(f => {
                                return (<a key={f.filename} className="m-2" href={`https://firebasestorage.googleapis.com/v0/b/${f.bucket}/o/uploads%2F${f.filename}?alt=media`} target="_blank">
                                    <img style={{ maxWidth: '100px' }} tag="download" src={`https://firebasestorage.googleapis.com/v0/b/${f.bucket}/o/uploads%2F${f.filename}?alt=media`}></img>
                                </a>)
                            })}
                    </div>

                }
            },
            {
                Header: 'จัดการ',
                accessor: row => {
                    return (
                        <div>
                            {(row.selected == false && row.canceled == null) && <button type="button" onClick={() => onCopy(row.id)} className="btn btn-success btn-sm">สั่งแล้ว</button>}
                            {(row.selected == true && row.canceled == null) && <button type="button" onClick={() => onCancel(row.id)} className="btn btn-warning btn-sm">ยกเลิก</button>}
                            <button type="button" onClick={() => onRemove(row.id)} className="btn btn-danger m-1 btn-sm">ลบ</button>
                        </div>
                    )
                }
            }
        ],
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        //rows,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page
        prepareRow,

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable({
        columns,
        data,
        initialState: { pageIndex: 0 },
    },
        usePagination
    )

    return (
        <div>
            <table {...getTableProps()} className="table table-bordered">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th
                                    {...column.getHeaderProps()}
                                    scope="col"
                                >
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    <tr>
                        <td colSpan={4} className="font-weight-bold text-center">รวม</td>
                        <td className="font-weight-bold text-right">{Money(sum, 2)}</td>
                        <td></td>
                        <td></td>
                    </tr>
                    {page.map(row => {
                        // console.log(row)
                        prepareRow(row)
                        return (
                            <tr className={`${(row.original.selected === true) && 'table-success'}`} {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                    <tr>
                        <td colSpan={4} className="font-weight-bold text-center">รวม</td>
                        <td className="font-weight-bold text-right">{Money(sum, 2)}</td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>{' '}
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <span>
                    | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{ width: '100px' }}
                    />
                </span>{' '}
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>

        </div>
    )
}

const mapStateToProps = (state) => ({
    orders: state.orders.sort((a, b) => a.created > b.created ? -1 : 1)
});

const mapDispatchToProps = (dispatch) => ({
    startListOrder: () => dispatch(startListOrder()),
    startCopyOrder: (orderid) => dispatch(startCopyOrder(orderid)),
    startCancelOrder: (orderid) => dispatch(startCancelOrder(orderid)),
    startRemoveOrder: (orderid) => dispatch(startRemoveOrder(orderid)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
