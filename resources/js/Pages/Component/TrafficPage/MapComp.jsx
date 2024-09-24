import ConsMap from "./ConsMap";

export default function MapComp({consignmentToTrack,setActiveIndexGTRS}) {
    return (
        <div>
            <ConsMap
                consignment={consignmentToTrack}
                setActiveIndexGTRS={setActiveIndexGTRS}
            />
        </div>
    );
}
