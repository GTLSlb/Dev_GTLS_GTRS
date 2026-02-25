import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";

const DetailsModal = ({ isOpen, onOpenChange, detailsData }) => {
    const renderRowDetails = ({ data }) => {
        const formatDate = (date) => {
            const formatted = moment(date).format("DD-MM-YYYY HH:mm");
            return formatted === "Invalid date" ? "N/A" : formatted;
        };

        return (
            <div className="">
                {data.Details && data.Details.length > 0 && (
                    <div className="w-full space-y-4">
                        <Table aria-label="Item details">
                            <TableHeader>
                                <TableColumn className="w-20">
                                    ITEM #
                                </TableColumn>
                                <TableColumn>TIMESTAMP</TableColumn>
                                <TableColumn>DEPOT</TableColumn>
                                <TableColumn>DOCK</TableColumn>
                                <TableColumn className="w-32">DOCK LOCATION NAME</TableColumn>
                                <TableColumn>CREATED BY</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {data.Details.map((item, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="text-xs font-medium">
                                            {item.ItemNumber || "N/A"}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {formatDate(item.FSEventTimestamp)}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {item.Depot || "N/A"}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {item.DockLocation || "-"}
                                        </TableCell>
                                         <TableCell className="text-xs">
                                            {item.DockLocationName || "-"}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {item.CreatedBy || "N/A"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        );
    };

    if (!isOpen) return null;
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="3xl"
            scrollBehavior="inside"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="gap-1">
                            Details for {detailsData?.ConsignmentNo}
                        </ModalHeader>
                        <ModalBody>
                            {detailsData &&
                                renderRowDetails({
                                    data: detailsData,
                                })}
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="default"
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
    );
};

export default DetailsModal;
