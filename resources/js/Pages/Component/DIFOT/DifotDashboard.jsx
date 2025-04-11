import { Tabs, Tab } from "@nextui-org/react";
import DifotStats from "./Comp/DifotStats";
import FinancialDashboard from "./Comp/FinancialDashboard";
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
                <Tab key="financial" title="Financial">
                    <FinancialDashboard />
                </Tab>
            </Tabs>
        </div>
    );
}
