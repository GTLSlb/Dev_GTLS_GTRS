import { useContext, useState } from "react";
import React from "react";
import PropTypes from "prop-types";
import { useEffect } from "react";
import swal from "sweetalert";
import axios from "axios";
import { handleSessionExpiration } from '@/CommonFunctions';
import GtrsButton from "../../GtrsButton";
import { AlertToast } from "@/permissions";
import { CustomContext } from "@/CommonContext";


export default function AddKPIReason({
    selectedReason,
    setSelectedReason,
    setShowAdd,
    fetchData,
    closeModal
}) {
    const { Token, user, currentUser, url } = useContext(CustomContext);
    const [isChecked, setIsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [object, setObject] = useState();

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    useEffect(() => {
        if (selectedReason) {
            setObject(selectedReason);
        }
    }, [selectedReason]);

    useEffect(() => {
        if (selectedReason) {
            setIsChecked(selectedReason.ReasonStatus == 1 ? true : false);
        }
    }, []);

    function AddReason(e) {
        e.preventDefault();
        setIsLoading(true);
        const inputValues = {
            ReasonId: object ? object.ReasonId : null,
            ReasonName: document.getElementById("ReasonName").value,
            ReasonStatus: isChecked ? 1 : 2,
        };
        axios
            .post(`${url}Add/KpiReason`, inputValues, {
                headers: {
                    UserId: user.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then(() => {
                setSelectedReason(null);
                fetchData();
                setShowAdd(false);
                setIsLoading(false);
                AlertToast("Saved successfully", 1);
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    // Handle 401 error using SweetAlert
                    swal({
                      title: 'Session Expired!',
                      text: "Please login again",
                      type: 'success',
                      icon: "info",
                      confirmButtonText: 'OK'
                    }).then(async function () {
                        await handleSessionExpiration();
                    });
                  } else {
                    // Handle other errors
                    console.error(err);
                    setIsLoading(false);
                    AlertToast("Something went wrong", 2);
                  }
            });
    }

    return (
        <div className="shadow bg-white p-6 rounded-lg mt-2">
            <form onSubmit={AddReason}>
                <p className="font-bold text-lg">{object ? "Edit " : "Add "} KPI Reason</p>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-5 gap-y-5 items-center py-4">
                    <div className="col-span-2 flex items-center gap-x-2">
                        <label htmlFor="name" className="block w-32 ">
                            Reason Name:{" "}
                        </label>
                        <input
                            type="text"
                            required
                            name="name"
                            id="ReasonName"
                            defaultValue={object ? object.ReasonName : ""}
                            className="rounded w-96 bg-gray-50 border border-gray-300 h-7"
                        />
                    </div>
                    <div className=" flex items-center gap-x-2">
                        <label htmlFor="name" className="block  ">
                            Status:{" "}
                        </label>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                            id="ReasonStatus"
                            className="rounded text-green-500 focus:ring-green-300"
                        />
                    </div>
                </div>
                <div className="flex w-full gap-x-3 justify-end">
                    <GtrsButton
                        disabled={isLoading}
                        name={"Cancel"}
                        className="w-[5.5rem] h-[36px]"
                        type={"button"}
                        onClick={closeModal}
                    />
                    <GtrsButton
                        disabled={isLoading}
                        name={object ? "Edit" : "Add"}
                        className="w-[5.5rem] h-[36px]"
                        type={"submit"}
                    />
                </div>
            </form>
        </div>
    );
}

AddKPIReason.propTypes = {
    selectedReason: PropTypes.object,
    url: PropTypes.string,
    currentUser: PropTypes.object,
    Token: PropTypes.string,
    setSelectedReason: PropTypes.func,
    setShowAdd: PropTypes.func,
    fetchData: PropTypes.func,
    closeModal: PropTypes.func,
};