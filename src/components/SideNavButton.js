import * as Flex from "@twilio/flex-ui";
import React from "react";

const SideNavButton = ({ activeView }) => {

  return (
    <Flex.SideLink
      showLabel={true}
      icon="Directory"
      iconActive="DirectoryBold"
      isActive={activeView === "customers"}
      onClick={() => { Flex.Actions.invokeAction("HistoryPush", `/customers`); }}
      key="MyCustomPageSideLink"
    >
      My custom page
    </Flex.SideLink>
  );
}

export default SideNavButton;