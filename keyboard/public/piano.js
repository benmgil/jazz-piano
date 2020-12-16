// note class
class Note{
    constructor(note, octave, duration){
        this.note = note;
        this.octave = octave;
        this.duration = duration;
    }

    play(){
        piano.play(this.note, this.octave, this.duration);
    }
}

//global UI screen variables
let pianoScreen;
let loginScreen;
let createAccountScreen;
let menuScreen;
let mainContainer;

//global UI link/button variables
let createAccountLink;
let loginLink;
let guestLink1;
let guestLink2;
let loginButton;
let logoutButton;
let favoriteButton;
let loginScreenButton;
let createAccountScreenButton;
let displayButton;
let playButton;

//global UI element variables
let menuButton;
let favorites;
let recents;
let listDiv;
let newName;
let newPass;
let usernameLogin;
let passwordLogin;
let verifiedPass;
let creationErrorMessage;
let loginErrorMessage;

//global variables
let recentScales = [];
let favoriteScales = [];
let currentUser = "";
let currentPass = "";
let loggedIn = false;
let baseOctave = 3;
let isShown = false;
let menuShown = false;
let favSelected = true;
let secondaryColor = "blue";
let selectedKey = "C";
let selectedScale = "major";
let keyElements = {};
const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const scaleWords = ["major","dorian","phrygian","lydian","mixolydian",
  "aeolian","locrian", "melodic-minor", "dorian-b2", "lydian-augmented",
  "lydian-dominant", "mixolydian-b6", "locrian-#2", "super-locrian", "harmonic-minor",
  "locrian-#6", "major-#5", "dorian-#4", "mixolydian-b2b6", "lydian-#2", "locrian-b4b7"];
let keyIDs = [];
var piano = Synth.createInstrument('piano');

//dictionary of Jazz mode
const modes = {
    "major": [2,2,1,2,2,2,1],
    "dorian": [2,1,2,2,2,1,2],
    "phrygian": [1,2,2,2,1,2,2],
    "lydian": [2,2,2,1,2,2,1],
    "mixolydian": [2,2,1,2,2,1,2],
    "aeolian": [2,1,2,2,1,2,2],
    "locrian": [1,2,2,1,2,2,2],

    "melodic-minor": [2,1,2,2,2,2,1],
    "dorian-b2": [1,2,2,2,2,1,2],
    "lydian-augmented": [2,2,2,2,1,2,1],
    "lydian-dominant": [2,2,2,1,2,1,2],
    "mixolydian-b6": [2,2,1,2,1,2,2],
    "locrian-#2": [2,1,2,1,2,2,2],
    "super-locrian": [1,2,1,2,2,2,2],

    "harmonic-minor": [2,1,2,2,1,3,1],
    "locrian-#6": [1,2,2,1,3,1,2],
    "major-#5": [2,2,1,3,1,2,1],
    "dorian-#4": [2,1,3,1,2,1,2],
    "mixolydian-b2b6": [1,3,1,2,1,2,2],
    "lydian-#2": [3,1,2,1,2,2,1],
    "locrian-b4b7": [1,2,1,2,2,1,3]
}

