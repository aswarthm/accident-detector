import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js'
import {get, ref, getDatabase, child,set} from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js'

const firebaseConfig = {
  apiKey: "AIzaSyB-1FSGQ_9xuWCcswCNIVaHFvnKb0ehrGo",
  authDomain: "idkwhatweredoing.firebaseapp.com",
  databaseURL: "https://idkwhatweredoing-default-rtdb.firebaseio.com",
  projectId: "idkwhatweredoing",
  storageBucket: "idkwhatweredoing.appspot.com",
  messagingSenderId: "819172156175",
  appId: "1:819172156175:web:248752c4c697de1276d47a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app)
const dbRef = ref(getDatabase());

let map;
let infoWindows = []

const rnsit = {lat:12.9022, lng:77.5186}
const location = rnsit

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    mapTypeId: "roadmap",
    zoom: 17,
    center: location,
    mapId: "6d77c92efad4c954"
  });
  map.setTilt(45); 
  addBuoy(rnsit)
}
  
window.initMap = initMap;


function addBuoy(location){
 
  console.log(location)

  const svgMarker = {
    path: `M256,0C114.844,0,0,114.844,0,256s114.844,256,256,256s256-114.844,256-256S397.156,0,256,0z M448,256
    c0,32.625-8.23,63.344-22.645,90.281l-67.123-44.75C364.461,287.602,368,272.219,368,256c0-16.211-3.539-31.594-9.768-45.523
    l67.123-44.75C439.77,192.656,448,223.383,448,256z M86.644,346.281C72.23,319.344,64,288.625,64,256
    c0-32.617,8.23-63.344,22.644-90.273l67.123,44.75C147.539,224.406,144,239.789,144,256c0,16.219,3.539,31.602,9.768,45.531
    L86.644,346.281z M208,256c0-26.469,21.531-48,48-48c26.469,0,48,21.531,48,48c0,26.469-21.531,48-48,48
    C229.531,304,208,282.469,208,256z M346.277,86.648l-44.75,67.125C287.6,147.547,272.219,144,256,144
    c-16.219,0-31.6,3.547-45.527,9.773l-44.75-67.125C192.656,72.234,223.375,64,256,64S319.344,72.234,346.277,86.648z
     M165.723,425.359l44.75-67.125C224.4,364.469,239.781,368,256,368c16.219,0,31.6-3.531,45.527-9.766l44.75,67.125
    C319.344,439.773,288.625,448,256,448S192.656,439.773,165.723,425.359z`,
    fillColor: "#FE6244",
    fillOpacity: 1.0,
    strokeWeight: 1,
    rotation: 0,
    scale: 0.07,
    anchor: new google.maps.Point(0, 20),
  }

const marker = new google.maps.Marker({
  icon: svgMarker,
  position: location,
  map: map,
  // animation: google.maps.Animation.DROP
});

}

document.getElementById("submit").addEventListener("click",()=>{
const database=getDatabase();
  
var emergency_string=""
let check1=document.getElementById("Check1");
if(check1.checked==true)
{
  emergency_string=emergency_string.concat("1 1")
  console.log("Fire")
}
else
{
  emergency_string=emergency_string.concat("0 1")
}
var check2=document.getElementById("Check2");
if(check2.checked)
{
  emergency_string=emergency_string.concat(" 1")
  console.log("Smoke")
}
else
{
  emergency_string=emergency_string.concat(" 0")
}
var check3=document.getElementById("Check3");
if(check3.checked)
{
  emergency_string=emergency_string.concat(" 1")
  console.log("Gas Leak")
}
else
{
  emergency_string=emergency_string.concat(" 0")
}
set(ref(database,"disasters/"+Date.now()+"/sensors"),emergency_string)
console.log(emergency_string)
})









