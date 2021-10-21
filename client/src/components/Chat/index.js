import "../../style/chat.css";
// import Topbar from "./Topbar";
import Navigation from "../App/Navigation";
import BottomNav from "../App/Navigation/BottomNav";
import Thread from "./Thread";
import Message from "./Message";
import ChatOnline from "./ChatOnline";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../App/Authentication";
import api from "../../utils/api";
import { io } from "socket.io-client";

export default function Chat() {
  const [chatThreads, setChatThreads] = useState([]);
  const [currentChatThread, setCurrentChatThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [matches, setMatches] = useState([]);
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


  //Load and set all matches from the database
  useEffect(() => {
    var listings = [];
    //Fetches all listings for the signed in flat account, to then be used to fetch their matches
    async function getListings() {
      api.getFlatListingById(user.id, jwt)
        .then((res) => {
          listings = res.data
          console.log(res.data)
        }).catch((error) => {
          console.log('error ' + error);
        });
      listings.forEach(listing => {
        getListingMatches(listing);
      })
    }

    //Fetches all successful matches for a given listing
    async function getListingMatches(listing) {
      api.getListingMatches(listing.id, jwt)
        .then((res) => {
          setMatches(res.data);
          console.log(res.data)
        }).catch((error) => {
          console.log('error ' + error);
        });
    }

    //Fetches all successful matches for the signed in flatee
    async function getFlateeMatches() {
      api.getFlateeMatches(user.id, jwt)
        .then((res) => {
          setMatches(res.data)
          console.log(res.data)
        }).catch((error) => {
          console.log('error ' + error);
        });
    }

    // Fetch depending on user role
    if (user && user.role === 'flat') {
      getListings();
      socket.current.emit("addUser", user.id);

      // For Each match add its corrosponding chat or create one
      matches.map((match) => (
        api.getChatByMatchId(match.id, jwt)
        .then((res) => {
          setChatThreads([...chatThreads, res.data])
        })
      ))
    } else if (user && user.role === 'flatee') {
      getFlateeMatches();
      socket.current.emit("addUser", user.id);

      // For Each match add its corrosponding chat or create one
      matches.map((match) => (
        api.getChatByMatchId(match.id, jwt)
        .then((res) => {
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
    if (currentChatThread && user && user.role === 'flat') {
      api.getMatchById(currentChatThread.matchId)
      .then((res) => {
        receiverId = res.data.flateeId;
      })
    } else if (currentChatThread && user && user.role === 'flatee') {
      api.getMatchById(currentChatThread.matchId)
      .then((res) => {
        receiverId = res.data.listingId;
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
      <Navigation />
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
      <BottomNav />
    </>
  );
}
