import React, { Component } from 'react';
import { json, csv, keys, extent, max, nest, map, format } from 'd3';
import { select, selectAll, mouse } from 'd3-selection';
import { timeMinute, timeDay } from 'd3-time';
import { timeFormat } from 'd3-time-format';
import { path } from 'd3-path';
import { scaleOrdinal, scaleLinear, scaleTime, scaleBand } from 'd3-scale';
import { bisector } from 'd3-array';
import { schemePaired } from 'd3-scale-chromatic';
import { axisBottom, axisLeft, axisTop } from 'd3-axis';
import { stack } from 'd3-shape';
import { queue } from 'd3-queue';
import d3Tip from 'd3-tip';
import * as d3Legend from 'd3-svg-legend';

import { firebaseConnect } from 'react-redux-firebase';
import { getJSON } from 'utils/stats';

const d3 = {
  csv,
  select,
  selectAll,
  mouse,
  path,
  scaleOrdinal,
  scaleLinear,
  scaleTime,
  json,
  keys,
  extent,
  max,
  schemePaired,
  axisBottom,
  axisLeft,
  stack,
  map,
  format,
  bisector,
  queue,
  timeMinute,
  timeDay,
  timeFormat,
  nest,
  scaleBand,
  axisTop,
};

const namesDict = {
  'Boston College': 'BC',
  'Brandeis University': 'Brandeis',
  'Brown University': 'Brown',
  'Carleton College': 'Carleton',
  'Claremont Colleges': 'Claremont',
  'Cornell University': 'Cornell',
  'Columbia University': 'Columbia',
  'Dartmouth College': 'Dartmouth',
  'Georgetown University': 'Georgetown',
  'Harvard University': 'Harvard',
  'McGill University': 'McGill',
  'Massachusetts Institute of Technology': 'MIT',
  'Princeton University': 'Princeton',
  'Tufts University': 'Tufts',
  'University of California, Berkeley': 'Berkeley',
  'The University of Chicago': 'UChicago',
  'University of California, Los Angeles': 'UCLA',
  'University of California San Diego': 'UCSD',
  'University of Washington': 'UW',
  'University of Nevada, Las Vegas': 'UNLV',
  'University of Wisconsin-Madison': 'UW-Madison',
  'Vanderbilt University': 'Vanderbilt',
  'Washington University in St. Louis': 'WashU',
  'Wellesley College': 'Wellesley',
  'Wesleyan University': 'Wesleyan',
  'Williams College': 'Williams',
  'Yale University': 'Yale',
};

class SearchMatches extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }

  async componentDidMount() {
    // Use storage reference to grab download URL for data from Firebase Storage
    const dataURL = await this.props.firebase
      .storage()
      .ref('stats/search_matches.json')
      .getDownloadURL();
    try {
      const data = await getJSON(dataURL);
      this.setState({ data });
      this.initialize(data);
    } catch (e) {
      console.error(e);
    }
  }

  initialize(data) {
    data = data.sort(function (a, b) {
      if (a.school < b.school) {
        return -1;
      }
      if (a.school > b.school) {
        return 1;
      }
      return 0;
    });

    var margin = { top: 30, right: 40, bottom: 20, left: 60 },
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    var parentWidth = d3
      .select('#search-matches')
      .node()
      .getBoundingClientRect().width;
    if (parentWidth < 850) {
      width = parentWidth - margin.left - margin.right;
    }

    var svg = d3
      .select('#search-matches')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var subgroups = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

    var groups = d3.map(data, d => d.school).keys();

    // Add axes
    var y = d3.scaleBand().domain(groups).range([height, 0]).padding([0.2]);

    var x = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, d =>
          d3.max([d.Total, d.Freshman, d.Sophomore, d.Junior, d.Senior]),
        ),
      ])
      .range([0, width]);

    svg.append('g').attr('transform', 'translate(0,0)').call(d3.axisTop(x));

    svg
      .append('text')
      .attr('transform', 'translate(' + width / 2 + ',-25)')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Avg. # search matches per student');

    svg.append('g').call(
      d3
        .axisLeft(y)
        .tickFormat(d => this.shortenName(d))
        .tickSizeOuter(0),
    );

    // Another scale for subgroup position?
    var ySubgroup = d3
      .scaleBand()
      .domain(subgroups)
      .range([0, y.bandwidth()])
      .padding([0.05]);

    // color palette = one color per subgroup
    var color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(['#BD574E', '#FA877F', '#FFAD87', '#DEDEF0', '#545353']);

    var tip = d3Tip()
      .attr('class', 'd3-tip')
      .html(function (d) {
        return d.school + ', ' + d.key + ': ' + d3.format('.2f')(d.value);
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

    // Show the bars
    svg
      .append('g')
      .selectAll('g')
      // Enter in data = loop group per group
      .data(data)
      .enter()
      .append('g')
      .attr('transform', function (d) {
        return 'translate(0,' + y(d.school) + ')';
      })
      .selectAll('rect')
      .data(function (d) {
        return subgroups.map(function (key) {
          return { key: key, school: d.school, value: d[key] };
        });
      })
      .enter()
      .append('rect')
      .attr('id', function (d) {
        return d.school + '-' + d.key;
      })
      .attr('y', function (d) {
        return ySubgroup(d.key);
      })
      .attr('x', 0)
      .attr('height', ySubgroup.bandwidth())
      .attr('width', function (d) {
        return x(d.value);
      })
      .attr('fill', function (d) {
        return color(d.key);
      })
      .on('mouseover', function (d) {
        tip.show(d, this);
        d3.select('#' + d.school + '-' + d.key).style('cursor', 'pointer');
      })
      .on('mouseout', function (d) {
        tip.hide(d, this);
        d3.select('#' + d.school + '-' + d.key).style('cursor', 'default');
      });

    svg
      .append('g')
      .attr('class', 'legendYear')
      .attr(
        'transform',
        'translate(' + ((3 * width) / 4 + 10) + ', ' + (height / 2 + 20) + ')',
      ) //TODO space this correctly
      .style('font-size', '0.7em');

    var legend = d3Legend.legendColor().orient('vertical').scale(color);

    svg.select('.legendYear').call(legend);
  }

  shortenName = school => {
    if (Object.keys(namesDict).includes(school)) {
      return namesDict[school];
    } else {
      return school;
    }
  };

  render() {
    return <div id="search-matches" />;
  }
}

export default firebaseConnect()(SearchMatches);
