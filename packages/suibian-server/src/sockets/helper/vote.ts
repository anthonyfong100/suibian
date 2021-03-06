import socketio from "socket.io";
import { createVoteQueryPerUser, countVoteQuery } from "../../queries/vote";
import { updateUserQuery } from "../../queries/join";
import {
  votePayload,
  suibianSocket,
  VotingStatus,
  FoodVote,
  httpStatus,
} from "@suibian/commons";
import { getHawkerCenterStallName } from "../../queries/stall";
import { checkRoomCompleted } from "./room";
import { broadcastRoom } from "./messaging";

export const submitVote = async (
  socketio: socketio.Server,
  socket: suibianSocket,
  data: votePayload
) => {
  const roomCode = data.roomCode;
  const username = data.username;
  const votes = data.votes;

  //update user vote status
  await updateUserQuery(roomCode, username, {
    votingstatus: VotingStatus.completed,
  });
  const returnVotes = await createVoteQueryPerUser(data); //log to database

  if (await checkRoomCompleted(roomCode)) {
    const result = await makeResult(roomCode, 5);

    if (result) {
      const dataEmit = {
        ...result,
        httpStatus: httpStatus.ok,
      };
      return dataEmit;
    }
  }
};

export function extractTopVotes(voteResult: FoodVote[], top: number) {
  voteResult.sort((a, b) => {
    return b.count - a.count; //sort based on decreasing values for count
  });

  let numberOfResults = voteResult.length;

  // not enough results to extract
  if (top >= numberOfResults) {
    return voteResult;
  } else {
    return voteResult.slice(0, top);
  }
}

export const makeResult = async (roomCode: string, top: number) => {
  const voteCount = await countVoteQuery(roomCode); //tally the votes in the room
  console.log(voteCount);
  if (voteCount) {
    const processedVotes = extractTopVotes(voteCount, top);
    if (processedVotes) {
      const eateries = await getHawkerCenterStallName(processedVotes);

      let stallresult = {
        foodVoteResults: processedVotes,
        eatery: eateries,
      };
      return stallresult;
    }
  }
};
