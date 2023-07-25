// Canvas variables
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const toolBtns = document.querySelectorAll(".tool");
const colorBtns = document.querySelectorAll(".colors .option");
const colorPicker = document.querySelector("#color-picker");
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");

const clearCanvas = document.querySelector(".clear-canvas");
const saveImg = document.querySelector(".save-img");

let isDrawing = false;
let selectedTool = 'brush';
let brushWidth = 5;
let prevMouseX, prevMouseY, snapshot;
let selectedColor = "#000";

const setCanvasBackground = () =>
{
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}

// Canvas sizing
window.addEventListener('load', () =>
{
    setCanvasBackground();
    //offset give width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

// Start drawing
const startDraw = (e) =>
{
    isDrawing = true;

    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;

    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;

    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height) //copied canvas data
}

// Draw rectangle
const drawRect = (e) =>
{
    if(!fillColor.checked)
    {
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

// Draw circle
const drawCircle = (e) =>
{
    ctx.beginPath();

    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + 
    Math.pow((prevMouseY - e.offsetY), 2));
    
    ctx.arc(prevMouseX, prevMouseY, radius, 0, Math.PI * 2);
    fillColor.checked?ctx.fill():ctx.stroke();
}

// Draw Triangle
const drawTriangle = (e) =>
{
    ctx.beginPath();

    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked?ctx.fill():ctx.stroke();
}

// Drawing
const drawing = (e) =>
{
    if(!isDrawing)
    {
        return;
    }

    ctx.putImageData(snapshot, 0, 0); //added copied canvas data to this canvas
    ctx.lineCap = 'round';

    switch(selectedTool)
    {
        case 'brush':
        case 'eraser':
            ctx.strokeStyle = selectedTool === 'eraser' ? '#fff' : selectedColor;
            //line to mouse coordonates
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            break;
        case 'rectangle':
            drawRect(e);
            break;
        case 'circle':
            drawCircle(e);
            break;
        case 'triangle':
            drawTriangle(e);
            break;
        default:
            return;
    }
}

// Stop drawing
const stopDraw = () =>
{
    isDrawing = false;
}

// Buttons selector
toolBtns.forEach(btn => {
    btn.addEventListener('click', () =>
    {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    });
});

// Colors
colorBtns.forEach(btn => {
    btn.addEventListener('click', () =>
    {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

// Slider
sizeSlider.addEventListener('change', () =>
{
    brushWidth = sizeSlider.value;
});

// Color picker
colorPicker.addEventListener('change', () =>
{
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

// Clear canvas
clearCanvas.addEventListener('click', () =>
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

// Save image
saveImg.addEventListener('click', () =>
{
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

// Canvas drawing events
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', stopDraw);

