/**
@Author : westboy31
@Github :
@license : MIT
@version : 1.0.0
*/
//fold ========================================================== Init

//fold Object init
const LG = generateLandscape(document.getElementById('LandscapeGenerator'));
const zip = new JSZip() ;
const startMoving = {x : 0 , y : 0}
const objectIsMoving = {self : null, initColor : ""}
let newOption = {}
///fold-------------------------------

//fold Var init
let mode = "navigation"
let previosActiveElement = null
let objectColorIsChanging , colorPanelIsChanging
let activePanel
///fold-------------------------

//fold Dom elements init
const objectContainer = document.getElementById('objectContainerScene');
const colorPickerRoot = document.getElementById('colorPicker');
const btnGenerate = document.getElementById('btn_generate');
const btnExport = document.getElementById('btn_export');
const btnShowLeftPanel = document.getElementById('btn_showPanelLeft');
const btnShowRightPanel = document.getElementById('btn_showPanelRight');
const leftPanel = document.getElementById('panel_scene');
const rightPanel = document.getElementById('panel_option');
const optionContainer = document.getElementById('objectContainerOption');
const SVGexport =  document.getElementById('SVGexport');
const menuExport = document.getElementById('menuExport');
const copy = document.getElementById('copy');
const btnCancel = document.querySelector('#menuExport > .btnScenePanel')
const exportPNG = document.getElementById('exportPNG');
const exportLayers = document.getElementById('exportLayers');
const instruction = document.getElementById('instruction');
///fold-----------------------------------------

 //fold Creat color picker
var colorPicker  =  new iro.ColorPicker(colorPickerRoot, {
    width: 140,
    sliderSize : 20
  })
///fold-----------------------------------------

///fold================================================================

//fold ========================================================== Init function

//fold show instruction
function showInstruction(instructionTxt,time){
  instruction.innerText = instructionTxt
  instruction.style.display = "block";
  setTimeout(()=>{instruction.style.display = "none"}, time);
}

///fold

//fold Focus the moving object
function moveElement(objId) {
  objectIsMoving.self = document.getElementById(objId);
  objectIsMoving.initColor = objectIsMoving.self.getAttributeNS(null , 'fill');
  objectIsMoving.self.setAttributeNS(null ,'fill', "rgb(71, 178, 209)");
}
///fold--------------------

//fold Left panel

//fold Creat sky btn
function creatSkyPanel(){

  //fold Write the id of the element in a h3
  const landscapeElement = document.createElement("h3");
  objectContainer.appendChild(landscapeElement);
  landscapeElement.textContent = "Sky";
  ///fold-------------------------

  //fold Creat color selector button
  var btnColorPicker = document.createElement("button");
  btnColorPicker.classList.add('btnScenePanel');
  btnColorPicker.style.backgroundColor= document.getElementById("LandscapeGenerator").style.backgroundImage.split(", t")[0].split("t(")[1]
  btnColorPicker.style.gridColumnStart="4"
  landscapeElement.appendChild(btnColorPicker);
  ///fold-----------------------

  //fold Color picker event
  btnColorPicker.addEventListener('click', (e) => {
    mode = "piking color"
    colorPickerRoot.style.display="block";
    colorPickerRoot.style.top = `${e.target.offsetTop - 50 }px`
    colorPicker.color.rgbString = document.getElementById("LandscapeGenerator").style.backgroundImage.split(", t")[0].split("t(")[1]
    document.body.classList.remove("dragscroll")
    dragscroll.reset()
    objectColorIsChanging = document.getElementById("LandscapeGenerator");
    colorPanelIsChanging = e.target
  });
  ///fold----------------
}

///fold