document.addEventListener('DOMContentLoaded',function(){
  //makes dictionary where key is note name, and value is dom element
    for(let i = 0; i < notes.length*2; i++){
        let note = notes[i%notes.length];
        let replacedNote = note.replace("#","s");
        let relOctave = i<notes.length?1:2;
        let id = replacedNote + "-" + relOctave;
        keyElements[id] = document.getElementById(id);
        keyIDs.push(id);
        //add event listener

        keyElements[id].addEventListener('click', function(){
            let n = new Note(note, baseOctave+relOctave-1, 2)
            n.play();
        })
    }

    //sets auto to C Major
    document.getElementById('select-key').value = "C";
    document.getElementById('select-scale').value = "major";

    pianoScreen = document.getElementById('piano-screen');
    loginScreen = document.getElementById('login-screen');
    createAccountScreen = document.getElementById('create-account-screen');
    menuScreen = document.getElementById('menu-screen');
    mainContainer = document.getElementById('main-container');

    createAccountLink = document.getElementById('to-create-account');
    loginLink = document.getElementById('to-login');
    guestLink1 = document.getElementById('guest-1');
    guestLink2 = document.getElementById('guest-2');

    newName = document.getElementById('new-username');
    newPass = document.getElementById('new-password');
    verifiedPass = document.getElementById('verified-password');
    creationErrorMessage = document.getElementById('creation-error');
    usernameLogin = document.getElementById('username');
    passwordLogin = document.getElementById('password');
    loginErrorMessage = document.getElementById('login-error');

    loginButton = document.getElementById('login');
    logoutButton = document.getElementById('logout');
    menuButton = document.getElementById('list-button');
    favorites = document.getElementById('favorites-tab');
    recents = document.getElementById('recents-tab');
    listDiv = document.getElementById('list-box');
    favoriteButton = document.getElementById('favorite-button');
    loginScreenButton = document.getElementById('login-button');
    createAccountScreenButton = document.getElementById('create-account-button');

    displayButton = document.getElementById('show-button');
    playButton = document.getElementById('play-button');

    createAccountLink.addEventListener('click', showCreateAccount);
    loginLink.addEventListener('click', showLogin);
    loginScreenButton.addEventListener('click', login);
    createAccountScreenButton.addEventListener('click', createAccount);
    loginButton.addEventListener('click', showLogin);
    logoutButton.addEventListener('click', logout);
    menuButton.addEventListener('click', toggleMenu);
    favorites.addEventListener('click', showFavorites);
    recents.addEventListener('click', showRecents);
    favoriteButton.addEventListener('click', toggleFavorite);
    guestLink1.addEventListener('click', showPiano);
    guestLink2.addEventListener('click', showPiano);

    //toggle visibility when user clicks button
    displayButton.addEventListener('click', function(){
        if(isShown){
          hideScale();
        }
        else{
          displayScale(selectedKey, baseOctave, selectedScale);
        }
    });

    //when user clicks play, call play function and update their recents list
    playButton.addEventListener('click', function(){
        playScale(selectedKey, baseOctave, selectedScale, .5);
        updateRecents();
    })

    setupKeyboardListeners();

})

//show create account screen
function showCreateAccount(){
  mainContainer.style.display = "none";
  loginScreen.style.display = "none";
  createAccountScreen.style.display = "block";
}

//show login screen
function showLogin(){
  loginScreen.style.display = "block";
  createAccountScreen.style.display = "none";
  mainContainer.style.display = "none";
}

//show Piano screen
function showPiano(){
  mainContainer.style.display = "flex";
  loginScreen.style.display = "none";
  createAccountScreen.style.display = "none";

  //if logged in, show advanced options and fetch recents/favorites
  if(currentUser != ""){
    loginButton.style.display = "none";
    logoutButton.style.display = "inline-block";
    menuButton.style.display = "inline-block";
    favoriteButton.style.display = "inline-block";
  }
  else{
    loginButton.style.display = "inline-block";
    logoutButton.style.display = "none";
    menuButton.style.display = "none";
    favoriteButton.style.display = "none";
  }
}

function login(){
  //save user input
  let username = usernameLogin.value;
  let password = passwordLogin.value;

  //request login
  fetch("login", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify( { username: username, password: password } )
  }).then(response => {return response.json()})
    .then(data => {
      //if successful, update username/possword/lists
      if(data.success){
        loginErrorMessage.innerText = "";
        currentUser = username;
        currentPass = password;
        favoriteScales = JSON.parse(data.favorites);
        recentScales = JSON.parse(data.recents);

        //Show the currently selected scale as favorited if needed
        let currScale = selectedKey + " " + selectedScale;
        let index = favoriteScales.indexOf(currScale);
        if(index != -1){
          favoriteButton.className = "favorited";
        }
        else {
          favoriteButton.className = "";
        }

        showPiano();
      }
      //else, clear data and send error message
      else{
        currentUser = "";
        currentPass = "";
        loginErrorMessage.innerText = data.message;
      }
    })
}

