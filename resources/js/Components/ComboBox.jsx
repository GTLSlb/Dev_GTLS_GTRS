import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

export default function ComboBox({idField, valueField, addFunction, inputValue, options, setInputValue, onKeyDown, setCommentId}) {
  const [value, setValue] = useState(null);

  useEffect(()=>{
    setValue(inputValue)
  },[])
  return (
    <Autocomplete
      value={value}
      onKeyDown={onKeyDown}
      onChange={(e)=>{
        if(e.target.textContent === `Add "${inputValue}"`){
            setValue(e.target.textContent)
            setCommentId(null)
        // addFunction()
        }else{
            setValue(e.target.textContent)
        }

      }}
    //   onChange={(event, newValue) => {
    //     if (typeof newValue === 'string') {
    //       setValue({
    //         title: newValue,
    //       });
    //     } else if (newValue && newValue.inputValue) {
    //       // Create a new value from the user input
    //       setValue({
    //         title: newValue.inputValue,
    //       });
    //     } else {
    //       setValue(newValue);
    //     }
    //   }}
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
          <li key={option[idField]} {...optionProps}>
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
