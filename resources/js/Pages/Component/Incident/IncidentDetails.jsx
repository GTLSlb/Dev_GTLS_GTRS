import { canViewInternal } from "@/permissions";
import React from "react";
import PropTypes from "prop-types";
import logo from "@/assets/pictures/Logoblack.png";
import { Chip } from "@nextui-org/react";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";

export default function IncidentDetails({
    incident,
    filters,
    mainCauses,
    userPermission,
}) {
    const navigate = useNavigate();
    return (
        <div>
            <div className="py-2">
                <div className="h-8 flex mb-4">
                    <button
                        type="button"
                        className="mr-7 h-full inline-flex items-center rounded-md border border-transparent bg-gray-800 px-5 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => navigate(-1)}
                    >
                        <svg
                            viewBox="0 0 64 64"
                            fill="currentColor"
                            height="1.25em"
                            width="1.25em"
                        >
                            <path
                                fill="none"
                                stroke="currentColor"
                                strokeLinejoin="bevel"
                                strokeMiterlimit={10}
                                strokeWidth={5}
                                d="M37 15L20 32l17 17"
                            />
                        </svg>
                        <span> Back</span>
                    </button>
                </div>
                <div
                    id="CdirForm"
                    className="p-4 sm:p-10 bg-white rounded-xl shadow-md border-1 border-gray-100"
                >
                    <div className="flex flex-col gap-y-3 gap-x-5 w-full sm:flex-row">
                        <div className="">
                            <img src={logo} alt="" className="h-20" />
                        </div>
                        <div className="w-full flex flex-col gap-y-3">
                            <h1 className="text-3xl font-bold">
                                Customer Consignment Report
                            </h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-3">
                                <div className="flex gap-x-12 items-center lg:col-span-2">
                                    <label htmlFor="" className="font-bold ">
                                        Incident Status
                                    </label>
                                    <div className="">
                                        {incident?.StatusId === 1 ? (
                                            <Chip
                                                size="md"
                                                className="text-white bg-success"
                                            >
                                                open
                                            </Chip>
                                        ) : (
                                            <Chip
                                                size="md"
                                                className="text-white bg-danger"
                                            >
                                                closed
                                            </Chip>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-x-10 items-center">
                                    <label htmlFor="" className="font-bold ">
                                        Incident Date
                                    </label>
                                    <label htmlFor="" className="">
                                        {incident
                                            ? incident.IncidentDate
                                                ? moment(
                                                      incident.IncidentDate.replace(
                                                          "T",
                                                          " "
                                                      ),
                                                      "YYYY-MM-DD"
                                                  ).format("DD/MM/YYYY")
                                                : null
                                            : ""}
                                    </label>
                                </div>

                                <div className="flex gap-x-10 items-center">
                                    <label htmlFor="" className="font-bold ">
                                        Incident Number
                                    </label>
                                    <label htmlFor="" className="">
                                        {incident ? incident.IncidentNo : ""}
                                    </label>
                                </div>

                                <div className="flex gap-x-10 items-center">
                                    <label htmlFor="" className="font-bold ">
                                        Created By
                                    </label>
                                    <label htmlFor="" className="">
                                        {incident
                                            ? incident.IncidentAddedByName
                                            : ""}
                                    </label>
                                </div>

                                <div className="flex gap-x-10 items-center">
                                    <label htmlFor="" className="font-bold">
                                        State Created
                                    </label>
                                    <label htmlFor="" className="">
                                        {
                                            filters?.States?.find(
                                                (item) =>
                                                    item.StateId ===
                                                    incident.StateCreatedId
                                            )?.StateCode
                                        }
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <div>
                            <div className="items-center  px-3 py-1.5 my-3 rounded-md bg-zinc-600">
                                <h1 className="text-xl  font-bold w-full  rounded-md  text-white">
                                    Customer Details
                                </h1>
                            </div>

                            <div className="flex flex-col gap-y-3">
                                <div className="flex flex-col sm:flex-row w-full gap-5 px-4">
                                    <label htmlFor="" className="font-bold ">
                                        Customer Account
                                    </label>
                                    <label htmlFor="" className="">
                                        {incident.Consignment[0].ChargeCode}
                                    </label>
                                </div>
                                {incident.Consignment[0].CustomerContacts?.filter(
                                    (contact) =>
                                        incident.Consignment[0].ActiveContacts?.includes(
                                            contact.ContactId
                                        )
                                )?.map((contact) => (
                                    <div key={contact.ContactId} className="grid grid-cols-1 xl:grid-cols-2 gap-3 bg-[#F2F2F2] rounded-xl p-4">
                                        <div className="flex flex-col sm:flex-row w-full gap-5">
                                            <label
                                                htmlFor=""
                                                className="font-bold "
                                            >
                                                Contact Name
                                            </label>
                                            <label htmlFor="" className="">
                                                {contact.ContactName}
                                            </label>
                                        </div>
                                        <div className=" flex flex-col gap-5 sm:flex-row w-full">
                                            <label
                                                htmlFor=""
                                                className="font-bold"
                                            >
                                                Email
                                            </label>
                                            <label htmlFor="" className="">
                                                {contact.ContactEmailAddress}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="items-center  px-3 py-1.5 my-3 rounded-md bg-zinc-600">
                                <h1 className="text-xl  font-bold w-full  rounded-md  text-white">
                                    Consignment Details
                                </h1>
                            </div>

                            <div>
                                <div className=" px-1 sm:px-4 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3">
                                    <div className="flex w-full">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-48"
                                        >
                                            Service Type
                                        </label>
                                        <label htmlFor="" className="">
                                            {
                                                incident.Consignment[0]
                                                    .ServiceType
                                            }
                                        </label>
                                    </div>
                                    <div className="flex  w-full">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-48"
                                        >
                                            Consignment Number
                                        </label>
                                        <label htmlFor="" className="">
                                            {
                                                incident.Consignment[0]
                                                    .ConsignmentNo
                                            }
                                        </label>
                                    </div>
                                    <div className="flex w-full">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-48"
                                        >
                                            Original Pick Date
                                        </label>
                                        <label htmlFor="" className="">
                                            {incident
                                                ? incident.Consignment[0]
                                                      .Pickdate
                                                    ? moment(
                                                          incident.Consignment[0].Pickdate.replace(
                                                              "T",
                                                              " "
                                                          ),
                                                          "YYYY-MM-DD HH:mm:ss"
                                                      ).format("DD/MM/YYYY")
                                                    : null
                                                : ""}
                                        </label>
                                    </div>
                                    <div className="flex  w-full">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-48"
                                        >
                                            Sender Reference No
                                        </label>
                                        <label htmlFor="" className="">
                                            {
                                                incident.Consignment[0]
                                                    .SenderReference
                                            }
                                        </label>
                                    </div>
                                    <div className="flex w-full">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-48"
                                        >
                                            Original RDD
                                        </label>
                                        <label htmlFor="" className="">
                                            {incident
                                                ? incident.Consignment[0]
                                                      .RequiredDeliverDate
                                                    ? moment(
                                                          incident.Consignment[0].RequiredDeliverDate.replace(
                                                              "T",
                                                              " "
                                                          ),
                                                          "YYYY-MM-DD HH:mm:ss"
                                                      ).format("DD/MM/YYYY")
                                                    : null
                                                : ""}
                                        </label>
                                    </div>
                                    <div className="flex  w-full">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-48"
                                        >
                                            Receiver Reference No
                                        </label>
                                        <label htmlFor="" className="">
                                            {
                                                incident.Consignment[0]
                                                    .ReceiverReference
                                            }
                                        </label>
                                    </div>
                                    <div className="flex w-full">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-48"
                                        >
                                            Original Time Slot
                                        </label>
                                        <label htmlFor="" className="">
                                            {moment(
                                                incident.Consignment[0]
                                                    .RequiredDeliverDate
                                            ).format("HH:mm")}
                                        </label>
                                    </div>
                                    <div className="flex  w-full">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-48"
                                        >
                                            Manifest / Runsheet No
                                        </label>
                                        <label htmlFor="" className="">
                                            {incident.Consignment[0].MafifestNo}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 mt-5 gap-x-3 gap-y-3 ">
                                <div className="p-5 bg-gray-100 rounded-md flex flex-col gap-y-3">
                                    <h1 className="text-xl font-semibold">
                                        Sender / Load Address
                                    </h1>
                                    <div>
                                        <p>
                                            {incident.Consignment[0].SenderName}
                                        </p>
                                        <p>
                                            {
                                                incident.Consignment[0]
                                                    .SenderAddress
                                            }
                                        </p>
                                        <p>
                                            {
                                                incident.Consignment[0]
                                                    .SenderSuburb
                                            }
                                            {" / "}
                                            {
                                                incident.Consignment[0]
                                                    .SenderState
                                            }
                                            {" / "}
                                            {
                                                incident.Consignment[0]
                                                    .SenderPostCode
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="p-5 bg-gray-100 rounded-md flex flex-col gap-y-3">
                                    <h1 className="text-xl font-semibold">
                                        Receiver / Unload Address
                                    </h1>
                                    <div>
                                        <p>
                                            {
                                                incident.Consignment[0]
                                                    .ReceiverName
                                            }
                                        </p>
                                        <p>
                                            {
                                                incident.Consignment[0]
                                                    .ReceiverAddress
                                            }
                                        </p>
                                        <p>
                                            {
                                                incident.Consignment[0]
                                                    .ReceiverSuburb
                                            }
                                            {" / "}
                                            {
                                                incident.Consignment[0]
                                                    .ReceiverState
                                            }
                                            {" / "}
                                            {
                                                incident.Consignment[0]
                                                    .ReceiverPostcode
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="items-center  px-3 py-1.5 my-3 rounded-md bg-zinc-600">
                                <h1 className="text-xl  font-bold w-full  rounded-md  text-white">
                                    Product Information
                                </h1>
                            </div>

                            <div>
                                <div className=" px-1 sm:px-4 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
                                    <div className="flex w-full">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-52"
                                        >
                                            Original Pallet Qty
                                        </label>
                                        <label htmlFor="" className="">
                                            {
                                                incident?.Consignment[0]
                                                    ?.PalletQty
                                            }
                                        </label>
                                    </div>
                                    <div className="flex  w-full">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-52"
                                        >
                                            Effected Pallet Qty
                                        </label>
                                        <label htmlFor="" className="">
                                            {incident?.EffPalletQty}
                                        </label>
                                    </div>
                                    <div className="hidden md:flex"></div>
                                    <div className="flex  w-full">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-52"
                                        >
                                            Effected Carton Qty
                                        </label>
                                        <label htmlFor="" className="">
                                            {incident?.EffCartonQty}
                                        </label>
                                    </div>
                                    <div className="flex flex-col sm:col-span-2 w-full bg-gray-100 p-2 rounded-md">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-72"
                                        >
                                            Product Description:
                                        </label>
                                        <label htmlFor="" className="">
                                            {incident?.ProductDescription}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="items-center  px-3 py-1.5 my-3 rounded-md bg-zinc-600">
                                <h1 className="text-xl  font-bold w-full  rounded-md  text-white">
                                    Incident Details
                                </h1>
                            </div>

                            <div>
                                <div className=" px-1 sm:px-4 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
                                    <div className="flex flex-col gap-y-3 w-full sm:flex-row">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-52"
                                        >
                                            Incident Type
                                        </label>
                                        <label htmlFor="" className="">
                                            {
                                                filters.IncidentTypes.find(
                                                    (incidentType) =>
                                                        incidentType?.TypeId ===
                                                        incident?.IncidentTypeId
                                                )?.TypeName
                                            }
                                        </label>
                                    </div>
                                    <div className="flex flex-col gap-y-3 w-full sm:flex-row">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-52"
                                        >
                                            Main Cause
                                        </label>
                                        <label htmlFor="" className="">
                                            {
                                                mainCauses.find(
                                                    (item) =>
                                                        item?.CauseId ===
                                                        incident?.MainCauseId
                                                )?.CauseName
                                            }
                                        </label>
                                    </div>
                                    {canViewInternal(userPermission) && (
                                        <div className="flex flex-col gap-y-3 w-full sm:flex-row">
                                            <label
                                                htmlFor=""
                                                className="font-bold w-52"
                                            >
                                                State Responsible
                                            </label>
                                            <label htmlFor="" className="">
                                                {
                                                    filters?.States?.find(
                                                        (item) =>
                                                            item?.StateId ===
                                                            incident?.StateResponsibleId
                                                    )?.StateCode
                                                }
                                            </label>
                                        </div>
                                    )}
                                    {canViewInternal(userPermission) && (
                                        <div className="flex flex-col gap-y-3 w-full sm:flex-row">
                                            <label
                                                htmlFor=""
                                                className="font-bold w-52"
                                            >
                                                Department Responsible
                                            </label>
                                            <label htmlFor="" className="">
                                                {
                                                    filters.Departments.find(
                                                        (item) =>
                                                            item?.DepartmentId ===
                                                            incident?.DepartmentId
                                                    )?.DepartmentName
                                                }
                                            </label>
                                        </div>
                                    )}
                                    {/* <div className="flex flex-col gap-y-3 w-full sm:flex-row">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-52"
                                        >
                                            State Responsible
                                        </label>
                                        <label htmlFor="" className="">
                                            {
                                                filters.States.find(
                                                    (item) =>
                                                        item.StateId ===
                                                        incident.StateResponsibleId
                                                )?.StateCode
                                            }
                                        </label>
                                    </div>
                                    <div className="flex flex-col gap-y-3 w-full sm:flex-row">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-52"
                                        >
                                            Department Responsible
                                        </label>
                                        <label htmlFor="" className="">
                                            {
                                                filters.Departments.find(
                                                    (item) =>
                                                        item.DepartmentId ===
                                                        incident.DepartmentId
                                                )?.DepartmentName
                                            }
                                        </label>
                                    </div> */}
                                    <div className="flex flex-col sm:col-span-2 w-full bg-gray-100 p-2 rounded-md">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-72"
                                        >
                                            Incident Explanation:
                                        </label>
                                        <label htmlFor="" className="">
                                            {incident?.Explanation}
                                        </label>
                                    </div>
                                    <div className="flex flex-col sm:col-span-2 w-full bg-gray-100 p-2 rounded-md">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-72"
                                        >
                                            Incident Resolution
                                        </label>
                                        <label htmlFor="" className="">
                                            {incident?.Resolution}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="items-center  px-3 py-1.5 my-3 rounded-md bg-zinc-600">
                                <h1 className="text-xl  font-bold w-full  rounded-md  text-white">
                                    Pallet Work Requirements
                                </h1>
                            </div>

                            <div className="px-1 sm:px-4 grid grid-cols-1  gap-x-10 gap-y-3">
                                <div className="flex gap-x-10 w-full">
                                    <label htmlFor="" className="w-10">
                                        {incident?.PalletRequired
                                            ? "YES"
                                            : "NO"}
                                    </label>
                                    <label htmlFor="" className="font-bold ">
                                        Is pallet work required Y/N
                                    </label>
                                </div>
                                <div className="flex w-full gap-x-10">
                                    <label htmlFor="" className="w-10">
                                        {incident?.PalletCharegeable
                                            ? "YES"
                                            : "NO"}
                                    </label>{" "}
                                    <label htmlFor="" className="font-bold ">
                                        Is pallet work chargeable Y/N
                                    </label>
                                </div>
                                <div className="flex w-full gap-x-10">
                                    <label htmlFor="" className="w-10">
                                        {incident?.SamePallet ? "YES" : "NO"}
                                    </label>{" "}
                                    <label htmlFor="" className="font-bold ">
                                        Unwrapping, unstacking, moving,
                                        re-stacking, shrink wrapping and
                                        labelling on SAME pallet
                                    </label>
                                </div>
                                <div className="flex w-full gap-x-10">
                                    <label htmlFor="" className="w-10">
                                        {incident?.GtlsPallet ? "YES" : "NO"}
                                    </label>{" "}
                                    <label htmlFor="" className="font-bold ">
                                        Unwrapping, unstacking, moving,
                                        re-stacking, shrink wrapping and
                                        labelling on pallet provided by GTLS
                                    </label>
                                </div>
                                <div className="flex w-full gap-x-10">
                                    <label htmlFor="" className="w-10">
                                        {incident?.Relabelling ? "YES" : "NO"}
                                    </label>{" "}
                                    <label htmlFor="" className="font-bold ">
                                        Re-Labelling pallet only
                                    </label>
                                </div>
                                <div className="flex w-full gap-x-10">
                                    <label htmlFor="" className="w-10">
                                        {incident?.ShrinkPallet ? "YES" : "NO"}
                                    </label>{" "}
                                    <label htmlFor="" className="font-bold ">
                                        Shrink wrapping pallet only
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="items-center  px-3 py-1.5 my-3 rounded-md bg-zinc-600">
                                <h1 className="text-xl  font-bold w-full  rounded-md  text-white">
                                    Re-Delivery Consignment Details
                                </h1>
                            </div>
                            <div>
                                <div className=" px-1 sm:px-4 grid grid-cols-1 sm:grid-cols-3 gap-y-3">
                                    <div className="flex flex-col gap-y-3 w-full">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-72"
                                        >
                                            Consignment Number
                                        </label>
                                        <label htmlFor="" className="">
                                            {incident?.ReConsNo}
                                        </label>
                                    </div>
                                    <div className="flex flex-col gap-y-3 w-full">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-72"
                                        >
                                            Delivery Date
                                        </label>
                                        <label htmlFor="" className="">
                                            {incident
                                                ? incident.ReDeliveryDate
                                                    ? moment(
                                                          incident.ReDeliveryDate.replace(
                                                              "T",
                                                              " "
                                                          ),
                                                          "YYYY-MM-DD"
                                                      ).format("DD-MM-YYYY")
                                                    : null
                                                : ""}
                                        </label>
                                    </div>
                                    <div className="flex flex-col gap-y-3 w-full">
                                        <label
                                            htmlFor=""
                                            className="font-bold xl:w-72"
                                        >
                                            Delivery Time Slot
                                        </label>
                                        <label htmlFor="" className="">
                                            {incident
                                                ? incident.ReDeliveryTimeslot
                                                    ? moment(
                                                          incident.ReDeliveryTimeslot.replace(
                                                              "T",
                                                              " "
                                                          ),
                                                          "HH:mm:ss"
                                                      ).format("HH:mm")
                                                    : null
                                                : ""}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="items-center  px-3 py-1.5 my-3 rounded-md bg-zinc-600">
                                <h1 className="text-xl  font-bold w-full  rounded-md  text-white">
                                    Charges to Apply
                                </h1>
                            </div>
                            <div>
                                <div className=" px-1 sm:px-4 grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-3">
                                    <div className="flex  gap-y-3 w-full">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-52"
                                        >
                                            Return / Futile Charge
                                        </label>
                                        <label htmlFor="" className="">
                                            {incident.ReturnCharge
                                                ? "YES"
                                                : "NO"}
                                        </label>
                                    </div>
                                    <div className="flex  gap-y-3 w-full">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-52"
                                        >
                                            Handling Off Fee
                                        </label>
                                        <label htmlFor="" className="">
                                            {incident.HandlingOffFee
                                                ? "YES"
                                                : "NO"}
                                        </label>
                                    </div>
                                    <div className="flex  gap-y-3 w-full">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-52"
                                        >
                                            Storage
                                        </label>
                                        <label htmlFor="" className="">
                                            {incident.Storage ? "YES" : "NO"}
                                        </label>
                                    </div>
                                    <div className="flex  gap-y-3 w-full">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-52"
                                        >
                                            Re-Delivery Charge
                                        </label>
                                        <label htmlFor="" className="">
                                            {incident.ReDeliveryCharge
                                                ? "YES"
                                                : "NO"}
                                        </label>
                                    </div>
                                    <div className="flex  gap-y-3 w-full">
                                        <label
                                            htmlFor=""
                                            className="font-bold w-52"
                                        >
                                            Handling On Fee
                                        </label>
                                        <label htmlFor="" className="">
                                            {incident.HandlingOnFee
                                                ? "YES"
                                                : "NO"}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

IncidentDetails.propTypes = {
    incident: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
    userPermission: PropTypes.object.isRequired,
    mainCauses: PropTypes.array.isRequired,
};
