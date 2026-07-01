let data = [];

// function to calculate horizontal scale
function hScale() {
    return width / data.length;
}
// function to calculate vertical offset for centering
function vCenter() {
    return height / 2;
}

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
    for (let i = 1; i < data.length - 2; i++) {
        circle(i * hScale(), vCenter() + data[i], 10);
    }
}

function calcSpline(s, t) {
    const t2 = t * t;
    const t3 = t * t * t;

    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;

    return h00 * s.valueAt0 + h10 * s.derAt0 + h01 * s.valueAt1 + h11 * s.derAt1;
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