//strict mode
"use strict";
//MAIN SCRIPT ----------
//
addEventListener("load", function () {

    //Create a canvas in the body and init webGL
    let canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    let gl = canvas.getContext("webgl");


    //check WebGL state
    if (!gl){
        return;
    }

    //INIT
    //
    // setup GLSL program
    let program = webglUtils.createProgramFromScripts(gl, ["vertexShader", "fragmentShader"]);
    // look up where the vertex data needs to go.
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");

    //BUFFERS
    //Buffer init
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    draw();

    //RENDERING
    //
        function draw(){
            webglUtils.resizeCanvasToDisplaySize(gl.canvas);
            //determine viewport
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            // Clear the canvas
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            //init program
            gl.useProgram(program);
            // Turn on the attribute
            gl.enableVertexAttribArray(positionAttributeLocation);
            //create the matrix
            let translation = [0, 0];
            let angleInRadians = 0;
            let scale = [1, 1];
            let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
            matrix = m3.translate(matrix, translation[0], translation[1]);
            matrix = m3.rotate(matrix, angleInRadians);
            matrix = m3.scale(matrix, scale[0], scale[1]);
            //set the matrix
            gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);
            //specify how to pull the data out
            gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
            gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
            //Draw
            for (let i = 0; i < 100; i++) {
                setTriangle(gl, randomInt(gl.canvas.clientWidth), randomInt(gl.canvas.clientHeight), randomInt(150));
                gl.drawArrays(gl.TRIANGLES, 0, 3);
            }
        }
});

//FUNCTIONS ----------
//

// JS STUFF

//  function to draw random squares on screen
//
function drawRandomSquare(gl, number, colorUniformLocation){
    for (let i = 0; i < number; i++) {
        setRectangle(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));
        gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

//  function to return an int between 0 and range
//
function randomInt(range) {
    return Math.floor(Math.random() * range);
}


//  function to set one rectangle
//
function setRectangle(gl, x, y, width, height){
    const x1 = x;
    const y1 = y;
    const x2 = x + width;
    const y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), gl.STATIC_DRAW);
}

//    function to draw random triangles on screen
//
function drawRandomTriangle(gl, number, colorUniformLocation){
    for (let i = 0; i < number; i++) {
        setTriangle(gl, randomInt(gl.canvas.clientWidth), randomInt(gl.canvas.clientHeight), randomInt(150));
        if(colorUniformLocation !== null){
         gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
        }
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}

// function to set one triangle
//
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

// SHADER STUFF

//  do all the rendering operations
//



