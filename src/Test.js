import React, { useState } from "react";
import { Chessboard } from "react-chessboard";

export default function MyBoard() {
  const [arrows, setArrows] = useState([
    ["e2", "e4"],   // red arrow
    ["g1", "f3"],   // blue arrow
    ["c1", "g5"]    // green arrow
  ]);

  return (
    <Chessboard
      position="start"
      customArrows={arrows}
      customArrowColor= "rgba(7, 97, 242, 1)"
    />
  );
}
