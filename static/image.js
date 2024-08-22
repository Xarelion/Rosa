export class Image {
    constructor(x, y, image){
        this.x = x;
        this.y = y;
        this.image = document.getElementById(image);
        this.spriteWidth = this.image.width;
        this.spriteHeight = this.image.height;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.frameX = 0;
        this.frameY = 0;
    }

    draw(context, x, y){
        if (x==null){
            x = this.x;
            y = this.y;
        }
        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, 
            this.spriteWidth, this.spriteHeight, Math.round(x), Math.round(y), this.width, this.height);
    }
}

export class TilableImage extends Image {
    constructor(game, x, y, image, coords){
        super(x, y, image);
        this.coords = coords;
    }
    draw(context){
        this.coords.forEach(coord => {
            super.draw(context, coord.x, coord.y);
        });
    }
}