import axios from "axios";
import { useEffect, useState } from "react";
import "../../style/chatOnline.css";
import { Config } from "../../config"
import { useAuth } from "../App/Authentication";

export default function ChatOnline({ currentChat, setCurrentChat }) {
  const [matches, setMatches] = useState([]);
  const [onlineMatchs, setOnlineMatchs] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { jwt, user } = useAuth();

  //Helper for ease of use when making axios calls
  const instance = axios.create({
    baseURL: Config.Local_API_URL,
    timeout: 1000,
    headers: { Authorization: `Bearer ${jwt}` }
  })

//Load and set all the states with data from the database
useEffect(() => {
  var tempMatches = [];
  //Fetches all listings for the signed in flat account, to then be used to fetch their matches
  async function getListings() {
    var listings = [];
    await instance.get('/listings/flat/'.concat(user.id))
      .then(res => {
        listings = res.data
      }).catch((error) => {
        console.log('error ' + error);
      });
    listings.forEach(listing => {
      getListingMatches(listing);
    })
  }

  //Fetches all successful matches for a given listing
  async function getListingMatches(listing) {
    await instance.get('/matches/getSuccessMatchesForListing/'.concat(listing.id))
      .then(res => {
        tempMatches = res.data
      }).catch((error) => {
        console.log('error ' + error);
      });
    tempMatches.forEach(match => {
      setMatches(matches => [...matches, match])
    })
  }

  //Fetches all successful matches for the signed in flatee
  async function getFlateeMatches() {
    await instance.get('/matches/getSuccessMatchesForFlatee/'.concat(user.id))
      .then(res => {
        tempMatches = res.data
      }).catch((error) => {
        console.log('error ' + error);
      });
    setMatches(tempMatches);
  }

  //Run the code to fetch the correct data, based on the role of the account
  if (user && user.role === 'flat') {
    getListings()
  }
  else if (user && user.role === 'flatee') {
    getFlateeMatches()
  }
}, [user])

  // useEffect(() => {
  //   const getMatches = async () => {
  //     const res = await axios.get("/match/get" + currentId);
  //     setMatchs(res.data);
  //   };

  //   getMatches();
  // }, [currentId]);

  // useEffect(() => {
  //   setOnlineFriends(matchs.filter((f) => onlineMatchUsers.includes(f._id)));
  // }, [matchs, onlineMatchUsers]);

  const handleClick = async (user) => {
    try {
      const res = await instance.get(
        `/chat/${currentChat.id}`
      );
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      {onlineMatchs.map((o) => (
        <div className="chatOnlineMatch" onClick={() => handleClick(o)}>
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                o?.profilePicture
                  ? PF + o.profilePicture
                  : PF + "person/noAvatar.png"
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
        </div>
      ))}
    </div>
  );
}
