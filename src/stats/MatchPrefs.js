import React, { Component } from 'react';
import { json, extent, max, range, interpolate } from 'd3';
import { select, selectAll, mouse } from 'd3-selection';
import { path } from 'd3-path';
import { scaleOrdinal, scaleLinear, scaleTime } from 'd3-scale';
import { bisector } from 'd3-array';
import { schemePaired } from 'd3-scale-chromatic';
import { axisBottom, axisLeft } from 'd3-axis';
import { line, curveBasis, arc } from 'd3-shape';
import { forceSimulation, forceCollide, forceY } from 'd3-force';
import { css } from '@emotion/core';

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
  extent,
  max,
  interpolate,
  curveBasis,
  arc,
  schemePaired,
  axisBottom,
  axisLeft,
  forceSimulation,
  forceCollide,
  forceY,
  bisector,
  range,
};

const matchPrefsStyle = css`
  #arc-outline {
    stroke-width: 2px;
  }

  .slice {
    stroke-width: 1px;
  }

  .text-label {
    font-size: 18px;
  }
`;

export default class MatchPrefs extends Component {
  matchCategory;

  componentDidMount() {
    const { currentCategory } = this.props;
    this.matchCategory = currentCategory || 0;
    this.initialize();
  }

  initialize() {
    const colors = ['#524F6C', '#DEDEF0', '#F5E3E3', '#EC9697', '#D7525B'];
    const labelText = [
      { outer: 'nothing' },
      { outer: 'sum jokes' },
      { outer: 'matches', inner: 'to stalk' },
      { outer: 'human', inner: 'interaction' },
      { outer: 'a soulmate' },
    ];

    const width = 400,
      height = 250,
      margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      };

    const n = 5,
      outerRad = 170,
      outerLabelRad = outerRad * 0.9,
      innerLabelRad = outerRad * 0.8,
      needleLength = outerRad * 0.7,
      needleRad = 11,
      pi = Math.PI,
      halfPi = pi / 2,
      endAngle = pi / 2,
      startAngle = -endAngle,
      data = d3.range(startAngle, endAngle, pi / n),
      _data = data.slice(0),
      tt = 1000,
      colorScale = d3.scaleOrdinal().domain(data).range(colors);

    _data.push(endAngle); //add end angle of nth sector

    const svg = d3
      .select('#match-prefs')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('svg')
      .attr('class', 'chart-area')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
      .append('g')
      .attr(
        'transform',
        'translate(' + width / 2.3 + ', ' + height / 1.25 + ')',
      ); // translate to center

    const outline = d3
      .arc()
      .innerRadius(0)
      .outerRadius(outerRad)
      .startAngle(startAngle)
      .endAngle(endAngle);

    svg
      .append('path')
      .attr('id', 'arc-outline')
      .attr('d', outline)
      .attr('stroke', 'black')
      .attr('fill', 'none');

    const arc = d3
      .arc()
      .innerRadius(outerRad * 0.4)
      .outerRadius(outerRad)
      .startAngle(d => d)
      .endAngle((d, i) => _data[i + 1]);

    const slice = svg.append('g').selectAll('path.slice').data(data);

    slice
      .enter()
      .append('path')
      .attr('class', 'slice')
      .attr('d', arc)
      .attr('fill', d => colorScale(d))
      .attr('stroke', 'black')
      .on('click', (d, i) => updateCategory(i))
      .on('mouseover', function () {
        d3.select(this).style('cursor', 'pointer');
      })
      .on('mouseout', function () {
        d3.select(this).style('cursor', 'default');
      });

    const outerLabelArc = d3
      .arc()
      .innerRadius(outerLabelRad)
      .outerRadius(outerLabelRad)
      .startAngle(d => d)
      .endAngle((d, i) => _data[i + 1]);
    const innerLabelArc = d3
      .arc()
      .innerRadius(innerLabelRad)
      .outerRadius(innerLabelRad)
      .startAngle(d => d)
      .endAngle((d, i) => _data[i + 1]);

    const outerLabel = svg.append('g').selectAll('path.label-path').data(data);
    const innerLabel = svg.append('g').selectAll('path.label-path').data(data);

    outerLabel
      .enter()
      .append('path')
      .attr('class', 'label-path')
      .attr('id', (d, i) => 'label-path' + i)
      .attr('d', outerLabelArc)
      .attr('fill', 'none')
      .attr('stroke', 'none');
    outerLabel
      .enter()
      .append('text')
      .append('textPath')
      .attr('xlink:href', (d, i) => '#label-path' + i)
      .attr('class', 'text-label')
      .style('text-anchor', 'middle')
      .attr('fill', (d, i) => {
        if (i === 0 || i === 4) {
          return '#fff';
        }
      })
      .attr('startOffset', '25%')
      .text((d, i) => labelText[i].outer);

    innerLabel
      .enter()
      .append('path')
      .attr('class', 'label-path')
      .attr('id', (d, i) => 'inner-label-path' + i)
      .attr('d', innerLabelArc)
      .attr('fill', 'none')
      .attr('stroke', 'none');
    innerLabel
      .enter()
      .append('text')
      .append('textPath') //append a textPath to the text element
      .attr('xlink:href', (d, i) => '#inner-label-path' + i)
      .attr('class', 'text-label')
      .style('text-anchor', 'middle')
      .attr('startOffset', '25%')
      .text((d, i) => labelText[i].inner);

    const needleGroup = svg.append('g').attr('class', 'needle-group');

    needleGroup
      .append('circle')
      .attr('class', 'needle-center')
      .attr('stroke', 'black')
      .attr('r', needleRad);

    const needle = needleGroup
      .append('path')
      .attr('class', 'needle')
      .attr('stroke', 'black');

    // Initialize needle
    let oldAngle = data[this.matchCategory] + pi / (2 * n);
    needle
      .datum({ oldValue: 0 })
      .transition()
      .duration(0)
      .attrTween('d', lineTween(oldAngle));

    const self = this;

    function updateCategory(newCategory) {
      self.props.updateCategory(newCategory);
      self.matchCategory = newCategory;
      moveNeedle(data[newCategory] + pi / (2 * n));
    }

    function moveNeedle(newAngle) {
      needle.datum({ oldValue: oldAngle });
      oldAngle = newAngle;
      needle.transition().duration(tt).attrTween('d', lineTween(newAngle));
    }

    function lineTween(newValue) {
      return function (d) {
        var interpolate = d3.interpolate(d.oldValue, newValue);

        return function (t) {
          var _in = interpolate(t) - halfPi,
            _im = _in - halfPi,
            _ip = _in + halfPi;

          var topX = needleLength * Math.cos(_in),
            topY = needleLength * Math.sin(_in);

          var leftX = needleRad * Math.cos(_im),
            leftY = needleRad * Math.sin(_im);

          var rightX = needleRad * Math.cos(_ip),
            rightY = needleRad * Math.sin(_ip);

          return (
            d3.line()([
              [topX, topY],
              [leftX, leftY],
              [rightX, rightY],
            ]) + 'Z'
          );
        };
      };
    }
  }

  render() {
    return <div id="match-prefs" css={matchPrefsStyle}></div>;
  }
}
