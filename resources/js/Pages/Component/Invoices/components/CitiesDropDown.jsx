import React, { useState } from 'react';

const CitiesDropDown = ({options,setfilter}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

  const handleSearch = (event) => {
    const searchInput = event.target.value.toLowerCase();
    setSearchTerm(searchInput);
    const filtered = options.filter((option) =>
      option.CityName.toLowerCase().startsWith(searchInput)
    );
    setFilteredOptions(filtered);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) =>
          setfilter(e.target.value)
      }
        value={searchTerm}
      />
      {filteredOptions.length > 0 && (
        <ul>
          {filteredOptions.map((option) => (
            <li key={option.CityName}>{option.CityName}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitiesDropDown;
