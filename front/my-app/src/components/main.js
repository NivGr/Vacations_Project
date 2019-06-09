import React from 'react';
import axios from 'axios';
import Modal from 'react-responsive-modal'
import _ from 'lodash';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {getAllVacations} from '../actions/index.js';
import {logout} from '../actions/index.js';
import {checkCookie} from '../actions/index.js';

import { slide as Menu } from 'react-burger-menu'


import Vacation from './vacations.js';
import VacationForm from './add_edit_modal.js';

//deleted isloginsuccess in mapstate and in shouldcomponent - if anything fucks up - check it first

class Main extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      vacations: [],
      modalOpen: false,
      shouldRefresh: false
    }
  }

  shouldComponentUpdate(nextProps,nextState) {
    return !_.isEqual(nextProps.vacations[0], this.props.vacations[0]) ||
           this.props.vacations.length === 0 ||
           this.state.modalOpen !== nextState.modalOpen ||
           this.props.userFromCookie !== nextProps.userFromCookie ||
           this.props.isAdmin !== nextProps.isAdmin ||
           this.props.username !== nextProps.username
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.userFromCookie.length === 0) {
      this.props.history.push('/vacations')
    }
  }

  logout() {
    this.props.logout();
    this.props.history.push('/vacations')
  }

  onOpenModal() {
    this.setState({ modalOpen: true });
  }

  onCloseModal() {
    this.setState({ modalOpen: false });
  }

  showGraph() {
    console.log(this.props.vacations)
    this.props.history.push('/vacations/statistics')
  }

  render() {
    const { modalOpen } = this.state;
    if(this.props.isAdmin === null || this.props.vacations.length === 0 || this.props.vacations[0].followed === undefined) {
      return null
    }

    const vacations = this.props.vacations[0].vacations;
    const followed = this.props.vacations[0].followed[0];
    const vacationsFollowed = _.filter(vacations, v => _.indexOf(_.map(followed, f => f.Vacation_Id), v.Vacation_ID) !== -1)
    const sortedByFollowed = _.union(vacationsFollowed, vacations);    
    if(this.props.isAdmin === 0) {
      return(
        <div class="container">
          <div class="head">
            <div class="row">
              <nav class="grey">
                <div class="nav-wrapper col s12">
                  <a class="brand-logo left"><i class="material-icons">account_circle</i>{this.props.username}</a>
                  <a href="#" data-target="mobile-demo" class="sidenav-trigger right"><i class="material-icons">menu</i></a>
                  <ul class="right hide-on-med-and-down">
                    <li class="hide-on-small-only"><a onClick= {() => this.logout()}>Logout</a></li>
                  </ul>
                  <ul class="sidenav" id="mobile-demo">
                    <li class="hide-on-small-only"><a onClick= {() => this.logout()}>Logout</a></li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
            <div class="vacations row">
            {_.map(sortedByFollowed, (v,idx) =>
              <div key={v.Vacation_ID} id={v.Vacation_ID} class="card col s12 m6 l4">
                <Vacation data={v} userId = {this.props.userId} isAdmin={this.props.isAdmin} followed = {this.props.vacations[0].followed}/>
              </div>
            )}
          </div>
        </div>
      )
    }
    //SCREEN FOR ADMIN
  if(this.props.isAdmin === 1) {
    return (
      <div class="container">
        <div class="navbar-fluid">
          <nav class="grey">
            <div class="nav-wrapper">
                <a class="brand-logo left"><i class="material-icons">account_circle</i>{this.props.username}</a>
                <ul class="right">
                  <li class="hide-on-small-only"><a onClick= {() => this.logout()}>Logout</a></li>
                  <li class="hide-on-small-only"><a onClick= {() => this.onOpenModal()}>Add Vacation</a></li>
                  <li class="hide-on-small-only"><a onClick= {() => this.showGraph()}>Statistics</a></li>
                </ul>
                <div className="burger_mobile" style={{marginLeft:'-14%'}}>
                <Menu className='col s4 hide-on-med-and-up'>
                  <a className="menu-item" onClick= {() => this.logout()}>
                    Logout
                  </a>
                  <a className="menu-item" onClick= {() => this.onOpenModal()}>
                    Add Vacation
                  </a>
                  <a className="menu-item" onClick= {() => this.showGraph()}>
                    Statistics
                  </a>
                </Menu>
                </div>
              </div>
          </nav>
        </div>
        <div class="vacations row">
          {_.map(this.props.vacations[0].vacations, (v,idx) =>
            <div key={v.Vacation_ID} id={v.Vacation_ID} class="card col s10 m6 l4">
              <Vacation data={v} userid= {this.props.userFromCookie} isAdmin={this.props.isAdmin} followed={this.props.vacations[0].followed}/>
            </div>
          )}
        </div>
          <Modal open={modalOpen} onClose={() => this.onCloseModal()} center>
            <div class="row">
              <VacationForm close={() => this.onCloseModal()}/>
            </div>
          </Modal>
      </div>
      )
    }
  }

  componentDidMount() {
    if(_.isEmpty(this.props.userFromCookie)) { //if no cookie on user req - jump to login
      this.props.history.push('/vacations/');
    }
    this.props.getAllVacations(); // send the request
  }
}

const mapStateToProps = state => {
  return{
    vacations: state.getVacations,
    isAdmin: state.isAdmin,
    username: state.getUsername,
    userId: state.getUserId,
    userFromCookie: state.getCookie
  }
}

const mapDispatchToProps = dispatch => {
  return{
    getAllVacations: () => dispatch(getAllVacations()),
    logout: () => dispatch(logout()),
    checkCookie: () => dispatch(checkCookie())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Main);
