/**
@Author : westboy31
@Github :
@license : MIT
@version : 1.0.0
*/

function generateLandscape(scene,sceneWidth,sceneHeight,options) {

//fold Check parameters function
  if (scene == undefined) {
    console.error("First parameter is missing (svg node)");
  }
  else if (scene.tagName != "svg") {
    console.error("First parameter is wrong (svg node)");
  }
  if (sceneWidth == undefined) {
    sceneWidth = scene.parentElement.offsetWidth
  }
  else if (typeof sceneWidth != "number" ) {
    console.error("Second parameter is wrong, scene width must be a number");
  }
  if (sceneHeight == undefined) {
    sceneHeight = scene.parentElement.offsetHeight
  }
  else if (typeof sceneHeight != "number" ) {
    console.error("Third parameter is wrong, scene height must be a number");
  }
///fold ---------------------------------

//fold Init object Landscape Generator
let LandscapeGenerator = {
  node : scene ,

  fogBool : true,
  sunBool : true,
  sunshineBool : true,
  mountainsBool : true,
  plainsBool : true,

  minMountainWidth : 70,
  maxMountainWidth : Math.floor(sceneWidth/6) ,

  minHorizonY : Math.floor(sceneHeight/3),
  maxHorizonY : Math.floor(sceneHeight/3),
  horizonStart : 0,

  minMountainHeight : 0,
  maxMountainHeight : 80,
  sumHeight : 0,

  roundWidth : 100,

  minMountainsRangeNumber : 2,
  maxMountainsRangeNumber : 6,
  mountainsRangeNumber : 0,

  hue : 0,

  minMountainSpace : 0,
  maxMountainSpace : 0,
  mountainSpace : 0,

  minSunPositionX : 0,
  maxSunPositionX : Math.floor(sceneWidth),
  sunPositionX : 0,

  minSunPositionY : 0,
  maxSunPositionY : Math.floor(sceneHeight/2),
  sunPositionY : 0,

  minSunRadius : 10,
  maxSunRadius : Math.floor(sceneHeight/2),
  sunRadius : 0,

  minBirdsNumber : 1,
  maxBirdsNumber : 9,
  birdsNumber : 0,

  minPlainsNumber : 1,
  maxPlainsNumber : 3,
  plainsNumber : 1,

  minPlainsHeight : Math.floor(sceneHeight-50),
  maxPlainsHeight : Math.floor(sceneHeight - sceneHeight/4),

  valRecalculated: ["maxMountainWidth", "minHorizonY", "maxHorizonY", "maxSunPositionX", "maxSunPositionY", "maxSunRadius", "minPlainsHeight", "maxPlainsHeight"],
  set : (obj) => {
    if (obj != undefined) {
     LandscapeGenerator.valRecalculated = LandscapeGenerator.valRecalculated.filter( val => !Object.keys(obj).includes(String(val)) )
    }
    for (property in obj) {
      if (LandscapeGenerator.hasOwnProperty(property)) {
        LandscapeGenerator[property] = obj[property]
      }

      else {
        console.error("the property " +String(property)+ " not exist in LandscapeGenerator");
      }
    }
  },
  setSize : (width,height) => {
    sceneWidth = width ; //Default value : window.width
    sceneHeight = height; //Default value : window.height
    recalculateDefault();
  },
  generate: ()=>{
    deleteScene()
    scene.setAttribute('width', sceneWidth);
    scene.setAttribute('height', sceneHeight);
    randomnisation()
    LandscapeGenerator.sumHeight = LandscapeGenerator.horizonStart + LandscapeGenerator.maxMountainHeight
    if (LandscapeGenerator.sunBool) {
      creatSun();
    }
    if (LandscapeGenerator.mountainsBool) {
        creatMountains();
    }

    if (LandscapeGenerator.plainsBool) {
        creatPlains(LandscapeGenerator.plainsNumber);
    }

      colorSky();
      creatBirds(LandscapeGenerator.birdsNumber);
  }
  }
///fold ---------------------------------

//fold ========================================= Func Init

function recalculateDefault() {
  LandscapeGenerator.valRecalculated.forEach( (val) => {
    switch (val) {
      case "maxMountainWidth": LandscapeGenerator.maxMountainWidth = Math.floor(sceneWidth/6); break;
      case "minHorizonY": LandscapeGenerator.horizonStart = Math.floor(sceneHeight/3); break;
      case "maxHorizonY": LandscapeGenerator.horizonStart = Math.floor(sceneHeight/3); break;
      case "maxSunPositionX": LandscapeGenerator.maxSunPositionX = Math.floor(sceneWidth); break;
      case "maxSunPositionY": LandscapeGenerator.maxSunPositionY = Math.floor(sceneHeight/2); break;
      case "maxSunRadius": LandscapeGenerator.maxSunRadius = Math.floor(sceneHeight/2); break;
      case "minPlainsHeight": LandscapeGenerator.minPlainsHeight = Math.floor(sceneHeight-50); break;
      case "maxPlainsHeight": LandscapeGenerator.maxPlainsHeight = Math.floor(sceneHeight - sceneHeight/3); break;

    }
  });
}

//fold Generate random number between to interval
 function rand(min,max){
   return Math.floor( Math.random()*(max-min) + min  )
 }
 ///fold ---------------------------------

//fold Generate points for the plyline mountain
 function generateMountainPoints(repetition){ //mountain range
   let pointX = 0 ;
   LandscapeGenerator.mountainSpace = rand(LandscapeGenerator.minMountainSpace,LandscapeGenerator.maxMountainSpace)
   let pointY = sceneHeight-rand((LandscapeGenerator.horizonStart + repetition*LandscapeGenerator.maxMountainHeight + LandscapeGenerator.mountainSpace ) ,
                                  (LandscapeGenerator.sumHeight +repetition*LandscapeGenerator.maxMountainHeight + LandscapeGenerator.mountainSpace))
   let firstY = pointY
   let mountainsPoints = "0,"+ String(sceneHeight*2 - firstY )
   mountainsPoints += "\n0,"+ String(pointY)
   while (pointX < sceneWidth) {

     pointX +=  rand(LandscapeGenerator.minMountainWidth , LandscapeGenerator.maxMountainWidth)
     if (pointX + LandscapeGenerator.roundWidth < sceneWidth) {
      pointY = sceneHeight-rand( (LandscapeGenerator.horizonStart + repetition*LandscapeGenerator.maxMountainHeight + LandscapeGenerator.mountainSpace) ,
                                 (LandscapeGenerator.sumHeight + repetition*LandscapeGenerator.maxMountainHeight + LandscapeGenerator.mountainSpace))
     }
     else if (pointX + LandscapeGenerator.roundWidth >= sceneWidth ){
       pointX = sceneWidth ;
       pointY = firstY
     }
     mountainsPoints += "\n" + String(pointX) + "," + String(pointY)
   }
   mountainsPoints += "\n" + String(sceneWidth) + "," + String(sceneHeight*2-firstY);


   return mountainsPoints
 }
 ///fold ---------------------------------

//fold creat mountain and added to the scene
function creatMountains(){
  for (let i = LandscapeGenerator.mountainsRangeNumber; i >= 1 ; i--) {
    let mountain = document.createElementNS("http://www.w3.org/2000/svg","polyline");
    mountain.setAttributeNS(null,'points',generateMountainPoints(i-1));


    mountain.setAttributeNS(null,'fill',`
    hsl(${LandscapeGenerator.hue + 10*i },
        ${Math.floor(20 + (30/LandscapeGenerator.mountainsRangeNumber)*(LandscapeGenerator.mountainsRangeNumber-i))}%,
        ${Math.floor(55-(30/LandscapeGenerator.mountainsRangeNumber)*(LandscapeGenerator.mountainsRangeNumber-i))}%)`);



    if (LandscapeGenerator.fogBool) {
      let fog = document.createElementNS("http://www.w3.org/2000/svg","rect");
      fog.setAttributeNS(null,"x","0")
      fog.setAttributeNS(null,"y",String(sceneHeight-(LandscapeGenerator.sumHeight + (i-1)*LandscapeGenerator.maxMountainHeight + LandscapeGenerator.mountainSpace)))
      fog.setAttributeNS(null,"width",String(sceneWidth))
      fog.setAttributeNS(null,"height",String(LandscapeGenerator.maxMountainHeight))
      fog.setAttributeNS(null,"opacity","30%")
      fog.setAttributeNS(null,"fill","url(#fogGradient)")
      fog.setAttributeNS(null,"stroke","none")
      fog.setAttributeNS(null,"filter","url(#sunshineBlur)")
      fog.setAttribute('class', "LandscapeObject");
      fog.setAttribute('id', `Fog ${LandscapeGenerator.mountainsRangeNumber-i + 1}`);
      scene.appendChild(fog);
    }
    //add sunshine befor the last bool
    if (LandscapeGenerator.sunshineBool && i == 1 ) {
      let sunshine = document.createElementNS("http://www.w3.org/2000/svg","circle");
      sunshine.setAttributeNS(null,'cx', String(LandscapeGenerator.sunPositionX));
      sunshine.setAttributeNS(null,'cy', String(LandscapeGenerator.sunPositionY));
      sunshine.setAttributeNS(null,'r', String(LandscapeGenerator.sunRadius*2)); //sunRadius*2 ?
      sunshine.setAttributeNS(null,'fill',`hsl(${LandscapeGenerator.hue} , 50%, 80%)`);
      sunshine.setAttributeNS(null,'opacity',"15%");
      sunshine.setAttributeNS(null,'filter',"url(#sunshineBlur)");
      sunshine.setAttribute('class', "LandscapeObject");
      sunshine.setAttribute('id', "Sunshine" );
      scene.appendChild(sunshine);
    }
    mountain.setAttribute('class', "LandscapeObject");
    mountain.setAttribute('id', `Mountains ${LandscapeGenerator.mountainsRangeNumber-i+1}` );
    scene.appendChild(mountain);

  }
}
///fold ---------------------------------

//fold creat Plains and added to the scene
function creatPlains(plainsNumber) {
  let hue2= rand(80,160)
  for (let i = plainsNumber; i >= 1 ; i--) {
    let plain = document.createElementNS("http://www.w3.org/2000/svg","path");
    let plainY = rand(LandscapeGenerator.minPlainsHeight,LandscapeGenerator.maxPlainsHeight)
    let plainPoints =`
     M 0 , ${plainY}
     L 0 , ${sceneHeight*3 -plainY }
     L ${sceneWidth } , ${sceneHeight*3 -plainY }
     L ${sceneWidth} , ${plainY}
     C ${rand(sceneWidth/4,sceneWidth-sceneWidth/4)} , ${plainY - rand(0,sceneHeight-plainY)}
       ${rand(sceneWidth/4,sceneWidth-sceneWidth/4)} , ${plainY - rand(0,sceneHeight-plainY)}
       0 , ${plainY}`
    plain.setAttributeNS(null,'d', plainPoints );
    plain.setAttributeNS(null,"fill",`
    hsl(${hue2 },
        25%,
        ${40 - 4*(plainsNumber-i)}%)`);
        /*  alternative setup
            ${hue + 2*(plainsNumber-i)},
            30%,
            ${40 - 4*(plainsNumber-i) } */
    plain.setAttribute('class', "LandscapeObject");
    plain.setAttribute('id', `Plain ${plainsNumber - i + 1}`);
    scene.appendChild(plain);
  }
}
///fold ---------------------------------

//fold Gradient sky
function colorSky(){
  if (LandscapeGenerator.mountainsBool || LandscapeGenerator.plainsBool) {
 scene.setAttribute('style', ` background-image : linear-gradient(to bottom, hsl(${LandscapeGenerator.hue},70%,88%),transparent) `);
  }
  else {
scene.setAttribute('style', ` background-image : linear-gradient(to bottom, hsl(${rand(0,360)}, 70%, 88%), transparent) `);
  }
}
///fold ---------------------------------

//fold Creat sun
function creatSun(){
  let sun = document.createElementNS("http://www.w3.org/2000/svg","circle");
  sun.setAttributeNS(null,'cx', String(LandscapeGenerator.sunPositionX));
  sun.setAttributeNS(null,'cy', String(LandscapeGenerator.sunPositionY));
  sun.setAttributeNS(null,'r', String(LandscapeGenerator.sunRadius));
  sun.setAttributeNS(null,'fill', `hsl(${rand(10,60)},100%,${rand(80,100)}%)`);
  sun.setAttribute('class', "LandscapeObject");
  sun.setAttribute('id', "Sun");
  scene.appendChild(sun);
}
///fold ---------------------------------

//fold Creat birds
function drawBirdPath(){
  let birdCenterX = rand(4 , 20)
  let birdCenterY = rand(1 , 10)
  let pathBird = `M ${rand(40 , sceneWidth - 40)} , ${rand(40 , sceneHeight/2 )}
                  c ${rand(0 , birdCenterX/2)} , ${rand(-10 , 0)}
                    ${birdCenterX} , ${birdCenterY}
                    ${birdCenterX} , ${birdCenterY}
                  c ${birdCenterX} , ${birdCenterY}
                    ${rand(birdCenterX*3/2, birdCenterX*2)} , ${rand(-10 , 0)}
                    ${birdCenterX*2} , 0                                                                                `
return pathBird
}

function creatBirds(birdsNumber) {
  for (let i = 0; i < birdsNumber ; i++) {
    let bird = document.createElementNS("http://www.w3.org/2000/svg","path");
    bird.setAttributeNS(null,"stroke-width", rand(1,9)*0.1);
    bird.setAttributeNS(null,"stroke", "black");
    bird.setAttributeNS(null,'d', drawBirdPath() );
    bird.setAttributeNS(null,"fill", "none");
    bird.setAttribute('class', "LandscapeObject");
    bird.setAttribute('id', "Bird " + i);
    scene.appendChild(bird);
  }
}
///fold ---------------------------------

//fold Delete scene
function deleteScene() {
  scene.innerHTML = `  <defs id="def">
      <linearGradient id="fogGradient" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color= "transparent"/>
        <stop offset="1" stop-color="rgb(255, 255, 255)" />
      </linearGradient>

      <filter id="sunshineBlur" >
        <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
      </filter>

    </defs>`;
}
///fold ---------------------------------

//fold Auto randomnisation
function randomnisation() {
  LandscapeGenerator.hue = rand(0,360);
  LandscapeGenerator.sunPositionX = rand(LandscapeGenerator.minSunPositionX , LandscapeGenerator.maxSunPositionX)
  LandscapeGenerator.sunPositionY = rand(LandscapeGenerator.minSunPositionY , LandscapeGenerator.maxSunPositionY)
  LandscapeGenerator.sunRadius = rand(LandscapeGenerator.minSunRadius, LandscapeGenerator.maxSunRadius)
  LandscapeGenerator.birdsNumber = rand(LandscapeGenerator.minBirdsNumber,LandscapeGenerator.maxBirdsNumber);
  LandscapeGenerator.mountainsRangeNumber = rand(LandscapeGenerator.minMountainsRangeNumber,LandscapeGenerator.maxMountainsRangeNumber);
  LandscapeGenerator.plainsNumber = rand(LandscapeGenerator.minPlainsNumber,LandscapeGenerator.maxPlainsNumber)
  LandscapeGenerator.horizonStart = rand(LandscapeGenerator.minHorizonY,LandscapeGenerator.maxHorizonY)
}
///fold ---------------------------------

LandscapeGenerator.set(options);
LandscapeGenerator.generate();

///fold=============================================================================

return LandscapeGenerator

}
