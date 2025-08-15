import React, { useState, useEffect, useContext } from "react";
import { Switch, Button } from "@heroui/react";
import { AlertToast, canEditUsers } from "@/permissions"; // Or replace with your toast system
import PropTypes from "prop-types";
import { CustomContext } from "@/CommonContext";

export default function Accounts({ customer }) {
    const { userPermissions } = useContext(CustomContext);
    const [editMode, setEditMode] = useState(false);
    const [accountStates, setAccountStates] = useState({});
    const [originalAccountStates, setOriginalAccountStates] = useState({});

    useEffect(() => {
        if (customer?.Accounts) {
            const initialStates = {};
            customer.Accounts.forEach((account) => {
                initialStates[account.AccountId] = account.IsActive ?? true;
            });
            setAccountStates(initialStates);
            setOriginalAccountStates(initialStates);
        }
    }, [customer]);

    const toggleEditMode = () => {
        if (!editMode) {
            // Reinitialize to ensure clean state
            const initialStates = {};
            customer.Accounts.forEach((account) => {
                initialStates[account.AccountId] = account.IsActive ?? true;
            });
            setAccountStates(initialStates);
            setOriginalAccountStates(initialStates);
        }
        setEditMode((prev) => !prev);
    };

    const handleSwitchChange = (accountId, value) => {
        setAccountStates((prev) => ({
            ...prev,
            [accountId]: value,
        }));
    };

    const handleSave = () => {
        const changes = Object.entries(accountStates).reduce(
            (acc, [accountId, newValue]) => {
                const originalValue = originalAccountStates[accountId];
                if (originalValue !== newValue) {
                    const account = customer.Accounts.find(
                        (acc) => acc.AccountId === parseInt(accountId)
                    );
                    acc.push({
                        AccountName:
                            account?.AccountName || `Account ${accountId}`,
                        Status: newValue ? "Enabled" : "Disabled",
                    });
                }
                return acc;
            },
            []
        );

        if (changes.length > 0) {
            const subject = `Account Status Changes for ${customer.CustomerName}`;
            const bodyLines = changes.map(
                (change) => `• ${change.AccountName}: ${change.Status}`
            );
            const body = `Hello,\n\nThe following account status changes have been made for customer ${
                customer.CustomerName
            }:\n\n${bodyLines.join("\n")}\n\nThanks`;

            const mailtoLink = `mailto:recipient@example.com?cc=cc@example.com&subject=${encodeURIComponent(
                subject
            )}&body=${encodeURIComponent(body)}`;

            window.location.href = mailtoLink;
            AlertToast("Request submitted successfully", 1);
        } else {
            AlertToast("No changes were made", 0);
        }

        setEditMode(false);
    };

    const handleCancel = () => {
        setAccountStates(originalAccountStates);
        setEditMode(false);
    };

    const renderAccountCard = (account) => {
        const accountId = account.AccountId;
        const isSelected = editMode
            ? accountStates[accountId]
            : account.IsActive ?? true;

        return (
            <div
                key={accountId}
                className="bg-white shadow-md rounded-xl border min-h-[120px] p-4"
            >
                <div className="flex items-start justify-between mb-2">
                    <h2 className="text-lg font-semibold">
                        {account.AccountName}
                    </h2>
                    <Switch
                        isSelected={isSelected}
                        onValueChange={(value) =>
                            handleSwitchChange(accountId, value)
                        }
                        isDisabled={!editMode}
                        color="success"
                        size="sm"
                    />
                </div>
                <p>{account.AccountNo}</p>
            </div>
        );
    };

    return (
        <div className="">
            {canEditUsers(userPermissions) && (
                <div className="flex justify-end gap-2 mb-4">
                    {editMode ? (
                        <>
                            <Button
                                size="sm"
                                variant="light"
                                color="default"
                                onPress={handleCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="success"
                                size="sm"
                                onPress={handleSave}
                            >
                                Save Changes
                            </Button>
                        </>
                    ) : (
                        <Button
                            size="sm"
                            className="bg-gray-800 text-white"
                            onPress={toggleEditMode}
                        >
                            Edit
                        </Button>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customer.Accounts?.map(renderAccountCard)}
            </div>
        </div>
    );
}

Accounts.propTypes = {
    customer: PropTypes.object,
};