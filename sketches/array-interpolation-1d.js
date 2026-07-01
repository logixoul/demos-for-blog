let data = [];

// изчислява хоризонталното мащабиране
function hScale() {
    return width / data.length;
}
// изчислява вертикалното отместване за центриране
function vCenter() {
    return height / 2;
}

// изчертава произволна графика като серия от свързани отсечки
// (стандартен p5.js код)
function drawGraph(vertices) {
    stroke(180, 255, 50);
    strokeWeight(2);
    noFill();
    beginShape();
    for (const v of vertices) {
        vertex(v.x, v.y);
    }
    endShape();
    fill(0, 0, 0, 128);
    stroke(255, 255, 255, 128);
    for (let i = 1; i < data.length - 1; i++) {
        circle(i * hScale(), vCenter() + data[i], 10);
    }
}

// изчислява стойността на сплайн функцията
function calcSpline(s, t) {
    const t2 = t * t; // t на квадрат
    const t3 = t * t * t; // t на трета степен

    const valueAt0Provider = 2 * t3 - 3 * t2 + 1;
    const derAt0Provider = t3 - 2 * t2 + t;
    const valueAt1Provider = -2 * t3 + 3 * t2;
    const derAt1Provider = t3 - t2;


    return valueAt0Provider * s.valueAt0 + derAt0Provider * s.derAt0 + valueAt1Provider * s.valueAt1 + derAt1Provider * s.derAt1;
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    data = [];
    for (let i = 0; i < 12; i++) {
        data.push(Math.random() * 150 - 75);
    }
}

function draw() {
    const vertices = [];
    for (let i = 1; i < data.length - 2; i++) {
        const spline = {
            valueAt0: data[i],
            valueAt1: data[i + 1],
            derAt0: (data[i + 1] - data[i - 1]) / 2,
            derAt1: (data[i + 2] - data[i]) / 2
        };
        for (let coef = 0; coef < 1; coef += .021) {
            vertices.push(createVector(
                (i + coef) * hScale(), vCenter() + calcSpline(spline, coef))
            );
        }
    }
    background(100);

    drawGraph(vertices);
}

function mouseDragged() {
    let index = Math.round(mouseX / hScale());
    data[index] = mouseY - vCenter();
}