//fold Function which deal with new elements
function creatObjectInPanel(id){

//fold Write the id of the element in a h3
const landscapeElement = document.createElement("h3");
objectContainer.appendChild(landscapeElement);
landscapeElement.textContent = id;
///fold--------------------

//fold Event click for edition
landscapeElement.addEventListener('click', (e) => {
  if (e.target.classList.length === 0  ) {
    if (e.target.style.backgroundColor != "rgb(71, 178, 209)") {
      mode = "edition"
      if (previosActiveElement != null) {
        previosActiveElement.style.backgroundColor = "transparent";
      }
      if (objectIsMoving.self != null) {
          objectIsMoving.self.setAttributeNS(null ,'fill', objectIsMoving.initColor);
      }
      landscapeElement.style.backgroundColor="rgb(71, 178, 209)"
      previosActiveElement = e.target
      moveElement(e.target.textContent.split("V")[0]);
      activePanel = e.target;
      //fold show instruction scale for Sun and Sunshine
      if (e.target.textContent.split("V")[0].search("Sun") != -1) {
        showInstruction("Use wheel for scaling",3000);
      }
      ///fold
    }
    else {
      mode = "navigation"
      e.target.style.backgroundColor = "transparent"
      objectIsMoving.self.setAttributeNS(null ,'fill', objectIsMoving.initColor)
    }
  }

});
///fold------------------------

//fold Creat visible button
const btnVisible = document.createElement("button");
btnVisible.classList.add('btnScenePanel');
btnVisible.textContent = 'V';

//fold Event click visible
btnVisible.addEventListener('click', (e) => {
  if (e.target.style.borderColor == "white" || e.target.style.borderColor == "") {
    e.target.style.color = "#ef6767"
    e.target.style.borderColor = "#ef6767"
    document.getElementById(e.srcElement.parentElement.textContent.split("V")[0]).style.visibility="hidden";
  }
  else {
    e.target.style.color = "white"
    e.target.style.borderColor = "white"
    document.getElementById(e.srcElement.parentElement.textContent.split("V")[0]).style.visibility="visible";
  }



});
///fold

landscapeElement.appendChild(btnVisible);
///fold

//fold Creat delete button
const btnDelete = document.createElement("button");
btnDelete.classList.add('btnScenePanel');
btnDelete.textContent = 'X';

//fold Event click delete
btnDelete.addEventListener('click', (e) => {
  document.getElementById(e.srcElement.parentElement.textContent.split("V")[0]).remove();
});
///fold----------------

landscapeElement.appendChild( btnDelete);
///fold-----------------

if (id.search("Bird") == -1 && id.search("Fog") == -1) {

  //fold creat color selector button
  var btnColorPicker = document.createElement("button");
  btnColorPicker.classList.add('btnScenePanel');
  btnColorPicker.style.backgroundColor= document.getElementById(id).getAttributeNS(null,'fill')
  landscapeElement.appendChild(btnColorPicker);
  ///fold--------------

  //fold color picker event
  btnColorPicker.addEventListener('click', (e) => {
    if (mode === "edition") {
      activePanel.style.background = "#464545";
      objectIsMoving.self.setAttributeNS(null ,'fill', objectIsMoving.initColor)
    }
    mode = "piking color"
    colorPickerRoot.style.display="block";
    colorPickerRoot.style.top = `${e.target.offsetTop - 50 }px`
    colorPicker.color.rgbString = e.target.style.backgroundColor
    document.body.classList.remove("dragscroll")
    dragscroll.reset()
    objectColorIsChanging = document.getElementById(id);
    colorPanelIsChanging = e.target
  });
  ///fold------------
}
}
///fold----------------------

//fold Get all elements in the scene and display them in panel
const getObjectsScene =  function  getObjectsScene(){
  var landscapeObjects = document.getElementsByClassName('LandscapeObject');
  objectContainer.innerHTML = '';
  mode = "navigation"
  creatSkyPanel()
  for (var obj of landscapeObjects) {
    creatObjectInPanel(obj.id)
  };
}
///fold----------------------------

///fold--------------------------------

//fold  Right panel

//fold Init options of right panel
function separateStringByUpperCase(str) {
  str = str.slice(3)
  for (let char of str) {
    if (char == char.toUpperCase() && str.indexOf(char) != 0) {
      str = str.slice(0,str.indexOf(char)) + " " + str.slice(str.indexOf(char))
    }
  }
  return str
}

