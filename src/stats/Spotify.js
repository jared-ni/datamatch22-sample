/** @jsx jsx */

import { Component } from 'react';
import { jsx } from '@emotion/core';
import { json, keys, extent, max, nest, map, format, csv } from 'd3';
import { select, selectAll, mouse, event } from 'd3-selection';
import { path } from 'd3-path';
import { hierarchy, treemap } from 'd3-hierarchy';
import { scaleOrdinal } from 'd3-scale';
import { forceSimulation } from 'd3-force';
import { forceManyBody } from 'd3-force';
import { forceCenter } from 'd3-force';
import { forceCollide } from 'd3-force';

import { firebaseConnect } from 'react-redux-firebase';
import { getJSON } from 'utils/stats';

import colors from 'constants/GraphColors';

const d3 = {
  forceCollide,
  forceCenter,
  forceManyBody,
  forceSimulation,
  scaleOrdinal,
  json,
  csv,
  keys,
  extent,
  max,
  nest,
  map,
  format,
  select,
  selectAll,
  mouse,
  path,
  hierarchy,
  treemap,
  event,
};

class Spotify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      school: 'All Schools',
      allData: {},
    };
  }

  async componentDidMount() {
    const dataURL = await this.props.firebase
      .storage()
      .ref('stats/spotify_data.json')
      .getDownloadURL();
    try {
      const data = await getJSON(dataURL);
      this.setState({ allData: data });

      this.initialize(data);
    } catch (e) {
      console.error(e);
    }
  }

  async componentDidUpdate() {
    let data = this.state.allData;

    this.initialize(data);
  }

  handleInputChange = event => {
    const { value } = event.target;
    this.setState({ school: value });
  };

  initialize(data) {
    var limit = 30; // Have to tinker with this

    let bcNodes = data.filter(function (d) {
      return d.users >= limit;
    });

    var schoolCounter = 0;
    var holder = 'a';
    var schools = [];
    for (var i = 0; i < bcNodes.length; i++) {
      if (bcNodes[i].school !== holder) {
        schools[schoolCounter] = bcNodes[i].school;
        holder = schools[schoolCounter];
        schoolCounter++;
      }
    }

    var margin = { top: 30, right: 15, bottom: 50, left: 15 };
    var width = 500 - margin.left - margin.right;
    var parentWidth = d3
      .select('#spotify-chart-area')
      .node()
      .getBoundingClientRect().width;
    if (parentWidth < 1000) {
      width = parentWidth - margin.left - margin.right;
    }

    var height = 600 - margin.top - margin.bottom;

    d3.select('#spotify-chart-area').select('svg').remove();
    d3.select('#spotify-chart-area').selectAll('.overlay-circles').remove();
    d3.select('#spotify-chart-area').selectAll('image').remove();
    d3.select('#spotify-chart-area').selectAll('picturesClip').remove();

    var svg = d3
      .select('#spotify-chart-area')
      .append('svg')
      .attr('viewbox', [0, 0, width, height])
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var colorScale = d3
      .scaleOrdinal()
      .domain(data, function (d) {
        return d.school;
      })
      .range(colors);

    svg
      .selectAll('clipPath')
      .data(bcNodes)
      .enter()
      .append('clipPath')
      .attr('id', function (d, i) {
        return 'clip' + i;
      })
      .attr('class', 'picturesClip')
      .append('circle')
      .attr('r', function (d) {
        return d.users * 0.1;
      });

    svg
      .selectAll('image')
      .data(bcNodes)
      .enter()
      .append('image')
      .attr('xlink:href', function (d) {
        return d.picture;
      })
      .attr('width', function (d) {
        return d.users * 1.6;
      })
      .attr('height', function (d) {
        return d.users * 1.6;
      })
      .attr('clip-path', function (d, i) {
        return 'url(#clip' + i + ')';
      })
      .attr('preserveAspectRatio', 'xMidYMid');

    var circles = svg
      .selectAll('.overlay-circles')
      .data(bcNodes)
      .enter()
      .append('circle')
      .attr('class', 'overlay-circles')
      .attr('id', i => 'circle-' + i)
      .attr('r', function (d) {
        return d.users * 0.1;
      })
      .attr('fill', function (d) {
        return colorScale(d.school);
      })
      .style('opacity', 0.1);

    circles
      .append('text')
      .attr('dx', function (d) {
        return 10;
      })
      .text(function (d) {
        return d.artist;
      });

    circles
      .on('mouseover', function (d, i) {
        d3.select(this)
          .transition()
          .duration('100')
          .attr('x', function (d) {
            return d.x + 100;
          })
          .attr('y', function (d) {
            return d.y + 100;
          })
          .attr('width', function (d) {
            return d.users * 0.1;
          })
          .attr('height', function (d) {
            return d.users * 0.1;
          });
        tooltipBB.transition().duration(0).style('opacity', 1);
        tooltip.transition().duration(200).style('opacity', 1);
        tooltipBB.attr(
          'transform',
          'translate(' +
            (d3.mouse(this)[0] + 10) +
            ',' +
            (d3.mouse(this)[1] - 15) +
            ')',
        );
        tooltip
          .text(d.users + ' listened to ' + d.artist)
          .attr('x', d3.mouse(this)[0] + 10)
          .attr('y', d3.mouse(this)[1] - 15);
      })
      .on('mouseout', function (d, i) {
        d3.select(this)
          .transition()
          .duration('200')
          .attr('width', function (d) {
            return d.users * 0.1;
          })
          .attr('height', function (d) {
            return d.users * 0.1;
          });
        tooltipBB.transition().duration(0).style('opacity', 0);
        tooltip.transition().duration(0).style('opacity', 0);
      });

    d3.forceSimulation(bcNodes)
      .force('charge', d3.forceManyBody().strength(1))
      .force('center', d3.forceCenter(width / 2, height / 2.5))
      .force(
        'collision',
        d3.forceCollide().radius(function (d) {
          return d.users * 0.1;
        }),
      )
      .on('tick', function () {
        d3.select('#spotify-chart-area')
          .selectAll('.picturesClip')
          .each(function (parent) {
            d3.select(this)
              .select('circle')
              .attr('cx', parent.x)
              .attr('cy', parent.y);
          });

        var u = d3
          .select('#spotify-chart-area')
          .selectAll('image')
          .data(bcNodes);

        u.enter()
          .append('image')
          .merge(u)
          .attr('x', function (d) {
            return d.x - d.users * 0.75;
          })
          .attr('y', function (d) {
            return d.y - d.users * 0.75;
          });
        u.exit().remove();

        var v = d3
          .select('#spotify-chart-area')
          .selectAll('.overlay-circles')
          .data(bcNodes);

        v.enter()
          .append('circle')
          .attr('class', 'overlay-circles')
          .merge(v)
          .attr('cx', function (d) {
            return d.x;
          })
          .attr('cy', function (d) {
            return d.y;
          });
        v.exit().remove();
      });

    let tooltipBB = svg
      .append('foreignObject')
      .attr('width', 250)
      .attr('height', 25)
      .attr('x', '0')
      .attr('y', '0')
      .style('overflow', 'visible')
      .style('opacity', 0);

    let tooltip = tooltipBB
      .append('xhtml:div')
      .attr('class', 'tooltip')
      .style('padding', '2px')
      .style('border-radius', '5px')
      .style('background-color', 'white')
      .style('position', 'fixed')
      .style('opacity', 0)
      .style('font-size', '14px')
      .style('z-index', '99')
      .style('text-align', 'center');
  }

  render() {
    return (
      <div id="spotify-container">
        <div id="spotify-chart-area" />
      </div>
    );
  }
}

export default firebaseConnect()(Spotify);
