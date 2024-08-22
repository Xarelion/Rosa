window.addEventListener('load', function(){
    const canvas = this.document.getElementById("character_canvas");
    const ctx = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 256;

    const canvas2 = this.document.getElementById("guppy_canvas");
    const ctx2 = canvas2.getContext('2d');
    ctx2.imageSmoothingEnabled = false;

    canvas2.width = 64;
    canvas2.height = 64;

    class Character {
        constructor(canvasWidth, canvasHeight){
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.image = document.getElementById('character')
            this.spriteWidth = 183;
            this.spriteHeight = 275;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.framesX = 4;
            this.framesY = 4;
            this.x = this.canvasWidth/2 - this.width/2;
            this.y = this.canvasHeight/2 - this.height/2;
            this.minFrame = 0;
            this.maxFrame = 15;
            this.frame = 0;
            this.frameX = 0;
            this.frameY = 0;
        }

        draw(context){
            context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, 
                this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }

        update(){
            this.frame = this.frame < this.maxFrame ? this.frame + 1 : this.frame = this.minFrame;
            this.frameX = this.frame % this.framesX;
            this.frameY = Math.floor(this.frame/this.framesX);
        }
        setAnimation(newMinFrame, newMaxFrame){
            this.minFrame = newMinFrame;
            this.maxFrame = newMaxFrame;
            this.frame = this.minFrame;
        }
    }

    const character = new Character(canvas.width, canvas.height);

    var startTime = 0;
    var counter = 0;

    function animate(timeStamp){
        if (timeStamp - startTime < 16) {requestAnimationFrame(animate); return;}
        startTime = timeStamp;
        counter++;
        if (counter >10 && counter != 0)
        {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        character.draw(ctx);
        character.update();
        counter = 0;
        }
        requestAnimationFrame(animate);
    }
    animate();

    const all = this.document.getElementById('all');
    all.addEventListener('click', function(){
        character.setAnimation(0, 15);
    })
    const up = this.document.getElementById('up');
    up.addEventListener('click', function(){
        character.setAnimation(5, 7);
    })
    const rigth = this.document.getElementById('right');
    right.addEventListener('click', function(){
        character.setAnimation(12, 15);
    })
    const down = this.document.getElementById('down');
    down.addEventListener('click', function(){
        character.setAnimation(0, 3);
    })
    const left = this.document.getElementById('left');
    left.addEventListener('click', function(){
        character.setAnimation(8, 11);
    })

    class Creature {
        constructor(canvasWidth, canvasHeight){
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.image = document.getElementById('guppy')
            this.spriteWidth = 16;
            this.spriteHeight = 16;
            this.scale = 4;
            this.width = this.scale * this.spriteWidth;
            this.height = this.scale * this.spriteHeight;
            this.framesX = 2;
            this.framesY = 1;
            this.x = this.canvasWidth/2 - this.width/2;
            this.y = this.canvasHeight/2 - this.height/2;
            this.minFrame = 0;
            this.maxFrame = 1;
            this.frame = 0;
            this.frameX = 0;
            this.frameY = 0;
        }

        draw(context){
            context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, 
                this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }

        update(){
            this.frame = this.frame < this.maxFrame ? this.frame + 1 : this.frame = this.minFrame;
            this.frameX = this.frame % this.framesX;
            this.frameY = Math.floor(this.frame/this.framesX);
        }
        setAnimation(newMinFrame, newMaxFrame){
            this.minFrame = newMinFrame;
            this.maxFrame = newMaxFrame;
            this.frame = this.minFrame;
        }
    }

    const guppy = new Creature(canvas2.width, canvas2.height);

    var startTime = 0;
    var counter = 0;

    function animate2(timeStamp){
        if (timeStamp - startTime < 16) {requestAnimationFrame(animate2); return;}
        startTime = timeStamp;
        counter++;
        if (counter >18 && counter != 0)
        {
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        guppy.draw(ctx2);
        guppy.update();
        counter = 0;
        }
        requestAnimationFrame(animate2);
    }
    animate2();


});