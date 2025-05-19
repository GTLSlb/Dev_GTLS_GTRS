import { useState } from "react";
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
} from "@heroui/react";

export default function Customers() {
  const [selectedTab, setSelectedTab] = useState("accounts");
  const [selectedUser, setSelectedUser] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const accounts = [
    { id: 1, name: "Account Alpha", description: "Alpha account for management." },
    { id: 2, name: "Account Beta", description: "Beta account for invoicing." },
    { id: 3, name: "Account Gamma", description: "Gamma account for sales." },
    { id: 4, name: "Account Delta", description: "Delta account for operations." },
  ];

  const users = [
    {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      accountIds: [1, 2, 4],
    },
    {
      id: 2,
      name: "Bob",
      email: "bob@example.com",
      accountIds: [3],
    },
  ];

  const handleUserClick = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const renderAccountCard = (account) => (
    <div key={account.id} className="bg-white shadow-md rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">{account.name}</h2>
        <Switch defaultSelected size="sm" />
      </div>
      <p>{account.description}</p>
    </div>
  );

  const renderAccountsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {accounts.map(renderAccountCard)}
    </div>
  );

  const renderUsersTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:bg-gray-100"
          onClick={() => handleUserClick(user)}
        >
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      ))}
    </div>
  );

  const renderDrawerContent = () => {
  if (!selectedUser) return null;

  return (
    <DrawerContent>
      {(onClose) => (
        <>
          <DrawerHeader className="flex flex-col gap-1">
            All Accounts for {selectedUser.name}
          </DrawerHeader>
          <DrawerBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map((account) => {
                const userHasAccount = selectedUser.accountIds.includes(account.id);
                return (
                  <div key={account.id} className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-semibold">{account.name}</h2>
                      <Switch defaultSelected={userHasAccount} size="sm" />
                    </div>
                    <p>{account.description}</p>
                  </div>
                );
              })}
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </>
      )}
    </DrawerContent>
  );
};

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-4xl font-bold mb-4">Customers</h1>

      <div className="flex flex-wrap gap-4">
        <Tabs
          aria-label="Tabs variants"
          selectedKey={selectedTab}
          onSelectionChange={setSelectedTab}
        >
          <Tab key="accounts" title="Accounts" />
          <Tab key="users" title="Users" />
        </Tabs>
      </div>

      <div className="mt-4">
        {selectedTab === "accounts" ? renderAccountsTab() : renderUsersTab()}
      </div>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="bottom">
        {renderDrawerContent()}
      </Drawer>
    </div>
  );
}
