/** @jsx jsx */

import { jsx, css } from '@emotion/core';

import { Component } from 'react';
import { json, keys, extent, max } from 'd3';
import { select, selectAll, mouse } from 'd3-selection';
import { timeMinute, timeDay } from 'd3-time';
import { timeFormat, utcFormat } from 'd3-time-format';
import { path } from 'd3-path';
import { scaleOrdinal, scaleLinear, scaleTime, scaleBand } from 'd3-scale';
import { schemePaired, schemeTableau10 } from 'd3-scale-chromatic';
import { axisBottom, axisLeft, axisTop } from 'd3-axis';
import { queue } from 'd3-queue';
import {
  bisector,
  group,
  rollup,
  ascending,
  descending,
  pairs,
  groups,
  range,
} from 'd3-array';
import { interpolateNumber } from 'd3-interpolate';
import { easeLinear } from 'd3-ease';
import { format } from 'd3-format';
import { Button } from 'theme-ui';
import moment from 'moment';
import colors from 'constants/GraphColors';
const d3 = {
  group,
  easeLinear,
  interpolateNumber,
  rollup,
  schemeTableau10,
  ascending,
  format,
  utcFormat,
  descending,
  pairs,
  groups,
  range,
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
  bisector,
  queue,
  timeMinute,
  timeDay,
  timeFormat,
  scaleBand,
  axisTop,
};

const barchartRaceStyle = css`
  #button-container {
    display: flex;
    justify-content: start;
  }
  #button-container Button {
    margin-left: 5px;
    margin-right: 5px;
  }
`;

const TIME_INCREMENT = 100;
const MINUTE_INTERVAL = 20;

export default class BarchartRace extends Component {
  async componentDidMount() {
    this.initialize(this.transformData(this.props.data || {}));
  }

  transformData = data => {
    const newData = [];
    const { users = {} } = data || {};
    const length = Object.keys(users.Harvard || {}).length;

    const startDate = new Date(2021, 2, 7);
    const diff = MINUTE_INTERVAL * length;
    const endDate = moment(startDate).add(diff, 'm').toDate();
    const dateArray = d3.timeMinute
      .every(MINUTE_INTERVAL)
      .range(startDate, endDate);

    Object.keys(users).forEach(college => {
      for (let i = 0; i < length; i += TIME_INCREMENT) {
        newData.push({
          date: dateArray[i],
          name: college,
          value: users[college][i],
        });
      }
    });
    return newData;
  };

