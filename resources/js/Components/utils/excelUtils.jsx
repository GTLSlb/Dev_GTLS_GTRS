// utils/excelUtils.js
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Utility function for exporting to Excel
export const exportToExcel = (
    jsonData,
    columnMapping,
    fileName,
    customCellHandlers = {},
    dateColumns = [],
    formatted = []
) => {
    const selectedColumns = jsonData.selectedColumns.map(
        (column) => column.name
    );
    const newSelectedColumns = selectedColumns.map(
        (column) => columnMapping[column] || column // Replace with new name, or keep original if not found in mapping
    );

    const filterValue = jsonData.filterValue;
    const data = filterValue.map((item) =>
        selectedColumns.reduce((acc, column) => {
            const columnKey = column.replace(/\s+/g, "");

            if (columnKey) {
                if (customCellHandlers[columnKey]) {
                    // Apply custom handler if defined
                    acc[column] = customCellHandlers[columnKey](
                        item[columnKey],
                        item
                    );
                } else {
                    acc[column] = item[columnKey] || "";
                }
            }
            return acc;
        }, {})
    );

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Add a header row
    const headerRow = worksheet.addRow(newSelectedColumns);
    headerRow.font = { bold: true };
    headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE2B540" }, // Yellow background color
    };
    headerRow.alignment = { horizontal: "left", vertical: "left" };

    // Function to calculate row height based on content length
    const calculateRowHeight = (cellValue) => {
        if (!cellValue) return 20; // Default row height
        const lines = cellValue.split("\n").length;
        return Math.max(20, lines * 25); // Dynamic height, adjust 25px per line
    };

    // Add data rows
    data.forEach((rowData) => {
        const row = worksheet.addRow(Object.values(rowData));
        // Apply date formats dynamically to date columns
        dateColumns.forEach((col) => {
            const index = selectedColumns.indexOf(col);
            if (index !== -1) {
                const cell = row.getCell(index + 1); // ExcelJS uses 1-based indexing

                // Check if the column exists in the formatted array
                const formattedColumn = formatted.find((f) => f.field === col);
                if (formattedColumn && formattedColumn.format) {
                    cell.numFmt = formattedColumn.format; // Use the format from formatted array
                } else {
                    cell.numFmt = "dd-mm-yyyy hh:mm AM/PM"; // Default format
                }
            }
        });

        // Calculate the maximum height needed for each row based on multiline content
        let maxHeight = 15; // Start with the default height

        row.eachCell({ includeEmpty: true }, (cell) => {
            const cellValue = cell.value?.toString() || "";

            // Enable text wrapping for multiline content
            cell.alignment = { wrapText: true, vertical: "top" };

            // Calculate the height for this particular cell
            const rowHeight = calculateRowHeight(cellValue);

            // Keep track of the maximum height needed for this row
            maxHeight = Math.max(maxHeight, rowHeight);
        });

        // Set the row height to the maximum calculated height for the row
        row.height = maxHeight;
    });

    // Set column widths
    worksheet.columns = newSelectedColumns.map(() => ({
        width: 20,
    }));

    // Generate and save the Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, fileName);
    });
};
