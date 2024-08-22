const states = {
    idle: 0,
    moving: 1,
    rolling: 2,
    sleeping: 3,
    surface: 4,
    eating: 5,
    spin: 6,
}

class State {
    constructor(state){
        this.state = state;
        this.waterLevel = 0;
        console.log(state);
    }
}

export class Idle extends State {
    constructor(rosa){
        super('Idle');
        this.rosa = rosa;
        this.idleTimer = 0;
        this.idleTimeBeforeAction = 8;
        this.target = null;
    }
    enter(){
        console.log('idle');
        console.log(this.rosa.game.gameObjects);
        this.rosa.frame = 0;
        this.rosa.setAnimation(0, 1);
        this.rosa.floating = true;
        this.idleTimer = 0;
    }
    handleInput(input, deltaTime){
        if (!this.rosa.heldItem){
            this.rosa.lookForInteractibles();
        } 
        if (this.rosa.target){
            this.rosa.setState(states.moving);
        }
        if (this.rosa.heldItem){
            if (!this.rosa.heldItem.held){
                this.rosa.heldItem = null;
            } else {
                this.rosa.heldItem.x = this.rosa.x - this.rosa.heldItem.width/2;
                this.rosa.heldItem.y = this.rosa.y - this.rosa.heldItem.height/2 + this.rosa.offsetY;
            }
            if (this.rosa.heldItem && this.rosa.heldItem.edible){
                this.rosa.setState(states.eating);
            } else if (this.rosa.heldItem && !this.rosa.heldItem.edible){
                this.idleTimer += deltaTime / 1000;
                if (this.idleTimer >= this.idleTimeBeforeAction){
                    this.idleTimer = 0;
                    this.rosa.lookForInteractibles();
                    if (!this.rosa.target){
                        this.idleTimer = 0;
                        this.rosa.setState(states.sleeping);
                    }
                }
            }
        }
        else {
            this.idleTimer += deltaTime / 1000;
            if (this.idleTimer >= this.idleTimeBeforeAction){
                this.idleTimer = 0;
                let x = Math.random();
                if ( x < 0.3){
                    this.rosa.setState(states.spin);
                } else if (x < 0.8){
                    this.rosa.setState(states.eating);
                } else {
                    this.rosa.setState(states.sleeping);
                }
            }
        }
    }
}

export class Moving extends State {
    constructor(rosa){
        super('Moving');
        this.rosa = rosa;
        this.target = null;
        this.timer = 0;
        this.reactionTimer = 0;
        this.hasReacted = false;
    }
    enter(){
        console.log('moving');
        this.timer = 0;
        this.reactionTimer = 0;
        this.hasReacted = false;
        this.distance = 100;
    }
    handleInput(input, deltaTime){
        // if (input.activeObject) {
        //     this.rosa.target = input.activeObject;
        // }
        if (this.rosa.target){
            if (!this.hasReacted){
                if (this.reactionTimer > this.rosa.reactionTime){
                    this.rosa.setAnimation(8, 14, 5);
                    this.rosa.floating = 0;
                    if (this.rosa.heldItem){ 
                        this.rosa.heldItem.held = false;
                        this.rosa.heldItem = null;
                    }
                    this.hasReacted = true;
                }
                this.reactionTimer += deltaTime/1000;
            } else {
                if (this.timer > this.rosa.resignTime){
                    this.rosa.setState(states.surface);
                    this.rosa.heldItem = null;
                    this.rosa.target.active = true;
                    this.rosa.target = null;
                } else {
                    let direction = {x:(this.rosa.target.x - this.rosa.x), y:(this.rosa.target.y - this.rosa.y)};
                    let distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
                    if (Math.abs(distance - this.distance) <= 0.05){
                        this.timer += deltaTime/1000;
                    }
                    this.distance = distance;
                    if (distance <= 10 ){
                        if (!this.rosa.target.active){
                            this.rosa.setState(states.surface);
                            this.rosa.heldItem = this.rosa.target;
                            this.rosa.heldItem.held = true;
                            this.rosa.target = null;
                        }
                    } else {
                        this.rosa.direction = Math.sign(direction.x)*1;
                        let directionNorm = {x: (direction.x / distance), y: (direction.y / distance)};
                        this.rosa.x += directionNorm.x * this.rosa.speed * (deltaTime/1000);
                        this.rosa.y += directionNorm.y*this.rosa.speed*(deltaTime/1000);
                        this.rosa.y =  Math.max(this.rosa.y, this.rosa.maxPositionInWater());
                    }
                }
            }
        } else {
            this.timer = 0;
            this.reactionTimer = 0;
            this.rosa.setState(states.idle);
        }
    }
}


export class Surface extends State {
    constructor(rosa){
        super('Surface');
        this.rosa = rosa;
        this.rosa.floating = false;
    }
    enter(){
        console.log('surface');
        this.rosa.setAnimation(2, 3);
        this.rosa.floating = false;
    }
    handleInput(input, deltaTime){
        if (Math.abs(this.rosa.maxPositionInWater()-this.rosa.y) < 3 ) {
            this.rosa.setState(states.idle);
        } else {
            let direction = {x:0, y: this.rosa.maxPositionInWater()-this.rosa.y};
            let distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y);

            //sthis.rosa.direction = Math.sign(direction.x)*1;
            let directionNorm = {x: direction.x / distance, y: direction.y / distance};

            this.rosa.x = Math.round(this.rosa.x + directionNorm.x*this.rosa.speed*(deltaTime/1000));
            this.rosa.y = Math.max(Math.round(this.rosa.y + directionNorm.y*this.rosa.speed*(deltaTime/1000)), this.rosa.maxPositionInWater());
        }
    }
}

