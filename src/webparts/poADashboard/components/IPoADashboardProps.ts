import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IPoADashboardProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context:WebPartContext;
  tableDesText:string;
  groupID:string;
}
