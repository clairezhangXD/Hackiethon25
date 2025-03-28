import React, { useEffect, useRef, useState } from "react";
import p5 from "p5";
import ml5 from "ml5";
import goodPostureImage from "./MyAssets/Panda1.png"; // Image for good posture
import badPostureImage from "./MyAssets/Panda3.png"; // Image for bad posture

const PostureFixer = () => {
  const sketchRef = useRef(null);
  const [goodPosture, setGoodPosture] = useState(null); // State to track posture
  const [showVideo, setShowVideo] = useState(true);
  const showVideoRef = useRef(showVideo);

  useEffect(() => {
    showVideoRef.current = showVideo;
  }, [showVideo]);

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
          p.fill(116, 255, 148);
          p.noStroke();
          p.circle(pose.nose.x, pose.nose.y, 5);

          // Draw a circle halfway between the shoulders
          p.fill(116, 255, 148);
          let shoulderMidX = (pose.right_shoulder.x + pose.left_shoulder.x) / 2;
          let shoulderMidY = (pose.right_shoulder.y + pose.left_shoulder.y) / 2;
          p.circle(shoulderMidX, shoulderMidY, 5);

          let noseShoulderGap = shoulderMidY - pose.nose.y;

          console.log("\n\n\nNose to shoulder gap:", noseShoulderGap);

          // Update posture state
          if (noseShoulderGap > 125) {
            // Good posture message
            p.fill(116, 255, 148);
            p.textSize(32);
            p.text("Good posture :D !", 200, 30);
            setGoodPosture(true); // Update React state
          } else {
            // Draw a big circle at the detected nose position to clown bad posture
            p.fill(255, 113, 137);
            p.noStroke();
            p.circle(pose.nose.x, pose.nose.y, 48);

            // Draw circle halfway between the shoulders
            p.fill(255, 113, 137);
            p.circle(shoulderMidX, shoulderMidY, 5);

            // Bad posture message
            p.fill(255, 113, 137);
            p.textSize(32);
            p.text("Bad posture :( !", 200, 30);

            setGoodPosture(false); // Update React state
          }
        }
      };
    };

    let myP5 = new p5(sketch);

    return () => {
      myP5.remove(); // Clean up on unmount
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: goodPosture ? "#2F369A" : "red",
        padding: "20px",
        borderRadius: "10px",
        width: "800px",
        height: "500px",
        margin: "20px auto",
        border: "1px solid #ccc",
      }}
    >
      <div ref={sketchRef} style={{ marginRight: "20px" }}></div>

      {/* Wrapper for Image and Overlay */}
      <div
        // style={{
        //   position: "relative",
        //   width: "140px",
        //   height: "140px",
        //   borderRadius: "10px",
        // }}
      >
        <img
          src={goodPosture ? goodPostureImage : badPostureImage} // Dynamic Image
          alt="Posture Status"
          width="140"
          height="140"
          style={{
            borderRadius: "10px",
            display: "block",
            width: "100%",
            height: "120%",
          }}
        />

        {/* Translucent red overlay */}
        {!goodPosture && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "120%",
              backgroundColor: "rgba(255, 0, 0, 0.1)", // Red translucent film
              borderRadius: "10px", // Match border radius to image container
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PostureFixer;