function checkMax(option,val){
  let maxNode, minNode
  minNode = document.getElementById(option)
  maxNode = document.getElementById("max" + option.slice(3))
  minNode.setAttribute('max', maxNode.value);
  console.log(maxNode.value);
  console.log(minNode.value);
  if (minNode.value > maxNode.value) {
    console.log("over");
    minNode.value = maxNode.value

  }
}

function checkMin(option){
  let min
}

let optionDiv, minInput, maxInput, optionText
for (var option in LG) {
  if (LG.hasOwnProperty(option)) {
    if (String(option).search("min") != -1) {
      optionDiv = document.createElement("div")
      optionDiv.classList.add("option")
      optionContainer.appendChild(optionDiv);
      minInput = document.createElement("input")
      minInput.setAttribute('type', "number")
      if (option === "minPlainsHeight") {
        minInput.setAttribute("value",(LG[option]- LG.node.getAttribute('height'))*-1)
      }
      else {
        minInput.setAttribute("value",LG[option])
      }
      minInput.setAttribute('id', option);
      optionDiv.appendChild(minInput);
      optionText = document.createElement("h4");
      optionText.innerText = separateStringByUpperCase(option)
      optionDiv.appendChild(optionText);
      minInput.addEventListener('focusout', (e)=> {
        if ( Number(e.target.value) > document.getElementById("max" + e.target.id.slice(3)).value ){
          e.target.value = document.getElementById("max" + e.target.id.slice(3)).value
        }
        newOption[e.target.id] = Number(e.target.value)
        LG.set(newOption)
        newOption = {}

      });

    }
    if (String(option).search("max") != -1)  {
      maxInput = document.createElement("input")
      maxInput.setAttribute('type', "number")
      if (option === "maxPlainsHeight") {
        maxInput.setAttribute("value",(LG[option]- LG.node.getAttribute('height'))*-1)
      }
      else {
        maxInput.setAttribute("value",LG[option])
      }
      maxInput.setAttribute('id', option);
      maxInput.addEventListener('focusout', (e)=> {
        if ( Number(e.target.value) < document.getElementById("min" + e.target.id.slice(3)).value ){
          e.target.value = document.getElementById("min" + e.target.id.slice(3)).value
        }
        newOption[e.target.id] = Number(e.target.value)
        LG.set(newOption)
        newOption = {}
        console.log(LG);
      });
      optionDiv.appendChild(maxInput);
    }
  }
}
///fold-----------------------------------------------

//fold Init boolean options
for (let option in LG) {
  if (LG.hasOwnProperty(option) && typeof LG[option] === "boolean" ) {
    let optionName = document.createElement("h3")
    optionName.innerText = option.split("Bool")[0].slice(0,1).toUpperCase() + option.split("Bool")[0].slice(1)
    optionContainer.appendChild(optionName);
    let checkbox = document.createElement("input")
    checkbox.setAttribute('type', "checkbox");
    optionName.appendChild(checkbox);
    if (LG[option] == true) {
      checkbox.checked = true
    }
    checkbox.addEventListener('change', (e) => {
      newOption[String(e.target.parentElement.innerText.toLowerCase() + "Bool")] = e.target.checked
      LG.set(newOption)
      newOption = {}
    });

  }
}
///fold----------------------

///fold-------------------------------------

///fold========================================================================

//fold ================================================================== Events

//fold Observer of the scene
const sceneObserver = new MutationObserver(getObjectsScene)

sceneObserver.observe(LG.node, {
  childList: true
})
///fold--------------------

//fold Click events
rightPanel.addEventListener('mousedown', (e)=> {
  document.body.classList.remove("dragscroll")
  dragscroll.reset();
});

