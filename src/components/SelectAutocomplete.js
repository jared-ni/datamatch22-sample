import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';

export default class SelectAutocomplete extends Component {
  render() {
    const {
      inputClass,
      items,
      menuClass,
      inputName,
      onBlur,
      onChange,
      onSelect,
      placeholder,
      value,
    } = this.props;

    return (
      <div>
        <Autocomplete
          autoHighlight={true}
          getItemValue={item => item}
          inputProps={{ onBlur, placeholder }}
          items={items}
          onChange={onChange}
          onSelect={onSelect}
          renderItem={(item, highlighted) => (
            <div
              key={item}
              style={{ backgroundColor: highlighted ? '#eee' : 'transparent' }}
            >
              {item}
            </div>
          )}
          renderInput={props => (
            <input
              {...props}
              autoComplete="none"
              className={inputClass}
              name={inputName}
              style={{ marginBottom: 0 }}
            />
          )}
          renderMenu={items => (
            <div className={menuClass} children={items.slice(0, 10)} />
          )}
          shouldItemRender={(item, value) =>
            item.toLowerCase().indexOf(value.toLowerCase()) > -1
          }
          value={value}
          wrapperStyle={{
            position: 'relative',
          }}
        />
      </div>
    );
  }
}
