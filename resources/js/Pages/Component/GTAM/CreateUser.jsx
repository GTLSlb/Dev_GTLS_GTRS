import Steps from "@/Components/GTAM/Steps";
import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import SelectAccount from "./components/CreateUser/SelectAccount";
import SelectUsertype from "./components/CreateUser/SelectUsertype";
import { useEffect } from "react";
import CompleteProfile from "./components/CreateUser/CompleteProfile";
import GroupPolicy from "./components/CreateUser/GroupPolicy";
import ConfirmInfo from "./components/CreateUser/ConfirmInfo";

const notificationMethods = [
    { id: "Customer", title: "Customer" },
    { id: "Employee", title: "Employee" },
    { id: "Driver", title: "Driver" },
];
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
export default function CreateUser({
    url,
    setActiveIndex,
    groups,
    employees,
    branches,
    roles,
    currentUser,
    departments,
    GetEmployees,
    employeesAD,
    getEmployeesAD,
    userTypeFromPage,
}) {
    const [checkStep1, setCheckStep1] = useState(false);
    const [userAccount, setUserAccount] = useState(null);
    const [userProfile, setUserProfile] = useState({});
    const [uniqueId, setUniqueId] = useState(null);

    useEffect(() => {
        setUserProfile({
            UserId: userAccount && userAccount.id ? userAccount.id : null,
            UniqueId: uniqueId,
            TypeId:
                userAccount && userAccount.TypeId ? userAccount.TypeId : null,
            GroupId:
                userAccount && userAccount.GroupId ? userAccount.GroupId : null,
            Username:
                userAccount && userAccount.displayName
                    ? userAccount.displayName
                    : null,
            StatusId:
                userAccount && userAccount.StatusId
                    ? userAccount.StatusId
                    : null,
            FirstName:
                userAccount && userAccount.givenName
                    ? userAccount.givenName
                    : null,
            LastName:
                userAccount && userAccount.surname ? userAccount.surname : null,
            Email: userAccount && userAccount.Email ? userAccount.Email : null,
            PhoneNumber:
                userAccount && userAccount.mobilePhone
                    ? userAccount.mobilePhone
                    : null,
            Dob: userAccount && userAccount.Dob ? userAccount.Dob : null,
            Address:
                userAccount && userAccount.Address ? userAccount.Address : null,
            Picture:
                userAccount && userAccount.Picture ? userAccount.Picture : null,
            NationalityId:
                userAccount && userAccount.NationalityId
                    ? userAccount.NationalityId
                    : null,
            BranchId:
                userAccount && userAccount.BranchId
                    ? userAccount.BranchId
                    : null,
            RoleId:
                userAccount && userAccount.RoleId ? userAccount.RoleId : null,
            ReportToId:
                userAccount && userAccount.ReportToId
                    ? employees.find(
                          (emp) => emp.EmployeeId === userAccount.ReportToId
                      ) ?? null
                    : null,
            HiringDate:
                userAccount && userAccount.HiringDate
                    ? userAccount.HiringDate
                    : null,
        });
    }, [userAccount]);
    const [depId, setDepID] = useState(null);
    const [userGroupPolicy, setUserGroupPolicy] = useState(null);
    const [step, setStep] = useState(userTypeFromPage !== 2 ? 2 : 1);
    const [width, setWidth] = useState(5);
    useEffect(() => {
        if (userTypeFromPage == 2) {
            if (step == 1) {
                setWidth(0);
            } else if (step == 2) {
                setWidth(38);
            } else if (step == 3) {
                setWidth(63);
            } else if (step == 4) {
                setWidth(100);
            }
        }else{
            if (step == 2) {
                setWidth(3);
            } else if (step == 3) {
                setWidth(50);
            } else if (step == 4) {
                setWidth(100);
            }
        }
    }, [step]);

    useEffect(() => {
        if (branches && departments) {
            setDepID(
                userAccount
                    ? userAccount.BranchId
                        ? departments?.find((dep) =>
                              branches?.find(
                                  (branch) => branch.BranchId === dep.BranchId
                              )
                          ) ?? null
                        : null
                    : null
            );
        }
    }, [branches, departments]);

    const nextStep = () => {
        setStep(step + 1);
        setCheckStep1(false);
    };

    const previousStep = () => {
        setCheckStep1(true);
        // if (step === 3 && userType.name != "Employee") {
        //     setStep(step - 2);
        // } else {
        setStep(step - 1);
        // }
    };

    const handleSubmit = () => {
        userProfile.NationalityId == 1;
        userProfile.TypeId = userTypeFromPage;
        userProfile.GroupId = parseInt(userGroupPolicy);
        let pp = userProfile.Picture;
        let PicName = userProfile.Picture.name;
        userProfile.Picture = PicName;
        userProfile.UserId = null;
        userProfile.NationalityId = 1;
        userProfile.UniqueId = uniqueId;
        console.log(userProfile)
        try {
            axios
                .post(`${url}api/GTAM/Add/Employee`, userProfile, {
                    headers: {
                        UserId: currentUser.user_id,
                    },
                })
                .then((res) => {
                    console.log(res);
                    const fileData = new FormData();
                    fileData.append("file", pp);
                    if (fileData !== null) {
                        axios
                            .post("/upload", fileData, {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            })
                            .then((response) => {
                                console.log(response);
                                GetEmployees();
                                getEmployeesAD();
                                setActiveIndex(1);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    } else {
                        console.log("Encountered an Error");
                    }
                })
                .catch((err) => {
                    console.log("Encountered an Error", err.response);
                });
        } catch (err) {
            console.log("Encountered an Error ", err);
        }
    };
    const handleCancel = () => {
        if (userTypeFromPage == 2) {
            setActiveIndex(1);
        } else if (userTypeFromPage == 1) {
            setActiveIndex(13);
        } else {
            setActiveIndex(14);
        }
    };
    const renderStep = () => {
        switch (step) {
            // case 1:
            //     return (
            //         <CSSTransition
            //             key={1}
            //             classNames="slide"
            //             timeout={300}
            //             exit={false}
            //         >
            //             <div>
            //                 <SelectUsertype
            //                     setCheckStep1={setCheckStep1}
            //                     userType={userTypeFromPage}
            //                 />
            //                 <div className="flex justify-between">
            //                     <button
            //                         className={classNames(
            //                             "  text-white px-5 py-1 rounded bg-dark hover:opacity-60"
            //                         )}
            //                         onClick={() => setActiveIndex(1)}
            //                     >
            //                         Cancel
            //                     </button>
            //                     <button
            //                         className={classNames(
            //                             checkStep1
            //                                 ? "bg-dark hover:opacity-60"
            //                                 : "bg-gray-400",
            //                             "  text-white px-5 py-1 rounded"
            //                         )}
            //                         onClick={nextStep}
            //                         disabled={!checkStep1}
            //                     >
            //                         Next
            //                     </button>
            //                 </div>
            //             </div>
            //         </CSSTransition>
            //     );
            case 1:
                return (
                    <CSSTransition
                        key={1}
                        classNames="slide"
                        timeout={300}
                        exit={false}
                    >
                        <div>
                            <SelectAccount
                                setUniqueId={setUniqueId}
                                setCheckStep1={setCheckStep1}
                                setUserAccount={setUserAccount}
                                userAccount={userAccount}
                                employees={employeesAD}
                            />
                            <div className="flex justify-between">
                                <button
                                    className={classNames(
                                        "  text-white px-5 py-1 rounded bg-dark hover:opacity-60"
                                    )}
                                    onClick={() => handleCancel()}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={classNames(
                                        checkStep1
                                            ? "bg-dark hover:opacity-60"
                                            : "bg-gray-400",
                                        "  text-white px-5 py-1 rounded"
                                    )}
                                    onClick={nextStep}
                                    disabled={!checkStep1}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </CSSTransition>
                );
            case 2:
                return (
                    <CSSTransition
                        key={2}
                        classNames="slide"
                        timeout={300}
                        exit={false}
                    >
                        <div className="relative my-5">
                            <CompleteProfile
                                depId={depId}
                                employees={employees}
                                userType={userTypeFromPage}
                                userProfile={userProfile}
                                setUserProfile={setUserProfile}
                                branches={branches}
                                roles={roles}
                                departments={departments}
                                userAccount={userAccount}
                                setCheckStep1={setCheckStep1}
                            />
                            <div className={`flex justify-between relative `}>
                                {userTypeFromPage !== 2 ? (
                                    <button
                                        className="bg-dark text-white px-5 py-1 rounded hover:opacity-60"
                                        onClick={() => handleCancel()}
                                    >
                                        Cancel
                                    </button>
                                ) : (
                                    <button
                                        className="bg-dark text-white px-5 py-1 rounded hover:opacity-60"
                                        onClick={previousStep}
                                    >
                                        Previous
                                    </button>
                                )}
                                <button
                                    className={classNames(
                                        checkStep1
                                            ? "bg-dark hover:opacity-60"
                                            : "bg-gray-400",
                                        "  text-white px-5 py-1 rounded"
                                    )}
                                    onClick={nextStep}
                                    disabled={!checkStep1}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </CSSTransition>
                );
            case 3:
                return (
                    <CSSTransition
                        key={3}
                        classNames="slide"
                        timeout={300}
                        exit={false}
                    >
                        <div>
                            <GroupPolicy
                                groupPolicy={groups}
                                policy={userGroupPolicy}
                                setPolicy={setUserGroupPolicy}
                                setCheckStep1={setCheckStep1}
                            />
                            <div className="flex justify-between">
                                <button
                                    className=" bg-dark text-white px-5 py-1 rounded hover:opacity-60"
                                    onClick={previousStep}
                                >
                                    Previous
                                </button>
                                <button
                                    className={classNames(
                                        checkStep1
                                            ? "bg-dark hover:opacity-60"
                                            : "bg-gray-400",
                                        "  text-white px-5 py-1 rounded "
                                    )}
                                    onClick={nextStep}
                                    disabled={!checkStep1}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </CSSTransition>
                );
            case 4:
                return (
                    <CSSTransition
                        key={4}
                        classNames="slide"
                        timeout={300}
                        exit={false}
                    >
                        <div>
                            <ConfirmInfo
                                setCheckStep1={setCheckStep1}
                                userType={userTypeFromPage}
                                employees={employees}
                                branches={branches}
                                roles={roles}
                                groups={groups}
                                departments={departments}
                                userProfile={userProfile}
                                userAccount={userAccount}
                                userGroupPolicy={userGroupPolicy}
                            />
                            <div className="flex justify-between">
                                <button
                                    className={classNames(
                                        "  text-white px-5 py-1 rounded bg-dark hover:opacity-60"
                                    )}
                                    onClick={previousStep}
                                >
                                    Previous
                                </button>
                                <button
                                    className={classNames(
                                        "bg-dark text-white px-5 py-1 rounded hover:opacity-60"
                                    )}
                                    onClick={() => handleSubmit()}
                                    disabled={false}
                                >
                                    Confirm User
                                </button>
                            </div>
                        </div>
                    </CSSTransition>
                );
            default:
                return null;
        }
    };

    return (
        <div className="px-6 lg:px-8 p-10">
            <div className=" max-h-[45rem] overflow-y-scroll border-2 border-white rounded-xl max-w-full mx-auto  bg-white shadow-xl">
                <div className="mx-5 my-5">
                    <div className=" rounded-lg p-6 max-w-full mx-auto overflow-x-hidden">
                        {userTypeFromPage == 1 ? (
                            <p className="font-bold text-lg my-4">
                                Create New Customer
                            </p>
                        ) : userTypeFromPage == 2 ? (
                            <p className="font-bold text-lg my-4">
                                Create New Employee
                            </p>
                        ) : (
                            <p className="font-bold text-lg my-4">
                                Create New Driver
                            </p>
                        )}
                        <div className="my-4">
                            <div
                                className="mt-6 hidden md:block"
                                aria-hidden="true"
                            >
                                <div className="overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-3 rounded-full bg-gray-400"
                                        style={{
                                            width: `${width}%`,
                                            transition:
                                                "width 0.5s ease-in-out", // Add a transition for the width property
                                        }}
                                    />
                                </div>
                                <div
                                    className={`mt-6 hidden ${
                                        userTypeFromPage == 2
                                            ? "grid-cols-4"
                                            : "grid-cols-3"
                                    } text-sm font-medium text-gray-600 sm:grid`}
                                >
                                    {/* <div className="text-black font-bold">
                                        Select User Type
                                    </div> */}
                                    {userTypeFromPage == 2 ? (
                                        <div className="text-black font-bold">
                                            Select Account
                                        </div>
                                    ) : null}
                                    <div
                                        className={`${
                                            userTypeFromPage == 2
                                                ? width >= 38
                                                    ? "text-black text-center font-bold"
                                                    : "text-gray-400 text-center "
                                                : "text-black font-bold text-left" 
                                        }`}
                                    >
                                        Complete Profile
                                    </div>
                                    <div
                                        className={`text-center ${
                                            userTypeFromPage == 2
                                                ? width >= 80
                                                    ? "text-black font-bold"
                                                    : "text-gray-400"
                                                : width >= 66
                                                ? "text-black font-bold"
                                                : "text-gray-400"
                                        } text-center `}
                                    >
                                        Assign To Group Policy
                                    </div>
                                    <div
                                        className={`text-center ${
                                            width >= 100
                                                ? "text-black font-bold"
                                                : "text-gray-400"
                                        } text-right `}
                                    >
                                        Confirm Your Information
                                    </div>
                                </div>
                            </div>
                        </div>

                        <TransitionGroup>{renderStep()}</TransitionGroup>
                    </div>
                </div>
            </div>
        </div>
    );
}
