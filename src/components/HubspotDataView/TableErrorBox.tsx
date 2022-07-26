import { Alert } from '@twilio-paste/core/Alert';
import { Box } from '@twilio-paste/core/Box';
import { Text } from '@twilio-paste/core/Text';

type Props = {
  error?: string
}

function TableErrorBox({ error }: Props) {

  if (!error) {
    return null;
  }

  return (
    <Box>
      <Alert variant='error'>
        <Text as="p">{error}</Text>
      </Alert>
    </Box>
  )
}

export default TableErrorBox;