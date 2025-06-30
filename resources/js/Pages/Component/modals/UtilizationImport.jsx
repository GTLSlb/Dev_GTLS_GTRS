import React, { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Textarea,
    Card,
} from "@nextui-org/react";
import * as XLSX from "xlsx";
import axios from "axios";

export default function UtilizationImport({}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [fileName, setFileName] = useState();
    const [jsonData, setJsonData] = useState([]); // Moved to props

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);

        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
            setJsonData(json);
            console.log("Parsed JSON:", json);
        };

        reader.readAsArrayBuffer(file);
    };

    const handleSave = async () => {
        if (jsonData.length === 0) {
            alert("Please upload a file first.");
            return;
        }

        try {
            const response = await axios.post(
                "https://your-backend-api.com/upload",
                jsonData
            );
            alert("File uploaded successfully");
            console.log(response.data);
            onOpenChange(); // close modal after success
        } catch (err) {
            console.error(err);
            alert("Error uploading file");
        }
    };

    return (
        <>
            <Button
                onPress={onOpen}
                className="bg-dark text-white px-4 py-2"
                size="sm"
            >
                Import Data
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Upload Excel File
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-4">
                                    <input
                                        type="file"
                                        accept=".xlsx, .xls, .csv, .xlsb"
                                        id="file-upload"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="file-upload">
                                        <Button
                                            as="span"
                                            color="primary"
                                            variant="flat"
                                        >
                                            Select Excel File
                                        </Button>
                                    </label>
                                    <p>
                                        {fileName
                                            ? "Selected file: "
                                            : "No file selected"}
                                        {fileName}
                                    </p>
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    size="sm"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                                <Button
                                    color="primary"
                                    className="bg-dark text-white px-4 py-2"
                                    size="sm"
                                    onPress={handleSave}
                                >
                                    Save
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
