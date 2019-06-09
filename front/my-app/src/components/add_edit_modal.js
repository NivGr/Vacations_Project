import React from 'react';
import _ from 'lodash';

import {addVacation} from '../actions/index.js';
import {editVacation} from '../actions/index.js';
import {connect} from 'react-redux';

class VacationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      description: '',
      destination: '',
      fromDate: '',
      toDate: '',
      price: null,
      image: null,
      validation: false
    }
  }

  vacationHandler() {
    //edit functionallity
    if(this.props.state !== undefined) {
      const data = new FormData();
      if(this.state.image.name !== undefined) {
          data.append('picture', this.state.image, this.state.image.name);
      }
      this.setState({validation: true}) //validate fields to dynamically show what's missing
      let myState = _.cloneDeep(_.omit(this.state, ['id', 'price','validation', 'image']));
      const vacation = _.merge(myState, {price: parseInt(this.state.price)});
      data.append('vacationDetails', JSON.stringify(vacation));
      if(_.filter(myState, x => x === '').length === 0 && this.state.price !== null && this.state.image !== '' && this.state.toDate > this.state.fromDate) {
        this.props.editVacation(data, this.state.id);
        this.setState({validation: false})
        this.props.close();
        alert('Vacation Succefully Edited!');
      }
      else {
        return null
      }
    }
    else{
      // ADD functionallity
      const data = new FormData();
      data.append('picture', this.state.image, this.state.image.name);
      this.setState({validation: true})
      let myState = _.cloneDeep(_.omit(this.state, ['id', 'price', 'image','validation']));
      const vacation = _.merge(myState, {price: parseInt(this.state.price)});
      data.append('vacationDetails', JSON.stringify(vacation))
      if(_.filter(myState, x => x === '').length === 0 && this.state.price !== null && this.state.image !== '' && this.state.toDate > this.state.fromDate) {
        this.props.addVacation(data);
        this.setState({
          id: 0,
          description: '',
          destination: '',
          fromDate: '',
          toDate: '',
          price: null,
          image: '',
          validation: false
        });
        this.props.close();
        alert('Vacation Succefully Added!');
      }
      else {
        return null
      }
    }
  }

  changeInput(field, value) {
    this.setState({[field]: value})
  }

  render() {
    return(
            <div class="container-fluid">
              <div class="row">
                <div class="vacationInputs col m12 s10">
                  <div class="row">
                    <div class="input-field col m10 offset-m1 s12">
                      <input id="destination" value={this.state.destination} type="text" class="validate active" onChange={({target}) => this.changeInput('destination',target.value)}/>
                      <label for="destination" className={this.state.destination !== '' ? "active": "validate"}>Destination</label>
                      <div style={{color:'red', display: this.state.validation && this.state.destination === '' ? 'block' : 'none'}}>Please enter a destination</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="input-field col m10 offset-m1 s12">
                      <textarea id="description" value={this.state.description} class="active" onChange={({target}) => this.changeInput('description',target.value)}/>
                      <label for="description" className={this.state.description !== '' ? "active": "validate"}>Description</label>
                      <div style={{color:'red', display: this.state.validation && this.state.description === '' ? 'block' : 'none'}}>Please enter a description</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="input-field col m10 offset-m1 s12">
                      <input id="fromDate" value={this.state.fromDate.substring(0,10)} type="date" class="validate" onChange={({target}) => this.changeInput('fromDate',target.value)}/>
                      <label for="fromDate">Starting Date</label>
                      <div style={{color:'red', display: this.state.validation && this.state.fromDate === '' ? 'block' : 'none'}}>Please enter a starting date</div>
                      <div style={{color:'red', display: this.state.validation && this.state.toDate < this.state.fromDate ? 'block' : 'none'}}>Ending date can not be earlier than starting date</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="input-field col m10 offset-m1 s12">
                      <input id="toDate" value={this.state.toDate.substring(0,10)} type="date" class="validate" onChange={({target}) => this.changeInput('toDate',target.value)}/>
                      <label for="toDate">Ending Date</label>
                      <div style={{color:'red', display: this.state.validation && this.state.toDate === '' ? 'block' : 'none'}}>Please enter an ending date</div>
                      <div style={{color:'red', display: this.state.validation && this.state.toDate < this.state.fromDate ? 'block' : 'none'}}>Ending date can not be earlier than starting date</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="input-field col m10 offset-m1 s12">
                      <input id="price" value={this.state.price} type="number" class="validate" onChange={({target}) => this.changeInput('price',target.value)}/>
                      <label for="price" className={this.state.price >= 0 ? "active": ""}>Price</label>
                      <div style={{color:'red', display: this.state.validation && (this.state.destination === null || this.state.price <= 0) ? 'block' : 'none'}}>Please enter a valid price</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="file-field input-field col m10 offset-m1 s12">
                      <div class="btn">
                        <span>Image Upload</span>
                        <input id="img" type="file" class="validate" onChange={({target}) => this.changeInput('image',target.files[0])}/>
                        <div style={{color:'red', display: this.state.validation && this.state.image === '' ? 'block' : 'none'}}>Please upload an image</div>
                      </div>
                      <div class="file-path-wrapper hide-on-small-only">
                        <input class="file-path validate" type="text"/>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <button class="btn waves-effect waves-light s12" value = {this.state.image} type="submit" name="action" onClick= {() => this.vacationHandler(this.state)}>Submit</button>
                  </div>
                </div>
              </div>
            </div>
        )
  }

  componentDidMount() {
    this.props.state !== undefined ? this.setState({
      id: this.props.state.id,
      description: this.props.state.description,
      destination: this.props.state.destination,
      fromDate: this.props.state.fromDate,
      toDate: this.props.state.toDate,
      price: this.props.state.price,
      image: this.props.state.image
    }) :
    this.setState({
      id: 0,
      description: '',
      destination: '',
      fromDate: '',
      toDate: '',
      price: '',
      image: ''
    });
  }
}


const mapDispatchToProps = dispatch => {
  return{
    addVacation: state => dispatch(addVacation(state)),
    editVacation: (state, vacationId) => dispatch(editVacation(state, vacationId))
  }
}

export default connect(null, mapDispatchToProps)(VacationForm);
