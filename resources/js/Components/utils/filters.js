export const getFiltersCons = (minDate, maxDate) => {
    return [
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "AccountName",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "Service",
            operator: "inlist",
            type: "select",
            value: "",
            emptyValue: "",
        },
        {
            name: "DespatchDate",
            operator: "inrange",
            type: "date",
            value: {
                start: minDate,
                end: maxDate,
            },
        },

        {
            name: "Status",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "SenderName",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "SenderSuburb",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "SenderState",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "SenderReference",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "SenderZone",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverName",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverReference",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverState",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverSuburb",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverZone",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ConsReferences",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "NetAmount",
            operator: "eq",
            type: "number",
            value: undefined,
            emptyValue: null,
        },
        {
            name: "TottalWeight",
            operator: "eq",
            type: "number",
            value: undefined,
            emptyValue: null,
        },
        {
            name: "POD",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ConsStatus",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
    ];
};

export const getFiltersTransport = () => {
    return [
        {
            name: "CustomerName",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "SenderName",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "SenderState",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "CustomerPO",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "DeliveryNo",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "RddDate",
            operator: "inrange",
            type: "date",
            value: "",
            emptyValue: "",
        },
        {
            name: "RddTime",
            operator: "eq",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "LTLFTL",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "State",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "PostalCode",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "Carrier",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "PickupDate",
            operator: "inrange",
            type: "date",
            value: {
                start: "2023-07-01",
                end: "2023-07-31",
            },
            emptyValue: "",
        },
        {
            name: "PickupTime",
            operator: "eq",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "Status",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ActualDeliveryDate",
            operator: "inrange",
            type: "date",
            value: "",
            emptyValue: "",
        },
        {
            name: "ActualDeliveryTime",
            operator: "inrange",
            type: "date",
            value: "",
            emptyValue: "",
        },
        {
            name: "OnTime",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "DelayReason",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "TransportComments",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
    ];
};
export const getFiltersKPI = (minDispatchDate, maxDispatchDate) => {
    return [
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderState",
            operator: "inlist",
            type: "select",
            value: null,
        },
        {
            name: "ReceiverName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ReceiverReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ReceiverState",
            operator: "inlist",
            type: "select",
            value: null,
        },
        {
            name: "ReceiverSuburb",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "DispatchDate",
            operator: "inrange",
            type: "date",
            value: {
                start: minDispatchDate,
                end: maxDispatchDate,
            },
        },
        {
            name: "ReceiverPostCode",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: null,
        },
        {
            name: "RDD",
            operator: "inrange",
            type: "date",
            value: "",
        },
        {
            name: "DeliveryDate",
            operator: "inrange",
            type: "date",
            value: "",
        },
        {
            name: "TransitDays",
            operator: "eq",
            type: "number",
            value: undefined,
            emptyValue: null,
        },
        {
            name: "CalculatedDelDate",
            operator: "inrange",
            type: "date",
            value: "",
        },
        {
            name: "MatchDel",
            operator: "eq",
            type: "select",
            value: null,
        },
        {
            name: "ReasonId",
            operator: "eq",
            type: "select",
            value: null,
            //emptyValue: null,
        },
    ];
};

export const getFiltersNewTransit = () => {
    return [
        {
            name: "CustomerName",
            operator: "inlist",
            type: "select",
            value: null,
        },
        {
            name: "CustomerTypeId",
            operator: "eq",
            type: "select",
            value: null,
            // emptyValue: "",
        },
        {
            name: "SenderState",
            operator: "inlist",
            type: "select",
            value: null,
        },
        {
            name: "SenderPostCode",
            operator: "eq",
            type: "number",
            value: null,
        },
        {
            name: "ReceiverName",
            operator: "contains",
            type: "string",
            value: null,
        },
        {
            name: "ReceiverState",
            operator: "inlist",
            type: "select",
            value: null,
        },
        {
            name: "ReceiverPostCode",
            operator: "eq",
            type: "number",
            value: null,
        },
        {
            name: "TransitTime",
            operator: "eq",
            type: "number",
            value: null,
        },
    ];
};

