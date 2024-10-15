let cureSong = new Audio();
let songs;
let currFolder;



function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(
        decodeURIComponent(`/${folder}/` + element.href.split(`/${folder}/`)[1])
      );
    }
  }
  let songUL = document
  .querySelector(".songlist")
  .getElementsByTagName("ul")[0];
  songUL.innerHTML = ''
for (const song of songs) {
  let displaySongName = song.replace(`/${currFolder}/`, "").replaceAll("%20", " ");
  displaySongName = displaySongName.replace("&", "&amp;");
  songUL.innerHTML =
    songUL.innerHTML +
    `<li><img class="invert" src="img/song.svg" alt="">
                         <div class="info">
                           <div class="songname">${displaySongName}</div>
                           <div>Hariom</div>
                         </div>
                         <div class="playnow">
                           <span>Play Now</span>
                           <img class="invert" src="img/play.svg" alt="" class="liplay">
                         </div></li>`;
}
Array.from(
  document.querySelector(".songlist").getElementsByTagName("li")
).forEach((e) => {
  e.addEventListener("click", (element) => {
    console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
    let songName = e
      .querySelector(".info")
      .firstElementChild.innerHTML.trim();
    let track = songs.find((s) =>
      decodeURIComponent(s).includes(songName.replace("&amp;", "&"))
    );
    if (track) {
      playMusic(track);
    } else {
      console.error("error");
    }
  });
});
return songs;
  
}

function playMusic(track, pause = false) {
  // let audio = new Audio(track)
  cureSong.src = track;
  if (!pause) {
    cureSong.play();
    playbtn.src = "img/pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(
    track.replace(`/${currFolder}/`, " ")
  );
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
}
  displayCard = async ()=>{
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let cardContaiener = document.querySelector("#cardContainer")
  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");
    let array =   Array.from(as)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];

    if(e.href.includes("/songs/")){
        let folder =e.href.split("/").slice(-1)[0]
        let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
        let response = await a.json();
        console.log(response)
        cardContaiener.innerHTML = cardContaiener.innerHTML + ` <div data-folder="${folder}" class="card">
        <div id="play">
        <i class="ri-play-line"></i>
        </div>
        <img src="/songs/${folder}/cover.jpg" alt="" />
        <h2>${response.titel}</h2>
        <p>${response.discription}</p>
      </div>`
  }   
  }
  clickCard()
}

async function main() {
  await getSongs("songs/cs");
  playMusic(songs[0], true);
  displayCard()

  playbtn.addEventListener("click", () => {
    if (cureSong.paused) {
      console.log("play");
      cureSong.play();
      playbtn.src = "img/pause.svg";
    } else {
      console.log("paused");
      cureSong.pause();
      playbtn.src = "img/play.svg";
    }
  });
  cureSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      cureSong.currentTime
    )}/${secondsToMinutesSeconds(cureSong.duration)}`;
    document.querySelector(".circle").style.left =
      (cureSong.currentTime / cureSong.duration) * 100 + "%";
  });

  circleFollows();
  hamburger()
  close()
  previous()
  next()
  volume()
  mute()

}
function circleFollows() {
  let seekbar = document.querySelector(".seekbar");
  seekbar.addEventListener("click", (dets) => {
    let circle = document.querySelector(".circle");
    const seekbarRect = seekbar.getBoundingClientRect();
    console.log(seekbarRect);
    let circleLocet = dets.clientX - seekbarRect.left;
    circle.style.left = circleLocet + "px";
    let percent = (circleLocet / seekbarRect.width) * 100;

    // Set the song's currentTime based on the percentage
    cureSong.currentTime = (percent / 100) * cureSong.duration;
  });
}

// create function for hamburger
function hamburger(){
  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector("#left").style.left = "0"
  })
}
// function for hamburger close 
function close(){
  document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector("#left").style.left = "-110%"
  })
}

function previous() {
  document.querySelector("#privois").addEventListener("click", () => {
    // Extract and decode filename from cureSong.src
    let filename = decodeURIComponent(cureSong.src.split("/").slice(-1)[0].trim());
    // Normalize and trim filenames in the songs array
    let normalizedSongs = songs.map(song => decodeURIComponent(song.split("/").slice(-1)[0].trim().toLowerCase()));
    // Find index of the filename in the normalized songs array
    let index = normalizedSongs.indexOf(filename.toLowerCase());
    if((index-1) >= 0){
      playMusic(songs[index-1])
    }else{
      console.log('hii');
      
    }
  });
}
// function for next
function next() {
  document.querySelector("#next").addEventListener("click", () => {
    cureSong.pause()
    // Extract and decode filename from cureSong.src
    let filename = decodeURIComponent(cureSong.src.split("/").slice(-1)[0].trim());
    // Normalize and trim filenames in the songs array
    let normalizedSongs = songs.map(song => decodeURIComponent(song.split("/").slice(-1)[0].trim().toLowerCase()));
    // Find index of the filename in the normalized songs array
    let index = normalizedSongs.indexOf(filename.toLowerCase());
    if((index+1) < songs.length){
      playMusic(songs[index+1])
    }else{
      console.log('hii');
      
    }
  });
}

//function for volume 
function volume(){
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    console.log(e, e.target, e.target.value);
    cureSong.volume = parseInt(e.target.value)/100
  })
}

// function for card 
function clickCard() {
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      console.log("Folder dataset:", item.currentTarget.dataset);

      // Naye folder se songs fetch karo
      await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0])
    });
  });
}

// function for mute
function mute(){
  document.querySelector(".volume>img").addEventListener("click",(e)=>{
    if(e.target.src.includes("volume.svg")){
      e.target.src = e.target.src.replace("volume.svg", "mute.svg")
      cureSong.volume = 0
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0
      
    }else{
      e.target.src = e.target.src.replace("mute.svg", "volume.svg")
      cureSong.volume = .10
      document.querySelector(".range").getElementsByTagName("input")[0].value = 15
    }
    
  })
}


main();


