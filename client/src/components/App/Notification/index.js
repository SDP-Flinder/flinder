import Notification from "./Notification";
import React from "react";
import { useEffect, useState } from "react";
import api from "../../../utils/api"
import { useAuth } from "../../App/Authentication";

function Noti() {
  const { user, jwt } = useAuth();
  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    var tempNotis = [];

    async function getNotifications() {
      await api.getUsersNotifications(jwt)
        .then(res => {
          tempNotis = res.data
        })
        .catch(err => 
          console.log(err))
        
        tempNotis.forEach(notification => {
          setListItems(listItems => [...listItems, {
            UTC: Date.parse(notification.date), 
            list: [
              {
                title: notification.title,
                message: notification.message,
                link: notification.link,
                read: notification.read,
              }
            ]
          }])
      })
    }
    getNotifications();
  }, [user])

  return (
    <div className="App">
      <header className="App-header">
        <Notification listItems={listItems} jwt = {jwt} />
      </header>
    </div>
  );
}

export default Noti;