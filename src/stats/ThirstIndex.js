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
import d3Tip from 'd3-tip';

import { firebaseConnect } from 'react-redux-firebase';
import { getCSV } from 'utils/stats';

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

class ThirstIndex extends Component {
  constructor(props) {
    super(props);

    this.state = { x: 0, y: 0 };
  }

  async componentDidMount() {
    const dataURL = await this.props.firebase
      .storage()
      .ref('stats/thirst-index.csv')
      .getDownloadURL();
    try {
      const data = await getCSV(dataURL);
      this.initialize(d3.csvParse(data));
    } catch (e) {
      console.error(e);
    }
  }

  _onMouseMove(e) {
    this.setState({ x: e.screenX, y: e.screenY });
  }

  initialize(data) {
    data = data.sort(function (a, b) {
      return b.total - a.total;
    });
    var keys = data.columns.slice(1);
    keys = keys.filter(element => element !== 'total');
    var margin = { top: 30, right: 50, bottom: 30, left: 50 },
      width = 700 - margin.left - margin.right,
      height = 1000 - margin.top - margin.bottom;

    var svg = d3
        .select('#thirst-index')
        .append('svg')
        .attr('viewBox', [0, 0, width, height]),
      g = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var tip = d3Tip()
      .attr('class', 'd3-tip')
      .html(function (d) {
        return 'Thirst index: ' + (d[1] - d[0]).toString().substr(0, 4);
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
    var y = d3
      .scaleBand() // x = d3.scaleBand()
      .domain(
        data.map(function (d) {
          return d.School;
        }),
      )
      .rangeRound([0, height]) // .rangeRound([0, width])
      .paddingInner(0.05)
      .align(0.1);

    var x = d3
      .scaleLinear() // y = d3.scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return d.total;
        }),
      ])
      .nice()
      .rangeRound([0, width]); // .rangeRound([height, 0]);

    var z = d3
      .scaleOrdinal()
      .domain(keys)
      .range(['#EC9697', '#f5e3e3', '#dedef0', '#FF9FC3']);

    g.append('g')
      .selectAll('g')
      .data(d3.stack().keys(keys)(data))
      .enter()
      .append('g')
      .attr('fill', function (d) {
        return z(d.key);
      })
      .selectAll('rect')
      .data(function (d) {
        return d;
      })
      .enter()
      .append('rect')
      .attr('y', function (d) {
        return y(d.data.School);
      }) //.attr("x", function(d) { return x(d.data.State); })
      .attr('x', function (d) {
        return x(d[0]);
      }) //.attr("y", function(d) { return y(d[1]); })
      .attr('width', function (d) {
        return x(d[1]) - x(d[0]);
      }) //.attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr('height', y.bandwidth() - 10) //.attr("width", x.bandwidth());
      .on('mouseover', function (d) {
        tip.show(d, this);
        d3.select(this).style('cursor', 'pointer');
      })
      .on('mouseout', function (d) {
        tip.hide(d, this);
        d3.select(this).style('cursor', 'default');
      });

    g.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,0)')
      .call(d3.axisLeft(y));

    g.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + height + ')') // New line
      .call(d3.axisBottom(x).ticks(null, 's')) //  .call(d3.axisLeft(y).ticks(null, "s"))
      .append('text')
      .attr('y', 40) //     .attr("y", 2)
      .attr('x', x(x.ticks().pop()) + 0.1) //     .attr("y", y(y.ticks().pop()) + 0.5)
      .attr('dy', '0.32em') //     .attr("dy", "0.32em")
      .attr('fill', '#000')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'start')
      .attr('font-size', 15)
      .text('Thirstiness Index')
      .attr('transform', 'translate(' + -width + ',-10)'); // Newline

    var legend = g
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .selectAll('g')
      .data(keys.slice().reverse())
      .enter()
      .append('g')
      //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
      .attr('transform', function (d, i) {
        if (d !== 'total') {
          return 'translate(-50,' + (300 + i * 20) + ')';
        }
      });

    legend
      .append('rect')
      .attr('x', width - 25)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', z);

    legend
      .append('text')
      .attr('x', width - 30)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(function (d) {
        return d;
      });

    legend
      .append('text')
      .attr('x', width - 55)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text('Class of');
  }

  render() {
    return (
      <div>
        <div id="thirst-index" onMouseMove={this._onMouseMove.bind(this)}></div>
      </div>
    );
  }
}

export default firebaseConnect()(ThirstIndex);