LG.node.addEventListener('mousedown', (e) => {
if (mode === "navigation" && e.target != rightPanel && menuExport.style.display != "block") {
  document.body.classList.add("dragscroll")
  dragscroll.reset();
}
 if ( mode === "edition"){
   document.body.classList.remove("dragscroll")
   dragscroll.reset()
   mode = "move"
   startMoving.x = e.clientX ;
   startMoving.y = e.clientY ;
 }
});

LG.node.addEventListener('mousemove', (e) => {
  if (mode === "move") {
    if (objectIsMoving.self.getAttributeNS(null,"transform") == null) {
      objectIsMoving.self.setAttributeNS(null,'transform',`translate(0,0)`)
    }
    else{
      if (objectIsMoving.self.id.search("Bird") != -1 || objectIsMoving.self.id.search("Sun") != -1 ) {
        objectIsMoving.self.setAttributeNS(null,'transform',
        `translate(${Number(objectIsMoving.self.getAttributeNS(null,"transform").split("(")[1].split(",")[0])+ (e.clientX - startMoving.x)},
          ${Number(objectIsMoving.self.getAttributeNS(null,"transform").split(",")[1].split(")")[0]) + (e.clientY - startMoving.y)})`);
        startMoving.x = e.clientX
        startMoving.y = e.clientY
        console.log("first block");

      }
      else {
        objectIsMoving.self.setAttributeNS(null,'transform',
        `translate(0,${Number(objectIsMoving.self.getAttributeNS(null,"transform").split(",")[1].split(")")[0]) + (e.clientY - startMoving.y)})`);
        startMoving.y = e.clientY

      }



    }
  }
});

window.addEventListener('mouseup', (e) => {

 if (mode === "move"  ) {
  document.body.classList.add("dragscroll")
  dragscroll.reset()
   mode = "edition"

 }

});

window.addEventListener('mousedown', (e)=> {
  if(mode === "piking color" &&  (e.clientX < 230 || e.clientX > 370 || e.clientY < colorPickerRoot.style.top.split("p")[0] || e.clientY > Number(colorPickerRoot.style.top.split("p")[0]) + 180)){

    colorPickerRoot.style.display = "none"
    mode = "navigation"
    document.body.classList.add("dragscroll")
    dragscroll.reset()

  }
});

window.addEventListener('wheel', (e) => {
    if (mode == "edition" && objectIsMoving.self.id.search("Sun") != -1 ) {
      objectIsMoving.self.setAttributeNS(null,'r', Number(objectIsMoving.self.getAttributeNS(null,'r')) + Number(e.deltaY/-50) );
      console.log("scale");
    }
});

///fold-------------------------

//fold Color picker event
colorPicker.on("input:move", (color) =>{
  if (objectColorIsChanging != undefined && objectColorIsChanging != document.getElementById('LandscapeGenerator')) {
      objectColorIsChanging.setAttributeNS(null,'fill', color.rgbString);
      colorPanelIsChanging.style.backgroundColor = color.rgbString
      objectIsMoving.initColor = color.rgbString
  }
  else if (objectColorIsChanging == document.getElementById('LandscapeGenerator')) {
    objectColorIsChanging.style.backgroundImage = `linear-gradient(to bottom, ${color.rgbString} ,transparent)`
    colorPanelIsChanging.style.backgroundColor = color.rgbString
  }
})
///fold---------------------------

//fold Generate landscape againe
btnGenerate.addEventListener('click', ()=>{ LG.generate() });
///fold-----------

//fold Show left panel
btnShowLeftPanel.addEventListener('click', ()=> {
  btnShowLeftPanel.style.transition = leftPanel.style.transition =  "transform 0.5s";
  if (btnShowLeftPanel.textContent ==">" ) {

    btnShowLeftPanel.style.transform = leftPanel.style.transform = "translateX(210px)"

  }
  else {
    btnShowLeftPanel.style.transform = leftPanel.style.transform = "translateX(0)"
  }

});
btnShowLeftPanel.addEventListener('transitionend', ()=>{
  btnShowLeftPanel.style.transition = leftPanel.style.transition = ""
  if (btnShowLeftPanel.style.transform == "translateX(210px)") {
    btnShowLeftPanel.textContent = "<"
  }
  else {
    btnShowLeftPanel.textContent = ">"
  }
});
///fold-------------------------------

