import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";

export const Room = () => {
    const { id } = useParams();
    const { ws } = useContext(RoomContext);

    useEffect(() => {
        ws.emit('join-room', { roomId: id });
    }, [id])
    return (
        <p className="text-black">
            Room id is: <span className="font-semibold">{id}</span>
        </p>
    );
}