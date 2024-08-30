import React from "react";
import GroupedBar from "../graphs/GroupedBar";

function TotalFailPODGraph() {
    return (
        <div className="grid grid-cols-2 gap-5 mt-5">
            <div className="bg-white p-4 border shadow-lg rounded-lg">
                <GroupedBar
                    collabel={[
                        "August Woolworth",
                        "August Metcash",
                        "August All Lanes",
                    ]}
                    firstLabel="Total Food"
                    firstData={[39, 62, 555]}
                    secondLabel="Total Food Fail"
                    secondData={[0, 5, 38]}
                    thirdLabel="Food NO POD"
                    thirdData={[1, 1, 9]}
                    title="Food - 2022 Aug"
                />
            </div>
            <div className="bg-white p-4 border shadow-lg rounded-lg">
                <GroupedBar
                    collabel={[
                        "August Woolworth",
                        "August Metcash",
                        "August All Lanes",
                    ]}
                    firstLabel="Total HPC"
                    firstData={[181, 71, 1039]}
                    secondLabel="Total HPC Fail"
                    secondData={[2, 0, 9]}
                    thirdLabel="HPC NO POD"
                    thirdData={[1, 0, 17]}
                    title="HPC - 2022 Aug"
                />
            </div>
            <div className="bg-white p-4 border shadow-lg rounded-lg">
                <GroupedBar
                    collabel={[
                        "August Woolworth",
                        "August Metcash",
                        "August All Lanes",
                    ]}
                    firstLabel="Total"
                    firstData={[220, 133, 1597]}
                    secondLabel="Total Fail"
                    secondData={[2, 5, 47]}
                    thirdLabel="Total NO POD"
                    thirdData={[2, 1, 26]}
                    title="Total - 2022 Aug"
                />
            </div>
        </div>
    );
}

export default TotalFailPODGraph;
