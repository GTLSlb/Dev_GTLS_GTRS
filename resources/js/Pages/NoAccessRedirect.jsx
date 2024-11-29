import React, { useState, useEffect } from "react";
import { useNavigation } from "react-router-dom";
import { Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

export default function NotFoundRedirect() {

    return (
        <div className="h-screen w-screen flex justify-center">
            <Navigate to="/no-access" />
        </div>
    );
}
