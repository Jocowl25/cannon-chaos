let canvas=document.querySelector("canvas")
const ctx = canvas.getContext("2d");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let width=canvas.width;
let height=canvas.height;
let tankDragged=false;
const floor=height-20;

let mouseDown=false;
let tank={w:60,h:30,x:0,y:floor-30}
let dir={left:false,right:false,up:false,down:false}

canvas.addEventListener("mousedown",(e)=>{
    let path = new Path2D();
    path.rect(tank.x,tank.y,tank.w,tank.h)
    if ((ctx.isPointInPath(path, e.offsetX, e.offsetY))&&!tankDragged){
    tankDragged=true
    }
})
canvas.addEventListener("mouseup",()=>tankDragged=false)

canvas.addEventListener("mousemove",(e)=>{
if (tankDragged){
    tank.x=e.offsetX-tank.w/2;
}
})
document.addEventListener("keydown",(key)=>{
    if(key.key=="a"||key.key=="ArrowLeft"){
        dir.left=true
    }
    if(key.key=="d"||key.key=="ArrowRight"){
        dir.right=true
    }
})

document.addEventListener("keyup",(key)=>{
    if(key.key=="a"||key.key=="ArrowLeft"){
        dir.left=false
    }
    if(key.key=="d"||key.key=="ArrowRight"){
        dir.right=false
    }
 })

window.addEventListener("resize", () => {
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    width=canvas.width;
    height=canvas.height;
});
requestAnimationFrame(draw)

function draw(){
    setStatic()
    tankMovement()
    drawTank()
    requestAnimationFrame(draw)
}
function setStatic(){
    //sky
    ctx.fillStyle="#82fff7"
    ctx.fillRect(0,0,width,height)
    //floor
    ctx.fillStyle="black"
    ctx.fillRect(0,floor,width,height)
    }
    
function tankMovement(){
    if(dir.right){
        tank.x+=10
    }
    if(dir.left){
        tank.x-=10
    }
    if(tank.x>width-tank.w){
        tank.x=width-tank.w;
    }
    if(tank.x<0){
        tank.x=0;
    }
}

function drawTank(){
    ctx.fillStyle="brown"
    ctx.fillRect(tank.x,tank.y,tank.w,tank.h)
}

