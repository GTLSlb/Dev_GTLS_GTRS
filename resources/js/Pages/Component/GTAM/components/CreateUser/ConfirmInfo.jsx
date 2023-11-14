import { useEffect, useState } from "react";

export default function ConfirmInfo({
    userType,
    userAccount,
    userGroupPolicy,
    userProfile,
    roles,
    groups,
    branches,
    employees,
    departments,
}) {
    const [group, setGroup] = useState();
    const [pp, setPP] = useState(userProfile.pp);
    const [dep, setDep] = useState();
    const [reportTo, setReportTo] = useState();
    
    useEffect(() => {
        setGroup(groups?.find((g) => userGroupPolicy == g.GroupId));
    }, [groups, userGroupPolicy]);

    useEffect(()=>{
        setDep(departments?.find((dep)=>dep.DepartmentId === userProfile.DepartmentId) ? departments?.find((dep)=>dep.DepartmentId === userProfile.DepartmentId):null)
    },[userProfile, departments])

    useEffect(()=>{
        setReportTo(employees?.find((emp) => emp?.EmployeeId == userProfile?.ReportToId))
    },[employees, userProfile])

    return (
        <div className="py-5 px-4 mb-5 w-full border-2 rounded-xl border-gray-100 max-h-full overflow-hidden">
            <div className="flex flex-col lg:flex-row">
                {userProfile.pp != "http://example.com/path/to/picture.jpg" && pp !== null && (
                    <div className="flex items-center justify-center">
                        { userProfile.Picture ?
                                <img
                                src={typeof userProfile.Picture === 'string' ? userProfile.Picture : URL.createObjectURL(userProfile.Picture)}
                                alt={userProfile?.Picture?.name}
                                className="w-36 h-36 border-1 rounded-full"
                            />:null}
                    </div>
                )}
                <div
                    className={`flex flex-col w-full ${
                        userProfile.Picture ? "ml-10 mt-2" : "ml-5"
                    } lg:w-1/2`}
                >
                    <div className="flex flex-col pb-3 lg:flex-row">
                        <h1
                            className="font-bold text-dark w-full lg:w-1/5"
                            htmlFor="FullName"
                        >
                            Name:
                        </h1>
                        <span className="w-full lg:w-1/5">
                            {userProfile.FirstName} {userProfile.LastName}
                        </span>
                    </div>

                    <div className="flex flex-col pb-3 lg:flex-row">
                        <label
                            htmlFor="FullName"
                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                        >
                            User Type:
                        </label>
                        <span
                            id="Fullname"
                            className="text-gray-900 ring-gray-300 mt-0.5 sm:text-sm w-full lg:w-1/2"
                        >
                            {userType == 2 ? 'Employee' : userType == 1 ? 'Customer' : 'Driver'}
                        </span>
                    </div>
                    <div className="flex flex-col pb-3 lg:flex-row">
                        <label
                            htmlFor="FullName"
                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                        >
                            Username:
                        </label>
                        <span
                            id="Fullname"
                            className="capitalize text-gray-900 ring-gray-300 mt-0.5 sm:text-sm w-full lg:w-1/5"
                        >
                            {userProfile.Username}
                        </span>
                    </div>
                    <div className="flex flex-col pb-3 lg:flex-row">
                        <label
                            htmlFor="FullName"
                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                        >
                            Phone Number:
                        </label>
                        <span
                            id="Fullname"
                            className="capitalize text-gray-900 ring-gray-300 mt-0.5 sm:text-sm w-full lg:w-1/5"
                        >
                            {userProfile.PhoneNumber}
                        </span>
                    </div>
                    <div className="flex flex-col pb-3 lg:flex-row">
                        <label
                            htmlFor="FullName"
                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                        >
                            Date of Birth:
                        </label>
                        <span
                            id="Fullname"
                            className="capitalize text-gray-900 ring-gray-300 mt-0.5 sm:text-sm w-full lg:w-1/5"
                        >
                            {userProfile.Dob}
                        </span>
                    </div>
                    <div className="flex flex-col pb-3 lg:flex-row">
                        <label
                            htmlFor="FullName"
                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                        >
                            Address:
                        </label>
                        <span
                            id="Fullname"
                            className="capitalize text-gray-900 ring-gray-300 mt-0.5 sm:text-sm w-full lg:w-2/5"
                        >
                            {userProfile.Address}
                        </span>
                    </div>
                    <div className="flex flex-col pb-3 lg:flex-row">
                        <label
                            htmlFor="FullName"
                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                        >
                            Depatment:
                        </label>
                        <span
                            id="Fullname"
                            className="capitalize text-gray-900 ring-gray-300 mt-0.5 sm:text-sm w-full lg:w-2/5"
                        >
                            {dep? dep.DepartmentName : ''}
                        </span>
                    </div>
                </div>
                <div
                    className={`flex flex-col w-full ${
                        userProfile.pp ? "ml-5 mt-2" : ""
                    } lg:w-1/2`}
                >
                    <div className="flex flex-col pb-3 lg:flex-row">
                        <label
                            htmlFor="FullName"
                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                        >
                            Role:
                        </label>
                        <span
                            id="Fullname"
                            className="text-gray-900 ring-gray-300 mt-0.5 sm:text-sm w-full lg:w-1/5"
                        >
                            {roles?.find((r)=>userProfile?.RoleId === r.RoleId).RoleName}
                        </span>
                    </div>
                    <div className="flex flex-col pb-3 lg:flex-row">
                        <label
                            htmlFor="FullName"
                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                        >
                            Email:
                        </label>
                        <span
                            id="Fullname"
                            className="text-gray-900 ring-gray-300 mt-0.5 sm:text-sm w-full lg:w-1/5"
                        >
                            {userProfile.Email}
                        </span>
                    </div>
                    <div className="flex flex-col pb-3 lg:flex-row">
                        <label
                            htmlFor="FullName"
                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                        >
                            Branch:
                        </label>
                        <span
                            id="Fullname"
                            className="capitalize text-gray-900 ring-gray-300 mt-0.5 sm:text-sm w-full lg:w-2/5"
                        >
                            {branches?.find((b)=>userProfile?.BranchId === b.BranchId).BranchName}
                        </span>
                    </div>
                    <div className="flex flex-col pb-3 lg:flex-row">
                        <label
                            htmlFor="FullName"
                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                        >
                            Group Policy:
                        </label>
                        <span
                            id="Fullname"
                            className="capitalize text-gray-900 ring-gray-300 mt-0.5 sm:text-sm w-full lg:w-1/5"
                        >
                            {group?.GroupName}
                        </span>
                    </div>
                    <div className="flex flex-col pb-3 lg:flex-row">
                        <label
                            htmlFor="FullName"
                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                        >
                            Report To:
                        </label>
                        <span
                            id="Fullname"
                            className="capitalize text-gray-900 ring-gray-300 mt-0.5 sm:text-sm w-full lg:w-1/5"
                        >
                            {reportTo?.FirstName} {reportTo?.LastName}
                        </span>
                    </div>
                    <div className="flex flex-col pb-3 lg:flex-row">
                        <label
                            htmlFor="FullName"
                            className="block text-sm font-bold leading-6 text-gray-900 w-full lg:w-1/5"
                        >
                            Hiring Date:
                        </label>
                        <span
                            id="Fullname"
                            className="capitalize text-gray-900 ring-gray-300 mt-0.5 sm:text-sm w-full lg:w-1/5"
                        >
                            {userProfile?.HiringDate}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
