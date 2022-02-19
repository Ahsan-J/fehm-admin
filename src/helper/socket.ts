import { io } from "socket.io-client";
let socket: any = null;

export const init = (user_id: string | number) => {
    socket = io(`${process.env.NEXT_PUBLIC_BASE_URL}/user-${user_id}`, { transports: ['websocket', 'polling'] });
    return socket;
}

export const getSocket = (user_id: string | number) => {
    return !socket ? init(user_id) : socket;
}