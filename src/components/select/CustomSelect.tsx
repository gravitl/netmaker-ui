import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTranslation } from 'react-i18next'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function CustomSelect(Props: {
    items: string[],
    onSelect: (s: string) => void,
    placeholder: string,
}) {
  const theme = useTheme();
  const [selectedItem, setSelectedItem] = React.useState<string[]>([]);
  const { t } = useTranslation()
  const handleChange = (event: SelectChangeEvent<typeof selectedItem>) => {
    const {
      target: { value },
    } = event;
    setSelectedItem(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    Props.onSelect(value as string)
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: '20em', mt: 3 }}>
        <Select
          displayEmpty
          value={selectedItem}
          onChange={handleChange}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>{Props.placeholder}</em>;
            }

            return selected.join(', ');
          }}
          MenuProps={MenuProps}
          inputProps={{ 'aria-label': t('common.select') }}
        >
          <MenuItem disabled value="">
            <em>{Props.placeholder}</em>
          </MenuItem>
          {Props.items.map((item) => (
            <MenuItem
              key={item}
              value={item}
              style={getStyles(item, selectedItem, theme)}
            >
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
