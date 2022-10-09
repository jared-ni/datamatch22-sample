import React, { Component } from 'react';
import { extent, max, descending, tickStep, range } from 'd3';
import { json } from 'd3-fetch';
import { select, selectAll, mouse } from 'd3-selection';
import { path } from 'd3-path';
import { scaleOrdinal, scaleLinear, scaleTime } from 'd3-scale';
import { bisector, sum } from 'd3-array';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { line, curveBasis, arc } from 'd3-shape';
import { chord, ribbon } from 'd3-chord';

import Select from 'components/Select';

import { firebaseConnect } from 'react-redux-firebase';
import { getJSON } from 'utils/stats';
import settings from 'constants/config.json';

const colleges = Object.keys(settings.college_to_email);

const d3 = {
  select,
  selectAll,
  mouse,
  path,
  descending,
  chord,
  scaleOrdinal,
  scaleLinear,
  scaleTime,
  schemeCategory10,
  line,
  json,
  extent,
  max,
  curveBasis,
  bisector,
  ribbon,
  arc,
  sum,
  tickStep,
  range,
};

const colorsArray = [
  '#3dc397',
  '#e053ad',
  '#4ea40c',
  '#cba85d',
  '#b37ebb',
  '#0090f6',
  '#930f91',
  '#c43ddf',
  '#45d0f7',
  '#d518af',
  '#8a1167',
  '#13add4',
  '#83fddb',
  '#53f71d',
  '#25aa13',
  '#275482',
  '#1eb882',
  '#bf4772',
  '#6828cb',
  '#1ca283',
  '#c325c8',
  '#798434',
  '#52f957',
  '#660fb6',
  '#54c830',
  '#060358',
  '#dea114',
  '#3616d5',
  '#8f01aa',
  '#c946d2',
  '#b216a1',
];

class YearMatches extends Component {
  constructor(props) {
    super(props);
    this.state = {
      school: this.props.college,
      data: null,
      x: 0,
      y: 0,
    };

    this.createChord = this.createChord.bind(this);
  }

  async componentDidMount() {
    const dataURL = await this.props.firebase
      .storage()
      .ref('stats/year-matches.json')
      .getDownloadURL();
    try {
      const data = await getJSON(dataURL);
      this.setState({ data });
    } catch (e) {
      console.error(e);
    }
  }

