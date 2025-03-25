import { Tabs, Tab } from "@nextui-org/react";
import DifotStats from "./Comp/DifotStats";
import FirstSection from "./Comp/firstSection";
import SecondSection from "./Comp/SecondSection";

export default function DifotDashboard() {
    return (
        <div className="py-2">
            {/* Charts Section */}
            <Tabs aria-label="Options">
                <Tab key="first" title="First">
                    <FirstSection />
                </Tab>

                <Tab key="second" title="Second">
                    <SecondSection />
                </Tab>
            </Tabs>
        </div>
    );
}
