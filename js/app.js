const video = document.getElementById('myVideo');

const changeSpeed = (speed) =>
{
    video.playbackRate = speed;
}

changeSpeed(0.8);