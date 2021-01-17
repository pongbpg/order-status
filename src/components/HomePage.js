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
        <OrderAdd />
        <OrderList />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
