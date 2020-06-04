"use strict"; 


const numStars = 900; 

const spaceAnimate = function(ctx, canvas, options){
  
   let stars = [];  

   let movingToStaticRatio = 'movingToStaticRatio' in options 
                             ? options.movingToStaticRatio
                             : 0.5;

   for(let i = 0; i < numStars; i++){
        stars.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              z: Math.random() * canvas.width,
              o: '0.'+Math.floor(Math.random() * 99) + 1, 
              moving: Math.random() > movingToStaticRatio ? true : false
        });
    }

    let moveStars =()=>{
         stars.forEach(star => {
            if(star.moving) {
                star.z--;
                if(star.z <= 0) star.z = canvas.width;
            }
        })
    }


    let draw = function(){
        let radius = '0.'+Math.floor(Math.random() * 9) + 1  ;
        let focalLength = canvas.width *2;
        let centerX = canvas.width / 2; 
        let centerY = canvas.height / 2; 

        ctx.fillStyle = "rgba(0,10,20,1)";
        ctx.fillRect(0,0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(209, 255, 255, "+radius+")";
        stars.forEach(star => { 
            let pixelX = (star.x - centerX) * (focalLength / star.z);
            pixelX += centerX;
            let pixelY = (star.y - centerY) * (focalLength / star.z);
            pixelY += centerY;
            let pixelRadius = 1 * (focalLength / star.z);
            ctx.fillStyle = "rgba(233, 255, 200, "+star.o+")";
            ctx.beginPath()
            ctx.arc(pixelX, pixelY, pixelRadius, 0, Math.PI * 2, 0);
            ctx.fill()
            ctx.stroke()
 
        })
    }
  
    let animate = ()=>{
        moveStars(); 
        draw(); 
        window.requestAnimationFrame(animate);  
    } 
    animate(); 
}

const addJsEffects = function( app ){

    let animationMap = {
        "stars 1" : (ctx, canvas) => spaceAnimate(ctx, canvas, {}), 
        "stars 2" : (ctx, canvas) => spaceAnimate(ctx, canvas, {
            movingToStaticRatio :  0
         })
    }
    let spaceCanvases = document.getElementsByClassName("animated");
    for (let canvas of spaceCanvases){
        let animation = $('#' + canvas.id).data('animation-info');
        if('type' in animation){
            let ctx = canvas.getContext("2d");
            (animationMap[animation.type])(ctx, canvas); 
        }
   }
}

module.exports = {
    addJsEffects
}
