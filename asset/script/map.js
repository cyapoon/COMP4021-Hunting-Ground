const GameMap = function(context, gameArea) {

    let mapData = [
        [2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1,2],
        [2,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2],
        [2,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,0,0,0,1,1,1,1,0,2,0,0,0,0,0,0,2,0,2,1,1,2,0,0,2],
        [2,1,1,2,1,1,1,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,2,0,1,0,0,2,0,0,2],
        [2,0,0,2,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,2,2,0,2],
        [2,0,0,2,0,0,0,2,0,0,0,0,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,2,0,0,1,0,1,1,2,1,1,0,2],
        [2,0,2,1,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,1,0,2,0,0,2,2,2,0,2,0,0,0,0,0,0,2,0,0,0,2],
        [2,0,2,0,0,0,0,1,0,0,2,1,1,1,1,2,0,0,0,0,0,2,0,0,1,1,1,0,2,0,0,0,0,0,0,2,0,0,0,2],
        [2,0,2,0,0,0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,1,0,0,0,2],
        [2,0,1,1,1,1,0,0,1,1,1,0,0,0,0,1,1,1,1,0,0,2,0,2,0,0,0,2,1,1,1,1,1,1,0,0,0,1,1,2],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,1,1,1,2,1,0,0,0,0,0,0,0,0,0,0,2,0,0,0,2,0,2,0,1,1,2,1,1,0,1,1,1,1,2,0,0,0,2],
        [2,0,0,0,0,2,0,0,0,0,0,0,0,2,1,1,1,1,1,0,0,2,0,1,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,2],
        [2,0,0,2,0,2,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,0,0,2,1,1,1,0,0,0,2],
        [2,0,2,2,0,2,0,2,0,0,2,0,0,2,0,0,0,2,1,1,1,1,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2],
        [2,0,1,2,0,2,0,2,0,0,2,1,0,2,0,0,0,2,0,0,0,0,0,1,1,1,2,0,0,0,0,0,1,1,1,0,1,1,0,2],
        [2,0,0,1,0,1,0,2,0,1,2,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,1,2,0,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,0,0,0,0,2,0,0,1,0,0,2,0,0,0,1,1,1,2,1,1,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,1,0,1,0,1,0,1,1,0,2],
        [2,0,1,2,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,2,2,0,0,2,0,1,1,2,1,1,1,0,0,0,2,0,2,0,0,0,1,1,1,2,0,2,1,1,0,0,1,2,1,1,0,2],
        [2,0,1,1,1,1,0,1,0,0,0,1,0,0,0,0,0,0,2,0,1,0,2,0,0,0,0,1,0,2,0,0,0,0,0,1,0,0,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,2,2,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];

   
    /* The shuffle function for obstacles and traps */
    const shuffle = (array) => { 
        for (let i = array.length - 1; i > 0; i--) { 
          const j = Math.floor(Math.random() * (i + 1)); 
          [array[i], array[j]] = [array[j], array[i]]; 
        } 
        return array; 
    }; 

     /* Randomly generate obstacle*/
     let obstaclePossiblePos = [
        {x:10,y:5},
        {x:12,y:15},
        {x:8,y:16},
        {x:28,y:21},
        {x:27,y:6},
        {x:34,y:8},
        {x:17,y:10},
        {x:1,y:22},
        {x:6,y:16},
        {x:24,y:11},
        {x:30,y:11},
    ];
    
    const selectedObstacle = shuffle(obstaclePossiblePos).slice(0,8);
    selectedObstacle.forEach((pos) => {
        mapData[pos.y][pos.x] = 5;
    });

    /* Randomly generate chest*/
    let chestPossiblePos = [
        {x:1,y:1},
        {x:2,y:4},
        {x:2,y:20},
        {x:15,y:3},
        {x:21,y:1},
        {x:18,y:15},
        {x:34,y:3},
        {x:34,y:12},
        {x:33,y:14},
        {x:26,y:19},
        {x:4,y:4},
    ];

    const selectedChest = shuffle(chestPossiblePos).slice(0,5);
    selectedChest.forEach((pos)=>{
        mapData[pos.y][pos.x] = 4;
    })

    /*generate exits */
    const exitPossiblePos = [
        {
            pos1:{x:33, y:0},
            pos2:{x:39 ,y:18}
        },
        {
            pos1:{x:39, y:4},
            pos2:{x:35 ,y:23}
        }

    ];

    const selectedExit = shuffle(exitPossiblePos).slice(0,1);
    mapData[selectedExit[0].pos1.y][selectedExit[0].pos1.x] = 7;
    mapData[selectedExit[0].pos2.y][selectedExit[0].pos2.x] = 7;


    var map = [];

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
    }

}