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

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    draw();

//  DIVIDING FUNCTIONS
//
    function draw(){
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        //Draw
        for (let i = 0; i < 500; i++) {
            //MATRIX
            let translation = [600, 0, 0];
            let rotation = [Math.random() * Math.PI * 180/2, Math.random() * Math.PI * 180/2, Math.random() * Math.PI * 180/2] ;
            let scale = [1, 1, 1];
            let matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
            matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
            matrix = m4.xRotate(matrix, rotation[0]);
            matrix = m4.yRotate(matrix, rotation[1]);
            matrix = m4.zRotate(matrix, rotation[2]);
            matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);
            //set the matrix
            gl.uniformMatrix4fv(matrixLocation, false, matrix);

            setColor();
            setGeometry();
            gl.drawArrays(gl.TRIANGLES, 0, 3*4);
        }
        setTimeout(draw, 100);
    }

    function setGeometry(){
        // Turn on the position attribute
        gl.enableVertexAttribArray(positionLocation);

        //buffer -- position
        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

        setTetrahedron(gl,Math.random()*gl.canvas.width, Math.random()*gl.canvas.height, Math.random()*-50, Math.random()*50);
    }

    function setColor(){
        gl.enableVertexAttribArray(colorLocation);

        //buffer -- color
        let colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

        gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0,0);

        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                Math.random() * 256, Math.random() * 256, Math.random() * 256,
                Math.random() * 256, Math.random() * 256, Math.random() * 256,
                Math.random() * 256, Math.random() * 256, Math.random() * 256,
                Math.random() * 256, Math.random() * 256, Math.random() * 256,
                Math.random() * 256, Math.random() * 256, Math.random() * 256,
                Math.random() * 256, Math.random() * 256, Math.random() * 256,
                Math.random() * 256, Math.random() * 256, Math.random() * 256,
                Math.random() * 256, Math.random() * 256, Math.random() * 256,
                Math.random() * 256, Math.random() * 256, Math.random() * 256,
                Math.random() * 256, Math.random() * 256, Math.random() * 256,
                Math.random() * 256, Math.random() * 256, Math.random() * 256,
                Math.random() * 256, Math.random() * 256, Math.random() * 256,
            ]),
            gl.STATIC_DRAW
        );
    }
});

// FUNCTIONS    ----------
//
    //GEOMETRY  ----------
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

        function set3DTriangle(gl, x, y, z, width){
            const x1 = x - width;
            const y1 = y + width/2;
            const z1 = z ;
            const x2 = x + width;
            const y2 = y + width/2;
            const z2 = z ;
            const x3 = x;
            const y3 = y - width;
            const z3 = z ;
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                x1, y1, z1,
                x2, y2, z2,
                x3, y3, z3,
            ]), gl.STATIC_DRAW);
        }

    function setTetrahedron(gl, x, y, z, width){
            //(1,1,1), (1,−1,−1), (−1,1,−1), (−1,−1,1)
        const x1 = x + width;
        const y1 = y + width;
        const z1 = z + width;
        const x2 = x + width;
        const y2 = y - width;
        const z2 = z - width;
        const x3 = x - width;
        const y3 = y + width;
        const z3 = z - width;
        const x4 = x - width;
        const y4 = y - width;
        const z4 = z + width;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x1, y1, z1,
            x2, y2, z2,
            x3, y3, z3,
            //-------
            x3, y3, z3,
            x2, y2, z2,
            x4, y4, z4,
            //-------
            x4, y4, z4,
            x1, y1, z1,
            x3, y3, z3,
            //-------
            x1, y1, z1,
            x4, y4, z4,
            x2, y2, z2,
        ]), gl.STATIC_DRAW);
    }

