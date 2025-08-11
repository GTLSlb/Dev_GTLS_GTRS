import AnimatedLoading from "@/Components/AnimatedLoading";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function SettingMiddleware({ currentUser }) {
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

SettingMiddleware.propTypes = {
    currentUser: PropTypes.object,
};