export const getFiltersHolidays = (minDateHol, maxDateHol) => {
    return [
        {
            name: "HolidayId",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "HolidayName",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "HolidayDate",
            operator: "inrange",
            type: "date",
            value: {
                start: minDateHol,
                end: maxDateHol,
            },
        },
        {
            name: "HolidayState",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "HolidayDesc",
            operator: "contains",
            type: "string",
            value: "",
        },
    ];
};

export const getFiltersKPIReasons = () => {
    return [
        {
            name: "ReasonName",
            operator: "inlist",
            type: "select",
            value: "",
        },
    ];
};

export const getFiltersFailed = (minDispatchDate, maxDispatchDate) => {
    return [
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "IncidentNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "IncidentTypeName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "IncidentStatusName",
            operator: "contains",
            type: "string",
            value: "",
        },
        { name: "SenderName", operator: "contains", type: "string", value: "" },
        {
            name: "SenderReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderState",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "ReceiverName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "receiverReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ReceiverState",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "Service",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "KpiDatetime",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: "",
        },
        {
            name: "DespatchDate",
            operator: "inrange",
            type: "date",
            value: {
                start: minDispatchDate,
                end: maxDispatchDate,
            },
        },
        {
            name: "DeliveryRequiredDateTime",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: "",
        },
        {
            name: "ArrivedDatetime",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: "",
        },
        {
            name: "DeliveredDate",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: "",
        },
        {
            name: "FailedReason",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "FailedReasonDesc",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "State",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "Reference",
            operator: "inlist",
            type: "select",
            value: "",
        },
    ];
};

export const getFiltersRDD = (minDespatchDaterdd, maxDespatchDaterdd) => {
    return [
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "IncidentNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "IncidentTypeName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "IncidentStatusName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "DebtorName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "AccountNumber",
            operator: "inlist",
            type: "select",
            value: "",
        },
        { name: "SenderName", operator: "contains", type: "string", value: "" },
        {
            name: "SenderAddress",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderSuburb",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "SenderState",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "ReceiverName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ReceiverReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ReceiverAddress",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ReceiverSuburb",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "ReceiverState",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "DespatchDate",
            operator: "inrange",
            type: "date",
            value: {
                start: minDespatchDaterdd,
                end: maxDespatchDaterdd,
            },
        },
        {
            name: "OldRdd",
            operator: "inrange",
            type: "date",
            value: "",
        },
        {
            name: "NewRdd",
            operator: "inrange",
            type: "date",
            value: "",
        },
        {
            name: "Reason",
            operator: "eq",
            type: "select",
            value: null,
        },
        {
            name: "ReasonDesc",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ChangeAt",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: "",
        },
        {
            name: "ChangedBy",
            operator: "contains",
            type: "string",
            value: "",
        },
    ];
};

export const getFiltersPOD = (
    minDateDespatchMissing,
    maxDateDespatchMissing
) => {
    return [
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderState",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "ReceiverName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ReceiverReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ReceiverState",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "Service",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "DespatchDate",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: {
                start: minDateDespatchMissing,
                end: maxDateDespatchMissing,
            },
        },
        {
            name: "DeliveryRequiredDateTime",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            // value: {
            //     start: minDaterdd,
            //     end: maxDaterdd,
            // },
        },

        {
            name: "ArrivedDatetime",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            // value: {
            //     start: minDateArrive,
            //     end: maxDateArrive,
            // },
        },
        {
            name: "DeliveredDate",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            // value: {
            //     start: minDateDel,
            //     end: maxDateDel,
            // },
        },
    ];
};

export const getFiltersSafety = (minDateSafety, maxDateSafety) => {
    return [
        {
            name: "SafetyType",
            operator: "eq",
            type: "select",
            value: null,
        },
        {
            name: "ConsNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "DebtorId",
            operator: "eq",
            type: "select",
            value: null,
        },
        {
            name: "CAUSE",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "State",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "Explanation",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "Resolution",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "Reference",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "OccuredAt",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: {
                start: minDateSafety,
                end: maxDateSafety,
            },
        },
        {
            name: "AddedBy",
            operator: "contains",
            type: "string",
            value: "",
        },
    ];
};

