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
import { AlertToast, canEditUsers } from "@/permissions";
import { ToastContainer } from "react-toastify";
import Accounts from "./Accounts";
import Users from "./Users";

export default function CustomerProfile({ currentUser, userPermission }) {
    const [customer, setCustomer] = useState([]);
    // const [editMode, setEditMode] = useState(false);
    // const [accountStates, setAccountStates] = useState({});
    // const [originalAccountStates, setOriginalAccountStates] = useState({});
    // const [userStatus, setUserStatus] = useState(true); // true = enabled
    const [loading, setLoading] = useState(true);
    const gtamUrl = window.Laravel.gtamUrl;
    const navigate = useNavigate();
    const location = useLocation();

    const customerId = location?.state?.CustomerId;
console.log(customerId ? customerId : currentUser?.OwnerId);
    async function fetchData() {
        const data = await getApiRequest(`${gtamUrl}CustomerById`, {
            UserId: currentUser?.UserId,
            Customer_Id: customerId ? customerId : currentUser?.OwnerId,
        });

        if (data) {
            setLoading(false);
            setCustomer(data);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    const [selectedTab, setSelectedTab] = useState("accounts");
    // const [selectedUser, setSelectedUser] = useState(null);
    // const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // const handleUserClick = (user) => {
    //     setSelectedUser(user);
    //     setUserStatus(user?.IsActive ?? true); // Reset user switch
    //     const initialStates = {};
    //     customer.Accounts.forEach((account) => {
    //         const isLinked = user.Accounts?.includes(account.AccountId);
    //         initialStates[account.AccountId] = isLinked;
    //     });
    //     setAccountStates(initialStates);
    //     setOriginalAccountStates(initialStates);
    //     setEditMode(false); // Reset edit mode too
    //     onOpen();
    // };

    // const renderAccountCard = (account) => (
    //     <div
    //         key={account.AccountId}
    //         className="bg-white shadow-md rounded-lg min-h-[120px] p-4"
    //     >
    //         <div className="flex items-start justify-between mb-2">
    //             <h2 className="text-xl font-semibold">{account.AccountName}</h2>
    //             <Switch color="success" isDisabled defaultSelected size="sm" />
    //         </div>
    //         <p>{account.AccountNo}</p>
    //     </div>
    // );

    // const renderAccountsTab = () => (
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    //         {customer.Accounts?.map(renderAccountCard)}
    //     </div>
    // );

    // const renderUsersTab = () => (
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    //         {customer.Users?.map((user) => (
    //             <Card
    //                 key={user.UserId}
    //                 isHoverable
    //                 isPressable
    //                 shadow="sm"
    //                 onPress={() => handleUserClick(user)}
    //             >
    //                 <CardHeader className="flex flex-col items-start gap-1">
    //                     <div className="flex items-start w-full gap-2 justify-between mb-2">
    //                         <h3 className="text-lg font-semibold">
    //                             {user.Username}
    //                         </h3>
    //                         <Switch
    //                             color="success"
    //                             isDisabled
    //                             defaultSelected
    //                             size="sm"
    //                         />
    //                     </div>
    //                     <p className="text-sm text-gray-600">{user.Username}</p>
    //                 </CardHeader>
    //             </Card>
    //         ))}
    //     </div>
    // );

    // const renderDrawerContent = () => {
    //     if (!selectedUser) return null;

    //     const handleUserClick = (user) => {
    //         setSelectedUser(user);
    //         setUserStatus(user?.IsActive ?? true); // Assuming there's an IsActive flag
    //         onOpen();
    //     };

    //     const toggleEditMode = () => {
    //         if (!editMode) {
    //             const initialStates = {};
    //             customer.Accounts.forEach((account) => {
    //                 const isLinked = selectedUser.Accounts?.includes(
    //                     account.AccountId
    //                 );
    //                 initialStates[account.AccountId] = isLinked;
    //             });
    //             setAccountStates(initialStates);
    //             setOriginalAccountStates(initialStates); // <--- store original snapshot
    //         }
    //         setEditMode((prev) => !prev);
    //     };

    //     const handleSwitchChange = (accountId, value) => {
    //         setAccountStates((prev) => ({
    //             ...prev,
    //             [accountId]: value,
    //         }));
    //     };
    //     const handleSave = () => {
    //         const changes = Object.entries(accountStates).reduce(
    //             (acc, [accountId, newValue]) => {
    //                 const originalValue = originalAccountStates[accountId];
    //                 if (originalValue !== newValue) {
    //                     const account = customer.Accounts.find(
    //                         (acc) => acc.AccountId === parseInt(accountId)
    //                     );
    //                     acc.push({
    //                         Username: selectedUser.Username,
    //                         AccountName:
    //                             account?.AccountName || `Account ${accountId}`,
    //                         Status: newValue ? "Enabled" : "Disabled",
    //                     });
    //                 }
    //                 return acc;
    //             },
    //             []
    //         );

    //         console.log("Changed assignments:", changes);

    //         // Build email details
    //         const subject = `Account Changes for ${selectedUser.Username}`;

    //         const userStatusLine = `User Status: ${
    //             userStatus ? "Enabled" : "Disabled"
    //         }`;

    //         const bodyLines = changes.map(
    //             (change) => `• ${change.AccountName}: ${change.Status}`
    //         );
    //         const body = `Hello,\n\nThe following account changes have been requested for ${
    //             selectedUser.Username
    //         }:\n\n${userStatusLine}\n\n${bodyLines.join("\n")}\n\nThanks`;

    //         const mailtoLink = `mailto:recipient@example.com?cc=cc@example.com&subject=${encodeURIComponent(
    //             subject
    //         )}&body=${encodeURIComponent(body)}`;

    //         // Open default mail client
    //         window.location.href = mailtoLink;
    //         // You can send `changes` to backend here...
    //         AlertToast("Request submitted successfully", 1);
    //         setEditMode(false);
    //     };

    //     return (
    //         <DrawerContent>
    //             {(onClose) => (
    //                 <>
    //                     <DrawerHeader className="flex justify-between items-center">
    //                         <div className="flex gap-2 items-center">
    //                             All Accounts for {selectedUser.Username}
    //                             <Switch
    //                                 isSelected={userStatus}
    //                                 onValueChange={setUserStatus}
    //                                 isDisabled={!editMode}
    //                                 color="success"
    //                                 size="sm"
    //                             />
    //                         </div>
    //                         {canEditUsers(userPermission) && (
    //                             <div className="flex gap-2 mr-5">
    //                                 {editMode ? (
    //                                     <Button
    //                                         color="success"
    //                                         size="sm"
    //                                         onPress={() => {
    //                                             handleSave();
    //                                             onClose();
    //                                         }}
    //                                     >
    //                                         Submit Request
    //                                     </Button>
    //                                 ) : (
    //                                     <Button
    //                                         size="sm"
    //                                         className="bg-gray-800 text-white"
    //                                         onPress={toggleEditMode}
    //                                     >
    //                                         Edit
    //                                     </Button>
    //                                 )}
    //                             </div>
    //                         )}
    //                     </DrawerHeader>

    //                     <DrawerBody>
    //                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    //                             {customer.Accounts.map((account) => {
    //                                 const accountId = account.AccountId;
    //                                 const isSelected = editMode
    //                                     ? accountStates[accountId]
    //                                     : selectedUser.Accounts?.includes(
    //                                           accountId
    //                                       );

    //                                 return (
    //                                     <div
    //                                         key={accountId}
    //                                         className="bg-white shadow-md rounded-lg p-4"
    //                                     >
    //                                         <div className="flex items-start justify-between mb-2">
    //                                             <h2 className="text-xl font-semibold">
    //                                                 {account.AccountName}
    //                                             </h2>
    //                                             <Switch
    //                                                 isSelected={isSelected}
    //                                                 onValueChange={(value) =>
    //                                                     handleSwitchChange(
    //                                                         accountId,
    //                                                         value
    //                                                     )
    //                                                 }
    //                                                 isDisabled={!editMode}
    //                                                 color="success"
    //                                                 size="sm"
    //                                             />
    //                                         </div>
    //                                         <p>{account.AccountNo}</p>
    //                                     </div>
    //                                 );
    //                             })}
    //                         </div>
    //                     </DrawerBody>

    //                     <DrawerFooter>
    //                         <Button
    //                             color="danger"
    //                             variant="light"
    //                             onPress={onClose}
    //                         >
    //                             Close
    //                         </Button>
    //                     </DrawerFooter>
    //                 </>
    //             )}
    //         </DrawerContent>
    //     );
    // };

    return (
        <><div className="container mx-auto flex flex-col gap-4 p-5">
            {currentUser?.TypeId !== 1 && (
                <GtrsButton
                    name="Back"
                    icon={<ArrowLeftIcon className="mr-2 h-4 w-4" />}
                    onClick={() => {
                        navigate("/gtrs/customer-settings");
                    }}
                />
            )}
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

            <div className="">
                {loading ? (
                    <AnimatedLoading />
                ) : selectedTab === "accounts" ? (
                    <Accounts
                        customer={customer}
                        userPermission={userPermission}
                    />
                ) : (
                    <Users
                        customer={customer}
                        userPermission={userPermission}
                    />
                )}
            </div>

            {/* <Drawer
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="bottom"
                className=""
            >
                {renderDrawerContent()}
            </Drawer> */}
        </div>
        <ToastContainer />
        </>
        
    );
}
