import React from "react";

export const NumberRangeFilter = ({ column }) => {
  const { filterValue = [], setFilter } = column;

  const handleMinChange = (event) => {
    const value = event.target.value;
    setFilter((old = []) => [value !== "" ? parseInt(value, 10) : undefined, old[1]]);
  };

  const handleMaxChange = (event) => {
    const value = event.target.value;
    setFilter((old = []) => [old[0], value !== "" ? parseInt(value, 10) : undefined]);
  };

  return (
    <div className="p-1">
      <input
        className="w-full rounded"
        type="number"
        value={filterValue[0] || ""}
        onChange={(e)=>handleMinChange(e)}
        placeholder="Min"
      />
      to
      <input
        className="w-full rounded"
        type="number"
        value={filterValue[1] || ""}
        onChange={(e)=>handleMaxChange(e)}
        placeholder="Max"
      />
    </div>
  );
};
