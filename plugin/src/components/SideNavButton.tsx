import * as Flex from "@twilio/flex-ui";

type Props = {
  activeView?: string
}

const SideNavButton = ({ activeView }: Props): JSX.Element | null => {

  return (
    <Flex.SideLink
      showLabel={true}
      icon="Directory"
      iconActive="DirectoryBold"
      isActive={activeView === "customers"}
      onClick={() => { Flex.Actions.invokeAction("HistoryPush", `/customers`); }}
      key="MyCustomPageSideLink"
    >Customers</Flex.SideLink>
  );
}

SideNavButton.displayName = 'SideNavButton';

export default SideNavButton;