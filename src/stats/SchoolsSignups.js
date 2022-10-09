import React, { Component } from 'react';
import moment from 'moment';
import { json, keys, extent, max } from 'd3';
import { select, selectAll, mouse } from 'd3-selection';
import { timeMinute, timeDay } from 'd3-time';
import { timeFormat } from 'd3-time-format';
import { path } from 'd3-path';
import { scaleOrdinal, scaleLinear, scaleTime } from 'd3-scale';
import { bisector } from 'd3-array';
import { schemePaired } from 'd3-scale-chromatic';
import { axisBottom, axisLeft } from 'd3-axis';
import { line, curveBasis } from 'd3-shape';
import { queue } from 'd3-queue';
import { forceSimulation, forceCollide, forceY } from 'd3-force';
import MultiSelect from 'react-multi-select-component';
import Select from 'components/Select.js';

import schoolPops from 'constants/CollegePopulations';
import settings from 'constants/config.json';

const schools = Object.keys(settings.college_to_email);

const MINUTE_INTERVAL = 20;

const d3 = {
  select,
  selectAll,
  mouse,
  path,
  scaleOrdinal,
  scaleLinear,
  scaleTime,
  line,
  json,
  keys,
  extent,
  max,
  curveBasis,
  schemePaired,
  axisBottom,
  axisLeft,
  forceSimulation,
  forceCollide,
  forceY,
  bisector,
  queue,
  timeMinute,
  timeDay,
  timeFormat,
};

const colors = [
  '#c42a1f',
  '#294c85',
  '#962a88',
  '#1fb822',
  '#b0511a',
  '#32dbd0',
  '#0e3d5e',
  '#1d968e',
  '#821d1a',
  '#2d53eb',
  '#0c5203',
  '#8ec1e6',
  '#f08f4f',
  '#26222b',
  '#bc9fe0',
  '#075c51',
  '#5ce29f',
  '#c2110b',
  '#572603',
  '#ff6a03',
  '#006e68',
  '#000000',
  '#4d801f',
  '#cadbba',
  '#bad9db',
  '#675c99',
  '#bf0659',
  '#29207c',
  '#4e7c85',
  '#e05757',
  '#6d804d',
  '#b35249',
  '#2b8020',
];

export default class SchoolsSignups extends Component {
  width;
  height;
  smallScreen;

  constructor(props) {
    super(props);
    const selected = [{ label: this.props.college, value: this.props.college }];

    this.state = {
      college: this.props.college,
      selected: selected,
      sortType: 'Total',
      yScale: null,
      yAxis: null,
      chart: null,
      dataGroup: null,
      data: null,
      line: null,
    };
  }

  transformData = data => {
    const newData = {};
    const { users = {} } = data || {};
    const intervalsPerDay = 72;
    const index = Math.min(
      Object.keys(users.Harvard || {}).length,
      intervalsPerDay * 7 + 3,
    ); //Cut it off after 1am on 2/14
    Object.keys(users).forEach(college => {
      const collegeData = [];
      for (let i = 0; i < index; i++) {
        collegeData.push(users[college][i]);
      }
      newData[college] = collegeData;
    });
    return newData;
  };

  componentDidMount() {
    this.initialize(this.transformData(this.props.data || {}));
  }

  getTopTen(data) {
    const maxYValues = data.map(d => [
      d.name,
      d3.max(d.values, value => value.signups),
    ]);
    let topTen = maxYValues.sort((a, b) => b[1] - a[1]).splice(0, 10);
    let topNames = topTen.map(d => d[0]);
    return topNames;
  }

  handleSchoolsChange = selected => {
    const selectedSchools = selected.map(d => d.value);
    const data = this.state.data;
    if (selectedSchools.includes('Top 10 Schools')) {
      let topTenSchools = this.getTopTen(data);
      selected = [{ label: 'Top 10 Schools', value: 'Top 10 Schools' }];
      for (let d of data) {
        d.selected = topTenSchools.includes(d.name);
      }
    } else {
      const data = this.state.data;
      for (let d of data) {
        d.selected = selectedSchools.includes(d.name);
      }
    }
    this.updateChart(
      data,
      this.state.yScale,
      this.state.chart,
      this.state.yAxis,
      this.state.dataGroup,
      this.state.line,
    );
    this.setState({ selected: selected });
  };

  handleSortTypeChange = event => {
    const { name, value } = event.target;
    const selectedSchools = this.state.selected.map(d => d.value);

    const data = this.state.data;
    for (let d of data) {
      d.values = value === 'Percentage' ? d.percentValues : d.totalValues;
    }

    if (selectedSchools.includes('Top 10 Schools')) {
      let topTenSchools = this.getTopTen(data);
      for (let d of data) {
        d.selected =
          topTenSchools.includes(d.name) || selectedSchools.includes(d.name);
      }
    }

    this.updateChart(
      data,
      this.state.yScale,
      this.state.chart,
      this.state.yAxis,
      this.state.dataGroup,
      this.state.line,
    );

    d3.selectAll('.chart-label').html(d =>
      this.getLabel(d.name, d.values[d.values.length - 1].signups, value),
    );

    this.setState({ [name]: value || null, data: data });
  };

