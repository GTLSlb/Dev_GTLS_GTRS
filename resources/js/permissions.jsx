import { toast } from "react-toastify";
import swal from "sweetalert";

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
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can calculate KPI Report on the specific page, false otherwise.
 */
export function canCalculateKPI(currentUser) {
    // Define the specific permission to check for the KPI calculation
    const targetPermissionName = "Kpi_calculate";
    const pageName = "KPI";

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );
    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can edit KPI Report based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can edit KPI Report on the specific page, false otherwise.
 */
export function canEditKPI(currentUser) {
    // Define the specific permission to check for editing KPI
    const targetPermissionName = "Kpi_edit";
    const pageName = "KPI"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can add transit days based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can add transit days on the specific page, false otherwise.
 */
export function canAddTransitDays(currentUser) {
    // Define the specific permission to check for adding transit days
    const targetPermissionName = "TransitDays_add";
    const pageName = "Transit Days"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can add Newtransit days based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can add transit days on the specific page, false otherwise.
 */
export function canAddNewTransitDays(currentUser) {
    // Define the specific permission to check for adding transit days
    const targetPermissionName = "NewTransitDays_add";
    const pageName = "New Transit Days"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can edit transit days based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can edit transit days on the specific page, false otherwise.
 */
export function canEditTransitDays(currentUser) {
    // Define the specific permission to check for editing transit days
    const targetPermissionName = "TransitDays_edit";
    const pageName = "Transit Days"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can add holidays based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can add holidays on the specific page, false otherwise.
 */
export function canAddHolidays(currentUser) {
    // Define the specific permission to check for adding holidays
    const targetPermissionName = "Holidays_add";
    const pageName = "Holidays"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can add holidays based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can add holidays on the specific page, false otherwise.
 */
export function canEditHolidays(currentUser) {
    // Define the specific permission to check for editing holidays
    const targetPermissionName = "Holidays_edit";
    const pageName = "Holidays"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can add KPI Reasons based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can add KPI Reasons on the specific page, false otherwise.
 */
export function canAddKpiReasons(currentUser) {
    // Define the specific permission to check for adding KPI Reasons
    const targetPermissionName = "KpiReasons_add";
    const pageName = "KPI Reasons"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can edit KPI Reasons based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can edit KPI Reasons on the specific page, false otherwise.
 */
export function canEditKpiReasons(currentUser) {
    // Define the specific permission to check for editing KPI Reasons
    const targetPermissionName = "KpiReasons_edit";
    const pageName = "KPI Reasons"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can edit failed consignments based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can edit failed consignments on the specific page, false otherwise.
 */
export function canEditFailedConsignments(currentUser) {
    // Define the specific permission to check for editing failed consignments
    const targetPermissionName = "FailedConsignments_edit";
    const pageName = "Failed Consignments"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can view failed consignments reasons based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can view failed consignments reasons on the specific page, false otherwise.
 */
export function canViewFailedReasons(currentUser) {
    // Define the specific permission to check for viewing failed consignments reasons
    const targetPermissionName = "FailedReasons_view";
    const pageName = "Failed Consignments"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can add failed consignments reasons based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can add failed consignments reasons on the specific page, false otherwise.
 */
export function canAddFailedReasons(currentUser) {
    // Define the specific permission to check for adding failed consignments reasons
    const targetPermissionName = "FailedReasons_add";
    const pageName = "Failed Consignments"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can edit failed consignments reasons based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can edit failed consignments reasons on the specific page, false otherwise.
 */
export function canEditFailedReasons(currentUser) {
    // Define the specific permission to check for editing failed consignments reasons
    const targetPermissionName = "FailedReasons_edit";
    const pageName = "Failed Consignments"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can edit RDD report based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can edit RDD report on the specific page, false otherwise.
 */
export function canEditRDD(currentUser) {
    // Define the specific permission to check for editing RDD report
    const targetPermissionName = "RDD_edit";
    const pageName = "RDD"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can view RDD reasons based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can view RDD reasons on the specific page, false otherwise.
 */
export function canViewRDDReasons(currentUser) {
    // Define the specific permission to check for viewing RDD reasons
    const targetPermissionName = "RDDReasons_view";
    const pageName = "RDD"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can add RDD reasons based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can add RDD reasons on the specific page, false otherwise.
 */
export function canAddRDDReasons(currentUser) {
    // Define the specific permission to check for adding RDD reasons
    const targetPermissionName = "RDDReasons_add";
    const pageName = "RDD"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can edit RDD reasons based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can edit RDD reasons on the specific page, false otherwise.
 */
export function canEditRDDReasons(currentUser) {
    // Define the specific permission to check for editing RDD reasons
    const targetPermissionName = "RDDReasons_edit";
    const pageName = "RDD"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can add Safety report based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can add Safety report on the specific page, false otherwise.
 */
export function canAddSafetyReport(currentUser) {
    // Define the specific permission to check for adding Safety report
    const targetPermissionName = "SafetyReport_add";
    const pageName = "Safety"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can view Safety Type based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can view Safety Type on the specific page, false otherwise.
 */
export function canViewSafetyType(currentUser) {
    // Define the specific permission to check for viewing Safety Type
    const targetPermissionName = "SafetyType_view";
    const pageName = "Safety"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can edit Safety report based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can edit Safety report on the specific page, false otherwise.
 */
export function canEditSafetyReport(currentUser) {
    // Define the specific permission to check for editing Safety report
    const targetPermissionName = "SafetyReport_edit";
    const pageName = "Safety"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can add Safety Type based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can add Safety Type on the specific page, false otherwise.
 */
export function canAddSafetyType(currentUser) {
    // Define the specific permission to check for adding Safety Type
    const targetPermissionName = "SafetyType_add";
    const pageName = "Safety"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can edit Safety Type based on their permissions for a specific page.
 *
 * @param {Object} currentUser - The current user object with role, permissions, and pages.
 * @return {boolean} True if the user can edit Safety Type on the specific page, false otherwise.
 */
export function canEditSafetyType(currentUser) {
    // Define the specific permission to check for editing Safety Type
    const targetPermissionName = "SafetyType_edit";
    const pageName = "Safety"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can view Dashboard based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view Dashboard Report, false otherwise.
 */
export function canViewDashboard(currentUser) {
    // Check for 'Dashboard_view' permission in the user's permissions array
    return currentUser.permissions.includes("Dashboard_view");
}

/**
 * Checks if the user can view Consignmets Report based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view Consignmets Report, false otherwise.
 */
export function canViewConsignments(currentUser) {
    // Check for 'ConsignmetsReport_view' permission in the user's permissions array
    return currentUser.permissions.includes("ConsignmetsReport_view");
}

/**
 * Checks if the user can view KPI Report based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view KPI Report, false otherwise.
 */
export function canViewKPI(currentUser) {
    // Check for 'KPI_view' permission in the user's permissions array
    return currentUser.permissions.includes("KPI_view");
}

/**
 * Checks if the user can view Performance Report based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view Performance Report, false otherwise.
 */
export function canViewPerformance(currentUser) {
    // Check for 'Performance_view' permission in the user's permissions array
    return currentUser.permissions.includes("Performance_view");
}

/**
 * Checks if the user can view Failed Consignmnents Report based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view Failed Consignmnents Report, false otherwise.
 */
export function canViewFailedConsignments(currentUser) {
    // Check for 'FailedConsignments_view' permission in the user's permissions array
    return currentUser.permissions.includes("FailedConsignments_view");
}

/**
 * Checks if the user can view RDD Report based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view RDD Report, false otherwise.
 */
export function canViewRDD(currentUser) {
    // Check for 'RDD_view' permission in the user's permissions array
    return currentUser.permissions.includes("RDD_view");
}

/**
 * Checks if the user can view Missing POD Report based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view Missing POD Report, false otherwise.
 */
export function canViewMissingPOD(currentUser) {
    // Check for 'MissingPOD_view' permission in the user's permissions array
    return currentUser.permissions.includes("MissingPOD_view");
}

/**
 * Checks if the user can view Safety Report based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view Safety Report, false otherwise.
 */
export function canViewSafety(currentUser) {
    // Check for 'Safety_view' permission in the user's permissions array
    return currentUser.permissions.includes("Safety_view");
}
/**
 * Checks if the user can view No Delivery Information Report based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view No Delivery Information Report, false otherwise.
 */
export function canViewNoDeliveryInfo(currentUser) {
    // Check for 'NoDeliveryInfo_view' permission in the user's permissions array
    return currentUser.permissions.includes("NoDeliveryInfo_view");
}

/**
 * Checks if the user can view Additional charges Report based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view Additional charges Report, false otherwise.
 */
export function canViewAdditionalCharges(currentUser) {
    // Check for 'AdditionalCharges_view' permission in the user's permissions array
    return currentUser.permissions.includes("AdditionalCharges_view");
}

/**
 * Checks if the user can view Delivery Report Comments based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view Delivery Report Comments, false otherwise.
 */
export function canViewDeliveryReportComment(currentUser) {
    // Define the specific permission
    const targetPermissionName = "DeliveryReportComments_View";
    const pageName = "Delivery Report"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can edit Delivery Report Comments based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can edit Delivery Report Comments, false otherwise.
 */
export function canEditDeliveryReportComment(currentUser) {
    // Define the specific permission
    const targetPermissionName = "DeliveryReportComment_edit";
    const pageName = "Delivery Report"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can add Delivery Report Comments based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can add Delivery Report Comments, false otherwise.
 */

/**
 * Checks if the user can view based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view Delivery Report, false otherwise.
 */
export function canViewDeliveryReport(currentUser) {
    // Define the specific permission
    const targetPermissionName = "DeliveryReport_View";
    const pageName = "Delivery Report"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can view based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view Metcash Delivery Report, false otherwise.
 */
export function canViewMetcashDeliveryReport(currentUser) {
    // Define the specific permission
    const targetPermissionName = "MetcashDeliveryReport_View";
    const pageName = "Delivery Report"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can view based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view Woolworths Delivery Report, false otherwise.
 */
export function canViewWoolworthsDeliveryReport(currentUser) {
    // Define the specific permission
    const targetPermissionName = "WoolworthsDeliveryReport_View";
    const pageName = "Delivery Report"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

export function canAddDeliveryReportCommentTableView(currentUser) {
    // Define the specific permission
    const targetPermissionName = "DeliveryReportCommentsTable_Add";
    const pageName = "Comments"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

// export function canEditDeliveryReportCommentTableView(currentUser) {
//     // Define the specific permission
//     const targetPermissionName = "DeliveryReportCommentsTable_Edit";
//     const pageName = "Comments"; // Adjust the page name as needed

//     // Find the specified page in the user's Pages array
//     const targetPage = currentUser.Pages.find(
//         (page) => page.PageName === pageName
//     );

//     // Check if the page is found and if the specified permission is present in its Features array
//     return (
//         targetPage &&
//         targetPage.Features.some(
//             (feature) => feature.FunctionName === targetPermissionName
//         )
//     );
// }

export function canAddDeliveryReportComment(currentUser) {
    // Define the specific permission
    const targetPermissionName = "DeliveryReportCommentsTable_Add";
    const pageName = "Delivery Report"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

export function canEditDeliveryReportCommentTableView(currentUser) {
    // Define the specific permission
    const targetPermissionName = "DeliveryReportCommentsTable_Edit";
    const pageName = "Comments"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can view based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view Other Delivery Report, false otherwise.
 */
export function canViewOtherDeliveryReport(currentUser) {
    // Define the specific permission
    const targetPermissionName = "OtherDeliveryReport_View";
    const pageName = "Delivery Report"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );

    // Check if the page is found and if the specified permission is present in its Features array
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}

/**
 * Checks if the user can view Driver Login Report based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view Driver Login Report, false otherwise.
 */
export function canViewDriverLogin(currentUser) {
    // Check for 'DriverLogin_view' permission in the user's permissions array
    return currentUser.permissions.includes("DriverLogin_view");
}

export function canViewChart(currentUser, chartPermission) {
    const targetPermissionName = chartPermission;
    const pageName = "Dashboard";
    const targetPage = currentUser.Pages.find(
        (page) => page.PageName === pageName
    );
    return (
        targetPage &&
        targetPage.Features.some(
            (feature) => feature.FunctionName === targetPermissionName
        )
    );
}
