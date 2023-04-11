// Define a function to show the badge overlay
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
	var myLvl = document.querySelector(".badgeLvl");
  myLvl.textContent = level;
}
  
  // When the page has finished loading, check if the user has earned any badges and update their XP accordingly
  window.onload = function() {
    var badgeList = JSON.parse(localStorage.getItem('badgeList'));
    if (badgeList) {
      alert(badgeList.length);
      alert(badgeList);
    }
    var value = parseInt(localStorage.getItem('userXP'));
    if (value) {
      var pSpan1 = document.querySelector(".value");
      var level = value.toString()
      pSpan1.textContent = level;
      updateLvl(level);
    }
  };
  
  // Use the getUserMedia API to access the user's camera and scan for QR codes
  const video = document.getElementById("video");
  
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ 
      video: {
        facingMode: { exact: "environment" }
      }
    }).then(function (stream) {
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
          var decodedBadge = atob(code.data);
  
          var matches = JSON.parse(localStorage.getItem('badgeList')) || [];
  
          var badgeId = decodedBadge.toString().substr(-4);
  
          alert(badgeId);
  
          if (decodedBadge.length >= 9) {
            if (localStorage.getItem('badgeList')) {
              var badgeList = JSON.parse(localStorage.getItem('badgeList'));
              badgeList.push(decodedBadge);
              localStorage.setItem('badgeList', JSON.stringify(badgeList));
            } else {
              var badgeList = [decodedBadge];
              localStorage.setItem('badgeList', JSON.stringify(badgeList));
            }
  
            var newXP = parseInt(decodedBadge.charAt(7));
  
            if (localStorage.getItem('userXP')) {
              var userXP = parseInt(localStorage.getItem('userXP'));
              var addedXP = userXP + newXP;
              localStorage.setItem('userXP', addedXP);
            } else {
              localStorage.setItem('userXP', newXP);
            }
  
            alert(JSON.parse(localStorage.getItem('badgeList')));
            alert(parseInt(localStorage.getItem('userXP')));
            var pSpan1 = document.querySelector(".value");
            var level = value.toString();
            pSpan1.textContent = level;
            updateLvl(level);
          }
        }
      }, 1000);
    });
  }
  else {
    alert("Sorry, your browser does not support camera access.");
  }
  