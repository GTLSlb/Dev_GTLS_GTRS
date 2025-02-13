import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

export default function ComboBox({idField, valueField, onChange, inputValue, options, setInputValue, onKeyDown, onCancel}) {
  const [value, setValue] = useState(null);

  useEffect(()=>{
    setValue(inputValue)
  },[])
  return (
    <Autocomplete
      value={value}
      onKeyDown={onKeyDown}
      onChange={(e, newValue)=>onChange(e, newValue)}
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
      onBlurCapture={onCancel}
      handleHomeEndKeys
      id="combo-box"
      options={options}
      defaultValue={inputValue}
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
        const { key, ...optionProps } = props;
           return (
          <li key={option[idField]} id={option[idField]} {...optionProps}>
            {option[valueField]}
          </li>
        );
      }}
      sx={{ width: 300 }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} />
      )}
    />
  );
}