  initialize(data) {
    var margin = { top: 20, right: 150, bottom: 30, left: 40 };
    var self = this;
    this.height = 480 - margin.top - margin.bottom;

    var parentWidth = d3
      .select('#schools-signups')
      .node()
      .getBoundingClientRect().width;
    this.smallScreen = parentWidth < 400;

    if (this.smallScreen) {
      margin.right = 50; // Don't display school names in labels to save space
      this.width = parentWidth - margin.left - margin.right;
    }

    this.width = Math.min(parentWidth, 1000) - margin.left - margin.right;
    this.height = Math.min(this.width, 500 - margin.top - margin.bottom);

    //http://bl.ocks.org/DStruths/9c042e3a6b66048b5bd4

    const svg = d3
      .select('#schools-signups')
      .append('svg')
      .attr('width', Math.min(1000, parentWidth))
      .attr('height', this.height + margin.top + margin.bottom);
    const chart = svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Process data.
    const users = data || {};

    const startDate = new Date(2022, 2, 7);
    const diff = MINUTE_INTERVAL * (users['Harvard'] || []).length;
    const endDate = moment(startDate).add(diff, 'm').toDate();
    const dateArray = d3.timeMinute
      .every(MINUTE_INTERVAL)
      .range(startDate, endDate);

    data = Object.entries(users).map(([school, arr], idx) => {
      const schoolPop = schoolPops[school];
      return {
        id: idx,
        name: school,
        totalValues: arr.map(function (d, i) {
          return { date: dateArray[i], signups: d };
        }),
        percentValues: arr.map(function (d, i) {
          return { date: dateArray[i], signups: (100 * d) / schoolPop };
        }),
        values: arr.map(function (d, i) {
          return { date: dateArray[i], signups: d };
        }),
        selected: school === this.state.college,
      };
    });

    // Initialize scales and axes
    const colorScale = d3
        .scaleOrdinal()
        .domain(Object.keys(users))
        .range(colors),
      xScale = d3
        .scaleTime()
        .range([0, this.width])
        .domain([startDate, endDate]),
      yScale = d3
        .scaleLinear()
        .range([this.height, 0])
        .domain([0, d3.max(data, c => d3.max(c.values, v => v.signups))]);

    const xAxis = d3
      .axisBottom()
      .scale(xScale)
      .tickFormat(d3.timeFormat('%a %d'));
    const yAxis = d3.axisLeft().scale(yScale).tickSizeOuter(0);

    // Draw line graph
    chart
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(xAxis.ticks(d3.timeDay.every(1))); // one tick per day
    chart.append('g').attr('class', 'y axis').call(yAxis);

    const dataGroup = chart
      .selectAll('.data-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'data-group');

    const line = d3
      .line()
      .curve(d3.curveBasis)
      .x(d => xScale(d.date))
      .y(d => yScale(d.signups))
      .defined(d => d.signups);

    dataGroup
      .append('path')
      .attr('class', 'line')
      .style('pointer-events', 'none')
      .attr('id', d => 'line-' + d.id)
      .attr('d', d => (d.selected ? line(d.values) : null))
      .style('stroke', d => colorScale(d.name))
      .style('fill', 'none');

    self.drawLabels(data, yScale, chart);

    // Add mouseover
    // https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
    const mouseG = chart.append('g').attr('class', 'mouse-over-effects');

    const mousePerLine = mouseG
      .selectAll('.mouse-per-line')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'mouse-per-line');

    mousePerLine
      .append('circle')
      .attr('r', 4)
      .style('stroke', d => colorScale(d.name))
      .style('fill', 'none')
      .style('stroke-width', '1px')
      .style('opacity', '0');

    let lines = document.getElementsByClassName('line');

    mouseG
      .append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', this.width) // can't catch mouse events on a g element
      .attr('height', this.height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function () {
        // on mouse out hide circles and text
        d3.selectAll('.mouse-per-line circle').style('opacity', '0');
        d3.selectAll('.mouse-per-line text').style('opacity', '0');
        // set label to most recent signups number
        d3.selectAll('.chart-label').html(d =>
          self.getLabel(d.name, d.values[d.values.length - 1].signups),
        );
      })
      .on('mouseover', function () {
        // on mouse in show circles and text
        d3.selectAll('.mouse-per-line circle').style('opacity', d =>
          d.selected ? 1 : 0,
        );
        d3.selectAll('.mouse-per-line text').style('opacity', d =>
          d.selected ? 1 : 0,
        );
      })
      .on('mousemove', function () {
        // mouse moving over canvas
        var mouse = d3.mouse(this);

        d3.selectAll('.mouse-per-line').attr('transform', function (d, i) {
          if (d.selected) {
            var beginning = 0,
              end = lines[i].getTotalLength(),
              target = null;

            let pos;
            while (true) {
              target = Math.floor((beginning + end) / 2);
              try {
                pos = lines[i].getPointAtLength(target);
              } catch (e) {
                break;
              }
              if (
                (target === end || target === beginning) &&
                pos.x !== mouse[0]
              ) {
                break;
              }
              if (pos.x > mouse[0]) end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }

            if (pos) {
              d3.select('#chart-label-' + d.id).html(
                self.getLabel(d.name, yScale.invert(pos.y)),
              );
              return 'translate(' + mouse[0] + ',' + pos.y + ')';
            } else {
              return '';
            }
          }
        });
      });

    this.setState({
      yScale: yScale,
      yAxis: yAxis,
      chart: chart,
      dataGroup: dataGroup,
      data: data,
      line: line,
    });
  }

