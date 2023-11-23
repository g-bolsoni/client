import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";

export const Room = () => {
    const { id } = useParams();
    const { ws, me } = useContext(RoomContext);

    useEffect(() => {

        if (me) ws.emit('join-room', { roomId: id, peerId: me._id });

    }, [id, me, ws])
    return (
        <p className="text-black">
            Room id is: <span className="font-semibold">{id}</span>
        </p>
    );
}