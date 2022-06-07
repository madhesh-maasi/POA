import * as React from "react";
import styles from "./PoADashboard.module.scss";
import LeftFilter from "./LeftFilter";
import Dashboard from "./Dashboard";
import { useState, useEffect } from "react";

const App = (props) => {
  let objFilterItems = {};
  const [filterItems, setFilterItems] = useState({});
  const [choiceUpdate, setChoiceUpdate] = useState({ update: true });
  const leftFilterHandler = (item) => {
    setFilterItems({ ...item });
    objFilterItems = filterItems;
  };

  const choicesUpdateHandler = () => {
    setChoiceUpdate({ ...{ update: true } });
  };
  return (
    <div className={styles.mainSection}>
      <LeftFilter
        className={styles.leftFilter}
        spcontext={props.spcontext}
        context={props.context}
        getFilter={leftFilterHandler}
        choiceUpdate={choiceUpdate}
      />
      <Dashboard
        className={styles.dashboard}
        spcontext={props.spcontext}
        context={props.context}
        filterItems={filterItems}
        choiceUpdate={choicesUpdateHandler}
        tableDesText={props.tableDesText}
        groupID={props.groupID}
      />
    </div>
  );
};
export default App;