  getLabel = (name, signups, sortType = null) => {
    let percentage =
      (sortType ? sortType : this.state.sortType) === 'Percentage';
    signups = percentage ? signups.toFixed(1) + '%' : signups.toFixed(0);
    return this.smallScreen ? signups : this.shortenName(name) + ': ' + signups;
  };

  shortenName = school => {
    if (school === 'Harvard-MIT') {
      return 'Harv/MIT Grads';
    }
    return school;
  };

  updateChart = (data, yScale, chart, yAxis, dataGroup, line) => {
    let maxY = findMaxY(data);
    yScale.domain([0, maxY]);
    chart.select('.y.axis').transition().call(yAxis);

    dataGroup
      .select('path')
      .transition()
      .attr('d', d => (d.selected ? line(d.values) : null));

    this.drawLabels(data, yScale, chart);

    function findMaxY(data) {
      const maxYValues = data.map(d =>
        d.selected ? d3.max(d.values, value => value.signups) : 0,
      );
      return d3.max(maxYValues);
    }
  };

  drawLabels = (data, yScale, chart) => {
    //https://bl.ocks.org/wdickerson/bd654e61f536dcef3736f41e0ad87786
    const selectedSchools = data.filter(d => d.selected);

    // Create nodes
    const labels = selectedSchools.map(s => {
      return {
        fx: 0,
        targetY: yScale((s.values[s.values.length - 1] || {}).signups || 0),
      };
    });

    // Define a custom force
    const forceClamp = (min, max) => {
      let nodes;
      const force = () => {
        nodes.forEach(n => {
          if (n.y > max) n.y = max;
          if (n.y < min) n.y = min;
        });
      };
      force.initialize = _ => (nodes = _);
      return force;
    };

    // Set up the force simulation
    const force = d3
      .forceSimulation()
      .nodes(labels)
      .force('collide', d3.forceCollide(18 / 2))
      .force('y', d3.forceY(d => d.targetY).strength(1))
      .force('clamp', forceClamp(0, this.height)) // add margins?
      .stop();

    // Execute the simulation
    for (let i = 0; i < 300; i++) force.tick();

    // Assign values to the appropriate marker
    labels.sort((a, b) => a.y - b.y);
    selectedSchools.sort(
      (a, b) =>
        ((b.values[b.values.length - 1] || {}).signups || 0) -
        ((a.values[a.values.length - 1] || {}).signups || 0),
    );
    selectedSchools.forEach((state, i) => (state.y = labels[i].y));

    // Add labels
    const chartLabels = chart
      .selectAll('.chart-label')
      .data(selectedSchools, d => d.name);

    chartLabels.exit().remove();
    chartLabels.attr('y', d => d.y);
    chartLabels
      .enter()
      .append('text')
      .attr('class', 'chart-label')
      .attr('id', d => 'chart-label-' + d.id)
      .html(d => this.getLabel(d.name, d.values[d.values.length - 1].signups))
      .attr('fill', d => d.color)
      .attr('font-size', 14)
      .attr('alignment-baseline', 'middle')
      .attr('dx', '.5em')
      .attr('x', this.width)
      .attr('y', d => d.y)
      .on('mouseover', function (d) {
        d3.select(this).style('cursor', 'pointer');
        d3.select('#line-' + d.id)
          .transition()
          .style('stroke-width', 3);
      })
      .on('mouseout', function (d) {
        d3.select(this).style('cursor', 'default');
        d3.select('#line-' + d.id)
          .transition()
          .style('stroke-width', 1.5);
      });
  };

  render() {
    const overrideStrings = {
      selectSomeItems: 'Select a school...',
      allItemsAreSelected: 'All schools are selected',
    };
    if (!schools.includes('Top 10 Schools')) {
      schools.unshift('Top 10 Schools');
    }
    const options = schools.map(d => {
      if (d === 'Harvard-MIT') {
        return { label: 'Harvard/MIT Grads', value: d };
      }
      return { label: d, value: d };
    });
    return (
      <div id="signups-container">
        <MultiSelect
          className="stats-multi-select body-text background-border"
          options={options}
          hasSelectAll={false}
          overrideStrings={overrideStrings}
          value={this.state.selected}
          onChange={this.handleSchoolsChange}
          labelledBy={'Select'}
        />
        <Select
          className="stats-select body-text background-border"
          handleInputChange={this.handleSortTypeChange}
          labels={['total users', '% of school population']}
          name="sortType"
          placeholder="Show me..."
          value={this.state.sortType}
          values={['Total', 'Percentage']}
        />
        <div id="schools-signups"></div>
      </div>
    );
  }
}
