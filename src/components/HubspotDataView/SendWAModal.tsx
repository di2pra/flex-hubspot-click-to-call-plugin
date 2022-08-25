import { Card, Heading, Paragraph, Spinner, Stack } from '@twilio-paste/core';
import { Alert } from '@twilio-paste/core/Alert';
import { Box } from '@twilio-paste/core/Box';
import { Button } from '@twilio-paste/core/Button';
import { Input } from '@twilio-paste/core/Input';
import { Label } from '@twilio-paste/core/Label';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { Option, Select } from '@twilio-paste/core/Select';
import { Text } from '@twilio-paste/core/Text';
import { TextArea } from '@twilio-paste/core/TextArea';
import * as Flex from "@twilio/flex-ui";
import { useCallback, useEffect, useState } from "react";
import useApi from '../../hooks/useApi';
import { ICustomer } from '../../Types';
import { SEND_SMS_OPTION } from './constants';

const MODAL_ID = "smsOutboundModal";

type Props = {
  selectedContact?: ICustomer,
  handleClose: () => void,
  manager: Flex.Manager
}

const SendWAModal = ({ selectedContact, handleClose, manager }: Props) => {

  const { soundOutboundSms, getTemplate } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });
  const [templateList, setTemplateList] = useState<string[]>();
  const [option, setOption] = useState(SEND_SMS_OPTION[0].value);
  const [message, setMessage] = useState<string>();
  const [isLoadingTemplate, setIsLoadingTemplate] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [messageSent, setMessageSent] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (selectedContact) {
      setIsLoadingTemplate(true);
      setTemplateList(undefined);
      getTemplate({ hubspot_id: selectedContact.hs_object_id })
        .then((data) => { setTemplateList(data) })
        .catch(() => setError("Error while loading tempaltes"))
        .finally(() => setIsLoadingTemplate(false));
    }
  }, [selectedContact]);

  const closeModal = useCallback(() => {
    setOption(SEND_SMS_OPTION[0].value);
    setMessage(undefined);
    setError(undefined);
    setIsProcessing(false);
    setMessageSent(false);
    handleClose();
  }, [handleClose]);

  const onSubmitHandler = useCallback((event) => {
    event.preventDefault();

    setIsProcessing(true);

    if (selectedContact) {
      soundOutboundSms({
        To: `whatsapp:${selectedContact.hs_calculated_phone_number}`,
        customerName: `${selectedContact.firstname || ''} ${selectedContact.lastname || ''}`.trim(),
        Body: message,
        WorkerFriendlyName: manager.workerClient ? manager.workerClient.name : '',
        KnownAgentRoutingFlag: option === SEND_SMS_OPTION[0].value,
        OpenChatFlag: option === SEND_SMS_OPTION[2].value
      })
        .then(() => setMessageSent(true))
        .catch(() => setError("Error while sending the SMS"))
        .finally(() => setIsProcessing(false));
    }



  }, [selectedContact, manager, message, option, soundOutboundSms]);

  const onOptionChangeHandler = useCallback((event) => {
    setOption(event.target.value);
  }, []);

  if (!selectedContact) {
    return null;
  }

  if (messageSent) {
    return (
      <Modal size="wide" ariaLabelledby={MODAL_ID} isOpen onDismiss={closeModal}>
        <ModalHeader>
          <ModalHeading as="h3" id={MODAL_ID}>Send WhatsApp Message to {selectedContact.firstname} {selectedContact.lastname}</ModalHeading>
        </ModalHeader>
        <ModalBody>
          <Alert variant='neutral'>
            <Text as="p">Message successfully sent to {selectedContact.firstname} {selectedContact.lastname}.</Text>
          </Alert>
        </ModalBody>
        <ModalFooter>
          <ModalFooterActions>
            <Button variant="secondary" type='button' onClick={closeModal}>Close</Button>
          </ModalFooterActions>
        </ModalFooter>
      </Modal>
    )
  }

  if (message) {
    return (
      <Modal size="wide" ariaLabelledby={MODAL_ID} isOpen onDismiss={closeModal}>
        <ModalHeader>
          <ModalHeading as="h3" id={MODAL_ID}>Send Whatsapp Message to {selectedContact.firstname} {selectedContact.lastname}</ModalHeading>
        </ModalHeader>
        <Box as="form" onSubmit={onSubmitHandler}>
          <ModalBody>
            {
              error ? (
                <Box marginBottom="space60">
                  <Alert variant='error'>
                    <Text as="p">{error}</Text>
                  </Alert>
                </Box>
              ) : null
            }
            <Box marginBottom="space60">
              <Label htmlFor="outbound_option">Option</Label>
              <Select id="outbound_option" value={option} onChange={onOptionChangeHandler}>
                {SEND_SMS_OPTION.map((item, index) => {
                  return (<Option key={index} value={item.value}>{item.label}</Option>)
                })}
              </Select>
            </Box>
            <Box marginBottom="space60">
              <Label htmlFor="phone_number" required>Phone Number</Label>
              <Input id="phone_number" name="phone_number" type="tel" disabled value={`whatsapp:${selectedContact.hs_calculated_phone_number}`} required />
            </Box>
            <Label htmlFor="message" required>Message</Label>
            <TextArea value={message} disabled={true} id="message" name="message" required />
          </ModalBody>
          <ModalFooter>
            <ModalFooterActions>
              <Button variant="secondary" type='button' onClick={closeModal}>Cancel</Button>
              <Button variant="primary" type='submit' disabled={isProcessing}>{isProcessing ? 'Sending...' : 'Send'}</Button>
            </ModalFooterActions>
          </ModalFooter>
        </Box>
      </Modal>
    )
  }

  if (templateList) {
    return (
      <Modal size="wide" ariaLabelledby={MODAL_ID} isOpen onDismiss={closeModal}>
        <ModalHeader>
          <ModalHeading as="h3" id={MODAL_ID}>Send Whatsapp Message to {selectedContact.firstname} {selectedContact.lastname}</ModalHeading>
        </ModalHeader>
        <ModalBody>
          <Heading as="h4" variant="heading40">Select the template</Heading>
          <Stack orientation="vertical" spacing="space60">
            {
              templateList.map((item, index) => {
                return (
                  <Card key={index}>
                    <Paragraph>{item}</Paragraph>
                    <Button variant="primary" type='button' onClick={() => { setMessage(item) }}>Select</Button>
                  </Card>
                )
              })
            }
          </Stack>
        </ModalBody>
        <ModalFooter>
          <ModalFooterActions>
            <Button variant="secondary" type='button' onClick={closeModal}>Cancel</Button>
          </ModalFooterActions>
        </ModalFooter>
      </Modal>
    )
  } else {
    if (isLoadingTemplate) {
      return (
        <Modal size="wide" ariaLabelledby={MODAL_ID} isOpen onDismiss={closeModal}>
          <ModalHeader>
            <ModalHeading as="h3" id={MODAL_ID}>Send Whatsapp Message to {selectedContact.firstname} {selectedContact.lastname}</ModalHeading>
          </ModalHeader>
          <ModalBody>
            <Box>
              <Paragraph>Loading templates..</Paragraph>
              <Spinner size="sizeIcon100" decorative={false} title="Loading" />
            </Box>
          </ModalBody>
          <ModalFooter>
            <ModalFooterActions>
              <Button variant="secondary" type='button' onClick={closeModal}>Cancel</Button>
            </ModalFooterActions>
          </ModalFooter>
        </Modal>
      )
    }
  }

  return null;


}

export default SendWAModal;