//logout function
function logout(){
  currentUser = "";
  currentPass = "";
  menuScreen.style.display = "none";
  menuShown = false;
  showPiano();
}

function createAccount(){
  //saves entered inputs
  let isValid = false;
  let username = newName.value;
  let pass1 = newPass.value;
  let pass2 = verifiedPass.value;

  //shows error if passwords don't match
  if( pass1 != pass2){
    creationErrorMessage.innerText = "Your passwords do not match!";
  }
  //else, requests to add it to database
  else{
    fetch("create_account", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify( { username: username, password: pass1 } )
    }).then(response => {return response.json()})
      .then(data => {
        //if successful, save current username and password
        if(data.success){
          creationErrorMessage.innerText = "";
          currentUser = username;
          currentPass = password;
          favoriteScales = [];
          recentScales = [];
          let currScale = selectedKey + " " + selectedScale;
          let index = favoriteScales.indexOf(currScale);
          if(index != -1){
            favoriteButton.className = "favorited";
          }
          else {
            favoriteButton.className = "";
          }

          showPiano();
        }
        //else, clear username and password
        else{
          currentUser = "";
          currentPass = "";
          creationErrorMessage.innerText = data.message;
        }
      })
  }
}

//to show/hide the lists menu
function toggleMenu(){
  if(menuShown){
    menuScreen.style.display = "none";
    menuShown = false;
    menuButton.innerText = "<";
  }
  else{
    menuScreen.style.display = "flex";
    menuShown = true;
    menuButton.innerText = ">";
    //show the appropriate content in the menu
    if(favSelected){
      showFavorites();
    }
    else {
      showRecents();
    }
  }
}

//to show the recents list
function showRecents(){
  listDiv.innerHTML = "";
  recentScales.forEach((item, i) => {
    listDiv.innerHTML += "<p>"+item+"</p>"
  });

  favorites.className = "";
  recents.className = "selected";
  favSelected = false;
}

//to show the favorites list
function showFavorites(){
  listDiv.innerHTML = "";
  favoriteScales.forEach((item, i) => {
    listDiv.innerHTML += "<p>"+item+"</p>"
  });

  //listDiv.innerText = "oOOH wOW FshArpFLat762DimInished is my fAVroite ScCaleEverrr!"
  favorites.className = "selected";
  recents.className = "";
  favSelected = true;
}

//updates current octave when dropdown is changed
function getOctave(){
  let oct = document.getElementById("select-octave").value;
  baseOctave = parseInt(oct);
}

//updates current key when dropdown is changed
function getKey(){
  selectedKey = document.getElementById("select-key").value;
  let scale = selectedKey + " " + selectedScale;

  //makes favorite button red if it is in favorites
  if(favoriteScales.indexOf(scale) != -1){
    favoriteButton.className = "favorited";
  }
  else{
    favoriteButton.className = "";
  }

  if(isShown){
    displayScale(selectedKey, baseOctave, selectedScale);
  }
}

//update the current scale when dropdown is changed
function getScale(){
  selectedScale = document.getElementById("select-scale").value;
  let scale = selectedKey + " " + selectedScale;

  //makes favorite button red if it is in favorites
  if(favoriteScales.indexOf(scale) != -1){
    favoriteButton.className = "favorited";
  }
  else{
    favoriteButton.className = "";
  }

  //if display setting is on, display it
  if(isShown){
    displayScale(selectedKey, baseOctave, selectedScale);
  }
}

