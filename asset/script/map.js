const GameMap = function(context, gameArea) {

    let mapData;

    var map = [];

    const drawmap = function(){
        for(var i = 0; i< 24; i++){
            let row = [];
            for(var j = 0; j< 40; j++){
                if(mapData[i][j] == 0){
                    row.push(Road(context, gameArea.getLeft()+j*25, gameArea.getTop()+i*25));
                }
                if(mapData[i][j] == 1){
                    row.push(Wall1(context, gameArea.getLeft()+j*25, gameArea.getTop()+i*25 ));
                }
                else if(mapData[i][j] == 2){
                    row.push(Wall2(context, gameArea.getLeft()+j*25, gameArea.getTop()+i*25));
    
                }
                else if(mapData[i][j] == 4){
                    row.push(Chest(context, gameArea.getLeft()+j*25, gameArea.getTop()+i*25));
                }
                else if(mapData[i][j] == 5){
                    row.push(Obstacle(context, gameArea.getLeft()+j*25, gameArea.getTop()+i*25));
                }
                else if(mapData[i][j] == 6){
                    row.push(Trap(context, gameArea.getLeft()+j*25, gameArea.getTop()+i*25));
                }
                else if(mapData[i][j] == 7){
                    row.push(Exit(context, gameArea.getLeft()+j*25, gameArea.getTop()+i*25));
                    if(j == 39)
                    {
                        mapData[i-1][j] = 1;
                        map[i-1][j] = Wall1(context, gameArea.getLeft()+(j)*25, gameArea.getTop()+(i-1)*25 );
                    }   
                }
            }
            map.push(row);
        }
    }

    const setMapData = function(arr){
        mapData = arr;
    }

    return{
        getMap: function(){
            return map;
        },
        getMapData: function(){
            return mapData;
        },
        drawmap,
        setMapData
    }

}