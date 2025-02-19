import routes from "@/GTRSRoutes";
import NoAccessRedirect from "@/Pages/NoAccessRedirect";
import menu from "@/SidebarMenuItems";
import { PublicClientApplication } from "@azure/msal-browser";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { AlertToast, canViewDetails, canViewIncidentDetails } from "./permissions";
import { Link } from "react-router-dom";
const msalConfig = {
    auth: {
        clientId: "05f70999-6ca7-4ee8-ac70-f2d136c50288",
        authority:
            "https://login.microsoftonline.com/647bf8f1-fc82-468e-b769-65fd9dacd442",
        redirectUri: window.Laravel.azureCallback,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true, // Set this to true if dealing with IE11 or issues with sessionStorage
    },
};
const pca = new PublicClientApplication(msalConfig);

export async function handleSessionExpiration() {
    const appUrl = window.Laravel.appUrl;

    // Ensure CSRF token is set in Axios for the logout request
    axios.defaults.headers.common["X-CSRF-TOKEN"] = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");
    axios;
    const credentials = {
        CurrentUser: {},
        URL: window.Laravel.gtamUrl,
        SessionDomain: window.Laravel.appDomain,
    };
    axios
        .post("/logoutWithoutReq", credentials)
        .then(async (response) => {
            if (response.status === 200) {
                const isMicrosoftLogin = Cookies.get("msal.isMicrosoftLogin");

                // Clear MSAL-related data from localStorage
                clearMSALLocalStorage();
                Cookies.remove("access_token");

                if (isMicrosoftLogin === "true") {
                    // Redirect to Microsoft logout URL
                    window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${appUrl}/login`;
                } else {
                    // Clear any session cookies related to CSRF or session before redirect
                    Cookies.remove("XSRF-TOKEN"); // If using js-cookie
                    Cookies.remove("gtls_session"); // Adjust according to your session cookie name
                    // Force a reload to ensure new CSRF token generation
                    window.location.href = `/login`;
                }
            } else {
                console.log("Logout error:", response);
            }
        })
        .catch((error) => {
            console.log(error);
            if (error.response && error.response.status === 401) {
                // Handle 401 error using SweetAlert
                swal({
                    title: "Session Expired!",
                    text: "Please login again to continue.",
                    icon: "warning",
                    button: "Ok",
                }).then(async function () {
                    window.location.href = `/login`;
                });
            }
        });
}

export function clearMSALLocalStorage() {
    const appDomain = window.Laravel.appDomain;

    // Find all keys in localStorage starting with 'msal' and remove them
    const msalKeys = Object.keys(localStorage).filter((key) =>
        key.startsWith("msal")
    );
    msalKeys.forEach((key) => {
        localStorage.removeItem(key);
    });

    // Remove the msal.isMicrosoftLogin cookie
    Cookies.set("msal.isMicrosoftLogin", "", {
        expires: -1,
        domain: appDomain,
    });
}
export function getMinMaxValue(data, fieldName, identifier) {
    // Check for null safety
    if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
    }

    // Filter out entries with empty or invalid dates
    const validData = data.filter(
        (item) => item[fieldName] && !isNaN(new Date(item[fieldName]))
    );

    // If no valid dates are found, return null
    if (validData.length === 0) {
        return null;
    }

    // Sort the valid data based on the fieldName
    const sortedData = [...validData].sort((a, b) => {
        return new Date(a[fieldName]) - new Date(b[fieldName]);
    });

    // Determine the result date based on the identifier
    let resultDate;
    if (identifier === 1) {
        resultDate = new Date(sortedData[0][fieldName]);
    } else if (identifier === 2) {
        resultDate = new Date(sortedData[sortedData.length - 1][fieldName]);
    } else {
        return null;
    }

    // Convert the resultDate to the desired format "01-10-2023"
    const day = String(resultDate.getDate()).padStart(2, "0");
    const month = String(resultDate.getMonth() + 1).padStart(2, "0"); // +1 because months are 0-indexed
    const year = resultDate.getFullYear();

    return `${day}-${month}-${year}`;
}

export const fetchApiData = async (
    url,
    setData,
    currentUser,
    AToken,
    setApiStatus
) => {
    try {
        const response = await axios.get(url, {
            headers: {
                UserId: currentUser.UserId,
                Authorization: `Bearer ${AToken}`,
            },
        });

        const parsedData = await new Promise((resolve) => {
            const dataString = JSON.stringify(response.data);
            const parsedData = JSON.parse(dataString);
            resolve(parsedData);
        });

        setData(parsedData || []);
        if (setApiStatus) setApiStatus(true);
    } catch (err) {
        if (err.response && err.response.status === 401) {
            swal({
                title: "Session Expired!",
                text: "Please login again",
                type: "success",
                icon: "info",
                confirmButtonText: "OK",
            }).then(async () => {
                await handleSessionExpiration();
            });
        } else {
            console.log(err);
        }
    }
};

/**
 * Function to make an API GET request.
 *
 * @param {string} url - The URL to make the GET request to.
 * @param {object} headers - Optional headers to include in the request.
 * @return {Promise} A Promise that resolves with the data from the response or handles errors.
 */
export function getApiRequest(url, headers = {}) {
    const Token = Cookies.get("access_token");
    const tokenHeaders = { ...headers, Authorization: `Bearer ${Token}` };
    return axios
        .get(url, {
            headers: tokenHeaders,
        })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            if (err.response && err.response.status === 401) {
                // Handle 401 error using SweetAlert
                swal({
                    title: "Session Expired!",
                    text: "Please login again",
                    icon: "info",
                    buttons: {
                        confirm: {
                            text: "OK",
                            value: true,
                            visible: true,
                            className: "",
                            closeModal: true,
                        },
                    },
                }).then(function () {
                    handleSessionExpiration();
                });
            } else {
                // Handle other errors
                AlertToast("Something went wrong", 2);
                console.log(err);
            }
        });
}

export const formatDateToExcel = (dateValue) => {
    const date = new Date(dateValue);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return ""; // Return empty string if invalid date
    }

    // Convert to Excel date serial number format
    return (
        (date.getTime() - date.getTimezoneOffset() * 60000) / 86400000 + 25569
    );
};

export function formatDateFromExcelWithNoTime(dateValue) {
    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
        return ""; // Return empty string if invalid date
    }

    const utcDate = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
    );
    return utcDate / 86400000 + 25569;
}

export function ProtectedRoute({ permission, route, element }) {
    const userHasPermission = checkUserPermission(permission, route);
    return userHasPermission ? element : <NoAccessRedirect />;
}

function checkUserPermission(permission, route) {
    if (typeof route == "string") {
        // Go over the flat permissions and check if the user has the required permission
        return permission?.Features?.some((feature) => {
            return feature.FunctionName == route;
        });
    } else if (typeof route == "object") {
        // Map over permissions and check if the user has the required permission
        return permission?.Features?.some((feature) => {
            return route?.includes(feature.FunctionName);
        });
    }
}

export function navigateToFirstAllowedPage({
    setSidebarElements,
    user,
    navigate,
  }) {
    let items = [];

    // Check if the current route exists
    const doesRouteExist = routes?.some((route) => route === window.location.pathname);

    // If the route does not exist, navigate to notFound page
    if (!doesRouteExist) {
      navigate("/notFound");
    } else {
      // Filter allowed menu items based on user features
      menu?.forEach((menuItem) => {
        if(menuItem.hasOwnProperty('options')){
            menuItem.options.forEach((option) => {
                if (user?.Features?.some((item) => item?.FunctionName === option?.feature)) {
                  const existingItem = items.find((item) => item.name === menuItem.name);
                  if (existingItem) {
                    existingItem.options.push({ ...option, current: false });
                  } else {
                    items.push({ ...menuItem, current: false, options: [{ ...option, current: false }] });
                  }
                }
              })
        }else{
            if(user?.Features?.some((item) => item?.FunctionName === menuItem?.feature)) {
                items.push({ ...menuItem, current: false });
            }
        }
      });

      // Find the current menu item for the active route
      const currentItem = items.find((item) => item.url === window.location.pathname);
      // Get the `current` item from localStorage, if it exists
      const savedCurrentId = localStorage.getItem("current");
      let firstItemToActivate;

      // Navigate to the current item
      if(savedCurrentId){
        firstItemToActivate = items.find((item) => item.id === savedCurrentId);
          if (firstItemToActivate) {
            firstItemToActivate.current = true;
            // Set the other items' `current` to false
            items.forEach((item) => {
                if (item.url !== window.location.pathname) {
                  item.current = false;
                }
              });
            navigate(firstItemToActivate.url);
          }
      }
      else if (currentItem) {
        // Mark the current item as active
        currentItem.current = true;

        // Set the other items' `current` to false
        items.forEach((item) => {
          if (item.url !== window.location.pathname) {
            item.current = false;
          }
        });

        // Navigate to the first item
        navigate(currentItem.url);
      } else if (items.length > 0) {
          items[0].current = true;
          navigate(items[0].url);
          window.location.pathname = items[0].url;
      }

      // Set the sidebar elements
      setSidebarElements(items);
    }
  }

function findItemByURL(items, url) {
    for (const item of items) {
      if (item.url === url) {
        return item;
      }
      if (item.options) {
        const option = findItemByURL(item.options, url);
        if (option) {
          return option;
        }
      }
    }
    return null;
  }

export function renderConsDetailsLink(userPermission, text, value) {
    if (canViewDetails(userPermission)) {
        return (
            <Link
                to={`/gtrs/consignment-details`}
                state={{ activeCons: value }}
                className="underline text-blue-500 hover:cursor-pointer"
            >
                {text}
            </Link>
        );
    } else {
        return <span className=""> {text}</span>;
    }
}

export function renderIncidentDetailsLink(userPermission, text, value) {
    if (canViewIncidentDetails(userPermission)) {
        return (
            <Link
                to={`/gtrs/incident`}
                state={{ incidentId: value }}
                className="underline text-blue-500 hover:cursor-pointer"
            >
                {text}
            </Link>
        );
    } else {
        return <span className="">{text}</span>;
    }
}

/**
 * Format the value as a comma-separated string with decimal places.
 *
 * @param {number} value - The value to be formatted.
 * @return {string} - The formatted value.
 */
export const formatNumberWithCommas = (value) => {
    if (value % 1 === 0) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        const roundedValue = parseFloat(value).toFixed(2);
        const parts = roundedValue.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
};
