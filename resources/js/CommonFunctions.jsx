import swal from "sweetalert";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { PublicClientApplication } from "@azure/msal-browser";


const msalConfig = {
    auth: {
        clientId: "05f70999-6ca7-4ee8-ac70-f2d136c50288",
        authority:
            "https://login.microsoftonline.com/647bf8f1-fc82-468e-b769-65fd9dacd442",
        redirectUri: window.Laravel.azureCallback,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true, // Set this to true if dealing with IE11 or issues with sessionStorage
    },
};
const pca = new PublicClientApplication(msalConfig);

export async function handleSessionExpiration() {
    axios
        .post("/logoutWithoutRequest")
        .then(async (response) => {
            if (response.status === 200) {
                const allAccounts = await pca.getAllAccounts();
                if (allAccounts.length > 0) {
                    await pca.logoutRedirect({
                        scopes: ["user.read"],
                    });
                } else {
                    window.location.href = "/login";
                }
                window.location.href = "/login";
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
