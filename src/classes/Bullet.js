import { gameFieldSize } from "../utils/constants";

export class Bullet {
    constructor(x, y, isMovingLeft, color, context) {
        this.x = x;
        this.y = y;
        this.isMovingLeft = isMovingLeft;
        this.color = color;
        this.context = context;
    };

    start() {
        this.updatePosition();
        this.draw();
    };

    draw() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, 5, 0, Math.PI * 2);
        this.context.fillStyle = this.color;
        this.context.fill();
        this.context.closePath();
    };

    updatePosition() {
        if (this.isMovingLeft) {
            this.x -= 10;
        } else this.x += 10;
    };

    isOffScreen() {
        return this.x < 0 || this.x > gameFieldSize.width;
    };
};