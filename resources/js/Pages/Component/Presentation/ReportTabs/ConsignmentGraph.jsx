import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import BarGraph from "../graphs/BarGraph";
import axios from "axios";
import PropTypes from "prop-types";

function ConsignmentGraph({ url, currentUser, Token, customers, CustomerId }) {
    const [graphData, setGraphData] = useState();
    const [originalgraphData, setGraphOriginalData] = useState();
    const [loading, setLoading] = useState(true);
    const [selectedReceiver, setselectedReceiver] = useState(customers[0]);

    function getReportData() {
        setLoading(true);
        axios
            .get(`${url}KpiPackRecord`, {
                headers: {
                    UserId: currentUser.UserId,
                    CustomerId: CustomerId,
                    CustomerTypeId: selectedReceiver.value,
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then((res) => {
                setLoading(false);

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
            minHeight: "unset", // Remove default minimum height
            height: "auto", // Set control height to auto
            // Add other control-related styles as needed
        }),
        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? "black" : "black", // Change color based on selection
            backgroundColor: state.isSelected
                ? "#F3F3F3"
                : provided.backgroundColor, // Customize selected option background
            // Add more styles for options as needed
        }),
        multiValue: (provided) => ({
            ...provided,
            width: "30%", // Set multi-value width
            overflow: "hidden", // Ensure content does not overflow
            height: "20px", // Set height of multi-value tags
            display: "flex", // Align items horizontally
            // Add more multi-value styles as needed
        }),
        valueContainer: (provided) => ({
            ...provided,
            width: "400px", // Set fixed width for the value container
            maxHeight: "37px", // Restrict max height of value container
            overflowY: "auto", // Enable vertical scrolling for overflow
            // Add more styles for the value container as needed
        }),
        input: (provided) => ({
            ...provided,
            margin: 0, // Remove default margin for input
            // Add more styles for input if necessary
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            whiteSpace: "nowrap", // Prevent text from wrapping
            overflow: "hidden", // Hide overflow content
            textOverflow: "ellipsis", // Show ellipsis for overflow text
            fontSize: "10px", // Set font size for multi-value labels
            // Add more styles for multi-value labels as needed
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            height: "auto", // Set height to auto
            // Add more styles for indicators container if necessary
        }),
        // Add or adjust other style functions as needed
    };

    const handleReceiverSelectChange = (selectedOptions) => {
        setselectedReceiver(selectedOptions);
    };


    return loading ? (
        <div className="md:pl-20 pt-16 h-full flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
                <div
                    className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce`}
                ></div>
                <div
                    className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce200`}
                ></div>
                <div
                    className={`h-5 w-5 bg-goldd rounded-full animate-bounce400`}
                ></div>
            </div>
            <div className="text-dark mt-4 font-bold">
                Please wait while we get the data for you.
            </div>
        </div>
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
                    currentUser={currentUser}
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
    url: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired,
    AToken: PropTypes.string.isRequired,
    customers: PropTypes.array.isRequired,
    CustomerId: PropTypes.number.isRequired,
};

export default ConsignmentGraph;
