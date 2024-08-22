export class Region {
    constructor(game, x0, y0, x1, y1, actions, direction, maxOccupants, foreground=false){
        this.x = x0;
        this.y = y0;
        this.width = x1-x0;
        this.height = y1-y0;
        this.actions = actions; // [0, 1, 2, 3, 4] : [idle, wing, peck, hop, float]
        this.actionColours = ["yellow", "orange", "green", "blue", "purple"];
        this.direction = direction;
        this.occupants = 0;
        this.maxOccupants = maxOccupants;
        this.foreground = foreground;
    }

    draw(context){
        context.strokeStyle = this.actionColours[Math.max(...this.actions)];
        context.strokeRect(this.x, this.y, this.width, this.height);
    }
}