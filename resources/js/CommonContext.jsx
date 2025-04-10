import { createContext, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import Cookies from "js-cookie";
import menu from "./SidebarMenuItems";
import { useNavigate } from "react-router-dom";
import { getApiRequest, handleSessionExpiration } from "./CommonFunctions";

export const CustomContext = createContext({});

export default function ContextProvider({ children }) {
    const url = window.Laravel.gtrsUrl;
    const navigate = useNavigate();
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

    function getServices() {
        const headers = {
            UserId: currentUser?.UserId,
            Authorization: `Bearer ${Token}`,
        };
        getApiRequest(`${url}Services`, headers).then((res) => {
            setServices(res?.sort());
        });
        navigate("/gtis/services");
    }
    function getCompanies() {
        const headers = {
            UserId: currentUser?.UserId,
            Authorization: `Bearer ${Token}`,
        };
        getApiRequest(`${url}Companies`, headers).then((res) => {
            setCompanies(
                res.sort((a, b) => a.CompanyName.localeCompare(b.CompanyName))
            );
        });
        navigate("/gtis/companies");
    }
    function getCategories() {
        const headers = {
            UserId: currentUser?.UserId,
            Authorization: `Bearer ${Token}`,
        };
        getApiRequest(`${url}Categories`, headers).then((res) => {
            setCategories(
                res.sort((a, b) => a.CategoryName.localeCompare(b.CategoryName))
            );
        });
        navigate("/gtis/categories");
    }
    function getSuppliers() {
        const headers = {
            UserId: currentUser?.UserId,
            Authorization: `Bearer ${Token}`,
        };
        getApiRequest(`${url}Suppliers`, headers).then((res) => {
            const sortedData = res.sort((a, b) => {
                const supplierNameA = a.SupplierName.trim().toLowerCase();
                const supplierNameB = b.SupplierName.trim().toLowerCase();

                const numericPartA = supplierNameA.match(/^\d+/);
                const numericPartB = supplierNameB.match(/^\d+/);

                if (numericPartA && numericPartB) {
                    const numericCompare =
                        parseInt(numericPartA[0], 10) -
                        parseInt(numericPartB[0], 10);
                    if (numericCompare !== 0) return numericCompare;
                }

                return supplierNameA.localeCompare(supplierNameB);
            });
            setSupplierData(sortedData);
        });
        navigate("/gtis/suppliers");
    }
    function getRejectReasons() {
        const headers = {
            UserId: currentUser?.UserId,
            Authorization: `Bearer ${Token}`,
        };
        getApiRequest(`${url}RejectedReasons`, headers).then((res) => {
            setRejectedReasons(
                res?.sort((a, b) => a.ReasonName.localeCompare(b.ReasonName))
            );
        });
        navigate("/gtis/reject-reasons");
    }
    function getCloseReasons() {
        const headers = {
            UserId: currentUser?.UserId,
            Authorization: `Bearer ${Token}`,
        };
        getApiRequest(`${url}PoCloseReasons`, headers).then((res) => {
            setCloseReasons(
                res?.sort((a, b) => a.ReasonName.localeCompare(b.ReasonName))
            );
        });
        navigate("/gtis/close-reasons");
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
