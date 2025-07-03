import truck from "../../Components/lottie/Data/Truck.json";
import success from "../../Components/lottie/Data/Success.json";
import LottieComponent from "@/Components/lottie/LottieComponent";
import { ForgotPasswordPage } from "gtls-npm-libraries";
import Logo from "@/assets/pictures/Logo.png";
export default function ForgotPassword({ status }) {
    const gtamUrl = window.Laravel.gtamUrl;
    return (
       <ForgotPasswordPage
            gtamURl={gtamUrl}
            gtlsLogo={Logo}
            truck={truck}
            LottieComponent={LottieComponent}
            success={success}
       />
    );
}