//function to highlight the notes of a given scale
function displayScale(note, octave, scale){
    hideScale(); //hides the previously shown scale
    isShown = true;
    displayButton.innerText = "Hide";

    //Gets the intervals between notes of the scale
    let intervals = modes[scale];
    let noteIndex = notes.indexOf(note);
    let currentOctave = octave;


    let noteToHighlight = note; //Converts note name to id
    let replacedNote = noteToHighlight.replace("#","s");
    let relOctave = currentOctave == octave?1:2;
    let id = replacedNote + "-" + relOctave;

    let keyElement = keyElements[id]  //Gets the element and highlights it
    let isBlackKey = id.indexOf("s") != -1;
    keyElement.className.baseVal = `key ${isBlackKey?"black":"white"} highlighted`;

    for(let i = 0; i < intervals.length; i++){ //For each interval
        interval = intervals[i];
        noteIndex += interval;
        //If we've gone through all the notes loop around and increment octave
        if(noteIndex >= notes.length){
            currentOctave++;
        }
        noteIndex = noteIndex % notes.length;


        //similar to above, gets each note id
        let noteToHighlight = notes[noteIndex];
        let replacedNote = noteToHighlight.replace("#","s");
        let relOctave = currentOctave == octave?1:2;
        let id = replacedNote + "-" + relOctave;

        //highlights the note
        let keyElement = keyElements[id]
        let isBlackKey = id.indexOf("s") != -1;
        let classname = `key ${isBlackKey?"black":"white"} highlighted`;
        keyElement.className.baseVal = classname;
    }
}

//hide scale when hide button is clicked
function hideScale(){

    displayButton.innerText = "Display";
    isShown = false;

    //loops though each note and resets its classname
    for(let i = 0; i < notes.length*2; i++){
        let note = notes[i%notes.length];
        let replacedNote = note.replace("#","s");
        let relOctave = i<notes.length?1:2;
        let id = replacedNote + "-" + relOctave;
        let keyElement = keyElements[id];
        let isBlackKey = id.indexOf("s") != -1;
        let classname = `key ${isBlackKey?"black":"white"}`;
        keyElement.className.baseVal = classname;

    }
}

//play scale when "play" button is clicked
function playScale(note, octave, scale, speed){
    //displays all the notes of the scale initially
    displayScale(note, octave, scale);

    //gets the starteing note and intervals, etc.
    let intervals = modes[scale];
    let noteIndex = notes.indexOf(note);
    let currentOctave = octave;

    //list of notes to play during timeouts
    let notesToPlay = [];


    //add the first note
    notesToPlay.push(new Note(notes[noteIndex],currentOctave,speed));

    //For each interval,
    for(let i = 0; i < intervals.length; i++){

        //get the note and octave
        interval = intervals[i];
        noteIndex += interval;
        if(noteIndex >= notes.length){ //if we go too far, loop around notes
            currentOctave++;
        }
        noteIndex = noteIndex % notes.length;
        notesToPlay.push(new Note(notes[noteIndex],currentOctave,speed));
    }
    for(let i = 0; i < notesToPlay.length; i++){ //For each note to play
        setTimeout(function(){  //set a timeout to play it later
            notesToPlay[i].play()

            //calculate the id of the note to highlight
            let noteToHighlight = notesToPlay[i].note;
            let replacedNote = noteToHighlight.replace("#","s");
            let relOctave = 1 + notesToPlay[i].octave - baseOctave;
            let id = replacedNote + "-" + relOctave;
            let keyElement = keyElements[id];


            //change its color to be highlighted
            let isBlackKey = id.indexOf("s") != -1;
            let classname = `key ${isBlackKey?"black":"white"} playing`;
            keyElement.className.baseVal = classname;

            //set a timeout to change the color back after
            setTimeout(function(){
                let classname = `key ${isBlackKey ?"black":"white"} highlighted`
                keyElement.className.baseVal = classname;
            },1000*speed)
        },(i+1)*1000*speed);

        //hide the scale when its done playing
        setTimeout(function(){
            hideScale();
        }, (notesToPlay.length+1)*1000*speed + 100);
    }
}


