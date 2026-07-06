
/*-------------------------variables/constants----------------------------*/
const root = document.documentElement; //finds the :root of a page's style.css (documentElement = the root of the document)
const IMAGES = document.getElementById("scroll-bonus");

let idleTimer; //a timer storing the amount of time since an input (button press) has last been registered
let autoScrollInterval; //active timer that stores the ID of the scrolling action so that it can be stopped if needed
let direction = 1; //1 = down, -1 = up
let scrolling_status = false; //is idle autoscrolling currently occuring? stores the active result of this query
let paused = false; //is the autoscroll paused due to a hover? stores the result of this query
const IDLE_TIME = 15000; // wait 15 seconds before idle status gained (longer since more reading can be done)

/*---------------------------------idle scrolling behaviour------------------------------------*/
function isAtBottomEdge() { //checks if scroll is at the far right of the scrollbar
  return (IMAGES.scrollTop + IMAGES.clientHeight) >= (IMAGES.scrollHeight - 1); 
  //returns true if the right most on-screen pixel (distance currently scrolled + width of visible area) >= right-most pixel of the scroll wheel's area
}
function isAtTopEdge() { //checks if scroll is at the far top area of the scrollbar
  return IMAGES.scrollTop <= 0;
  //returns true if the distance currently scrolled reaches 0 (aka when at far left edge of scroll bar)
}

function startAutoScroll() { //starts the idle autoscrolling action
  stopAutoScroll(); //begins from a standstill to prevent duplication errors
  scrolling_status = true; //scrolling is beginning so mark scrolling as occuring

  autoScrollInterval = setInterval(() => { //start and store the autoscroll interval (the ID of the motion basically) then do the following every 16ms
    if (isAtBottomEdge()) direction = -1; //check if at bottom edge of scroll bar, change motion direction if so
    else if (isAtTopEdge()) direction = 1; //check if at top edge of scroll bar, change motion direction if so
    IMAGES.scrollBy({ top: direction, behavior: "auto" }); //scroll 1px in the correct direction 
  }, 49); //repeat 1px scroll every 49ms for slower scrolling than main (easier on the eyes when vertial scroll)
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
IMAGES.addEventListener("mouseenter", () => { //mouse begins a hover over IMAGES
    paused = scrolling_status; //check if scroll had begun before hover and store this value for when the hover ends
    stopAutoScroll(); //temporarily stop the autoscroll
});
IMAGES.addEventListener("mouseleave", () => { //mouse leaves a hover over IMAGES
  if (paused == true) { //only start autoscroll if this motion had been paused by the hover (prevents it from starting before the idle status begins)
    startAutoScroll(); // resume immediately upon mouse leaving a hover
  }
});
window.addEventListener("click", () => { //if any clicks are detected anywhere on the window, restart the timer as the user is not afk anymore
  paused = false;
  stopAutoScroll();
  resetIdleTimer();
});
window.addEventListener("touchstart", () => { //for mobile platforms, allows taps anywhere on screen (or attempts to scroll manually) to end the afk scrolling action
  paused = false;  
  stopAutoScroll();
  resetIdleTimer();
});

// Start idle timer on load
resetIdleTimer();