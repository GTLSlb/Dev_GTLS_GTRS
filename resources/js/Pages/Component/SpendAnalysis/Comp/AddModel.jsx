import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Divider,
    Table,
    TableHeader,
    TableCell,
    TableRow,
    TableBody,
    TableColumn,
} from "@heroui/react";
import React from "react";
import PropTypes from "prop-types";

export default function AddModel({ isOpen, onOpenChange }) {
    const information = [
        {
            codeRef: "Timeslot",
            chargeRate: "10",
            TotalCharge: "10.00",
            quantity: 1,
        },
        {
            codeRef: "DG",
            chargeRate: "41.2",
            TotalCharge: "41.20",
            quantity: 1,
        },
        {
            codeRef: "PLT DCKET",
            chargeRate: "3.9",
            TotalCharge: "3.90",
            quantity: 1,
        },
        {
            codeRef: "PUP DEMSEM",
            chargeRate: "97.85",
            TotalCharge: "32.29",
            quantity: 0.33,
        },
        {
            codeRef: "Labour",
            chargeRate: "55",
            TotalCharge: "27.50",
            quantity: 0.5,
        },
    ];

    const totalAmount = information.reduce((acc, item) => acc + parseFloat(item.TotalCharge), 0).toFixed(2);


    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Additinal Charges Details
                                <Divider />
                            </ModalHeader>
                            <ModalBody>
                                <Table>
                                    <TableHeader>
                                        <TableColumn>Description</TableColumn>
                                        <TableColumn>Charge Rate</TableColumn>
                                        <TableColumn>Quantity</TableColumn>
                                        <TableColumn>Total Charge</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {information.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <div className="flex gap-2 justify-left items-center">
                                                        {item.codeRef}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2 justify-left items-center">
                                                       $ {item.chargeRate}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2 justify-left items-center">
                                                        {item.quantity}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-semibold">
                                                    $ {item.TotalCharge}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Divider />
                                <div className="flex justify-between pl-5 pr-10">
                                    <span>Total</span>
                                    <span>$ {totalAmount}</span>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

AddModel.propTypes = {
    isOpen: PropTypes.bool,
    onOpenChange: PropTypes.func,
};