export const getFiltersNoDelInfo = (minDateNoDel, maxDateNoDel) => {
    return [
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "DespatchDateTime",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: {
                start: minDateNoDel,
                end: maxDateNoDel,
            },
        },
        {
            name: "SenderName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderReference",
            operator: "contains",
            type: "string",
            value: "",
        },

        {
            name: "Send_Suburb",
            operator: "inlist",
            type: "select",
            value: "",
        },

        {
            name: "Send_State",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "AdminStatusCodes_Description",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "ReceiverName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ReceiverReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "Del_Suburb",
            operator: "inlist",
            type: "select",
            value: "",
        },

        {
            name: "Del_State",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "DeliveryRequiredDateTime",
            operator: "eq",
            type: "date",
            emptyValue: "",
            value: "",
        },
        {
            name: "Description",
            operator: "inlist",
            type: "select",
            value: "",
        },
    ];
};

export const getFiltersAddCharges = (minDateAdd, maxDateAdd) => {
    return [
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ReceiverReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "Quantity",
            operator: "eq",
            type: "number",
            value: null,
        },
        {
            name: "TotalCharge",
            operator: "eq",
            type: "number",
            value: null,
        },
        {
            name: "CodeRef",
            operator: "inlist",
            type: "select",
            value: "",
        },

        {
            name: "DescriptionRef",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "FuelLevyAmountRef",
            operator: "eq",
            type: "number",
            value: null,
        },
        {
            name: "DespatchDateTime",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: {
                start: minDateAdd,
                end: maxDateAdd,
            },
        },
        {
            name: "Name",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "Description",
            operator: "inlist",
            type: "select",
            value: "",
        },

        {
            name: "Code",
            operator: "eq",
            type: "number",
            value: null,
        },
    ];
};

export const getFiltersDrivers = () => {
    return [
        {
            name: "Name",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "DeviceCode",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "SmartSCANSoftwareVersion",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "Description",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "LastActiveUTC",
            operator: "eq",
            type: "date",
            value: "",
        },
        {
            name: "Name",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SoftwareVersion",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "MobilityDeviceSimTypes_Description",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "MobilityDeviceModels_Description",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "MobilityDeviceMakes_Description",
            operator: "inlist",
            type: "select",
            value: "",
        },
    ];
};

export const getFiltersConsTrack = (minDispatchDate, maxDispatchDate) => {
    return [
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
            //emptyValue: "",
        },
        {
            name: "DebtorName",
            operator: "contains",
            type: "string",
            value: "",
            //emptyValue: "",
        },
        {
            name: "SenderName",
            operator: "contains",
            type: "string",
            value: "",
            //emptyValue: "",
        },
        {
            name: "SenderSuburb",
            operator: "contains",
            type: "string",
            value: "",
            //emptyValue: "",
        },
        {
            name: "SenderPostcode",
            operator: "contains",
            type: "string",
            value: "",
            //emptyValue: "",
        },
        {
            name: "SenderState",
            operator: "inlist",
            type: "select",
            value: null,
            //emptyValue: "",
        },
        {
            name: "ReceiverName",
            operator: "contains",
            type: "string",
            value: "",
            //emptyValue: "",
        },
        {
            name: "ReceiverSuburb",
            operator: "contains",
            type: "string",
            value: "",
            //emptyValue: "",
        },
        {
            name: "ReceiverState",
            operator: "inlist",
            type: "select",
            value: null,
            //emptyValue: "",
        },
        {
            name: "ReceiverPostcode",
            operator: "inlist",
            type: "select",
            value: null,
            //emptyValue: "",
        },
        {
            name: "ReceiverSuburb",
            operator: "contains",
            type: "string",
            value: "",
            //emptyValue: "",
        },
        {
            name: "DespatchDate",
            operator: "inrange",
            type: "date",
            value: {
                start: minDispatchDate,
                end: maxDispatchDate,
            },
        },
        {
            name: "ReceiverPostCode",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: null,
        },
        {
            name: "RDD",
            operator: "inrange",
            type: "date",
            value: "",
            //emptyValue: "",
        },
        {
            name: "EventCount",
            operator: "eq",
            type: "number",
            value: undefined,
            emptyValue: null,
        },
    ];
};

