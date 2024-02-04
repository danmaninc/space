import {ChangeEvent, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/app/_hooks/redux";
import {connectToServer, disconnectFromServer} from "@/store/reducers/SocketSlice";

export function ConnectionManager() {
    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState("");
    const connected = useAppSelector((state) => state.socket.connected)
    const dispatch = useAppDispatch();

    function tryJoining() {
        dispatch(connectToServer({roomId, username}));
    }

    function tryLeaving() {
        dispatch(disconnectFromServer());
    }

    function changeUsernameValue(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.value.length <= 16) {
            setUsername(e.target.value.trim().replace(RegExp("[^A-Z]", "i"), ""))
        }
    }
    function changeRoomValue(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.value.length <= 6) {
            setRoomId(e.target.value.toUpperCase().trim().replace(RegExp("[^A-Z]"), ""))
        }
    }
    if (connected) {
        return <div className="fixed bg-gray-100 rounded-md flex flex-col select-none bottom-0 m-1 gap-1">
            <h3 className="text-center text-md">you are in room</h3>
            <h2 className="text-center text-xl font-semibold">{(roomId != "") ? roomId : "??????"}</h2>
            <button
                className="bg-gray-400 rounded-md px-1"
                onClick={tryLeaving}
            >
                leave
            </button>
        </div>
    } else {
        return <div className="fixed bg-gray-100 rounded-md flex flex-col select-none bottom-0 m-1 gap-1">
            <h3 className="text-center text-md">join your friends!</h3>
            <input
                className="bg-gray-300 text-center text-gray-700 font-medium rounded-sm w-36"
                onChange={changeUsernameValue}
                placeholder="your nickname"
                value={username}
            />
            <input
                className="bg-gray-300 text-center text-gray-700 font-medium rounded-sm w-36"
                onChange={changeRoomValue}
                placeholder="enter room code..."
                value={roomId}
            />
            <button
                className="bg-gray-400 rounded-md px-1"
                onClick={tryJoining}
            >
                join
            </button>
        </div>
    }
}