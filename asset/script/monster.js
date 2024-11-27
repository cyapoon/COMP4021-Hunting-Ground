 // This function defines the Monster module.
 const Monster = function (ctx, x, y, gameArea, mapData, map) {

     var timeout;
     var cheatingMode = false;

     // This is the sprite sequences of the monster facing different directions.
     // It contains the idling sprite sequences `idleLeft`, `idleUp`, `idleRight` and `idleDown`,
     // and the moving sprite sequences `moveLeft`, `moveUp`, `moveRight` and `moveDown`.
     const sequences = {
         /* Idling sprite sequences for facing different directions */

         idleLeft: { x: 0, y: 128, width: 64, height: 64, count: 1, timing: 50, loop: false },
         idleUp: { x: 0, y: 64, width: 64, height: 64, count: 1, timing: 50, loop: false },
         idleRight: { x: 0, y: 192, width: 64, height: 64, count: 1, timing: 50, loop: false },
         idleDown: { x: 0, y: 0, width: 64, height: 64, count: 1, timing: 50, loop: false },

         /* Moving sprite sequences for facing different directions */
         moveLeft: { x: 0, y: 128, width: 64, height: 64, count: 8, timing: 50, loop: true },
         moveUp: { x: 0, y: 64, width: 64, height: 64, count: 8, timing: 50, loop: true },
         moveRight: { x: 0, y: 192, width: 64, height: 64, count: 8, timing: 50, loop: true },
         moveDown: { x: 0, y: 0, width: 64, height: 64, count: 8, timing: 50, loop: true },
     };

     // This is the sprite object of the monster created from the Sprite module.
     const sprite = Sprite(ctx, x, y);

     // The sprite object is configured for the monster sprite here.
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

     // This is the moving speed (pixels per second) of the monster
     let speed = 150;

     // This function sets the monster's moving direction.
     // - `dir` - the moving direction (1: Left, 2: Up, 3: Right, 4: Down)
     const move = function (dir) {
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

     // This function stops the monster from moving.
     // - `dir` - the moving direction when the monster is stopped (1: Left, 2: Up, 3: Right, 4: Down)
     const stop = function (dir) {
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

     // This function allow monster to destroy the obstacle
     const destroy = function () {
         let { x, y } = sprite.getXY();
         let leftXIndex = Math.floor((x - gameArea.getLeft()) / 25);
         let rightXIndex = Math.ceil((x - gameArea.getLeft() ) / 25);
         let topYIndex = Math.floor((y - gameArea.getTop() ) / 25);
         let bottomYIndex = Math.ceil((y - gameArea.getLeft()) / 25);

         switch (direction) {
             case 1:
                 if (mapData[topYIndex][leftXIndex] == 5) {
                     mapData[topYIndex][leftXIndex] = 0;
                     map[topYIndex][leftXIndex] = Road(ctx, gameArea.getLeft() + leftXIndex * 25, gameArea.getTop() + topYIndex * 25);
                     // console.log("destroyed");

                 }
                 if (mapData[bottomYIndex][leftXIndex] == 5) {
                     mapData[bottomYIndex][leftXIndex] = 0;
                     map[bottomYIndex][leftXIndex] = Road(ctx,gameArea.getLeft() + leftXIndex*25, gameArea.getTop() + bottomYIndex*25);
                     // console.log("destroyed");
                 }
                 break;
             case 2:
                 if (mapData[topYIndex][leftXIndex] == 5) {
                     mapData[topYIndex][leftXIndex] = 0;
                     map[topYIndex][leftXIndex] = Road(ctx,gameArea.getLeft() + leftXIndex*25, gameArea.getTop() + topYIndex*25);
                     // console.log("destroyed");
                 }
                 if (mapData[topYIndex][rightXIndex] == 5) {
                     mapData[topYIndex][rightXIndex] = 0;
                     map[topYIndex][rightXIndex] = Road(ctx,gameArea.getLeft() + rightXIndex*25, gameArea.getTop() + topYIndex*25);
                     // console.log("destroyed");
                 }
                 break;
             case 3:
                 if (mapData[topYIndex][rightXIndex] == 5) {
                     mapData[topYIndex][rightXIndex] = 0;
                     map[topYIndex][rightXIndex] = Road(ctx,gameArea.getLeft() + rightXIndex*25, gameArea.getTop() + topYIndex*25);
                     // console.log("destroyed");
                 }
                 if (mapData[bottomYIndex][rightXIndex] == 5) {
                     mapData[bottomYIndex][rightXIndex] = 0;
                     map[bottomYIndex][rightXIndex] = Road(ctx,gameArea.getLeft() + rightXIndex*25, gameArea.getTop() + bottomYIndex*25);
                     // console.log("destroyed");
                 }
                 break;
             case 4:
                 if (mapData[bottomYIndex][leftXIndex] == 5) {
                     mapData[bottomYIndex][leftXIndex] = 0;
                     map[bottomYIndex][leftXIndex] = Road(ctx,gameArea.getLeft() + leftXIndex*25, gameArea.getTop() + bottomYIndex*25);
                     // console.log("destroyed");
                 }
                 if (mapData[bottomYIndex][rightXIndex] == 5) {
                     mapData[bottomYIndex][rightXIndex] = 0;
                     map[bottomYIndex][rightXIndex] = Road(ctx,gameArea.getLeft() + rightXIndex*25, gameArea.getTop() + bottomYIndex*25);
                     // console.log("destroyed");
                 }
         }

     };
     // console.log(mapData);

     // This function speeds up the monster.
     const speedUp = function () {
         speed = 250;
     };

     // This function slows down the monster while getting trap.
     const slowDown = function () {
         speed = 75;
     };

     /* This function set survivor to normal speed */
     const normalSpeed = function () {
         speed = 175;
     }

     /* This function switch the cheatint mode */
     const switchCheatingMode = function () {
         if(cheatingMode){
             cheatingMode = false;
             normalSpeed();
         }
         else{
             cheatingMode = true;
             speedUp();
         }
     }

     // This function updates the monster depending on his movement.
     // - `time` - The timestamp when this function is called
     const update = function (time) {
         /* Update the monster if the monster is moving */
         if (direction != 0) {
             let { x, y } = sprite.getXY();

             // console.log("x: ",x,"y: ",y);

             /* Move the monster */
             switch (direction) {
                 case 1: x -= speed / 60; break;
                 case 2: y -= speed / 60; break;
                 case 3: x += speed / 60; break;
                 case 4: y += speed / 60; break;
             }

             let leftXIndex = Math.floor((x - gameArea.getLeft() + 7.5) / 25);
             let rightXIndex = Math.ceil((x - gameArea.getLeft() - 7.5) / 25);
             let topYIndex = Math.floor((y - gameArea.getTop() + 7.5) / 25);
             let bottomYIndex = Math.ceil((y - gameArea.getLeft() - 7.5) / 25);

             let hit = false;

             /* Handle the wall */
             switch (direction) {
                 case 1:
                     if (mapData[topYIndex][leftXIndex] == 1 || mapData[topYIndex][leftXIndex] == 2
                         || mapData[bottomYIndex][leftXIndex] == 1 || mapData[bottomYIndex][leftXIndex] == 2) {
                         hit = (
                             map[topYIndex][leftXIndex].getBoundingBox().isPointInBox(x - 15, y)
                             || map[bottomYIndex][leftXIndex].getBoundingBox().isPointInBox(x - 15, y)
                             // || map[thisYIndex+1][leftXIndex].getBoundingBox().isPointInBox(x-20,y)
                         );
                     }
                     break;
                 case 2:
                     if (mapData[topYIndex][leftXIndex] == 1 || mapData[topYIndex][leftXIndex] == 2
                         || mapData[topYIndex][rightXIndex] == 1 || mapData[topYIndex][rightXIndex] == 2) {
                         hit = (
                             map[topYIndex][leftXIndex].getBoundingBox().isPointInBox(x, y - 15)
                             || map[topYIndex][rightXIndex].getBoundingBox().isPointInBox(x, y - 15)
                             // || map[thisYIndex][thisXIndex+1].getBoundingBox().isPointInBox(x,y)
                         );
                     }
                     break;
                 case 3:
                     if (mapData[topYIndex][rightXIndex] == 1 || mapData[topYIndex][rightXIndex] == 2
                         || mapData[bottomYIndex][rightXIndex] == 1 || mapData[bottomYIndex][rightXIndex] == 2) {
                         hit = (
                             map[topYIndex][rightXIndex].getBoundingBox().isPointInBox(x + 15, y)
                             || map[bottomYIndex][rightXIndex].getBoundingBox().isPointInBox(x + 15, y)
                             // || map[thisYIndex+1][rightXIndex].getBoundingBox().isPointInBox(x+20,y)
                         );

                     }
                     break;
                 case 4:
                     if (mapData[bottomYIndex][leftXIndex] == 1 || mapData[bottomYIndex][leftXIndex] == 2
                         || mapData[bottomYIndex][rightXIndex] == 1 || mapData[bottomYIndex][rightXIndex] == 2) {
                         hit = (
                             map[bottomYIndex][leftXIndex].getBoundingBox().isPointInBox(x, y + 15)
                             || map[bottomYIndex][rightXIndex].getBoundingBox().isPointInBox(x, y + 15)
                             // || map[thisYIndex][thisXIndex+1].getBoundingBox().isPointInBox(x,y)
                         );
                     }
             }

             /* Handle the obtacle */
             if (!cheatingMode) {
                 switch (direction) {
                     case 1:
                         if (mapData[topYIndex][leftXIndex] == 5 || mapData[bottomYIndex][leftXIndex] == 5) {
                             hit = (hit || (
                                 map[topYIndex][leftXIndex].getBoundingBox().isPointInBox(x - 15, y)
                                 || map[bottomYIndex][leftXIndex].getBoundingBox().isPointInBox(x - 15, y))
                             );
                         }
                         break;
                     case 2:
                         if (mapData[topYIndex][leftXIndex] == 5 || mapData[topYIndex][rightXIndex] == 5) {
                             hit = (hit || (
                                 map[topYIndex][leftXIndex].getBoundingBox().isPointInBox(x, y - 15)
                                 || map[topYIndex][rightXIndex].getBoundingBox().isPointInBox(x, y - 15)
                             ));
                         }
                         break;
                     case 3:
                         if (mapData[topYIndex][rightXIndex] == 5 || mapData[bottomYIndex][rightXIndex] == 5) {
                             hit = (hit || (
                                 map[topYIndex][rightXIndex].getBoundingBox().isPointInBox(x + 15, y)
                                 || map[bottomYIndex][rightXIndex].getBoundingBox().isPointInBox(x + 15, y)
                             ));

                         }
                         break;
                     case 4:
                         if (mapData[bottomYIndex][leftXIndex] == 5 || mapData[bottomYIndex][rightXIndex] == 5) {
                             hit = (hit || (
                                 map[bottomYIndex][leftXIndex].getBoundingBox().isPointInBox(x, y + 15)
                                 || map[bottomYIndex][rightXIndex].getBoundingBox().isPointInBox(x, y + 15)
                             ));
                         }
                 }
             }


             /* Set the new position if it is within the game area */
             if (gameArea.isPointInBox(x, y) && !hit) {
                 sprite.setXY(x, y);
             }

             /* Handle the trap */
             if(!cheatingMode){
                 const xIndex = Math.round((x - gameArea.getLeft()) / 25);
                 const yIndex = Math.round((y - gameArea.getTop()) / 25);
                 if (mapData[yIndex][xIndex] == 6) {
                     clearTimeout(timeout);
                     mapData[yIndex][xIndex] = 0;
                     map[yIndex][xIndex] = Road(ctx, gameArea.getLeft() + xIndex * 25, gameArea.getTop() + yIndex * 25);
                     slowDown();
                     timeout = setTimeout(normalSpeed, 3000);
                 }
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
         getDisplaySize: sprite.getDisplaySize,
         getXY:sprite.getXY,
         destroy:destroy,
         normalSpeed:normalSpeed,
         switchCheatingMode:switchCheatingMode
     };
 };

