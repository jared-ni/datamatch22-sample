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

class ThirstIndexHorizontal extends Component {
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
    var margin = { top: 50, right: 50, bottom: 30, left: 25 },
      width = 700 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    var svg = d3
      .select('#thirst-index')
      .append('svg')
      .attr('viewBox', [0, 0, width, height]);

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

    // Add X axis
    var x = d3
      .scaleBand()
      .domain(
        data.map(function (d) {
          return d.School;
        }),
      )
      .range([0, width])
      .padding([0.2]);

    svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + height + ')')
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll('text')
      .attr('y', 10)
      .attr('x', -9)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(-40)')
      .style('text-anchor', 'end');

    // Add Y axis
    var y = d3.scaleLinear().domain([0, 7]).range([height, 0]);
    svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',0)')
      .call(d3.axisLeft(y));

    // color palette = one color per subgroup
    var color = d3
      .scaleOrdinal()
      .domain(keys)
      .range(['#EC9697', '#f5e3e3', '#dedef0', '#FF9FC3']);

    //stack the data? --> stack per subgroup
    var stackedData = d3.stack().keys(keys)(data);

    // Show the bars
    svg
      .append('g')
      .selectAll('g')
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .enter()
      .append('g')
      .attr('fill', function (d) {
        return color(d.key);
      })
      .selectAll('rect')
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function (d) {
        return d;
      })
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return x(d.data.School) + margin.left;
      })
      .attr('y', function (d) {
        return y(d[1]);
      })
      .attr('height', function (d) {
        return y(d[0]) - y(d[1]);
      })
      .attr('width', x.bandwidth())
      .on('mouseover', function (d) {
        tip.show(d, this);
        d3.select(this).style('cursor', 'pointer');
      })
      .on('mouseout', function (d) {
        tip.hide(d, this);
        d3.select(this).style('cursor', 'default');
      });

    var legend = svg
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .selectAll('g')
      .data(keys.slice().reverse())
      .enter()
      .append('g')
      .attr('transform', function (d, i) {
        return 'translate(0,' + i * 20 + ')';
      });

    legend
      .append('rect')
      .attr('x', width - 25)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', color);

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

export default firebaseConnect()(ThirstIndexHorizontal);