export const getFiltersDaily = (minDate, maxDate) => {
    return [
        {
            name: "AccountNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "SenderName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderZone",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverName",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverReference",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverZone",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "SpecialInstructions",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "Comments",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "CorrectiveAction",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "PastComments",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "Report",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "GTLSReasonCode",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "GTLSComments",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "PastReasonCode",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "PastCorrectiveAction",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "PODAvl",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ConsignmentStatus",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "DespatchDate",
            operator: "inrange",
            type: "date",
            value: {
                start: minDate,
                end: maxDate,
            },
        },
        {
            name: "DeliveryRequiredDateTime",
            operator: "inrange",
            type: "date",
            value: {
                start: minDate,
                end: maxDate,
            },
        },
        {
            name: "DeliveredDateTime",
            operator: "inrange",
            type: "date",
            value: {
                start: minDate,
                end: maxDate,
            },
        },
    ];
};

export const getFiltersDeliveryReport = (minDate, maxDate) => {
    return [
        {
            name: "AccountNumber",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "SenderName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderState",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverName",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverReference",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverState",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "DeliveryInstructions",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "Comments",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "CorrectiveAction",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "PastComments",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "Report",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "GTLSReasonCode",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "GTLSComments",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "PastReasonCode",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "PastCorrectiveAction",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "POD",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ConsignmentStatus",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "DespatchDateTime",
            operator: "inrange",
            type: "date",
            value: {
                start: minDate,
                end: maxDate,
            },
        },
        {
            name: "DeliveryRequiredDateTime",
            operator: "inrange",
            type: "date",
            value: {
                start: minDate,
                end: maxDate,
            },
        },
        {
            name: "DeliveredDateTime",
            operator: "inrange",
            type: "date",
            value: {
                start: minDate,
                end: maxDate,
            },
        },
    ];
};

export const getFiltersChartsTable = (chartFilter) => {
    return [
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "DebtorName",
            operator: "inlist",
            type: "select",
            value: null,
        },
        {
            name: "ReceiverName",
            operator: "inlist",
            type: "select",
            value: null,
        },
        {
            name: "ReceiverState",
            operator: "inlist",
            type: "select",
            value: chartFilter?.ReceiverState,
            emptyValue: "",
        },
        {
            name: "SenderName",
            operator: "inlist",
            type: "select",
            value: null,
        },
        {
            name: "SenderState",
            operator: "inlist",
            type: "select",
            value: null,
        },
        {
            name: "TotalQuantity",
            operator: "eq",
            type: "number",
            value: "",
            emptyValue: "",
        },
        {
            name: "TottalWeight",
            operator: "eq",
            type: "number",
            value: "",
            emptyValue: "",
        },
        {
            name: "TotalPalletSpace",
            operator: "eq",
            type: "number",
            value: "",
            emptyValue: "",
        },
        {
            name: "TotalChep",
            operator: "eq",
            type: "number",
            value: "",
            emptyValue: "",
        },
        {
            name: "TotalLoscam",
            operator: "eq",
            type: "number",
            value: "",
            emptyValue: "",
        },
        {
            name: "TotalCustomerOwn",
            operator: "eq",
            type: "number",
            value: "",
            emptyValue: "",
        },
        {
            name: "NetAmount",
            operator: "eq",
            type: "number",
            value: "",
            emptyValue: "",
        },
        {
            name: "FuelLevy",
            operator: "eq",
            type: "number",
            value: "",
            emptyValue: "",
        },
        {
            name: "ConsStatus",
            operator: "inlist",
            type: "select",
            value: chartFilter?.consStatus,
            emptyValue: "",
        },
        {
            name: "POD",
            operator: "inlist",
            type: "select",
            value:
                chartFilter?.PODValue?.length > 0
                    ? chartFilter?.PODValue
                    : null,
            emptyValue: "",
        },
        {
            name: "DespatchDate",
            operator: "inrange",
            type: "date",
            value: {
                start: chartFilter?.dateStart,
                end: chartFilter?.dateEnd,
            },
        },
        {
            name: "MatchDel",
            operator: "inlist",
            type: "select",
            value: chartFilter?.MatchDel ? chartFilter?.MatchDel : null,
            emptyValue: "",
        },
    ];
};
