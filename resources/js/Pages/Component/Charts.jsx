import GtamUsers from "./GTAM/gtam-employees";
import GtamProfile from "./GTAM/gtam-Profile";
import MainCharts from "./Dashboard_Comp/MainCharts";
import React, { useState } from "react";
import ChartsSidebar from "./Dashboard_Comp/ChartsSidebar";
import GtrsCons from "./GtrsCons";
import KPI from "./KPI";
import ConsignmentD from "../Consignment";
import ConsPerf from "./ConsPerf";
import FailedCons from "./FailedCons";
import NoDelivery from "./Dashboard_Comp/NoDelivery";
import AdditionalCharges from "./Dashboard_Comp/AdditionalCharges";
import DriverLogin from "./Dashboard_Comp/DriverLogin";
import SafetyRep from "./safetyRep";
import RDDMain from "./RDDMain";
import FailedConsMain from "./FailedConsMain";
import MissingPOD from "./MissingPOD";
import { useEffect } from "react";
import TransitDays from "./KPI/TransitDays";
import Holidays from "./KPI/Holidays";
import KPIReasons from "./KPI/KPIReasons";
import AddTransit from "./KPI/AddTransit";

export default function charts({
    setPerfData,
    userBody,
    sessionData,
    safetyData,
    debtorsData,
    dashData,
    setActiveIndexGTRS,
    setactiveCon,
    consData,
    activeIndexGTRS,
    currentUser,
    activeCon,
    PerfData,
    IDfilter,
    rddReasons,
    setrddReasons,
    url,
    chartsData,
    kpireasonsData,
    setkpireasonsData,
}) {
    const current = new Date();
    const month = current.getMonth() + 1;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const todate = `${current.getFullYear()}-${formattedMonth}-${current.getDate()}`;
    const [KPIData, setKPIData] = useState();
    const [transitDays, setTransitDays] = useState();
    const [holidays, setHolidays] = useState();
    const [failedReasons, setFailedReasons] = useState();
    const [rddData, setrddData] = useState();
    const [NoDelData, setNoDelData] = useState();
    const [safetyDataState, setsafetyDataState] = useState([]);
    const [AdditionalData, setAdditionalData] = useState();
    const [DriverData, setDriverData] = useState();
    const [safetyTypes, setSafetyTypes] = useState([]);
    const [safetyCauses, setSafetyCauses] = useState([]);
    const [SDate, setSDate] = useState(getOldestDespatchDate(consData));
    const [EDate, setEDate] = useState(getLatestDespatchDate(consData));
    const oldestDate = getOldestDespatchDate(consData);
    const latestDate = getLatestDespatchDate(consData);
    const [dataFromChild, setDataFromChild] = useState(null);
    const [transitDay, setTransitDay] = useState(null);

    function getOldestDespatchDate(data) {
        // Filter out elements with invalid 'CreatedDate' values
        const validData = data.filter((item) => isValidDate(item.DespatchDate));

        // Sort the validData array based on the 'CreatedDate' property
        const sortedData = validData.sort(
            (a, b) => new Date(a.DespatchDate) - new Date(b.DespatchDate)
        );

        // Check if the sortedData array is empty
        if (sortedData.length === 0) {
            return null; // No valid dates found
        }

        // Extract only the date part from the 'CreatedDate' of the first element (oldest date)
        const oldestDate = new Date(
            sortedData[0]?.DespatchDate
        ).toLocaleDateString("en-CA");
        // Return the oldest date in the 'YYYY-MM-DD' format
        return oldestDate;
    }
    function isValidDate(dateString) {
        const date = new Date(dateString);
        return !isNaN(date);
    }
    function getLatestDespatchDate(data) {
        const validData = data.filter((item) => isValidDate(item.DespatchDate));

        // Sort the data array based on the 'DespatchDate' property in descending order
        const sortedData = validData.sort(
            (a, b) => new Date(b.DespatchDate) - new Date(a.DespatchDate)
        );
        if (sortedData.length === 0) {
            return null; // No valid dates found
        }
        const latestDate = new Date(
            sortedData[0]?.DespatchDate
        ).toLocaleDateString("en-CA");

        // Return the 'DespatchDate' of the first element (latest date)
        return latestDate;
    }
    const handleDataFromChild = (data) => {
        setDataFromChild(data);
    };
    const [lastIndex, setLastIndex] = useState(0);
    const components = [
        <MainCharts
            chartsData={chartsData}
            safetyData={safetyData}
            accData={dataFromChild}
            dashData={dashData}
            currentUser={currentUser}
            IDfilter={IDfilter}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
        />,
        <GtrsCons
            oldestDate={oldestDate}
            latestDate={latestDate}
            accData={dataFromChild}
            setActiveIndexGTRS={setActiveIndexGTRS}
            setactiveCon={setactiveCon}
            consData={consData}
            setLastIndex={setLastIndex}
            IDfilter={IDfilter}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
        />,
        <KPI
            kpireasonsData={kpireasonsData}
            oldestDate={oldestDate}
            latestDate={latestDate}
            KPIData={KPIData}
            setKPIData={setKPIData}
            currentUser={currentUser}
            userBody={userBody}
            accData={dataFromChild}
            setActiveIndexGTRS={setActiveIndexGTRS}
            url={url}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            IDfilter={IDfilter}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
        />,
        <ConsignmentD
            url={url}
            accData={dataFromChild}
            setActiveIndexGTRS={setActiveIndexGTRS}
            activeCon={activeCon}
            lastIndex={lastIndex}
            currentUser={currentUser}
        />,
        <ConsPerf
            oldestDate={oldestDate}
            latestDate={latestDate}
            currentUser={currentUser}
            accData={dataFromChild}
            setActiveIndexGTRS={setActiveIndexGTRS}
            PerfData={PerfData}
            setLastIndex={setLastIndex}
            IDfilter={IDfilter}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
        />,
        <FailedConsMain
            oldestDate={oldestDate}
            latestDate={latestDate}
            url={url}
            failedReasons={failedReasons}
            currentUser={currentUser}
            accData={dataFromChild}
            setActiveIndexGTRS={setActiveIndexGTRS}
            PerfData={PerfData}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            IDfilter={IDfilter}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
            setPerfData={setPerfData}
            setFailedReasons={setFailedReasons}
        />,
        <NoDelivery
            oldestDate={oldestDate}
            latestDate={latestDate}
            url={url}
            currentUser={currentUser}
            setActiveIndexGTRS={setActiveIndexGTRS}
            NoDelData={NoDelData}
            setNoDelData={setNoDelData}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
            accData={dataFromChild}
        />,
        <AdditionalCharges
            oldestDate={oldestDate}
            latestDate={latestDate}
            url={url}
            currentUser={currentUser}
            setActiveIndexGTRS={setActiveIndexGTRS}
            AdditionalData={AdditionalData}
            setAdditionalData={setAdditionalData}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
        />,
        <DriverLogin
            url={url}
            currentUser={currentUser}
            DriverData={DriverData}
            setDriverData={setDriverData}
            setActiveIndexGTRS={setActiveIndexGTRS}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
        />,
        <RDDMain
            oldestDate={oldestDate}
            latestDate={latestDate}
            currentUser={currentUser}
            userBody={userBody}
            url={url}
            accData={dataFromChild}
            rddData={rddData}
            setrddData={setrddData}
            debtorsData={debtorsData}
            setActiveIndexGTRS={setActiveIndexGTRS}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            IDfilter={IDfilter}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
            rddReasons={rddReasons}
            setrddReasons={setrddReasons}
        />,
        <SafetyRep
            oldestDate={oldestDate}
            latestDate={latestDate}
            url={url}
            setSafetyTypes={setSafetyTypes}
            safetyTypes={safetyTypes}
            safetyCauses={safetyCauses}
            setSafetyCauses={setSafetyCauses}
            failedReasons={failedReasons}
            currentUser={currentUser}
            safetyData={safetyData}
            accData={dataFromChild}
            setActiveIndexGTRS={setActiveIndexGTRS}
            PerfData={PerfData}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            IDfilter={IDfilter}
            DefaultEDate={EDate}
            setEDate={setEDate}
            DefaultSDate={SDate}
            safetyDataState={safetyDataState}
            setsafetyDataState={setsafetyDataState}
            setSDate={setSDate}
        />,
        <MissingPOD
            oldestDate={oldestDate}
            latestDate={latestDate}
            url={url}
            failedReasons={failedReasons}
            currentUser={currentUser}
            accData={dataFromChild}
            setActiveIndexGTRS={setActiveIndexGTRS}
            PerfData={PerfData}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            IDfilter={IDfilter}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
            setPerfData={setPerfData}
            setFailedReasons={setFailedReasons}
        />,
        <TransitDays
            setTransitDay={setTransitDay}
            transitDays={transitDays}
            currentUser={currentUser}
            setActiveIndexGTRS={setActiveIndexGTRS}
            setTransitDays={setTransitDays}
            url={url}
        />,
        <Holidays
            holidays={holidays}
            currentUser={currentUser}
            setHolidays={setHolidays}
            url={url}
        />,
        <KPIReasons
            url={url}
            currentUser={currentUser}
            kpireasonsData={kpireasonsData}
            setkpireasonsData={setkpireasonsData}
        />,
        <AddTransit
            url={url}
            currentUser={currentUser}
            setTransitDay={setTransitDay}
            setTransitDays={setTransitDays}
            setActiveIndexGTRS={setActiveIndexGTRS}
            transitDay={transitDay}
        />,
    ];
    return (
        <div className="">
            {/* <Sidebar /> */}
            <div className=" h-full flex ">
                {/* Left sidebar & main wrapper */}
                <div className="min-w-0 flex-1 bg-gray-100 xl:flex">
                    <div className=" xl:w-64 flex-shrink-0 w-full h-auto  md:block mb-4">
                        <div className="h-full  ">
                            {/* Start left column area */}
                            <div
                                className="relative h-full"
                                style={{ minHeight: "6rem" }}
                            >
                                <div className=" inset-0 rounded-lg border-dashed border-gray-200">
                                    <ChartsSidebar
                                        activeIndexGTRS={activeIndexGTRS}
                                        sessionData={sessionData}
                                        onData={handleDataFromChild}
                                        setActiveIndexGTRS={setActiveIndexGTRS}
                                        currentUser={currentUser}
                                    />
                                </div>
                            </div>
                            {/* End left column area */}
                        </div>
                    </div>

                    <div className="bg-smooth lg:min-w-0 lg:flex-1">
                        <div className="h-full">
                            {/* Start main area*/}
                            <div
                                className="relative h-full"
                                style={{ minHeight: "36rem" }}
                            >
                                <div className="absolute inset-0 rounded-lg">
                                    {components[activeIndexGTRS]}
                                </div>
                            </div>
                            {/* End main area */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
