import React from "react";
import PropTypes from "prop-types";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/react";
function BarTable({ colLabel, colTotal, colOnTime, colKPI, colPOD, colWidth }) {
    return (
        <Table
            // hideHeader
            fullWidth={false}
            radius="none"
            className="mt-10"
            aria-label="Example static collection table"
        >
            <TableHeader>
                {colLabel.map((item) => (
                    <TableColumn
                        key={item}
                        minWidth={colWidth}
                        maxWidth={colWidth}
                        width={colWidth}
                    >
                        {item}
                    </TableColumn>
                ))}
            </TableHeader>
            <TableBody>
                <TableRow key="1">
                    <TableCell
                        minWidth={colWidth}
                        maxWidth={colWidth}
                        width={colWidth}
                    >
                        Total
                    </TableCell>
                    {colTotal.map((item) => (
                        <TableCell
                            key={item}
                            minWidth={colWidth}
                            maxWidth={colWidth}
                            width={colWidth}
                        >
                            {item}
                        </TableCell>
                    ))}
                </TableRow>
                <TableRow key="2">
                    <TableCell
                        minWidth={colWidth}
                        maxWidth={colWidth}
                        width={colWidth}
                    >
                        OnTime %
                    </TableCell>
                    {colOnTime.map((item) => (
                        <TableCell
                            key={item}
                            minWidth={colWidth}
                            maxWidth={colWidth}
                            width={colWidth}
                        >
                            {item} %
                        </TableCell>
                    ))}
                </TableRow>
                <TableRow key="3">
                    <TableCell
                        minWidth={colWidth}
                        maxWidth={colWidth}
                        width={colWidth}
                    >
                        KPI Bench Mark
                    </TableCell>
                    {colKPI.map((item) => (
                        <TableCell
                            key={item}
                            minWidth={colWidth}
                            maxWidth={colWidth}
                            width={colWidth}
                        >
                            {item} %
                        </TableCell>
                    ))}
                </TableRow>
                <TableRow key="3">
                    <TableCell
                        minWidth={colWidth}
                        maxWidth={colWidth}
                        width={colWidth}
                    >
                        POD %
                    </TableCell>
                    {colPOD.map((item) => (
                        <TableCell
                            key={item}
                            minWidth={colWidth}
                            maxWidth={colWidth}
                            width={colWidth}
                        >
                            {item} %
                        </TableCell>
                    ))}
                </TableRow>
            </TableBody>
        </Table>
    );
}
BarTable.propTypes = {
    colLabel: PropTypes.arrayOf(PropTypes.string),
    colTotal: PropTypes.arrayOf(PropTypes.number),
    colOnTime: PropTypes.arrayOf(PropTypes.number),
    colKPI: PropTypes.arrayOf(PropTypes.number),
    colPOD: PropTypes.arrayOf(PropTypes.number),
    colWidth: PropTypes.string,
};

export default BarTable;