  async initialize(data) {
    let duration = 100,
      n = 6,
      k = 10,
      margin = { top: 16, right: 6, bottom: 6, left: 0 },
      barSize = 48,
      height = margin.top + barSize * n + margin.bottom,
      width = 500;

    d3.group(data, d => d.name);
    let names = new Set(data.map(d => d.name));
    let datevalues = Array.from(
      d3.rollup(
        data,
        ([d]) => d.value,
        d => d.date,
        d => d.name,
      ),
    )
      .map(([date, data]) => [date, data])
      .sort(([a], [b]) => d3.ascending(a, b));

    function rank(value) {
      const data = Array.from(names, name => ({ name, value: value(name) }));
      data.sort((a, b) => d3.descending(a.value, b.value));
      for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
      return data;
    }

    rank(name => datevalues[0][1].get(name));

    function bars(svg) {
      let bar = svg.append('g').attr('fill-opacity', 0.6).selectAll('rect');

      return ([date, data], transition) =>
        (bar = bar
          .data(data.slice(0, n), d => d.name)
          .join(
            enter =>
              enter
                .append('rect')
                .attr('fill', color)
                .attr('height', y.bandwidth())
                .attr('x', x(0))
                .attr('y', d => y((prev.get(d) || d).rank))
                .attr('width', d => x((prev.get(d) || d).value) - x(0)),
            update => update,
            exit =>
              exit
                .transition(transition)
                .remove()
                .attr('y', d => y((next.get(d) || d).rank))
                .attr('width', d => x((next.get(d) || d).value) - x(0)),
          )
          .call(bar =>
            bar
              .transition(transition)
              .attr('y', d => y(d.rank))
              .attr('width', d => x(d.value) - x(0)),
          ));
    }
    function labels(svg) {
      let label = svg
        .append('g')
        .style('font', 'bold 12px let(--sans-serif)')
        .style('font-letiant-numeric', 'tabular-nums')
        .attr('text-anchor', 'end')
        .selectAll('text');

      return ([date, data], transition) =>
        (label = label
          .data(data.slice(0, n), d => d.name)
          .join(
            enter =>
              enter
                .append('text')
                .attr(
                  'transform',
                  d =>
                    `translate(${x((prev.get(d) || d).value)},${y(
                      (prev.get(d) || d).rank,
                    )})`,
                )
                .attr('y', y.bandwidth() / 2)
                .attr('x', -6)
                .attr('dy', '-0.25em')
                .text(d => d.name)
                .call(text =>
                  text
                    .append('tspan')
                    .attr('id', (d, i) => 'tspan-' + (i + 1))
                    .attr('fill-opacity', 0.7)
                    .attr('font-weight', 'normal')
                    .attr('x', -6)
                    .attr('dy', '1.15em'),
                ),
            update => update,
            exit =>
              exit
                .transition(transition)
                .remove()
                .attr(
                  'transform',
                  d =>
                    `translate(${x((next.get(d) || d).value)},${y(
                      (next.get(d) || d).rank,
                    )})`,
                )
                .call(g =>
                  g
                    .select('tspan')
                    .attr('id', (d, i) => 'tspan-' + (i + 1))
                    .tween('text', (d, i) =>
                      textTween(i, d.value, (next.get(d) || d).value),
                    ),
                ),
          )
          .call(bar =>
            bar
              .transition(transition)
              .attr('transform', d => `translate(${x(d.value)},${y(d.rank)})`)
              .call(g =>
                g
                  .select('tspan')
                  .attr('id', (d, i) => 'tspan-' + (i + 1))
                  .tween('text', (d, i) =>
                    textTween(i, (prev.get(d) || d).value, d.value),
                  ),
              ),
          ));
    }
    function textTween(rank, a, b) {
      const i = d3.interpolateNumber(a, b);
      return function (t) {
        d3.select('#tspan-' + (rank + 1)).text(formatNumber(i(t)));
      };
    }

    let formatNumber = d3.format(',d');

    function axis(svg) {
      const g = svg.append('g').attr('transform', `translate(0,${margin.top})`);

      const axis = d3
        .axisTop(x)
        .ticks(width / 160)
        .tickSizeOuter(0)
        .tickSizeInner(-barSize * (n + y.padding()));

      return (_, transition) => {
        g.transition(transition).call(axis);
        g.select('.tick:first-of-type text').remove();
        g.selectAll('.tick:not(:first-of-type) line').attr('stroke', 'white');
        g.select('.domain').remove();
      };
    }

    let formatDate = d3.timeFormat('%A, %b. %e'); //TODO what to choose here?

    let x = d3.scaleLinear([0, 1], [margin.left, width - margin.right]);
    let y = d3
      .scaleBand()
      .domain(d3.range(n + 1))
      .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
      .padding(0.1);

    let keyframes = initKeyframes();
    let color = initColor();

    let nameframes = d3.groups(
      keyframes.flatMap(([, data]) => data),
      d => d.name,
    );
    let prev = new Map(
      nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])),
    );
    let next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)));

    const svg = d3
      .select('#barchart-container')
      .append('svg')
      // .attr('width', width)
      // .attr('height', height);
      .attr('viewBox', [0, 0, width, height]);
    const updateBars = bars(svg);
    const updateAxis = axis(svg);
    const updateLabels = labels(svg);

    const now = svg
      .append('text')
      .attr('id', 'date-text')
      .style('font', `bold ${barSize}px let(--sans-serif)`)
      .style('font-letiant-numeric', 'tabular-nums')
      .attr('text-anchor', 'end')
      .attr('x', width - 6)
      .attr('y', margin.top + barSize * (n - 0.45))
      .attr('dy', '0.32em')
      .text(formatDate(keyframes[0][0] - 2419200000));

    function initKeyframes() {
      const keyframes = [];
      let ka, a, kb, b;
      for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
        for (let i = 0; i < k; ++i) {
          const t = i / k;
          let x = a;
          let y = b;
          keyframes.push([
            ka * (1 - t) + kb * t,
            rank(name => (x.get(name) || 0) * (1 - t) + (y.get(name) || 0) * t),
          ]);
        }
      }
      keyframes.push([kb, rank(name => b.get(name) || 0)]);
      return keyframes;
    }

    function initColor() {
      const scale = d3.scaleOrdinal(colors);
      if (data.some(d => d.category !== undefined)) {
        const categoryByName = new Map(data.map(d => [d.name, d.category]));
        scale.domain(Array.from(categoryByName.values()));
        return d => scale(categoryByName.get(d.name));
      }
      return d => scale(d.name);
    }

    function update(keyframe) {
      const transition = svg
        .transition()
        .duration(duration)
        .ease(d3.easeLinear);

      // Extract the top bar’s value.
      x.domain([0, keyframe[1][0].value]);

      updateAxis(keyframe, transition);
      updateBars(keyframe, transition);
      updateLabels(keyframe, transition);

      transition.on('end', function () {
        now.text(formatDate(keyframe[0] - 2419200000));
        updateNext();
      });
    }

    var play = false;
    update(keyframes[0]);
    var index = 1;

    d3.select('#pause-button').on('click', function () {
      play = !play;
      if (play) {
        if (index === keyframes.length - 1) {
          index = 0;
        }
        updateNext();
      }
    });
    d3.select('#reset-button').on('click', function () {
      update(keyframes[0]);
      index = 1;
    });

    async function updateNext() {
      if (play) {
        if (index === keyframes.length - 1) {
          play = false;
        } else {
          update(keyframes[index]);
          index++;
          await new Promise(done => setTimeout(() => done(), duration));
        }
      }
    }
  }

  render() {
    return (
      <div className="barchart-race" css={barchartRaceStyle}>
        <div id="barchart-container" />
        <br />
        <div id="button-container">
          <Button id="pause-button"> Start/Stop </Button>
          <Button id="reset-button"> Reset </Button>
        </div>
      </div>
    );
  }
}
