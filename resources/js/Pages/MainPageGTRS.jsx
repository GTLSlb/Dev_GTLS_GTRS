import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {navigateToFirstAllowedPage} from "@/CommonFunctions";

export default function MainPageGTRS({sidebarElements, user, currentUser, AToken, setSidebarElements}) {
    const navigate = useNavigate();
    useEffect(() => {
        if(user){
           navigateToFirstAllowedPage({setSidebarElements, user, navigate})
        }
    },[user])


    return(
        <div className="h-screen w-screen flex justify-center">
        </div>
    )
}
