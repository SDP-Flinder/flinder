import React, {useState, useEffect, useMemo} from 'react';
import _isEqual from 'lodash/isEqual';
import CloseIcon from '@material-ui/icons/Close';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import TinderCard from 'react-tinder-card';
import api from '../../../utils/api';
import './styles.css';
import { useAuth } from '../../App/Authentication';
import ShowInfo from '../ShowInfo';
import { Typography } from '@material-ui/core';
import {WaveSpinner} from "react-spinners-kit";

// create cards component and export it
const CardsForListing = (props) => {
  const alreadyRemoved = [];
  const { user, jwt } = useAuth();
  const [people, setPeople] = useState([]);
  const [readMore, setReadMore] = useState(null);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const childRefs = useMemo(() => Array(people.length).fill(0).map((i) => React.createRef()));

  const listingID = props.listingID; // RETRIEVE LISTING ID
  let matchparams = {
    listingID: listingID,
  };

  // use effect to gather potential matches for this listing
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Load listings from API
      api.getListingMatches(user.id, jwt)
      .then((response) => {
        console.log(response.data)
        setPeople(response.data)
        setLoading(false);
      })
      .catch(function (error) {
          console.log(error)
      })}
    fetchData();
  }, [listingID]);

  // swipe function
  const swiped = (direction, person) => {
    matchparams = {
      flateeUsername: person.username,
      flateeID: person.id,
      listingUsername: user.username,
      listingID: listingID,
    };
    if (_isEqual(direction, 'left')) {
      api.unmatch(jwt, matchparams);
    } else if (_isEqual(direction, 'right')) {
      api.addFlatee(jwt, matchparams);
    }
    alreadyRemoved.push(person.username);

    setShowMore(true);
    setReadMore(null);
  };

  // automate swiping feature through buttons
  const swipe = (dir) => {
    const cardsLeft = people.filter((person) => !alreadyRemoved.includes(person.username));
    if (cardsLeft.length) {
      // eslint-disable-next-line max-len
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].username; // Find the card object to be removed
      // eslint-disable-next-line max-len
      const index = people.map((person) => person.username).indexOf(toBeRemoved); // Find the index of which to make the reference to
      // eslint-disable-next-line max-len
      alreadyRemoved.push(toBeRemoved); // Make sure the next card gets removed next time if this card do not have time to exit the screen
      childRefs[index].current.swipe(dir); // Swipe the card!
    }
  };

  // show additional info of card if triggered
  const changeText = (person) => {
    setShowMore(!showMore);
    if (showMore) {
      let smoker = '';
      if (_isEqual(person.checklist.isSmoker, true)) {
        smoker = 'yes';
      } else {
        smoker = 'no';
      }
      const text = (
          <ShowInfo person = {person} showMore = {showMore} setShowMore = {setShowMore}/>
      );
      setReadMore(text);
    } else {
      const text = null;
      setReadMore(text);
    }
  };

  return (
    <>
      {/* All the cards */}
      {loading ? 
      <div className = "loading">
      <WaveSpinner size = {50} color="#007A78" loading={loading} />
      <Typography>        
        Getting profiles...
      </Typography>
      </div> :
      <div className="cards">
        <div className="cards__cardContainer">
          {people.map((person, index) => (
            <TinderCard
              ref={childRefs[index]}
              className="swipe"
              key={person.name}
              flickOnSwipe
              preventSwipe={['up', 'down']}
              currentFlateeCard={person.username}
              onSwipe={(dir) => swiped(dir, person)}
            >
              {/* Background image */}
              <div
                style={{
                  backgroundImage: 'url(https://images.theconversation.com/files/350865/original/file-20200803-24-50u91u.jpg?ixlib=rb-1.1.0&rect=37%2C29%2C4955%2C3293&q=45&auto=format&w=926&fit=clip)',
                }}
                className="card"
              >
                <body className="card-content">
                  {readMore}
                </body>
                <IconButton
                  onClick={() => changeText(person)}
                  className="see-more-button"
                >
                  <MoreVertIcon fontSize="large" />
                </IconButton>
                {/* Name */}
                <h3>{person.username}</h3>
              </div>
            </TinderCard>
          ))}
        </div>
        {/* Swipe buttons */}
        {people.length > 0 ?
        <div className="swipe-buttons">
          <IconButton
            onClick={() => swipe('left')}
            className="swipe-buttons__left"
          >
            <CloseIcon fontSize="large" />
          </IconButton>
          <IconButton
            onClick={() => swipe('right')}
            className="swipe-buttons__right"
          >
            <FavoriteIcon fontSize="large" />
          </IconButton>
          </div> :
            <div style = {{justifyContent: "center"}}>
              <Typography variant = "body1">
                You have no matches yet.
              </Typography>
          </div>}
      </div>
      }
    </>
  );
};

export default CardsForListing;
