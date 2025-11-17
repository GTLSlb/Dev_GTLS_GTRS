import { ProtectedRoute } from "@/CommonFunctions";
import { Routes, Route } from "react-router-dom";
import menu from "@/data/SidebarMenuItems";
import NotFoundRedirect from "@/Pages/NotFoundRedirect";

//Create an array of all routes from the menu items
const allRoutes = [
    ...menu.flatMap((item) =>{
        if (item.options) {
            return item.options.map((option) => ({
                url: option.url.replace(/^\/gtrs/, ''),
                feature: option.feature,
            }));
        } else {
            return {
                url: item.url.replace(/^\/gtrs/, ''),
                feature: item.feature,
            };
        }
    }),
    {
        url: "/customer-profile",
        feature: "Settings_View",
    },
    {
        url: "/customer-settings",
        feature: "Settings_View",
    },
    // {
    //      url: "/consignment-map",
    //     feature: "ConsignmentMap_View",
    // },
    {
        url: "/incident",
        feature: "IncidentDetails_View",
    },
    {
        url: "/add-transit",
        feature: "TransitDays_add",
    },
    {
        url: "/consignment-details",
        feature: "ConsignmentsDetails_view",
    },
]

//Function that will render all of routes
export const getRoute = (userPermissions, setUserPermissions, setToken, childComponents) => {
    return (
        <Routes>
            {allRoutes?.map((item) => (
                <Route
                    key={item.url}
                    path={item.url}
                    element={
                        <ProtectedRoute
                            permission={userPermissions}
                            route={item.feature}
                            element={childComponents[item.url]}
                            userPermissions={userPermissions}
                            setToken={setToken}
                            setUserPermissions={setUserPermissions}
                        />
                    }
                />
            ))}
            <Route
                path="*"
                element={<NotFoundRedirect />}
            />
        </Routes>
    );
};
