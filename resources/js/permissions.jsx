/** const superUser = {
  role: "Super User",
  role_id: 99, // Assuming 99 is an ID for a super user or similar high-level role
  user_id: "user_12345", // Unique identifier for the user
  state: "AnyState", // If state-specific actions are required, set an appropriate state
  permissions: [
    "Kpi_calculate",
    "Kpi_edit",
    "TransitDays_add",
    "TransitDays_edit",
    "Holidays_add",
    "Holidays_edit",
    "KpiReasons_add",
    "KpiReasons_edit",
    "FailedConsignments_edit",
    "FailedReasons_view",
    "FailedReasons_add",
    "FailedReasons_edit",
    "RDD_edit",
    "RDDReasons_view",
    "RDDReasons_add",
    "RDDReasons_edit",
    "SafetyReport_add",
    "SafetyType_view",
    "SafetyReport_edit",
    "SafetyType_add",
    "SafetyType_edit",
    "NoDeliveryInfo_view",
    "AdditionalCharges_view",
    "DriverLogin_view",
    // Add any additional permissions as needed
  ],
};
 */

// const superUser = {
//     AppId: 1,
//     AppName: "Gold Tiger Account Manager",
//     AppRoleId: 3,
//     AppRoleName: "State Manager",
//     Pages: [
//       {
//         PageId: 1,
//         PageName: "Invoices",
//         Features: [
//           {
//             FeatureId: 1,
//             FeatureName: "test1123456",
//           },
//           {
//             FeatureId: 6,
//             FeatureName: "test123",
//           },
//           {
//             FeatureId: 8,
//             FeatureName: "Edit",
//           },
//           {
//             FeatureId: 8,
//             FeatureName: "Edit",
//           },
//         ],
//       },
//       {
//         PageId: 2,
//         PageName: "Employe",
//         Features: [
//           {
//             FeatureId: 2,
//             FeatureName: "test11",
//           },
//         ],
//       },
//       {
//         PageId: 3,
//         PageName: "Roles",
//         Features: [
//           {
//             FeatureId: 5,
//             FeatureName: "test1lkjn",
//           },
//           {
//             FeatureId: 5,
//             FeatureName: "test1lkjn",
//           },
//         ],
//       },
//       {
//         PageId: 4,
//         PageName: "Groups",
   
//         Features: [
//           {
//             FeatureId: 3,
   
//             FeatureName: "test12363",
//           },
//         ],
//       },
//       {
//         PageId: 5,
//         PageName: "Branches",
//         Features: [
//           {
//             FeatureId: 4,
//             FeatureName: "test1",
//           },
//         ],
//       },
//       {
//         PageId: 6,
//         PageName: "About",
//       },
//       {
//         PageId: 15,
//         PageName: "add user",
//       },
//       {
//         PageId: 16,
//         PageName: "dsa",
//       },
//     ],
//   };

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
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const pageName = "TransitDays"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const pageName = "RDDReasons"; // Adjust the page name as needed

    // Find the specified page in the user's Pages array
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
    const targetPage = currentUser.Pages.find(page => page.PageName === pageName);

    // Check if the page is found and if the specified permission is present in its Features array
    return targetPage && targetPage.Features.some(feature => feature.FeatureName === targetPermissionName);
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
 * Checks if the user can view Driver Login Report based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view Driver Login Report, false otherwise.
 */
export function canViewDriverLogin(currentUser) {
    // Check for 'DriverLogin_view' permission in the user's permissions array
    return currentUser.permissions.includes("DriverLogin_view");
}