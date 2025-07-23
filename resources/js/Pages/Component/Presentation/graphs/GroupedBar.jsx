import React from "react";
import { Bar } from "react-chartjs-2";
import PropTypes from "prop-types";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

const plugin = {
    id: "increase-legend-spacing",
    beforeInit(chart) {
        // Get reference to the original fit function
        const originalFit = chart.legend.fit;

        // Override the fit function
        chart.legend.fit = function fit() {
            // Call original function and bind scope in order to use `this` correctly inside it
            originalFit.bind(chart.legend)();
            // Change the height as suggested in another answers
            this.height += 20;
        };
    },
};

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    plugin
);

const GroupedBar = ({
    collabel,
    firstLabel,
    secondLabel,
    thirdLabel,
    firstData,
    secondData,
    thirdData,
    title,
}) => {
    const data = {
        labels:  collabel,
        datasets: [
            {
                label: firstLabel,
                data: firstData,
                backgroundColor: "rgba(219, 198, 119)",
            },
            {
                label: secondLabel,
                data: secondData,
                backgroundColor: "rgba(0, 0, 0)",
            },
            {
                label: thirdLabel,
                data: thirdData,
                backgroundColor: "rgba(171, 171, 171)",
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                mode: "index",
                intersect: false,
            },
            title: {
                display: true,
                text: title,
            },
        },
        responsive: true,
        aspectRatio: 2.5,
        scales: {
            x: {
                stacked: false,
            },
            y: {
                stacked: false,
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <Bar data={data} options={options} />
        </div>
    );
};

GroupedBar.propTypes = {
    collabel: PropTypes.arrayOf(PropTypes.string).isRequired,
    firstLabel: PropTypes.string.isRequired,
    secondLabel: PropTypes.string.isRequired,
    thirdLabel: PropTypes.string.isRequired,
    firstData: PropTypes.arrayOf(PropTypes.number).isRequired,
    secondData: PropTypes.arrayOf(PropTypes.number).isRequired,
    thirdData: PropTypes.arrayOf(PropTypes.number).isRequired,
    title: PropTypes.string.isRequired,
};

export default GroupedBar;
