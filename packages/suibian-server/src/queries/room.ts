import path from "path";
import Rooms from "../models/rooms.model";
import Join from "../models/testing/join.model";
import shortid from "shortid";
import { sendError } from "../sockets/messaging";
shortid.characters(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);

export const createRoomQuery = async (): Promise<void | string> => {
    try {
        const roomcode = shortid.generate();
        const room = await Rooms.create({
            roomcode,
            roomstatus: "open",
            numberparticipants: 1 //user automatically joins the room he creates
        });
        return roomcode;
    } catch (err) {
        console.log(err);
    }
};

export const joinRoomQuery = async (username: string, roomcode: string) => {
    try {
        await Join.create({
            username,
            roomcode,
            votingStatus: "waiting"
        });
    } catch (err) {
        console.log(err);
    }
};

export const getRoomDetailsQuery = async (roomcode: string) => {};
