import Match from "./match";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./assets/App.css";

function App() {
  const [matches, setMatches] = useState([]);
  const [isAddDay, setIsAddDay] = useState(false);
  const [Nmatch, setNmatch] = useState(1);

  const [p1Point, setp1Point] = useState(null);
  const [p2Point, setp2Point] = useState(null);
  const [Points, setPoints] = useState([]); // Store points for each match

  const [AddMatchError, setAddMatchError] = useState("");

  const [p1Total, setP1Total] = useState(0);
  const [p2Total, setP2Total] = useState(0);

  const [mvp, setMvp] = useState(null);

  useEffect(() => {
    axios.get("http://192.168.1.17:3000/Matches").then((res) => {
      setMatches(res.data.reverse());
    });
  }, [matches]);

  //Calculte the total points of the players and who is the mvp
  useEffect(() => {
    const totalPoints = matches.reduce(
      (acc, CurrentMatch) => {
        acc.player1 += CurrentMatch.player1Points;
        acc.player2 += CurrentMatch.player2Points;
        return acc;
      },
      { player1: 0, player2: 0 } // Initial accumulator
    );
    setP1Total(totalPoints.player1);
    setP2Total(totalPoints.player2);

    setMvp(p1Total > p2Total ? "player1" : "player2");
    if (p1Total === p2Total) setMvp(null);
  }, [matches]);

  const AddMatch = () => {
    if (!(p1Point && p2Point)) {
      setAddMatchError("*enter both points to proceed*");
    } else {
      setAddMatchError("");
      // Add the current points to the Points array
      setPoints([...Points, { player1: p1Point, player2: p2Point }]);

      setNmatch(Nmatch + 1); // Increase the number of matches
      setp1Point(null); // Clear the input fields
      setp2Point(null); // Clear the input fields
    }
  };

  const Add = () => {
    if (!(p1Point && p2Point)) {
      setAddMatchError("*enter both points to proceed*");
    } else {
      const P = [...Points, { player1: p1Point, player2: p2Point }];
      let Day;
      if (matches.length === 0) {
        Day = 1;
      } else {
        Day = matches[0].day + 1;
      }

      // Calculate total points for each player
      const totalPoints = P.reduce(
        (acc, match) => {
          acc.player1 += parseInt(match.player1, 10); // parseInt for make the value int not str because the values of players points on P array are strings also on Points because we bring the values from html inputs
          acc.player2 += parseInt(match.player2, 10);
          return acc;
        },
        { player1: 0, player2: 0 } // Initial accumulator
      );

      axios
        .post("http://192.168.1.17:3000/Matches", {
          day: Day,
          player1Points: totalPoints.player1,
          player2Points: totalPoints.player2,
        })
        .then(
          Swal.fire({
            toast: true,
            position: "top-end",
            title: "The day has been added.",
            icon: "success",
            showConfirmButton: false,
            timer: 1700,
            timerProgressBar: true,
            showClass: {
              popup: "animate__animated animate__bounceInRight ",
            },
            hideClass: {
              popup: "animate__animated animate__zoomOutUp animate__faster",
            },
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          })
        );
      Cancel();
    }
  };

  const Cancel = () => {
    setIsAddDay(false);
    setp1Point(null);
    setp2Point(null);
    setAddMatchError("");
    setNmatch(1);
    setPoints([]);
  };

  const deleteMatch = (day) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        let CurrMatch = matches.filter((match) => match.day === day);
        console.log(CurrMatch[0].id);
        axios
          .delete(`http://192.168.1.17:3000/Matches/${CurrMatch[0].id}`)
          .then(() => {
            Swal.fire({
              toast: true,
              position: "top-end",
              title: "The match has been deleted.",
              icon: "success",
              showConfirmButton: false,
              timer: 1700,
              timerProgressBar: true,
            });
          })
          .catch((error) => {
            console.error("Error deleting match:", error);
            Swal.fire(
              "Error",
              "There was an issue deleting the match.",
              "error"
            );
          });

        for (let i = day + 1; i <= matches.length + 1; i++) {
          CurrMatch = matches.filter((match) => match.day === i);
          axios.patch(`http://192.168.1.17:3000/Matches/${CurrMatch[0].id}`, {
            day: i - 1,
          });
        }
      }
    });
  };
  return (
    <>
      <div className="Result">
        <div
          className="Player1"
          style={{ marginTop: mvp === "player1" ? "0px" : "72px" }}
        >
          {mvp === "player1" && (
            <div className="mvp-container">
              <img src="public/crown.png" alt="" />
              <div className="mvp">MVP</div>
            </div>
          )}
          <div className="P1img">
            <img
              src="public/charlo.png"
              alt=""
              style={{
                border: mvp === "player1" ? "solid 2px #FFD700" : "",
                boxShadow: mvp === "player1" ? "0 0 15px #ffd900" : "",
              }}
            />
          </div>
          <div className="P1name">Charlo</div>
        </div>

        <div className="P1points">{p1Total}</div>
        <div className="dash">
          <hr></hr>
        </div>
        <div className="P2points">{p2Total}</div>

        <div
          className="Player2"
          style={{ marginTop: mvp === "player2" ? "0px" : "73px" }}
        >
          {mvp === "player2" && (
            <div className="mvp-container">
              <img src="public/crown.png" alt="" />
              <div className="mvp">MVP</div>
            </div>
          )}
          <div className="P2img">
            <img
              src="public/iti.png"
              alt=""
              style={{
                border: mvp === "player2" ? "solid 2px #FFD700" : "",
                boxShadow: mvp === "player2" ? "0 0 15px #ffd900" : "",
              }}
            />
          </div>
          <div className="P1name">iti</div>
        </div>
      </div>
      <div>
        <div className="AddDayBtn-container">
          <button className="AddDayBtn" onClick={() => setIsAddDay(true)}>
            Add day
          </button>
        </div>

        {isAddDay && (
          <div className="AddDay-overlay" onClick={Cancel}>
            <div
              className="AddDay-container"
              onClick={(e) => e.stopPropagation()} // Prevent Add close on click inside
            >
              {Array.from({ length: Nmatch }, (_, index) => (
                <div key={index}>
                  <div className="matchNum">match {index + 1}</div>
                  <div className="AddMatch-container">
                    <div>charlo</div>
                    <input
                      type="number"
                      className="point-input"
                      onChange={(ev) => {
                        setp1Point(ev.target.value);
                        if (p1Point && p2Point) setAddMatchError("");
                      }}
                      readOnly={index < Points.length} // Set as read-only for previous matches
                      style={{
                        border: index < Points.length ? "none" : "",
                        boxShadow: index < Points.length ? "none" : "",
                      }}
                    />
                    <div className="bar">-</div>
                    <input
                      type="number"
                      className="point-input"
                      onChange={(ev) => {
                        setp2Point(ev.target.value);
                        if (p1Point && p2Point) setAddMatchError("");
                      }}
                      readOnly={index < Points.length} // Set as read-only for previous matches
                      style={{
                        border: index < Points.length ? "none" : "",
                        boxShadow: index < Points.length ? "none" : "",
                      }}
                    />
                    <div>iti</div>
                  </div>
                </div>
              ))}

              {AddMatchError && (
                <div className="AddMatchError">{AddMatchError}</div>
              )}

              <div className="AddMatchBtn-container">
                <button className="AddMatchBtn" onClick={AddMatch}>
                  Add match
                </button>
              </div>

              <div className="AddDay-buttons">
                <button className="AddDay" onClick={Add}>
                  Add
                </button>
                <button className="AddDay-cancel" onClick={Cancel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {matches.map((match, index) => (
        <Match
          key={index}
          day={match.day}
          player1Points={match.player1Points}
          player2Points={match.player2Points}
          deleteMatch={deleteMatch}
        />
      ))}
    </>
  );
}

export default App;
