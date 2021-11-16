import { useEffect, useState } from "react";
import "./App.css";
import style from "./App.module.css";

function App() {
  const initialInput_len = 3;
  const [input_len, setInput_len] = useState(initialInput_len);

  const initialGames = [];
  const [games, setGames] = useState(initialGames);

  const initialHistoryGames = [];
  const [historyGames, setHistoryGames] = useState(initialHistoryGames);

  const initialTurn = 0;
  const [turn, setTurn] = useState(initialTurn);

  // player 0 is red
  // player 1 is green

  const handleChange = (e) => {
    let val = e.currentTarget.textContent;

    // how to end game
    // 1. ชนะแบบ แนวนอน
    // 2. ชนะแบบ แนวตั้ง
    // 3. ชนะแบบ แนวทแยงไคว้

    // validation
    // ต้องไม่กาซ้ำ
    // ถ้าหากผู้เล่นฝ่าย o กา ให้กำหนดค่าในตำแหน่งนั้นๆเป็น o
    // ถ้าหากผู้เล่นฝ่าย x กา ให้กำหนดค่าในตำแหน่งนั้นๆเป็น x
    // เมื่อกาแล้วสลับฝั่งเล่น
    // ตรวจสอบจากซ้ายไปขวา ที่มีค่าเหมือนกันทีละแถวเช่น 123, 456, 789
    // ตรวจสอบจากบนลงล่าง ที่มีค่าเหมือนกันทีละแถวเช่น 147, 258, 369
    // ตรวจสอบแบบแนวทแยง ที่มีค่าเหมือนกันเช่น 159, 357

    // สร้าง array เก็บตำแหน่งที่ใช้ตรวจสอบที่มีค่าเหมือนกัน
    // ในที่นี้ arr1 คือการชนะแบบแนวนอนเช่น 123, 456, 789
    // ในที่นี้ arr2 คือการชนะแบบแนวตั้งเช่น 147, 258, 369
    // ในที่นี้ arr31 คือการชนะแบบแนวทแยง ตรวจสอบจากบนซ้ายไปล่างขวาเช่น 159
    // ในที่นี้ arr32 คือการชนะแบบแนวทแยง ตรวจสอบจากบนขวาไปล่างซ้าย 357

    // arr1 จะมีรูปแบบประมาณนี้ [[1,2,3], [4,5,6], [7,8,9]]
    // arr2 จะมีรูปแบบประมาณนี้ [[1,4,7], [2,5,8], [3,6,9]]
    // arr31 จะมีรูปแบบประมาณนี้ [1,5,9]
    // arr32 จะมีรูปแบบประมาณนี้ [3,5,7]
    // นี้คือการตรวจสอบหาผู้ชนะ จากค่าใน array ที่เหมือนกันทั้งหมด ตัวอย่าง ["x","x","x"]

    // ---------- history code ----------
    let temp_history_games = historyGames;
    temp_history_games.push({
      player: turn,
      point: val,
    });
    setHistoryGames(temp_history_games);
    // ---------- history code ----------

    if (games[val] === undefined) {
      if (turn === 0) {
        let temp = [];
        temp = games;
        temp[val] = "0";
        setGames(temp);
        setTurn(1);
      } else if (turn === 1) {
        let temp = [];
        temp = games;
        temp[val] = "1";
        setGames(temp);
        setTurn(0);
      }
    } else {
      console.log("this position is exist");
    }
  };
  const handleClickPrev = () => {
    if (historyGames.length > 0) {
      let temp_historyGames = Object.assign([], historyGames);
      let newArr_historyGames = temp_historyGames.slice(0, -1);
      setHistoryGames(newArr_historyGames);

      let prev = newArr_historyGames.slice(-1)[0];
      if (prev?.player === 0) {
        setTurn(1);
      } else if (prev?.player === 1) {
        setTurn(0);
      } else {
        setTurn(initialTurn);
      }

      let temp_games = Object.assign([], games);
      temp_games[temp_historyGames.pop().point] = undefined;
      let newArr_games = temp_games;
      setGames(newArr_games);
      // ------------------------------------------------------------------------
    }
  };

  useEffect(() => {
    let winned = false;

    let temp_input_len = Number(input_len);
    // let temp_input_len = initialInput_len;
    // let temp_input_len = 5;
    let startAt = 1;
    let num1 = 0;

    let arr1 = []; // แนวนอน
    let arr2 = []; // แนวตั้ง
    let arr31 = []; // แนวทแยงจากจุดบนซ้าย
    let arr32 = []; // แนวทแยงจากจุดบนขวา

    for (let i = 1; i <= temp_input_len; i++) {
      let temp_arr1 = [];
      let temp_arr2 = [];
      for (let j = 0; j < temp_input_len; j++) {
        num1++;
        if (num1) {
          temp_arr1.push(num1);
        }
        if (!(num1 % temp_input_len)) {
          arr1[i - 1] = temp_arr1;
        }

        let num2 = i + temp_input_len * j;
        if (num2) {
          temp_arr2.push(i + temp_input_len * j);
        }
        if (temp_arr2.length === temp_input_len) {
          arr2[i - 1] = temp_arr2;
        }
      }
      arr31.push(startAt * i + temp_input_len * (i - 1));
      arr32.push(temp_input_len * i - startAt * (i - 1));
    }
    // console.log("แนวนอน: ", arr1);
    // console.log("แนวตั้ง: ", arr2);
    // console.log("แนวทแยงจากจุดบนซ้าย: ", arr31);
    // console.log("แนวทแยงจากจุดบนขวา: ", arr32);

    let result_arr1 = compareAllValueInArray(arr1);
    if (result_arr1) {
      winned = true;
    }
    let result_arr2 = compareAllValueInArray(arr2);
    if (result_arr2) {
      winned = true;
    }
    let result_arr31 = compareAllValueInArray(arr31);
    if (result_arr31) {
      winned = true;
    }
    let result_arr32 = compareAllValueInArray(arr32);
    if (result_arr32) {
      winned = true;
    }

    if (winned) {
      console.log("BINGO");
      if (turn === 0) alert(`BINGO player 1 winned`);
      if (turn === 1) alert(`BINGO player 0 winned`);

      setGames(initialGames);
      setTurn(initialTurn);
      setHistoryGames(initialHistoryGames);
    }
  }, [turn]);

  function compareAllValueInArray(arr) {
    if (arr[0].length === undefined) {
      arr = [arr];
    }
    let IsWin = false;
    arr.map((el) => {
      [el].map((items) => {
        let arrCompare = [];
        items.map((item) => {
          // console.log(item);
          arrCompare.push(games[item]);
        });
        // console.log(arrCompare);

        let result = !!arrCompare.reduce(function (a, b) {
          return a === b ? a : NaN;
        });

        if (result) IsWin = true;
      });
      // console.log("end loop 1");
    });

    return IsWin;
  }
  function resetGames() {
    setGames(initialGames);
    setTurn(initialTurn);
    setHistoryGames(initialHistoryGames);
  }

  return (
    <div className={style.box__size}>
      <div className={style.xo}>
        {(function (rows, i, len) {
          let num = 0;
          while (++i <= len) {
            rows.push(
              <div className={style.xo__flex} key={i}>
                {(function (jrows, j, jlen) {
                  while (++j <= jlen) {
                    num++;
                    // console.log(num);
                    jrows.push(
                      <div
                        key={j}
                        className={`${style.xo__flex__item} ${
                          games[num] == "0"
                            ? style.red
                            : games[num] == "1"
                            ? style.green
                            : ""
                        }`}
                        onClick={handleChange}
                      >
                        {num}
                      </div>
                    );
                  }
                  return jrows;
                })([], 0, len)}
              </div>
            );
          }
          return rows;
        })([], 0, input_len)}
        <div className={style.xo__boxinput}>
          <input
            id="setinput"
            className={style.xo__boxinput__input}
            type="text"
          />
          <font
            className={style.xo__boxinput__text}
            onClick={() => {
              let { value } = document.getElementById("setinput");
              if (value >= 3) {
                resetGames();
                setInput_len(value);
              }
            }}
          >
            ตกลง
          </font>
        </div>
        <div className={style.xo__footer}>
          <div className={style.xo__footer__left}>
            <font
              className={style.xo__footer__left__prev}
              onClick={handleClickPrev}
            >
              prev
            </font>
            <font
              className={style.xo__footer__left__reset}
              onClick={() => {
                resetGames();
              }}
            >
              reset
            </font>
          </div>
          <div className={style.xo__footer__right}>
            player: {turn === 0 ? "0 red" : turn === 1 ? "1 green" : ""}
          </div>
        </div>
        <div className={style.history}>
          {historyGames.map((item, index) => {
            return (
              <li
                key={index}
              >{`player: ${item.player} point: ${item.point}`}</li>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default App;
