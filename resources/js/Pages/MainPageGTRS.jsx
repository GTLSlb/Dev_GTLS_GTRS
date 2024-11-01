import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import menu from "@/SidebarMenuItems";

export default function MainPageGTRS({sidebarElements, user, currentUser, AToken, setSidebarElements}) {
    const navigate = useNavigate();
    const [firstElement, setFirstElement] = useState();
    const navigateToFirstAllowedPage = () =>{
        let items = [];
        menu?.map((menuItem) => {
            if(user?.Features?.find((item) => item?.FunctionName == menuItem?.feature)){
                items.push({...menuItem, current : false })
            }
        })
        if (items.length > 0) {
            localStorage.getItem("current") ? items.find((item) => item.id == localStorage.getItem("current")).current = true : items[0].current = true;
            items.find((item) => item.id == localStorage.getItem("current")) ? navigate(items.find((item) => item.id == localStorage.getItem("current")).url) : navigate(items[0].url);
        }
         setSidebarElements(items);
    }

    useEffect(() => {
        navigateToFirstAllowedPage();
    },[])


    return(
        <div className="h-screen w-screen flex justify-center">
        </div>
    )
}
