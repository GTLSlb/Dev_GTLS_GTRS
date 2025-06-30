import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

export default function ComboBox({idField, valueField, onChange, inputValue, options, setInputValue, onKeyDown, onCancel, isMulti, isDisabled}) {
  const [value, setValue] = useState(isMulti? [] : null);

  useEffect(() => {
    if(!isMulti && inputValue){
        setValue(inputValue)
    }
  },[inputValue])

  return (
    <Autocomplete
      value={value}
      defaultValue={isMulti? [] : inputValue}
      onKeyDown={onKeyDown}
      multiple={isMulti}
      sx={{
        width: '300px',
        height: '30px',
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <span
            key={option.CommentId}
            {...getTagProps({ index })}
            style={{
              display: 'inline-block',
              width: '80px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {option.Comment}
          </span>
        ))
      }
      disabled={isDisabled}
      onChange={(e, newValue)=>{onChange(e, newValue); setValue(newValue)}}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option[valueField]);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            [idField]: `${inputValue}`,
            [valueField]: `Add "${inputValue}"`,
          });
        }
        setInputValue(inputValue)
        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      onBlur={onCancel}
      handleHomeEndKeys
      id="combo-box"
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option[valueField];
      }}
      renderOption={(props, option) => {
        const { ...optionProps } = props;
           return (
          <li key={option[idField]} id={option[idField]} {...optionProps}>
            {option[valueField]}
          </li>
        );
      }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} />
      )}
    />
  );
}

ComboBox.propTypes = {
  idField: PropTypes.string.isRequired,
  valueField: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  inputValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  options: PropTypes.array.isRequired,
  setInputValue: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  onCancel: PropTypes.func,
  isMulti: PropTypes.bool,
  isDisabled: PropTypes.bool,
};
