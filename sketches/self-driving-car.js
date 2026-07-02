let destPos, destDir;
let splineX, splineY;
let interpCoef = 0.0;
let carImage;
let carPos;
let carAngle;

// изчислява стойността на сплайн функцията
function calcSpline(s, x) {
    const a = 2*s.valueAt0 - 2*s.valueAt1 + s.derAt0 + s.derAt1;
    const b = -3*s.valueAt0 + 3*s.valueAt1 - 2*s.derAt0 - s.derAt1;
    const c = s.derAt0;
    const d = s.valueAt0;
    return a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;
}

async function setup() {
    createCanvas(windowWidth, windowHeight);

    imageMode(CENTER);
    destPos = createVector(0, 0);
    destDir = createVector(0, 0);
    carImage = await loadImage('./car.png');
}

function draw() {
    background(100);
    if (splineX) {
        interpCoef = min(interpCoef + .01, 1.0);
        const interpCoefSmooth = interpCoef * interpCoef * (3 - interpCoef * 2);
        const newCarPos = createVector(
            calcSpline(splineX, interpCoefSmooth),
            calcSpline(splineY, interpCoefSmooth));
        const movement = p5.Vector.sub(newCarPos, carPos);
        if (movement.mag() > 0)
            carAngle = atan2(movement.y, movement.x);
        carPos = newCarPos;
        translate(carPos.x, carPos.y);
        rotate(carAngle);
        image(carImage, 0, 0);
    }
}

function mousePressed() {
    const newDestPos = createVector(mouseX, mouseY);
    const offset = p5.Vector.sub(newDestPos, destPos);
    const newDestDir = p5.Vector.mult(offset, 2.0);
    splineX = {
        valueAt0: destPos.x,
        valueAt1: newDestPos.x,
        derAt0: destDir.x,
        derAt1: newDestDir.x
    };
    splineY = {
        valueAt0: destPos.y,
        valueAt1: newDestPos.y,
        derAt0: destDir.y,
        derAt1: newDestDir.y
    };
    destPos = newDestPos;
    destDir = newDestDir;
    interpCoef = 0.0;
}
