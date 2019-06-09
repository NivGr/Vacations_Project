import React from 'react';
import { Bar } from 'react-chartjs-2';
import {connect} from 'react-redux';
import {getAllVacations} from '../actions/index.js';
import _ from 'lodash';

const Chart = props => {
    if(_.isEmpty(props.vacations)) {
      return null
    }

    if(_.isEmpty(props.vacations)) {
      return null
    }

    let destinations = _.map(props.vacations[0].vacations, d => d.Destination + ' - ' + d.Vacation_ID);
    let followers = _.map(props.vacations[0].vacations, f => f.NumOfFollowers);
    let colorArr = [
      'rgba(225, 99, 132, 0.9)',
      'rgba(54, 162, 235, 0.9)',
      'rgba(255, 206, 86, 0.9)',
      'rgba(75, 192, 192, 0.9)',
      'rgba(90, 208, 75, 0.9)',
      'rgba(138, 86, 193, 0.9)',
      'rgba(120, 62, 210, 0.9)',
      'rgba(65, 130, 190, 0.9)',
      'rgba(80, 120, 190, 0.9)',
      'rgba(55, 90, 190, 0.9)'

    ]

    let dynamicColors = [];
    for(let i = 0; i < destinations.length; i++) {
      dynamicColors.push(colorArr[Math.floor(Math.random()*10)])
    }

    let chartData = {
      labels: destinations,
      datasets: [
        {
          data: followers,
          backgroundColor: dynamicColors
        }
      ]
    }
    return(
      <div className= "chart">
        <div className= "row">
          <div className= "chartComp col s8 offset-s2">
            <Bar
              data= {chartData}
              height= {'30%'}
              width= {'40%'}
              options= {{
                title: {
                  display: true,
                  text: 'Number of Followers for each Destination',
                  fontSize: 30,
                  fontColor: 'white',
                  maintainAspectRatio: false
                },
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true,
                      fontColor: 'white'
                    }
                  }],
                  xAxes: [{
                    ticks: {
                        fontColor: 'white'
                    },
                }]
                }
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="goBack">
            <button class="btn waves-effect waves-light col s6 offset-s3 m3 offset-m5 l2 offset-l5" type="submit" name="action" onClick={() => props.history.goBack()}>
              Main Menu
              <i class="material-icons left">send</i>
            </button>
          </div>
        </div>
      </div>
    )
}

const mapStateToProps = state => {
  return {
    vacations: state.getVacations
  }
}


export default connect(mapStateToProps, null) (Chart)
