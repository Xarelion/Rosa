import { Idle, Moving, Rolling, Sleeping, Surface, Eating, Spinning } from "./rosaStates.js";

export class Rosa {
    constructor(game){
        this.game = game;

        this.image = document.getElementById('rosa');
        this.image_splash = document.getElementById('rosa_floating_splash');
        this.splash_offset = 0;
        this.spriteWidth = 48;
        this.spriteHeight = 48;
        this.framesX = 8;
        this.framesY = 5;
        this.minFrame = 0;
        this.maxFrame = 1;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.scale = 1;
        this.width = this.scale * this.spriteWidth;
        this.height = this.scale * this.spriteHeight;
        this.x = 160;
        this.y = game.waterLevel-this.spriteHeight/2 + 12;
        //this.maxPositionInWater = this.y;
        this.direction = 1;
        this.floating = 1; // Affected by waves
        this.onLand = 0;
        this.speed = 40;
        this.heldItem = null;

        this.fps = 10;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;

        this.waveInterval = 1000/game.waveFrequency;
        this.waveTimer = 0;

        this.states = [
            new Idle(this), 
            new Moving(this), 
            new Rolling(this), 
            new Sleeping(this), 
            new Surface(this), 
            new Eating(this), 
            new Spinning(this)
        ];
        this.floating = false;
        this.currentState = this.states[0];
        this.currentState.enter();
        this.currentStateIndex = 0;

        this.offsetY = 0;
        this.yCounter = 0;
        this.maxYCounter = 16;
    }

    maxPositionInWater(){
        let maxPositionInWater = this.game.waterLevel;
        this.game.water.forEach(w => {
            if (this.x > w.x && this.x < w.x + w.width){
                maxPositionInWater = w.y + 4;
            }
        })
        return maxPositionInWater;
    }

    lookForInteractibles(){
        console.log("searching")
        let maxValue = 0;
        if (this.heldItem){ maxValue = this.heldItem.value }
        for (let i = 0; i < this.game.gameObjects.length; i++){
            let target = this.game.gameObjects[i];
            if (!target.active && target.interactible){
                if (target.value > maxValue){
                    maxValue = target.value;
                    this.target = target;
                }
            }
        }
    }

    // draw(context){
    //     // context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, 
    //     //     this.spriteWidth, this.spriteHeight, this.x, this.y + this.offsetY, this.width, this.height);

    //     context.save();
    //     context.translate(this.x, this.y);
    //     context.drawImage(this.image, this.frameX * this.spriteWidth, 
    //         this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight,
    //         0, this.offsetY, (this.width), (this.height));
    //     context.restore(); 
    // }
    draw(context){
        // if (this.direction == 1){
        // context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, 
        //     this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        // } else {
            context.save(); 

            // move to the middle of where we want to draw our image

            context.translate(Math.round(this.x), Math.round(this.y + this.currentState.waterLevel));

            // rotate around that point, converting our 
            // angle from degrees to radians 
            //let angle = 0;
            //context.rotate(angle * TO_RADIANS);

            context.scale(this.direction,1);
            // context.drawImage(this.image, this.frameX * this.spriteWidth -(this.spriteWidth/2), 
            //     this.frameY * this.spriteHeight -(this.spriteHeight/2), 
            //     this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
            // draw it up and to the left by half the width
            // and height of the image 
            // context.drawImage(this.image, -(this.spriteWidth/2), -(this.spriteHeight/2), this.spriteWidth, this.spriteHeight,
            // -(this.spriteWidth/2), -(this.spriteHeight/2), this.width, this.height);
            // context.drawImage(this.image, 
            //     -(this.spriteWidth/2) + this.frameX * this.spriteWidth, 
            //     -(this.spriteHeight/2) + this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight,
            // -(this.spriteWidth/2), -(this.spriteHeight/2), (this.width), (this.height));
            //context.translate(0, 0);
            //context.translate(-this.x, -this.y);
            context.drawImage(this.image, 
                this.frameX * this.spriteWidth, 
                this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight,
                -this.spriteWidth/2, -this.spriteHeight/2 + this.offsetY, (this.width), (this.height));
            //context.translate(-this.x, -this.y);
            if (this.floating){
                context.drawImage(this.image_splash, 
                    this.frameX%2 * this.spriteWidth, 
                    this.frameY%2 * this.spriteHeight, this.spriteWidth, this.spriteHeight,
                    -this.spriteWidth/2, -this.spriteHeight/2 + this.offsetY - this.currentState.waterLevel, (this.width), (this.height));
            }

            // and restore the co-ords to how they were when we began
            context.restore(); 
     //   }
    }

    update(input, deltaTime){
        this.currentState.handleInput(input, deltaTime);
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            
            this.frame = this.frame < this.maxFrame ? this.frame + 1 : this.frame = this.minFrame;
            this.frameX = this.frame % this.framesX;
            this.frameY = Math.floor(this.frame/this.framesX);
        } else {
            this.frameTimer += deltaTime;
        }
        if (this.floating) {
            if (this.waveTimer > this.waveInterval){
                this.waveTimer = 0;

                // Offset vertically according to waves
                if (this.yCounter > this.maxYCounter){
                    this.yCounter = 0;
                }
                this.offsetY = Math.round(2 * Math.sin((2*Math.PI / this.maxYCounter)*this.yCounter));
                this.yCounter += 1;
            } else {
                this.waveTimer += deltaTime;
            }
        } else {
            this.offsetY = 0;
        }

    }
    setAnimation(newMinFrame, newMaxFrame, fps = 10){
        this.minFrame = newMinFrame;
        this.maxFrame = newMaxFrame;
        this.frame = this.minFrame;

        this.fps = fps;

        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
    }
    setState(state){
        this.currentState = this.states[state];
        this.currentStateIndex = state;
        this.currentState.enter();
    }
}