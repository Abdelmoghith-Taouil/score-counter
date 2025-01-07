import "./assets/match.css";
import player1 from "./assets/charlo.png";
import player2 from "./assets/iti.png";
import del from "./assets/supprimer.png";
import edit from "./assets/editer.png";

export default function Match(props) {
  return (
    <>
      <div className="match">
        <div className="match-container">
          <div className="day">day {props.day}</div>

          <img className="pic" src={player1} alt="" />

          <p className="points">{props.player1Points}</p>
          <p className="points">-</p>
          <p className="points">{props.player2Points}</p>

          <img className="pic" src={player2} alt="" />
          <div className="delete-edit">
            <button
              className="del-but"
              onClick={() => props.deleteMatch(props.day)}
            >
              <img src={del} alt="" />
            </button>
            <button className="edt-but">
              <img src={edit} alt="" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
