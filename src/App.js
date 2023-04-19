import React, { useState } from "react";
import Main from "./Main";
import "./App.css";



export default function App() {
  
  const [tabs, setTabs] = useState([{ id: 1 }]);
  const [activeTab, setActiveTab] = useState(0);
  
  //Add tabs
  const addTab = () => {
    const newTab = { id: tabs.length + 1 };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };
 
  //Close tab 
  const closeTab = (tabId) => {
    const newupdateTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newupdateTabs);
    if (activeTab === tabId) {
      setActiveTab(newupdateTabs.length > 0 ? newupdateTabs[0].id : null);
    }
  };
  return (
    <div>
      <ul>
        {tabs.map((tab) => (
          <li key={tab.id}>
            <i onClick={() => setActiveTab(tab.id)} style={{cursor:'pointer'}}>
              {activeTab === 0 && "Create a New Tab"}
              {activeTab !== 0 && `Tab ${tab.id}   `}
              {tab.id !== 1 && (
                <button onClick={() => closeTab(tab.id)}
                style={{backgroundColor:'lightred'}}
                >X</button>
              )}
            </i>
          </li>
        ))}
        <li>
          <button onClick={addTab} style={{backgroundColor:'grey' , cursor:'pointer'}}>New TAB</button>
        </li>
      </ul>
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={index + 1 === activeTab ? "tab-active" : "tab"}
        >
          <p>Tab {index + 1}</p>
          <Main />
        </div>
      ))}
    </div>
  );

}
