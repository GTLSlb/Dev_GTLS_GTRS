import React, { createContext, useState } from "react";
import Cookies from "js-cookie";
import menu from "./SidebarMenuItems";
import PropTypes from "prop-types";

export const CustomContext = createContext({});

export default function ContextProvider({ children }) {
    const url = window.Laravel.gtrsUrl;
    const [user, setUser] = useState(null);
    const [canAccess, setCanAccess] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const [sidebarElements, setSidebarElements] = useState(menu);
    const [Token, setToken] = useState(Cookies.get("access_token"));
    const [allowedApplications, setAllowedApplications] = useState([]);

    const [states, setStates] = useState([]);
    const [debtorsData, setdebtorsData] = useState([]);
    const [transportData, setTransportData] = useState([]);
    const [kpireasonsData, setkpireasonsData] = useState([]);
    const [customerAccounts, setCustomerAccounts] = useState([]);

    const [consApi, setConsApi] = useState(false);
    const [chartsApi, setchartsApi] = useState(false);
    const [reportApi, setReportApi] = useState(false);
    const [DebtorsApi, setDebtorsApi] = useState(false);
    const [transportApi, setTransportApi] = useState(false);
    const [KPIReasonsApi, setKPIReasonsApi] = useState(false);

    return (
        <CustomContext.Provider
            value={{
                url,
                user,
                setUser,
                Token,
                setToken,
                states,
                setStates,
                canAccess,
                setCanAccess,
                currentUser,
                setCurrentUser,
                debtorsData,
                setdebtorsData,
                DebtorsApi,
                setDebtorsApi,
                sidebarElements,
                setSidebarElements,
                allowedApplications,
                setAllowedApplications,
                chartsApi,
                setchartsApi,
                consApi,
                setConsApi,
                reportApi,
                setReportApi,
                transportApi,
                setTransportApi,
                KPIReasonsApi,
                setKPIReasonsApi,
                customerAccounts, setCustomerAccounts,
                transportData, setTransportData,
                kpireasonsData, setkpireasonsData,
            }}
        >
            {children}
        </CustomContext.Provider>
    );
}

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};