import { Callout, CalloutHeading, CalloutText } from '@twilio-paste/core';
import { Box } from '@twilio-paste/core/Box';

type Props = {
  error?: string
}

function TableErrorBox({ error }: Props) {

  if (!error) {
    return null;
  }

  return (
    <Box marginTop="space50">
      <Callout variant='error'>
        <CalloutHeading>Error Callout</CalloutHeading>
        <CalloutText>{error}</CalloutText>
      </Callout>
    </Box>
  )
}

export default TableErrorBox;