let video = document.getElementById("video");
let model;

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

const setupCamera = () => {
    navigator.mediaDevices
        .getUserMedia({
            video: { width: 600, height: 400 },
            audio: false,
        })
        .then((stream) => {
            video.srcObject = stream;
        });
};

const detectFaces = async () => {
    const prediction = await model.estimateFaces(video, false);

    console.log(prediction);

    context.drawImage(video, 0, 0, 600, 400);

    prediction.forEach((pred) => {

        context.beginPath();
        context.lineWidth = "1";
        context.strokeStyle = "green";

        context.rect(
            pred.topLeft[0],
            pred.topLeft[1],
            pred.bottomRight[0] - pred.topLeft[0],
            pred.bottomRight[1] - pred.topLeft[1]
        );
        context.stroke();

        context.fillStyle = "tomato";

        pred.landmarks.forEach((land) => {
            context.fillRect(land[0], land[1], 4, 4);
        });

    });
};

setupCamera();
video.addEventListener("loadeddata", async () => {
    model = await blazeface.load();
    setInterval(detectFaces, 100);
});