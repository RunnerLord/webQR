function showContent() {
  const myDiv = document.getElementById("overlay");
  const myIcon1 = document.getElementById("icon1");
  const myIcon2 = document.getElementById("icon2");
  
  if (myDiv.style.display === "none") {
    myDiv.style.display = "block";
    
    setTimeout(() => {
      myIcon1.style.opacity = 0;
      myIcon2.style.opacity = 1;
      myDiv.classList.add("active");
    }, 300);
  } else {
    myDiv.classList.remove("active");
    myIcon1.style.opacity = 1;
    myIcon2.style.opacity = 0;
    
    setTimeout(() => {
      myDiv.style.display = "none";
    }, 300);
  }
}

function updateLvl(level) {
  const myLvl = document.querySelector(".badgeLvl");
  myLvl.textContent = level;
}

window.onload = function() {
  const badgeList = JSON.parse(localStorage.getItem('badgeList'));

  if (badgeList) {
    console.log(badgeList.length);
    console.log(badgeList);
  }

  const value = parseInt(localStorage.getItem('userXP'));

  if (value) {
    const pSpan1 = document.querySelector(".value");
    const level = value.toString();
    pSpan1.textContent = level;
    updateLvl(level);
  }
};

const video = document.getElementById("video");

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ 
    video: {
      facingMode: { exact: "environment" }
    }
  })
  .then(function (stream) {
    video.srcObject = stream;
    video.play();

    setInterval(function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        const decodedBadge = atob(code.data);
        const badgeId = decodedBadge.toString().substr(-4);

        console.log(badgeId);

        var badgeList = localStorage.getItem('badgeList');

        if (badgeList && badgeList.includes(decodedBadge)) {
          if (decodedBadge.length >= 9) {
            if (localStorage.getItem('badgeList')) {
              let badgeList = JSON.parse(localStorage.getItem('badgeList'));
              badgeList.push(decodedBadge);
              localStorage.setItem('badgeList', JSON.stringify(badgeList));
            } else {
              let badgeList = [decodedBadge];
              localStorage.setItem('badgeList', JSON.stringify(badgeList));
            }
  
            const newXP = parseInt(decodedBadge.charAt(7));
  
            if (localStorage.getItem('userXP')) {
              const userXP = parseInt(localStorage.getItem('userXP'));
              const addedXP = userXP + newXP;
              localStorage.setItem('userXP', addedXP);
            } else {
              localStorage.setItem('userXP', newXP);
            }
  
            console.log(JSON.parse(localStorage.getItem('badgeList')));
            console.log(parseInt(localStorage.getItem('userXP')));
  
            const pSpan1 = document.querySelector(".value");
            const level = value.toString();
            pSpan1.textContent = level;
            updateLvl(level);
          }
        }
      }
    }, 1000);
  });
} else {
  alert("Sorry, your browser does not support camera access.");
}

level = 4;

if (level >= 15) {
  document.getElementById("myBadge").src = "assets/lvlBadge3.svg";
  document.querySelector(".required").innerHTML = " / &infin;";
} else if (level >= 5) {
  document.getElementById("myBadge").src = "assets/lvlBadge2.svg";
  document.querySelector(".required").innerHTML = " / 15";
} else {
  document.getElementById("myBadge").src = "assets/lvlBadge1.svg";
  document.querySelector(".required").innerHTML = " / 5";
}