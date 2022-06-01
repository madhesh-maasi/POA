declare interface IPoADashboardWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  NewAuthorizationButton : string;  
  DepartmentLabel : string;
  JobTitleLabel : string;
  ExecutiveLabel : string;
  JJInternalExternalLabel :string;
  IVStatusLabel : string;
  IVAwardDateLabel : string;
  FirstLastNameLabel : string;
  CompanyEntryLabel : string;
  ExceptionLabel : string;
  ConfirmationLabel : string;
  IVReasonLabel : string;
  JustificationLabel: string;
  DrawsContractsOption: string;
  NegotiatedOption: string;
  RepresentativeOption: string;
  ReleasePDFLabel : string;
  JobhistoryLabel : string;
  IVJustificationLabel : string;
  LastReviewDateLabel : string;
  ResultLabel : string;
  IVWithdrawalDateLabel : string;
  IVWithdrawalReasonLabel: string;
  DatabaseHeader: string;
  SaveButton:string;
  DeleteRequestLabel:string;
  DeleteRequestSuccessLabel:string;
  DeleteButton:string;
  CancelButton:string;
  RecordInsertionSuccessLabel:string;
  RecordUpdationSuccessLabel:string;
  NameErrorMsg:string;
  WWIDErrorMsg:string;
  DepartmentErrorMsg:string;
  JobTitleErrorMsg:string;
  ExecutiveErrorMsg:string;
  JErrorMsg:string;
  CompanyErrorMsg:string;
  ExceptionErrorMsg:string;
  ReasonErrorMsg:string;
  JustificationErrorMsg:string;
  IVStatusErrorMsg:string;
  DateOfIVAwardErrorMsg:string;
  ReleaseErrorMsg:string;
  JobHistoryErrorMsg:string;
  DateOfLastErrorMsg:string;
  ResultErrorMsg:string;
  DateOfWithdrawalErrorMsg:string;
  ReasonForIVErrorMsg:string
}

declare module 'PoADashboardWebPartStrings' {
  const strings: IPoADashboardWebPartStrings;
  export = strings;
}
