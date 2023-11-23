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

/**
 * Checks if the user can calculate KPI Report based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can calculate KPI Report, false otherwise.
 */
export function canCalculateKPI(currentUser) {
    // Check for 'KPI_Calculate' permission in the user's permissions array
    return currentUser.permissions.includes("Kpi_calculate");
}

/**
 * Checks if the user can edit KPI Report based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can edit KPI Report, false otherwise.
 */
export function canEditKPI(currentUser) {
    // Check for 'Kpi_edit' permission in the user's permissions array
    return currentUser.permissions.includes("Kpi_edit");
}

/**
 * Checks if the user can add transit days based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can add transit days, false otherwise.
 */
export function canAddTransitDays(currentUser) {
    // Check for 'TransitDays_add' permission in the user's permissions array
    return currentUser.permissions.includes("TransitDays_add");
}

/**
 * Checks if the user can add transit days based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can edit transit days, false otherwise.
 */
export function canEditTransitDays(currentUser) {
    // Check for 'TransitDays_edit' permission in the user's permissions array
    return currentUser.permissions.includes("TransitDays_edit");
}

/**
 * Checks if the user can add Holidays based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can add Holidays, false otherwise.
 */
export function canAddHolidays(currentUser) {
    // Check for 'Holidays_Add' permission in the user's permissions array
    return currentUser.permissions.includes("Holidays_add");
}

/**
 * Checks if the user can edit Holidays based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can edit Holidays, false otherwise.
 */
export function canEditHolidays(currentUser) {
    // Check for 'Holidays_edit' permission in the user's permissions array
    return currentUser.permissions.includes("Holidays_edit");
}

/**
 * Checks if the user can Add KPI Reasons based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can Add KPI Reasons, false otherwise.
 */
export function canAddKpiReasons(currentUser) {
    // Check for 'KpiReasons_add' permission in the user's permissions array
    return currentUser.permissions.includes("KpiReasons_add");
}

/**
 * Checks if the user can Edit KPI Reasons based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can Edit KPI Reasons, false otherwise.
 */
export function canEditKpiReasons(currentUser) {
    // Check for 'KpiReasons_edit' permission in the user's permissions array
    return currentUser.permissions.includes("KpiReasons_edit");
}

/**
 * Checks if the user can Edit failed consignments based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can Edit failed consignments, false otherwise.
 */
export function canEditFailedConsignments(currentUser) {
    // Check for 'FailedConsignments_edit' permission in the user's permissions array
    return currentUser.permissions.includes("FailedConsignments_edit");
}

/**
 * Checks if the user can view failed consignments reasons based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view failed consignments reasons, false otherwise.
 */
export function canViewFailedReasons(currentUser) {
    // Check for 'FailedReasons_view' permission in the user's permissions array
    return currentUser.permissions.includes("FailedReasons_view");
}

/**
 * Checks if the user can add failed consignments reasons based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can add failed consignments reasons, false otherwise.
 */
export function canAddFailedReasons(currentUser) {
    // Check for 'FailedReasons_add' permission in the user's permissions array
    return currentUser.permissions.includes("FailedReasons_add");
}

/**
 * Checks if the user can edit failed consignments reasons based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can edit failed consignments reasons, false otherwise.
 */
export function canEditFailedReasons(currentUser) {
    // Check for 'FailedReasons_edit' permission in the user's permissions array
    return currentUser.permissions.includes("FailedReasons_edit");
}

/**
 * Checks if the user can Edit RDD report based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can Edit RDD report, false otherwise.
 */
export function canEditRDD(currentUser) {
    // Check for 'RDD_edit' permission in the user's permissions array
    return currentUser.permissions.includes("RDD_edit");
}

/**
 * Checks if the user can view RDD reasons based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view RDD reasons, false otherwise.
 */
export function canViewRDDReasons(currentUser) {
    // Check for 'RDDReasons_view' permission in the user's permissions array
    return currentUser.permissions.includes("RDDReasons_view");
}

/**
 * Checks if the user can add RDD reasons based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can add RDD reasons, false otherwise.
 */
export function canAddRDDReasons(currentUser) {
    // Check for 'RDDReasons_add' permission in the user's permissions array
    return currentUser.permissions.includes("RDDReasons_add");
}

/**
 * Checks if the user can edit RDD reasons based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can edit RDD reasons, false otherwise.
 */
export function canEditRDDReasons(currentUser) {
    // Check for 'RDDReasons_edit' permission in the user's permissions array
    return currentUser.permissions.includes("RDDReasons_edit");
}

/**
 * Checks if the user can add Safety report based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can add Safety report, false otherwise.
 */
export function canAddSafetyReport(currentUser) {
    // Check for 'SafetyReport_add' permission in the user's permissions array
    return currentUser.permissions.includes("SafetyReport_add");
}

/**
 * Checks if the user can view Safety Type based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can view Safety Type, false otherwise.
 */
export function canViewSafetyType(currentUser) {
    // Check for 'SafetyType_view' permission in the user's permissions array
    return currentUser.permissions.includes("SafetyType_view");
}

/**
 * Checks if the user can edit Safety report based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can edit Safety report, false otherwise.
 */
export function canEditSafetyReport(currentUser) {
    // Check for 'SafetyReport_edit' permission in the user's permissions array
    return currentUser.permissions.includes("SafetyReport_edit");
}

/**
 * Checks if the user can add Safety Type based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can add Safety Type, false otherwise.
 */
export function canAddSafetyType(currentUser) {
    // Check for 'SafetyType_add' permission in the user's permissions array
    return currentUser.permissions.includes("SafetyType_add");
}

/**
 * Checks if the user can edit Safety Type based on their permissions.
 *
 * @param {Object} currentUser - The current user object with role and permissions.
 * @return {boolean} True if the user can edit Safety Type, false otherwise.
 */
export function canEditSafetyType(currentUser) {
    // Check for 'SafetyType_edit' permission in the user's permissions array
    return currentUser.permissions.includes("SafetyType_edit");
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