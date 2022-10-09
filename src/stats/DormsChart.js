import React, { Component } from 'react';
import { firebaseConnect } from 'react-redux-firebase';
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

import Select from 'components/Select';
import colors from 'constants/GraphColors';
import settings from 'constants/config.json';
import { getJSON } from 'utils/stats';

const colleges = Object.keys(settings.college_to_email);

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

class DormsChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      school: this.props.college,
      allData: {},
    };
  }

  async componentDidMount() {
    const dataURL = await this.props.firebase
      .storage()
      .ref('stats/dormtotals.json')
      .getDownloadURL();
    try {
      const data = await getJSON(dataURL);
      this.setState({ allData: data });
      this.initialize(data[this.state.school]);
    } catch (e) {
      console.error(e);
    }
  }

  async componentDidUpdate() {
    const data = this.state.allData;
    this.initialize(data[this.state.school]);
  }

  handleInputChange = event => {
    const { value } = event.target;
    this.setState({ school: value });
  };

  initialize(data) {
    var parentWidth = d3.select('#dorms-chart').node().getBoundingClientRect()
      .width;
    var width = Math.min(300, parentWidth);
    var height = width;

    let margin = 50;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin;
    d3.select('#dorms-chart').select('svg').remove();
    var innerRadius = 60;

    // append the svg object to the div
    var svg = d3
      .select('#dorms-chart')
      .append('svg')
      .attr('viewbox', [0, 0, width, height])
      .append('g')
      .attr(
        'transform',
        'translate(' + (width / 2 - 25) + ',' + height / 2 + ')',
      );

    let dataTotal = Object.values(data).reduce((a, b) => a + b, 0);
    // set the color scale
    var color = d3.scaleOrdinal(colors);

    // Compute the position of each group on the pie:
    var pie = d3.pie().value(function (d) {
      return d.value;
    });
    var data_ready = pie(d3.entries(data));

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll('path')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', d3.arc().innerRadius(innerRadius).outerRadius(radius))
      .attr('fill', function (d) {
        return color(d.data.key);
      })
      .attr('stroke', 'white')
      .style('stroke-width', '1px')
      .on('mouseover', function (d, i) {
        d3.select(this).transition().duration('50').attr('opacity', '.85');
        tip.show(d, this);
        d3.select(this).style('cursor', 'pointer');
      })
      .on('mouseout', function (d, i) {
        d3.select(this).transition().duration('50').attr('opacity', '1');

        tip.hide(d, this);
        d3.select(this).style('cursor', 'default');
      });

    var legendRectSize = 15;
    var legendSpacing = 7;

    if (Object.keys(data).length <= 12) {
      var legend = svg
        .selectAll('.legend') //the legend and placement
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'circle-legend')
        .attr('transform', function (d, i) {
          var height = legendRectSize + legendSpacing;
          var offset = (height * color.domain().length) / 2;
          var horz = radius + margin;
          var vert = i * height - offset;
          return 'translate(' + horz + ',' + vert + ')';
        });
      legend
        .append('circle') //keys
        .style('fill', color)
        .style('stroke', color)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', '.5rem');
      legend
        .append('text') //labels
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .attr('font-size', '14px')
        .text(function (d) {
          return d;
        });
    }
    let school = this.state.school;
    var tip = d3Tip()
      .attr('class', 'd3-tip')
      .html(function (d) {
        return (
          d.data.key +
          ': ' +
          ((d.data.value / dataTotal) * 100).toString().substr(0, 4) +
          '% of ' +
          school +
          ' users (' +
          d.data.value +
          '/' +
          dataTotal +
          ')'
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
    let school = this.state.school;

    let schools = colleges.filter(d => d !== 'Top 10 Schools');

    return (
      <div>
        <Select
          className="stats-select"
          handleInputChange={this.handleInputChange}
          name="school"
          placeholder="School"
          value={school}
          values={schools}
        />
        <div id="dorms-chart"></div>
      </div>
    );
  }
}

export default firebaseConnect()(DormsChart);
