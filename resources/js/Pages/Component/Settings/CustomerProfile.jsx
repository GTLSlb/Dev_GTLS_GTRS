import { useEffect, useState } from "react";
import {
    Switch,
    Tab,
    Tabs,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    useDisclosure,
    Spinner,
    Card,
    CardHeader,
} from "@heroui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { getApiRequest } from "@/CommonFunctions";
import GtrsButton from "../GtrsButton";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import AnimatedLoading from "@/Components/AnimatedLoading";

export default function CustomerProfile({ currentUser }) {
    const [customer, setCustomer] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [accountStates, setAccountStates] = useState({});
    const [loading, setLoading] = useState(true);
    const gtamUrl = window.Laravel.gtamUrl;
    const navigate = useNavigate();
    const location = useLocation();

    async function fetchData() {
        const data = await getApiRequest(`${gtamUrl}CustomerById`, {
            UserId: currentUser?.UserId,
            Customer_Id: location?.state?.CustomerId,
        });

        if (data) {
            setLoading(false);
            setCustomer(data);
        }
    }
    console.log("customer", customer);
    useEffect(() => {
        fetchData();
    }, []);

    const [selectedTab, setSelectedTab] = useState("accounts");
    const [selectedUser, setSelectedUser] = useState(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleUserClick = (user) => {
        setSelectedUser(user);
        onOpen();
    };

    const renderAccountCard = (account) => (
        <div
            key={account.AccountId}
            className="bg-white shadow-md rounded-lg min-h-[120px] p-4"
        >
            <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-semibold">{account.AccountName}</h2>
                <Switch color="success" isDisabled defaultSelected size="sm" />
            </div>
            <p>{account.AccountNo}</p>
        </div>
    );

    const renderAccountsTab = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customer.Accounts?.map(renderAccountCard)}
        </div>
    );

    const renderUsersTab = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customer.Users?.map((user) => (
                <Card
                    key={user.UserId}
                    isHoverable
                    isPressable
                    shadow="sm"
                    onPress={() => handleUserClick(user)}
                >
                    <CardHeader className="flex flex-col items-start gap-1">
                        <div className="flex items-start w-full gap-2 justify-between mb-2">
                            <h3 className="text-lg font-semibold">
                                {user.Username}
                            </h3>
                            <Switch
                                color="success"
                                isDisabled
                                defaultSelected
                                size="sm"
                            />
                        </div>
                        <p className="text-sm text-gray-600">{user.Username}</p>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );

    const renderDrawerContent = () => {
        if (!selectedUser) return null;
        const toggleEditMode = () => {
            if (!editMode) {
                // Initialize state when entering edit mode
                const initialStates = {};
                customer.Accounts.forEach((account) => {
                    initialStates[account.AccountId] =
                        selectedUser.Accounts?.includes(account.AccountId);
                });
                setAccountStates(initialStates);
            }
            setEditMode(!editMode);
        };

        const handleSwitchChange = (accountId, value) => {
            setAccountStates((prev) => ({
                ...prev,
                [accountId]: value,
            }));
        };

        const handleSave = () => {
            const changed = Object.entries(accountStates).filter(
                ([accountId, value]) => {
                    const originalHasAccount =
                        selectedUser.Accounts?.includes(accountId);
                    return originalHasAccount !== value;
                }
            );

            console.log("Changed assignments:", changed);
            // TODO: send `changed` data to your backend or state manager

            setEditMode(false);
        };

        return (
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                                All Accounts for {selectedUser.Username}
                                <Switch
                                    defaultSelected
                                    color="success"
                                    isDisabled
                                    size="sm"
                                />
                            </div>
                            <div className="flex gap-2">
                                {editMode ? (
                                    <Button
                                        color="success"
                                        size="sm"
                                        onPress={handleSave}
                                    >
                                        Save
                                    </Button>
                                ) : (
                                    <Button
                                        color="primary"
                                        size="sm"
                                        onPress={toggleEditMode}
                                    >
                                        Edit
                                    </Button>
                                )}
                            </div>
                        </DrawerHeader>

                        <DrawerBody>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {customer.Accounts.map((account) => {
                                    const accountId = account.AccountId;
                                    const isSelected = editMode
                                        ? accountStates[accountId]
                                        : selectedUser.Accounts?.includes(
                                              accountId
                                          );

                                    return (
                                        <div
                                            key={accountId}
                                            className="bg-white shadow-md rounded-lg p-4"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h2 className="text-xl font-semibold">
                                                    {account.AccountName}
                                                </h2>
                                                <Switch
                                                    isSelected={isSelected}
                                                    onValueChange={(value) =>
                                                        handleSwitchChange(
                                                            accountId,
                                                            value
                                                        )
                                                    }
                                                    isDisabled={!editMode}
                                                    color="success"
                                                    size="sm"
                                                />
                                            </div>
                                            <p>{account.AccountNo}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </DrawerBody>

                        <DrawerFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Close
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        );
    };

    return (
        <div className="container mx-auto flex flex-col gap-4 p-5">
            <GtrsButton
                name="Back"
                icon={<ArrowLeftIcon className="mr-2 h-4 w-4" />}
                onClick={() => {
                    navigate("/gtrs/customer-settings");
                }}
            />
            <h1 className="text-4xl font-bold">{customer.CustomerName}</h1>

            <div className="flex flex-wrap gap-4">
                <Tabs
                    aria-label="Tabs variants"
                    selectedKey={selectedTab}
                    onSelectionChange={setSelectedTab}
                    classNames={{
                        tabList: "bg-white",
                    }}
                >
                    <Tab key="accounts" title="Accounts" />
                    <Tab key="users" title="Users" />
                </Tabs>
            </div>

            <div className="mt-4">
                {loading ? (
                    <AnimatedLoading />
                ) : selectedTab === "accounts" ? (
                    renderAccountsTab()
                ) : (
                    renderUsersTab()
                )}
            </div>

            <Drawer
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="bottom"
            >
                {renderDrawerContent()}
            </Drawer>
        </div>
    );
}
