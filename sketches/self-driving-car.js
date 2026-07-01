let destPos, destDir;
let splineX, splineY;
let interpCoef = 0.0;
let carImage;
let carPos;

function calcSpline(s, t) {
    const t2 = t * t;
    const t3 = t2 * t;

    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;

    return h00 * s.valueAt0 + h10 * s.derAt0 + h01 * s.valueAt1 + h11 * s.derAt1;
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    imageMode(CENTER);
    destPos = createVector(0, 0);
    destDir = createVector(0, 0);
    carImage = loadImage(MEDIA_FOLDER + '/car.png');
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