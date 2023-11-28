import { createContext, useEffect, useReducer, useState } from "react";
import socketIOClient from "socket.io-client";
import { useNavigate  } from "react-router-dom";
import { v4 as uuidV4} from "uuid"
import Peer from "peerjs";
import { peersReducer } from "./peerReducer";
import { addPeerAction, removePeerAction } from "./peersActions";

const WS = "http://localhost:8080";

export const RoomContext = createContext<null | any>(null);
const ws = socketIOClient(WS);

interface RoomProviderProps {
    children: React.ReactNode;
  }

export const RoomProvider: React.FunctionComponent<RoomProviderProps> = ({ children }) => {
    const navigate = useNavigate();
    const [ me, setMe ] = useState<Peer>(); //represent our current peer
    const [stream, setStream ] = useState<MediaStream>();
    const [ peers, dispatch ] = useReducer(peersReducer, {});


    const enterRoom = ( { roomId }: { roomId: "string"}) => {
        console.log({ roomId });
        navigate(`/room/${roomId}`)
    }


    const getUsers = ({ participants }: { participants: string[] }) => {
        console.log(participants);
    }

    const removePeer = (peerId: string ) => {
        dispatch(removePeerAction(peerId));
    }


    useEffect(() => {
        const meId = uuidV4();
        const peer =  new Peer(meId);
        setMe(peer);


        try {
            navigator.mediaDevices.enumerateDevices()
                .then(devices => {
                    let objetctConfig = {
                        video : false,
                        audio: false
                    }

                    const hasVideoDevice = devices.some(device => device.kind === 'videoinput');
                    const hasAudioDevice = devices.some(device => device.kind === 'audioinput');

                    if(hasVideoDevice) objetctConfig.video = true;
                    if(hasAudioDevice) objetctConfig.audio = true;

                    if (hasVideoDevice || hasAudioDevice) {
                        navigator.mediaDevices.getUserMedia(objetctConfig)
                            .then((stream) => {
                                setStream(stream);
                            })
                            .catch(error => {
                                console.error('Erro ao acessar a câmera/microfone:', error);
                            });
                    } else {
                        console.error('Nenhum dispositivo de câmera/microfone encontrado.');
                    }
                })
                .catch(error => {
                    console.error('Erro ao enumerar dispositivos:', error);
                });
        } catch (error) {
            console.error('Erro ao tentar acessar a câmera/microfone:', error);
        }


        ws.on('room-created', enterRoom)
        ws.on('get-users', getUsers)
        ws.on('user-disconected', removePeer)

    }, []);

    useEffect(()=> {
        if(!me) return;
        if(!stream) return;

        ws.on('user-joined', ({ peerId }) => {
            const call = me.call(peerId, stream);
            call.on("stream", ( peerStream ) => {
                dispatch(addPeerAction(peerId, peerStream));
            })
        })

        me.on('call', (call) => {
            call.answer(stream);
            call.on("stream", ( peerStream ) => {
                dispatch(addPeerAction(call.peer, peerStream));
            })
        })

    }, [me, stream])

    return(
        <RoomContext.Provider value={{ ws, me, stream, peers }}>
            { children }
        </RoomContext.Provider>
    )
}
