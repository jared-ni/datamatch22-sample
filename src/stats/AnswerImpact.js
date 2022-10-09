import React, { Component } from 'react';
import { csv, keys, extent, stack, map, csvParse } from 'd3';
import { max, ascending } from 'd3-array';
import { select, selectAll, mouse } from 'd3-selection';
import { timeMinute, timeDay } from 'd3-time';
import { timeFormat } from 'd3-time-format';
import { path } from 'd3-path';
import { scaleBand, scaleOrdinal, scaleLinear, scaleTime } from 'd3-scale';
import { bisector } from 'd3-array';
import { schemePaired } from 'd3-scale-chromatic';
import { axisBottom, axisLeft, axisTop } from 'd3-axis';

import { firebaseConnect } from 'react-redux-firebase';
import { getJSON } from 'utils/stats';

const d3 = {
  ascending,
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

class AnswerImpact extends Component {
  constructor(props) {
    super(props);

    this.state = { survey: null, selectedBox: 0 };
  }

  async componentDidMount() {
    const surveyDataURL = await this.props.firebase
      .storage()
      .ref('stats/survey2022.json')
      .getDownloadURL();
    const answerDataURL = await this.props.firebase
      .storage()
      .ref('stats/answer_impact.json')
      .getDownloadURL();
    try {
      const surveyData = await getJSON(surveyDataURL);
      const answerData = await getJSON(answerDataURL);
      this.setState({ survey: surveyData, selectedBox: 0 });
      this.initialize(answerData, surveyData);
    } catch (e) {
      console.error(e);
    }
  }

  getText(i, colorIndex, answer, question_index) {
    if (colorIndex[i] === 4) {
      return (
        answer +
        ': ' +
        this.state.survey[this.props.college][question_index][answer]
          .answer_text +
        '<br> <br> ' +
        'On average, users who chose received the FEWEST matches compared to users who chose other responses.'
      );
    }
    if (colorIndex[i] === 0) {
      return (
        answer +
        ': ' +
        this.state.survey[this.props.college][question_index][answer]
          .answer_text +
        '<br> <br> ' +
        'On average, users who chose received the MOST matches compared to users who chose other responses'
      );
    }
  }

  initialize(data, survey) {
    var padding = 20;
    var height = 1200;
    var width = 600;
    var margin = { top: 50, right: 30, left: 30, bottom: 50 };

    //var barScale = d3.scaleLinear();
    var myColor = d3.scaleLinear().domain([0, 4]).range(['#D7525B', 'white']);

    //for drawing scale
    var scale = d3
      .scaleBand()
      .domain(['More Matches', 'Fewer Matches'])
      .range([-20, 245]);
    var axis = d3.axisBottom().scale(scale);

    var colors = ['#D7525B', 'rgb(255,255,255)'];

    var svg = d3
      .select('#legend')
      .append('svg')
      .attr('width', 350)
      .attr('height', 60);

    var grad = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'grad')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');

    grad
      .selectAll('stop')
      .data(colors)
      .enter()
      .append('stop')
      .style('stop-color', function (d) {
        return d;
      })
      .attr('offset', function (d, i) {
        return 100 * (i / (colors.length - 1)) + '%';
      });

    svg
      .append('rect')
      .attr('x', 15)
      .attr('y', 30)
      .attr('width', 225)
      .attr('height', 25)
      .attr('stroke', '#1F1717')
      .attr('stroke-width', 1)
      .style('fill', 'url(#grad)');
    svg
      .append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(20, 5)')
      .call(axis);

    // get question id from school
    var question_index = Object.keys(data[this.props.college])[0];
    var numMatches = Object.values(data[this.props.college][question_index]);

    var text =
      'Question ' +
      question_index +
      ': ' +
      survey[this.props.college][question_index].question_text;

    d3.select('h6').text(text);
    var colorIndex = [];

    var matchColorIndex = numMatches.slice().sort((a, b) => d3.ascending(a, b));
    matchColorIndex.forEach(function (d, i) {
      for (var x = 0; x < 5; x++) {
        if (d === numMatches[x]) {
          colorIndex.splice(x, 0, i);
        }
      }
    });

    var highIndex = colorIndex.indexOf(0);
    var lowIndex = colorIndex.indexOf(4);
    colorIndex[highIndex] = 4;
    colorIndex[lowIndex] = 0;

    highIndex = colorIndex.indexOf(1);
    lowIndex = colorIndex.indexOf(3);
    colorIndex[highIndex] = 3;
    colorIndex[lowIndex] = 1;

    d3.select('#answer-impact')
      .append('svg')
      .attr('viewbox', [0, 0, width, height])
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var boxes = d3
      .select('#answer-impact')
      .select('svg')
      .selectAll('rect')
      .data(numMatches);

    boxes
      .enter()
      .append('rect')
      .merge(boxes)
      .attr('id', 'bar')
      .attr('width', 80)
      .attr('height', 80)
      .attr('x', function (d, i) {
        return i * 80 + 3;
      })
      .attr('y', 3)
      .attr('fill', function (d, i) {
        return myColor(colorIndex[i]);
      })
      .attr('stroke', '#1F1717')
      .attr('stroke-width', 1);

    boxes
      .on('mouseover', function (d, i) {
        this.setState({ selectedBox: i + 1 });
        d3.select(this)
          .transition()
          .duration(50)
          .attr('width', 200)
          .attr('height', 300);

        boxes
          .enter()
          .append('foreignObject')
          .merge(boxes)
          .attr('height', function (d, i) {
            if (i + 1 === this.state.selectedBox) {
              return 400 - 2 * padding;
            }
            return 200 - 2 * padding;
          })
          .attr('width', 200 - 2 * padding)
          .attr('x', function (d, i) {
            return i * 200 + padding;
          })
          .attr('y', padding)
          .attr('fill', 'none')
          .style('pointer-events', 'none')
          .append('xhtml:body')
          .attr('class', 'textBox')
          .style('color', '#1F1717')
          .style('background-color', function (d, i) {
            return myColor(colorIndex[i]);
          })
          .html(function (d, i) {
            if (i === 0) {
              if (this.state.selectedBox === 1) {
                return this.getText(i, colorIndex, 'A', question_index);
              } else {
                return (
                  'A: ' +
                  survey[this.props.college][question_index].A.answer_text
                );
              }
            } else if (i === 1) {
              if (this.state.selectedBox === 2) {
                return this.getText(i, colorIndex, 'B', question_index);
              } else {
                return (
                  'B: ' +
                  survey[this.props.college][question_index].B.answer_text
                );
              }
            } else if (i === 2) {
              if (this.state.selectedBox === 3) {
                return this.getText(i, colorIndex, 'C', question_index);
              } else {
                return (
                  'C: ' +
                  survey[this.props.college][question_index].C.answer_text
                );
              }
            } else if (i === 3) {
              if (this.state.selectedBox === 4) {
                return this.getText(i, colorIndex, 'D', question_index);
              } else {
                return (
                  'D: ' +
                  survey[this.props.college][question_index].D.answer_text
                );
              }
            } else if (i === 4) {
              if (this.state.selectedBox === 5) {
                return this.getText(i, colorIndex, 'E', question_index);
              } else {
                return (
                  'E: ' +
                  survey[this.props.college][question_index].E.answer_text
                );
              }
            }
          });
        boxes.exit().remove();
      })
      .on('mouseout', function (d, i) {
        this.setState({ selectedBox: 0 });
        d3.select(this).transition().attr('width', 200).attr('height', 200);
        d3.selectAll('.textBox').remove();
        //setTimeout(1000);
        boxes
          .enter()
          .append('foreignObject')
          .merge(boxes)
          .attr('height', function (d, i) {
            if (i + 1 === this.state.selectedBox) {
              return 300 - 2 * padding;
            }
            return 200 - 2 * padding;
          })
          .attr('width', 200 - 2 * padding)
          .attr('x', function (d, i) {
            return i * 200 + padding;
          })
          .attr('y', padding)
          .attr('fill', 'none')
          .style('pointer-events', 'none')
          .append('xhtml:body')
          .attr('class', 'textBox')
          .style('color', '#1F1717')
          .style('background-color', function (d, i) {
            return myColor(colorIndex[i]);
          })
          .html(function (d, i) {
            if (i === 0) {
              return (
                'A: ' + survey[this.props.college][question_index].A.answer_text
              );
            } else if (i === 1) {
              return (
                'B: ' + survey[this.props.college][question_index].B.answer_text
              );
            } else if (i === 2) {
              return (
                'C: ' + survey[this.props.college][question_index].C.answer_text
              );
            } else if (i === 3) {
              return (
                'D: ' + survey[this.props.college][question_index].D.answer_text
              );
            } else if (i === 4) {
              return (
                'E: ' + survey[this.props.college][question_index].E.answer_text
              );
            }
          });
        boxes.exit().remove();
      });

    boxes
      .enter()
      .append('foreignObject')
      .merge(boxes)
      .attr('height', function (d, i) {
        if (i + 1 === this.state.selectedBox) {
          return 400 - 2 * padding;
        }
        return 200 - 2 * padding;
      })
      .attr('width', 200 - 2 * padding)
      .attr('x', function (d, i) {
        return i * 200 + padding;
      })
      .attr('y', padding)
      .attr('fill', 'none')
      .style('pointer-events', 'none')
      .append('xhtml:body')
      .attr('class', 'textBox')
      .style('color', '#1F1717')
      .style('background-color', function (d, i) {
        return myColor(colorIndex[i]);
      })
      .html(function (d, i) {
        if (i === 0) {
          if (this.state.selectedBox === 1) {
            return this.getText(i, colorIndex, 'A', question_index);
          } else {
            return (
              'A: ' + survey[this.props.college][question_index].A.answer_text
            );
          }
        } else if (i === 1) {
          if (this.state.selectedBox === 2) {
            return this.getText(i, colorIndex, 'B', question_index);
          } else {
            return (
              'B: ' + survey[this.props.college][question_index].B.answer_text
            );
          }
        } else if (i === 2) {
          if (this.state.selectedBox === 3) {
            return this.getText(i, colorIndex, 'C', question_index);
          } else {
            return (
              'C: ' + survey[this.props.college][question_index].C.answer_text
            );
          }
        } else if (i === 3) {
          if (this.state.selectedBox === 4) {
            return this.getText(i, colorIndex, 'D', question_index);
          } else {
            return (
              'D: ' + survey[this.props.college][question_index].D.answer_text
            );
          }
        } else if (i === 4) {
          if (this.state.selectedBox === 5) {
            return this.getText(i, colorIndex, 'E', question_index);
          } else {
            return (
              'E: ' + survey[this.props.college][question_index].E.answer_text
            );
          }
        }
      });
  }

  render() {
    return (
      <div>
        <h6>Question:</h6>
        <br />
        <div id="legend"></div>
        <div id="answer-impact"></div>
      </div>
    );
  }
}

export default firebaseConnect()(AnswerImpact);
