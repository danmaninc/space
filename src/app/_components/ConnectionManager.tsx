import {ChangeEvent, useState} from "react";

export function ConnectionManager() {
    const [room, setRoom] = useState("");

    function changeInputValue(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.value.length <= 6) {
            setRoom(e.target.value.toUpperCase().trim().replace(RegExp("[^A-Z]"), ""))
        }
    }

    return <div className="fixed bg-gray-100 rounded-md flex flex-col select-none bottom-0 m-1 gap-1">
        <h3 className="text-center text-md">join your friends!</h3>
        <input
            className="bg-gray-300 text-center text-gray-700 font-medium rounded-sm w-36"
            onChange={changeInputValue}
            placeholder="enter room code..."
            value={room}
        />
        <button className="bg-gray-400 rounded-md px-1">join</button>
    </div>
}