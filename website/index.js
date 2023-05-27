import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js'
import {get, ref, getDatabase, child} from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js'

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
const dbRef = ref(db)

let map;
let infoWindows = []

const pes = {lat:12.934833162232344, lng:77.53507211285884}
const location = pes

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    mapTypeId: "roadmap",
    zoom: 17,
    center: location,
    mapId: "6d77c92efad4c954"
  });
  map.setTilt(45); 
  addMarkers()
  map.addListener("click", ()=>{
    for (let infowindow of infoWindows)
    infowindow.close()
  })
}
  
window.initMap = initMap;


function addBuoy(buoyData, buoyId){
  let location = buoyData["location"]
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

let dateStr = getDatestr(parseInt(buoyId));
let timeStr = getTimestr(parseInt(buoyId))

let htmlString = `<div>
<h3>${dateStr}</h3>
<h3>${timeStr}</h3>
<p>${buoyData["prompt"]}</p>
</div>`
makeInfoWindow(marker, htmlString)

}

function getDatestr(millis){
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  let dateObj = new Date(millis)
  console.log(dateObj)

  let date = dateObj.getDate() < 10 ?  '0' + dateObj.getDate() : dateObj.getDate()
  let month = months[dateObj.getMonth()]
  let year = dateObj.getFullYear()
  let time = dateObj.toLocaleTimeString()
  return `${date} ${month} ${year}`

}

function getTimestr(millis){
  let dateObj = new Date(millis)
  return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })


}

function makeInfoWindow(marker, htmlString){
  const infowindow = new google.maps.InfoWindow({
    content: htmlString, //U CAN PUT HTML HERE
    map:map,
    width: 500,

  });
  infoWindows.push(infowindow)
  
  marker.addListener("click", ()=>{
    infowindow.open({
      anchor: marker,
    });
  })
}


function addMarkers(){

  get(child(dbRef, "/disasters")).then((snapshot) => {
    console.log(snapshot.val())
    let data = snapshot.val()
    

    for (let disasterId in  data){
      let disasterData = data[disasterId]
      addBuoy(disasterData, disasterId)
    }
   
  })
}

setInterval(addMarkers, 10000);

function beep() {
  var snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
  snd.play();
}

/*
get location from db and make markers DONE
info window DONE
stuff in infowindow
location search 
bounce bounce
legend
*/




"parseFloat(phoneId.charAt(phoneId.length - 2))/100000 + parseFloat(phoneId.charAt(phoneId.length - 1))/100000"