import { Select, SelectItem } from "@heroui/react";
import {
    months,
    periodOptions,
    quarters,
} from "../../assets/js/useDurationData";

export function DurationFilter({
    selectedPeriodKey,
    setSelectedPeriodKey,
    selectedYearKey,
    setSelectedYearKey,
    selectedMonthKey,
    setSelectedMonthKey,
    availableYears,
    selectedPeriodValue,
    selectedQuarterKey,
    setSelectedQuarterKey,
}) {
    return (
        <div className="flex flex-col gap-4 mb-2 items-start">
            <div className="min-w-44 w-full">
                <Select
                    disallowEmptySelection
                    placeholder="Select Period"
                    size="sm"
                    selectedKeys={selectedPeriodKey}
                    onSelectionChange={setSelectedPeriodKey}
                    className="w-full"
                    aria-label="Select time period for filtering data"
                >
                    {periodOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </Select>
            </div>
            <div className="min-w-44 w-full">
                <Select
                    disallowEmptySelection
                    placeholder="Select Year"
                    size="sm"
                    selectedKeys={selectedYearKey}
                    onSelectionChange={setSelectedYearKey}
                    className="w-full"
                    aria-label="Select year for filtering data"
                >
                    {availableYears.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </Select>
            </div>
            {/* Conditionally render Quarter Select */}
            {selectedPeriodValue === "quarterly" && (
                <div className="min-w-44 w-full">
                    <Select
                        placeholder="Select Quarter (Optional)"
                        size="sm"
                        selectedKeys={selectedQuarterKey}
                        onSelectionChange={setSelectedQuarterKey}
                        className="w-full"
                        allowEmptySelection
                        aria-label="Select quarter for filtering data (optional)"
                    >
                        {quarters.map((option) => (
                            <SelectItem
                                key={String(option.value)}
                                value={String(option.value)}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            )}

            {selectedPeriodValue === "monthly" && (
                <div className="min-w-44 w-full">
                    <Select
                        disallowEmptySelection
                        placeholder="Select Month"
                        size="sm"
                        selectedKeys={selectedMonthKey}
                        onSelectionChange={setSelectedMonthKey}
                        className="w-full"
                        aria-label="Select month for filtering data"
                    >
                        {months.map((option) => (
                            <SelectItem
                                key={String(option.value)}
                                value={String(option.value)}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            )}
        </div>
    );
}