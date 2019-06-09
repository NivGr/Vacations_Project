import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import {connect} from 'react-redux';
import Modal from 'react-responsive-modal';

import VacationForm from './add_edit_modal.js';

import {followVacation} from '../actions/index.js';
import {deleteVacation} from '../actions/index.js';

class Vacation extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      id: 0,
      description: '',
      destination: '',
      fromDate: '',
      toDate: '',
      price: 0,
      image: '',
      modalOpen: false,
      checked: false
    }
  }

  followClick(userId, vacationId) {
    this.setState({checked: !this.state.checked});
    this.props.handleFollow(this.props.userId, this.state.id, !this.state.checked);
  }

  deleteClick(vacationId) {
    this.props.deleteVacation(vacationId);
  }

  onOpenModal() {
    this.setState({ modalOpen: true });
  }

  onCloseModal() {
    this.setState({ modalOpen: false });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.id !== nextState.id ||
           this.props.followed !== nextProps.followed ||
           this.state !== nextState ||
           this.state.checked !== nextState.checked ||
           this.props.data !== nextProps.data
  }

  render() {
    const {modalOpen} = this.state;
    //user Functionality
    if(this.props.isAdmin === 0) {
      return(
        <div class="card z-depth-3 sticky-action col s12 hoverable col-content" style={{height:'420px', wordBreak:'break-all'}}>
          <div class="card-image waves-effect waves-block waves-light">
            <img class="activator" src={`/uploads/${this.state.image}`} style={{height:'200px', marginTop:'10px'}}/>
          </div>
          <div class="card-content">
            <span class="card-title activator grey-text text-darken-4">{this.state.destination}<i class="material-icons right activator">more_vert</i></span>
            <p>{this.state.fromDate.substring(0,10).replace(/-/g,'/')+1} - {this.state.toDate.substring(0,10).replace(/-/g,'/')}</p>
            <p>Price: {this.state.price}$</p>
          </div>
          <div class="card-action">
            <i class="material-icons hoverable" onClick = {() => this.followClick(this.props.followed[0].User_Id, this.state.id)}>{!this.state.checked ? 'star_border' : 'star'}</i>
          </div>
          <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">{this.state.destination}<i class="material-icons right">close</i></span>
            <p>{this.state.description}</p>
          </div>
        </div>
      )
    }
    //Admin Functionality
    else {
      return(
        <div class="card z-depth-3 sticky-action col s12 hoverable col-content" style={{height:'400px', wordBreak:'break-all'}}>
          <div class="card-image waves-effect waves-block waves-light">
            <img class="activator" src={`/uploads/${this.state.image}`} style={{height:'200px', marginTop:'10px'}}/>
          </div>
          <div class="card-content">
            <span class="card-title activator grey-text text-darken-4">{this.state.destination}<i class="material-icons right activator">more_vert</i></span>
            <p>{this.state.fromDate.substring(0,10).replace(/-/g,'/')} - {this.state.toDate.substring(0,10).replace(/-/g,'/')}</p>
            <p>Price: {this.state.price}$</p>
          </div>
          <div class="card-action">
            <i class="material-icons right hoverable" onClick={() => this.deleteClick(this.state.id)}>delete</i>
            <i class="material-icons left hoverable" onClick={() => this.onOpenModal()}>edit</i>
          </div>
          <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">{this.state.destination}<i class="material-icons right">close</i></span>
            <p>{this.state.description}</p>
          </div>
          <div class="row">
            <Modal open={modalOpen} onClose={() => this.onCloseModal()} center>
              <VacationForm state={this.state} close={() => this.onCloseModal()}/>
            </Modal>
          </div>
        </div>
        )
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if(this.state.id !== prevState.id) {
        const followed = _.filter(this.props.followed[0], x => parseInt(x.Vacation_Id) === parseInt(this.state.id));
        let checked;
        followed.length > 0 ? checked = true : checked = false;
        this.setState({checked: checked});
      }
      if(prevProps.data !== this.props.data) {
        this.setState({
          id: this.props.data.Vacation_ID,
          description: this.props.data.Description,
          destination: this.props.data.Destination,
          fromDate: this.props.data.From_Date,
          toDate: this.props.data.To_Date,
          price: this.props.data.Price,
          image: this.props.data.Image
        })
      }
    }

  componentDidMount() {
    this.setState({
      id: this.props.data.Vacation_ID,
      description: this.props.data.Description,
      destination: this.props.data.Destination,
      fromDate: this.props.data.From_Date,
      toDate: this.props.data.To_Date,
      price: this.props.data.Price,
      image: this.props.data.Image
    })
  }
}

const mapDispatchToProps = dispatch => {
  return{
    deleteVacation: vacationId => dispatch(deleteVacation(vacationId)),
    handleFollow: (vacationId, userId, checked) => dispatch(followVacation(vacationId, userId, checked))
  }
}

const mapStateToProps = state => {
  return {
    userId: state.getUserId
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Vacation);