//fold Show right panel
btnShowRightPanel.addEventListener('click', ()=> {
  btnShowRightPanel.style.transition = rightPanel.style.transition = btnExport.style.transition = btnGenerate.style.transition =  "transform 0.5s";
  if (btnShowRightPanel.textContent =="<" ) {

    btnShowRightPanel.style.transform = rightPanel.style.transform = btnExport.style.transform = btnGenerate.style.transform = "translateX(-210px)"

  }
  else {
    btnShowRightPanel.style.transform = rightPanel.style.transform = btnExport.style.transform = btnGenerate.style.transform = "translateX(0)"
  }

});
btnShowRightPanel.addEventListener('transitionend', ()=>{
  btnShowRightPanel.style.transition = rightPanel.style.transition = btnExport.style.transition = btnGenerate.style.transition = ""
  if (btnShowRightPanel.style.transform == "translateX(-210px)") {
    btnShowRightPanel.textContent = ">"
  }
  else {
    btnShowRightPanel.textContent = "<"
  }
});
///fold

///fold==========================================================================

//fold ==================================================================== Export menu
document.addEventListener('keydown', (e)=> {
  if (e.key == "e") {
    btnExport.click()
  }
});

btnExport.addEventListener('click', () => {
  menuExport.style.display = "block"
  document.body.classList.remove("dragscroll");
  dragscroll.reset();
  SVGexport.innerText = LG.node.parentElement.innerHTML
});

btnCancel.addEventListener('click', () => {
  menuExport.style.display = "none";
  document.body.classList.add("dragscroll");
  dragscroll.reset();
});

copy.addEventListener('click', () =>{
  SVGexport.select();
  document.execCommand("copy");
  alert("svg copied in clipboard")
  // window.getSelection().removeAllRanges() ?
});

exportPNG.addEventListener('click', ()=> {
  saveSvgAsPng(LG.node, "Landscape.png" );
});

let layers = []
let layerImg = []
let uri, idx , content, previosBackground

exportLayers.addEventListener('click', () => {

  for (var node of LG.node.children) {
    if(node.id.search("Fog") === -1 && node.id.search("Bird") === -1 && node.id.search("def") === -1){
      layers.push(node)
    }
  }
  LG.node.style.visibility = "hidden"

  async function exportLayers(){
  uri = await svgAsPngUri(LG.node)
  idx = uri.indexOf('base64,') + 'base64,'.length;
  content = uri.substring(idx);
  zip.file("Sky.png",content,{base64:true})
  previosBackground = LG.node.style.backgroundImage;
  LG.node.style.backgroundImage = "none";
  for (var node of layers) {
    document.getElementById(node.id).style.visibility = "visible";
    if (node.id.search("Mountains") != -1) {
      document.getElementById("Fog " + node.id.split(" ")[1]).style.visibility = "visible";
    }
    uri = await svgAsPngUri(LG.node)
    idx = uri.indexOf('base64,') + 'base64,'.length;
    content = uri.substring(idx);
    zip.file(node.id+".png",content,{base64:true})
    document.getElementById(node.id).style.visibility = "hidden"
    if (node.id.search("Mountains") != -1) {
      document.getElementById("Fog " + node.id.split(" ")[1]).style.visibility = "hidden";
    }
        if (layers.indexOf(node) == layers.length-1) {
          zip.generateAsync({type:"base64"}).then(function (base64) {
             window.location = "data:application/zip;base64," + base64;
         })
         LG.node.style.visibility="visible"
         LG.node.style.backgroundImage = previosBackground;
         layers.forEach( (layer) => {
           layer.style.visibility="visible"
         });
        }
  }
}
exportLayers();
  });
///fold

getObjectsScene(); //run it the fisrt time
