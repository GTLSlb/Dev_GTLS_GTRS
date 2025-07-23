import React, {useState } from "react";
import { default as ReactSelect } from "react-select";
import { components } from "react-select";
import PropTypes from "prop-types";

const Option = (props) => {
    return (
        <div>
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                />
                <label>{props.label}</label>
            </components.Option>
        </div>
    );
};
Option.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    // Add other prop types as needed
};

const MultiSelect = ({ onMultiSelectChange }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      // Add more styles here as needed
    }),
    option: (provided) => ({
      ...provided,
      // Add more styles here as needed
    }),
    valueContainer: (provided) => ({
      ...provided,
      overflow : 'none'
      // fontSize: '10px',
    }),
    // Add more style functions here as needed
  };
    const [optionSelected, setoptionSelected] = useState([]);
    const handleChange = (selected) => {
        const values = selected.map((option) => option.value);
        setoptionSelected(selected);
        onMultiSelectChange(values);

    };

    const customerOptions = [
        { value: "449", label: "UNILEVER AUSTRALIA LTD - HPC" },
        { value: "1646", label: "UNILEVER AUSTRALIA" },
        { value: "1507", label: "UNILEVER AUSTRALIA LTD - FOODS" },
        { value: "450", label: "UNILEVER AUSTRALIA LTD - QLD" },
        { value: "1550", label: "UNILEVER AUSTRALIA LTD - WW FOODS" },
        { value: "1509", label: "UNILEVER AUSTRALIA LTD - WW HPC" },
        { value: "245", label: "UNILEVER AUSTRALIA TRADING LTD " },
        { value: "357", label: "UNILEVER AUSTRALIA TRADING LTD - PO" },
    ];
    return (
        <span
            className="text-black-800 text-xs h-full"
            // class="d-inline-block"
            data-toggle="popover"
            data-trigger="focus"
            data-content="Please select account(s)"
        >
            <ReactSelect
            styles={customStyles}
                options={customerOptions}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{
                    Option,
                }}
                onChange={handleChange}
                allowSelectAll={true}
                value={optionSelected}
            />
        </span>
    );
};

MultiSelect.propTypes = {
    onMultiSelectChange: PropTypes.func.isRequired,
};

// const rootElement = document.getElementById("root");

export default MultiSelect;
// // ReactDOM.render(<MultiSelect />, rootElement);
