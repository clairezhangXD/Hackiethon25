import React, { useEffect, useRef } from "react";
import p5 from "p5";
// import ml5 from "ml5";

const PoseSketch = () => {
  const sketchRef = useRef(null);

  useEffect(() => {
    let video;
    let bodyPose;
    let poses = [];

    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(640, 480).parent(sketchRef.current);

        // Capture video
        video = p.createCapture(p.VIDEO);
        video.size(640, 480);
        video.hide();

        // Initialize MoveNet model
        bodyPose = ml5.bodyPose("MoveNet", { flipped: false }, () => {
          console.log("MoveNet model loaded!");
          bodyPose.detectStart(video, gotPoses);
        });
      };

      const gotPoses = (results) => {
        poses = results;
      };

      p.draw = () => {
        p.image(video, 0, 0);

        if (poses.length > 0) {
          let pose = poses[0];

          // Draw a circle at the detected nose position
          p.fill(236, 1, 90);
          p.noStroke();
          p.circle(pose.nose.x, pose.nose.y, 48);

          // Draw circles at the detected ear positions
          p.fill(45, 197, 244);
          p.circle(pose.left_ear.x, pose.left_ear.y, 16);
          p.circle(pose.right_ear.x, pose.right_ear.y, 16);

          // Draw circles at the detected shoulder positions
          p.fill(146, 83, 161);
          p.circle(pose.right_shoulder.x, pose.right_shoulder.y, 64);
          p.circle(pose.left_shoulder.x, pose.left_shoulder.y, 64);
        }
      };
    };

    let myP5 = new p5(sketch);

    return () => {
      myP5.remove(); // Clean up on unmount
    };
  }, []);

  return(<div ref={sketchRef}></div>);
};

export default PoseSketch;