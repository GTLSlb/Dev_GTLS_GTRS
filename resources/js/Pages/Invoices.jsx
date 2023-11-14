import React, { useState } from "react";
import InvoicesMain from "./Component/Invoices/InvoicesMain";
import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import * as signalRCore from "@microsoft/signalr";
export default function Invoices({
    currentUser,
    activeIndexInv,
    setActiveIndexInv,
    activePage,
    hubConnection,
    invoiceDetails,
    setInvoiceDetails,
    PODetails,
    setPODetails,
    url,
}) {
    const [loading, setLoading] = useState(false);
    return (
        <div className="bg-smooth">
            <div className="md:pl-20 pt-16 ">
                <InvoicesMain
                    url={url}
                    PODetails={PODetails}
                    setPODetails={setPODetails}
                    invoiceDetails={invoiceDetails}
                    setInvoiceDetails={setInvoiceDetails}
                    hubConnection={hubConnection}
                    activePage={activePage}
                    currentUser={currentUser}
                    loading={loading}
                    setLoading={setLoading}
                    activeIndexInv={activeIndexInv}
                    setActiveIndexInv={setActiveIndexInv}
                />
            </div>
        </div>
    );
}
