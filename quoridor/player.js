export class Player {
    // x is col, y is row
    constructor(index, name, x, y, blockers, startPoint, goal) {
        this.index = index;
        this.name = name;
        this.x = x;
        this.y = y;
        this.blockers = blockers;
        this.startPoint = startPoint;
        this.goal = goal;
    }

    getCoord() {
        return { x: this.x, y: this.y };
    }

    setCoord(x, y) {
        this.x = parseInt(x);
        this.y = parseInt(y);
        return { x: this.x, y: this.y };
    }
}
