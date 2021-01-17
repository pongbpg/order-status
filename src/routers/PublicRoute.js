import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
export const PublicRoute = ({
    isAuthenticated,
    component: Component,
    ...rest
}) => (
        <Route {...rest} component={(props) => (
            isAuthenticated ?
                (
                    <section>
                        <Header />
                        <div className="row">
                            {/* <div className="col-1"><SideBar /></div> */}
                            <div className="col"><Component {...props} /></div>
                        </div>
                    </section>
                )
                : (
                    <Redirect to="/login" />
                )
        )} />
    );

const mapStateToProps = (state) => {
    return {
        isAuthenticated: true //auth
    }
};

export default connect(mapStateToProps)(PublicRoute);