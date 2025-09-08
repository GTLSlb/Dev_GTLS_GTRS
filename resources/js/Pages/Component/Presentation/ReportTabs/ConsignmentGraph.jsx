import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import BarGraph from "../graphs/BarGraph";
import axios from "axios";
import PropTypes from "prop-types";
import { CustomContext } from "@/CommonContext";
import AnimatedLoading from "@/Components/AnimatedLoading";

function ConsignmentGraph({ customers, CustomerId }) {
    const { Token, user, userPermissions, url } = useContext(CustomContext);
    const [graphData, setGraphData] = useState();
    const [originalgraphData, setGraphOriginalData] = useState();
    const [loading, setLoading] = useState(true);
    const [selectedReceiver, setselectedReceiver] = useState(customers[0]);

    function addCalculatedFields(data) {
        data.forEach((item) => {
            if (item.Record && item.Record.length > 0) {
                item.Record.forEach((record) => {
                    if (
                        record.TotalCons != null &&
                        record.TotalCons !== "" &&
                        !Number.isNaN(record.TotalCons) &&
                        record.TotalCons > 0
                    ) {
                        if (
                            record.TotalFails != null &&
                            record.TotalFails !== "" &&
                            !Number.isNaN(record.TotalFails)
                        ) {
                            record.onTimePercentage = (
                                ((record.TotalCons - record.TotalFails) /
                                    record.TotalCons) *
                                100
                            ).toFixed(2);
                        } else {
                            record.onTimePercentage = null;
                        }

                        if (
                            record.TotalNoPod != null &&
                            record.TotalNoPod !== "" &&
                            !Number.isNaN(record.TotalNoPod)
                        ) {
                            record.PODPercentage = (
                                ((record.TotalCons - record.TotalNoPod) /
                                    record.TotalCons) *
                                100
                            ).toFixed(2);
                        } else {
                            record.PODPercentage = null;
                        }
                    } else {
                        record.onTimePercentage = null;
                        record.PODPercentage = null;
                    }
                });
            }
        });
        return data;
    }

    function getReportData() {
        setLoading(true);
        axios
            .get(`${url}KpiPackRecord`, {
                headers: {
                    UserId: user.UserId,
                    CustomerId: CustomerId,
                    CustomerTypeId: selectedReceiver.value,
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then((res) => {
                setLoading(false);
                addCalculatedFields(res.data);
                setGraphOriginalData(res.data);
                setGraphData(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    useEffect(() => {
        getReportData();
    }, [selectedReceiver]);

    const customStyles = {
        control: (provided) => ({
            ...provided,
            minHeight: "unset",
            height: "auto",
        }),
        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? "black" : "black",
            backgroundColor: state.isSelected
                ? "#F3F3F3"
                : provided.backgroundColor,
        }),
        multiValue: (provided) => ({
            ...provided,
            width: "30%",
            overflow: "hidden",
            height: "20px",
            display: "flex",
        }),
        valueContainer: (provided) => ({
            ...provided,
            width: "400px",
            maxHeight: "37px",
            overflowY: "auto",
        }),
        input: (provided) => ({
            ...provided,
            margin: 0,
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "10px",
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            height: "auto",
        }),
    };

    const handleReceiverSelectChange = (selectedOptions) => {
        setselectedReceiver(selectedOptions);
    };

    return loading ? (
        <AnimatedLoading />
    ) : (
        <div>
            <div className="inline-block">
                <div className=" flex items-center">
                    <div className=" mt-5 w-full ">
                        {/* Select Filter */}
                        <Select
                            styles={customStyles}
                            name="colors"
                            value={selectedReceiver}
                            options={customers}
                            onChange={handleReceiverSelectChange}
                            className="basic-multi-select "
                            classNamePrefix="select"
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white p-4 mt-5 border shadow-lg rounded-lg">
                {/* The Graph and the table */}
                <BarGraph
                    graphData={graphData}
                    url={url}
                    CustomerId={CustomerId}
                    Token={Token}
                    userPermissions={userPermissions}
                    selectedReceiver={selectedReceiver}
                    originalgraphData={originalgraphData}
                    getReportData={getReportData}
                    setGraphData={setGraphData}
                />
            </div>
        </div>
    );
}

ConsignmentGraph.propTypes = {
    customers: PropTypes.array,
    CustomerId: PropTypes.number,
};

export default ConsignmentGraph;
