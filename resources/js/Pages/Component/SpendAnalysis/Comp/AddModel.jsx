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

export default function AddModel({ isOpen, onOpenChange, selectedData }) {
    const information = selectedData ? selectedData.additionalCost : [];

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
                                                        {item.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2 justify-left items-center">
                                                        $ {item.chargeRate}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2 justify-left items-center">
                                                        {item.quantity.toFixed(
                                                            2
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-semibold">
                                                    $ {item.cost.toFixed(2)}
                                                    
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Divider />
                                <div className="flex justify-between pl-5 pr-10">
                                    <span>Total</span>
                                    <span>$ {selectedData ? selectedData.additional : "0.00"}</span>
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
