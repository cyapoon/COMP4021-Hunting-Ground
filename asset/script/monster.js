// This function defines the Player module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the player
// - `y` - The initial y position of the player
// - `gameArea` - The bounding box of the game area
const Monster = function(ctx, x, y, gameArea,mapData,map) {

    // This is the sprite sequences of the player facing different directions.
    // It contains the idling sprite sequences `idleLeft`, `idleUp`, `idleRight` and `idleDown`,
    // and the moving sprite sequences `moveLeft`, `moveUp`, `moveRight` and `moveDown`.
    const sequences = {
        /* Idling sprite sequences for facing different directions */

        idleLeft:  { x: 0, y: 128, width: 64, height: 64, count: 1, timing: 50, loop: false },
        idleUp:    { x: 0, y: 64, width: 64, height: 64, count: 1, timing: 50, loop: false },
        idleRight: { x: 0, y: 192, width: 64, height: 64, count: 1, timing: 50, loop: false },
        idleDown:  { x: 0, y: 0, width: 64, height: 64, count: 1, timing: 50, loop: false },

        /* Moving sprite sequences for facing different directions */
        moveLeft:  { x: 0, y: 128, width: 64, height: 64, count: 8, timing: 50, loop: true },
        moveUp:    { x: 0, y: 64, width: 64, height: 64, count: 8, timing: 50, loop: true },
        moveRight: { x: 0, y: 192, width: 64, height: 64, count: 8, timing: 50, loop: true },
        moveDown:  { x: 0, y: 0, width: 64, height: 64, count: 8, timing: 50, loop: true },
    };

    // This is the sprite object of the player created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the player sprite here.
    sprite.setSequence(sequences.idleDown)
          .setScale(1)
        //   .setShadowScale({ x: 0.75, y: 0.20 })
          .useSheet("../asset/image/monster_run.png");

    // This is the moving direction, which can be a number from 0 to 4:
    // - `0` - not moving
    // - `1` - moving to the left
    // - `2` - moving up
    // - `3` - moving to the right
    // - `4` - moving down
    let direction = 0;

    // This is the moving speed (pixels per second) of the player
    let speed = 150;

    // This function sets the player's moving direction.
    // - `dir` - the moving direction (1: Left, 2: Up, 3: Right, 4: Down)
    const move = function(dir) {
        if (dir >= 1 && dir <= 4 && dir != direction) {
            switch (dir) {
                case 1: sprite.setSequence(sequences.moveLeft); break;
                case 2: sprite.setSequence(sequences.moveUp); break;
                case 3: sprite.setSequence(sequences.moveRight); break;
                case 4: sprite.setSequence(sequences.moveDown); break;
            }
            direction = dir;
        }
    };

    // This function stops the player from moving.
    // - `dir` - the moving direction when the player is stopped (1: Left, 2: Up, 3: Right, 4: Down)
    const stop = function(dir) {
        // sprite.useSheet("monster_idle.png");
        if (direction == dir) {
            switch (dir) {
                case 1: sprite.setSequence(sequences.idleLeft); break;
                case 2: sprite.setSequence(sequences.idleUp); break;
                case 3: sprite.setSequence(sequences.idleRight); break;
                case 4: sprite.setSequence(sequences.idleDown); break;
            }
            direction = 0;
        }
    };



    // This function speeds up the player.
    const speedUp = function() {
        speed = 250;
    };

    // This function slows down the player.
    const slowDown = function() {
        speed = 150;
    };

    // This function updates the player depending on his movement.
    // - `time` - The timestamp when this function is called
    const update = function(time) {
        /* Update the player if the player is moving */
        if (direction != 0) {
            let { x, y } = sprite.getXY();

            // console.log("x: ",x,"y: ",y);

            /* Move the player */
            switch (direction) {
                case 1: x -= speed / 60; break;
                case 2: y -= speed / 60; break;
                case 3: x += speed / 60; break;
                case 4: y += speed / 60; break;
            }

            // let boundingBox = sprite.getBoundingBox();
            // let topIndex = parseInt((boundingBox.getTop()-gameArea.getTop())/25);
            // let leftIndex = parseInt((boundingBox.getLeft()-gameArea.getLeft())/25);
            // let rightIndex = parseInt((boundingBox.getRight()-gameArea.getLeft())/25);
            // let bottomIndex = parseInt((boundingBox.getBottom()-gameArea.getTop())/25);
            let leftXIndex = Math.floor((x-gameArea.getLeft()+7.5)/25);
            let rightXIndex = Math.ceil((x-gameArea.getLeft()-7.5)/25);
            let topYIndex = Math.floor((y-gameArea.getTop()+7.5)/25);
            let bottomYIndex = Math.ceil((y-gameArea.getLeft()-7.5)/25);

            // console.log("topIndex: ",topIndex,"leftIndex: ",leftIndex,"rightIndex: ",rightIndex,"bottomIndex: ",bottomIndex);
            // console.log("thisXIndex: ",thisXIndex,"thisYIndex: ",thisYIndex);
            let hit = false;

            switch (direction) {
                case 1:
                    if(mapData[topYIndex][leftXIndex] == 1 || mapData[topYIndex][leftXIndex] == 2
                        || mapData[bottomYIndex][leftXIndex] == 1 || mapData[bottomYIndex][leftXIndex] == 2)
                    {
                        hit = (
                            map[topYIndex][leftXIndex].getBoundingBox().isPointInBox(x-15,y)
                            || map[bottomYIndex][leftXIndex].getBoundingBox().isPointInBox(x-15,y)
                        // || map[thisYIndex+1][leftXIndex].getBoundingBox().isPointInBox(x-20,y)
                        );
                    }
                    break;
                case 2:
                    if(mapData[topYIndex][leftXIndex] == 1 || mapData[topYIndex][leftXIndex] == 2
                       || mapData[topYIndex][rightXIndex] == 1 || mapData[topYIndex][rightXIndex] == 2)
                    {
                        hit = (
                            map[topYIndex][leftXIndex].getBoundingBox().isPointInBox(x,y-15)
                            || map[topYIndex][rightXIndex].getBoundingBox().isPointInBox(x,y-15)
                        // || map[thisYIndex][thisXIndex+1].getBoundingBox().isPointInBox(x,y)
                        );
                    }
                    break;
                case 3:
                    if(mapData[topYIndex][rightXIndex] == 1 || mapData[topYIndex][rightXIndex] == 2
                        || mapData[bottomYIndex][rightXIndex] == 1 || mapData[bottomYIndex][rightXIndex] == 2)
                    {
                        hit = (
                            map[topYIndex][rightXIndex].getBoundingBox().isPointInBox(x+15,y)
                            || map[bottomYIndex][rightXIndex].getBoundingBox().isPointInBox(x+15,y)
                        // || map[thisYIndex+1][rightXIndex].getBoundingBox().isPointInBox(x+20,y)
                        );

                    }
                    break;
                case 4:
                    if(mapData[bottomYIndex][leftXIndex] == 1 || mapData[bottomYIndex][leftXIndex] == 2
                        ||mapData[bottomYIndex][rightXIndex] == 1 || mapData[bottomYIndex][rightXIndex] == 2)
                    {
                        hit = (
                            map[bottomYIndex][leftXIndex].getBoundingBox().isPointInBox(x,y+15)
                            || map[bottomYIndex][rightXIndex].getBoundingBox().isPointInBox(x,y+15)
                        // || map[thisYIndex][thisXIndex+1].getBoundingBox().isPointInBox(x,y)
                        );
                    }
            }

            /* Set the new position if it is within the game area */
            if (gameArea.isPointInBox(x, y) && !hit) {
                sprite.setXY(x, y);
            }
        }

        /* Update the sprite object */
        sprite.update(time);
    };

    // The methods are returned as an object here.
    return {
        move: move,
        stop: stop,
        speedUp: speedUp,
        slowDown: slowDown,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: update,
        getDisplaySize: sprite.getDisplaySize
    };
};
