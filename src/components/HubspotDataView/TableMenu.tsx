import { Box } from '@twilio-paste/core/Box';
import { Input } from '@twilio-paste/core/Input';
import { Option, Select } from '@twilio-paste/core/Select';
import React from 'react';
import { ITableDataState } from '../../Types';
import { PAGE_SIZE_OPTIONS } from './constants';

type Props = {
  dataState: ITableDataState;
  setDataState: React.Dispatch<React.SetStateAction<ITableDataState>>
}

function TableMenu({ dataState, setDataState }: Props) {

  const onQueryChangeHandler = React.useCallback((event) => {

    event.preventDefault();

    setDataState(prevState => { return { ...prevState, after: 0, query: event.target.value } });
  }, [setDataState]);

  const onItemPerPageChangeHandler = React.useCallback((event) => {

    event.preventDefault();

    setDataState(prevState => { return { ...prevState, after: 0, limit: Number(event.target.value) } });
  }, [setDataState]);

  return (
    <Box display="flex" justifyContent="space-between">
      <Box width="size40">
        <Input
          aria-label="Search"
          type="text"
          placeholder="Search for a customer"
          value={dataState.query || ''}
          onChange={onQueryChangeHandler}
        />
      </Box>
      <Box>
        <Select id="items_per_page" value={dataState.limit.toString()} onChange={onItemPerPageChangeHandler}>
          {
            PAGE_SIZE_OPTIONS.map((item, index) => {
              return (<Option key={index} value={item.toString()}>{item}</Option>)
            })
          }
        </Select>
      </Box>
    </Box>
  )

}

export default TableMenu;