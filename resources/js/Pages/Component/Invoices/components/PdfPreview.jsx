import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
    ArrowDownTrayIcon,
    MagnifyingGlassMinusIcon,
    MagnifyingGlassPlusIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const PdfPreview = ({ pdfUrls }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [activeFile, setActiveFile] = useState(0);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const downloadPdf = () => {
        const pdfUrl = pdfUrls[activeFile]?.DocName;
        const link = document.createElement("a");
        link.href = `Invoices/${pdfUrl}`;
        link.download = pdfUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const [scale, setScale] = useState(1); // Initialize scale state

    const zoomIn = () => {
        setScale((prevScale) => prevScale + 0.1); // Increase scale by 0.1
    };

    const zoomOut = () => {
        setScale((prevScale) => prevScale - 0.1); // Decrease scale by 0.1
    };

    const goToPrevPage = () =>
        setPageNumber((prevPage) => (prevPage - 1 <= 1 ? 1 : prevPage - 1));

    const goToNextPage = () =>
        setPageNumber((prevPage) =>
            prevPage + 1 >= numPages ? numPages : prevPage + 1
        );

    function handleFileChange(index) {
        setActiveFile(index);
    }

    if (!pdfUrls || pdfUrls.length === 0) {
        return (
            <div className="flex justify-center items-center h-[40rem]">
                No PDFs to display
            </div>
        );
    }

    return (
        <div>
            <nav className="flex gap-x-2 py-2 ">
                {pdfUrls?.length > 0
                    ? pdfUrls.map((url, index) => (
                          <div className="flex gap-x-2">
                              <button
                                  key={index}
                                  className="px-2 py-1 border rounded-lg bg-gray-700 rounded text-smooth"
                                  onClick={() => {
                                      setPageNumber(1);
                                      handleFileChange(index);
                                  }}
                              >
                                  File {index + 1}
                              </button>
                          </div>
                      ))
                    : null}
                {pdfUrls ? (
                    <button
                        onClick={downloadPdf}
                        className="px-3 py-1 flex items-center gap-x-1 border bg-gray-700 rounded-lg text-smooth"
                    >
                        <ArrowDownTrayIcon className="h-5" />
                    </button>
                ) : null}
            </nav>
            <div className="overflow-y-scroll containerscroll h-[40rem] transition-transform duration-300">
                <Document
                    onLoadError={console.error}
                    file={`Invoices/${pdfUrls[activeFile]?.DocName}`}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page
                        pageNumber={pageNumber}
                        renderTextLayer={false}
                        scale={scale} // Disable rendering of text layer
                    />
                </Document>
            </div>

            <div className="flex justify-center m-2">
                <button
                    onClick={zoomOut}
                    className="px-3 py-1 rounded-lg text-smooth  mr-2"
                >
                    <MagnifyingGlassMinusIcon className="h-5 text-gray-800" />
                </button>
                <button
                    onClick={zoomIn}
                    className="px-3 py-1 rounded-lg text-smooth"
                >
                    <MagnifyingGlassPlusIcon className="h-5 text-gray-800" />
                </button>
            </div>

            <nav className="flex gap-x-2 py-2 justify-center items-center text-sm">
                <button
                    onClick={goToPrevPage}
                    className="px-3 py-1 border flex bg-gray-800 rounded-lg text-smooth"
                >
                    <ChevronLeftIcon className="mr-1 h-5" />
                    <span>Prev</span>
                </button>
                <p>
                    Page {pageNumber} of {numPages}
                </p>
                <button
                    onClick={goToNextPage}
                    className="px-3 py-1 flex border bg-gray-800 rounded-lg text-smooth"
                >
                    <span> Next</span>
                    <ChevronRightIcon className="ml-1 h-5" />
                </button>
            </nav>
        </div>
    );
};

export default PdfPreview;
