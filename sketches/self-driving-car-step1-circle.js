// финална позиция на кръга при предишното пътуване
let oldDestPos;
// финална посока на кръга при предишното пътуване
let oldDestDir;
// сплайнът (сплайновете по X и Y), по които в момента пътуваме
let splineX, splineY;
// коефициентът на времето, който ни казва колко сме напреднали по сплайна
let timeCoef = 0.0;

// изчислява стойността на сплайн функцията
// параметърът sp е обект с данни за сплайна
function calcSpline(sp, x) {
    // използваме формулите за a, b, c и d които
    // изведохме в секция 2 по-горе
    const a = 2 * sp.valueAt0 - 2 * sp.valueAt1 + sp.derAt0 + sp.derAt1;
    const b = -3 * sp.valueAt0 + 3 * sp.valueAt1 - 2 * sp.derAt0 - sp.derAt1;
    const c = sp.derAt0;
    const d = sp.valueAt0;
    return a * pow(x, 3) + b * pow(x, 2) + c * x + d;
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    oldDestPos = createVector(0, 0);
    oldDestDir = createVector(0, 0);
}

function draw() {
    background(100);
    if (!splineX)
        return;
    timeCoef = min(timeCoef + .01, 1.0);
    const pos = createVector(
        calcSpline(splineX, timeCoef),
        calcSpline(splineY, timeCoef));
    stroke("white");
    circle(pos.x, pos.y, 20);
}

function mousePressed() {
    // новата дестинация е там, където е цъкната мишката
    const destPos = createVector(mouseX, mouseY);
    // започваме новото пътуване от финалната позиция на предишното пътуване
    const startPos = oldDestPos;
    // започваме новото пътуване с посока: финалната посока на предишното пътуване
    const startDir = oldDestDir;
    // вектор от текущата позиция до новата дестинация (трябва ни за следващата стъпка)
    const offset = p5.Vector.sub(destPos, startPos);
    // посоката (и скоростта), в която ще искаме да се движим в края на пътуването
    const destDir = p5.Vector.mult(offset, 2.0);
    // създаваме сплайна по X и Y, по които ще се движим
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
    // запомняме новата дестинация и посока, за да ги използваме
    // при старта на следващото пътуване
    oldDestPos = destPos;
    oldDestDir = destDir;

    // нулираме коефициента на времето, за да започнем новото пътуване от началото
    timeCoef = 0.0;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(100);
}