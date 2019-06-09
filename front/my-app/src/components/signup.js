import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import {connect} from 'react-redux';
import {signupUser} from '../actions/index.js';
import {checkAvailabilty} from '../actions/index.js';
import {checkCookie} from '../actions/index.js';
import logo from '../images/vacation-clipart-49626.png';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first: '',
      last: '',
      username: '',
      password: '',
      passwordAuth: '',
      usernameAvailability: null, // true/false
      validation: false,
      passwordValid: false
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState || this.props.isAvailable !== nextProps.isAvailable || this.props.userFromCookie !== nextProps.userFromCookie
  }

  onChange(field,value){
    if(field === 'username') {
      this.props.checkAvailabilty(value)
    }
    this.setState({[field]: value})
  }

  signupClick() {
    if((_.filter(this.state, x => x === '')).length > 0 || this.props.isAvailable === false) {
      this.setState({validation: true})
      return null;
    }
    if(this.state.password !== this.state.passwordAuth) {
      this.setState({passwordValid: true})
      return null;
    }
    this.setState({validation:false, passwordValid:false})
    this.props.signupUser(this.state);
    this.props.history.push('/vacations')
  }

  render() {
    if(this.props.userFromCookie.length > 0) {
      this.props.history.push('/vacations')
    }
    return(
      <div class="container">
        <div class="row">
          <div class="signupForm col m7 offset-m3 s12 z-depth-1 grey lighten-4">
            <div class="row">
            <ul class="collection">
              <li class="collection-item avatar">
                <span class="title" style={{fontSize: '20px', marginTop: '-5px'}}>Sign Up Form</span>
                <p>
                  Please fill all the fields up, try and think of an original username
                </p>
              </li>
            </ul>
              <div class="input-field col m6 s6">
                <input id="first_name" type="text" class="validate" onChange= {({target}) => this.onChange('first',target.value)} required/>
                <label for="first_name">First Name</label>
                <div style={{color:'red', display: this.state.validation && this.state.first.length === 0 ? 'block' : 'none'}}>Please enter your first name</div>
              </div>
              <div class="input-field col m6 s6">
                <input id="last_name" type="text" class="validate" onChange= {({target}) => this.onChange('last',target.value)} required/>
                <label for="last_name">Last Name</label>
                <div style={{color:'red', display: this.state.validation && this.state.last.length === 0 ? 'block' : 'none'}}>Please enter last name in</div>
              </div>
            </div>
            <div class="row">
              <div class="input-field col m12 s12">
                <input id="user_name" type="text" class="validate col s9" onChange= {({target}) => this.onChange('username',target.value)} required/>
                <label for="user_name">Username</label>
                <i class="material-icons col s2 offset-s1" style={{color: this.props.isAvailable === true && this.state.username !== '' ? 'lightgreen' : 'red'}}>{(this.props.isAvailable === true && this.state.username !== '') ? 'check' : 'cancel'}</i>
                <div className= "col s12" style={{color:'red', display: this.state.validation && this.state.username.length === 0 ? 'block' : 'none'}}>Please enter a username</div>
                <div className= "col s12" style={{color:'red', display: this.state.validation && this.props.isAvailable === falses ? 'block' : 'none'}}>Please enter a username</div>
              </div>
            </div>
            <div class="row">
              <div class="input-field col m12 s12">
                <input id="password" type="password" class="validate" onChange= {({target}) => this.onChange('password',target.value)} required/>
                <label for="password">Password</label>
                <div style={{color:'red', display: this.state.validation && this.state.password.length === 0 ? 'block' : 'none'}}>Please enter a password</div>
              </div>
            </div>
            <div class="row">
              <div class="input-field col m12 s12">
                <input id="passwordAuth" type="password" class="validate" onChange= {({target}) => this.onChange('passwordAuth',target.value)} required/>
                <label for="passwordAuth">Authenticate Password</label>
                <div style={{color:'red', display: this.state.validation && this.state.passwordAuth.length === 0 ? 'block' : 'none'}}>Please authenticate your password</div>
                <div style={{color:'red', display: this.state.passwordValid ? 'block' : 'none'}}>Password authentication does not match password</div>
              </div>
            </div>
            <div class="signupBtn">
              <button class="btn waves-effect waves-light col m6 offset-m3 s4 offset-s4" type="submit" name="action" style={{marginBottom:'15px'}} onClick= {() => this.signupClick()}>Signup
                <i class="material-icons right"></i>
              </button>
            </div>
            <div class="backToLogin col s12" style={{marginRight:'4%'}}>
              <p><a class="col s12 offset-s2 l12 offset-l3 m12 offset-m3 xl12 offset-xl4" onClick={() => this.props.history.push('/vacations')}>Get Back to Login Screen</a></p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.props.checkCookie()
  }
}

const mapDispatchToProps = dispatch => {
  return{
    signupUser: state => dispatch(signupUser(state)),
    checkAvailabilty: username => dispatch(checkAvailabilty(username)),
    checkCookie: () => dispatch(checkCookie()),
  }
}

const mapStateToProps = state => {
  return {
    isAvailable: state.isAvailable,
    userFromCookie: state.getCookie
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Signup)
