import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import {
    Phone,
    PhoneOff,
    Mic,
    MicOff,
    Video,
    VideoOff,
    MonitorUp,
} from "lucide-react";

export default function VideoCall({ isOpen, onClose }) {

    const socket = useAuthStore((state) => state.socket);

    const { selectedUser } = useChatStore();

    const [seconds, setSeconds] = useState(0);


    const localVideo = useRef(null);
    const remoteVideo = useRef(null);

    const peerConnection = useRef(null);
    const localStream = useRef(null);
    const pendingCandidates = useRef([]);

    const [calling, setCalling] = useState(false);
    const [incomingCall, setIncomingCall] = useState(null);
    const [inCall, setInCall] = useState(false);

    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    useEffect(() => {
        console.log("VideoCall mounted");
    }, []);

    const configuration = {
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302",
            },
        ],
    };
    const createPeerConnection = () => {

        peerConnection.current = new RTCPeerConnection(configuration);

        peerConnection.current.ontrack = (event) => {

            const stream = event.streams[0];

            if (remoteVideo.current) {
                remoteVideo.current.srcObject = stream;
            }

            const audioTrack = stream.getAudioTracks()[0];

            if (audioTrack) {

                audioTrack.onmute = () => {
                    console.log("Remote mic muted");
                };

                audioTrack.onunmute = () => {
                    console.log("Remote mic unmuted");
                };

            }

            const videoTrack = stream.getVideoTracks()[0];

            if (videoTrack) {

                videoTrack.onended = () => {
                    console.log("Remote camera off");
                };

            }

        };

        peerConnection.current.onicecandidate = (event) => {

            if (event.candidate) {

                socket.emit("ice-candidate", {

                    to: selectedUser._id,

                    candidate: event.candidate.toJSON()

                });

            }

        };
        peerConnection.current.onconnectionstatechange = () => {

            console.log(
                "Connection:",
                peerConnection.current.connectionState
            );

            if (
                peerConnection.current.connectionState === "failed" ||
                peerConnection.current.connectionState === "closed"
            ) {
                cleanupCall();
            }

        };
        peerConnection.current.oniceconnectionstatechange = () => {

            console.log(
                "ICE:",
                peerConnection.current.iceConnectionState
            );

        };

    };
    const startCall = async () => {
        try {
            setCalling(true);
            if (localStream.current) {
                localStream.current.getTracks().forEach(track => track.stop());
                localStream.current = null;
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            localStream.current = stream;
            if (localVideo.current) {
                localVideo.current.srcObject = stream;
            }

            createPeerConnection();

            stream.getTracks().forEach(track => {
                peerConnection.current.addTrack(track, stream);
            });

            const offer = await peerConnection.current.createOffer();

            await peerConnection.current.setLocalDescription(offer);

            socket.emit("call-user", {
                to: selectedUser._id,
                offer,
            });


        } catch (err) {

            cleanupCall();
            console.error("getUserMedia Error:", err);
            console.log("Error name:", err.name);
            console.log("Error message:", err.message);

            switch (err.name) {
                case "NotAllowedError":
                    alert("Camera/Microphone permission denied.");
                    break;

                case "NotFoundError":
                    alert("No camera or microphone found.");
                    break;

                case "NotReadableError":
                    alert("Camera or microphone is being used by another application.");
                    break;

                default:
                    alert(err.message);
            }
        }
    };
    const answerCall = async () => {
        try {

            if (localStream.current) {
                localStream.current.getTracks().forEach(track => track.stop());
                localStream.current = null;
            }

            const stream = await navigator.mediaDevices.getUserMedia({

                video: true,

                audio: true,

            });
            if (!incomingCall) return;

            localStream.current = stream;

            localVideo.current.srcObject = stream;

            createPeerConnection();

            stream.getTracks().forEach(track => {

                peerConnection.current.addTrack(track, stream);

            });

            await peerConnection.current.setRemoteDescription(
                new RTCSessionDescription(incomingCall.offer)
            );

            for (const candidate of pendingCandidates.current) {
                await peerConnection.current.addIceCandidate(
                    new RTCIceCandidate(candidate)
                );
            }

            pendingCandidates.current = [];

            const answer = await peerConnection.current.createAnswer();

            await peerConnection.current.setLocalDescription(answer);

            socket.emit("answer-call", {
                to: incomingCall.from,
                answer,
            });

            setIncomingCall(null);

            setInCall(true);
        }
        catch (err) {

            cleanupCall();

            if (err.name === "NotAllowedError") {
                alert("Please allow camera and microphone.");
            } else {
                alert(err.message);
            }
        }

    };
    const cleanupCall = () => {
        if (!peerConnection.current && !localStream.current) return;

        if (peerConnection.current) {
            peerConnection.current.ontrack = null;
            peerConnection.current.onicecandidate = null;
            peerConnection.current.close();
            peerConnection.current = null;
        }

        if (localStream.current) {
            localStream.current.getTracks().forEach(track => track.stop());
            localStream.current = null;
        }

        if (localVideo.current) localVideo.current.srcObject = null;
        if (remoteVideo.current) remoteVideo.current.srcObject = null;

        pendingCandidates.current = [];

        setIncomingCall(null);
        setCalling(false);
        setInCall(false);
        setSeconds(0);
        setMicOn(true);
        setCameraOn(true);

        onClose?.();
    };
    const endCall = () => {
        socket.emit("end-call", {
            to: selectedUser._id,
        });

        cleanupCall();
    };
    const toggleMic = () => {
        if (!localStream.current) return;

        localStream.current.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
        });

        const enabled = localStream.current
            .getAudioTracks()[0]
            .enabled;

        setMicOn(enabled);

    };

    const toggleCamera = () => {

        if (!localStream.current) return;

        localStream.current.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled;
        });

        const enabled = localStream.current
            .getVideoTracks()[0]
            .enabled;

        setCameraOn(enabled);

    };


    // 👇 ADD HERE
    const shareScreen = async () => {
        try {

            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
            });

            const screenTrack = screenStream.getVideoTracks()[0];

            const sender = peerConnection.current
                .getSenders()
                .find(sender => sender.track && sender.track.kind === "video");

            if (sender) {
                sender.replaceTrack(screenTrack);
            }

            localVideo.current.srcObject = screenStream;

            screenTrack.onended = async () => {

                const cameraStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                localVideo.current.srcObject = cameraStream;

                localStream.current = cameraStream;
                screenStream.getTracks().forEach(track => track.stop());

                cameraStream.getTracks().forEach(async (track) => {

                    const sender = peerConnection.current
                        .getSenders()
                        .find(s => s.track?.kind === track.kind);

                    if (sender) {
                        await sender.replaceTrack(track);
                    }

                });
            };

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        console.log("Registering socket listeners");
        if (!socket) return;

        socket.on("incoming-call", (data) => {
            console.log("Incoming call received:", data);
            setIncomingCall(data);
        });


        socket.on("call-answered", async ({ answer }) => {

            if (!peerConnection.current) return;

            await peerConnection.current.setRemoteDescription(
                new RTCSessionDescription(answer)
            );

            setCalling(false);
            setInCall(true);
        });


        socket.on("ice-candidate", async ({ candidate }) => {

            if (!candidate) return;

            if (!peerConnection.current) {
                pendingCandidates.current.push(candidate);
                return;
            }

            if (!peerConnection.current.remoteDescription) {
                pendingCandidates.current.push(candidate);
                return;
            }

            try {
                await peerConnection.current.addIceCandidate(
                    new RTCIceCandidate(candidate)
                );
            } catch (err) {
                console.log("ICE Candidate Error:", err);
            }
        });

        socket.on("call-rejected", () => {

            alert("Call Rejected");

            cleanupCall();

        });
        socket.on("end-call", () => {

            alert("Call ended");

            cleanupCall();

        });

        return () => {
            socket.off("incoming-call");
            socket.off("call-answered");
            socket.off("ice-candidate");
            socket.off("call-rejected");
            socket.off("end-call");
        };

    }, [socket]);
    useEffect(() => {
        if (isOpen && !calling && !inCall && !localStream.current) {
            startCall();
        }
    }, [isOpen]);
    useEffect(() => {

        return () => {
            cleanupCall();
        };

    }, []);
    useEffect(() => {

        const handleUnload = () => {

            if (selectedUser) {

                socket.emit("end-call", {
                    to: selectedUser._id,
                });

            }

            cleanupCall();

        };

        window.addEventListener("beforeunload", handleUnload);

        return () => {
            window.removeEventListener("beforeunload", handleUnload);
        };

    }, [selectedUser, socket]);
    useEffect(() => {

        if (!incomingCall) return;

        const timer = setTimeout(() => {

            socket.emit("call-rejected", {
                to: incomingCall.from,
            });

            cleanupCall();

        }, 30000);

        return () => clearTimeout(timer);

    }, [incomingCall]);
    useEffect(() => {

        if (!inCall) return;

        const timer = setInterval(() => {

            setSeconds(prev => prev + 1);

        }, 1000);

        return () => clearInterval(timer);

    }, [inCall]);
    return (

        <>
            {calling && (
                <h2 className="text-white text-2xl text-center mt-6">
                    Calling {selectedUser.fullName}...
                </h2>
            )}



            {incomingCall && (

                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

                    <div className="bg-slate-900 p-6 rounded-xl space-y-4">

                        <h2 className="text-xl text-white">

                            Incoming Video Call

                        </h2>

                        <div className="flex gap-4">

                            <button
                                onClick={answerCall}
                                className="btn btn-success"
                            >

                                Accept

                            </button>

                            <button
                                onClick={() => {

                                    socket.emit("call-rejected", {
                                        to: incomingCall.from,
                                    });

                                    cleanupCall();

                                }}
                                className="btn btn-error"
                            >

                                Reject

                            </button>

                        </div>

                    </div>

                </div>

            )}

            {(isOpen || calling || incomingCall || inCall) && (

                <div
                    className={`fixed inset-0 bg-black z-50 flex flex-col ${calling || inCall ? "block" : "hidden"
                        }`}
                >
                    <div className="flex-1 grid grid-cols-2">
                        <video
                            ref={localVideo}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />

                        <video
                            ref={remoteVideo}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex justify-center gap-5 p-5">
                        <div className="text-white text-lg font-semibold">

                            {Math.floor(seconds / 60)}:
                            {String(seconds % 60).padStart(2, "0")}

                        </div>

                        <button disabled={!localStream.current}
                            onClick={toggleMic}>

                            {micOn ? <Mic /> : <MicOff />}

                        </button>

                        <button disabled={!localStream.current}
                            onClick={toggleCamera}>

                            {cameraOn ? <Video /> : <VideoOff />}

                        </button>

                        <button
                            disabled={!peerConnection.current}
                            onClick={shareScreen}
                            className="btn btn-primary"
                        >
                            <MonitorUp />
                        </button>
                        <button
                            onClick={endCall}
                            className="text-red-500"
                        >

                            <PhoneOff />

                        </button>

                    </div>

                </div>

            )}

        </>

    );
}
