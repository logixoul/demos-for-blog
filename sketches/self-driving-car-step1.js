let startPos, destDir;
let splineX, splineY;

// изчислява стойността на сплайн функцията
function calcSpline(s, t) {
    const t2 = t * t; // t на квадрат
    const t3 = t * t * t; // t на трета степен

    const valueAt0Equals1 = 2 * t3 - 3 * t2 + 1;
    const derAt0Equals1 = t3 - 2 * t2 + t;
    const valueAt1Equals1 = -2 * t3 + 3 * t2;
    const derAt1Equals1 = t3 - t2;

    return valueAt0Equals1 * s.valueAt0 + derAt0Equals1 * s.derAt0 + valueAt1Equals1 * s.valueAt1 + derAt1Equals1 * s.derAt1;
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    startPos = createVector(0, 0);
    destDir = createVector(0, 0);
    background(100);
}

function mousePressed() {
    const newDestPos = createVector(mouseX, mouseY);
    const offset = p5.Vector.sub(newDestPos, startPos);
    const newDestDir = p5.Vector.mult(offset, 1.0);
    splineX = {
        valueAt0: startPos.x,
        valueAt1: newDestPos.x,
        derAt0: destDir.x,
        derAt1: newDestDir.x
    };
    splineY = {
        valueAt0: startPos.y,
        valueAt1: newDestPos.y,
        derAt0: destDir.y,
        derAt1: newDestDir.y
    };
    startPos = newDestPos;
    destDir = newDestDir;

    noFill();
    stroke("white");
    beginShape();
    for (let coef = 0; coef < 1; coef += .01) {
        const pos = createVector(
            calcSpline(splineX, coef),
            calcSpline(splineY, coef));
        vertex(pos.x, pos.y);
    }
    endShape();
}