// 3D SPACE CALCULUS FUNCTIONS  ---------
//

    var m4 = {

        projection: function(width, height, depth) {
            // Note: This matrix flips the Y axis so 0 is at the top.
            return [
                2 / width, 0, 0, 0,
                0, -2 / height, 0, 0,
                0, 0, 2 / depth, 0,
                -1, 1, 0, 1,
            ];
        },

        multiply: function(a, b) {
            var a00 = a[0 * 4 + 0];
            var a01 = a[0 * 4 + 1];
            var a02 = a[0 * 4 + 2];
            var a03 = a[0 * 4 + 3];
            var a10 = a[1 * 4 + 0];
            var a11 = a[1 * 4 + 1];
            var a12 = a[1 * 4 + 2];
            var a13 = a[1 * 4 + 3];
            var a20 = a[2 * 4 + 0];
            var a21 = a[2 * 4 + 1];
            var a22 = a[2 * 4 + 2];
            var a23 = a[2 * 4 + 3];
            var a30 = a[3 * 4 + 0];
            var a31 = a[3 * 4 + 1];
            var a32 = a[3 * 4 + 2];
            var a33 = a[3 * 4 + 3];
            var b00 = b[0 * 4 + 0];
            var b01 = b[0 * 4 + 1];
            var b02 = b[0 * 4 + 2];
            var b03 = b[0 * 4 + 3];
            var b10 = b[1 * 4 + 0];
            var b11 = b[1 * 4 + 1];
            var b12 = b[1 * 4 + 2];
            var b13 = b[1 * 4 + 3];
            var b20 = b[2 * 4 + 0];
            var b21 = b[2 * 4 + 1];
            var b22 = b[2 * 4 + 2];
            var b23 = b[2 * 4 + 3];
            var b30 = b[3 * 4 + 0];
            var b31 = b[3 * 4 + 1];
            var b32 = b[3 * 4 + 2];
            var b33 = b[3 * 4 + 3];
            return [
                b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
                b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
                b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
                b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
                b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
                b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
                b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
                b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
                b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
                b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
                b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
                b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
                b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
                b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
                b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
                b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
            ];
        },

        translation: function(tx, ty, tz) {
            return [
                1,  0,  0,  0,
                0,  1,  0,  0,
                0,  0,  1,  0,
                tx, ty, tz, 1,
            ];
        },

        xRotation: function(angleInRadians) {
            var c = Math.cos(angleInRadians);
            var s = Math.sin(angleInRadians);

            return [
                1, 0, 0, 0,
                0, c, s, 0,
                0, -s, c, 0,
                0, 0, 0, 1,
            ];
        },

        yRotation: function(angleInRadians) {
            var c = Math.cos(angleInRadians);
            var s = Math.sin(angleInRadians);

            return [
                c, 0, -s, 0,
                0, 1, 0, 0,
                s, 0, c, 0,
                0, 0, 0, 1,
            ];
        },

        zRotation: function(angleInRadians) {
            var c = Math.cos(angleInRadians);
            var s = Math.sin(angleInRadians);

            return [
                c, s, 0, 0,
                -s, c, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ];
        },

        scaling: function(sx, sy, sz) {
            return [
                sx, 0,  0,  0,
                0, sy,  0,  0,
                0,  0, sz,  0,
                0,  0,  0,  1,
            ];
        },

        translate: function(m, tx, ty, tz) {
            return m4.multiply(m, m4.translation(tx, ty, tz));
        },

        xRotate: function(m, angleInRadians) {
            return m4.multiply(m, m4.xRotation(angleInRadians));
        },

        yRotate: function(m, angleInRadians) {
            return m4.multiply(m, m4.yRotation(angleInRadians));
        },

        zRotate: function(m, angleInRadians) {
            return m4.multiply(m, m4.zRotation(angleInRadians));
        },

        scale: function(m, sx, sy, sz) {
            return m4.multiply(m, m4.scaling(sx, sy, sz));
        },

    };
    // Fill the buffer with the values that define a letter 'F'.
    function setGeometry(gl) {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                // left column
                0,   0,  0,
                30,   0,  0,
                0, 150,  0,
                0, 150,  0,
                30,   0,  0,
                30, 150,  0,

                // top rung
                30,   0,  0,
                100,   0,  0,
                30,  30,  0,
                30,  30,  0,
                100,   0,  0,
                100,  30,  0,

                // middle rung
                30,  60,  0,
                67,  60,  0,
                30,  90,  0,
                30,  90,  0,
                67,  60,  0,
                67,  90,  0]),
            gl.STATIC_DRAW);
    }
