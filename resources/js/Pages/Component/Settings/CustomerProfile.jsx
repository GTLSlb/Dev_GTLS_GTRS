import React, { useContext, useEffect, useState } from "react";
import { Tab, Tabs } from "@heroui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApiRequests } from "@/CommonFunctions";
import GtrsButton from "../GtrsButton";
import AnimatedLoading from "@/Components/AnimatedLoading";
import { ToastContainer } from "react-toastify";
import Accounts from "./Accounts";
import Users from "./Users";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";
import { CustomContext } from "@/CommonContext";

export default function CustomerProfile({ userPermission }) {
    const { user } = useContext(CustomContext);
    const { getApiRequest } = useApiRequests();
    const [customer, setCustomer] = useState([]);
    const [loading, setLoading] = useState(true);
    const gtamUrl = window.Laravel.gtamUrl;
    const navigate = useNavigate();
    const location = useLocation();

    const customerId = location?.state?.CustomerId;
    async function fetchData() {
        const data = await getApiRequest(`${gtamUrl}CustomerById`, {
            UserId: user?.UserId,
            Customer_Id: customerId ? customerId : user?.OwnerId,
        });

        if (data) {
            setLoading(false);
            setCustomer(data);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    const [selectedTab, setSelectedTab] = useState("accounts");

    return (
        <>
            <div className="container mx-auto flex flex-col gap-4 p-5">
                {user?.TypeId !== 1 && (
                    <GtrsButton
                        name="Back"
                        className={"py-4"}
                        icon={<ChevronLeftIcon className="mr-2 h-4 w-4" />}
                        onClick={() => {
                            navigate("/gtrs/customer-settings");
                        }}
                    />
                )}
                <h1 className="text-4xl font-bold">{customer.CustomerName}</h1>

                <div className="flex flex-wrap gap-4">
                    <Tabs
                        aria-label="Tabs variants"
                        selectedKey={selectedTab}
                        onSelectionChange={setSelectedTab}
                        classNames={{
                            tabList: "bg-white",
                        }}
                    >
                        <Tab key="accounts" title="Accounts" />
                        <Tab key="users" title="Users" />
                    </Tabs>
                </div>

                <div className="">
                    {loading ? (
                        <AnimatedLoading />
                    ) : selectedTab === "accounts" ? (
                        <Accounts
                            customer={customer}
                            userPermission={userPermission}
                        />
                    ) : (
                        <Users
                            customer={customer}
                            userPermission={userPermission}
                        />
                    )}
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

CustomerProfile.propTypes = {
    currentUser: PropTypes.object,
    userPermission: PropTypes.object,
};
