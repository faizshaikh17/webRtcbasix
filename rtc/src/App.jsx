import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [loading, setLoading] = useState(false);

  const localVideo = document.getElementById('localVideo');
  const remoteVideo = document.getElementById('remoteVideo');
  const button = document.getElementById('btn');

  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    const handleCall = async () => {
      setLoading(true); // Start loading
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log(localStream);
        localVideo.srcObject = localStream;

        const peerConnection = new RTCPeerConnection(configuration);
        localStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, localStream);
        });

        peerConnection.ontrack = (e) => {
          remoteVideo.srcObject = e.streams[0];
          setLoading(false); // Stop loading when remote stream is received
        };

        peerConnection.onicecandidate = (e) => {
          if (e.candidate) {
            console.log(e.candidate);
          }
        };

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
      } catch (err) {
        console.error("An error occurred: " + err);
        alert("Error accessing camera/microphone: " + err);
        setLoading(false); // Stop loading on error
      }
    };

    button.addEventListener('click', handleCall);

    return () => {
      button.removeEventListener('click', handleCall); // Cleanup listener
    };
  }, [localVideo, remoteVideo]); // Dependencies for useEffect

  const receiveAnswer = async (answer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const receiveCandidate = async (candidate) => {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  };

  return (
    <>
      {loading && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-5 py-2 rounded-md text-lg flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      )}
    </>
  );
}

export default App;