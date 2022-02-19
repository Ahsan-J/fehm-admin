let pc: RTCPeerConnection | null = null;

const defaultRTCConfig: RTCConfiguration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const createNewPeerConnection = (configuration = defaultRTCConfig) => {
    console.log("Creating New Connection")
    pc = new RTCPeerConnection(configuration);

    // pc.addEventListener("icecandidate", (event) => {
    //     if (event.candidate && (!pc || !pc?.remoteDescription)) {
    //         console.log(event)
    //         // pc?.addIceCandidate(event.candidate)
    //     }
    //   });

    pc.addEventListener("connectionstatechange", (event) => {
        if (pc?.connectionState === "connected") {
            console.log("Peer Connected", event);
        }
        if (pc?.connectionState === "disconnected") {
            console.log("Disconnected Peer connection", event);
        }
    });

    return pc;
};

export const getPeerConnection = (configuration = defaultRTCConfig) => {
    if (pc) return pc;
    else return createNewPeerConnection(configuration)
};

export const setPeerConnection = (npc: any) => (pc = npc); // incase a pc is needed an update
