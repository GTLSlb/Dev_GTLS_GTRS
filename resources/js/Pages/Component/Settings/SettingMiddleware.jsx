import AnimatedLoading from "@/Components/AnimatedLoading";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CustomContext } from "@/CommonContext";

export default function SettingMiddleware() {
    const { user } = useContext(CustomContext);
let navigate = useNavigate();
    useEffect(() => {
        if (user && user.TypeId === 1) {
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
