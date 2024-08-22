class PhysicsObject {
    constructor(game, x, y, imageName, framesX=1, framesY=1){
        this.game = game;
        this.id = Date.now().toString();
        this.image = document.getElementById(imageName);
        this.spriteWidth = this.image.width / framesX;
        this.spriteHeight = this.image.height / framesY;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;  
        this.depth = (Math.floor(Math.random() * 20));

        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.mass = 1;
        this.angle = 0;
        this.direction = 1;
        this.restitution = 0.9;
        this.radius = Math.max(this.spriteHeight/2, this.spriteWidth/2);  

        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.framesX = framesX;
        this.framesY = framesY;
        this.fps = 10;
        this.frameInterval = 1000/this.fps;

        this.floating = false;
        this.waveInterval = 100;
        this.image_splash = document.getElementById('physics_splash');
        this.splash_spriteWidth = 16;
        this.splash_spriteHeight = 16;
        this.splashOffsetY = 0;
        this.splashOffsetX = 0;
        this.splashFrame = 0;
        this.minSplashFrame = 0;
        this.maxSplashFrame = 1;
        this.offsetY = 0;
        this.yCounter = 0;
        this.maxYCounter = 16;

        this.interactible = true;
        this.edible = false;
        this.keep = false;
        this.value = 1;
        this.reset();
    }

    reset(){
        console.log("resetting")
        this.inWater = false;
        this.onGround = false;
        this.floating = false;
        this.active = false;
        this.held = false;
        this.interactible = true;
        if (this.game.rosa.heldObject && this.game.rosa.heldObject.id == this.id){
            this.game.rosa.heldObject = null;
        }
        this.offsetY = 0;
        this.frameTimer = 0;
        this.waveTimer = 0;
    }

    draw(context){
        if (this.held && !this.game.rosa.floating){return;}
        if (this.inWater && this.floats && this.floating && !this.held){
            context.drawImage(this.image_splash, 
                this.splashFrame * this.splash_spriteWidth, 
                0 * this.splash_spriteHeight, this.splash_spriteWidth, this.splash_spriteHeight,
                Math.round(this.x + this.splashOffsetX), Math.round(this.y + this.offsetY + this.splashOffsetY), (this.splash_spriteWidth), (this.splash_spriteHeight));
        }
        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, 
            this.spriteWidth, this.spriteHeight, Math.round(this.x), Math.round(this.y + this.offsetY), this.width, this.height);
    }

    update(input, deltaTime){
        let f = 1 / 150;
        if (input.drag){
            if (input.activeObject == null){
                if (Math.abs(input.mouseX - (this.x+this.spriteWidth/2)) < 6 && Math.abs(input.mouseY - (this.y + this.spriteHeight/2)) < 6){
                    input.setActiveObject(this);
                    this.x = Math.round(input.mouseX);
                    this.y = Math.round(input.mouseY);
                }
            } else if (input.activeObject.id == this.id){ 
                this.x = Math.round(input.mouseX - this.spriteWidth/2);
                this.y = Math.round(input.mouseY);
                this.vx = input.speedX;
                this.vy = input.speedY;
            }
        }
        if (this.held){return;}

        if (input.activeObject && input.activeObject.id == this.id){
            this.angle = Math.PI*1.5;
        } else {
            if (this.inWater){
                if (this.floats){
                    if (this.y - this.game.waterLevel > 2){
                        this.floating = false;
                        this.vy -= 4.5 * 9.81 * deltaTime * f;
                    } else {
                        this.floating = true;
                        // Offset vertically according to waves
                        if (this.waveTimer > this.waveInterval){
                            this.waveTimer = 0;
                            if (this.yCounter > this.maxYCounter){
                                this.yCounter = 0;
                            }
                            this.offsetY = Math.round(2 * Math.sin((2*Math.PI / this.maxYCounter)*this.yCounter));
                            this.yCounter += 1;
                        } else {
                            this.waveTimer += deltaTime;
                        }
                        //this.vy = 0;
                        if (this.frameTimer > this.frameInterval){
                            this.frameTimer = 0;
                            this.splashFrame = this.splashFrame < this.maxSplashFrame ? this.splashFrame + 1 : this.splashFrame = this.minSplashFrame;
                        } else {
                            this.frameTimer += deltaTime;
                        }
                    }
                } else {
                    this.offsetY = 0;
                    this.vy += 0.98 * 9.81 * deltaTime * f;
                }
                this.vx *= 0.96;
            } else {
                this.vy += 9.81 * deltaTime   * f;
            }

            this.x += this.vx * deltaTime * f;
            this.y += this.vy * deltaTime * f;
            this.y = Math.min(this.y, this.game.height-this.spriteHeight);
            if (this.onGround){
                this.vx -= Math.sign(this.vx) * 0.95*deltaTime  * f // friction 
            } else {
                this.angle = Math.atan2(this.vy, this.vx); // radians
            }
        }
        if (this.rotatable){
            this.frame = Math.round(this.angle/(2*Math.PI)*this.framesX) + 4;
            if (this.frame >= this.framesX) {
                this.frame -= this.framesX;
            }
            this.frameX = this.frame % this.framesX;
            this.frameY = Math.floor(this.frame/this.framesX);
        }
    }
}

export class Shrimp extends PhysicsObject {
    constructor(game, x, y){
        super(game, x, y, 'shrimp', 8, 1);
        this.mass = 3;
        this.restitution = 0.5;
        this.rotatable = true;
        this.interactible = true;
        this.edible = true;
        this.value = 4;
    }
    draw(context){
        super.draw(context);
    }
    update(input, deltaTime){
        super.update(input, deltaTime);
    }
}

export class Ice extends PhysicsObject {
    constructor(game, x, y){
        super(game, x, y, 'ice');
        this.mass = 3;
        this.restitution = 0.5;
        this.splashOffsetX = -4;
        this.splashOffsetY = -6;
        this.interactible = true;
        this.floats = true;
        this.edible = true;
        this.keep = true;
        this.value = 3;
    }
    draw(context){
        super.draw(context);
    }
    update(input, deltaTime){
        super.update(input, deltaTime);
    }
}

export class Ball extends PhysicsObject {
    constructor(game, x, y){
        super(game, x, y, 'ball');
        this.interactible = true;
        this.keep = true;
        this.mass = 5;
    }
    draw(context){
        super.draw(context);
    }
    update(input, deltaTime){
        super.update(input, deltaTime);
    }
}

export class Beacon extends PhysicsObject {
    constructor(game, x, y){
        super(game, x, y, 'beacon', 8, 1);
        this.interactible = true;
        this.rotatable = true;
        this.keep = true;
        this.mass = 6;
        this.value = 1;
    }
    draw(context){
        super.draw(context);
    }
    update(input, deltaTime){
        super.update(input, deltaTime);
    }
}

export class Pepper extends PhysicsObject {
    constructor(game, x, y){
        super(game, x, y, 'pepper', 8, 1);
        this.mass = 12;
        this.restitution = 0.7;
        this.splashOffsetY = -1;
        this.interactible = true;
        this.rotatable = true;
        this.floats = true;
        this.keep = true;
        this.value = 2;
    }
    draw(context){
        super.draw(context);
    }
    update(input, deltaTime){
        super.update(input, deltaTime);
    }
}