/*-------------------------variables/constants----------------------------*/
const PBM = document.getElementById("scroll1"); //first array (physically built mocs)
const DRM = document.getElementById("scroll2"); //second array (digitally rendered mocs)

let currentScroll = PBM; //returns either PBM or DRM depending on which is primarily currently on-screen more. Defaul is PBM
let idleTimer; //a timer storing the amount of time since an input (button press) has last been registered
let autoScrollInterval; //active timer that stores the ID of the scrolling action so that it can be stopped if needed
let direction = 1; //1 = right, -1 = left
let scrolling_status = false; //is idle autoscrolling currently occuring? stores the active result of this query
let paused = false; //is the autoscroll paused due to a hover? stores the result of this query
const IDLE_TIME = 7000; // wait 7 seconds before idle status gained


/*---------------------------------idle scrolling behaviour------------------------------------*/
window.addEventListener("scroll", () => { //change which scrollbar is being effected by idle scroll depending on scrollheight of the window
  const scrollY = window.scrollY;
  if (scrollY > 235) { //roughly the point where DRM becomes more on screen than PBM
    currentScroll = DRM;
  } else {
    currentScroll = PBM;
  }
});

function isAtRightEdge() { //checks if scroll is at the far right of the scrollbar
  return (currentScroll.scrollLeft + currentScroll.clientWidth) >= (currentScroll.scrollWidth - 1); 
  //returns true if the right most on-screen pixel (distance currently scrolled + width of visible area) >= right-most pixel of the scroll wheel's area
}
function isAtLeftEdge() { //checks if scroll is at the far left of the scrollbar
  return currentScroll.scrollLeft <= 0;
  //returns true if the distance currently scrolled reaches 0 (aka when at far left edge of scroll bar)
}

function startAutoScroll() { //starts the idle autoscrolling action
  stopAutoScroll(); //begins from a standstill to prevent duplication errors
  scrolling_status = true; //scrolling is beginning so mark scrolling as occuring

  autoScrollInterval = setInterval(() => { //start and store the autoscroll interval (the ID of the motion basically) then do the following every 16ms
    if (isAtRightEdge()) direction = -1; //check if at right edge, change motion direction if so
    else if (isAtLeftEdge()) direction = 1; //check if at left edge, change motion direction if so
    currentScroll.scrollBy({ left: direction, behavior: "auto" }); //scroll 1px in the correct direction 
  }, 16); //repeat 1px scroll every 16ms for slow scrolling
}
function stopAutoScroll() { //stops the idle autoscrolling action
  clearInterval(autoScrollInterval); //find the function running at the autoScrollInterval ID address, and end it
  scrolling_status = false; //mark autoscrolling as not occuring
}

function resetIdleTimer() { //this function is called if any notable interaction occurs with the webpage, restarting how long its been since last input
  clearTimeout(idleTimer); //end and reset the idle timer
  stopAutoScroll(); //stop autoscroll since user is no longer idle

  idleTimer = setTimeout(() => { //start the idle timer anew
    startAutoScroll(); //waits for IDLE_TIME seconds and if not reset before then it will run function startAutoScroll()
  }, IDLE_TIME); 
}


/*----------------------hover behaviour-------------------------*/
PBM.addEventListener("mouseenter", () => { //mouse begins a hover over PBM
  if(currentScroll == PBM){ //only pause PBM if PBM is the one scrolling rn; if DRM is scrolling then do nothing when PBM is hovered over
    paused = scrolling_status; //check if scroll had begun before hover and store this value for when the hover ends
    stopAutoScroll(); //temporarily stop the autoscroll
  }
});
DRM.addEventListener("mouseenter", () => { //mouse begins a hover over DRM
  if(currentScroll == DRM){ //only pause DRM if DRM is the one scrolling rn; if PBM is scrolling then do nothing when DRM is hovered over
    paused = scrolling_status; //check if scroll had begun before hover and store this value for when the hover ends
    stopAutoScroll(); //temporarily stop the autoscroll
  }
});

PBM.addEventListener("mouseleave", () => { //mouse leaves a hover over PBM
  if (paused == true) { //only start autoscroll if this motion had been paused by the hover (prevents it from starting before the idle status begins)
    startAutoScroll(); // resume immediately upon mouse leaving a hover
  }
});
DRM.addEventListener("mouseleave", () => { //mouse leaves a hover over DRM
  if (paused == true) { //only start autoscroll if this motion had been paused by the hover (prevents it from starting before the idle status begins)
    startAutoScroll(); // resume immediately upon mouse leaving a hover
  }
});

window.addEventListener("click", () => { //if any clicks are detected anywhere on the window, restart the timer as the user is not afk anymore
    paused = false;
    stopAutoScroll();
    resetIdleTimer();
});


/*---------------------button interactions------------------------*/
const image_width = 420; //actual image width + grid buffer distance --- MAIN PAGE
document.getElementById("left1").onclick = function() { //the uppermost left button for the PBM section
    PBM.scrollBy({left:-image_width, behavior: "smooth"}); //move left by the width of a thumbnail image on click of the button left1
    resetIdleTimer(); //interaction means no longer idle, restart timer to begin anew
} //repeat logic for all buttons
document.getElementById("right1").onclick = function() {
    PBM.scrollBy({left:image_width, behavior: "smooth"});
    resetIdleTimer();
}

document.getElementById("left2").onclick = function() {
    DRM.scrollBy({left:-image_width, behavior: "smooth"});
    resetIdleTimer();
}
document.getElementById("right2").onclick = function() {
    DRM.scrollBy({left:image_width, behavior: "smooth"});
    resetIdleTimer();
}


// Start idle timer on load
resetIdleTimer();