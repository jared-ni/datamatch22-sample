import React, { Component } from 'react';
import { csv, keys, extent, stack, map, csvParse } from 'd3';
import { max } from 'd3-array';
import { pie, arc } from 'd3-shape';
import { entries } from 'd3-collection';
import { select, selectAll, mouse } from 'd3-selection';
import { timeMinute, timeDay } from 'd3-time';
import { timeFormat } from 'd3-time-format';
import { path } from 'd3-path';
import { legendColor } from 'd3-svg-legend';
import { scaleBand, scaleOrdinal, scaleLinear, scaleTime } from 'd3-scale';
import { bisector } from 'd3-array';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { axisBottom, axisLeft, axisTop } from 'd3-axis';
import d3Tip from 'd3-tip';

import { firebaseConnect } from 'react-redux-firebase';
import { getJSON } from 'utils/stats';

const d3 = {
  arc,
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
  pie,
  legendColor,
  csv,
  keys,
  extent,
  entries,
  schemeCategory10,
  axisTop,
  axisBottom,
  axisLeft,
  bisector,
  timeMinute,
  timeDay,
  timeFormat,
};

class LifeSatisfaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      school: this.props.college,
      filter: this.props.filter,
    };
  }

  async componentDidMount() {
    const dataURL = await this.props.firebase
      .storage()
      .ref('stats/life_sat.json')
      .getDownloadURL();
    try {
      const data = await getJSON(dataURL);
      this.initialize(
        data[this.props.filter],
        '#' + this.props.filter,
        this.props.yAxis,
      );
    } catch (e) {
      console.error(e);
    }
  }

  initialize(data, graphID, yAxisLabel) {
    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
      width = 200 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select(graphID)
      .append('svg')
      .attr('viewbox', [0, 0, width, height])
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var xScale = ['0', '1.0', '2.0', '3.0', '4.0', '5.0', '6.0', '7.0', '8.0'];
    var yScale = ['0', '1.0', '2.0', '3.0', '4.0', '5.0', '6.0', '7.0', '8.0'];

    // Build X scales and axis:
    var x = d3.scaleBand().range([0, width]).domain(xScale).padding(0.01);
    svg
      .append('g')
      .attr('transform', 'translate(0,' + (height - 20) + ')')
      .call(d3.axisBottom(x));

    // Build X scales and axis:
    var y = d3.scaleBand().range([height, 0]).domain(yScale).padding(0.01);
    svg
      .append('g')
      .attr('transform', 'translate(0,' + -20 + ')')
      .call(d3.axisLeft(y));

    // Build color scale
    var myColor = d3
      .scaleLinear()
      .range(['#FFE8F4', '#78204C'])
      .domain([1, 100]);

    svg
      .append('text')
      .attr('class', 'x label')
      .attr('text-anchor', 'end')
      .attr('x', width - 150)
      .attr('y', height + 40)
      .attr('transform', 'translate(100, 0)')
      .text('Life Satisfaction');

    svg
      .append('text')
      .attr('class', 'y label')
      .attr('text-anchor', 'start')
      .attr('x', -150)
      .attr('y', height - 225)
      .attr('transform', 'rotate(-90)')
      .text(yAxisLabel);

    var graph = svg.selectAll('rect');
    graph
      .data(data, function (d) {
        return d['x'] + ':' + d['y'];
      })
      .enter()
      .append('rect')
      .merge(graph)
      .attr('x', function (d) {
        return x(d.x);
      })
      .attr('y', function (d) {
        return y(d.y);
      })
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', function (d) {
        return myColor(d.count);
      })
      .on('mouseover', function (d, i) {
        tip.show(d, this);
        d3.select(this).style('cursor', 'pointer');
      })
      .on('mouseout', function (d, i) {
        tip.hide(d, this);
        d3.select(this).style('cursor', 'default');
      });
    graph.exit().remove();

    var tip = d3Tip()
      .attr('class', 'd3-tip')
      .html(function (d) {
        return d['count'];
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
      <div>
        <div id={this.props.filter}></div>
      </div>
    );
  }
}

export default firebaseConnect()(LifeSatisfaction);
