import { Shrimp, Ice, Ball, Pepper, Beacon } from "./physicsObject.js";

class AnimatedObjects {
    constructor(game, x, y, imageName, framesX = 1, framesY = 1, fps = 10){
        this.game = game;
        this.id = Date.now().toString();
        this.image = document.getElementById(imageName);
        this.spriteWidth = this.image.width / framesX;
        this.spriteHeight = this.image.height / framesY;
        this.scale = 1;
        this.width = this.scale * this.spriteWidth;
        this.height = this.scale * this.spriteHeight;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.framesX = framesX;
        this.framesY = framesY;
        this.minFrame = 0;
        this.maxFrame = (this.framesX * this.framesY) -1;
        this.fps = fps;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.direction = 1;
    }

    draw(context, x, y){
        if (x){
            this.x = x-this.spriteWidth/2;
            this.y = y-this.spriteHeight/2;
        }
        context.save(); 
        context.translate(Math.round(this.x), Math.round(this.y));
        //context.rotate(angle);  // rotate around that point, angle in radians 
        context.scale(this.direction,1);
        let posX = 0;
        if (this.direction == 1){
            posX = 0} else {
                posX =-this.spriteWidth;
            }
        let posY = 0;
        if (this.offsetY){
            posY = this.offsetY;
        }
        context.drawImage(this.image, 
            this.frameX * this.spriteWidth, 
            this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight,
        posX, posY, (this.width), (this.height));
        context.restore();
    }

    update(input, deltaTime){
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            
            this.frame = this.frame < this.maxFrame ? this.frame + 1 : this.frame = this.minFrame;
            this.frameX = this.frame % this.framesX;
            this.frameY = Math.floor(this.frame/this.framesX);
        } else {
            this.frameTimer += deltaTime;
        }
    }
    setAnimation(newMinFrame, newMaxFrame){
        this.minFrame = newMinFrame;
        this.maxFrame = newMaxFrame;
        this.frame = this.minFrame;
    }
}

export class Guppy extends AnimatedObjects {
    constructor(game, x, y){
        super(game, x, y, 'guppy', 2, 1);
    }
    update(input, deltaTime){
        if (this.x + this.spriteWidth/2 > this.game.width - 28){
            this.direction = -1;
            this.frame = 0;
        } else if (this.x  + this.spriteWidth/2 < 20){
            this.direction = 1;
            this.frame = 0;
        } else if (Math.random() > 0.999){
            this.direction *= -1;
            this.frame = 0;}
        this.x += this.direction*10*deltaTime/1000;
        super.update(input, deltaTime);
    }
    draw(context){
        super.draw(context);
    }
}

export class Bird extends AnimatedObjects {
    constructor(game, regionIndex){
        super(game, 0, 0, 'bird', 2, 4, 3);
        this.idleTimer = 0;
        this.idleTimeBeforeAction = 0;
        this.action = 0;
        this.count = 0;
        this.hopX = [
            1, 1, 1, 1, 
            0, 0, 0, 0, 
            -1, -2, -2, -2, 
            1, 1, 1, 1, 
            0, 0, 0, 0,
            1, 2, 2, 1,
            -1, -2, -2, 0];
        this.hopY = [
            -1, -1, 1, 1, 
            0, 0, 0, 0,
            -2, -2, 2, 2, 
            -2, -2, 2, 2, 
            0, 0, 0, 0,
            -1, -1, 1, 1,
            -2, -2, 2, 1, ];
        this.game.regions[regionIndex].occupants += 1;
        this.region = this.game.regions[regionIndex];
        this.currentRegion = regionIndex;
        this.direction = this.region.direction;
        this.x = Math.round(this.region.x + this.region.width/2 - this.width);
        this.y = Math.round(this.region.y + this.region.height/2- this.height);
        this.xOffset = 0;
        this.yOffset = 0;
        this.target = null;
        this.speed = 50;
        this.yOffset = 0;
        this.yCounter = 0;
        this.maxYCounter = 16;
    }
    update(input, deltaTime){
        
        if (input.drag && input.activeObject == null){
            if (Math.abs(input.mouseX - (this.x + this.width/2)) < 3 && Math.abs(input.mouseY - (this.y + this.height/2)) < 3){
                this.setTarget();
            }
        }
        if (this.target){
            if (this.action != 5){
                this.xOffset= (this.target.occupants - 1) * 3;
                this.yOffset = (this.target.occupants - 1) * 2;
                this.action = 5;
                this.setAction();
            }
            let direction = {
                x:(this.target.x + this.target.width/2 + this.xOffset - (this.x + this.width/2)), 
                y:(this.target.y + this.target.height/2 + this.yOffset - (this.y + this.height))};
            let distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
            if (distance < 2 ){
                this.region = this.target;
                this.direction = this.region.direction;
                this.target = null;
                if (this.region.actions[0] == 4){
                    this.action = 4;
                } else {
                    this.action = 0;
                }
                this.setAction();
                this.update(input, 10000);
            } else {
                this.direction = Math.sign(direction.x)*1;
                let directionNorm = {x: (direction.x / distance), y: (direction.y / distance)};
                this.x += directionNorm.x*this.speed*(deltaTime/1000);
                this.y += directionNorm.y*this.speed*(deltaTime/1000);
            }
        } else if (this.action == 4) {
            // Offset vertically according to waves
            if (this.frameTimer > this.frameInterval){
                this.frameTimer = 0;
                if (this.yCounter > this.maxYCounter){
                    this.yCounter = 0;
                    if (Math.random() < 0.15){
                        this.setTarget();
                    }
                }
                this.offsetY = Math.round(2 * Math.sin((2*Math.PI / this.maxYCounter)*this.yCounter));
                this.yCounter += 1;
            } else {
                this.frameTimer += deltaTime;
            }
        } else {
            this.idleTimer += deltaTime / 1000;
            if (this.idleTimer >= this.idleTimeBeforeAction){
                if (this.action == 3){
                
                    this.count += 1;
                    if (this.count >= this.hopX.length){
                        this.count = 0;
                        this.action = 0;
                    } else {
                        if (Math.sign(this.hopX[this.count]) != 0){
                            this.direction = Math.sign(this.hopX[this.count]);
                        }
                        this.x += this.hopX[this.count];
                        this.y += this.hopY[this.count];
                        this.idleTimer = 0;
                    }
                } else {
                    if (Math.random() < 0.15){
                        this.setTarget();
                    } else {
                        this.idleTimer = 0;
                        this.action = (Math.floor(Math.random() * this.region.actions.length));
                        this.setAction();
                    }
                }
            }
        }
        super.update(input, deltaTime);
    }
    draw(context){
        super.draw(context);
    }

