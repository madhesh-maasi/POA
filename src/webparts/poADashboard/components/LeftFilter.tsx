import * as React from "react";
import "./LeftFilter.scss";
import { useState, useEffect } from "react";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { loadTheme, createTheme } from "office-ui-fabric-react";
import {
  Dropdown,
  DropdownMenuItemType,
  IDropdownOption,
  IDropdownStyles,
} from "@fluentui/react/lib/Dropdown";

import * as strings from "PoADashboardWebPartStrings";
import { DatePicker } from "@fluentui/react";

const dropdownStyles: Partial<IDropdownStyles> = { dropdown: {} };

let objFilterItems = {
  name: "",
  wwid: "",
  abteilung: [],
  jobtitel: [],
  führungskraft: [],
  jjInternExtern: [],
  ivStatus: [],
  datumderi: null,
};
let arrPAIntExtChoice = [];
let selectedUser = [];
const LeftFilter = (props) => {
  const [filterItems, setFilterItems] = useState(objFilterItems);
  const [reRenderFilters, setRerenderFilters] = useState(false);
  const [paIntExt, setPaiIntExt] = useState(arrPAIntExtChoice);
  const [abteilungChoice, setAbteilungChoice] = useState([]);
  const [jobTitelChoice, setJobTitelChoice] = useState([]);
  const [PAExectuiveChoice, setPAExectuive] = useState([
    {
      key: "true",
      text: "Ja",
      title: "Ja",
    },
    {
      key: "false",
      text: "Nein",
      title: "Nein",
    },
  ]);
  const [status, setStatus] = useState([]);
  const [PADateAward, setPADateAward] = useState([]);
  const [ppSelectedUser, setPPSelectedUser] = useState(selectedUser);
  const [abteilungselectedKeys, setabteilungSelectedKeys] = useState<string[]>(
    []
  );
  const [jobTitleselectedKeys, setJobTitleselectedKeys] = useState<string[]>(
    []
  );
  const [führungskraftselectedKeys, setFührungskraftSelectedKeys] = useState<
    string[]
  >([]);
  const [jjInternExternselectedKeys, setJjInternExternSelectedKeys] = useState<
    string[]
  >([]);
  const [ivStatusSelectedKeys, setIvStatusSelectedKeys] = useState<string[]>(
    []
  );
  useEffect(() => {
    getChoiceHandler();
  }, [props.choiceUpdate]);
  useEffect(() => {
    if (reRenderFilters) {
      setFilterItems(objFilterItems);
      props.getFilter(objFilterItems);
      setRerenderFilters(false);
    }
  }, [reRenderFilters]);
  const getChoiceHandler = () => {
    props.spcontext.web.lists
      .getByTitle("Requests")
      .fields.filter("EntityPropertyName eq 'PAIntExt'")
      .get()
      .then(async (PAIntExtChoice) => {
        arrPAIntExtChoice = PAIntExtChoice[0].Choices;
        await setPaiIntExt(
          arrPAIntExtChoice.map((choiceItem) => {
            return {
              key: choiceItem,
              text: choiceItem,
              title: choiceItem,
            };
          })
        );
        props.spcontext.web.lists
          .getByTitle("Requests")
          .items.get()
          .then((liItems) => {
            let abteilungItems = liItems.map((item) => {
              return item.PADepartment;
            });
            let jobtitleItems = liItems.map((item) => {
              return item.PAJobTitle;
            });
            let PADateAward = liItems.map((item) => {
              return item.PADateAward;
            });
            // Duplicate removed
            abteilungItems = abteilungItems
              .filter((item, pos) => {
                return abteilungItems.indexOf(item) == pos;
              })
              .filter(
                (item) => item != null && item != undefined && item != ""
              );
            // setAbteiChoices(abteilungItems.map((choiceItem)=>{
            //   return {
            //     key:choiceItem,text:choiceItem,title:choiceItem
            //   }
            // }))
            setAbteilungChoice(
              abteilungItems.map((choiceItem) => {
                return {
                  key: choiceItem,
                  text: choiceItem,
                  title: choiceItem,
                };
              })
            );
            jobtitleItems = jobtitleItems
              .filter((item, pos) => {
                return jobtitleItems.indexOf(item) == pos;
              })
              .filter(
                (item) => item != null && item != undefined && item != ""
              );
            setJobTitelChoice(
              jobtitleItems.map((choiceItem) => {
                return {
                  key: choiceItem,
                  text: choiceItem,
                  title: choiceItem,
                };
              })
            );
            PADateAward = PADateAward.filter((item, pos) => {
              return PADateAward.indexOf(item) == pos;
            }).filter(
              (item) => item != null && item != undefined && item != ""
            );
            PADateAward = PADateAward.map((date) => {
              return new Date(date).toLocaleDateString();
            });
            setPADateAward(PADateAward);
          });
        await props.spcontext.web.lists
          .getByTitle("Status")
          .items.get()
          .then((statusitems) => {
            setStatus(
              statusitems.map((statusItem) => {
                return {
                  key: statusItem.Title,
                  text: statusItem.Title,
                  title: statusItem.Title,
                };
              })
            );
          });
      })
      .catch((error) => console.log(error));
  };
  const abteilungChoiceonChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    if (item) {
      let arrSelectedKey = item.selected
        ? [...abteilungselectedKeys, item.key as string]
        : abteilungselectedKeys.filter((key) => key !== item.key);
      console.log(objFilterItems);
      setabteilungSelectedKeys(arrSelectedKey);
      objFilterItems.abteilung = arrSelectedKey;
      setRerenderFilters(true);
    }
  };
  const jobTitleChoiceonChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    if (item) {
      let arrJobTitleSelectedKey = item.selected
        ? [...jobTitleselectedKeys, item.key as string]
        : jobTitleselectedKeys.filter((key) => key !== item.key);
      console.log(objFilterItems);
      setJobTitleselectedKeys(arrJobTitleSelectedKey);
      objFilterItems.jobtitel = arrJobTitleSelectedKey;
      setRerenderFilters(true);
    }
  };
  const führungskraftChoiceonChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    if (item) {
      let arrführungskraftSelectedKey = item.selected
        ? [...führungskraftselectedKeys, item.key as string]
        : führungskraftselectedKeys.filter((key) => key !== item.key);
      console.log(objFilterItems);
      setFührungskraftSelectedKeys(arrführungskraftSelectedKey);
      objFilterItems.führungskraft = arrführungskraftSelectedKey;
      setRerenderFilters(true);
    }
  };
  const jjIntExtChoiceonChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    if (item) {
      let arrjjIntExtSelectedKey = item.selected
        ? [...jjInternExternselectedKeys, item.key as string]
        : jjInternExternselectedKeys.filter((key) => key !== item.key);
      console.log(objFilterItems);
      setJjInternExternSelectedKeys(arrjjIntExtSelectedKey);
      objFilterItems.jjInternExtern = arrjjIntExtSelectedKey;
      setRerenderFilters(true);
    }
  };
  const ivStatusChoiceonChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    if (item) {
      let arrivStatusSelectedKey = item.selected
        ? [...ivStatusSelectedKeys, item.key as string]
        : ivStatusSelectedKeys.filter((key) => key !== item.key);
      console.log(objFilterItems);
      setIvStatusSelectedKeys(arrivStatusSelectedKey);
      objFilterItems.ivStatus = arrivStatusSelectedKey;
      setRerenderFilters(true);
    }
  };

  const onFormatDate = (date?: Date): string => {
    return !date
      ? ""
      : `${date.getDate() < 10 ? "0" : ""}${date.getDate()}.${
          date.getMonth() + 1 < 10 ? "0" : ""
        }${date.getMonth() + 1}.${date.getFullYear()}`;
  };
  return (
    <div className="leftFilterSection">
      <div className="HeadingSection">
        <h2>Filters</h2>
        <div className="blueLine"></div>
      </div>
      <div className="filterSection">
        <div className="filterItem">
          <div className="labelSection">
            <label>Name</label>
          </div>
          <div className="leftFilterPeoplePicker">
            {/* <input
              type="text"
              value={filterItems.name}
              placeholder="Type here"
              onChange={(e) => {
                console.log(e.target.value);
                objFilterItems.name = e.target.value;
                setRerenderFilters(true);
              }}
            /> */}
            <PeoplePicker
              defaultSelectedUsers={ppSelectedUser}
              context={props.context}
              personSelectionLimit={1}
              showtooltip={true}
              disabled={false}
              showHiddenInUI={false}
              principalTypes={[PrincipalType.User]}
              resolveDelay={1000}
              onChange={(e) => {
                console.log(e.length > 0 ? e[0].secondaryText : "");
                selectedUser = e;
                e.length > 0
                  ? ((objFilterItems.name = e[0].secondaryText),
                    setPPSelectedUser(selectedUser))
                  : (objFilterItems.name = ""),
                  setPPSelectedUser((selectedUser = e));
                setRerenderFilters(true);
              }}
              placeholder="Type here"
            />
          </div>
        </div>
        <div className="filterItem">
          <div className="labelSection">
            <label>WWID</label>
          </div>
          <div>
            <input
              type="text"
              placeholder="Type here"
              value={filterItems.wwid}
              onChange={(e) => {
                console.log(e.target.value);
                objFilterItems.wwid = e.target.value;
                setRerenderFilters(true);
              }}
            />
          </div>
        </div>
        <div className="filterItem">
          <div className="labelSection">
            <label>{strings.DepartmentLabel}</label>
          </div>
          <div style={{ width: "100%" }}>
            {/* <div className="select"> */}
            {/* <select
                value={
                  filterItems.abteilung == "" ? "0" : filterItems.abteilung
                }
                className="select__field"
                onChange={(e) => {
                  console.log(e.target.value);
                  objFilterItems.abteilung =
                    e.target.value == "0" ? "" : e.target.value;
                  setRerenderFilters(true);
                }}
              >
                <option value="0" selected>
                  Choose option ...
                </option>
                {abteilungChoice.map((choiceItem) => {
                  return <option value={choiceItem}>{choiceItem}</option>;
                })}
              </select> */}

            {/* </div> */}
            <Dropdown
              placeholder="Select"
              label=""
              selectedKeys={abteilungselectedKeys}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={abteilungChoiceonChange}
              multiSelect
              options={abteilungChoice}
              styles={dropdownStyles}
            />
          </div>
        </div>
        <div className="filterItem">
          <div className="labelSection">
            <label>{strings.JobTitleLabel}</label>
          </div>
          <div>
            {/* <div className="select">
              <select
                className="select__field"
                value={filterItems.jobtitel == "" ? "0" : filterItems.jobtitel}
                onChange={(e) => {
                  console.log(e.target.value);
                  objFilterItems.jobtitel =
                    e.target.value == "0" ? "" : e.target.value;
                  setRerenderFilters(true);
                }}
              >
                <option value="0" selected>
                  Choose option ...
                </option>
                {jobTitelChoice.map((choiceItem) => {
                  return <option value={choiceItem}>{choiceItem}</option>;
                })}
              </select>
            </div> */}
            <Dropdown
              placeholder="Select"
              label=""
              selectedKeys={jobTitleselectedKeys}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={jobTitleChoiceonChange}
              multiSelect
              options={jobTitelChoice}
              styles={dropdownStyles}
            />
          </div>
        </div>
        <div className="filterItem">
          <div className="labelSection">
            <label>{strings.ExecutiveLabel}</label>
          </div>
          <div>
            {/* <div className="select">
              <select
                className="select__field"
                value={
                  filterItems.führungskraft == ""
                    ? "0"
                    : filterItems.führungskraft == "false"
                    ? "Nein"
                    : "Ja"
                }
                onChange={(e) => {
                  console.log(e.target.value);
                  objFilterItems.führungskraft =
                    e.target.value == "0"
                      ? ""
                      : e.target.value == "Nein"
                      ? "false"
                      : "true";
                  setRerenderFilters(true);
                }}
              >
                <option value="0" selected>
                  Choose option ...
                </option>
                {PAExectuiveChoice.map((choiceItem) => {
                  return <option value={choiceItem}>{choiceItem}</option>;
                })}
              </select>
            </div> */}
            <Dropdown
              placeholder="Select"
              label=""
              selectedKeys={führungskraftselectedKeys}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={führungskraftChoiceonChange}
              multiSelect
              options={PAExectuiveChoice}
              styles={dropdownStyles}
            />
          </div>
        </div>
        <div className="filterItem">
          <div className="labelSection">
            <label>{strings.JJInternalExternalLabel}</label>
          </div>
          <div>
            {/* <div className="select">
              <select
                value={
                  filterItems.jjInternExtern == ""
                    ? "0"
                    : filterItems.jjInternExtern
                }
                className="select__field"
                onChange={(e) => {
                  console.log(e.target.value);
                  objFilterItems.jjInternExtern =
                    e.target.value == "0" ? "" : e.target.value;
                  setRerenderFilters(true);
                }}
              >
                <option value="0" selected>
                  Choose option ...
                </option>
                {paIntExt.map((choice) => {
                  return <option value={choice}>{choice}</option>;
                })}
              </select>
            </div> */}
            <Dropdown
              placeholder="Select"
              label=""
              selectedKeys={jjInternExternselectedKeys}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={jjIntExtChoiceonChange}
              multiSelect
              options={paIntExt}
              styles={dropdownStyles}
            />
          </div>
        </div>
        <div className="filterItem">
          <div className="labelSection">
            <label>{strings.IVStatusLabel}</label>
          </div>
          <div>
            {/* <div className="select">
              <select
                value={filterItems.ivStatus == "" ? "0" : filterItems.ivStatus}
                className="select__field"
                onChange={(e) => {
                  console.log(e.target.value);
                  objFilterItems.ivStatus =
                    e.target.value == "0" ? "" : e.target.value;
                  setRerenderFilters(true);
                }}
              >
                <option value="" selected>
                  Choose option ...
                </option>
                {status.map((statusChoice) => {
                  return <option value={statusChoice}>{statusChoice}</option>;
                })}
              </select>
            </div> */}
            <Dropdown
              placeholder="Select"
              label=""
              selectedKeys={ivStatusSelectedKeys}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={ivStatusChoiceonChange}
              multiSelect
              options={status}
              styles={dropdownStyles}
            />
          </div>
        </div>
        <div className="filterItem">
          <div className="labelSection">
            <label>{strings.IVAwardDateLabel}</label>
          </div>
          <DatePicker
            placeholder="DD.MM.YYYY"
            value={
              filterItems.datumderi ? new Date(filterItems.datumderi) : null
            }
            onSelectDate={(selectedDate) => {
              selectedDate
                ? (objFilterItems.datumderi = selectedDate)
                : (objFilterItems.datumderi = "");
              setRerenderFilters(true);
            }}
            formatDate={onFormatDate}
          />
          {/* <div>
            <input
              type="date"
              id="datePicker"
              data-date-format="DD.MM.YYYY"
              onChange={(e) => {
                console.log(e);
                e.target["value"] == ""
                  ? (objFilterItems.datumderi = "")
                  : (objFilterItems.datumderi = new Date(
                    e.target["value"]
                  ).toLocaleDateString());
                setRerenderFilters(true);
              }}
            />
          </div> */}
        </div>
        <div
          className="resetSec"
          style={{ marginTop: "2rem", textAlign: "right" }}
        >
          <a
            href="#"
            onClick={() => {
              objFilterItems = {
                name: "",
                wwid: "",
                abteilung: [],
                jobtitel: [],
                führungskraft: [],
                jjInternExtern: [],
                ivStatus: [],
                datumderi: null,
              };
              // document.querySelector('#datePicker')['valueAsDate'] = null;
              setPPSelectedUser([]);
              setRerenderFilters(true);
              setabteilungSelectedKeys([]);
              setJobTitleselectedKeys([]);
              setFührungskraftSelectedKeys([]);
              setJjInternExternSelectedKeys([]);
              setIvStatusSelectedKeys([]);
            }}
          >
            Reset Filters
          </a>
        </div>
      </div>
    </div>
  );
};
export default LeftFilter;
