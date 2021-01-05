import React from 'react';
import { history } from '../routers/AppRouter';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
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
      <div>
        <Link to="/products">ตารางสินค้า</Link>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
