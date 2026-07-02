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
    stroke(180, 255, 50); // цвят на линията
    strokeWeight(2); // дебелина на линията
    noFill(); // линията не описва многоъгълник, който да искаме да се запълва
    beginShape(); // започваме да пращаме серията от точки
    for (const v of vertices) { // за всяка точка
        vertex(v.x, v.y); // пращаме тази точка
    }
    endShape(); // приключваме със серията от точки
}

// изчислява стойността на сплайн функцията
function calcSpline(s, x) {
    const a = 2 * s.valueAt0 - 2 * s.valueAt1 + s.derAt0 + s.derAt1;
    const b = -3 * s.valueAt0 + 3 * s.valueAt1 - 2 * s.derAt0 - s.derAt1;
    const c = s.derAt0;
    const d = s.valueAt0;
    return a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;
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

    // чертаем контролните кръгчета
    fill(0, 0, 0, 128); // вътрешен цвят на кръгчетата
    stroke(250, 255, 255, 128); // цвят на ръба на кръгчетата
    for (let i = 1; i < data.length - 1; i++) { // за всяко кръгче
        circle(i * hScale(), vCenter() + data[i], 10); // изчертаваме това кръгче
    }
}

function mouseDragged() {
    let index = Math.round(mouseX / hScale());
    data[index] = mouseY - vCenter();
}
