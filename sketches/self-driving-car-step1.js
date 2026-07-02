let startPos, startDir;
let splineX, splineY;

// изчислява стойността на сплайн функцията
function calcSpline(sp, x) {
    const a = 2 * sp.valueAt0 - 2 * sp.valueAt1 + sp.derAt0 + sp.derAt1;
    const b = -3 * sp.valueAt0 + 3 * sp.valueAt1 - 2 * sp.derAt0 - sp.derAt1;
    const c = sp.derAt0;
    const d = sp.valueAt0;
    return a * pow(x, 3) + b * pow(x, 2) + c * x + d;
}

function drawSpline(spX, spY) {
    // линията не описва многоъгълник, който да искаме да се запълва
    noFill();
    // цвят на линията
    stroke("white");
    // започваме да пращаме серията от точки
    beginShape();
    // циклим по дефиниционната ни област [0, 1] с малки стъпки
    for (let coef = 0; coef < 1; coef += .01) {
        // изчисляваме точката по сплайна за текущия коефициент
        const pos = createVector(
            calcSpline(spX, coef),
            calcSpline(spY, coef));
        // пращаме тази точка за изчетаване от p5.js
        vertex(pos.x, pos.y);
    }
    endShape(); // приключваме със серията от точки
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    startPos = createVector(0, 0);
    startDir = createVector(0, 0);
    background(100);
}

function mousePressed() {
    const destPos = createVector(mouseX, mouseY);
    const offset = p5.Vector.sub(destPos, startPos);
    const destDir = p5.Vector.mult(offset, 1.0);
    splineX = {
        valueAt0: startPos.x,
        valueAt1: destPos.x,
        derAt0: startDir.x,
        derAt1: destDir.x
    };
    splineY = {
        valueAt0: startPos.y,
        valueAt1: destPos.y,
        derAt0: startDir.y,
        derAt1: destDir.y
    };
    startPos = destPos;
    startDir = destDir;

    drawSpline(splineX, splineY);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(100);
}