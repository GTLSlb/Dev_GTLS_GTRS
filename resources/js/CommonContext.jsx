import React, { createContext, useState } from "react";
import menu from "./SidebarMenuItems";
import PropTypes from "prop-types";
import { useApiRequests } from "./CommonFunctions";

export const CustomContext = createContext({});

export default function ContextProvider({ children }) {
    const url = window.Laravel.gtrsUrl;
    const [user, setUser] = useState(null);
    const [canAccess, setCanAccess] = useState(true);
    const [userPermissions, setUserPermissions] = useState(null);

    const [sidebarElements, setSidebarElements] = useState(menu);
    const [Token, setToken] = useState(null);
    const [allowedApplications, setAllowedApplications] = useState([]);

    const [states, setStates] = useState([]);
    const [debtorsData, setdebtorsData] = useState([]);
    const [transportData, setTransportData] = useState([]);
    const [kpireasonsData, setkpireasonsData] = useState([]);
    const [RDDReasonsData, setRDDReasonsData] = useState([]);
    const [customerAccounts, setCustomerAccounts] = useState([]);
    const [failedReasonsData, setFailedReasonsData] = useState([]);

    const [consApi, setConsApi] = useState(false);
    const [chartsApi, setchartsApi] = useState(false);
    const [reportApi, setReportApi] = useState(false);
    const [DebtorsApi, setDebtorsApi] = useState(false);
    const [transportApi, setTransportApi] = useState(false);
    const [KPIReasonsApi, setKPIReasonsApi] = useState(false);
    const [RDDReasonsApi, setRDDReasonsApi] = useState(false);
    const [failedReasonsApi, setFailedReasonsApi] = useState(false);

    const { getApiRequest } = useApiRequests();

    function getFailedReasons() {
        const headers = {
            UserId: user.UserId,
        };
        getApiRequest(`${url}/FailureReasons`, headers, Token)
            .then((res) => {
                setFailedReasonsData(res);
            })
            .catch((err) =>
                console.error("Error fetching close reasons:", err)
            );
    }

    function getRDDReasons() {
        const headers = {
            UserId: user.UserId,
        };
        getApiRequest(`${url}/RddChangeReason`, headers, Token)
            .then((res) => {
                setRDDReasonsData(res);
            })
            .catch((err) => console.error("Error fetching RDD reasons:", err));
    }

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
                userPermissions,
                setUserPermissions,
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
                customerAccounts,
                setCustomerAccounts,
                transportData,
                setTransportData,
                kpireasonsData,
                setkpireasonsData,
                failedReasonsApi,
                setFailedReasonsApi,
                failedReasonsData,
                setFailedReasonsData,
                getFailedReasons,
                RDDReasonsData,
                setRDDReasonsData,
                RDDReasonsApi,
                setRDDReasonsApi,
                getRDDReasons,
            }}
        >
            {children}
        </CustomContext.Provider>
    );
}

ContextProvider.propTypes = {
    children: PropTypes.node,
};
