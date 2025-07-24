import { Select, SelectItem } from "@heroui/react";
import { months, periodOptions, quarters } from "../../assets/js/useDurationData";

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
        <div className="flex flex-col gap-4 mb-2 items-center">
            <div className="w-48">
                <Select
                    disallowEmptySelection
                    placeholder="Select Period"
                    size="sm"
                    selectedKeys={selectedPeriodKey}
                    onSelectionChange={setSelectedPeriodKey}
                    className="max-w-xs"
                >
                    {periodOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </Select>
            </div>
            <div className="w-48">
                <Select
                    disallowEmptySelection
                    placeholder="Select Year"
                    size="sm"
                    selectedKeys={selectedYearKey}
                    onSelectionChange={setSelectedYearKey}
                    className="max-w-xs"
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
                <div className="w-48">
                    <Select
                        placeholder="Select Quarter (Optional)" // Make it optional
                        size="sm"
                        selectedKeys={selectedQuarterKey}
                        onSelectionChange={setSelectedQuarterKey}
                        className="max-w-xs"
                        // allowEmptySelection to enable the "Select Quarter" placeholder
                        allowEmptySelection
                    >
                        {quarters.map((option) => (
                            <SelectItem key={String(option.value)} value={String(option.value)}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            )}

            {selectedPeriodValue === "monthly" && (
                <div className="w-48">
                    <Select
                        disallowEmptySelection
                        placeholder="Select Month"
                        size="sm"
                        selectedKeys={selectedMonthKey}
                        onSelectionChange={setSelectedMonthKey}
                        className="max-w-xs"
                    >
                        {months.map((option) => (
                            <SelectItem key={String(option.value)} value={String(option.value)}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            )}
        </div>
    )
}