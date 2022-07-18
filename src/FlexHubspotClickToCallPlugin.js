import { CustomizationProvider } from "@twilio-paste/core/customization";
import { FlexPlugin } from '@twilio/flex-plugin';
import * as Flex from "@twilio/flex-ui";
import HubspotDataView from "./components/HubspotDataView/index.js";
import SideNavButton from "./components/SideNavButton.js";

const PLUGIN_NAME = 'FlexHubspotClickToCallPlugin';

export default class FlexHubspotClickToCallPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {


    flex.setProviders({
      PasteThemeProvider: CustomizationProvider
    });

    flex.ViewCollection.Content.add(
      <Flex.View name="customers" key="customers">
        <HubspotDataView key="HubspotDataView" manager={manager} />
      </Flex.View>
    );
    flex.SideNav.Content.add(
      <SideNavButton key="side-nav-button-key" />
    );
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  /*registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }*/
}