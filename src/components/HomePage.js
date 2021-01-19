import React from 'react';
import { history } from '../routers/AppRouter';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import OrderAdd from './orders/Add'
import OrderList from './orders/List'
export class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  componentDidMount() {

  }

  render() {
    return (
      <div className="container">
        <div className="col-auto mt-3">
          <OrderAdd />
        </div>
        <div className="col-auto mb-3">
          <OrderList />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
