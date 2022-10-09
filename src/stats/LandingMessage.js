/** @jsx jsx */

import { Component } from 'react';
import { jsx, css } from '@emotion/core';
import { keys, stack, map, csvParse, sum } from 'd3';
import { max } from 'd3-array';
import { select, selectAll, mouse } from 'd3-selection';
import { path } from 'd3-path';
import { scaleBand, scaleOrdinal, scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft, axisTop } from 'd3-axis';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { Greetings } from 'constants/Greetings';
import Select from 'components/Select';

import { firebaseConnect } from 'react-redux-firebase';
import { getJSON } from 'utils/stats';
import colors from 'constants/GraphColors';

const d3 = {
  csvParse,
  map,
  max,
  sum,
  select,
  selectAll,
  mouse,
  stack,
  path,
  scaleBand,
  scaleOrdinal,
  scaleLinear,
  keys,
  axisTop,
  axisBottom,
  axisLeft,
  schemeCategory10,
};

const landingPageStyle = css`
  .column-container {
    display: flex;
    flex-direction: column;
    justify-content: start;
  }
  .waffle {
    margin-left: 20px;
    margin-top: 20px;
    width: 70%;
  }
  #waffle-text {
    margin-left: 20px
    white-space: pre-line;
    text-align: center;
  }
  @media only screen and (max-width: 800px) {
    .waffle {
      width: 90%;
    }
    #waffle-text {
      white-space: pre-line;
    }
  }
`;

const colleges = [
  'Harvard',
  'Bates',
  'BC',
  'BU',
  'Brown',
  'Caltech',
  'Carleton',
  'CMU',
  'Claremont',
  'Columbia',
  'Dartmouth',
  'FIT',
  'Furman',
  'Harvard-MIT',
  'LMU',
  'McGill',
  'MIT',
  'NYU',
  'Princeton',
  'Smith',
  'UC Davis',
  'UCLA',
  'UCSD',
  'UChicago',
  'UIUC',
  'UPenn',
  'USC',
  'UW Madison',
  'Vanderbilt',
  'WashU',
  'Wesleyan',
  'Williams',
  'Yale',
];

class LandingMesssage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      school: this.props.college,
      data: {},
    };
  }

  async componentDidMount() {
    const dataURL = await this.props.firebase
      .storage()
      .ref('stats/landing_message.json')
      .getDownloadURL();
    try {
      const data = await getJSON(dataURL);
      this.setState({ data: data });
      let filteredData = data[this.state.school];
      this.initialize(filteredData);
    } catch (e) {
      console.error(e);
    }
  }

  async componentDidUpdate() {
    const data = this.state.data;
    let filteredData = data[this.state.school];
    this.initialize(filteredData);
  }

  handleInputChange = event => {
    const { value } = event.target;
    this.setState({ school: value });
  };

  initialize(data) {
    let width,
      height,
      widthSquares = 10,
      heightSquares = 10,
      squareSize = 18,
      squareValue = 0,
      gap = 3,
      theData = [],
      totalSquares = widthSquares * heightSquares;

    let total = Object.values(data).reduce((a, b) => a + b);
    let color = d3.scaleOrdinal(colors);

    squareValue = total / totalSquares;

    for (let i in data) {
      let units = Math.round(data[i] / squareValue);
      theData = theData.concat(
        Array(units + 1)
          .join(1)
          .split('')
          .map(function () {
            return {
              squareValue: squareValue,
              units: units,
              population: data[i],
              groupIndex: i,
            };
          }),
      );
    }
    while (theData.length < totalSquares) {
      let last = theData.slice(-1)[0];

      theData = theData.concat(last);
    }
    if (theData.length > totalSquares) {
      theData = theData.slice(0, totalSquares);
    }

    width = squareSize * widthSquares + widthSquares * gap + 25;
    height = squareSize * heightSquares + heightSquares * gap + 25;

    d3.select('.waffle').select('svg').remove();

    let svg = d3
      .select('.waffle')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    let school = this.state.school;

    svg
      .append('g')
      .selectAll('div')
      .data(theData)
      .enter()
      .append('rect')
      .attr('width', squareSize)
      .attr('height', squareSize)
      .attr('class', d => 'class' + d.groupIndex)
      .attr('fill', function (d) {
        return color(d.groupIndex);
      })
      .attr('x', function (d, i) {
        //group n squares for column
        let col = Math.floor(i / heightSquares);
        return col * squareSize + col * gap;
      })
      .attr('y', function (d, i) {
        let row = i % heightSquares;
        return heightSquares * squareSize - (row * squareSize + row * gap);
      })
      .on('mouseover', function (d) {
        const classNameOfNodes = 'class' + d.groupIndex;

        var element = d3.selectAll('.' + classNameOfNodes)['_groups'][0];

        element.forEach(function (target, i) {
          element[i].setAttribute('opacity', '0.75');
        });

        d3.select('#waffle-text').transition().duration(0).style('opacity', 1);
        let greeting;
        if (d.groupIndex < Greetings.default.length) {
          greeting = Greetings.default[d.groupIndex];
        } else {
          const greetings = [...Greetings['default'], ...Greetings[school]];
          greeting = greetings[d.groupIndex];
        }
        d3.select('#waffle-text').text(
          ((d['population'] / total) * 100).toFixed(2) +
            '%' +
            ' of ' +
            school +
            ' users chose "' +
            greeting +
            '"' +
            'as their greeting',
        );
      })
      .on('mouseout', function (d) {
        d3.select('#waffle-text').transition().duration(0).style('opacity', 0);

        const classNameOfNodes = 'class' + d.groupIndex;

        var element = d3.selectAll('.' + classNameOfNodes)['_groups'][0];
        element.forEach(function (target, i) {
          element[i].setAttribute('opacity', '1');
        });
      });
  }

  render() {
    const { school } = this.state;

    return (
      <div css={landingPageStyle}>
        <Select
          className="stats-select"
          handleInputChange={this.handleInputChange}
          name="school"
          placeholder="School"
          value={school}
          values={colleges}
        />
        <br />
        <div className="column-container">
          <div className="waffle"></div>
          <div id="waffle-text"></div>
        </div>
      </div>
    );
  }
}

export default firebaseConnect()(LandingMesssage);
