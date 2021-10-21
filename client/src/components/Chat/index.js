import "../../style/chat.css";
// import Topbar from "./Topbar";
import Navigation from "../App/Navigation";
import Thread from "./Thread";
import Message from "./Message";
import ChatOnline from "./ChatOnline";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../App/Authentication";
import axios from "axios";
import { io } from "socket.io-client";
import { Config } from "../../config";

export default function Chat() {
  const [threads, setThreads] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineMatchUsers, setOnlineMatchUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const socket = useRef();
  const { user, jwt } = useAuth();
  const scrollRef = useRef();

  //Helper with axios calls
  const instance = axios.create({
    baseURL: Config.Local_API_URL,
    timeout: 1000,
    headers: { Authorization: `Bearer ${jwt}` }
  })

  //
  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  //
  useEffect(() => {
    arrivalMessage && 
      currentChat?.matchId === arrivalMessage.sender &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);


  //Load and set all the matches from the database
  useEffect(() => {
    var listings = [];
    var tempMatches = [];
    //Fetches all listings for the signed in flat account, to then be used to fetch their matches
    async function getListings() {
      
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
      getListings();
      socket.current.emit("addUser", user.id);
      socket.current.on("getUsers", (users) => {
        setOnlineMatchUsers(
          matches.filter((f) => users.some((u) => u.id === f.flateeID))
        );
      });
    } else if (user && user.role === 'flatee') {
      getFlateeMatches();
      socket.current.emit("addUser", user.id);
      socket.current.on("getUsers", (users) => {
        setOnlineMatchUsers(
          matches.filter((f) => users.some((u) => u.id === (listings.one((l) => l.id === f.listingID))))
        );
      });
    }
  }, [user])

  useEffect(() => {
    const getThreads = async () => {
      try {
        const res = await instance.get("/chat/" + user.id);
        setThreads(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getThreads();
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await instance.get("/chat/messages/" + currentChat?.id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user.id,
      text: newMessage,
      threadId: currentChat.id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user.id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Navigation />
      <div className="chat">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for matches" className="chatMenuInput" />
            {threads.map((t) => (
              <div onClick={() => setCurrentChat(t)}>
                <Thread thread={t} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a match to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              currentChat={currentChat}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
}
