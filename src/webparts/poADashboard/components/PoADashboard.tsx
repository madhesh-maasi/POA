import * as React from "react";
import styles from "./PoADashboard.module.scss";
import { IPoADashboardProps } from "./IPoADashboardProps";
import { escape } from "@microsoft/sp-lodash-subset";
import App from "./App";
import "../../ExternalRef/css/style.css";
import { sp } from "@pnp/pnpjs";

export default class PoADashboard extends React.Component<
  IPoADashboardProps,
  {}
> {
  constructor(prop: IPoADashboardProps, state: {}) {
    super(prop);
    sp.setup({
      spfxContext: this.props.context,
    });
  }

  public render(): React.ReactElement<IPoADashboardProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
    } = this.props;

    return (
      <App
        spcontext={sp}
        context={this.props.context}
        tableDesText={this.props.tableDesText}
        groupID={this.props.groupID}
      />
    );
  }
}
