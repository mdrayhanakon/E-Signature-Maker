document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('signature-pad');
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let strokes = [];
    let lastStrokeTime = 0; // To introduce a delay between strokes

    // Set up canvas style for smoother strokes
    ctx.lineWidth = 2.5;   // Adjust stroke thickness
    ctx.lineCap = 'round'; // Smooth line endings

    // Mouse Down: Start drawing
    canvas.addEventListener('mousedown', function (e) {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
    });

    // Mouse Move: Draw as the user moves the cursor
    canvas.addEventListener('mousemove', function (e) {
        if (drawing) {
            const now = new Date().getTime();
            if (now - lastStrokeTime > 10) { // Add a small delay to smooth strokes
                ctx.lineTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
                ctx.stroke();
                lastStrokeTime = now;
            }
        }
    });

    // Mouse Up: Stop drawing and save the stroke state
    canvas.addEventListener('mouseup', function () {
        if (drawing) {
            drawing = false;
            strokes.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        }
    });

    // Clear Button: Clears the canvas with animation
    document.getElementById('clear-button').addEventListener('click', function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        strokes = [];
        canvas.classList.add('shake'); // Add shake animation on clear
        setTimeout(() => canvas.classList.remove('shake'), 300); // Remove animation class after 300ms
    });

    // Undo Button: Undo the last stroke
    document.getElementById('undo-button').addEventListener('click', function () {
        if (strokes.length > 0) {
            canvas.classList.add('flash'); // Flash effect on undo
            ctx.putImageData(strokes.pop(), 0, 0);
            setTimeout(() => canvas.classList.remove('flash'), 300); // Remove flash effect
        }
    });

    // Download Button: Save signature as an image
    document.getElementById('download-button').addEventListener('click', function () {
        canvas.classList.add('scale'); // Slight scale effect on download
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'signature.png';
        link.click();
        setTimeout(() => canvas.classList.remove('scale'), 300); // Reset the scale effect
    });
});
