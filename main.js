
document.addEventListener("keydown", function (element) {
    if (element.key == "d") MoveRight();
    else if (element.key == "a") MoveLeft();
    else if (element.key == "s") MoveBottom();
    else if (element.key == "w") MoveTop();
    else if (element.key == " ") console.log("Slava Ukraine!");
})
let playerField = $('div.gameField-playerField');
let height = 0;
let width = 0;
let step = 10;
console.log(`${height} x ${width}`);

function Sleep() {
    return Promise(1000);
}
let player = $('div.gameField-playerField div.gameField-playerField-player');

function MoveLeft() {
    if (width - step >= 0) {
        width -= step;
        player.css("left", `${width}px`);
    }
    else {
        width = 0;
        player.css("left", `${width}px`);
    }
}
function MoveRight() {
    if ((width + step + player.width()) < playerField.outerWidth()) {
        width += step;
        player.css("left", `${width}px`);
    }
    else {
        width = playerField.outerWidth() - player.width();
        player.css("left", `${width}px`);
    }
}
function MoveTop() {
    if (height - step >= 0) {
        height -= step;
        player.css("top", `${height}px`);
    }
    else {
        height = 0;
        player.css("top", `${height}px`);
    }

}
async function MoveBottom() {
    await Sleep();
    console.log("Slava Ukraine!");
    if ((height + step + player.height()) < playerField.outerHeight()) {
        height += step;
        player.css("top", `${height}px`);
    }
    else {
        height = playerField.outerHeight() - player.height();
        player.css("top", `${height}px`);
    }
}