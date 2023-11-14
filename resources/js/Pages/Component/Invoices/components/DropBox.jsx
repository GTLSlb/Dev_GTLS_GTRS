import React from "react";
import { useEffect } from "react";
import { useDropzone } from "react-dropzone";

const DropBox = ({
    selectedFiles,
    setSelectedFiles,
    object,
    existedFiles,
    setExistedFiles,
    newFiles,
    path,
    setNewFiles,
}) => {
    const onDrop = (acceptedFiles) => {
        setSelectedFiles((prevSelectedFiles) => [
            ...prevSelectedFiles,
            ...acceptedFiles,
        ]);
        setNewFiles((prevSelectedFiles) => [
            ...prevSelectedFiles,
            ...acceptedFiles,
        ]);
    };

    useEffect(() => {
        if (object) {
            if (object.InvoiceDoc) {
                setExistedFiles(object.InvoiceDoc);
                object.InvoiceDoc?.map((Doc) => {
                    fetch(`/Invoices/${Doc.DocName}`)
                        .then((response) => response.blob())
                        .then((blob) => {
                            // Create a new File object from the blob and add it to selectedFiles
                            const file = new File([blob], Doc.DocName);
                            //   setExistedFiles((prevSelectedFiles) => [...prevSelectedFiles, file]);
                            setSelectedFiles((prevSelectedFiles) => [
                                ...prevSelectedFiles,
                                file,
                            ]);
                        })
                        .catch((error) => {
                            console.error("Error fetching the file:", error);
                        });
                });
            } else if (object.PoDoc) {
                setExistedFiles(object.PoDoc);
                object.PoDoc?.map((Doc) => {
                    fetch(`/POs/${Doc.DocName}`)
                        .then((response) => response.blob())
                        .then((blob) => {
                            // Create a new File object from the blob and add it to selectedFiles
                            const file = new File([blob], Doc.DocName);
                            //   setExistedFiles((prevSelectedFiles) => [...prevSelectedFiles, file]);
                            setSelectedFiles((prevSelectedFiles) => [
                                ...prevSelectedFiles,
                                file,
                            ]);
                        })
                        .catch((error) => {
                            console.error("Error fetching the file:", error);
                        });
                });
            }
        }
    }, []);
    const removeFile = (fileToRemove, event) => {
        event.stopPropagation(); // Stop event propagation to prevent file dialog from opening
        setSelectedFiles(selectedFiles.filter((file) => file !== fileToRemove));
        setExistedFiles(
            existedFiles.map((file) =>
                file.DocId === fileToRemove.DocId
                    ? { ...file, DocStatus: 2 }
                    : file
            )
        );
        setNewFiles(newFiles.filter((file) => file !== fileToRemove));
    };

    const getFilePreviewURL = (file) => {
        return URL.createObjectURL(file);
    };

    const handleLinkClick = (event, file) => {
        event.preventDefault(); // Prevent the default link behavior (navigation)
        // You can perform any other actions when clicking the link here
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        accept: {
            "application/pdf": [".pdf"],
        },
    });
    return (
        <div>
            {selectedFiles.length > 0 ? (
                <div>
                    <p className="text-center font-bold">Selected Files:</p>
                    <ul>
                        {existedFiles
                            ?.filter((file) => file.DocStatus === 1)
                            .map((file, index) => (
                                <li
                                    key={index}
                                    className="justify-between flex"
                                >
                                    {/* {renderPreview(file)} */}
                                    <a
                                        href={`/${path}/${file.DocName}`}
                                        target="_blank"
                                        className="text-blue-500 underline w-50 max-w-xs truncate"
                                        rel="noopener noreferrer"
                                    >
                                        <span className="">{file.DocName}</span>
                                    </a>
                                    <button
                                        onClick={(e) => removeFile(file, e)}
                                        className="text-red-600 text-sm"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        {newFiles?.map((file, index) => (
                            <li key={index} className="justify-between flex">
                                {/* {renderPreview(file)} */}
                                <a
                                    href={
                                        getFilePreviewURL(file)
                                        // `/Invoices/${file.name}`
                                    }
                                    className="text-blue-500 underline max-w-xs truncate"
                                    target="_blank"
                                >
                                    <span className="truncate">
                                        {file.name}
                                    </span>
                                </a>
                                <button
                                    onClick={(e) => removeFile(file, e)}
                                    className="text-red-600 text-sm"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
            <div
                {...getRootProps()}
                className={`p-4 border-2 border-dashed ${
                    isDragActive ? "border-green-500" : "border-gray-300"
                }`}
            >
                <input {...getInputProps()} style={{ display: "none" }} />

                <p className="text-center">
                    {selectedFiles.length > 0
                        ? "Select More"
                        : "Drag and drop files here, or click to select files"}
                </p>
            </div>
        </div>
    );
};

export default DropBox;
