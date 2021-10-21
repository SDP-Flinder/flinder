import axios from "axios";
import { useEffect, useState } from "react";
import { Config } from "../../config";
import "../../style/thread.css";
import { Role, useAuth } from "../App/Authentication";

export default function Thread({ thread }) {
  const [match, setMatch] = useState(null);
  const [matchee, setMatchee] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { jwt, user } = useAuth();

  //Helper for ease of use when making axios calls
  const instance = axios.create({
    baseURL: Config.Local_API_URL,
    timeout: 1000,
    headers: { Authorization: `Bearer ${jwt}` }
  })
  useEffect(() => {
    const matchId = thread.matchId;

    const getMatch = async () => {
      try {
        const res = await instance.get("/match/" + matchId);
        setMatch(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const getMatcheeId = async () => {
      if (user.role === Role.Flatee) {
        // Get flat user id from listing
        try {
          const res = await instance.get("/listing/" + match.listingID);
          return  res.data.flat_id;
        } catch (err) {
          console.log(err);
        }
      } else if (user.role === Role.Flatee) {
        return  match.flateeID;
      }
    }

    // Get info about the other user (matchee)
    const getMatchee = async () => {
      try {
        const res = await instance("/user/" + getMatcheeId());
        setMatchee(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getMatch();
    getMatchee();
  }, [ user, thread]);

  return (
    <div className="thread">
      {/* <img
        className="threadImg"
        src={
          user?.profilePicture
            ? PF + user.profilePicture
            : PF + "person/noAvatar.png"
        }
        alt=""
      /> */}
      <span className="threadName">{matchee?.username}</span>
    </div>
  );
}

