import React, { Component } from 'react';
import { css } from '@emotion/core';
import { stack, map, csvParse } from 'd3';
import { csv } from 'd3-request';
import { max } from 'd3-array';
import { select, selectAll, mouse } from 'd3-selection';
import { scaleBand, scaleOrdinal, scaleLinear, scaleTime } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';

import { firebaseConnect } from 'react-redux-firebase';
import { getCSV } from 'utils/stats';
import d3Tip from 'd3-tip';

const d3 = {
  csvParse,
  map,
  max,
  select,
  selectAll,
  mouse,
  stack,
  scaleBand,
  scaleOrdinal,
  scaleLinear,
  scaleTime,
  csv,
  axisBottom,
  axisLeft,
};

const schoolDemoStyle = css`
  .demo-school {
    height: 100%;
    width: 100%;
  }
`;

class SchoolDemographics extends Component {
  constructor(props) {
    super(props);

    this.state = { x: 0, y: 0 };
  }

  async componentDidMount() {
    const dataURL = await this.props.firebase
      .storage()
      .ref('stats/school_year.csv')
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

  initialize(file) {
    let school_width = 800,
      height = 600;

    // let data;
    let margin = { top: 40, right: 40, left: 80, bottom: 80 };
    height -= margin.bottom + margin.top;

    let demoSchool = d3
      .select('#demo-school')
      .append('svg')
      .attr('viewBox', `0 0 900 650`)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let data = d3.csvParse(file);
    // https://www.d3-graph-gallery.com/graph/barplot_stacked_basicWide.html
    // year is subgroup
    let year = data.columns.slice(1, 6);
    // school is main group
    let school = d3
      .map(data, function (d) {
        return d.school;
      })
      .keys();
    let x = d3
      .scaleBand()
      .domain(school)
      .rangeRound([0, school_width])
      .paddingInner(0.2);

    demoSchool
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .attr('class', 'x-axis axis')
      .call(d3.axisBottom(x));

    let y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return +d.n;
        }),
      ])
      .range([height, 0]);

    demoSchool.append('g').call(d3.axisLeft(y));

    let yearColor = d3
      .scaleOrdinal()
      .domain(year)
      .range(['#d7525b', '#ec9697', '#f5e3e3', '#dedef0', '#8e8bad']);

    let stackedData = d3.stack().keys(year)(data);

    demoSchool
      .append('g')
      .selectAll('g')
      .data(stackedData)
      .enter()
      .append('g')
      .attr('fill', function (d) {
        return yearColor(d.key);
      })
      .selectAll('rect')
      .data(function (d) {
        return d;
      })
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return x(d.data.school);
      })
      .attr('y', function (d) {
        return y(d[1]);
      })
      .attr('height', function (d) {
        return y(d[0]) - y(d[1]);
      })
      .attr('width', x.bandwidth())
      .on('mouseover', function (d, i) {
        tip.show(d, this);
        d3.select(this).style('cursor', 'pointer');
      })
      .on('mouseout', function (d, i) {
        tip.hide(d, this);
        d3.select(this).style('cursor', 'default');
      });

    demoSchool
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - 75)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Total Users');

    demoSchool
      .select('.x-axis')
      .selectAll('text')
      .style('font-size', '13.5px')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)');

    const legendRect = 18;
    const legendSpacing = 4;
    const hBuffer = school_width - 100;
    const vBuffer = 50;

    let legend = demoSchool
      .selectAll('.legend')
      .data(yearColor.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function (d, i) {
        const ht = legendRect + legendSpacing;
        const h = -2 * legendRect + hBuffer;
        const v = i * ht + vBuffer;
        return 'translate(' + h + ',' + v + ')';
      });

    legend
      .append('rect')
      .attr('width', legendRect)
      .attr('height', legendRect)
      .style('fill', yearColor)
      .style('stroke', yearColor);

    legend
      .append('text')
      .attr('x', legendRect + legendSpacing)
      .attr('y', legendRect - legendSpacing)
      .attr('size', 10)
      .text(function (d) {
        return d;
      });

    var tip = d3Tip()
      .attr('class', 'd3-tip')
      .html(function (d) {
        return (d[1] - d[0]).toString() + ' users (' + d.data.n + ' total)';
      })
      .attr('dy', -10)
      .style('background', '#fff')
      .style('color', 'black')
      .style('line-height', 1)
      .style('font-size', '0.8em')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none');

    demoSchool.call(tip);
  }

  render() {
    return (
      <div
        id="demo-school"
        css={schoolDemoStyle}
        onMouseMove={this._onMouseMove.bind(this)}
      ></div>
    );
  }
}

export default firebaseConnect()(SchoolDemographics);
