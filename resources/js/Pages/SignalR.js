// import * as signalR from "@microsoft/signalr";
// import * as signalRCore from "@microsoft/signalr";

// const hubConnection = new signalRCore.HubConnectionBuilder()
//     .withUrl("https://gtlslebs06-vm.gtls.com.au:2030/notificationHub", {
//         skipNegotiation: true,
//         transport: signalR.HttpTransportType.WebSockets,
//     }) // Replace with your SignalR hub URL
//     // .configureLogging(signalRCore.LogLevel.Debug)
//     .build();
// if (hubConnection.state !== signalRCore.HubConnectionState.Connected) {
//     hubConnection
//         .start()
//         .catch((error) => {
//             console.error("Error connecting to SignalR Hub:", error);
//         });
// }
// export default hubConnection;
