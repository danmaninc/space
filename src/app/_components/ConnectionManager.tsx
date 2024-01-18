import {ChangeEvent, MouseEventHandler, useState} from "react";

export function ConnectionManager() {
    const [nickname, setNickname] = useState("");
    const [room, setRoom] = useState("");


    function tryJoining() {

    }
    function changeNicknameValue(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.value.length <= 16) {
            setNickname(e.target.value.trim().replace(RegExp("[^A-Z]", "i"), ""))
        }
    }
    function changeRoomValue(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.value.length <= 6) {
            setRoom(e.target.value.toUpperCase().trim().replace(RegExp("[^A-Z]"), ""))
        }
    }

    return <div className="fixed bg-gray-100 rounded-md flex flex-col select-none bottom-0 m-1 gap-1">
        <h3 className="text-center text-md">join your friends!</h3>
        <input
            className="bg-gray-300 text-center text-gray-700 font-medium rounded-sm w-36"
            onChange={changeNicknameValue}
            placeholder="your nickname"
            value={nickname}
        />
        <input
            className="bg-gray-300 text-center text-gray-700 font-medium rounded-sm w-36"
            onChange={changeRoomValue}
            placeholder="enter room code..."
            value={room}
        />
        <button
            className="bg-gray-400 rounded-md px-1"
            onClick={tryJoining}
        >
            join
        </button>
    </div>
}