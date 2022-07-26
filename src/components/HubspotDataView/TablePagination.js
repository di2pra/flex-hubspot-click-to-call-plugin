import { Box } from '@twilio-paste/core/Box';
import {
  Pagination, PaginationArrow, PaginationItems, PaginationLabel
} from '@twilio-paste/core/pagination';
import React from 'react';

function TablePagination({ isLoading, data, dataState }) {

  if (isLoading || data === undefined) {
    return null
  }

  if (data.results === undefined || data.results.length === 0) {
    return (
      <Box display="flex" justifyContent="center">
        <Pagination label="anchor pagination navigation">
          <PaginationItems>
            <PaginationLabel>0-0 of 0 contact</PaginationLabel>
          </PaginationItems>
        </Pagination>
      </Box>
    )
  }

  return (
    <Box display="flex" justifyContent="center">
      <Pagination label="anchor pagination navigation">
        <PaginationItems>
          <PaginationArrow onClick={(e) => { e.preventDefault(); onPaginateHandler(dataState.after - dataState.limit); }} disabled={dataState.after === 0} as="button" label="Go to previous page" variant="back" />
          <PaginationLabel>{dataState.after + 1}–{(dataState.after + dataState.limit > data.total) ? (data.total) : (dataState.after + dataState.limit)} of {data.total} contacts</PaginationLabel>
          <PaginationArrow onClick={(e) => { e.preventDefault(); onPaginateHandler(dataState.after + dataState.limit); }} disabled={data && data.total <= (dataState.after + dataState.limit)} as="button" label="Go to next page" variant="forward" />
        </PaginationItems>
      </Pagination>
    </Box>
  )

}

export default TablePagination;