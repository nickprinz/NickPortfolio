export class CanvasPositioner{
    #centerX = 0;
    #xUnit = 0;
    #yUnit = 0;
    constructor(width, height){
        this.#centerX = width/2;
        this.#xUnit = this.#centerX - 20;
        this.#yUnit = height/7;
    }

    toCanvasSpace = ({x,y}) => {
        let cx = this.#centerX + (this.#xUnit*x);
        let cy = this.#yUnit * y;
        return {x: cx, y: cy};
    }

}


