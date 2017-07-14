/*
 待解决：1,mouseup 异常
*/
(function(g,callback){
    callback(g);
})(window,function(g){

    var mineCraft = function(num1,num2,mine_num,obj,type){
        this.num1 = num1;                        //行数
        this.num2 = num2;                        //列
        this.mine_num = mine_num;                //雷的个数
        this.tiles = [];                         //
        this.obj = obj;
        this.flag = true;
        this.arr = [];
        this.arr_2 = [];
        this.time_dsq = null;
        this.time_dc ='';
        this.time_arr = [[],[],[]];
        this.details = [[],[],[]];
        this.type = type;
        this.buildTiles();
    };

    mineCraft.prototype = {

        buildTiles:function(){
            this.obj.style.width = 51*this.num1+'px';
            this.obj.style.height = 51*this.num2+'px';
            var indexOfdiv = 0;
            for(var i = 0;i<this.num2;i++){
                for(var j = 0;j<this.num1;j++){
                    var tile = document.createElement('div');
                    tile.className = 'tile';
                    tile.index = indexOfdiv;
                    this.tiles[indexOfdiv] = tile;
                    indexOfdiv++;
                    this.obj.appendChild(tile);
                }
            }
            this.obj.oncontextmenu = function(){
                return false;
            }
            this.event();
   
        },
        setMineCraft:function(num,arr_first,num_first){
            var arr_index = [];
            for(var i = 0;i<arr_first.length;i++){
                arr_index.push(arr_first[i].index);
            }
            var length = this.tiles.length;
            for (var i = 0; i < length; i++) {
                this.tiles[i].setAttribute("val", 0);
            }
            for (var i = 0; i < num; i++) {
                var index_Mine = Math.floor(Math.random() * this.tiles.length);
                if(index_Mine == num_first||arr_index.lastIndexOf(index_Mine)>-1){
                    num++;
                    continue;
                }
                
                if (this.tiles[index_Mine].getAttribute("val") == 0) {
                    this.tiles[index_Mine].setAttribute("val", 1);
                }else {
                    num++;
                }
            }
            this.showValue();
            this.event()
        },
        event : function(){
            var _this = this;
            this.obj.onmouseover = function(e){
                if(e.target.className == 'tile'){
                    e.target.className = 'tile current';
                }
            }
            this.obj.onmouseout = function(e){
                if(e.target.className == 'tile current'){
                    e.target.className = 'tile';
                }
            }
            this.obj.onmousedown = function(e){
                var index = e.target.index;
                if(e.button == 1){
                    event.preventDefault();
                }
                _this.changeStyle(e.button,e.target,index);
            }
            this.obj.onmouseup = function(e){
                if(e.button == 1){
                    _this.changeStyle(3,e.target);
                }
            }
        },
        over:function(obj){
            var flag = false;
            var showed = document.getElementsByClassName('showed');
            var num = this.tiles.length - this.mine_num;
            if(showed.length == this.tiles.length - this.mine_num){
                this.detail_statistics(1,true);
                alert('恭喜你获得成功');
                flag = true;
            }else if(obj&&obj.getAttribute('val') == 1){
                this.detail_statistics(1,false);
                alert('被炸死！');
                flag = true;

            }
            return flag;
        },
        last:function(){
            var len = this.tiles.length;
            for(var i = 0;i<len;i++){
                this.tiles[i].className = this.tiles[i].getAttribute('val') == 1?'boom':'showed';
                if(this.tiles[i].className != 'boom'){
                    this.tiles[i].innerHTML = this.tiles[i].getAttribute('value') == 0?'':this.tiles[i].getAttribute('value');
                }
            }
            this.obj.onclick = null;
            this.obj.oncontextmenu = null;
        },
        changeStyle:function(num1,obj,num_index){
            if(num1 == 0){
                if(this.flag){
                    this.store(num_index);
                    this.setMineCraft(this.mine_num,this.arr,num_index);
                    this.flag = false;
                    this.detail_statistics(0,false);
                }                
                if(obj.className != 'tile'&&obj.className !='tile current'){
                    return false;
                }
                if(obj.getAttribute('val') == 0){
                    obj.className = "showed";
                    obj.innerHTML = obj.getAttribute('value') == 0?'':obj.getAttribute('value');
                    this.showAll(obj.index);
                }
                if(this.over(obj)){
                    this.last();
                }
            }
            if(num1 == 2){
                if(obj.className == 'biaoji'){
                    obj.className = 'tile';
                }else if(obj.className !='biaoji'&&obj.className != 'showed'){
                    obj.className = 'biaoji';
                }
            }
            if(num1 == 1){
                if(obj.className =="showed"){
                    this.show_zj1(obj.index);
                }
            }
            if(num1 == 3){
                
                if (obj.className == "showed") {
                    var flag1 = this.show_zj2(obj.index,0);
                }else{
                    this.show_zj2(obj.index,1)
                    return false;
                }

                if(flag1&&this.over()){
                    this.last();
                }
            }
        },
        showValue:function(){
            var count = 0;
            for(var i = 0;i<this.tiles.length;i++){
                this.store(this.tiles[i].index);

                for(var j = 0;j<this.arr.length;j++){
                    if(this.arr[j].getAttribute('val') == 1){
                        count++;
                    }
                }
                this.tiles[i].setAttribute('value',count);
                count = 0;

            }
        },
        //储存周围的位置；；
        store : function(num) {
            var tiles_2d = [];
            var indexs = 0;
            for(var i = 0;i<this.num2;i++){
                tiles_2d.push([]);
                for(var j = 0;j<this.num1;j++){
                    tiles_2d[i].push(this.tiles[indexs]);
                    indexs++;
                } 
            }
            var j = num % this.num1;
            var i = (num - j) / this.num1;
            this.arr = [];
                //左上
            if (i - 1 >= 0 && j - 1 >= 0) {
                this.arr.push(tiles_2d[i - 1][j - 1]);
            }
                //正上
            if (i - 1 >= 0) {
                this.arr.push(tiles_2d[i - 1][j]);
            }
                //右上
            if (i - 1 >= 0 && j + 1 <= this.num1-1) {
                this.arr.push(tiles_2d[i - 1][j + 1]);
            }
                //左边
            if (j - 1 >= 0) {
                this.arr.push(tiles_2d[i][j - 1]);
            }
                //右边
            if (j + 1 <= this.num1-1) {
                this.arr.push(tiles_2d[i][j + 1]);
            }
                //左下
            if (i + 1 <= this.num2-1 && j - 1 >= 0) {
                this.arr.push(tiles_2d[i + 1][j - 1]);
            }
                //正下
            if (i + 1 <= this.num2-1) {
                this.arr.push(tiles_2d[i + 1][j]);
            }
                //右下
            if (i + 1 <= this.num2-1 && j + 1 <= this.num1-1) {
                this.arr.push(tiles_2d[i + 1][j + 1]);
            }
        },
        showAll:function(num){
            if (this.tiles[num].className == "showed" && this.tiles[num].getAttribute("value") == 0){
                this.store(this.tiles[num].index);
                var arr2 = new Array();
                arr2 = this.arr;
                for (var i = 0; i < arr2.length; i++) {
                    if (arr2[i].className != "showed"&&arr2[i].className !='biaoji') {
                        if (arr2[i].getAttribute("value") == 0) {
                            arr2[i].className = "showed";
                            this.showAll(arr2[i].index);
                        } else {
                            arr2[i].className = "showed";
                            arr2[i].innerHTML = arr2[i].getAttribute("value");
                        }
                    }
                }
            }
        },
        show_zj1:function(num){
            this.store(this.tiles[num].index);
            for (var i = 0; i < this.arr.length; i++) {
                if (this.arr[i].className == "tile") {
                    this.arr_2.push(this.arr[i]);
                    // this.arr[i].className = "showed";
                    this.arr[i].className = "test";
                }
            }
        },
        show_zj2:function(num,zt){
            
            var count = 0;
            this.store(this.tiles[num].index);
            
            for(var i = 0,len = this.arr_2.length;i<len;i++){
                this.arr_2[i].className = 'tile';
            }

            this.arr_2.length = 0;
            for(var i = 0;i<this.arr.length;i++){
                this.arr[i].className == 'biaoji'&&count++;
            }
            if(zt == 1){
                return false;
            }
            var numofmines = this.tiles[num].getAttribute("value");
            if(numofmines == count){
                   var arr = new Array(this.arr.length);
                   for(var i = 0;i<this.arr.length;i++){
                       arr[i] = this.arr[i];
                   }
                    for (var i = 0,length = arr.length; i < length; i++) {
                        if (arr[i].className == "tile" && arr[i].getAttribute("val") != 1) {
                            arr[i].className = "showed";
                            arr[i].innerHTML = arr[i].getAttribute("value") == 0?"":arr[i].getAttribute("value");
                            this.showAll(arr[i].index);
                        } else if (arr[i].className == "tile" && arr[i].getAttribute("val") == 1) {
                            this.over(arr[i]);
                            this.last();
                            return false;
                        }
                    }
            }
            return true;
        },
        //已玩游戏，已胜游戏，胜率，最多连胜，最多连败，当前连局；
        detail_statistics:function(num,zt){
            var time_pay = 1;
            var _this = this;
            if(num == 0){
                this.time_dsq = setInterval(function(){
                    $('#time_need').text(time_pay);
                    _this.time_dc =time_pay;
                    time_pay++;
                   
                
                },1000);
        
            }
            else if(num == 1){
                console.log(localStorage.details);
                clearInterval(this.time_dsq);
                if(this.type == 4){return false;}
                if(localStorage.details == undefined){                    
                    localStorage.details = JSON.stringify([[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]);
                }
                if(JSON.parse(localStorage.details) instanceof Array){
                    this.details = JSON.parse(localStorage.details);             
                }
                this.details[this.type][0] += 1;
                if(zt == false){
                    if(this.details[this.type][5]>=0){
                        this.details[this.type][5] = -1;
                    }else{
                        this.details[this.type][5] -= 1;
                    }    
                    if(this.details[this.type][5]<this.details[this.type][4]){
                        this.details[this.type][4] = this.details[this.type][5];
                    }
                    this.details[this.type][2] = this.toPercent(this.details[this.type][1]/this.details[this.type][0]);                
                    localStorage.details = JSON.stringify(this.details);
                    return false;
                }

                if(this.details[this.type][5]>=0){
                    this.details[this.type][5] += 1;
                }else{
                    this.details[this.type][5] = 1;
                }
                if(this.details[this.type][5]>this.details[this.type][3]){
                    this.details[this.type][3] = this.details[this.type][5];
                }
                this.details[this.type][6] = ((this.details[this.type][6]*this.details[this.type][1]+this.time_dc)/(this.details[this.type][1]+1)).toFixed(1); 
                this.details[this.type][1] += 1;
                this.details[this.type][2] = this.toPercent(this.details[this.type][1]/this.details[this.type][0]);
                localStorage.details = JSON.stringify(this.details);
                
                var time1 = new Date();                
                var time_str = time1.getFullYear()+'/'+time1.getMonth()+'/'+time1.getDate()+'  '+time1.getHours()+':'+time1.getMinutes();
                if(localStorage.time == undefined){
                    localStorage.time = JSON.stringify([[],[],[]]);
                }
                if(JSON.parse(localStorage.time) instanceof Array){
                    this.time_arr = JSON.parse(localStorage.time);
                }

                this.time_arr[this.type].push([this.time_dc,time_str]);
                this.time_arr[this.type].sort(function(a,b){
                    return a[0]-b[0];
                });
                if(this.time_arr[this.type].length>5){
                    this.time_arr[this.type].pop();
                }
                localStorage.time = JSON.stringify(this.time_arr);
           
            }
        },
        toPercent:function(point){
            var str=Number(point*100).toFixed(1);
            str+="%";
            return str;
        },
        show_left:function(){

        },
    }
    g.mineCraft = mineCraft;
})

