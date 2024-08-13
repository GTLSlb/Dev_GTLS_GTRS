import React from "react";
import { useState } from "react";
import Select from "react-select";
import BarGraph from "../graphs/BarGraph";

function ConsignmentGraph() {
    const customers = [
        {
            value: "Unilever/ Metcash 12 Monthly Consignment",
            label: "Unilever/ Metcash 12 Monthly Consignment",
        },
        {
            value: "Unilever Monthly Consignment",
            label: "Unilever Monthly Consignment",
        },
        {
            value: "Unilever/ Woolworth 12 Monthly Consignment",
            label: "Unilever/ Woolworth 12 Monthly Consignment",
        },
    ];

    const customStyles = {
        control: (provided) => ({
            ...provided,
            minHeight: "unset",
            height: "auto",
            // Add more styles here as needed
        }),
        option: (provided, state) => ({
            ...provided,
            color: "black",
            // Add more styles here as needed
        }),
        multiValue: (provided) => ({
            ...provided,
            width: "30%",
            overflow: "hidden",
            height: "20px",
        }),
        valueContainer: (provided) => ({
            ...provided,
            width: "400px",
            maxHeight: "37px", // Set the maximum height for the value container
            overflow: "auto", // Enable scrolling if the content exceeds the maximum height
            // fontSize: '10px',
        }),
        inputContainer: (provided) => ({
            ...provided,
            height: "100px",
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            whiteSpace: "nowrap", // Prevent text wrapping
            overflow: "hidden",
            textOverflow: "ellipsis", // Display ellipsis when text overflows
            fontSize: "10px",
            // Add more styles here as needed
        }),
        // Add more style functions here as needed
    };

    const [selectedReceiver, setselectedReceiver] = useState(customers[0]);

    const handleReceiverSelectChange = (selectedOptions) => {
        setselectedReceiver(selectedOptions);
    };

    const colTotal = [53, 72, 57, 55, 73, 96, 46, 78, 53, 72, 72, 66, 66, 79];
    const colLabel = [
        "APR 2023",
        "MAY 2023",
        "JUN 2023",
        "JUL 2023",
        "AUG 2023",
        "SEPT 2023",
        "OCT 2023",
        "NOV 2023",
        "DEC 2023",
        "JAN 2024",
        "FEB 2024",
        "MAR 2024",
        "APR 2024",
        "MAY 2024",
    ];
    const colOnTime = [
        100.0, 100.0, 100.0, 98.18, 98.63, 100.0, 91.3, 97.44, 98.11, 98.61,
        97.22, 96.97, 98.48, 98.73,
    ];
    const colKPI = [
        98.0, 98.0, 98.0, 98.0, 98.0, 98.0, 98.0, 98.0, 98.0, 98.0, 98.0, 98.0,
        98.0, 98.0,
    ];
    const colPOD = [
        92.45, 100.0, 100.0, 78.18, 100.0, 100.0, 100.0, 100.0, 92.45, 100.0,
        100.0, 98.48, 100.0, 97.47,
    ];

    return (
        <div>
            <div className="inline-block">
                <div className=" flex items-center">
                    <div className=" mt-5 w-full ">
                        <Select
                            styles={customStyles}
                            name="colors"
                            value={selectedReceiver}
                            options={customers}
                            onChange={handleReceiverSelectChange}
                            className="basic-multi-select text-red "
                            classNamePrefix="select"
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white p-4 mt-5 border shadow-lg rounded-lg">
                <BarGraph
                    colLabel={colLabel}
                    dataTotal={colTotal}
                    dataKPI={colKPI}
                    dataOnTime={colOnTime}
                    dataPOD={colPOD}
                />
            </div>
        </div>
    );
}

export default ConsignmentGraph;
