import React, { Component } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

class ContactUsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            company: "",
            email: "",
            message: "",
            phone: "",
            errors: {},
            recaptchaValue: false,
        };
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleRecaptchaChange = (value) => {
        this.setState({ recaptchaValue: true });
    };

    handleRecaptchaExpired = () => {
        this.setState({ recaptchaValue: false });
    };

    // handleFileChange = (e) => {
    //     this.setState({ attachment: e.target.files[0] });
    // };

    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({ isLoading: true });

        const formData = new FormData();
        formData.append("name", this.state.name);
        formData.append("company", this.state.company);
        formData.append("email", this.state.email);
        formData.append("message", this.state.message);
        formData.append("phone", this.state.phone);

        axios
            .post("/contactus", formData)
            .then((response) => {
                this.setState({
                    name: "",
                    company: "",
                    email: "",
                    message: "",
                    phone: "",
                    errors: {},
                    isLoading: false,
                    success: response.status === 200,
                });
            })
            .catch((error) => {
                console.log(error.response);
                this.setState({ errors: error.response.data.errors });
            });
    };

    render() {
        const { errors } = this.state;
        const { isLoading, success } = this.state;
        const { isTyping } = this.state;
        const { recaptchaValue } = this.state;

        return (
            <div className="">
                <form
                    onSubmit={this.handleSubmit}
                    encType="multipart/form-data"
                    className="px-6 pb-24 pt-20 sm:pb-32 lg:py-24 lg:px-8 z-10"
                >
                    <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg border-4 border-goldt rounded-3xl">
                        <div className="grid grid-cols-1 gap-y-3 gap-x-8  p-10">
                            <p className="text-xl text-gray-200">
                                Send Message
                            </p>
                            <div>
                                <div className=" relative group mt-2.5 border-b border-goldt">
                                    <input
                                        type="text"
                                        required
                                        autoComplete="off"
                                        id="name"
                                        name="name"
                                        onChange={this.handleChange}
                                        value={this.state.name}
                                        className="w-full h-10 px-4 text-sm text-white peer appearance-none bg-transparent outline-none border-dark form-input"
                                    />
                                    <label
                                        htmlFor="name"
                                        className="text-white transform transition-all absolute top-0 left-0 h-full flex items-center pl-2 text-sm group-focus-within:text-xs peer-valid:text-xs group-focus-within:h-1/2 peer-valid:h-1/2 group-focus-within:-translate-y-full peer-valid:-translate-y-full group-focus-within:pl-0 peer-valid:pl-0"
                                    >
                                        Full name
                                    </label>
                                </div>
                                {/* <div className="mt-2.5 border-b border-goldt">
                                    <label
                                        htmlFor="name"
                                        className="transform transition-all absolute top-0 left-0 h-full flex items-center pl-2 text-sm group-focus-within:text-xs peer-valid:text-xs group-focus-within:h-1/2 peer-valid:h-1/2 group-focus-within:-translate-y-full peer-valid:-translate-y-full group-focus-within:pl-0 peer-valid:pl-0 text-goldt"
                                    >
                                        Full name
                                    </label>
                                    <input
                                        required
                                        autoComplete="off"
                                        type="text"
                                        // placeholder="Full name"
                                        id="name"
                                        name="name"
                                        className="appearance-none text-gray-100 placeholder:text-gray-300 bg-transparent border-none w-full text-gray-200 mr-3 py-1 px-2 leading-tight focus:outline-goldt"
                                        onChange={this.handleChange}
                                        value={this.state.name}
                                    />
                                </div> */}
                                {errors.name && (
                                    <div className="error">
                                        {errors.name[0]}
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className=" relative group mt-2.5 border-b border-goldt">
                                    <input
                                        required
                                        autoComplete="off"
                                        type="text"
                                        id="company"
                                        // placeholder="Company"
                                        name="company"
                                        onChange={this.handleChange}
                                        value={this.state.company}
                                        className="w-full h-10 px-4 text-sm text-white peer appearance-none bg-transparent outline-none border-dark form-input"
                                    />
                                    <label
                                        htmlFor="Company"
                                        className="text-white transform transition-all absolute top-0 left-0 h-full flex items-center pl-2 text-sm group-focus-within:text-xs peer-valid:text-xs group-focus-within:h-1/2 peer-valid:h-1/2 group-focus-within:-translate-y-full peer-valid:-translate-y-full group-focus-within:pl-0 peer-valid:pl-0"
                                    >
                                        Company
                                    </label>
                                </div>
                                {/* <div className="mt-2.5 border-b border-goldt">
                                    <label
                                        htmlFor="company"
                                        className="block text-sm mb-2 font-semibold leading-6 text-gray-300"
                                    >
                                        Company
                                    </label>
                                    <input
                                        required
                                        autoComplete="off"
                                        type="text"
                                        id="company"
                                        // placeholder="Company"
                                        name="company"
                                        className="appearance-none text-gray-100 placeholder:text-gray-300 bg-transparent border-none w-full text-gray-200 mr-3 py-1 px-2 leading-tight focus:outline-goldt"
                                        onChange={this.handleChange}
                                        value={this.state.company}
                                    />
                                </div> */}
                                {errors.company && (
                                    <div className="error">
                                        {errors.company[0]}
                                    </div>
                                )}
                            </div>

                            <div className=" relative group mt-2.5 border-b border-goldt">
                                <input
                                    required
                                    autoComplete="off"
                                    type="text"
                                    id="email"
                                    name="email"
                                    onChange={this.handleChange}
                                    value={this.state.email}
                                    className="w-full h-10 px-4 text-sm text-white peer appearance-none bg-transparent outline-none border-dark focus:outline-0 form-input"
                                />
                                <label
                                    htmlFor="Email"
                                    className="text-white transform transition-all absolute top-0 left-0 h-full flex items-center pl-2 text-sm group-focus-within:text-xs peer-valid:text-xs group-focus-within:h-1/2 peer-valid:h-1/2 group-focus-within:-translate-y-full peer-valid:-translate-y-full group-focus-within:pl-0 peer-valid:pl-0"
                                >
                                    Email
                                </label>
                            </div>
                            {/* <div className="mt-2.5 border-b border-goldt">
                                <label
                                    htmlFor="email"
                                    className="block text-sm mb-2 font-semibold leading-6 text-gray-300"
                                >
                                    Email
                                </label>
                                <input
                                    required
                                    autoComplete="off"
                                    type="email"
                                    // placeholder="Email"
                                    id="email"
                                    name="email"
                                    onChange={this.handleChange}
                                    value={this.state.email}
                                    className="appearance-none text-gray-100 placeholder:text-gray-300 bg-transparent border-none w-full text-gray-200 mr-3 py-1 px-2 leading-tight focus:outline-goldt"
                                />
                            </div> */}
                            {errors.email && (
                                <div className="error text-goldt">
                                    {errors.email[0]}
                                </div>
                            )}

                            <div className=" relative group mt-2.5 border-b border-goldt">
                                <input
                                    required
                                    type="text"
                                    autoComplete="off"
                                    id="phone"
                                    name="phone"
                                    onChange={this.handleChange}
                                    value={this.state.phone}
                                    className="w-full h-10 px-4 text-sm text-white peer appearance-none bg-transparent outline-none border-dark form-input"
                                />
                                <label
                                    htmlFor="Phone"
                                    className="text-white transform transition-all absolute top-0 left-0 h-full flex items-center pl-2 text-sm group-focus-within:text-xs peer-valid:text-xs group-focus-within:h-1/2 peer-valid:h-1/2 group-focus-within:-translate-y-full peer-valid:-translate-y-full group-focus-within:pl-0 peer-valid:pl-0"
                                >
                                    Phone
                                </label>
                            </div>
                            {/* <div className="mt-2.5 border-b border-goldt">
                                {isTyping ? (
                                    <label
                                        htmlFor="phone"
                                        className="block  text-sm mb-2 font-semibold leading-6 text-gray-300"
                                    >
                                        Phone
                                    </label>
                                ) : (
                                    <div></div>
                                )}

                                <input
                                    required
                                    type="text"
                                    autoComplete="off"
                                    id="phone"
                                    placeholder="Phone"
                                    name="phone"
                                    onChange={this.handleChange}
                                    value={this.state.phone}
                                    className="appearance-none text-gray-100 placeholder:text-gray-300 bg-transparent border-none w-full text-gray-200 mr-3 py-1 px-2 leading-tight focus:outline-goldt"
                                />
                            </div> */}
                            {errors.phone && (
                                <div className="error">{errors.phone[0]}</div>
                            )}

                            <div className="mt-2.5">
                                <label
                                    htmlFor="message"
                                    className="block text-sm mb-2 font-semibold leading-6 text-white"
                                >
                                    Message
                                </label>
                                <div className="border rounded border-goldt">
                                    <textarea
                                        required
                                        id="message"
                                        name="message"
                                        onChange={this.handleChange}
                                        value={this.state.message}
                                        className="h-24 appearance-none text-gray-100 placeholder:text-gray-300 bg-transparent border-none w-full text-gray-200 mr-3 py-1 px-2 leading-tight focus:outline-goldt"
                                    />
                                </div>
                            </div>
                            {errors.message && (
                                <div className="error">{errors.message[0]}</div>
                            )}
                            <ReCAPTCHA
                                sitekey="6Lf30MEmAAAAAA4_iPf9gTM1VMNO9iSFKyaAC1P0"
                                onChange={this.handleRecaptchaChange}
                                onExpired={this.handleRecaptchaExpired}
                                className="mt-4 flex justify-center"
                            size="normal" // Set the desired size here: "compact", "normal", or "invisible"
                            render="explicit" // Use "explicit" rendering
                            theme="dark" // Set the desired theme: "light" or "dark"
                            style={{ transform: 'scale(0.8)' }} // Use CSS transform to adjust the size
                            />
                            <div className="mt-8 flex justify-right w-full">
                                <button
                                    type="submit"
                                    disabled={!recaptchaValue || isLoading}
                                    className="block w-full md:ml-auto md:w-4/12 rounded-3xl bg-gradient-to-r from-goldl to-goldd hover:from-goldd hover:to-goldl px-3.5 py-2.5 text-center text-md font-bold text-dark shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goldt"
                                >
                                    {isLoading ? (
                                        <div className="inset-0 flex justify-center items-center bg-opacity-50">
                                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-dark"></div>
                                        </div>
                                    ) : (
                                        "Send"
                                    )}
                                </button>
                            </div>
                        </div>
                        {success && (
                            <div
                                className="bg-goldt mx-8 border border-goldd text-dark px-4 py-3 rounded relative mb-4 sm:col-span-2"
                                role="alert"
                            >
                                <strong className="font-bold">Success!</strong>
                                <span className="block sm:inline">
                                    Your message has been sent.
                                </span>
                                <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                    <svg
                                        onClick={() =>
                                            this.setState({ success: false })
                                        }
                                        className="fill-current h-6 w-6 text-dark cursor-pointer"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 1024 1024"
                                    >
                                        <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />{" "}
                                    </svg>
                                </span>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        );
    }
}

export default ContactUsForm;