export class Rolling extends State {
    constructor(rosa){
        super('Rolling');
        this.rosa = rosa;
    }
    enter(){
        console.log('rolling');
        this.rosa.setAnimation(6, 7);
        this.rosa.floating = false;
    }
    handleInput(input){
        if (input.drag){
            if (Math.abs(input.mouseX - this.rosa.x) < 50){
                this.rosa.setState(states.idle);
            }
        }
    }
}

export class Sleeping extends State {
    constructor(rosa){
        super('Sleeping');
        this.rosa = rosa;
    }
    enter(){
        console.log('sleeping');
        this.rosa.setAnimation(2, 3);
        this.rosa.floating = true;
    }
    handleInput(input){
        if (input.drag){
            this.rosa.setState(states.idle);
        }
        if (this.rosa.heldItem){
            if (!this.rosa.heldItem.held){
                this.rosa.heldItem = null;
            } else {
                this.rosa.heldItem.x = this.rosa.x - this.rosa.heldItem.width/2;
                this.rosa.heldItem.y = this.rosa.y - this.rosa.heldItem.height/2 + this.rosa.offsetY;
            }
        }
    }
}

export class Eating extends State {
    constructor(rosa){
        super('Eating');
        this.rosa = rosa;
    }
    enter(){
        console.log('eating');
        this.rosa.setAnimation(0, 1);
        this.rosa.floating = true;
        this.idleTimer = 0;
        if (this.rosa.heldItem){
            this.idleTimeBeforeAction = 1.2;
        } else {
            this.rosa.setAnimation(4, 7);
            this.idleTimeBeforeAction = 4;
        }
    }
    handleInput(input, deltaTime){
        if (this.rosa.heldItem){
            if (!this.rosa.heldItem.held){
                this.rosa.heldItem = null;
            } else {
                this.rosa.heldItem.x = this.rosa.x - this.rosa.heldItem.width/2;
                this.rosa.heldItem.y = this.rosa.y - this.rosa.heldItem.height/2 + this.rosa.offsetY;

                if (this.idleTimer >= this.idleTimeBeforeAction){
                    for (let i = 0; i < this.rosa.game.gameObjects.length; i++){
                        if (this.rosa.game.gameObjects[i].id == this.rosa.heldItem.id){
                            if (this.rosa.game.gameObjects.length == 1){
                                this.rosa.game.gameObjects = [];
                            } else {
                                let remove = this.rosa.game.gameObjects.splice(i, i);
                            }
                        }
                    }
                    this.rosa.heldItem = null;
                    this.rosa.setAnimation(4, 7);
                    this.idleTimer = 0;
                    this.idleTimeBeforeAction = 4;
                } else {
                    this.idleTimer += deltaTime / 1000;
                }
            }
        } else {
            if (this.idleTimer >= this.idleTimeBeforeAction){
                this.rosa.setState(states.idle);
            } else {
                this.idleTimer += deltaTime / 1000;
            }
        }
    }
}


export class Spinning extends State {
    constructor(rosa){
        super('Spinning');
        this.rosa = rosa;
        this.waterLevel = 0;
    }
    enter(){
        console.log('spinning');
        this.rosa.setAnimation(0, 1);
        this.rosa.floating = false;
        this.idleTimer = 0;
        this.transitionTime = 0.15;
        this.count = 0;
        this.transition = [16, 17, 18, 19, 20, 21, 22, 23];
        this.transitionIn = true;
        this.transitionOut = false;
        this.waterLevel = 0;
        this.idleTimeBeforeAction = this.transitionTime;
    }
    handleInput(input, deltaTime){
        if (this.transitionIn){
            if (this.count >= this.transition.length){
                this.transitionIn = false;
                this.transitionOut = false;
                this.count -= 1;
                this.fps = 5;
                this.idleTimeBeforeAction = (14 / this.fps)*4 + 1.7;
                this.idleTimer = 0
                this.rosa.setAnimation(24, 37, this.fps);
            } else {
                if (this.idleTimer >= this.idleTimeBeforeAction){
                    this.rosa.setAnimation(this.transition[this.count]);
                    this.count += 1;
                    this.waterLevel += 2;
                    console.log(this.count)
                    this.idleTimer = 0;
                } else {
                    this.idleTimer += deltaTime / 1000;
                }
            }
        } else if (this.transitionOut){
            this.rosa.floating = false;
            if (this.count <= 0){
                this.count = 0;
                this.rosa.setState(states.idle);
            } else {
                if (this.idleTimer >= this.idleTimeBeforeAction){
                    this.rosa.setAnimation(this.transition[this.count]);
                    this.count -= 1;
                    this.waterLevel -= 2;
                    console.log(this.count)
                    this.idleTimer = 0;
                } else {
                    this.idleTimer += deltaTime / 1000;
                }
            }
        } else {
            console.log("Spinning");
            this.rosa.floating = true;
            if (this.idleTimer >= this.idleTimeBeforeAction){
                this.transitionIn = false;
                this.transitionOut = true;
                this.rosa.direction *=-1; 
                this.idleTimer = 0;
                this.idleTimeBeforeAction = this.transitionTime;
            } else {
                this.idleTimer += deltaTime / 1000;
            }
        }
    }
    exit (){
        this.rosa.setState(states.idle);
    }

}