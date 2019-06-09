import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {loginUser} from '../actions/index.js';
import {checkCookie} from '../actions/index.js';
import logo from '../images/vacation-clipart-49626.png'

class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      validateCreds: false
    }
  }

  onChange(field,value) {
    this.setState({[field]: value})
  }

  clickLogin() {
    this.setState({validateCreds: true})
    this.props.loginUser(_.omit(this.state,'validateCreds'));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState || this.props.isLoginSuccess !== nextProps.isLoginSuccess || this.props.userFromCookie !== nextProps.userFromCookie
  }

  render() {
    if(!_.isEmpty(this.props.userFromCookie)) {
      this.props.history.push('/vacations/main');
    }
    if(this.props.userFromCookie === '') {
      return null
    }
    return(
      <div class="container">
        <div class="row">
          <div class="loginInputs col s12 m8 offset-m2 l5 offset-l4 z-depth-1 grey lighten-4"  style={{paddingBottom:'30px', paddingTop:'10px', height:'600px'}}>
            <div class="row">
              <img id="logo" src = {logo} class="col s12 offset-s4 m12 offset-m4" style={{width:'40%', height:'40%', marginTop:'5px'}}/>
            </div>
            <div class="row">
                <div class="input-field col l12 s12" style={{marginTop:'20px'}}>
                  <input id="username" type="text" class="validate" value={this.state.useename} onChange= {({target}) => this.onChange('username',target.value)}/>
                  <label for="username">Username</label>
              </div>
            </div>
          <div class="row">
            <div class="input-field col l12 s12">
              <input id="password" type="password" class="validate" value={this.state.password} onChange= {({target}) => this.onChange('password',target.value)}/>
              <label for="password">Password</label>
            </div>
            <div className="loginErrorHandle col s8 offset-s3" style={{display: this.props.isLoginSuccess[0] === false && this.state.validateCreds ? 'block': 'none', color:'red'}}>
              Username or Password incorrect
            </div>
          </div>
          <div class="row">
            <button class="btn waves-effect waves-light col s11" style={{marginTop:"-10px",marginLeft:'4%'}} type="submit" name="action" onClick= {() => this.clickLogin()}>Login<i class="material-icons right"></i></button>
          </div>
          <div class=" signupBtn center-align" style={{textAlign:'center', marginTop:'50px', marginBottom:'10px'}}>
            <a class="col l12 s12">Don't have a user yet? Click to sign up</a>
            <button class="btn waves-effect waves-light center-align col s11" type="submit" name="action" onClick= {() => this.props.history.push('/vacations/signup')} style={{marginLeft:'3%'}}>Signup
              <i class="material-icons right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if((prevProps.isLoginSuccess !== this.props.isLoginSuccess && this.props.isLoginSuccess[0])) {
      this.props.history.push('/vacations/main')
    }
  }

  componentDidMount() {
    this.props.checkCookie();
  }
}

const mapDispatchToProps = dispatch => {
  return{
    loginUser: state => dispatch(loginUser(state)),
    checkCookie: () => dispatch(checkCookie())
  }
}


const mapStateToProps = state => {
  return{
    isLoginSuccess: state.isLoginSuccess,
    isAdmin: state.isAdmin,
    userFromCookie: state.getCookie,
    credentials: state.getLoginCreds
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Login);
