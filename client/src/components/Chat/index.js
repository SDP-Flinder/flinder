import "../../style/chat.css";
// import Topbar from "./Topbar";
import Navigation from "../App/Navigation";
import BottomNav from "../App/Navigation/BottomNav";
import Thread from "./Thread";
import Message from "./Message";
import ChatOnline from "./ChatOnline";
import { useEffect, useRef, useState } from "react";
import { Role, useAuth } from "../App/Authentication";
import api from "../../utils/api";
import { io } from "socket.io-client";

export default function Chat() {
  const [chatThreads, setChatThreads] = useState([]);
  const [currentChatThread, setCurrentChatThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [matches, setMatches] = useState([]);
  const [listings, setListings] = useState([]);
  const socket = useRef();
  const { user, jwt } = useAuth();
  const scrollRef = useRef();

  // 
  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        chatId: data.chatId,
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  // Process Arriving Messages
  useEffect(() => {
    arrivalMessage && 
      (currentChatThread?.id === arrivalMessage.chatId) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChatThread]);


  // Load and set all matches from the database
  useEffect(() => {
    // Fetches all listings for the signed in flat account, 
    // to then be used to fetch their matches
    async function getListings() {
      console.log('getListingByFlatId: ' + user.id + ' jwt: ' + jwt);
      if (user && user !== null) {
        await api.getListingByFlatId(user.id, jwt)
        .then((res) => {
          // For each 
          const listings = res.data
          listings.forEach((listing) => (
            setListings([...listings, listing])
          ))
        }).catch((error) => {
          console.log('error ' + error);
        });

        // Calls GetListingMatches below to set matches for each listing
        listings.forEach(listing => {
          getListingMatches(listing);
        })
      }
    }

    // Fetches all successful matches for a given listing
    async function getListingMatches(listing) {
      console.log('getListingMatches: ' + listing.id);
      if (listing && listing !== null) {
        await api.getListingMatches(listing.id, jwt)
        .then((res) => {
          setMatches([...matches, res.data]);
          console.log(matches)
        }).catch((error) => {
          console.log('error ' + error);
        })
      }
    }

    // Fetches all successful matches for the signed in flatee
    async function getFlateeMatches() {
      console.log('getFlateeMatches: ' + user.id);
      if (user && user !== null) {
        await api.getFlateeMatches(user.id, jwt)
        .then((res) => {
          setMatches([...matches, res.data])
          console.log(matches)
        }).catch((error) => {
          console.log('error ' + error);
        });
      }
    }

    // Fetch depending on user role
    if (user && user.role === 'flat') {
      getListings();
      socket.current.emit("addUser", user.id);

      // For Each match add its corrosponding chat or create one
      matches.map(async(match) =>  (
        await api.getChatByMatchId(match.id, jwt)
        .then((res) => {
          console.log(res.data);
          setChatThreads([...chatThreads, res.data])
        })
      ))
    } else if (user && user.role === 'flatee') {
      getFlateeMatches();
      socket.current.emit("addUser", user.id);

      // For Each match add its corrosponding chat or create one
      matches.map(async (match) => (
        await api.getChatByMatchId(match.id, jwt)
        .then((res) => {
          console.log(res.data);
          if (res.data[0].length === 0){ // Create Chat
            api.addChat(jwt, {matchId: match.id, messages: []})
            .then((resp) => {
              setChatThreads([...chatThreads, resp.data]);
            })
          } else {
            setChatThreads([...chatThreads, res.data])
          }
        })
      ))
    }

  }, [user]);

  // Load messages for current chat thread
  useEffect(() => {
    if(currentChatThread != null) {
      api.getMessages(currentChatThread.id, jwt)
      .then((res) => {
        setMessages(res.data);
      })
    }
  }, [currentChatThread]);

  // Send Message
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      chatId: currentChatThread.id,
      sender: user.id,
      text: newMessage
    };

    // Find receiver's ID
    let receiverId;
    if (currentChatThread && user !== null) {
      api.getMatchById(currentChatThread.matchId)
      .then((res) => {
        if(user.role === Role.Flat) {
          receiverId = res.data.listingId
        } else if(user.role === Role.Flatee){
          receiverId = res.data.flateeId;
        }
      })
    }

    socket.current.emit("sendMessage", {
      senderId: user.id,
      receiverId,
      text: newMessage,
    });

    // Add Message to DB
    api.addMessageToChat(currentChatThread.id, jwt, message)
    .then((res) => {
      setMessages([...messages, res.data]);
      setNewMessage("");
    })
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* <Navigation /> */}
      <div className="chat">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for matches" className="chatMenuInput" />
            {console.log(chatThreads)}
            {chatThreads.map((t) => (
              <div onClick={() => setCurrentChatThread(t)}>
                <Thread thread={t} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChatThread ? (
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
        {/* <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              currentChat={currentChatThread}
              setCurrentChat={setCurrentChatThread}
            />
          </div>
        </div> */}
      </div>
      {/* <BottomNav /> */}
    </>
  );
}
