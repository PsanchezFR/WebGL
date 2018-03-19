"use strict";
//MAIN SCRIPT ----------
//
    addEventListener("load", function () {

        //Create a canvas in the body and init webGL
            let canvas = document.createElement("canvas");
            document.body.appendChild(canvas);
            let gl = canvas.getContext("webgl");

        //check WebGL state
            if (gl){
                //INIT
                //
                    const vertexShaderSource = document.getElementById("vertexShader").text;
                    const fragmentShaderSource = document.getElementById("fragmentShader").text;
                    //Shaders creation
                    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
                    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
                    // Program creation
                    const program = createProgram(gl, vertexShader, fragmentShader);

                    // look up where the vertex data needs to go.
                    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
                    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
                    const colorUniformLocation = gl.getUniformLocation(program, "u_color");

                //BUFFER
                //
                    //Buffer init
                    let positionBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


                //RENDERING
                //
                    resize(gl.canvas);
                    //determine viewport
                    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                    // Clear the canvas
                    gl.clearColor(0, 0, 0, 0);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    //init program
                    gl.useProgram(program);
                    // Turn on the attribute
                    gl.enableVertexAttribArray(positionAttributeLocation);
                    //rebind buffer
                    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                    //specify how to pull the data out
                    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
                    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
                    //Draw
                    drawRandomShapes(gl, 10, colorUniformLocation, setRectangle);
            }
            else{
                console.log("WebGL context couldn't be initialized.");
            }
    });

//FUNCTIONS ----------
//

// JS STUFF

    //  function to draw random squares on screen
    //
        function drawRandomShapes(gl, number, colorUniformLocation, setShapeFunction){
            for (let i = 0; i < number; i++) {
                setShapeFunction(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));
                gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }
        }

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

// SHADER STUFF


    //  create a shader from a source corde written in GLSL as a string
    //
        function createShader(gl, type, source) {
            //create a shader of type specified
            let shader = gl.createShader(type);
            //give source code to gl and compile it
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            //test status of shader
            let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (success) {
                return shader;
            }
            //if unsuccessful, catch error
            console.log(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
        }

    //  create a program from one vextex and one fragment shader
    //
        function createProgram(gl, vertexShader, fragmentShader) {
            //create a program to hold the shaders
            let program = gl.createProgram();
            //attach and link
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            //test status of program
            let success = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (success) {
                return program;
            }
            //if unsuccessful, catch error
            console.log(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
        }
    // resizing function to refresh size of the canvas
    //

        function resize(canvas) {
            // Lookup the size the browser is displaying the canvas.
            let displayWidth  = canvas.clientWidth;
            let displayHeight = canvas.clientHeight;

            // Check if the canvas is not the same size.
            if (canvas.width  != displayWidth ||
                canvas.height != displayHeight) {

                // Make the canvas the same size
                canvas.width  = displayWidth;
                canvas.height = displayHeight;
            }
        }