//update list of favorite scales
function toggleFavorite(){
  let scale = selectedKey + " " + selectedScale;
  let index = favoriteScales.indexOf(scale)

  //if it exists in favorites, remove it and update button class
  if(index == -1){
    favoriteScales.unshift(scale);
    favoriteButton.className = "favorited";
  }
  else {
    favoriteScales.splice(index,1);
    favoriteButton.className = "";
  }

  //update favorites on UI
  if(favSelected){
    showFavorites();
  }

  //update favorites in database
  fetch("update_favorites", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify( { username: currentUser, password: currentPass, favorites: favoriteScales } )
  }).then(response => {return response.json()})
    .then(data => {
      if(!data.success){
        console.log("error in updating favorites");
      }
    })
}

//update list of recently played scales
function updateRecents(){
  let scale = selectedKey + " " + selectedScale;
  let index = recentScales.indexOf(scale);

  //if scale exists in recents, remove it
  if(index != -1){
    recentScales.splice(index,1);
  }
  //if list is full with it removed, remove the last one
  if(recentScales.length  == 10){
    recentScales.pop();
  }
  //put scale at front of list
  recentScales.unshift(scale);

  //update selected on UI
  if(!favSelected){
    showRecents();
  }

  //update recents in database
  fetch("update_recents", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify( { username: currentUser, password: currentPass, recents: recentScales } )
  }).then(response => {return response.json()})
    .then(data => {
      if(!data.success){
        console.log("error updating recents");
      }
    })
}

//helper function to highlight note when key is pressed
function playKey(noteName, oct){
  if(mainContainer.style.display == "none"){
    return 1;
  }
  let speed = 1.5;
  new Note(noteName, baseOctave+oct, speed).play();
  let replacedNote = noteName.replace("#","s");
  let relOctave = oct==0?1:2;
  let id = replacedNote + "-" + relOctave;
  let keyElement = document.getElementById(id);

  //change class so that key is highlighted when played
  let isBlackKey = id.indexOf("s") != -1;
  let classname = `key ${isBlackKey?"black":"white"} playing`;
  keyElement.className.baseVal = classname;
  setTimeout(function(){
      let classname = `key ${isBlackKey ?"black":"white"}`
      keyElement.className.baseVal = classname;
  },1000*speed*.25)
}

//add event listeners for keys to control piano
function setupKeyboardListeners(){
  document.addEventListener('keydown', function (event) {

    if (event.key === 'q') {
      playKey("C",0);
    }
    if (event.key === '2') {
      playKey("C#",0);
    }
    if (event.key === 'w') {
      playKey("D",0);
    }
    if (event.key === '3') {
      playKey("D#",0);
    }
    if (event.key === 'e') {
      playKey("E",0);
    }
    if (event.key === 'r') {
      playKey("F",0);
    }
    if (event.key === '5') {
      playKey("F#",0);
    }
    if (event.key === 't') {
      playKey("G",0);
    }
    if (event.key === '6') {
      playKey("G#",0);
    }
    if (event.key === 'y') {
      playKey("A",0);
    }
    if (event.key === '7') {
      playKey("A#",0);
    }
    if (event.key === 'u') {
      playKey("B",0);
    }
    if (event.key === 'i' || event.key === 'z') {
      playKey("C",1);
    }
    if (event.key === '9' || event.key === 's') {
      playKey("C#",1);
    }
    if (event.key === 'o' || event.key === 'x') {
      playKey("D",1);
    }
    if (event.key === '0' || event.key === 'd') {
      playKey("D#",1);
    }
    if (event.key === 'p' || event.key === 'c') {
      playKey("E",1);
    }
    if (event.key === 'v') {
      playKey("F",1);
    }
    if (event.key === 'g') {
      playKey("F#",1);
    }
    if (event.key === 'b') {
      playKey("G",1);
    }
    if (event.key === 'h') {
      playKey("G#",1);
    }
    if (event.key === 'n') {
      playKey("A",1);
    }
    if (event.key === 'j') {
      playKey("A#",1);
    }
    if (event.key === 'm') {
      playKey("B",1);
    }
  });
}
