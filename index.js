let canvas=document.querySelector("canvas")
const ctx = canvas.getContext("2d");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let width=canvas.width;
let height=canvas.height;
let tankDragged=false;
let floor=height-25;
let mouseDown=false;
let tank={w:60,h:50,x:0,y:floor-53}
let cannon={w:100,h:30,angle:Math.PI/4}
let ball={x:0,y:0,xStart:0,yStart:0,fired:false}
let dir={left:false,right:false,up:false,down:false}

canvas.addEventListener("mousedown",(e)=>{
    mouseDown=true;
    let path = new Path2D();
    path.rect(tank.x,tank.y,tank.w,tank.h)
    if ((ctx.isPointInPath(path, e.offsetX, e.offsetY))&&!tankDragged){
    tankDragged=true
    }
})
canvas.addEventListener("mouseup",()=>{
    mouseDown=false;
    tankDragged=false
})

canvas.addEventListener("mousemove",(e)=>{
if (tankDragged){
    tank.x=e.offsetX-tank.w/2;
}else if(mouseDown){
    cannon.angle=Math.atan2(tank.y-tank.h/2 - e.offsetY, (-(tank.x+tank.w/2 - e.offsetX)))
    if(cannon.angle>=Math.PI||(cannon.angle<0.1&&cannon.angle<-1)){
        cannon.angle=Math.PI-0.1
        }
    if(cannon.angle<0.1&&cannon.angle>-1){
    cannon.angle=0.1
    }
}
})
document.addEventListener("keydown",(key)=>{
    if(!mouseDown){
        if(key.key=="a"||key.key=="ArrowLeft"){
            dir.left=true
        }
        if(key.key=="d"||key.key=="ArrowRight"){
            dir.right=true
        }
    }
        if(key.key=="w"||key.key=="ArrowUp"){
            dir.up=true
        }
        if(key.key=="s"||key.key=="ArrowDown"){
            dir.down=true;
        }
        if(key.key==" "){
            ball.fired=true
        }
})

document.addEventListener("keyup",(key)=>{
    if(key.key=="a"||key.key=="ArrowLeft"){
        dir.left=false
    }
    if(key.key=="d"||key.key=="ArrowRight"){
        dir.right=false
    }
    if(key.key=="w"||key.key=="ArrowUp"){
        dir.up=false
    }
    if(key.key=="s"||key.key=="ArrowDown"){
        dir.down=false;
    }
 })

window.addEventListener("resize", () => {
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    width=canvas.width;
    height=canvas.height;
    floor=height-25;
    tank.y=floor-53
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
    ctx.fillStyle="green"
    ctx.fillRect(0,floor,width,height)
    }
    
function tankMovement(){
    if(dir.right){
        tank.x+=10
    }
    if(dir.left){
        tank.x-=10
    }
    if(tank.x>width-tank.w-(cannon.w-24)*Math.cos(cannon.angle)){
        tank.x=width-tank.w-(cannon.w-24)*Math.cos(cannon.angle);
    }
    if(tank.x<0){
        tank.x=0;
    }
    if(dir.up&&cannon.angle<Math.PI-0.1){
        cannon.angle+=0.1
    }
    if(dir.down&&cannon.angle>0.1){
        cannon.angle-=0.1
    }
}

function physicsWrapper(){
    let yInit=-25
    let xInit=25
    let v={x:0,y:0}
    let angle=cannon.angle
    let reset=true
    physicsInternal= function(){
        if(reset){
        reset=false
        angle=cannon.angle
        v.x=xInit
        v.y=yInit
        v.y=yInit*Math.sin(angle)
        v.x=xInit*Math.cos(angle)
        ball.x=ball.xStart
        ball.y=ball.yStart
        }
        ball.x+=v.x
        v.y+=(1)
        ball.y+=v.y
        if(ball.y>floor){
            ball.fired=false;
            reset=true
        }
    }
return physicsInternal
}
let physics=physicsWrapper()

function drawTank(){
    //body
    ctx.fillStyle="grey"
    ctx.beginPath();
    ctx.roundRect(tank.x,tank.y,tank.w,tank.h,[10])
    ctx.fill()
    //ball
    ctx.beginPath();
    ctx.fillStyle="black"
    ball.xStart=tank.x+tank.w/2+(cannon.w-12)*Math.cos(cannon.angle)
    ball.yStart=tank.y+tank.h/2-tank.h/4+4+(cannon.w-12)*Math.sin(-cannon.angle)
    if(ball.fired){
        physics()
    }else{
        ball.x=ball.xStart
        ball.y=ball.yStart
    }
    ctx.arc(ball.x,ball.y,10,0,2*Math.PI)
    ctx.fill()
    //cannon
    ctx.fillStyle="grey"
    ctx.translate(tank.x+tank.w/2,tank.y+tank.h/2-tank.h/4+4)
    ctx.rotate(-cannon.angle);
    ctx.beginPath();
    ctx.roundRect(-cannon.w/4+cannon.w/8, -cannon.h/2, cannon.w, cannon.h,[5])
    ctx.fill()
    ctx.translate(-tank.x+tank.w/2, -tank.y+tank.h/2-tank.h/4+4)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    //wheels
    ctx.beginPath();
    ctx.fillStyle="black"
    ctx.arc(tank.x+10,tank.y+50,10,0,2*Math.PI)
    ctx.arc(tank.x+50,tank.y+50,10,0,2*Math.PI)
    ctx.fill()
    //rect on front
    ctx.fillStyle="green"
    ctx.lineWidth=4
    ctx.beginPath();
    ctx.roundRect(tank.x+5,tank.y+15,50,10,[40])
    //line on front
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(tank.x+10,tank.y+20)
    ctx.lineTo(tank.x+50,tank.y+20)
    ctx.stroke()
}
