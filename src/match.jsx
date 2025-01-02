import React, { useEffect, useState } from "react";
import "./assets/match.css";
import "animate.css";

export default function Match(props) {
  return (
    <>
      <div className="match">
        <div className="match-container">
          <div className="day">day {props.day}</div>

          <img className="pic" src="public/charlo.png" alt="" />

          <p className="points">{props.player1Points}</p>
          <p className="points">-</p>
          <p className="points">{props.player2Points}</p>

          <img className="pic" src="public/iti.png" alt="" />
          <div className="delete-edit">
            <button
              className="del-but"
              onClick={() => props.deleteMatch(props.day)}
            >
              <img src="public/supprimer.png" alt="" />
            </button>
            <button className="edt-but">
              <img src="public/editer.png" alt="" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