    setTarget(){
        let target = (Math.floor(Math.random() * this.game.regions.length));
        if (target != this.currentRegion){
            if (this.game.regions[target].occupants < this.game.regions[target].maxOccupants){
                this.game.regions[target].occupants += 1;
                this.game.regions[this.currentRegion].occupants -= 1;
                this.currentRegion = target;
                this.target = this.game.regions[target];
                this.action = 0;
                this.setAction();
            }
        } else {
            this.idleTimer = 0;
        }
    }

    setAction(){
        this.idleTimer = 0;
        this.frameTimer = 0;
        if (this.action == 0){
            // Return to idle
            this.minFrame = 0;
            this.maxFrame = 0;
            this.frame = 0;
            this.idleTimeBeforeAction = 6;
            this.fps = 1;
        } else if (this.action == 1){  
            // Wing
            this.idleTimeBeforeAction = 0.75;
            this.minFrame = 0;
            this.maxFrame = 1;
            this.frame = 0;
            this.fps = 30;
        } else if (this.action == 2){
            // Peck
            this.minFrame = 1;
            this.maxFrame = 2;
            this.frame = 1;
            this.idleTimeBeforeAction = 2;
            this.fps = 16;
        } else if (this.action == 3){
            // Hop
            this.minFrame = 0;
            this.maxFrame = 0;
            this.frame = 0;
            this.idleTimeBeforeAction = 0.08;
            this.fps = 10;
        } else if (this.action == 4){
            // Float
            this.minFrame = 4;
            this.maxFrame = 5;
            this.frame = 4;
            this.idleTimeBeforeAction = 5;
            this.fps = 4;
        } else if (this.action == 5){
            // Fly
            this.minFrame = 6;
            this.maxFrame = 7;
            this.frame = 6;
            this.idleTimeBeforeAction = 0;
            this.fps = 10;
        }
        this.frameInterval = 1000/this.fps;
    }
}

export class Seaweed extends AnimatedObjects {
    constructor(game, x, y){
        super(game, x, y, 'seaweed', 1, 1);
    }
    update(input, deltaTime){
        super.update(input, deltaTime);
    }
    draw(context){
        super.draw(context);
    }
}

export class Kelp extends AnimatedObjects {
    constructor(game, x, y, startFrame){
        super(game, x, y, 'kelp', 4, 1, 5);
        this.frame = startFrame;
        this.minFrame = 0;
        this.maxFrame = 3;
    }
    update(input, deltaTime){
        super.update(input, deltaTime);
    }
    draw(context){
        super.draw(context);
    }
}

export class Wave extends AnimatedObjects {
    constructor(game, x, y, coords){
        super(game, x, y, 'wave', 2, 1, 3);
        this.coords = coords;
    }
    update(input, deltaTime){
        super.update(input, deltaTime);
    }
    draw(context){
        this.coords.forEach(coord => {
            super.draw(context, coord.x, coord.y);
        });
    }
}

