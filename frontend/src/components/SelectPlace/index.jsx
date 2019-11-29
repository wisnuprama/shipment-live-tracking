import React from "react";
import places from "./places.json";

export default function SelectPlace({
  placeholder = "Select place",
  onChange = () => {},
  ...props
}) {
  return (
    <select
      defaultValue={placeholder}
      className="form-control custom-select"
      {...props}
      onChange={e => {
        onChange({ ...places[e.target.value], value: e.target.value }, e);
      }}
    >
      <option disabled hidden>
        {placeholder}
      </option>
      {places.map((place, index) => (
        <option key={place.locationName} value={index}>
          {place.locationName}
        </option>
      ))}
    </select>
  );
}
