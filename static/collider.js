export class Collider {
    constructor(game, x0, y0, x1, y1, restitution, friction){
        this.x = x0;
        this.y = y0;
        this.width = x1-x0;
        this.height = y1-y0;
        this.restitution = restitution ? restitution : 0.9;
        this.friction = friction;
        this.degrees = 0;
    }

    draw(context){
        context.strokeStyle = "red";
        context.strokeRect(this.x, this.y, this.width, this.height);
    }
}