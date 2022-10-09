/** @jsx jsx */

import { Component } from 'react';
import { jsx, css } from '@emotion/core';
import { json, csv, keys, extent, max, nest } from 'd3';
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
  bisector,
  queue,
  timeMinute,
  timeDay,
  timeFormat,
  nest,
  scaleBand,
  axisTop,
};

const answersStyle = css`
  #answers {
    overflow-y: scroll;
    height: 400px;
    margin-bottom: 40px;
  }
  #qa {
    min-height: 150px;
    font-size: 16px;
    margin-top: 15px;
  }
  #qa-question {
    font-weight: 800;
  }
  .stats-select {
    background: #f4f2f2;
    background-image: url('${window.location.origin}/angle-down.png');
    background-position: 95% 50%;
    background-repeat: no-repeat;
    background-size: 16px;
    border: 0px;
    width: 300px;
    height: 43px;
    margin-bottom: 9px;
    color: #545353;
  }
  #answers-container {
    display: flex;
    flex-direction: row;
  }
`;

class Answers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedYear: 'Total',
      data: null,
      hasSurvey: true,
    };
  }

  async componentDidMount() {
    // Use storage reference to grab download URL for data from Firebase Storage
    const dataURL = await this.props.firebase
      .storage()
      .ref('stats/survey2022.json')
      .getDownloadURL();
    try {
      const data = await getJSON(dataURL);
      this.setState({ data });
      this.initialize(data);
    } catch (e) {
      console.error(e);
    }
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  initialize(data) {
    // var margin = { top: 40, right: 50, bottom: 40, left: 50 },
    var width = 800,
      height = 1000;

    var parentWidth = d3.select('#answers').node().getBoundingClientRect()
      .width;
    if (parentWidth < 800) {
      width = parentWidth;
    }

    var svg = d3
      .select('#answers')
      .append('svg')
      .attr('viewBox', [0, 0, width, height])
      .append('g');
    // .attr('transform', 'translate(' + 0 + ', 0)');

    d3.select('#qa-question').html(
      'Click on the bars to view ' +
        this.props.college +
        "'s survey questions!",
    );

    svg
      .append('g')
      .attr('id', 'answers-container')
      .attr('width', width)
      .attr('height', height);
    // .attr('transform', 'translate(0, ' + qaHeight + ')');

    this.update(data, width);
  }

  update(data, rowWidth) {
    var selectedYear = this.state.selectedYear;

    // var rowWidth = 600,
    var height = 800;

    var svg = d3.select('#answers');

    var answersContainer = svg.select('#answers-container');

    var schoolData = data[this.props.college];

    if (!schoolData) {
      this.setState({ hasSurvey: false });
      return;
    }

    this.setState({ hasSurvey: true });
    schoolData = Object.entries(schoolData).map(([k, v]) =>
      Object.assign(v, { question_id: k }),
    );

    const answerChoices = ['A', 'B', 'C', 'D', 'E'];

    const color = d3
      .scaleOrdinal()
      .domain(answerChoices)
      .range(['#BD574E', '#FA877F', '#FFAD87', '#DFDEF0', '#545353']);

    var totalVotes = answerChoices.reduce(
      (acc, ans) => acc + schoolData[0][ans][selectedYear],
      0,
    );

    var xScale = d3.scaleLinear().domain([0, totalVotes]).range([0, rowWidth]);
    var yScale = d3
      .scaleBand()
      .domain(schoolData.map(d => d.question_id))
      .range([0, height])
      .padding([0.2]);

    var stackedData = d3
      .stack()
      .keys(answerChoices)
      .value((d, key) => d[key][selectedYear])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone)(schoolData);

    var questionSelect = answersContainer
      .selectAll('.answer')
      .data(stackedData);

    questionSelect.exit().remove();

    var question = questionSelect
      .enter()
      .append('g')
      .merge(questionSelect)
      .attr('class', 'answer')
      .attr('fill', (d, i) => color(d.key));

    var answerSelect = question.selectAll('rect').data(d => d);

    var answer = answerSelect.enter().append('rect').merge(answerSelect);
    answer.transition().duration(1000);

    let curr;

    answer
      .attr('id', function (d, i) {
        var key = d3.select(this.parentNode).datum().key;
        return 'answer-' + d.data.question_id + '-' + key;
      })
      .attr('y', d => yScale(d.data.question_id))
      .attr('x', d => xScale(d[0]))
      .attr('width', d => xScale(d[1]) - xScale(d[0]))
      .attr('height', yScale.bandwidth())
      .attr('pointer-events', 'all')
      .on('click', function (d) {
        if (curr && curr !== this) {
          d3.select(curr).transition().duration(100).attr('opacity', '1');
        }
        var key = d3.select(this.parentNode).datum().key;

        d3.select('#qa-question').html(
          '#' + (1 + +d.data.question_id) + ': ' + d.data.question_text,
        );
        d3.select('#qa-answers').html(d.data[key].answer_text);

        d3.select(this).transition().duration(100).attr('opacity', '.5');
        curr = this;
      })
      .on('mouseover', function (d) {
        var key = d3.select(this.parentNode).datum().key;
        d3.select(this).transition().duration(100).attr('opacity', '.5');

        svg
          .select('#answer-' + d.data.question_id + '-' + key)
          .style('cursor', 'pointer');
      })
      .on('mouseout', function (d, i) {
        var key = d3.select(this.parentNode).datum().key;
        if (!curr || curr !== this) {
          d3.select(this).transition().duration(100).attr('opacity', '1');
        }

        svg
          .select('#answer-' + d.data.question_id + '-' + key)
          .style('cursor', 'default');
      });

    var answerKeySelect = svg
      .selectAll('.answer')
      .selectAll('text.answer-key')
      .data(d => d);

    var answerKey = answerKeySelect
      .enter()
      .append('text')
      .merge(answerKeySelect);

    answerKey.transition().duration(1000);
    answerKey
      .attr('class', 'answer-key')
      .attr('y', d => yScale(d.data.question_id) + yScale.bandwidth() / 2)
      .attr('x', d => xScale(d[1]) - 0.5 * (xScale(d[1]) - xScale(d[0])) - 6)
      .attr('fill', '#fff')
      .style('font-size', '0.8em')
      .text(function (d) {
        var key = d3.select(this.parentNode).datum().key;
        return key;
      })
      .attr('pointer-events', 'none');

    var answerNumSelect = svg
      .selectAll('.answer')
      .selectAll('text.answer-num')
      .data(d => d);

    var answerNum = answerNumSelect
      .enter()
      .append('text')
      .merge(answerNumSelect);
    answerNum.transition().duration(1000);
    answerNum
      .attr('class', 'answer-num')
      .attr('y', d => yScale(d.data.question_id) + yScale.bandwidth() / 2 + 12)
      .attr('x', d => xScale(d[1]) - 0.5 * (xScale(d[1]) - xScale(d[0])) - 6)
      .attr('fill', '#fff')
      .style('font-size', '0.8em')
      .text(function (d) {
        var key = d3.select(this.parentNode).datum().key;
        return d.data[key][selectedYear];
      })
      .attr('pointer-events', 'none');
  }

  render() {
    if (this.state.hasSurvey) {
      return (
        <div id="answers-container" css={answersStyle}>
          <div id="qa">
            <div id="qa-question" />
            <div id="qa-answers" />
          </div>
          <div id="answers" />
        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default firebaseConnect()(Answers);
