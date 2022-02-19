import { useEffect, useState } from "react";
import { getSocket, init } from "../helper/socket";
import { useDispatch, useSelector } from "react-redux";
import { getPeerConnection, setPeerConnection } from "../helper/peerconnection";
import { useRTCClient } from "../helper/rtcClient";
import { RootState } from "../redux/types";
import { IUser } from "../model/user";
let isAlreadyCalling = false;

const useSocket = () => {
    const [callerInfo, setCallerInfo] = useState()
    const { acceptCall, callUser, processAfterAccept } = useRTCClient();
    const user: IUser = useSelector((store: RootState) => store.auth.user)

    useEffect(() => {
        if (user?.id) {
            init(user?.id);
        }
    }, [user]);

    // ********************************* socket for calling *********************************

    useEffect(() => {
        if (!user?.id) return () => { };
        console.log("Accept Registered")
        const socket = getSocket(user?.id);
        socket.on("call-made", (data: any) => {
            console.log("I am getting a call", data);
            setCallerInfo(data)
            acceptCall(data)
        });
        return () => {
            socket.off("call-made");
        };
    }, [acceptCall, user?.id]);

    useEffect(() => {
        if (!user?.id) return () => { };
        const socket = getSocket(user?.id);
        socket.on("icecandidate-receive", async (data: any) => {
            console.log("Received Ice Event ", data)
            const peerConnection = getPeerConnection();
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(JSON.parse(data)))
            }
            catch (e) {
                console.error(data, e)
            }
        });
        return () => {
            socket.off("icecandidate-receive");
        };
    }, [user?.id]);

    useEffect(() => {
        if (!user?.id) return () => { };
        const socket = getSocket(user?.id);
        socket.on("answer-made", async (data: any) => {
            console.log("Call Accepted", data)
            setCallerInfo(data);
            processAfterAccept(data)
        });
        return () => {
            socket.off("answer-made");
        };
    }, [processAfterAccept, user?.id]);

    useEffect(() => {
        if (!user?.id) return () => { };
        const socket = getSocket(user?.id);
        socket.on("end-call", async () => {
            const peerConnection = getPeerConnection();
            peerConnection.close();
            setPeerConnection(null);
            socket.emit("request-end-call", {
                to: callerInfo,
                from: user?.id,
            });
        });
        return () => {
            socket.off("end-call");
        };
    }, [callerInfo, user?.id]);

    if (user?.id == "AKIHmsfIIo72Fq9t2hBAz") {
        return null;
    }

    return (
        <button onClick={() => callUser("AKIHmsfIIo72Fq9t2hBAz")}>
            Call
        </button>
    )
};
export default useSocket;
