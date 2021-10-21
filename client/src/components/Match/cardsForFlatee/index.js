import React, {useState, useEffect, useMemo} from 'react';
import _isEqual from 'lodash/isEqual';
import CloseIcon from '@material-ui/icons/Close';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import TinderCard from 'react-tinder-card';
import api from '../../../utils/api';
import './styles.css';
import * as moment from 'moment';
import { useAuth } from '../../App/Authentication';
import ShowInfo from '../ShowInfo';
import { Typography } from '@material-ui/core';
import {WaveSpinner} from "react-spinners-kit";

// create cards component and export it
const CardsForFlatee = (props) => {
  const alreadyRemoved = [];
  const { user, jwt } = useAuth();
  const [listings, setListings] = useState([]);
  const [readMore, setReadMore] = useState(null);
  const [showMore, setShowMore] = useState(true);

  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const childRefs = useMemo(() => Array(listings.length).fill(0).map((i) => React.createRef()));
  const flateeUser = user;
  let matchparam = {
    flateeUsername: flateeUser,
  };

  // use effect to gather potential listings for this flatee
  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      // Get Listings from API 
      api.getPotFlateeMatches(jwt, matchparam)
      .then((res) => setListings(res.data))
      .catch((err) => console.log(err))
      setLoading(false);
    }

    fetchListings();
  }, []);

  // swipe function
  const swiped = (direction, id, username) => {
    matchparam = {
      flateeUsername: flateeUser,
      flateeID: user.id,
      listingUsername: username,
      listingID: id,
    };
    if (_isEqual(direction, 'left')) {
      // API unmatch
      api.unmatch(jwt, matchparam);
    } else if (_isEqual(direction, 'right')) {
      // API add Listing
      api.addListing(jwt, matchparam);
    }
    alreadyRemoved.push(id);

    setShowMore(true);
    setReadMore(null);
  };

  // automate swiping feature through buttons
  const swipe = (dir) => {
    const cardsLeft = listings.filter((listing) => !alreadyRemoved.includes(listing.id));
    if (cardsLeft.length) {
      // eslint-disable-next-line max-len
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].id; // Find the card object to be removed
      // eslint-disable-next-line max-len
      const index = listings.map((listing) => listing.id).indexOf(toBeRemoved); // Find the index of which to make the reference to
      // eslint-disable-next-line max-len
      alreadyRemoved.push(toBeRemoved); // Make sure the next card gets removed next time if this card do not have time to exit the screen
      childRefs[index].current.swipe(dir); // Swipe the card!
    }
  };

  // show additional info of card if triggered
  const changeText = (Listing) => {
    const cardsLeft = listings.filter((listing) => !alreadyRemoved.includes(listing.id));
    if (cardsLeft.length) {
      // eslint-disable-next-line max-len
      const toBeTargeted = cardsLeft[cardsLeft.length - 1].id; // Find the card object to retrieve extra info
      // eslint-disable-next-line max-len
      const index = listings.map((listing) => listing.id).indexOf(toBeTargeted); // Find the index of which to make the reference to
      setShowMore(!showMore);

      if (showMore) {
        const text = (
            <ShowInfo Listing = {Listing}/>
        );
        setReadMore(text);
      } else {
        const text = null;
        setReadMore(text);
      }
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
      </div>:
      <div className="cards">
        <div className="cards__cardContainer">
          {listings.map((listing, index) => (
            <TinderCard
              ref={childRefs[index]}
              className="swipe"
              key={listing.id}
              flickOnSwipe
              preventSwipe={['up', 'down']}
              currentFlatCard={listing.id}
              onSwipe={(dir) => swiped(dir, listing.listing.id, listing.accountUser.username)}
            >
              {/* Background image */}
              <div
                style={{
                  backgroundImage: 'url(https://www.indiewire.com/wp-content/uploads/2019/10/Parasite_Parks_Garden-1.jpg?resize=1536,830)',
                }}
                className="card"
              >
                <body className="card-content">
                  {readMore}
                </body>
                {<IconButton
                  onClick={() => changeText(listing)}
                  className="see-more-button"
                >
                  <MoreVertIcon fontSize="large"/>
                </IconButton>}
                {/* Name */}
                <h3>{listing.accountUser.username}</h3>
              </div>
            </TinderCard>
          ))}
        </div>
        {/* Swipe buttons */}
        {listings.length > 0 ?
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
        <div style = {{justifyContent: "center", margin: 150}}>
          <Typography variant = "body1">
            There is currently no profile that matches your preferences
            <br />
            Expand your options by clicking on the filter button above.
          </Typography>
        </div>}
      </div>}
    </>
  );
};

export default CardsForFlatee;
