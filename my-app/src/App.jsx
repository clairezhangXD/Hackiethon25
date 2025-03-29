// import Bg from "./Sketch"

// export default function App(){
//   return(
//     <div>
//       <Bg/>
//     </div>
//   )
// }

import React from "react";
import PoseSketch from "./PoseSketch";

function App() {
  return (
    <div className="App">
      <h1>Pose Detection with p5.js & ml5.js</h1>
      <PoseSketch />
    </div>
  );
}

export default App;