  componentDidUpdate() {
    var schoolsList = colleges;

    if (!schoolsList.includes(this.state.school)) {
      // default to Harvard
      this.setState({ school: 'Harvard' });
      this.createChord(this.state.data['Harvard']);
    } else {
      this.createChord(this.state.data[this.state.school]);
    }
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  createChord(selectedData) {
    // --------global variables-------
    // var margin = { top: 30, right: 30, bottom: 30, left: 30 };

    var parentWidth = d3.select('#years-chord').node().getBoundingClientRect()
      .width;
    var width = Math.min(700, parentWidth);
    var height = width;

    var xOffset = width > 400 ? 250 : 150;
    var yOffset = height > 400 ? -200 : -125;

    var outerRadius = width * 0.4 - 10;
    var innerRadius = outerRadius - 10;

    var chord = d3
      .chord()
      .padAngle(10 / innerRadius)
      .sortSubgroups(d3.descending)
      .sortChords(d3.descending);

    var ribbon = d3.ribbon().radius(innerRadius - 1);
    //.padAngle(1 / innerRadius);

    var arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    //--------end of global variables--------

    var input = selectedData;

    // ---create index array of Year names: ["2021": 0, "2022": 1, ..]---
    var namesArray = [];
    var yearIndex = [];
    var i = 0;
    for (let year in input.link_repeats) {
      namesArray.push(year);
      yearIndex[year] = i;
      i += 1;
    }

    // ---for each year compute top 3, result: [["year1", 32], ["year2", 40], ["year3", 8]]---
    var dataMatrix = [];
    for (let year in input.link_repeats) {
      var matches = [];
      var values = [];

      // find match values
      for (var match in input.link_repeats[year]) {
        if (namesArray.includes(match)) {
          matches.push([match, input.link_repeats[year][match]]);
          values.push(input.link_repeats[year][match]);
        }
      }

      var sorted_val = values.sort(function (a, b) {
        return b - a;
      });

      var threshold = sorted_val[3];
      var top3 = [];

      for (let i = 0; i < matches.length; i++) {
        if (matches[i][1] >= threshold) {
          top3.push(matches[i]);
        }
      }

      var yearData = [];
      for (let i = 0; i < namesArray.length; i++) {
        yearData.push(0);
      }

      for (let i = 0; i < 4; i++) {
        if (top3[i] !== undefined) {
          yearData[yearIndex[top3[i][0]]] = top3[i][1];
        }
      }

      dataMatrix.push(yearData);
    }

    var data = Object.assign(dataMatrix, {
      names: namesArray,
      colors: colorsArray,
    });

    // Load data
    var names = data.names === undefined ? d3.range(data.length) : data.names;
    var colors =
      data.colors === undefined
        ? d3.quantize(d3.interpolateRainbow, names.length)
        : data.colors;

    // Define variables
    var color = d3.scaleOrdinal(names, colors);
    var tickStep = d3.tickStep(0, d3.sum(data.flat()), 100);
    function ticks({ startAngle, endAngle, value }) {
      const k = (endAngle - startAngle) / value;
      return d3.range(0, value, tickStep).map(value => {
        return { value, angle: value * k + startAngle };
      });
    }

    d3.select('#years-chord').select('svg').remove();
    d3.select('#years-chord').select('.tooltip').remove();

    var svg = d3
      .select('#years-chord')
      .append('svg')
      .attr('id', 'chart-area')
      .style('width', width + 'px')
      .style('height', height + 'px')
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .append('g')
      .attr('id', 'chart-area');

    var chords = chord(data);

    var group = svg
      .selectAll('g')
      .append('g')
      .attr('font-size', 10)
      .attr('font-family', 'sans-serif')
      .data(chords.groups)
      .enter()
      .append('g');

    // hover tooltip properties
    var tooltip = d3
      .select('#years-chord')
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('width', '200px')
      .style('position', 'relative')
      .style('border-width', '2px')
      .style('border-radius', '1px')
      .style('font-size', '12px')
      .style('text-align', 'center');

    // drawing groups (arc and ribbon) + creating hover functions
    group
      .append('path')
      .attr('class', 'group')
      .attr('fill', d => color(names[d.index]))
      .attr('d', arc)
      .attr('opacity', '0.4')
      .on('mouseover', function (d, i) {
        svg
          .selectAll('.group')
          .filter(function (d) {
            return d.index === i;
          })
          .transition()
          .duration('100')
          .attr('opacity', '1');

        svg
          .selectAll('.ribbons')
          .filter(function (d) {
            return d.source.index === i || d.target.index === i;
          })
          .transition()
          .duration('100')
          .attr('opacity', '1');

        var top3String = '';
        for (let m = 0; m < dataMatrix.length; m++) {
          let num = dataMatrix[d.index][m];
          if (num !== 0) {
            top3String =
              top3String +
              namesArray[m] +
              '&#x2192\n ' +
              num.toString() +
              ' matches <br />';
          }
        }

        tooltip.style('opacity', 1);
        tooltip
          .html(
            namesArray[d.index] +
              ' residents were most commonly matched with: <br />' +
              top3String,
          )
          .style('left', d3.mouse(this)[0] + xOffset + 'px')
          .style('top', d3.mouse(this)[1] + yOffset + 'px')
          .style('font-weight', 'bold')
          .style('background', colorsArray[d.index] + '40');
      })
      .on('mouseout', function (d, i) {
        svg
          .selectAll('.group')
          .filter(function (d) {
            return d.index === i;
          })
          .transition()
          .duration('100')
          .attr('opacity', '0.4');
        svg
          .selectAll('.ribbons')
          .filter(function (d) {
            return d.source.index === i || d.target.index === i;
          })
          .transition()
          .duration('100')
          .attr('opacity', '0.4');
        tooltip.style('opacity', 0);
        tooltip.style('background', '#ffffff');
      });

    var groupTick = group
      .append('g')
      .selectAll('g')
      .data(ticks)
      .join('g')
      .attr(
        'transform',
        d =>
          `rotate(${
            (d.angle * 180) / Math.PI - 90
          }) translate(${outerRadius},0)`,
      );

    //TODO maybe don't render on mobile
    groupTick
      .append('text')
      .attr('x', 8)
      .style('font-size', 11)
      .attr('dy', '0.35em')
      .attr('transform', d =>
        d.angle > Math.PI ? 'rotate(180) translate(-16)' : null,
      )
      .attr('text-anchor', d => (d.angle > Math.PI ? 'end' : null));

    group
      .select('text')
      // .attr("font-weight", "bold")
      .text(function (d) {
        return this.getAttribute('text-anchor') === 'end'
          ? `↑ ${names[d.index]}`
          : `${names[d.index]} ↓`;
      });

    // creating ribbons + defining hover functions
    svg
      .append('g')
      .attr('fill-opacity', 0.8)
      .selectAll('path')
      .data(chords)
      .enter()
      .append('path')
      .attr('class', 'ribbons')
      .style('mix-blend-mode', 'multiply')
      .attr('fill', d => color(names[d.source.index]))
      .attr('d', ribbon)
      .attr('opacity', '0.4')
      .on('mouseover', function (d, i) {
        d3.select(this).transition().duration('100').attr('opacity', '1');
        tooltip.style('opacity', 1);
        if (d.source.index === d.target.index) {
          tooltip
            .html(
              d.source.value + ' matches within ' + namesArray[d.source.index],
            )
            .style('left', d3.mouse(this)[0] + xOffset + 'px')
            .style('top', d3.mouse(this)[1] + yOffset + 'px')
            .style('background', colorsArray[d.source.index] + '40');
        } else {
          tooltip
            .html(
              d.source.value +
                ' matches between ' +
                namesArray[d.source.index] +
                ' and ' +
                namesArray[d.target.index],
            )
            .style('left', d3.mouse(this)[0] + xOffset + 'px')
            .style('top', d3.mouse(this)[1] + yOffset + 'px')
            .style('background', colorsArray[d.source.index] + '40');
        }
      })
      .on('mouseout', function (d, i) {
        d3.select(this).transition().duration('100').attr('opacity', '0.4');
        tooltip.style('opacity', 0);
        tooltip.style('background', '#ffffff');
      });
  }

  render() {
    const { school } = this.state;
    const exclude = ['Top 10 Schools'];
    const schoolsList = colleges.filter(d => !exclude.includes(d));

    return (
      <div className="years-matches-container">
        <Select
          className="stats-select"
          handleInputChange={this.handleInputChange}
          name="school"
          placeholder="School"
          value={school}
          values={schoolsList}
        />
        <br />
        <div id="years-chord" />
      </div>
    );
  }
}

export default firebaseConnect()(YearMatches);
