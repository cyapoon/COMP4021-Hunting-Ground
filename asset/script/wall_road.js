const Wall1 = function(ctx,x,y){
    const sequence = { x: 0, y:  0, width: 25, height: 25, count: 1, timing: 200, loop: false };

    const sprite = Sprite(ctx,x,y);

    sprite.setSequence(sequence)
        .setScale(1)
        .setShadowScale({ x: 0.75, y: 0.2 })
        .useSheet("../asset/image/wall1.png");

    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update
    };
        
}

const Wall2 = function(ctx,x,y){
    const sequence = { x: 0, y:  0, width: 25, height: 25, count: 1, timing: 200, loop: false };

    const sprite = Sprite(ctx,x,y);

    sprite.setSequence(sequence)
        .setScale(1)
        .setShadowScale({ x: 0.75, y: 0.2 })
        .useSheet("../asset/image/wall2.png");

    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update
    };
        
}

const Road = function(ctx,x,y){
    const sequence = { x: 0, y:  0, width: 25, height: 25, count: 1, timing: 200, loop: false };

    const sprite = Sprite(ctx,x,y);

    sprite.setSequence(sequence)
        .setScale(1)
        .setShadowScale({ x: 0.75, y: 0.2 })
        .useSheet("../asset/image/road.png");

    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update
    };
        
}