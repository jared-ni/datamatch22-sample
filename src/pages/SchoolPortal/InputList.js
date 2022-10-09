/** @jsx jsx */

import { Component } from 'react';
import { jsx, Button, Close } from 'theme-ui';

export default class InputList extends Component {
  onClick = () => {
    const { addInput, name } = this.props;
    addInput(name);
  };

  render() {
    let { inputs } = this.props;

    let dict = {};
    for (var i = 0; i < inputs.length; i++) {
      dict[i] = inputs[i];
    }

    return (
      <div>
        <div>
          {Object.keys(dict).map(index => (
            <Input index={index} inputs={dict} key={index} {...this.props} />
          ))}
        </div>
        <Button mt={3} onClick={this.onClick}>
          Add more
        </Button>
      </div>
    );
  }
}

class Input extends Component {
  onChange = event => {
    const { editInput, index, inputs, name } = this.props;
    editInput(index, event.target.value, inputs, name);
  };

  onClick = () => {
    const { index, inputs, name, removeInput } = this.props;
    removeInput(index, inputs, name);
  };

  render() {
    const { index, inputs, placeholder } = this.props;

    return (
      <div className="inputcontainer">
        <input
          className="input"
          onChange={this.onChange}
          type="text"
          value={inputs[index]}
          placeholder={placeholder ? placeholder : ''}
        />
        <Close
          bg="lightPink"
          onClick={this.onClick}
          sx={{ verticalAlign: 'middle' }}
        />
      </div>
    );
  }
}
