export class InputHandler {
    constructor(game){
        this.drag = false;
        this.activeObject = null;
        this.scaleX = game.width / 960;
        this.scaleY = game.height / 540;
        this.game = game;
        this.mouseX = 0;
        this.mouseY = 0;
        this.timeStamp = 0;
        this.speedMax = 0;
        this.direction = 0;
        this.speedX = 0;
        this.speedY = 0;

        window.addEventListener('mousemove', e => {

            var now = Date.now();

            this.rect = this.game.canvas.getBoundingClientRect();
            this.scaleX = this.game.canvas.width / this.rect.width;
            this.scaleY = this.game.canvas.height / this.rect.height;
            this.mouseX = (e.x - this.rect.left) * this.scaleX;
            this.mouseY = (e.y - this.rect.top) * this.scaleY;

            var dt = now - this.timeStamp;
            var distance = Math.sqrt(e.movementX*e.movementX + e.movementY*e.movementY);
            this.direction = Math.atan2(e.movementY, e.movementX);
            var speed = parseInt(distance / dt * 100);
            this.speedX = Math.round(e.movementX / dt * 10);
            this.speedY = Math.round(e.movementY / dt * 10);
            this.timeStamp = now;
        });
        window.addEventListener('mousedown', e => {
            this.drag = true;
        })
        window.addEventListener('mouseup', e => {
            this.drag = false;
            if (this.activeObject){
                this.activeObject.reset();
                for (let i = 0; i < this.game.gameObjects.length; i++){
                    console.log(i);
                    if (this.game.gameObjects[i].id == this.activeObject.id){
                        this.game.gameObjects[i].reset();
                    }
                }
            }
            this.activeObject = null;
        })
    }

    setActiveObject(gameObject){
        gameObject.reset();
        gameObject.active = true;
        this.activeObject = gameObject;
    }
}