export class Waves extends AnimatedObjects {
    constructor(game, x, y, imageName, spriteHeight, yCounter = 0){
        super(game, x, y, imageName, 2, 1, game.waveFrequency*2);
        this.offsetY = 0;
        this.yCounter = yCounter;
        this.maxYCounter = 16;
        this.spriteHeight = spriteHeight;
        this.height = this.spriteHeight;

        this.fps = this.game.waveFrequency;
        this.waveInterval = 1000/this.fps;
        this.waveTimer = 0;
    }
    update(input, deltaTime){
        if (this.waveTimer > this.waveInterval){
            this.waveTimer = 0;

            if (this.yCounter > this.maxYCounter){
                this.yCounter = 0;
            }
            this.offsetY = Math.round(.8 * Math.sin((2*Math.PI / this.maxYCounter)*this.yCounter));
            this.yCounter += 1;
            
        } else {
            this.waveTimer += deltaTime;
        }
        super.update(input, deltaTime);
    }
    draw(context){
        context.save(); 
        context.translate(Math.round(this.x), Math.round(this.y));
        let posY = 0; 
        if (this.offsetY){
            posY = this.offsetY;
        }
        context.drawImage(this.image, 
            this.frameX * this.spriteWidth, 
            2 + posY, 
            this.spriteWidth, 
            this.spriteHeight,
        0, 0, (this.width), (this.height));
        context.restore();
    }
}

export class Bag extends AnimatedObjects {
    constructor(game, x, y){
        super(game, x, y, 'bag', 1, 1);
    }
    update(input, deltaTime){
        if (input.drag && input.activeObject == null){
            if (Math.abs(input.mouseX - (this.x + this.width/2)) < 10 && Math.abs(input.mouseY - (this.y + this.height/2)) < 10){
                console.log("Shrimp");
                this.game.gameObjects.push(new Shrimp(this.game, input.mouseX, input.mouseY));
                input.activeObject = this.game.gameObjects.at(-1);
            }
        }
        super.update(input, deltaTime);
    }
    draw(context){
        super.draw(context);
    }
}

export class IceBox extends AnimatedObjects {
    constructor(game, x, y){
        super(game, x, y, 'icebox', 1, 1);
    }
    update(input, deltaTime){
        if (input.drag && input.activeObject == null){
            if (Math.abs(input.mouseX - (this.x + this.width/2)) < 10 && Math.abs(input.mouseY - (this.y + this.height/2)) < 10){
                console.log("Ice");
                this.game.gameObjects.push(new Ice(this.game, input.mouseX, input.mouseY));
                input.activeObject = this.game.gameObjects.at(-1);
            }
        }
        super.update(input, deltaTime);
    }
    draw(context){
        super.draw(context);
    }
}

export class Basket extends AnimatedObjects {
    constructor(game, x, y){
        super(game, x, y, 'basket', 1, 1);
        this.x0 = x + 15;
        this.y0 = y + 19;
        this.x1 = x + 20;
        this.y1 = y + 22;
        this.x2 = x + 10;
        this.y2 = y + 18;
        this.direction = 1;
    }
    update(input, deltaTime){
        if (input.drag && input.activeObject == null){
            if (Math.abs(input.mouseX - (this.x1)) < 3 && Math.abs(input.mouseY - (this.y1)) < 3){
                console.log("Ball");
                this.game.gameObjects.push(new Ball(this.game, input.mouseX-3, input.mouseY-3));
                input.activeObject = this.game.gameObjects.at(-1);
            } else if (Math.abs(input.mouseX - (this.x0)) < 4 && Math.abs(input.mouseY - (this.y0)) < 4){
                console.log("Pepper");
                this.game.gameObjects.push(new Pepper(this.game, input.mouseX-4, input.mouseY-4));
                input.activeObject = this.game.gameObjects.at(-1);
            } else if (Math.abs(input.mouseX - (this.x2)) < 4 && Math.abs(input.mouseY - (this.y2)) < 4){
                console.log("Beacon");
                this.game.gameObjects.push(new Beacon(this.game, input.mouseX-4, input.mouseY-4));
                input.activeObject = this.game.gameObjects.at(-1);
            }
        }
        super.update(input, deltaTime);
    }
    draw(context){
        context.drawImage(document.getElementById('beacon'), 60, 0, 
            10, 10, Math.round(this.x2-5), Math.round(this.y2-6), 10, 10);
        context.drawImage(document.getElementById('pepper'), 2*12, 0, 
            12, 12, Math.round(this.x0-6), Math.round(this.y0-6), 12, 12);
        context.drawImage(document.getElementById('ball'), 0, 0, 
            8, 8, Math.round(this.x1-4), Math.round(this.y1-4), 8, 8);
        super.draw(context);
    }
}