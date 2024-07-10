
let currentSong = new Audio();
let songs;
let currFolder;

function formatTime(seconds){
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSec = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2,'0');
  const formattedSeconds = String(remainingSec).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;

}



async function getSongs(folder){
    currFolder=folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    
    songs = [];
    for(let index=0; index < as.length; index++){
         const element = as[index];
         if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
         }

    } 

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML="";
    for(const song of songs){
      songUL.innerHTML = songUL.innerHTML + `<li>
       <img class ="invert" src="img/music.svg" alt="">
               <div class="info">
                 <div>${song.replaceAll("%20"," ")}</div> 
                 <div>Aman</div>  
               </div>
               <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
               </div>
      </li>`
    }
   Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
     e.addEventListener("click",element=>{
      
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
     })
   })
   return songs;
    
 }
 
 const playMusic = (track, pause=false) =>{
 currentSong.src = `/${currFolder}/`+ track;
 if(!pause){
  currentSong.play()
  play.src="img/pause.svg"
 }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
 } 
 
 async function displayAlbums(){
   let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

     let array = Array.from(anchors)

     for(let i = 0; i< array.length; i++){
      const e = array[i]; 
     
      if(e.href.includes("/songs") && !e.href.includes(".htaccess")){
        let folder = (e.href.split("/").slice(-2)[0]);

        //get the meta data of the folder

        let a = await fetch(`/songs/${folder}/info.json`);
        let response = await a.json();
         
        cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
              <div class="play">
                <svg width="35" height="35" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="20" fill="#00FF00"/>
                  <path d="M15 28V12L29 20L15 28Z" stroke="#000000" fill="#000" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>
              </div>
              <img src="/songs/${folder}/cover.jpg " alt="">
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`
      }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
      e.addEventListener("click", async item=>{
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        playMusic(songs[0]);
      })
     })
     
 }

 async function main(){
   await getSongs("songs/cs" )
    playMusic(songs[0],true)
   
    //Display all the albums on the page
    displayAlbums();
    

   play.addEventListener("click", ()=>{
       if(currentSong.paused){
        currentSong.play()
        play.src= "img/pause.svg"
       }
       else{
        currentSong.pause()
        play.src = "img/play.svg"
       }
   })

   currentSong.addEventListener("timeupdate",()=>{

        document.querySelector(".songtime").innerHTML = 
        `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;

        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100+"%";
   })

   document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) *100;
    document.querySelector(".circle").style.left = percent+ "%";
    currentSong.currentTime = ((currentSong.duration)*percent)/100;
   })

   document.querySelector(".hamburger").addEventListener("click", e =>{
    document.querySelector(".left").style.left= "0";
   })

   document.querySelector(".close").addEventListener("click", e =>{
    document.querySelector(".left").style.left= "-120%";
   })
   
   //add event listeners to previous and next 
   previous.addEventListener("click", () => {
   
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    
    if((index-1) >= 0){
      playMusic(songs[index-1])
    }
   })
   
   next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    
    if((index+1) < songs.length){
      playMusic(songs[index+1]);
    }
   })

   document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
       currentSong.volume = parseInt(e.target.value)/100;
       if(currentSong.volume>0){
        document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
       }
   })   

   document.querySelector(".volume>img").addEventListener("click",e=>{
    
    if(e.target.src.includes("volume.svg")){
      e.target.src= e.target.src.replace("volume.svg","mute.svg")
      currentSong.volume=0;
      document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    }
    else{
      e.target.src = e.target.src.replace("mute.svg","volume.svg")
      currentSong.volume = .10
      document.querySelector(".range").getElementsByTagName("input")[0].value=10;

    }
   })

   Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click", async item=>{
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
    })
   })



 } 
 main()
 

