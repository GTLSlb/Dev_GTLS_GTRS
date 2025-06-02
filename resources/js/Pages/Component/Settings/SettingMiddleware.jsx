import AnimatedLoading from "@/Components/AnimatedLoading";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SettingMiddleware({ currentUser }) {
console.log("SettingMiddleware", currentUser);
let navigate = useNavigate();
    useEffect(() => {
        if (currentUser && currentUser.TypeId === 1) {
          navigate("/gtrs/customer-profile");
        } else {
           navigate("/gtrs/customer-settings");
        }
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <AnimatedLoading />
        </div>
    );
}