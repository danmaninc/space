import WebSocket from "ws";

interface ConnectionProps {
    roomId: number;
}
export const useConnection = ({ roomId } : ConnectionProps) => {
    const ws = new WebSocket('ws://localhost:4321/');

    ws.on('error', console.error);

    ws.on('open', function open() {
        console.log(`[WS] connected to server @ localhost:4321`)
        ws.emit("register", JSON.stringify({ username: "test", roomId: roomId }));
        console.log(`[WS] entering room ${roomId}...`);
    })

    ws.on('register-success', function regSuccess() {
        console.log(`[WS] entered room ${roomId} with username: test.`);
    })
}