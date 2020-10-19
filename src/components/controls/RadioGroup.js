import React from 'react';

import {
  FormControl, FormLabel, FormControlLabel,
  RadioGroup as MuiRadioGroup, Radio,
} from '@material-ui/core';

export default function RadioGroup(props) {
  const {
    name, label, value, disabled, items,
  } = props;

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <MuiRadioGroup
        row
        name={name}
        value={value}
      >
        {
          items.map(
            (item) => (
              <FormControlLabel
                disabled={disabled}
                key={item.id}
                value={item.id}
                control={<Radio />}
                label={item.title}
              />
            ),
          )
        }
      </MuiRadioGroup>
    </FormControl>
  );
}
