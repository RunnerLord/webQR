const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: 'user' } } })
    .then((stream) => {
        video.srcObject = stream;
        video.play();
        requestAnimationFrame(scanQRCode);
    })
    .catch((error) => console.error(error));

function scanQRCode() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
    });

    if (code) {
        console.log('QR Code detected:', code.data);
        const decode = atob(code.data);
        console.log(decode);
        
        addQRData(decode);
    }   
    requestAnimationFrame(scanQRCode);
}

function addQRData(data) {
    let badgeList = localStorage.getItem("badgeList");
    
    if (data.startsWith("webQR")) {
        if (badgeList === null) {
            badgeList = [];
        } else {
            try {
                badgeList = JSON.parse(badgeList);
            } catch (error) {
                console.error("Error parsing badgeList:", error);
                badgeList = [];
            }
        }

        if (badgeList.includes(data)) {
            console.log("Already included!");
        } else {
            badgeList.push(data);
            localStorage.setItem("badgeList", JSON.stringify(badgeList));
            alert("New badge added!");
            updateLvl();
        }
    } else {
        console.log("No webQR found!");
    }
}

function updateLvl() {
    const badgeList = localStorage.getItem("badgeList");

    if (badgeList !== null && badgeList !== undefined) {
        try {
            const parsedBadgeList = JSON.parse(badgeList);
            const level = Object.keys(parsedBadgeList).length;
            console.log(level)
            document.getElementById("level").textContent = level;
            document.getElementById("progress").textContent = " / " + level;
        } catch (error) {
            console.error("Error parsing badgeList:", error);
        }
    } else {
        document.getElementById("level").textContent = "0";
        document.getElementById("progress").textContent = " / 0";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    updateLvl();
});