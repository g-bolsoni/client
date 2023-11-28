import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import { VideoPlayer } from "../components/VideoPlayer";
import { PeerState } from "../context/peerReducer";
import { ShareScreenButon } from "../components/ShareScreenButon";

export const Room = () => {
    const { id } = useParams();
    const { ws, me, stream, peers, shareScreen} = useContext(RoomContext);

    useEffect(() => {

        if (me) ws.emit('join-room', { roomId: id, peerId: me._id });

    }, [id, me, ws])
    return (
        <>
            <p className="text-black">
                Room id is: <span className="font-semibold">{id}</span>
            </p>

            <div className="grid grid-cols-4 gap-4">
                <VideoPlayer stream={stream} />
                {Object.values(peers as PeerState).map( peer => (
                    <VideoPlayer stream={peer.stream} />
                ))}
            </div>
            <div className="fixed bottom-0 p-6 w-full flex justify-center items-center border-t-2">
                <ShareScreenButon onClick={shareScreen} />
            </div>

        </>
    );
}