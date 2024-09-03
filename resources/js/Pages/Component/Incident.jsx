import {
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Progress,
    Spinner,
    Tab,
    Tabs,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import IncidentDetails from "./IncidentDetails";
// import IncidentDocument from "./IncidentDocument";
// import { PDFDownloadLink } from "@react-pdf/renderer";
import { PrinterIcon } from "@heroicons/react/24/solid";
// import Loading from "../Loading";
// import {
//     canCloseIncident,
//     canDownloadIncident,
//     canDownloadNotes,
//     canViewNotes,
// } from "@/permissions";
import swal from "sweetalert";
import Notes from "./Notes";
// import NotesDocument from "./NotesDocument";

export default function Incident({
    gtccrUrl,
    incidentId,
    currentUser,
    AToken,
}) {
    const [selected, setSelected] = useState("details");
    const [pdfLoading, setPdfLoading] = useState(false);
    const [filters, setFilters] = useState();
    const [mainCauses, setMainCauses] = useState();
    const [incident, setIncident] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getFilters();
        getMainCauses();
    }, []);

    console.log(currentUser);
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
                    }).then(function () {
                        axios
                            .post("/logoutAPI")
                            .then((response) => {
                                if (response.status == 200) {
                                    window.location.href = "/";
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                            });
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
                    }).then(function () {
                        axios
                            .post("/logoutAPI")
                            .then((response) => {
                                if (response.status == 200) {
                                    window.location.href = "/";
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                            });
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
                    Incident_Id: incidentId,
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

    // const content = (
    //     <PopoverContent>
    //         <div className="px-1 py-2 grid grid-cols-1 gap-2">
    //             <PDFDownloadLink
    //                 document={
    //                     <IncidentDocument
    //                         incident={incident}
    //                         filters={filters}
    //                         mainCauses={mainCauses}
    //                         type={1}
    //                     />
    //                 }
    //                 fileName="incident-report.pdf"
    //             >
    //                 {({ blob, url, loading, error }) => {
    //                     // if (pdfLoading !== loading) {
    //                     //     if (loading === false) {
    //                     //         setPdfLoading(loading);
    //                     //     }
    //                     // }
    //                     return (
    //                         <Button
    //                             size="sm"
    //                             className="bg-gray-800 text-white"
    //                             endContent={<PrinterIcon className="w-5 h-5" />}
    //                         >
    //                             Internal
    //                         </Button>
    //                     );
    //                 }}
    //             </PDFDownloadLink>
    //             <PDFDownloadLink
    //                 document={
    //                     <IncidentDocument
    //                         incident={incident}
    //                         filters={filters}
    //                         mainCauses={mainCauses}
    //                         type={2}
    //                     />
    //                 }
    //                 fileName="incident-report.pdf"
    //             >
    //                 {({ blob, url, loading, error }) => {
    //                     return (
    //                         <Button
    //                             size="sm"
    //                             className="bg-gray-800 text-white"
    //                             endContent={<PrinterIcon className="w-5 h-5" />}
    //                         >
    //                             External
    //                         </Button>
    //                     );
    //                 }}
    //             </PDFDownloadLink>
    //         </div>
    //     </PopoverContent>
    // );

    // function CloseIncident(e) {
    //     setIsLoading(true);
    //     axios
    //         .get(`${GtirUrl}CloseIncident`, {
    //             headers: {
    //                 // UserId: 1,
    //                 UserId: currentUser?.UserId,
    //                 Authorization: `Bearer ${AToken}`,
    //                 Incident_Id: incident.IncidentId,
    //                 Status_Id: e,
    //             },
    //         })
    //         .then((res) => {
    //             setIncident(null);
    //             getIncident();
    //             AlertToast("Saved successfully", 1);
    //             setIsLoading(false);
    //         })
    //         .catch((err) => {
    //             if (err.response && err.response.status === 401) {
    //                 // Handle 401 error
    //                 if (err.response && err.response.status === 401) {
    //                     // Handle 401 error using SweetAlert
    //                     swal({
    //                         title: "Session Expired!",
    //                         text: "Please login again",
    //                         type: "success",
    //                         icon: "info",
    //                         confirmButtonText: "OK",
    //                     }).then(function () {
    //                         axios
    //                             .post("/logoutAPI")
    //                             .then((response) => {
    //                                 if (response.status == 200) {
    //                                     window.location.href = "/";
    //                                 }
    //                             })
    //                             .catch((error) => {
    //                                 console.log(error);
    //                             });
    //                     });
    //                 } else {
    //                     // Handle other errors
    //                     console.log(err);
    //                 }
    //             } else {
    //                 // Handle other errors
    //                 setIsLoading(false);
    //                 AlertToast("Something went wrong", 2);
    //                 // AlertToast("Error please try again.", 2);
    //                 console.log(err);
    //             }
    //         });
    // }
    console.log(incident);
    return (
        <div className="relative p-5">
            {/* {pdfLoading && canDownloadIncident(currentUser) && <Loading />} */}
            {/* <div className="flex flex-col sm:flex-row sm:absolute top-5 gap-2 flex right-7">
                {canCloseIncident(currentUser) &&
                    incident &&
                    incident.StatusId == 1 &&
                    selected == "details" && (
                        <div>
                            {isLoading ? (
                                <div className="px-3">
                                    <Spinner color="secondary" size="md" />
                                </div>
                            ) : (
                                <Button
                                    className="bg-gray-800 text-white w-full"
                                    onClick={() => CloseIncident(2)}
                                >
                                    {"Close"}
                                </Button>
                            )}
                        </div>
                    )}
                {canCloseIncident(currentUser) &&
                    incident &&
                    incident.StatusId == 2 && (
                        <div>
                            {isLoading ? (
                                <div className="px-3">
                                    <Spinner color="secondary" size="md" />
                                </div>
                            ) : (
                                <Button
                                    className="bg-gray-800 text-white"
                                    onClick={() => CloseIncident(1)}
                                >
                                    {"Open"}
                                </Button>
                            )}
                        </div>
                    )}
                {canDownloadIncident(currentUser) &&
                    incident &&
                    selected == "details" && (
                        <Popover
                            key={"bottom-end"}
                            placement={"bottom-end"}
                            color="secodary"
                        >
                            <PopoverTrigger>
                                <Button
                                    color=""
                                    variant="flat"
                                    endContent={
                                        <PrinterIcon className="w-5 h-5" />
                                    }
                                    className="bg-gray-800 text-white w-full"
                                >
                                    {"Incident"}
                                </Button>
                            </PopoverTrigger>
                            {content}
                        </Popover>
                    )}
                {canDownloadNotes(currentUser) &&
                    incident &&
                    incident.IncidentNotes?.length > 0 &&
                    selected == "notes" && (
                        <PDFDownloadLink
                            document={
                                <NotesDocument
                                    incident={incident}
                                    notes={incident.IncidentNotes}
                                    filters={filters}
                                    mainCauses={mainCauses}
                                    type={2}
                                />
                            }
                            fileName="incident-notes-report.pdf"
                        >
                            {({ blob, url, loading, error }) => {
                                return (
                                    <Button
                                        size="md"
                                        className="bg-gray-800 text-white w-full"
                                        endContent={
                                            <PrinterIcon className="w-5 h-5" />
                                        }
                                    >
                                        Notes
                                    </Button>
                                );
                            }}
                        </PDFDownloadLink>
                    )}
            </div> */}

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
                                />
                            </Tab>
                            <Tab key="notes" title="Notes">
                                <Notes
                                    incident={incident}
                                    AToken={AToken}
                                    getIncident={getIncident}
                                    filters={filters}
                                    currentUser={currentUser}
                                />
                            </Tab>
                        </Tabs>
                    ) : (
                        <div className="">
                            <IncidentDetails
                                mainCauses={mainCauses}
                                filters={filters}
                                incident={incident}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <Progress
                    size="md"
                    isIndeterminate
                    aria-label="Loading..."
                    className="mt-10 w-10/12 "
                />
            )}
        </div>
    );
}
