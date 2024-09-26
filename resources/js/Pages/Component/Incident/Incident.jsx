import {
    Progress,
    Tab,
    Tabs,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import IncidentDetails from "./IncidentDetails";
import swal from "sweetalert";
import Notes from "../Notes";
import { handleSessionExpiration } from '@/CommonFunctions';
import { useLocation } from "react-router-dom";

export default function Incident({
    gtccrUrl,
    currentUser,
    AToken,
    userPermission,
}) {
    const location = useLocation();
    const [selected, setSelected] = useState("details");
    const [filters, setFilters] = useState();
    const [mainCauses, setMainCauses] = useState();
    const [incident, setIncident] = useState();

    useEffect(() => {
        getFilters();
        getMainCauses();
    }, []);

    function getFilters() {
        axios
            .get(`${gtccrUrl}IncidentAssets`, {
                headers: {
                    UserId: currentUser?.UserId,
                    Authorization: `Bearer ${AToken}`,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    try {
                        const parsedData = JSON.parse(x);
                        resolve(parsedData || []); // Use an empty array if parsedData is null
                    } catch (error) {
                        reject(error);
                    }
                });
                parsedDataPromise.then((parsedData) => {
                    console.log('parsed',parsedData);

                    setFilters(parsedData);
                    // setIsLoadingapps(false);
                });
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    // Handle 401 error using SweetAlert
                    swal({
                        title: "Session Expired!",
                        text: "Please login again",
                        type: "success",
                        icon: "info",
                        confirmButtonText: "OK",
                    }).then(async function () {
                        await handleSessionExpiration();
                    });
                } else {
                    // Handle other errors
                    console.log(err);
                }
            });
    }

    function getMainCauses() {
        axios
            .get(`${gtccrUrl}IncidentCauses`, {
                headers: {
                    UserId: currentUser?.UserId,
                    // UserId: 1,
                    Authorization: `Bearer ${AToken}`,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    try {
                        const parsedData = JSON.parse(x);
                        resolve(parsedData || []); // Use an empty array if parsedData is null
                    } catch (error) {
                        reject(error);
                    }
                });
                parsedDataPromise.then((parsedData) => {
                    setMainCauses(parsedData);
                    // setIsLoadingapps(false);
                });
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    // Handle 401 error using SweetAlert
                    swal({
                        title: "Session Expired!",
                        text: "Please login again",
                        type: "success",
                        icon: "info",
                        confirmButtonText: "OK",
                    }).then(async function () {
                        await handleSessionExpiration();
                    });
                } else {
                    // Handle other errors
                    console.log(err);
                }
            });
    }
    function getIncident() {
        axios
            .get(`${gtccrUrl}IncidentById`, {
                headers: {
                    // UserId: 1,
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${AToken}`,
                    Incident_Id: location?.state?.incidentId,
                },
            })
            .then((res) => {
                setIncident(res.data[0]);
            })
            .catch((err) => {
                console.log("Encountered an Error", err);
            });
    }

    useEffect(() => {
        getIncident();
    }, []);

    return (
        <div className="relative p-5">


            {incident && filters && mainCauses ? (
                <div>
                    {false ? (
                        <Tabs
                            aria-label="Options"
                            selectedKey={selected}
                            size="md"
                            onSelectionChange={setSelected}
                            variant="light"
                            color="third"
                            classNames={{
                                base: "bg-[#E8E8E8] rounded-xl",
                                tabList: "rounded-xl bg-[#E8E8E8]",
                                tab: "rounded-md",
                            }}
                        >
                            <Tab key="details" title="Details">
                                <IncidentDetails
                                    mainCauses={mainCauses}
                                    filters={filters}
                                    incident={incident}
                                    userPermission={userPermission}
                                />
                            </Tab>
                            <Tab key="notes" title="Notes">
                                <Notes
                                    incident={incident}
                                    AToken={AToken}
                                    getIncident={getIncident}
                                    filters={filters}
                                    currentUser={currentUser}
                                    userPermission={userPermission}
                                />
                            </Tab>
                        </Tabs>
                    ) : (
                        <div className="">
                            <IncidentDetails
                                currentUser={currentUser}
                                mainCauses={mainCauses}
                                filters={filters}
                                incident={incident}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-full flex items-center justify-center">
                    <Progress
                        size="md"
                        isIndeterminate
                        classNames={{
                            indicator: "bg-goldt",
                          }}
                        aria-label="Loading..."
                        className="mt-10 w-10/12 "
                    />
                </div>
            )}
        </div>
    );
}
