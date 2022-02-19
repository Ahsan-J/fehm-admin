import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { IUser } from "../model/user";
import { RootState } from "../redux/types";
import { getPeerConnection, setPeerConnection } from './peerconnection';
import { getSocket } from "./socket";

const offerOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: false,
    voiceActivityDetection: false
};

export const useRTCClient = () => {
    const localStream = useRef<any>(null);
    const user: IUser = useSelector((store: RootState) => store.auth.user);

    const callUser = useCallback(async (user_id) => {
        const devices = await navigator.mediaDevices.enumerateDevices()
        if (devices.filter(d => d.kind == "audioinput").length == 0) return alert("No Input media detected");
        
        const peerConnection: RTCPeerConnection = getPeerConnection();

        const socket = getSocket(user.id);
        localStream.current = localStream.current || await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const remoteVideo = document.querySelector<HTMLAudioElement>('audio#remoteVideo');
        if (!remoteVideo) return console.log("Element missing")

        peerConnection.addEventListener("track", (e: any) => {
            console.log("Add Track From Peer after calling", e);
            if (remoteVideo.srcObject !== e.streams[0]) {
                remoteVideo.srcObject = e.streams[0];
                console.log('Received remote stream');
            }
        });

        peerConnection.addEventListener("icecandidate", (event: any) => {
            if (event.candidate && event.candidate.candidate) {
                console.log("Sending Ice Candidate", event.candidate);
                socket.emit("icecandidate-sent", {
                    candidate: JSON.stringify(event.candidate),
                    user_id,
                })
            }
        });

        localStream.current.getAudioTracks().forEach((track: any) => {
            console.log("Add Track From Stream", track);
            peerConnection.addTrack(track, localStream.current);
        });

        const offer = await peerConnection.createOffer(offerOptions);
        await peerConnection.setLocalDescription(offer);
        setPeerConnection(peerConnection);
        socket.emit("call-user", {
            offer,
            to: user_id, // who is receiving
            from: user.id, // who is calling
        });
    }, [user]);

    const endCall = useCallback((user_id) => {
        const socket = getSocket(user.id);
        socket.emit('request-end-call', {
            to: user_id,
            from: user.id,
        });
    }, [user])

    const acceptCall = useCallback(async (data) => {

        const devices = await navigator.mediaDevices.enumerateDevices()
        if (devices.filter(d => d.kind == "audioinput").length == 0) return alert("No Input media detected");
        console.log("Accepting the Call", data);
        const peerConnection: RTCPeerConnection = getPeerConnection();
        const socket = getSocket(user.id);

        peerConnection.addEventListener("icecandidate", (event: any) => {
            if (event.candidate && peerConnection.localDescription?.type) {
                console.log("Sending Ice Candidate", event);
                socket.emit("icecandidate-sent", {
                    candidate: JSON.stringify(event.candidate),
                    user_id:data.from,
                })
            }
        });

        localStream.current = localStream.current || await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        
        const remoteVideo = document.querySelector<HTMLAudioElement>('audio#remoteVideo');
        if (!remoteVideo) return console.log("Element missing")
        
        peerConnection.addEventListener("track", (e: any) => {
            console.log("Add Track From Peer after accepting", e);
            if (remoteVideo.srcObject !== e.streams[0]) {
                remoteVideo.srcObject = e.streams[0];
                console.log('Received remote stream');
            }
        });

        await peerConnection.setRemoteDescription(data.offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        localStream.current.getAudioTracks().forEach((track: any) => {
            console.log("Add Track From Stream", track);
            peerConnection.addTrack(track, localStream.current);
        });

        // peerConnection.addStream(localStream.current)

        setPeerConnection(peerConnection)

        socket.emit("make-answer", {
            answer,
            from: data.from, // who is calling
            to: data.to, // who is receiving
        });
    }, [user?.id])

    const processAfterAccept = useCallback(async (data: any) => {
        const peerConnection: RTCPeerConnection = getPeerConnection();
        const socket = getSocket(user.id);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));            
        setPeerConnection(peerConnection)
        
    }, [user?.id])

    return {
        localStream: localStream.current,
        callUser,
        endCall,
        processAfterAccept,
        acceptCall
    }
};