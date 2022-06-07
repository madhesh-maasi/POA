import * as React from "react";
import "./Dashboard.scss";
import { useState, useEffect } from "react";
import { Icon } from "@fluentui/react/lib/Icon";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Pagination from "@material-ui/lab/Pagination";
import { styled } from "@material-ui/core/styles";
// import { TableFooter } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
// import Checkbox from '@mui/material/Checkbox';
import Checkbox from "@material-ui/core/Checkbox";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { loadTheme, createTheme } from "office-ui-fabric-react";
import Swal from "sweetalert2";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import * as strings from "PoADashboardWebPartStrings";
import {
  DatePicker,
  IDatePicker,
  mergeStyleSets,
  defaultDatePickerStrings,
  DefaultButton,
} from "@fluentui/react";
import { Label, TextField } from "@fluentui/react";

const myTheme = createTheme({
  palette: {
    themePrimary: "#003479",
    themeLighterAlt: "#f0f4fa",
    themeLighter: "#c4d4e9",
    themeLight: "#96b2d6",
    themeTertiary: "#4673ae",
    themeSecondary: "#104488",
    themeDarkAlt: "#002f6c",
    themeDark: "#00275b",
    themeDarker: "#001d43",
    neutralLighterAlt: "#faf9f8",
    neutralLighter: "#f3f2f1",
    neutralLight: "#edebe9",
    neutralQuaternaryAlt: "#e1dfdd",
    neutralQuaternary: "#d0d0d0",
    neutralTertiaryAlt: "#c8c6c4",
    neutralTertiary: "#a19f9d",
    neutralSecondary: "#605e5c",
    neutralPrimaryAlt: "#3b3a39",
    neutralPrimary: "#323130",
    neutralDark: "#201f1e",
    black: "#000000",
    white: "#ffffff",
  },
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: "#EBF2FB",
  },
  "&:nth-of-type(odd)": {
    backgroundColor: "#F8F8FA",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
let userAsAdmin = false;
let objRequestInfo = {
  nameId: 0,
  nameEmail: "",
  wwid: "",
  abteilung: "",
  jobtitel: "",
  fuhrungskraft: null,
  jjInterExtern: "",
  ausnahme: "",
  firmeneintritt: null,
  bestätigung: false,
  zeichnet: false,
  verhandelt: false,
  repräsentant: false,
  begründung: "",
  ivStatus: "",
  ivStatusId: 0,
  vergabeDatum: null,
  freigabe: "",
  jobhistorie: "",
  begründungFür: "",
  letztenDatum: null,
  ergebnis: "",
  entzugsDatum: null,
  begründungEntzugs: "",
  id: 0,
  ReasonValues: [],
};
let receivedView = [];
const firstIndex = 0;
let pageSize = 10;
function createData(
  name: string,
  wwid: string,
  abteilung: string,
  jobtitel: string,
  fuhrungskraft: string,
  jjInterExtern: string,
  ivStatus: string,
  datum: string,
  id: number
) {
  return {
    name,
    wwid,
    abteilung,
    jobtitel,
    fuhrungskraft,
    jjInterExtern,
    ivStatus,
    datum,
    id,
  };
}

// let rows = null;
const fuhrungskraftOptions = ["Ja", "Nein"];
const Dashboard = (props) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(userAsAdmin);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [data, setData] = useState(rows.slice(firstIndex, pageSize));
  const [ausnahmeOptions, setAusnahmeOptions] = useState([]);
  const [jjInterExternOptions, setJjInterExternOptions] = useState([]);
  const [ivStatusOptions, setIvStatusOptions] = useState([]);
  const [ergebnisOptions, setErgebnisOptions] = useState([]);
  const [requestInfo, setRequestInfo] = useState(objRequestInfo);
  const [renderTable, setRenderTable] = useState(false);
  const [recEmail, setRecEmail] = useState([]);
  const [langList, setLangList] = useState([]);
  const [userLang, setUserLang] = useState(window.navigator.language);
  const [valueOfDate, setValueOfDate] = useState(null);

  useEffect(() => {
    checkUserIsAdmin();
    getAusnahmeOptions();
    getJjInterExternOptions();
    getIvStatusOptions();
    getErgebnisOptions();
    getLangList();
  }, []);

  const getLangList = async () => {
    await props.spcontext.web.lists
      .getByTitle("Config")
      .items.select("ID, EnglishValue, GermanValue, IsActiveToAdd")
      .filter(`IsActiveToAdd eq '${1}'`)
      .get()
      .then((listValue: any) => {
        setLangList(listValue);
      });
  };

  useEffect(() => {
    getRequests(props.filterItems);
  }, [pageSize, props.filterItems]);

  const handleChange = (event, value) => {
    setPage(value);
    setData(rows.slice(firstIndex + pageSize * (value - 1), pageSize * value));
    console.log(Math.ceil(rows.length / pageSize));
  };
  useEffect(() => {
    if (renderTable) {
      setData(rows.slice(0, pageSize));
      console.log(`loaded table`);
      setRenderTable(false);
    }
  }, [renderTable, props]);

  const checkBoxStyles = (theme) => ({
    root: {
      color: "#003479",
      "&$checked": {
        color: "#003479",
      },
    },
    checked: {},
  });

  const getRequest = async (id) => {
    checkUserIsAdmin();
    const request: any = await props.spcontext.web.lists
      .getByTitle("Requests")
      .items.getById(id)
      .select(
        "*",
        "PAName/EMail",
        "PAName/ID",
        "PAStatus/Title",
        "Reason/ID",
        "Reason/EnglishValue",
        "Reason/GermanValue"
      )
      .expand("PAName", "PAStatus", "Reason")
      .get();
    console.log(request);
    objRequestInfo.nameEmail = request.PAName.EMail;
    objRequestInfo.nameId = request.PAName.ID;
    objRequestInfo.wwid = request.Title;
    objRequestInfo.abteilung = request.PADepartment;
    objRequestInfo.jobtitel = request.PAJobTitle;
    objRequestInfo.fuhrungskraft = request.PAExectuive;
    objRequestInfo.jjInterExtern = request.PAIntExt;
    objRequestInfo.firmeneintritt = request.PAStartDate;
    objRequestInfo.ausnahme = request.PAException;
    objRequestInfo.bestätigung = request.PAConfirmation;
    // objRequestInfo.zeichnet = request.PAContracts;
    // objRequestInfo.verhandelt = request.PANegotiated;
    // objRequestInfo.repräsentant = request.PARepresentative;
    objRequestInfo.begründung = request.PAJustification;
    objRequestInfo.ivStatus = request.PAStatus.Title;
    objRequestInfo.ivStatusId = request.PAStatusId;
    objRequestInfo.vergabeDatum = request.PADateAward;
    objRequestInfo.freigabe = request.PAPdf;
    objRequestInfo.jobhistorie = request.PAJobHistory;
    // objRequestInfo.begründungFür = request.PAIVJustification;
    objRequestInfo.letztenDatum = request.PALastReview;
    objRequestInfo.ergebnis = request.PALastCheckResult;
    objRequestInfo.entzugsDatum = request.PAWithdrawalDate;
    objRequestInfo.begründungEntzugs = request.PAWithdrawalReason;
    objRequestInfo.id = id;
    objRequestInfo.ReasonValues = request.ReasonId;
    setRequestInfo(objRequestInfo);
    setIsEdit(true);
    setIsPanelOpen(true);
  };

  const deleteRequest = async (id) => {
    await props.spcontext.web.lists
      .getByTitle("Requests")
      .items.getById(id)
      .delete();
    getRequests(props.filterItems);
    // alert("Request Deleted");
    // Swal.fire("Record Deleted successfully", "", "success");
  };

  const getRequests = async (filterObj) => {
    let curUserReports = [];
    let curUser = await props.spcontext.web.currentUser();
    receivedView.push(curUser.Email.toLowerCase());
    await props.spcontext.profiles.myProperties.get().then((profiles) => {
      console.log(profiles.DirectReports);
      curUserReports = profiles.DirectReports;
    });
    curUserReports = curUserReports.map((reprt) => reprt.split("|")[2]);
    receivedView = [...receivedView, ...curUserReports];

    if (
      Object.keys(filterObj).length == 0 ||
      (filterObj.name == "" &&
        filterObj.wwid == "" &&
        filterObj.abteilung == "" &&
        filterObj.jobtitel == "" &&
        filterObj.führungskraft == "" &&
        filterObj.jjInternExtern == "" &&
        filterObj.ivStatus == "" &&
        filterObj.datumderi == null)
    ) {
      let allRequests: any[] = await props.spcontext.web.lists
        .getByTitle("Requests")
        .items.select(
          "*",
          "PAName/Title",
          "PAName/EMail",
          "PAStatus/Title",
          "Author/EMail",
          "Reason/ID",
          "Reason/EnglishValue",
          "Reason/GermanValue"
        )
        .expand("PAName", "PAStatus", "Author", "Reason")
        .getAll();
      console.log(allRequests);
      if (!userAsAdmin) {
        allRequests = allRequests.filter(
          (request) =>
            curUser.UserPrincipalName.toLowerCase() ==
              request.Author.EMail.toLowerCase() ||
            receivedView["includes"](request.PAName.EMail.toLowerCase())
        );
      }

      allRequests.sort((a, b) => {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return b.ID - a.ID;
      });
      let requests = [];
      allRequests.forEach(function (request, index) {
        requests.push(
          createData(
            request.PAName.Title,
            request.Title,
            request.PADepartment,
            request.PAJobTitle,
            request.PAExectuive ? "Ja" : "Nein",
            request.PAIntExt,
            request.PAStatus ? request.PAStatus.Title : "",
            request.PADateAward ? request.PADateAward : "-",
            request.Id
          )
        );
        console.log(request.PAName.Title);
        console.log(request);
      });
      setRows([]);
      setData([]);
      setRows(requests);
      setData(
        requests.slice(firstIndex + pageSize * (page - 1), pageSize * page)
      );
    } else {
      let allRequests: any[] = await props.spcontext.web.lists
        .getByTitle("Requests")
        .items.select(
          "*",
          "PAName/Title",
          "PAName/EMail",
          "PAStatus/Title",
          "Author/EMail",
          "Reason/ID",
          "Reason/EnglishValue",
          "Reason/GermanValue"
        )
        .expand("PAName", "PAStatus", "Author", "Reason")
        .getAll();
      if (!userAsAdmin) {
        allRequests = allRequests.filter(
          (request) =>
            curUser.UserPrincipalName.toLowerCase() ==
              request.Author.EMail.toLowerCase() ||
            receivedView["includes"](request.PAName.EMail.toLowerCase())
          // request.Author.EMail.toLowerCase() ==
          // curUser.UserPrincipalName.toLowerCase() ||
          // request.PAName.EMail.toLowerCase() ==
          // curUser.UserPrincipalName.toLowerCase()
        );
      }

      allRequests.sort((a, b) => {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return b.ID - a.ID;
      });

      let requests = [];
      let filteredArr = allRequests.filter((req) =>
        filterObj.name != "" && req.PAName.EMail != "" && req.PAName
          ? req.PAName.EMail == filterObj.name
          : filterObj.name != ""
          ? false
          : true
      );
      filteredArr = filteredArr.filter((req) => {
        if (filterObj.wwid != "" && req.Title && req.Title != "") {
          return req.Title.includes(filterObj.wwid);
        } else if (filterObj.wwid != "") {
          return false;
        } else {
          return true;
        }
      });
      filteredArr = filteredArr.filter((req) => {
        if (filterObj.abteilung.length > 0 && req.PADepartment) {
          // return req.PADepartment == filterObj.abteilung;
          return filterObj.abteilung.includes(req.PADepartment);
        } else if (filterObj.abteilung.length > 0) {
          return false;
        } else {
          return true;
        }
      });
      filteredArr = filteredArr.filter((req) => {
        if (filterObj.jobtitel.length > 0 && req.PAJobTitle) {
          // return req.PADepartment == filterObj.abteilung;
          return filterObj.jobtitel.includes(req.PAJobTitle);
        } else if (filterObj.jobtitel.length > 0) {
          return false;
        } else {
          return true;
        }
      });
      filteredArr = filteredArr.filter((req) => {
        if (
          filterObj.führungskraft.length > 0 &&
          (req.PAExectuive.length > 0 || req.PAExectuive != null)
        ) {
          // return req.PADepartment == filterObj.abteilung;
          return filterObj.führungskraft.includes(`${req.PAExectuive}`);
        } else if (filterObj.führungskraft.length > 0) {
          return false;
        } else {
          return true;
        }
      });
      filteredArr = filteredArr.filter((req) =>
        filterObj.jjInternExtern.length > 0 && req.PAIntExt
          ? filterObj.jjInternExtern.includes(req.PAIntExt)
          : filterObj.jjInternExtern.length > 0
          ? false
          : true
      );
      filteredArr = filteredArr.filter((req) =>
        filterObj.ivStatus.length > 0 && req.PAStatus
          ? filterObj.ivStatus.includes(req.PAStatus.Title)
          : filterObj.ivStatus.length > 0
          ? false
          : true
      );

      filteredArr = filteredArr.filter((req) =>
        filterObj.datumderi != null && req.PADateAward
          ? new Date(req.PADateAward).toLocaleDateString() ==
            new Date(filterObj.datumderi).toLocaleDateString()
          : filterObj.datumderi != null
          ? false
          : true
      );
      requests = [];
      filteredArr.forEach(function (request, index) {
        requests.push(
          createData(
            request.PAName.Title,
            request.Title,
            request.PADepartment,
            request.PAJobTitle,
            request.PAExectuive ? "Ja" : "Nein",
            request.PAIntExt,
            request.PAStatus.Title,
            request.PADateAward ? request.PADateAward : "-",
            request.Id
          )
        );
        console.log(request.PAName.Title);
      });
      setRows([]);
      setData([]);
      setRows(requests);
      setData(
        requests.slice(firstIndex + pageSize * (page - 1), pageSize * page)
      );
    }
  };

  const checkUserIsAdmin = async () => {
    const user = await props.spcontext.web.currentUser();
    const adminUser = await props.spcontext.web.siteGroups
      .getById(+props.groupID)
      .users.filter("Id eq " + user.Id)
      .get();
    userAsAdmin = adminUser.length == 0 ? false : true;
    setIsAdminUser(userAsAdmin);
  };
  const getAusnahmeOptions = async () => {
    const ausnahmeOptions: any[] = await props.spcontext.web.lists
      .getByTitle("Requests")
      .fields.getByInternalNameOrTitle("PAException")
      .select("Choices")
      .get();
    setAusnahmeOptions(ausnahmeOptions["Choices"]);
  };

  const getJjInterExternOptions = async () => {
    const jjInterExternOptions: any[] = await props.spcontext.web.lists
      .getByTitle("Requests")
      .fields.getByInternalNameOrTitle("PAIntExt")
      .select("Choices")
      .get();
    setJjInterExternOptions(jjInterExternOptions["Choices"]);
  };

  const getIvStatusOptions = async () => {
    const ivStatuses: any[] = await props.spcontext.web.lists
      .getByTitle("Status")
      .items.select("Title", "Id")
      .getAll();

    ivStatuses.forEach(function (request, index) {
      ivStatusOptions.push({ Title: request.Title, Id: request.Id });
    });
    setIvStatusOptions(ivStatusOptions);
  };

  const getErgebnisOptions = async () => {
    const ergebnisOptions: any[] = await props.spcontext.web.lists
      .getByTitle("Requests")
      .fields.getByInternalNameOrTitle("PALastCheckResult")
      .select("Choices")
      .get();
    setErgebnisOptions(ergebnisOptions["Choices"]);
  };

  const submitRequests = async () => {
    const newRequest: any = await props.spcontext.web.lists
      .getByTitle("Requests")
      .items.add({
        Title: requestInfo.wwid,
        PADepartment: requestInfo.abteilung,
        PAJobTitle: requestInfo.jobtitel,
        PAExectuive: requestInfo.fuhrungskraft,
        PAException: requestInfo.ausnahme,
        PAIntExt: requestInfo.jjInterExtern,
        PAStartDate: requestInfo.firmeneintritt,
        PAConfirmation: requestInfo.bestätigung,
        // PAContracts: requestInfo.zeichnet,
        // PANegotiated: requestInfo.verhandelt,
        // PARepresentative: requestInfo.repräsentant,
        PAJustification: requestInfo.begründung,
        PANameId: requestInfo.nameId,
        PAStatusId: 1,
        ReasonId: {
          results: requestInfo.ReasonValues, // allows multiple lookup value
        },
      });

    // alert("Item Submitted");
    Swal.fire(
      `<div class='successPopup'>${strings.RecordInsertionSuccessLabel}</div>`
    );
    setIsPanelOpen(false);
    getRequests(props.filterItems);
  };

  const updateRequests = async () => {
    const newRequest: any = await props.spcontext.web.lists
      .getByTitle("Requests")
      .items.getById(objRequestInfo.id)
      .update({
        Title: requestInfo.wwid,
        PADepartment: requestInfo.abteilung,
        PAJobTitle: requestInfo.jobtitel,
        PAExectuive: requestInfo.fuhrungskraft,
        PAException: requestInfo.ausnahme,
        PAIntExt: requestInfo.jjInterExtern,
        PAStartDate: requestInfo.firmeneintritt,
        PAConfirmation: requestInfo.bestätigung,
        // PAContracts: requestInfo.zeichnet,
        // PANegotiated: requestInfo.verhandelt,
        // PARepresentative: requestInfo.repräsentant,
        PAJustification: requestInfo.begründung,
        PANameId: requestInfo.nameId,
        PAStatusId: requestInfo.ivStatusId,
        PADateAward: requestInfo.vergabeDatum,
        PAPdf: requestInfo.freigabe,
        PAJobHistory: requestInfo.jobhistorie,
        // PAIVJustification: requestInfo.begründungFür,
        PALastReview: requestInfo.letztenDatum,
        PALastCheckResult: requestInfo.ergebnis,
        PAWithdrawalDate: requestInfo.entzugsDatum,
        PAWithdrawalReason: requestInfo.begründungEntzugs,
        ReasonId: {
          results: requestInfo.ReasonValues,
        },
      });
    Swal.fire(
      `<div class='successPopup'>${strings.RecordUpdationSuccessLabel}</div>`
    );
    setIsPanelOpen(false);
    getRequests(props.filterItems);
  };

  const validateField = () => {
    let validationError = "";
    if (!requestInfo.nameEmail) {
      validationError = strings.NameErrorMsg;
    } else if (!requestInfo.wwid) {
      validationError = strings.WWIDErrorMsg;
    } else if (!requestInfo.abteilung) {
      validationError = strings.DepartmentErrorMsg;
    } else if (!requestInfo.jobtitel) {
      validationError = strings.JobTitleErrorMsg;
    } else if (requestInfo.fuhrungskraft == null) {
      validationError = strings.ExecutiveErrorMsg;
    } else if (!requestInfo.jjInterExtern) {
      validationError = strings.JErrorMsg;
    } else if (!requestInfo.firmeneintritt) {
      validationError = strings.CompanyErrorMsg;
    } else if (
      !requestInfo.ausnahme ||
      requestInfo.ausnahme == "nicht erforderlich" ||
      requestInfo.ausnahme == "erforderlich"
    ) {
      if (!requestInfo.ausnahme) {
        if (!requestInfo.ausnahme) {
          validationError = strings.ExceptionErrorMsg;
        } else if (!requestInfo.begründung) {
          validationError = strings.JustificationErrorMsg;
        }
      } else if (
        requestInfo.ausnahme == "erforderlich" &&
        !requestInfo.begründung
      ) {
        validationError = strings.JustificationErrorMsg;
      } else if (
        requestInfo.ausnahme == "nicht erforderlich" &&
        !requestInfo.bestätigung &&
        !requestInfo.begründung
      ) {
        validationError = strings.JustificationErrorMsg;
      } else if (requestInfo.ReasonValues.length == 0) {
        validationError = strings.ReasonErrorMsg;
      } else if (!requestInfo.ivStatusId && isEdit) {
        validationError = strings.IVStatusErrorMsg;
      } else if (!requestInfo.vergabeDatum && isEdit) {
        validationError = strings.DateOfIVAwardErrorMsg;
      } else if (!requestInfo.freigabe && isEdit) {
        validationError = strings.ReleaseErrorMsg;
      } else if (!requestInfo.jobhistorie && isEdit) {
        validationError = strings.JobHistoryErrorMsg;
      } else if (!requestInfo.letztenDatum && isEdit) {
        validationError = strings.DateOfLastErrorMsg;
      } else if (
        (!requestInfo.ergebnis ||
          requestInfo.ergebnis == "i.V. wird entzogen") &&
        isEdit
      ) {
        if (!requestInfo.ergebnis) {
          validationError = strings.ResultErrorMsg;
        } else if (!requestInfo.entzugsDatum) {
          validationError = strings.DateOfWithdrawalErrorMsg;
        } else if (!requestInfo.begründungEntzugs) {
          validationError = strings.ReasonForIVErrorMsg;
        }
      }
    }
    // else if (
    //   !requestInfo.ausnahme &&
    //   !requestInfo.bestätigung &&
    //   !requestInfo.begründung
    // ) {
    //   validationError = "Justification for exceptions cannot be empty";
    // } else if (
    //   requestInfo.ausnahme == "erforderlich" &&
    //   !requestInfo.begründung
    // ) {
    //   validationError = "Justification for exceptions cannot be empty";
    // } else if (!requestInfo.bestätigung && !requestInfo.begründung) {
    //   validationError = "Justification for exceptions cannot be empty";
    // }

    // else if (!requestInfo.freigabe {
    //   validationError = "Confirmation Checkbox cannot be Click";
    // }

    validationError
      ? alertify.error(validationError)
      : isEdit
      ? (updateRequests(), props.choiceUpdate())
      : (submitRequests(), props.choiceUpdate());
  };
  // const datePickerRef = React.useRef<IDatePicker>(null);
  const onFormatDate = (date?: Date): string => {
    // return !date ? "" : (date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear());
    return !date
      ? ""
      : `${date.getDate() < 10 ? "0" : ""}${date.getDate()}.${
          date.getMonth() + 1 < 10 ? "0" : ""
        }${date.getMonth() + 1}.${date.getFullYear()}`;
  };
  loadTheme(myTheme);
  // const CustomCheckbox = withStyles(checkBoxStyles)(Checkbox);
  return (
    <div style={{ width: "100%", padding: "1.625rem 1rem", margin: "0 1rem" }}>
      <div className="dashHeadingSection">
        <h2>{strings.DatabaseHeader}</h2>
        <div className="blueLine"></div>
      </div>
      <div className="btnSection">
        <div style={{ width: "36rem" }}>
          <p>
            {/* Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. */}
            {props.tableDesText}
          </p>
        </div>
        <div>
          <button
            className="btnPrimary"
            onClick={() => {
              setIsEdit(false);
              objRequestInfo = {
                nameId: 0,
                nameEmail: "",
                wwid: "",
                abteilung: "",
                jobtitel: "",
                fuhrungskraft: null,
                jjInterExtern: "",
                ausnahme: "",
                firmeneintritt: null,
                bestätigung: false,
                zeichnet: false,
                verhandelt: false,
                repräsentant: false,
                begründung: "",
                ivStatus: "",
                ivStatusId: 0,
                vergabeDatum: null,
                freigabe: "",
                jobhistorie: "",
                begründungFür: "",
                letztenDatum: null,
                ergebnis: "",
                entzugsDatum: null,
                begründungEntzugs: "",
                id: 0,
                ReasonValues: [],
              };
              setRequestInfo(objRequestInfo);
              setIsPanelOpen(true);
            }}
          >
            {strings.NewAuthorizationButton}
          </button>
        </div>
      </div>
      <div style={{ marginTop: "2rem" }}>
        {rows.length > 0 ? (
          <>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">NAME</TableCell>
                    <TableCell align="center">WWID</TableCell>
                    <TableCell align="center">
                      {strings.DepartmentLabel.toUpperCase()}
                    </TableCell>
                    <TableCell align="center">
                      {strings.JobTitleLabel.toUpperCase()}
                    </TableCell>
                    <TableCell align="center">
                      {strings.ExecutiveLabel.toUpperCase()}
                    </TableCell>
                    <TableCell align="center">
                      {strings.JJInternalExternalLabel.toUpperCase()}
                    </TableCell>
                    <TableCell align="center">
                      {strings.IVStatusLabel.toUpperCase()}
                    </TableCell>
                    <TableCell align="center">
                      {strings.IVAwardDateLabel.toUpperCase()}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, i) => (
                    <StyledTableRow key={i}>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.wwid}</TableCell>
                      <TableCell align="center">{row.abteilung}</TableCell>
                      <TableCell align="center">{row.jobtitel}</TableCell>
                      <TableCell align="center">{row.fuhrungskraft}</TableCell>
                      <TableCell align="center">{row.jjInterExtern}</TableCell>
                      <TableCell align="center">{row.ivStatus}</TableCell>
                      <TableCell align="center">
                        <div style={{ height: "26px" }}>
                          {row.datum != "-"
                            ? new Date(row.datum).toLocaleDateString("de-DE")
                            : row.datum}
                        </div>
                        <div
                          className="boxOutIcons"
                          style={{
                            marginTop: !isAdminUser ? "-1.4rem" : "-2.5rem",
                          }}
                        >
                          <div
                            className="iconAdd"
                            onClick={() => {
                              getRequest(row.id);
                            }}
                          ></div>
                          {isAdminUser ? (
                            <div
                              className="iconDelete"
                              onClick={() => {
                                Swal.fire({
                                  title: `<div class="deletePopUp">${strings.DeleteRequestLabel}</div>`,
                                  showCancelButton: true,
                                  confirmButtonText: "Delete",
                                }).then((result) => {
                                  /* Read more about isConfirmed, isDenied below */
                                  if (result.isConfirmed) {
                                    deleteRequest(row.id);
                                    Swal.fire(
                                      `<div class="successPopup">${strings.DeleteRequestSuccessLabel}</div>`
                                    );
                                  }
                                });
                              }}
                            ></div>
                          ) : (
                            ""
                          )}
                        </div>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
                <TableFooter></TableFooter>
              </Table>
            </TableContainer>
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon
                iconName="ChevronLeftEnd6"
                onClick={(e) => {
                  page != 1 ? handleChange(e, 1) : "";
                }}
                style={{
                  marginRight: "0.5rem",
                  fontSize: "0.65rem",
                  color: "#003479",
                  opacity: page == 1 ? 0.38 : 1,
                  cursor: page == 1 ? "default" : "pointer",
                }}
              />
              <Pagination
                count={Math.ceil(rows.length / pageSize)}
                page={page}
                onChange={handleChange}
                color="primary"
              />
              <Icon
                iconName="ChevronRightEnd6"
                onClick={(e) => {
                  page != Math.ceil(rows.length / pageSize)
                    ? handleChange(e, Math.ceil(rows.length / pageSize))
                    : "";
                }}
                style={{
                  marginRight: "0.5rem",
                  fontSize: "0.65rem",
                  color: "#003479",
                  opacity: page == Math.ceil(rows.length / pageSize) ? 0.38 : 1,
                  cursor:
                    page == Math.ceil(rows.length / pageSize)
                      ? "default"
                      : "pointer",
                }}
              />
            </div>{" "}
          </>
        ) : (
          <div className="noDataFound">No Data Found</div>
        )}
      </div>
      {isPanelOpen ? <div className="panelOverlay"></div> : ""}
      {isPanelOpen ? (
        <div className={`sidePanel ${isPanelOpen ? "open" : ""}`}>
          <div className="dashHeadingSection">
            <h2>Antrag auf i.V. Berechtigung</h2>
            <div className="blueLine"></div>
            <Icon
              iconName="Cancel"
              onClick={() => {
                setIsPanelOpen(false);
                setIsEdit(false);
              }}
              style={{
                marginRight: "0.5rem",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "6px",
              }}
            />
          </div>
          <div className="panelInputItem">
            <div className="labelSection">
              <label>Name ({strings.FirstLastNameLabel})</label>
            </div>
            <div
              className={`dashPeoplePicker ${
                isEdit && !isAdminUser ? "disabled" : ""
              }`}
            >
              <PeoplePicker
                context={props.context}
                personSelectionLimit={1}
                showtooltip={true}
                ensureUser={true}
                showHiddenInUI={false}
                principalTypes={[PrincipalType.User]}
                resolveDelay={1000}
                onChange={async (e) => {
                  try {
                    objRequestInfo.nameId = parseInt(e[0].id);
                    let userDetails;
                    let gotJobtitle;
                    await props.spcontext.web.siteUsers
                      .getById(e[0].id)
                      .get()
                      .then((getfromsp) => (userDetails = getfromsp));
                    let a = await props.spcontext.profiles
                      .getUserProfilePropertyFor(
                        userDetails.LoginName,
                        "SPS-JobTitle"
                      )
                      .then((gotItem) => {
                        gotJobtitle = gotItem;
                      });
                    objRequestInfo.jobtitel = gotJobtitle;
                    setRequestInfo({ ...objRequestInfo });
                    objRequestInfo.nameEmail = e[0].secondaryText;
                    setRequestInfo({ ...objRequestInfo });
                  } catch (error) {
                    objRequestInfo.jobtitel = "";
                    setRequestInfo({ ...objRequestInfo });
                    objRequestInfo.nameEmail = "";
                    setRequestInfo({ ...objRequestInfo });
                  }
                }}
                placeholder="Type here"
                defaultSelectedUsers={[requestInfo.nameEmail]}
                disabled={isEdit && !isAdminUser}
                required={true}
              />
            </div>
          </div>
          <div className="d-flex">
            <div className="panelInputItem">
              <div className="labelSection">
                <label>WWID</label>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Type here"
                  defaultValue={requestInfo.wwid}
                  onChange={(e) => {
                    objRequestInfo.wwid = e.target["value"];
                    setRequestInfo(objRequestInfo);
                  }}
                  disabled={isEdit && !isAdminUser}
                />
              </div>
            </div>
            <div className="panelInputItem">
              <div className="labelSection">
                <label>{strings.DepartmentLabel}</label>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Type here"
                  defaultValue={requestInfo.abteilung}
                  onChange={(e) => {
                    objRequestInfo.abteilung = e.target["value"];
                    setRequestInfo(objRequestInfo);
                  }}
                  disabled={isEdit && !isAdminUser}
                />
              </div>
            </div>
          </div>
          <div className="panelInputItem">
            <div className="labelSection">
              <label>{strings.JobTitleLabel}</label>
            </div>
            <div>
              <input
                type="text"
                placeholder="Type here"
                // defaultValue={requestInfo.jobtitel}
                value={requestInfo.jobtitel}
                onChange={(e) => {
                  objRequestInfo.jobtitel = e.target["value"];
                  setRequestInfo({ ...objRequestInfo });
                }}
                disabled={isEdit && !isAdminUser}
              />
            </div>
          </div>
          <div className="d-flex">
            <div className="panelInputItem">
              <div className="labelSection">
                <label>{strings.ExecutiveLabel}</label>
              </div>
              <div>
                <div
                  className={`select ${
                    isEdit && !isAdminUser ? "disabled" : ""
                  }`}
                >
                  <select
                    className="select__field"
                    defaultValue={
                      isEdit
                        ? requestInfo.fuhrungskraft
                          ? "Ja"
                          : "Nein"
                        : null
                    }
                    onChange={(e) => {
                      objRequestInfo.fuhrungskraft =
                        e.target["value"] == "Ja"
                          ? true
                          : e.target["value"] == "Nein"
                          ? false
                          : null;
                      setRequestInfo(objRequestInfo);
                    }}
                    disabled={isEdit && !isAdminUser}
                  >
                    <option value="" selected>
                      Select
                    </option>
                    {fuhrungskraftOptions.map((value, key) => (
                      <option key={key} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="panelInputItem">
              <div className="labelSection">
                <label>{strings.JJInternalExternalLabel}</label>
              </div>
              <div>
                <div
                  className={`select ${
                    isEdit && !isAdminUser ? "disabled" : ""
                  }`}
                >
                  <select
                    className="select__field"
                    defaultValue={requestInfo.jjInterExtern}
                    onChange={(e) => {
                      objRequestInfo.jjInterExtern = e.target["value"];
                      setRequestInfo(objRequestInfo);
                    }}
                    disabled={isEdit && !isAdminUser}
                  >
                    <option value="" selected>
                      Select
                    </option>
                    {jjInterExternOptions.map((value, key) => (
                      <option key={key} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex">
            <div className="panelInputItem panelInputItemSmall">
              <div className="labelSection">
                <label>{strings.CompanyEntryLabel}</label>
              </div>
              <DatePicker
                placeholder="DD.MM.YYYY"
                value={
                  requestInfo.firmeneintritt
                    ? new Date(requestInfo.firmeneintritt)
                    : null
                }
                onSelectDate={(date) => {
                  objRequestInfo.firmeneintritt = date;
                  setRequestInfo({ ...objRequestInfo });
                }}
                formatDate={onFormatDate}
                strings={defaultDatePickerStrings}
                disabled={isEdit && !isAdminUser}
              />
              {/* <div className="labelSection">
                <label>{strings.CompanyEntryLabel}</label>
              </div>
              <div>
                <input
                  type="date"
                  lang="fr-CA"
                  defaultValue={
                    isEdit && requestInfo.firmeneintritt
                      ? requestInfo.firmeneintritt.toString().substring(0, 10)
                      // ?`${requestInfo.firmeneintritt.getDate()}.${requestInfo.firmeneintritt.getMonth()}.${requestInfo.firmeneintritt.getFullYear()}`
                      : null
                  }
                  onChange={(e) => {
                    objRequestInfo.firmeneintritt = new Date(e.target["value"]);
                    setRequestInfo(objRequestInfo);
                  }}
                  disabled={isEdit && !isAdminUser}
                />
              </div> */}
            </div>
            <div className="panelInputItem panelInputItemLarge">
              <div className="labelSection">
                <label>{strings.ExceptionLabel}</label>
              </div>
              <div>
                {/* <input type="text" placeholder="Type here" /> */}
                <div
                  className={`select ${
                    isEdit && !isAdminUser ? "disabled" : ""
                  }`}
                >
                  <select
                    className="select__field"
                    defaultValue={requestInfo.ausnahme}
                    onChange={(e) => {
                      objRequestInfo.ausnahme = e.target["value"];
                      (e.target["value"] == "" && requestInfo.bestätigung) ||
                      (e.target["value"] == "nicht erforderlich" &&
                        requestInfo.bestätigung)
                        ? (objRequestInfo.begründung = "")
                        : "";
                      setRequestInfo({ ...objRequestInfo });
                    }}
                    disabled={isEdit && !isAdminUser}
                  >
                    <option value="" selected>
                      Select
                    </option>
                    {ausnahmeOptions.map((value, key) => (
                      <option key={key} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="panelInputItem">
            <div className="labelSection d-flex justify-space-between">
              <label>{strings.ConfirmationLabel}</label>
              <div
                style={{
                  marginRight: "6px",
                  position: "relative",
                  left: "1rem",
                }}
              >
                {/* <input id="test1" type="checkbox" />
                <label htmlFor={"test1"}>Red</label> */}

                <Checkbox
                  value="checkedIncomplete"
                  color="primary"
                  defaultChecked={requestInfo.bestätigung}
                  onChange={(e) => {
                    objRequestInfo.bestätigung = e.target.checked;
                    (requestInfo.ausnahme == "" && e.target.checked) ||
                    (requestInfo.ausnahme == "nicht erforderlich" &&
                      e.target.checked)
                      ? (objRequestInfo.begründung = "")
                      : "";
                    setRequestInfo({ ...objRequestInfo });
                  }}
                  disabled={isEdit && !isAdminUser}
                />
              </div>
            </div>
          </div>
          <div className="panelInputItem">
            <div className="labelSection">
              <label>{strings.IVReasonLabel} </label>
            </div>
            <ul className="checkboxSection">
              {/* <input type="checkbox" /> */}
              {langList.map((dataValue: any) => {
                return (
                  <li>
                    <label>
                      {userLang.toLowerCase() == "en"
                        ? dataValue.EnglishValue
                        : dataValue.GermanValue}
                    </label>
                    <Checkbox
                      value="checkedIncomplete"
                      color="primary"
                      defaultChecked={
                        requestInfo.ReasonValues.indexOf(dataValue.ID) > -1
                      }
                      id={dataValue.ID}
                      onChange={(e) => {
                        let indexValue = objRequestInfo.ReasonValues.indexOf(
                          parseInt(e.target.id)
                        );
                        if (indexValue > -1) {
                          objRequestInfo.ReasonValues.splice(indexValue, 1);
                        } else {
                          objRequestInfo.ReasonValues.push(
                            parseInt(e.target.id)
                          );
                        }
                        setRequestInfo(objRequestInfo);
                      }}
                      disabled={isEdit && !isAdminUser}
                    />
                  </li>
                );
              })}
              {/* <li>
                <label>{strings.NegotiatedOption}</label>
                <input type="checkbox" />
                <Checkbox
                  value="checkedIncomplete"
                  color="primary"
                  defaultChecked={requestInfo.verhandelt}
                  onChange={(e) => {
                    objRequestInfo.verhandelt = e.target.checked;
                    setRequestInfo(objRequestInfo);
                  }}
                  disabled={isEdit && !isAdminUser}
                />
              </li>
              <li>
                <label>{strings.RepresentativeOption}</label>
                <input type="checkbox" />
                <Checkbox
                  value="checkedIncomplete"
                  color="primary"
                  defaultChecked={requestInfo.repräsentant}
                  onChange={(e) => {
                    objRequestInfo.repräsentant = e.target.checked;
                    setRequestInfo(objRequestInfo);
                  }}
                  disabled={isEdit && !isAdminUser}
                />
              </li> */}
            </ul>
          </div>

          {requestInfo.ausnahme == "erforderlich" ||
          !requestInfo.bestätigung ? (
            <div className="panelInputItem">
              <div className="labelSection">
                <label>{strings.JustificationLabel}</label>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Type here"
                  defaultValue={requestInfo.begründung}
                  onChange={(e) => {
                    objRequestInfo.begründung = e.target["value"];
                    setRequestInfo(objRequestInfo);
                  }}
                  disabled={isEdit && !isAdminUser}
                />
              </div>
            </div>
          ) : (
            ""
          )}

          {isEdit && isAdminUser ? (
            <div>
              <div className="d-flex">
                <div className="panelInputItem panelInputItemLarge">
                  <div className="labelSection">
                    <label>{strings.IVStatusLabel}</label>
                  </div>
                  <div>
                    <div
                      className={`select ${
                        isEdit && !isAdminUser ? "disabled" : ""
                      }`}
                    >
                      <select
                        className="select__field"
                        defaultValue={requestInfo.ivStatusId}
                        onChange={(e) => {
                          objRequestInfo.ivStatusId = parseInt(
                            e.target["value"]
                          );
                          objRequestInfo.ivStatus =
                            e.target[objRequestInfo.ivStatusId].textContent;
                          setRequestInfo(objRequestInfo);
                        }}
                      >
                        <option value="" selected>
                          Select
                        </option>
                        {ivStatusOptions.map((value, key) => (
                          <option key={key} value={value.Id}>
                            {value.Title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="panelInputItem panelInputItemSmall">
                  <div className="labelSection">
                    <label>{strings.IVAwardDateLabel}</label>
                  </div>
                  <DatePicker
                    placeholder="DD.MM.YYYY"
                    value={
                      requestInfo.vergabeDatum
                        ? new Date(requestInfo.vergabeDatum)
                        : null
                    }
                    onSelectDate={(date) => {
                      objRequestInfo.vergabeDatum = date;
                      setRequestInfo({ ...objRequestInfo });
                    }}
                    formatDate={onFormatDate}
                    strings={defaultDatePickerStrings}
                  />
                  {/* <div>
                    <input
                      type="date"
                      defaultValue={
                        isEdit && requestInfo.vergabeDatum
                          ? requestInfo.vergabeDatum.toString().substring(0, 10)
                          : null
                      }
                      onChange={(e) => {
                        objRequestInfo.vergabeDatum = new Date(
                          e.target["value"]
                        );
                        setRequestInfo(objRequestInfo);
                      }}
                    />
                  </div> */}
                </div>
              </div>
              <div className="panelInputItem">
                <div className="labelSection">
                  <label>{strings.ReleasePDFLabel}</label>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Type here"
                    defaultValue={requestInfo.freigabe}
                    onChange={(e) => {
                      objRequestInfo.freigabe = e.target["value"];
                      setRequestInfo(objRequestInfo);
                    }}
                  />
                </div>
              </div>
              <div className="panelInputItem">
                <div className="labelSection">
                  <label>{strings.JobhistoryLabel}</label>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Type here"
                    defaultValue={requestInfo.jobhistorie}
                    onChange={(e) => {
                      objRequestInfo.jobhistorie = e.target["value"];
                      setRequestInfo(objRequestInfo);
                    }}
                  />
                </div>
              </div>
              {/* <div className="panelInputItem">
                <div className="labelSection">
                  <label>{strings.IVJustificationLabel}</label>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Type here"
                    defaultValue={requestInfo.begründungFür}
                    onChange={(e) => {
                      objRequestInfo.begründungFür = e.target["value"];
                      setRequestInfo(objRequestInfo);
                    }}
                  />
                </div>
              </div> */}
              <div className="d-flex">
                <div className="panelInputItem panelInputItemSmall">
                  <div className="labelSection">
                    <label>{strings.LastReviewDateLabel}</label>
                  </div>
                  <DatePicker
                    placeholder="DD.MM.YYYY"
                    value={
                      requestInfo.letztenDatum
                        ? new Date(requestInfo.letztenDatum)
                        : null
                    }
                    onSelectDate={(date) => {
                      objRequestInfo.letztenDatum = date;
                      setRequestInfo({ ...objRequestInfo });
                    }}
                    formatDate={onFormatDate}
                    strings={defaultDatePickerStrings}
                  />
                  {/* <div>
                    <input
                      type="date"
                      defaultValue={
                        isEdit && requestInfo.letztenDatum
                          ? requestInfo.letztenDatum.toString().substring(0, 10)
                          : null
                      }
                      onChange={(e) => {
                        objRequestInfo.letztenDatum = new Date(
                          e.target["value"]
                        );
                        setRequestInfo(objRequestInfo);
                      }}
                    />
                  </div> */}
                </div>
                <div className="panelInputItem panelInputItemLarge">
                  <div className="labelSection">
                    <label>{strings.ResultLabel}</label>
                  </div>
                  <div>
                    <div
                      className={`select ${
                        isEdit && !isAdminUser ? "disabled" : ""
                      }`}
                    >
                      <select
                        className="select__field"
                        defaultValue={requestInfo.ergebnis}
                        onChange={(e) => {
                          objRequestInfo.ergebnis = e.target["value"];
                          objRequestInfo.ergebnis == "i.V. wird entzogen"
                            ? ((objRequestInfo.begründungEntzugs = ""),
                              (objRequestInfo.entzugsDatum = null))
                            : "";
                          setRequestInfo({ ...objRequestInfo });
                        }}
                      >
                        <option value="" selected>
                          Select
                        </option>
                        {ergebnisOptions.map((value, key) => (
                          <option key={key} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {requestInfo.ergebnis == "i.V. wird entzogen" ? (
                <div className="d-flex">
                  <div className="panelInputItem panelInputItemSmall">
                    <div className="labelSection">
                      <label>{strings.IVWithdrawalDateLabel}</label>
                    </div>
                    <DatePicker
                      placeholder="DD.MM.YYYY"
                      value={
                        requestInfo.entzugsDatum
                          ? new Date(requestInfo.entzugsDatum)
                          : null
                      }
                      onSelectDate={(date) => {
                        objRequestInfo.entzugsDatum = date;
                        setRequestInfo({ ...objRequestInfo });
                      }}
                      formatDate={onFormatDate}
                      strings={defaultDatePickerStrings}
                    />
                    {/* <div>
                      <input
                        type="date"
                        defaultValue={
                          isEdit && requestInfo.entzugsDatum
                            ? requestInfo.entzugsDatum
                              .toString()
                              .substring(0, 10)
                            : null
                        }
                        onChange={(e) => {
                          objRequestInfo.entzugsDatum = new Date(
                            e.target["value"]
                          );
                          setRequestInfo(objRequestInfo);
                        }}
                      />
                    </div> */}
                  </div>
                  <div className="panelInputItem panelInputItemLarge">
                    <div className="labelSection">
                      <label>{strings.IVWithdrawalReasonLabel}</label>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Type here"
                        defaultValue={requestInfo.begründungEntzugs}
                        onChange={(e) => {
                          objRequestInfo.begründungEntzugs = e.target["value"];
                          setRequestInfo(objRequestInfo);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}

          <div className="submitBtnSection">
            {isEdit && !isAdminUser ? (
              ""
            ) : (
              <button
                className="btnPrimary btn-sm"
                onClick={() => {
                  validateField();
                }}
              >
                {strings.SaveButton}
              </button>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default Dashboard;
