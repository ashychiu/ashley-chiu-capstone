import { React, useEffect, useState } from "react";
import axios from "axios";
import Moment from "react-moment";
import "moment-timezone";
import ContactModal from "../../components/ContactModal/ContactModal";
import "./WhoIsHere.scss";

const API_URL = process.env.REACT_APP_API_URL;

const WhoIsHere = () => {
  const [whoIsHere, setWhoIsHere] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [carPlate, setCarPlate] = useState("");
  const [userID, setUserID] = useState("");
  const [userList, setUserList] = useState([]);
  const [showBookings, setShowBookings] = useState(5);

  //Get vistors who have checked in but not yet checked out
  const fetchCurrVisitors = () => {
    axios
      .get(`${API_URL}/bookings`)
      .then((response) => {
        const currentVisitors = response.data.filter(
          (booking) => booking.checkin !== "" && booking.checkout === ""
        );
        setWhoIsHere(currentVisitors);
      })
      .catch((err) => console.log(err));
  };

  const fetchUserList = () => {
    axios
      .get(`${API_URL}/users/`)
      .then((response) => {
        setUserList(response.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetchCurrVisitors();
    fetchUserList();
    // return () => {
    //   setWhoIsHere([]); //unmount
    //   setUserList([]); //unmount
    // };
  }, [whoIsHere]);

  const handleClick = () => {
    setShowBookings((prevShowBookings) => prevShowBookings + 10);
  };

  const onCheckoutHandler = (e) => {
    axios
      .patch(`${API_URL}/bookings/checkout`, {
        id: e.target.id,
        carPlate: e.target.name,
      })
      .then((response) => {
        console.log("manual check out completed!");
        fetchCurrVisitors();
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data);
        }
      });
  };

  const onContactHandler = (e) => {
    setShowModal(true);
    setCarPlate(e.target.name);
    setUserID(e.target.id);
  };

  const onCloseHandler = () => {
    setShowModal(false);
  };

  return (
    <section className="whoishere">
      <h1>Who is here</h1>
      <div className={whoIsHere.length > 0 ? "hide" : "show"}>
        No one is here
      </div>
      {whoIsHere.slice(0, showBookings).map((booking, i) => {
        return (
          <div key={whoIsHere[i].id} className="whoishere__information">
            <div className="whoishere__container">
              <h4 className="whoishere__subheader">Licence Plate</h4>
              <p>{whoIsHere[i].carPlate}</p>
            </div>
            <div className="whoishere__container">
              <h4 className="whoishere__subheader">Visit Date</h4>
              <p>{whoIsHere[i].requestDate}</p>
            </div>

            <div className="whoishere__container">
              <h4 className="whoishere__subheader">Accessibility</h4>
              <p>{whoIsHere[i].accessibility}</p>
            </div>
            <div className="whoishere__container">
              <h4 className="whoishere__subheader">Checkin Time</h4>
              <p>
                <Moment parse="YYYY-MM-DD HH:mm">{whoIsHere[i].checkin}</Moment>
              </p>
            </div>
            <div className="whoishere__container">
              <h4 className="whoishere__subheader">For How Long?</h4>
              <p>
                <Moment fromNow ago>
                  {whoIsHere[i].checkin}
                </Moment>
              </p>
            </div>
            <div className="whoishere__actions">
              <button
                className="checkoutButton"
                name={whoIsHere[i].carPlate}
                id={whoIsHere[i].id}
                onClick={onCheckoutHandler}
              ></button>

              <button
                className="contactButton"
                name={whoIsHere[i].carPlate}
                id={whoIsHere[i].userID}
                onClick={onContactHandler}
              ></button>
            </div>
          </div>
        );
      })}
      <button
        onClick={handleClick}
        className={whoIsHere.length > showBookings ? "show" : "hide"}
      >
        Load More
      </button>

      <ContactModal
        show={showModal}
        carPlate={carPlate}
        userID={userID}
        onCloseHandler={onCloseHandler}
        userList={userList}
      />
    </section>
  );
};

export default WhoIsHere;
