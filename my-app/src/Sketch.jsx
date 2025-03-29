import Sketch from "react-p5"

function Bg() {

    // var canvas;
    // var bubbles = [];
    // const setup = (p5) => {
    //     canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    //     canvas.position(0, 0);
    //    canvas.style('z-index', '-1');
    //     for (let i = 0; i < 50; i++) {
    //         let x = p5.random(p5.width);
    //         let y = p5.random(p5.height);
    //         let r = p5.random(5,30);
    //         bubbles[i] = new Bubble(p5,x, y, r);    
    //     }
    // }
    // const draw = (p5) => {
    //     p5.background(255);  // white background   
    //     for (let i = 0; i < bubbles.length; i++) {
    //         bubbles[i].move();
    //         bubbles[i].show();
    //     }
    // };
    // function Bubble(p5, x, y, r) {
    //     this.p5 = p5;
    //     this.x = x;
    //     this.y = y;
    //     this.move = function () {
    //         this.x += p5.random(-0.1, 0.1);
    //         this.y += p5.random(-0.6, 0.6);
    //     }
    //     this.show = function () { 
    //         // This defines colors of the bubbles   
    //         this.p5.fill(255, 124, 0)         
    //         this.p5.ellipse(this.x, this.y, r);
    //     }
    // }
    // return <Sketch setup={setup} draw={draw} />

    let video;
    let bodyPose;
    let connections;
    let poses = [];

    function preload() {
        // Initialize MoveNet model with flipped video input
        bodyPose = p5.ml5.bodyPose("MoveNet", { flipped: true });
    }

    function mousePressed() {
        // Log detected pose data to the console when the mouse is pressed
        console.log(poses);
    }

    function gotPoses(results) {
        // Store detected poses in the global array
        poses = results;
        }

        function setup() {
        // Create canvas for displaying video feed
        createCanvas(640, 480);

        // Capture live video with flipped orientation
        video = createCapture(VIDEO, { flipped: true });
        video.hide();

        // Start detecting poses from the video feed
        bodyPose.detectStart(video, gotPoses);
    }

    function draw() {
    // Display the live video feed
    image(video, 0, 0);

        // Ensure at least one pose is detected before proceeding
        if (poses.length > 0) {
            let pose = poses[0];

            // Draw a circle at the detected nose position
            fill(236, 1, 90);
            noStroke();
            circle(pose.nose.x, pose.nose.y, 48);

            // Draw circles at the detected ear positions
            fill(45, 197, 244);
            circle(pose.left_ear.x, pose.left_ear.y, 16);
            circle(pose.right_ear.x, pose.right_ear.y, 16);

            // Draw circles at the detected shoulder positions
            fill(146, 83, 161);
            circle(pose.right_shoulder.x, pose.right_shoulder.y, 64);
            circle(pose.left_shoulder.x, pose.left_shoulder.y, 64);
        }
    }
}
export default Bg;


