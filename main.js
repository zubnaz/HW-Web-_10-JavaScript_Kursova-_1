
document.addEventListener("keydown", function (element) {
    if (element.key == "d") MoveRight();
    else if (element.key == "a") MoveLeft();
    else if (element.key == "s") MoveBottom();
    else if (element.key == "w") MoveTop();
    else if (element.key == " ") if (!isShotPause) Shot();

})
let gameField = $("div.gameField");
let playerField = $('div.gameField-playerField');
let base = $("div.gameField-base");
let baseHealth = $("div.gameField-base div.gameField-base-health");
let baseDamage = $("div.gameField-base div.gameField-base-damage");
baseHealth.css("background-color", "green");
baseDamage.css("background-color", "gray");
baseHealth.css("height", "100%");
baseDamage.css("height", "100%");
baseHealth.css("width", "100%");
baseDamage.css("width", "0%");
let player = $('div.gameField-playerField div.gameField-playerField-player');
let damage = (parseInt(baseHealth.css("width")) * 10) / 100;
let health = 100;
let gun = $('div.gameField-playerField-player-gun1');
let height = 0;
let width = 0;
let step = 50;
let playerFieldHeight = playerField.outerHeight();
let heightWindow = gameField.outerHeight();
let heightBase = base.outerHeight();
let widthEnemy = (gameField.outerWidth() * 5) / 100;
let heightEnemy = player.outerHeight();
let startBulletCoordTop = heightWindow - ((playerFieldHeight - height) + heightBase) - player.height();
let isShotPause = false;
let stopGame = false;
let points = 0;

SpawnEnemy();
function change(bm, obj, type) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (type == "bullet") {
                bm -= 1;
                $('div.enemy').each((index, element) => {
                    if (Math.trunc(parseInt($(element).css("top")) + heightEnemy) >= Math.trunc(bm) && Math.trunc(parseInt($(element).css("top"))) <= Math.trunc(bm) + parseInt(obj.css("height"))) {
                        if (parseInt(obj.css("left")) + parseInt(obj.css("width")) >= parseInt($(element).css("left")) && parseInt(obj.css("left")) <= (parseInt($(element).css("width")) + parseInt($(element).css("left")))) {
                            $(element).removeClass("enemy");
                            $(element).addClass("destroyed")
                            $(element).remove();
                            points++;
                            bm = 0
                        }

                    }
                });
            }
            else if (type == "enemy")
                bm += 1;

            resolve(bm);
        }, 10);
    });

}
function EnemyMove(enemy, cm) {
    if (!stopGame) {
        change(cm, enemy, "enemy").then((res) => {
            if (res + enemy.outerHeight() < heightWindow - heightBase) {
                if (enemy.hasClass("enemy")) {
                    enemy.css("top", `${res}px`);
                    EnemyMove(enemy, res);
                }
            }
            else {
                health -= 10;
                baseHealth.css("width", `${health}%`);
                baseDamage.css("width", `${100 - health}%`);


                if (parseInt(baseHealth.css("width")) == 0) {
                    stopGame = true;
                    $('div.enemy').each((index, element) => {
                        gameField.find(element).remove();
                    })
                    gameField.children().remove();
                    gameField.append('<div class="lose">You Lose</div>');
                    gameField.append(`<div class="lose">Points : ${points}</div>`);

                }
                gameField.find(enemy).remove();
            }

        });
    }
}
function generateXCoordForEnemy() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(Math.floor(Math.random() * (gameField.outerWidth() - widthEnemy)));
        }, 1000);
    });
}
async function SpawnEnemy() {

    await generateXCoordForEnemy().then((res) => {
        if (!stopGame) {
            if ((Math.floor((Math.random() * 2) + 1)) == 1)
                gameField.prepend('<div class="enemy"><img src="./Img/Comet.png"></div>');
            else
                gameField.prepend('<div class="enemy"><img src="./Img/Alien.png"></div>');
            let enemy = $('div.gameField div.enemy').first();
            enemy.css("left", `${res}px`);
            enemy.css("top", `0px`);
            enemy.css("height", `${heightEnemy}`);
            let startenemyCoordTop = 0;

            EnemyMove(enemy, startenemyCoordTop);
            SpawnEnemy();
        }
    })

}

function BulletMove(bullet, bm) {
    change(bm, bullet, "bullet").then((res) => {
        if (res > 0) {
            bullet.css("top", res);
            BulletMove(bullet, res);
        }
        else {
            gameField.find(bullet).remove();
        }
    });

}
function shotPause() {
    return new Promise((resolve) => {
        setTimeout((resolve), 500);
    })
}


function Shot() {
    startBulletCoordTop = heightWindow - ((playerFieldHeight - height) + heightBase) - player.height();
    gameField.prepend('<div class="bullet"><img src="./Img/Bullet.png"></div>');
    gameField.prepend('<div class="bullet"><img src="./Img/Bullet.png"></div>');

    if (!isShotPause) {
        isShotPause = true;
        shotPause().then(() => { isShotPause = false });
    }
    let bullet1 = $('div.gameField div.bullet').first();
    let bullet2 = $('div.gameField div.bullet').first().next();
    bullet1.css("width", `${gun.outerWidth() * 2}px`);
    bullet2.css("width", `${gun.outerWidth() * 2}px`);
    bullet1.css("height", `${gun.outerHeight()}px`);
    bullet2.css("height", `${gun.outerHeight()}px`);
    bullet1.css("left", `${width}px`);
    bullet2.css("left", `${(width + player.outerWidth()) - bullet2.outerWidth()}px`);
    bullet1.css("top", `${startBulletCoordTop}px`);
    bullet2.css("top", `${startBulletCoordTop}px`);

    let bulletMove = startBulletCoordTop;

    BulletMove(bullet1, bulletMove);
    BulletMove(bullet2, bulletMove);
}

function MoveLeft() {
    if (!stopGame) {
        if (width - step >= 0) {
            width -= step;
            player.css("left", `${width}px`);
        }
        else {
            width = 0;
            player.css("left", `${width}px`);
        }
    }
}
function MoveRight() {
    if (!stopGame) {
        if ((width + step + player.width()) < playerField.outerWidth()) {
            width += step;
            player.css("left", `${width}px`);
        }
        else {
            width = playerField.outerWidth() - player.width();
            player.css("left", `${width}px`);
        }
    }
}
function MoveTop() {
    if (!stopGame) {
        if (height - step >= 0) {
            height -= step;
            startBulletCoordTop -= step;
            player.css("top", `${height}px`);
        }
        else {
            height = 0;
            startBulletCoordTop = heightWindow - (playerFieldHeight + heightBase) - player.height();
            player.css("top", `${height}px`);
        }
    }
}
function MoveBottom() {
    if (!stopGame) {
        if ((height + step + player.height()) < playerField.outerHeight()) {
            height += step;
            startBulletCoordTop += step;
            player.css("top", `${height}px`);
        }
        else {
            height = playerField.outerHeight() - player.height();
            startBulletCoordTop = heightWindow - (playerFieldHeight + heightBase) + (playerFieldHeight - player.height());
            player.css("top", `${height}px`);
        }
    }
}