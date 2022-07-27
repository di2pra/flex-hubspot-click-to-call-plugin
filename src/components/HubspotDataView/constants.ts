export const PAGE_SIZE_OPTIONS = [10, 20, 30];

export const SEND_SMS_OPTION: {
  value: string;
  label: string;
}[] = [
    {
      value: "SMS_TASK_AFTER_REPLY_ASSIGNED_TO_AGENT",
      label: "Send message and open chat with the customer when he replies (routed to me)"
    },
    {
      value: "SMS_TASK_AFTER_REPLY",
      label: "Send message and open chat with the customer when he replies (routed to any agent)"
    },
    {
      value: "TASK_AND_SMS",
      label: "Send message and open chat with the customer"
    }
  ]