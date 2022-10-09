import React, { Component } from 'react';
import { csv, keys, extent, stack, map, csvParse } from 'd3';
import { max } from 'd3-array';
import { select, selectAll, mouse } from 'd3-selection';
import { timeMinute, timeDay } from 'd3-time';
import { timeFormat } from 'd3-time-format';
import { path } from 'd3-path';
import { scaleBand, scaleOrdinal, scaleLinear, scaleTime } from 'd3-scale';
import { bisector } from 'd3-array';
import { schemePaired } from 'd3-scale-chromatic';
import { axisBottom, axisLeft, axisTop } from 'd3-axis';

import { firebaseConnect } from 'react-redux-firebase';
import { getCSV } from 'utils/stats';
import d3Tip from 'd3-tip';
import * as d3Legend from 'd3-svg-legend';

const d3 = {
  csvParse,
  map,
  max,
  select,
  selectAll,
  mouse,
  stack,
  path,
  scaleBand,
  scaleOrdinal,
  scaleLinear,
  scaleTime,
  csv,
  keys,
  extent,
  schemePaired,
  axisTop,
  axisBottom,
  axisLeft,
  bisector,
  timeMinute,
  timeDay,
  timeFormat,
};

class MatchesYear extends Component {
  constructor(props) {
    super(props);

    this.state = { x: 0, y: 0 };
  }

  async componentDidMount() {
    const dataURL = await this.props.firebase
      .storage()
      .ref('stats/year.csv')
      .getDownloadURL();
    try {
      const data = await getCSV(dataURL);
      this.initialize(data);
    } catch (e) {
      console.error(e);
    }
  }

  _onMouseMove(e) {
    this.setState({ x: e.screenX, y: e.screenY });
  }

  initialize(data) {
    let width = 400,
      height = 700;

    let buffer = 40;

    // let data;
    let margin = { top: 60, right: 40, left: 30, bottom: 50 };
    width -= margin.left + margin.right;
    height -= margin.bottom + margin.top;

    let matchYear = d3
      .select('#match-year')
      .append('svg')
      .attr('viewBox', [0, 0, 600, 300])
      .append('g')
      .attr(
        'transform',
        'translate(' + (margin.left + buffer) + ',' + margin.top + ')',
      );
    this.graphMatchProb(matchYear, data, 'year', width, height - buffer);
  }

  graphMatchProb(svg, file, demo, height, width) {
    // Load the file
    let data = d3.csvParse(file);

    let match = data.columns.slice(1, 4);
    let demographic = d3
      .map(data, function (d) {
        return d[demo];
      })
      .keys();

    let y = d3
      .scaleBand()
      .domain(demographic)
      .rangeRound([0, height])
      .paddingInner(0.2);

    svg
      .append('g')
      .attr('class', 'x-axis axis') // change style?
      .call(d3.axisLeft(y))
      .attr('font-size', '15px');

    svg
      .append('text')
      .attr('transform', 'translate(' + width / 2 + ' , -25)')
      .style('text-anchor', 'middle')
      .style('font-size', '20px')
      .text('Proportion of Students Matched');

    let x = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return +d.total;
        }),
      ])
      .range([0, width]);

    svg.append('g').call(d3.axisTop(x)).attr('font-size', '15px');

    let matchColor = d3
      .scaleOrdinal()
      .domain(match)
      .range(['#ec9697', '#f5e3e3', '#dedef0']);

    let stackedData = d3.stack().keys(match)(data);

    svg
      .append('g')
      .selectAll('g')
      .data(stackedData)
      .enter()
      .append('g')
      .attr('fill', function (d) {
        return matchColor(d.key);
      })
      .selectAll('rect')
      .data(function (d) {
        return d;
      })
      .enter()
      .append('rect')
      .attr('y', function (d) {
        return y(d.data[demo]);
      })
      .attr('x', function (d) {
        return x(d[0]);
      })
      .attr('width', function (d) {
        return x(d[1]) - x(d[0]);
      })
      .attr('height', y.bandwidth())
      .on('mouseover', function (d, i) {
        tip.show(d, this);
        d3.select(this).style('cursor', 'pointer');
      })
      .on('mouseout', function (d, i) {
        tip.hide(d, this);
        d3.select(this).style('cursor', 'default');
      });

    svg
      .append('g')
      .attr('class', 'legendYear')
      .attr(
        'transform',
        'translate(' + (width - 60) + ', ' + (height - 60) + ')',
      ) //TODO space this correctly
      .style('font-size', '1.2em');

    var legend = d3Legend.legendColor().orient('vertical').scale(matchColor);

    svg.select('.legendYear').call(legend);

    var tip = d3Tip()
      .attr('class', 'd3-tip')
      .html(function (d) {
        return (
          ((d[1] - d[0]) * 100).toString().substr(0, 4) +
          '% (' +
          (d.data.total * 100).toString().substr(0, 4) +
          '% of total)'
        );
      })
      .attr('dy', -10)
      .style('background', '#fff')
      .style('color', 'black')
      .style('line-height', 1)
      .style('font-size', '0.8em')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none');

    svg.call(tip);
  }

  render() {
    return (
      <div id="match-year" onMouseMove={this._onMouseMove.bind(this)}></div>
    );
  }
}

export default firebaseConnect()(MatchesYear);
