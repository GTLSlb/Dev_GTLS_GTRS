import React from "react";
import { Navigate } from 'react-router-dom';

export default function NotFoundRedirect() {

    return (
        <div className="h-screen w-screen flex justify-center">
            <Navigate to="/no-access" />
        </div>
    );
}
