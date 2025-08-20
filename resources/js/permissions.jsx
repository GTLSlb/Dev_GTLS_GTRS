import { toast } from "react-toastify";

export function AlertToast(msg, status) {
    if (status == 1) {
        toast.success(msg, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    } else if (status == 2) {
        toast.error(msg, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    } else if (status == 3) {
        toast.warning(msg, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
}
/**
 * Checks if the user can calculate KPI Report based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can calculate KPI Report on the specific page, false otherwise.
 */
export function canCalculateKPI(userPermissions) {
    // Define the specific permission to check for the KPI calculation
    const targetPermissionName = "Kpi_calculate";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can edit KPI Report based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can edit KPI Report on the specific page, false otherwise.
 */
export function canEditKPI(userPermissions) {
    // Define the specific permission to check for editing KPI
    const targetPermissionName = "Kpi_edit";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can add transit days based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can add transit days on the specific page, false otherwise.
 */
export function canAddTransitDays(userPermissions) {
    // Define the specific permission to check for adding transit days
    const targetPermissionName = "TransitDays_add";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can edit transit days based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can edit transit days on the specific page, false otherwise.
 */
export function canEditTransitDays(userPermissions) {
    // Define the specific permission to check for editing transit days
    const targetPermissionName = "TransitDays_edit";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can add holidays based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can add holidays on the specific page, false otherwise.
 */
export function canAddHolidays(userPermissions) {
    // Define the specific permission to check for adding holidays
    const targetPermissionName = "Holidays_add";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can add holidays based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can add holidays on the specific page, false otherwise.
 */
export function canEditHolidays(userPermissions) {
    // Define the specific permission to check for editing holidays
    const targetPermissionName = "Holidays_edit";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can add KPI Reasons based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can add KPI Reasons on the specific page, false otherwise.
 */
export function canAddKpiReasons(userPermissions) {
    // Define the specific permission to check for adding KPI Reasons
    const targetPermissionName = "KPIReasons_add";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can edit KPI Reasons based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can edit KPI Reasons on the specific page, false otherwise.
 */
export function canEditKpiReasons(userPermissions) {
    // Define the specific permission to check for editing KPI Reasons
    const targetPermissionName = "KPIReasons_edit";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can edit failed consignments based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can edit failed consignments on the specific page, false otherwise.
 */
export function canEditFailedConsignments(userPermissions) {
    // Define the specific permission to check for editing failed consignments
    const targetPermissionName = "FailedConsignments_edit";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can view failed consignments reasons based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can view failed consignments reasons on the specific page, false otherwise.
 */
export function canViewFailedReasons(userPermissions) {
    // Define the specific permission to check for viewing failed consignments reasons
    const targetPermissionName = "FailedReasons_view";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can add failed consignments reasons based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can add failed consignments reasons on the specific page, false otherwise.
 */
export function canAddFailedReasons(userPermissions) {
    // Define the specific permission to check for adding failed consignments reasons
    const targetPermissionName = "FailedReasons_add";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can edit failed consignments reasons based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can edit failed consignments reasons on the specific page, false otherwise.
 */
export function canEditFailedReasons(userPermissions) {
    // Define the specific permission to check for editing failed consignments reasons
    const targetPermissionName = "FailedReasons_edit";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can edit RDD report based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can edit RDD report on the specific page, false otherwise.
 */
export function canViewInternal(userPermissions) {
    // Define the specific permission to check for editing RDD report
    const targetPermissionName = "IR_Internal";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can edit RDD report based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can edit RDD report on the specific page, false otherwise.
 */
export function canEditRDD(userPermissions) {
    // Define the specific permission to check for editing RDD report
    const targetPermissionName = "RDD_edit";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can view RDD reasons based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can view RDD reasons on the specific page, false otherwise.
 */
export function canViewRDDReasons(userPermissions) {
    // Define the specific permission to check for viewing RDD reasons
    const targetPermissionName = "RDDReasons_view";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can add RDD reasons based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can add RDD reasons on the specific page, false otherwise.
 */
export function canAddRDDReasons(userPermissions) {
    // Define the specific permission to check for adding RDD reasons
    const targetPermissionName = "RDDReasons_add";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can edit RDD reasons based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can edit RDD reasons on the specific page, false otherwise.
 */
export function canEditRDDReasons(userPermissions) {
    // Define the specific permission to check for editing RDD reasons
    const targetPermissionName = "RDDReasons_edit";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can add Safety report based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can add Safety report on the specific page, false otherwise.
 */
export function canAddSafetyReport(userPermissions) {
    // Define the specific permission to check for adding Safety report
    const targetPermissionName = "SafetyReport_add";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can view Safety Type based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can view Safety Type on the specific page, false otherwise.
 */
export function canViewSafetyType(userPermissions) {
    // Define the specific permission to check for viewing Safety Type
    const targetPermissionName = "SafetyType_view";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can edit Safety report based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can edit Safety report on the specific page, false otherwise.
 */
export function canEditSafetyReport(userPermissions) {
    // Define the specific permission to check for editing Safety report
    const targetPermissionName = "SafetyReport_edit";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can add Safety Type based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can add Safety Type on the specific page, false otherwise.
 */
export function canAddSafetyType(userPermissions) {
    // Define the specific permission to check for adding Safety Type
    const targetPermissionName = "SafetyType_add";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can edit Safety Type based on their permissions for a specific page.
 *
 * @param {Object} userPermissions - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can edit Safety Type on the specific page, false otherwise.
 */
export function canEditSafetyType(userPermissions) {
    // Define the specific permission to check for editing Safety Type
    const targetPermissionName = "SafetyType_edit";

    // Check if the page is found and if the specified permission is present in its Features array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can view Dashboard based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can view Dashboard Report, false otherwise.
 */
export function canViewDashboard(userPermissions) {
    // Check for 'Dashboard_view' permission in the user's permissions array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "Dashboard_view"
    )
        ? true
        : false;
}

/**
 * Checks if the user can view Consignmets Report based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can view Consignmets Report, false otherwise.
 */
export function canViewConsignments(userPermissions) {
    // Check for 'ConsignmetsReport_view' permission in the user's permissions array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "ConsignmetsReport_view"
    )
        ? true
        : false;
}

/**
 * Checks if the user can view KPI Report based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can view KPI Report, false otherwise.
 */
export function canViewKPI(userPermissions) {
    // Check for 'KPI_view' permission in the user's permissions array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "KPI_view"
    )
        ? true
        : false;
}

/**
 * Checks if the user can view Performance Report based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can view Performance Report, false otherwise.
 */
export function canViewPerformance(userPermissions) {
    // Check for 'Performance_view' permission in the user's permissions array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "Performance_view"
    )
        ? true
        : false;
}

/**
 * Checks if the user can view Failed Consignmnents Report based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can view Failed Consignmnents Report, false otherwise.
 */
export function canViewFailedConsignments(userPermissions) {
    // Check for 'FailedConsignments_view' permission in the user's permissions array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "FailedConsignments_view"
    )
        ? true
        : false;
}

/**
 * Checks if the user can view RDD Report based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can view RDD Report, false otherwise.
 */
export function canViewRDD(userPermissions) {
    // Check for 'RDD_view' permission in the user's permissions array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "RDD_view"
    )
        ? true
        : false;
}

/**
 * Checks if the user can view Missing POD Report based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can view Missing POD Report, false otherwise.
 */
export function canViewMissingPOD(userPermissions) {
    // Check for 'MissingPOD_view' permission in the user's permissions array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "MissingPOD_view"
    )
        ? true
        : false;
}

/**
 * Checks if the user can view Safety Report based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can view Safety Report, false otherwise.
 */
export function canViewSafety(userPermissions) {
    // Check for 'Safety_view' permission in the user's permissions array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "Safety_view"
    )
        ? true
        : false;
}

/**
 * Checks if the user can view Delivery Report Comments based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can view Delivery Report Comments, false otherwise.
 */
export function canViewDeliveryReportComment(userPermissions) {
    // Check for 'DeliveryReportComments_View' permission in the user's permissions array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "DeliveryReportComments_View"
    )
        ? true
        : false;
}

/**
 * Checks if the user can view Delivery Report Comments Table based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can view Delivery Report Comments Table, false otherwise.
 */
export function canViewDeliveryReportCommentTable(userPermissions) {
    // Check for 'DeliveryReportComments_View' permission in the user's permissions array
    return userPermissions?.find(
        (feature) =>
            feature?.FunctionName === "DeliveryReportCommentsTable_View"
    )
        ? true
        : false;
}

/**
 * Checks if the user can edit Delivery Report Comments in Table View based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can edit Delivery Report Comments, false otherwise.
 */
export function canEditDeliveryReportCommentTableView(userPermissions) {
    // Define the specific permission
    return userPermissions?.find(
        (feature) =>
            feature?.FunctionName === "DeliveryReportCommentsTable_Edit"
    )
        ? true
        : false;
}

/**
 * Checks if the user can edit Delivery Report Comments based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can edit Delivery Report Comments, false otherwise.
 */
export function canEditDeliveryReportComment(userPermissions) {
    // Define the specific permission
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "DeliveryReportComments_View"
    )
        ? true
        : false;
}

/**
 * Checks if the user can add Delivery Report Comments based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can add Delivery Report Comments, false otherwise.
 */
export function canAddDeliveryReportComment(userPermissions) {
    // Define the specific permission
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "DeliveryReportComment_add"
    )
        ? true
        : false;
}

/**
 * Checks if the user can add Delivery Report Comments in Table View based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can add Delivery Report Comments, false otherwise.
 */
export function canAddDeliveryReportCommentTableView(userPermissions) {
    // Define the specific permission
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "DeliveryReportCommentsTable_Add"
    )
        ? true
        : false;
}
/**
 * Checks if the user can view based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can view Delivery Report, false otherwise.
 */
export function canViewDeliveryReport(userPermissions) {
    // Define the specific permission
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "DeliveryReport_View"
    )
        ? true
        : false;
}

/**
 * Checks if the user can view based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can view Metcash Delivery Report, false otherwise.
 */
export function canViewMetcashDeliveryReport(userPermissions) {
    // Define the specific permission
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "MetcashDeliveryReport_View"
    )
        ? true
        : false;
}

/**
 * Checks if the user can view based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can view Woolworths Delivery Report, false otherwise.
 */
export function canViewWoolworthsDeliveryReport(userPermissions) {
    // Define the specific permission
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "WoolworthsDeliveryReport_View"
    )
        ? true
        : false;
}

/**
 * Checks if the user can view based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can view Other Delivery Report, false otherwise.
 */
export function canViewOtherDeliveryReport(userPermissions) {
    // Define the specific permission
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "OtherDeliveryReport_View"
    )
        ? true
        : false;
}

/**
 * Checks if the user can view Additional charges Report based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can view Additional charges Report, false otherwise.
 */
export function canViewAdditionalCharges(userPermissions) {
    // Check for 'AdditionalCharges_view' permission in the user's permissions array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "AdditionalCharges_view"
    )
        ? true
        : false;
}

/**
 * Checks if the user can view Driver Login Report based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can view Driver Login Report, false otherwise.
 */
export function canViewDriverLogin(userPermissions) {
    // Check for 'DriverLogin_view' permission in the user's permissions array
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "DriverLogin_view"
    )
        ? true
        : false;
}

export function canViewChart(userPermissions, chartPermission) {
    const targetPermissionName = chartPermission;
    return userPermissions?.find(
        (feature) => feature?.FunctionName === targetPermissionName
    )
        ? true
        : false;
}

/**
 * Checks if the user can view Consignment Details based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can view Consignment Details, false otherwise.
 */
export function canViewDetails(userPermissions) {
    return userPermissions?.find(
        (feature) => feature?.FunctionName == "ConsignmentsDetails_view"
    )
        ? true
        : false;
}

/**
 * Checks if the user can view Consignment Details based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can view Consignment Details, false otherwise.
 */
export function canViewIncidentDetails(userPermissions) {
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "View_IncidentDetails"
    )
        ? true
        : false;
}

/**
 * Checks if the user can view Settings based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can view Settings, false otherwise.
 */
export function canViewSettings(userPermissions) {
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "Settings_View"
    )
        ? true
        : false;
}


/**
 * Checks if the user can edit Users based on their permissions.
 *
 * @param {Object} userPermissions - The current user object with role and permissions.
 * @return {boolean} True if the user can edit Users, false otherwise.
 */
export function canEditUsers(userPermissions) {
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "Users_Edit"
    )
        ? true
        : false;
}

export function canApproveCommentExcelDeliveryReport(userPermissions) {
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "Approve_Comments"
    )
        ? true
        : false;
}

export function canEditCommentExcelDeliveryReport(userPermissions) {
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "DeliveryReportComment_edit"
    )
        ? true
        : false;
}

export function canAddCommentExcelDeliveryReport(userPermissions) {
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "DeliveryReportComment_add"
    )
        ? true
        : false;
}

export function canViewOthersExcelDeliveryReport(userPermissions) {
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "OtherDeliveryReport_View"
    )
        ? true
        : false;
}

export function canViewWoolworthsExcelDeliveryReport(userPermissions) {
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "WoolworthsDeliveryReport_View"
    )
        ? true
        : false;
}

export function canViewMetcahsExcelDeliveryReport(userPermissions) {
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "MetcashDeliveryReport_View"
    )
        ? true
        : false;
}

export function canViewCommentsExcelDeliveryReport(userPermissions) {
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "DeliveryReportComments_View"
    )
        ? true
        : false;
}

export function canViewExcelDeliveryReport(userPermissions) {
    return userPermissions?.find(
        (feature) => feature?.FunctionName === "ExcelTable_View"
    )
        ? true
        : false;
}