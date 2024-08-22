import { Rosa } from "./rosa.js";
import { InputHandler } from "./input.js";
import { Guppy, Bird, Seaweed, Wave, Waves, Bag, IceBox, Basket, Kelp } from "./animatedObjects.js";
import { Image, TilableImage} from "./image.js";
import { Collider } from "./collider.js";
import { Region } from "./region.js";
import { Beacon } from "./physicsObject.js";

window.addEventListener('load', function(){
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    canvas.width = 256;
    canvas.height = 128;

    class Game {
        constructor(width, height, canvas){
            this.canvas = canvas;
            this.width = width;
            this.height = height;
            this.debug = !true;
            this.pixelWidth = 160;
            this.pixelHeight = 80;
            this.groundLevel = 80; // 96
            this.waterLevel = 74; // Distance from top of canvas 
            this.waveFrequency = 3;
            this.input = new InputHandler(this); 
            this.createScene();
            this.rosa = new Rosa(this);
        }

        createScene(){
            let waterBlocks = [];
            let foregroundWaterBlocks = [];
            let midgroundWaterBlocks = [];
            let sandBlocks = [];
            let sandRidgeBlocks = [];
            for (let i = 0; i < 9; i++){
                waterBlocks[i] = {x:i*32, y:this.waterLevel-16};
                if (i < 3){
                    foregroundWaterBlocks[i+8] = {x:i*32-16, y:this.waterLevel-3};
                }
                if (i >=3 && i < 4){
                    midgroundWaterBlocks[i-3] = {x:i*32-10, y:this.waterLevel-12};
                }
                sandRidgeBlocks[i] = {x:i*32, y:this.groundLevel-8};
                sandBlocks[i] = {x:i*32, y:96};
            }
            this.background = [
                new Image(0, 0, 'backdrop'),
                //new Image(0,0, 'water'),
                new Image(170, 14, 'pier'),
                //new Image(64, 42, 'back_wall'),
                
                new TilableImage(this, 0, 96, 'sand_ridge', sandRidgeBlocks),
                new Image(58, 38, 'back_wall2'),
                new TilableImage(this, 0, 96, 'sand', sandBlocks),
                new Image(0, 0, 'wall'),
                new TilableImage(this, 0, 96, 'sand_mark', [{x:4*32, y:96}]),
            ]
            this.mid = [
                //new Wave(this, 0, 0, midgroundWaterBlocks)
            ]
            this.regions = [
                new Region(this, 68, 46, 98, 56, [0, 1, 2, 3], 1, 4),
                new Region(this, 30, 49, 64, 56, [0, 1, 2, 3], -1, 4),
                new Region(this, 24, 8, 30, 12, [0, 1], 1, 1),
                new Region(this, 196, 52, 210, 56, [0, 1, 2], -1, 3),
                new Region(this, 230, 32, 250, 36, [0, 1], -1, 3),
                new Region(this, 196, 82, 210, 86, [4], -1, 1, true),
                ];
            this.animatedObjects = [
                new Wave(this, 0, 0, foregroundWaterBlocks),
                new Guppy(this, 200, 70), 
                new Guppy(this, 30, 84), 
                new Seaweed(this, 92, 90),
                new Seaweed(this, 202, 66),
                new Seaweed(this, 100, 91), 
                new Kelp(this, 18, 70, 0),
                new Kelp(this, 29, 63, 3),
                new Waves(this, 190, 43, 'corner_waves', 43, 1),
                new Waves(this, 57, 41, 'back_wall_waves', 27, 0),
                new Bag(this, 22, 32),
                new IceBox(this, 4, 44),
                new Basket(this, 224, 29)];
            this.birds = [
                new Bird(this, 0), 
                new Bird(this, 1), 
                new Bird(this, 1), 
            ]
            this.gameObjects = [];
            this.stationaryObjects = [
                new Image(42, 104, 'slate'),
                new Image(50, 106, 'snail'),
                new Image(84, 70, 'coral'),
                new Image(111, 108, 'rock'), 
                new Image(170, 84, 'slate'),
                new Image(190, 42, 'foreground'),
                new Image(224, 29, 'shelf'),
                ];
            this.colliders = [
                new Collider(this, 0, 56, 68, 66, 0.9, 0.15),
                new Collider(this, 0, 92, 14, 128, 0.9, 0.15),
                new Collider(this, 0, 120, 256, 128, 0.3, 0.95),
                new Collider(this, 110, 110, 128, 140, 0.9, 0.15),
                new Collider(this, 192, 55, 218, 64, 0.9, 0.15),
                ];
            
            this.water = [
                {x: 0, y: this.waterLevel-10, width: 64, height: this.height},
                {x: 64, y: this.waterLevel-6, width: 43, height: this.height},
                {x: 107, y: this.waterLevel-16, width: 83, height: this.height},
                {x: 190, y: this.waterLevel+12, width: 90, height: this.height},
            ];
        }

        update(deltaTime){
            this.mid.forEach(gameObject => {
                gameObject.update(this.input, deltaTime);
            });
            this.gameObjects.forEach(gameObject => {
                gameObject.update(this.input, deltaTime);
            });
            this.rosa.update(this.input, deltaTime);
            this.animatedObjects.forEach(gameObject => {
                gameObject.update(this.input, deltaTime);
            });
            this.birds.forEach(gameObject => {
                gameObject.update(this.input, deltaTime);
            });
            
        }
        draw(context){
            this.background.forEach(gameObject => {
                gameObject.draw(context);
            });
            this.stationaryObjects.forEach(gameObject => {
                gameObject.draw(context);
            });
            this.mid.forEach(gameObject => {
                gameObject.draw(context);
            });
            this.animatedObjects.forEach(gameObject => {
                gameObject.draw(context);
            });
            this.gameObjects.forEach(gameObject => {
                if (!gameObject.held && !gameObject.floating){
                    gameObject.draw(context);
                }
            });

            context.fillStyle = '#96F6FE';
            context.globalAlpha = 0.25;//0.3;
            this.water.forEach(w => {
                context.fillRect(w.x, w.y, w.width, w.height);
            });
            context.globalAlpha = 1; // ??? Otherwise it affects the previously drawn objects
            this.birds.forEach(gameObject => {
                if (!gameObject.region.foreground){
                    gameObject.draw(context);
                }
            });
            this.rosa.draw(context);
            this.birds.forEach(gameObject => {
                if (gameObject.region.foreground || (gameObject.target && gameObject.target.foreground)){
                    gameObject.draw(context);
                }
            });

            this.gameObjects.forEach(gameObject => {
                if (gameObject.held || gameObject.floating){
                    gameObject.draw(context);
                }
            });
            
            if (this.debug){
                this.colliders.forEach(gameObject => {
                    gameObject.draw(context);
                });
                this.regions.forEach(gameObject => {
                    gameObject.draw(context);
                });
            }
        }
        detectCollisions(deltaTime){
            this.detectEdgeCollisions();
            let obj1;
            let obj2;
            let obj;

            for (let i = 0; i < this.gameObjects.length; i++) {
                obj1 = this.gameObjects[i];
                for (let j = 0; j < this.colliders.length; j++) {
                    obj = this.colliders[j];
                    //if (!obj1.onGround){
                    if (obj1.held){

                    }else if (rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj.x, obj.y, obj.width, obj.height)){

                        let obj1Top_ObjBottom = Math.abs(obj1.y - (obj.y + obj.height));
                        let obj1Right_ObjLeft = Math.abs((obj1.x + obj1.width) - obj.x);
                        let obj1Left_ObjRight = Math.abs(obj1.x - (obj.x + obj.width));
                        let obj1Bottom_ObjTop = Math.abs((obj1.y + obj1.height) - obj.y);

                        if ((obj1.y <= obj.y + obj.height && obj1.y + obj1.height > obj.y + obj.height) && (obj1Top_ObjBottom < obj1Right_ObjLeft && obj1Top_ObjBottom < obj1Left_ObjRight)) {
                            obj1.y = obj.y + obj.height;
                            obj1.vy *= -1*Math.min(obj1.restitution, obj.restitution);
                        }
                        if ((obj1.y + obj1.height >= obj.y && obj1.y < obj.y) && (obj1Bottom_ObjTop < obj1Right_ObjLeft && obj1Bottom_ObjTop < obj1Left_ObjRight)) {
                            // Collision with floor
                            obj1.y = obj.y - obj1.height; 
                            obj1.vy *= -1*Math.min(obj1.restitution, obj.restitution);
                            obj1.vx -= Math.sign(obj1.vx) * obj.friction*(deltaTime/1000);
                            //obj1.vx *= obj.friction*(deltaTime/1000);''
                            if (Math.abs(obj1.vy) < 5) {
                                obj1.onGround = true;
                                obj1.vy = 0;
                            }
                            
                        }
                        if ((obj1.x + obj1.width >= obj.x && obj1.x < obj.x) && (obj1Right_ObjLeft < obj1Top_ObjBottom && obj1Right_ObjLeft < obj1Bottom_ObjTop)) {
                            obj1.x = obj.x - obj1.width;
                            obj1.vx *= -1*Math.min(obj1.restitution, obj.restitution);
                        }
                        if ((obj1.x <= obj.x + obj.width && obj1.x + obj1.width > obj.x + obj.width) && (obj1Left_ObjRight < obj1Top_ObjBottom && obj1Left_ObjRight < obj1Bottom_ObjTop)) {
                            obj1.x = obj.x + obj.width;
                            obj1.vx *= -1*Math.min(obj1.restitution, obj.restitution);
                        }
                    //}
                    }
                }
              
                for (let j = i + 1; j < this.gameObjects.length; j++)
                {
                    obj2 = this.gameObjects[j];
                    let f = 0;
                    if (rectIntersect(obj1.x-f, obj1.y-f, obj1.width+2*f, obj1.height+2*f, obj2.x-f, obj2.y-f, obj2.width+2*f, obj2.height+2*f)){
                        let vCollision = {x: obj2.x - obj1.x, y: obj2.y-obj1.y};
                        let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
                        let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                        let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
                        let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
                        speed *= Math.min(obj1.restitution, obj2.restitution);
                        if (speed < 0){break;}
                        let impulse = 2 * speed / (obj1.mass + obj2.mass);
                        if (!obj1.static){
                        obj1.vx -= (impulse * obj2.mass * vCollisionNorm.x);
                        obj1.vy -= (impulse * obj2.mass * vCollisionNorm.y);
                        // obj1.x -= Math.round(vCollisionNorm.x*obj1.radius);
                        // obj1.y -= Math.round(vCollisionNorm.y*obj1.radius);
                        }
                        if (!obj2.static){
                        obj2.vx += (impulse * obj1.mass * vCollisionNorm.x);
                        obj2.vy += (impulse * obj1.mass * vCollisionNorm.y);
                        // obj2.x += Math.round(vCollisionNorm.x*0.4);
                        // obj2.y += Math.round(vCollisionNorm.y*0.4);
                        }
                    }
                }
                obj1.inWater = false;
                for (let j = 0; j < this.water.length; j++) {
                    obj = this.water[j];
                    
                    if (rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj.x, obj.y + 10, obj.width, obj.height)){
                        if (!obj1.inWater){
                            obj1.vy *= 0.8; // Collision with water surface
                        }
                        obj1.inWater = true;
                    }
                }
            }
        };
        
        detectEdgeCollisions(){
            const restitution = 0.90;
            let canvasWidth = 256;
            let canvasHeight = 128;
            
            let obj1;
            for (let i = 0; i < this.gameObjects.length; i++)
            {
                obj1 = this.gameObjects[i];

                // Check for left and right
                if (obj1.x < obj1.radius){
                    obj1.vx = Math.abs(obj1.vx) * restitution;
                    obj1.x = obj1.radius;
                }else if (obj1.x > canvasWidth - obj1.radius){
                    obj1.vx = -Math.abs(obj1.vx) * restitution;
                    obj1.x = canvasWidth - obj1.radius;
                }
        
                // // Check for bottom and top
                // if (obj1.y < obj1.radius){
                //     obj1.vy = Math.abs(obj1.vy) * restitution;
                //     obj1.y = obj1.radius;
                // } else 
                if (obj1.y > canvasHeight - obj1.height){
                    obj1.vy = -Math.abs(obj1.vy) * restitution;
                    obj1.y = canvasHeight - obj1.radius;
                }
            }
        };

    }

    function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
        if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
            return false;
        }
        return true;
    }
    function circleIntersect(x1, y1, r1, x2, y2, r2) {
        let squareDistance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);
        return squareDistance <= ((r1 + r2) * (r1 + r2))
    }

    const game = new Game(canvas.width, canvas.height, canvas);

    let startTime = 0;
    function animate(timeStamp){
        const deltaTime = timeStamp - startTime;
        startTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.detectCollisions(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);

});