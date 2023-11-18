import { log } from "console";
import { createContext, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { useNavigate  } from "react-router-dom";

const WS = "http://localhost:8080";

export const RoomContext = createContext<null | any>(null);
const ws = socketIOClient(WS);

interface RoomProviderProps {
    children: React.ReactNode;
  }

export const RoomProvider: React.FunctionComponent<RoomProviderProps> = ({ children }) => {
    const navigate = useNavigate();
    const enterRoom = ( { roomId }: { roomId: "string"}) => {
        console.log({ roomId });
        navigate(`/room/${roomId}`)
    }
    useEffect(() => {
        ws.on('room-created', enterRoom)
    }, []);
    return(
        <RoomContext.Provider value={{ ws }}>
            { children }
        </RoomContext.Provider>
    )
}
