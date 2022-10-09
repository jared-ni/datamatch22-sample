import React, { Component } from 'react';
import { json, keys, extent, max } from 'd3';
import { select, selectAll, mouse } from 'd3-selection';
import { timeMinute, timeDay } from 'd3-time';
import { timeFormat } from 'd3-time-format';
import { path } from 'd3-path';
import { scaleOrdinal, scaleLinear, scaleTime, scaleSqrt } from 'd3-scale';
import { bisector } from 'd3-array';
import { schemePaired } from 'd3-scale-chromatic';
import { axisBottom, axisLeft } from 'd3-axis';
import { line, curveBasis } from 'd3-shape';
import { queue } from 'd3-queue';
import { pack, hierarchy } from 'd3-hierarchy';
import {
  forceSimulation,
  forceCollide,
  forceY,
  forceLink,
  forceManyBody,
  forceCenter,
  forceRadial,
} from 'd3-force';
import { drag } from 'd3-drag';
import d3Tip from 'd3-tip';

import { firebaseConnect } from 'react-redux-firebase';
import { getJSON } from 'utils/stats';

const d3 = {
  select,
  selectAll,
  mouse,
  path,
  scaleOrdinal,
  scaleLinear,
  scaleSqrt,
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
  forceLink,
  forceRadial,
  forceManyBody,
  forceCenter,
  bisector,
  queue,
  timeMinute,
  timeDay,
  timeFormat,
  drag,
  pack,
  hierarchy,
};

class WordFreq extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allData: {},
      diameter: 700,
    };
  }

  async componentDidMount() {
    const dataURL = await this.props.firebase
      .storage()
      .ref('stats/word_freq.json')
      .getDownloadURL();
    try {
      const data = await getJSON(dataURL);
      this.setState({ allData: data });
      this.initialize();
      this.update(data['All']);
    } catch (e) {
      console.error(e);
    }
  }

  initialize() {
    var diameter = this.state.diameter;
    var marginLeft = 80;

    var parentWidth = d3.select('#word-freq').node().getBoundingClientRect()
      .width;
    if (parentWidth < 700) {
      diameter = parentWidth;
      marginLeft = 0;
    }

    this.setState({ diameter: diameter });

    d3.select('#word-freq')
      .append('svg')
      .attr('width', diameter)
      .attr('height', diameter)
      .attr('class', 'bubble')
      .attr('transform', 'translate(' + marginLeft + ', 0)');
  }

  update(data) {
    var diameter = this.state.diameter;
    data = { children: data.slice(0, 25) };

    data.children = data.children.sort((a, b) => b.occurrences - a.occurrences);
    var color = d3
      .scaleLinear()
      .domain(
        d3.extent(data.children, function (d) {
          return d.occurrences;
        }),
      )
      .range(['#FFAD87', '#FA877F', '#BD574E']);

    var bubble = d3.pack(data).size([diameter, diameter]).padding(1.5);

    var svg = d3.select('#word-freq').select('svg');

    var nodes = d3.hierarchy(data).sum(function (d) {
      return d.occurrences;
    });

    svg.selectAll('.node').remove();

    var nodeSelect = svg
      .selectAll('.node')
      .data(bubble(nodes).descendants().slice(1));

    var node = nodeSelect
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('id', d => 'node-' + d.data.word);

    node
      .transition()
      .attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      })
      .style('pointer-events', 'all')
      .style('fill', function (d) {
        if (d.parent) {
          return color(d.data.occurrences);
        } else {
          return 'white';
        }
      });

    node
      .on('mouseover', function (d, i) {
        d['order'] = i + 1;
        tip.show(d, this);
        svg.select('#node-' + d.data.word).style('cursor', 'pointer');
        if (d.parent) {
          svg
            .select('#circle-' + d.data.word)
            .style('stroke', '#fff')
            .style('stroke-width', '3px');
        }
      })
      .on('mouseout', function (d) {
        tip.hide(d, this);
        svg.select('#node-' + d.data.word).style('cursor', 'default');
        if (d.parent) {
          svg
            .select('#circle-' + d.data.word)
            .style('stroke', '#fff')
            .style('stroke-width', 0);
        }
      });

    node.append('title').text(function (d) {
      return d.word + ': ' + d.occurrences;
    });

    node
      .append('circle')
      .attr('id', d => 'circle-' + d.data.word)
      .attr('r', function (d) {
        return d.r;
      });

    node
      .append('text')
      .attr('dy', '.2em')
      .style('text-anchor', 'middle')
      .text(function (d) {
        return d.data.word;
      })
      .attr('font-family', 'sans-serif')
      .attr('font-size', function (d) {
        return d.r / 5;
      })
      .attr('fill', 'white');

    node
      .append('text')
      .attr('dy', '1.3em')
      .style('text-anchor', 'middle')
      .text(function (d) {
        return d.data.occurrences;
      })
      .attr('font-family', 'Gill Sans', 'Gill Sans MT')
      .attr('font-size', function (d) {
        return d.r / 5;
      })
      .attr('fill', 'white');

    var tip = d3Tip()
      .attr('class', 'd3-tip')
      .html(d => d.data.word + ': ' + getOrdinal(d.order) + ' most common word')
      .attr('dy', -10)
      .style('background', '#fff')
      .style('color', 'black')
      .style('line-height', 1)
      .style('font-size', '0.8em')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none');

    svg.call(tip);

    function getOrdinal(n) {
      var s = ['th', 'st', 'nd', 'rd'],
        v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
  }

  render() {
    return (
      <div className="word-freq-container">
        <br />
        <div id="word-freq"></div>
      </div>
    );
  }
}

export default firebaseConnect()(WordFreq);
