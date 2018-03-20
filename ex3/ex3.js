//strict mode
"use strict";
//MAIN SCRIPT ----------
//
addEventListener("load", function () {
    //Create a canvas in the body and init webGL
    let canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    let gl = canvas.getContext("webgl");

    if(!gl){
        return;
    }

    const program = webglUtils.createProgramFromScripts(gl, ["vertexShader", "fragmentShader"]);

    //Locations definitions
    const colorLocation = gl.getAttribLocation(program, "a_color");
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const matrixLocation = gl.getUniformLocation(program, "u_matrix");

    draw();

//  DIVIDING FUNCTIONS
//
    function draw(){
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        //MATRIX
        let translation = [0, 0];
        let angleInRadians = 0;
        let scale = [1, 1];
        let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = m3.translate(matrix, translation[0], translation[1]);
        matrix = m3.rotate(matrix, angleInRadians);
        matrix = m3.scale(matrix, scale[0], scale[1]);

        //set the matrix
        gl.uniformMatrix3fv(matrixLocation, false, matrix);


        //Draw
        for (let i = 0; i < 200; i++) {
            setColor();
            setGeometry();
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        }

    }

    function setGeometry(){
        // Turn on the position attribute
        gl.enableVertexAttribArray(positionLocation);

        //buffer -- position
        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);


        setTriangle(gl,Math.random()*gl.canvas.width, Math.random()*gl.canvas.height, Math.random()*150);
    }

    function setColor(){
        gl.enableVertexAttribArray(colorLocation);

        //buffer -- color
        let colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

        gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0,0);

        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                Math.random(), Math.random(), Math.random(), 1,
                Math.random(), Math.random(), Math.random(), 1,
                Math.random(), Math.random(), Math.random(), 1,
            ]),
            gl.STATIC_DRAW
        );
    }
});

function setTriangle(gl, x, y, width){
    const x1 = x - width;
    const y1 = y + width/2;
    const x2 = x + width;
    const y2 = y + width/2;
    const x3 = x;
    const y3 = y - width;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y2,
        x3, y3,
    ]), gl.STATIC_DRAW);
}


