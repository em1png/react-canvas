import { fireRateLimit, mousePosition, speedLimit } from "../utils/constants";

export class Player {
    constructor(x, y, radius, color, context) {
        this.state = {
            position: { x, y },
            radius,
            color,
            speed: 3,
            fireRate: 1000,
            points: 0,
        };

        this.context = context;
    }

    draw() {
        this.context.beginPath();
        this.context.arc(this.state.position.x, this.state.position.y, this.state.radius, 0, Math.PI * 2);
        this.context.fillStyle = this.state.color;
        this.context.fill();
        this.context.stroke();
    }

    updatePosition() {
        this.state.position.y += this.state.speed;
        this.checkBounces();
        this.checkCursorBounce();
    }

    checkBounces() {
        const { top, bottom } = this.getCircleEdges();

        if (top.y <= 0) {
            this.setSpeed(Math.abs(this.state.speed));
        }

        if (bottom.y >= 200) {
            this.setSpeed(-Math.abs(this.state.speed));
        }
    }

    checkCursorBounce() {
        const dx = this.state.position.x - mousePosition.x;
        const dy = this.state.position.y - mousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 20 && distance < 25) {
            this.reverseSpeed();
        }
    }

    getCircleEdges() {
        const { x, y } = this.state.position;
        const { radius } = this.state;

        return {
            left: { x: x - radius, y },
            right: { x: x + radius, y },
            top: { x, y: y - radius },
            bottom: { x, y: y + radius },
        };
    }

    reverseSpeed() {
        this.state.speed *= -1;
    }

    setSpeed(speed) {
        if (speed > speedLimit.min && speed < speedLimit.max) {
            this.state.speed = speed;
        }
    }

    setFireRate(fireRate) {
        if (fireRate > fireRateLimit.min && fireRate < fireRateLimit.max) {
            this.state.fireRate = fireRate;
        }
    }

    addPoints(state) {
        this.state.points++;
        state((prev) => [...prev]);
    }
}