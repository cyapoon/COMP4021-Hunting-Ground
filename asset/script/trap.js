const Trap = function(ctx,x,y){
    const sequence = { x: 0, y:  0, width: 128, height: 128, count: 1, timing: 200, loop: false };

    const sprite = Sprite(ctx,x,y);

    sprite.setSequence(sequence)
        .setScale(0.275)
        .setShadowScale({ x: 0.75, y: 0.2 })
        .useSheet("./image/trap.png");

    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update,
        getDisplaySize:sprite.getDisplaySize
    };
        
}