window.onload = function () {
    var gameStart = document.getElementsByClassName('game-start')[0],
        lattices = document.getElementsByClassName('lattices')[0],
        scoreCurrent = document.getElementsByClassName('score-current')[0];
        scoreBest = document.getElementsByClassName('score-best')[0],
        gameEnd = document.getElementsByClassName('game-end')[0],
        // 最高得分
        numBest = 0;

    // 创建方块
    function creatBlock() {
        // 创建Div,为一行，拥有四个小方块iDiv
        var Div = document.createElement('div');
        for (var i = 0; i < 4; i++) {
            var iDiv = document.createElement('div')
            iDiv.style.width = "100px";
            iDiv.style.height = "150px";
            iDiv.className = "left";
            Div.appendChild(iDiv);
        }
        Div.className = "clearfix";

        // 判断lattices是否有子元素
        if (lattices.children.length == 0) {
            // 若无，则直接插入Div
            lattices.appendChild(Div);
        } else {
            // 若有，则在其前面插入
            lattices.insertBefore(Div, lattices.children[0]);
        }

        // 生成随机数，设置随机黑块
        var rand = Math.floor(Math.random() * 4);
        Div.children[rand].style.backgroundColor = "#000";
        Div.children[rand].className += " rand";
    }

    // 游戏开始函数
    function GStart(obj) {
        //默认速度与初始分数
        var speed = 5,
            num = 0;
        //定义一个定时器 每隔20ms调用一次
        obj.timer = setInterval(function () {
            //速度,速度等于obj对象的top加上speed
            var step = parseInt(getComputedStyle(obj, null)['top']) + speed;
            // obj的top等于step
            obj.style.top = step + 'px';
            // 如果对象的top大于0 将创建一个div对象并将对象放到latticse中去
            if (parseInt(getComputedStyle(obj, null)['top']) >= 0) {
                creatBlock();
                obj.style.top = -150 + 'px';

                // 当未点击到的黑色盒子达到4个时，游戏结束
                var count = 0;
                for (var i = 0; i < obj.children.length; i++) {
                    for (var j = 0; j < 4; j++) {
                        // 注意这里类名，不能是等于部分
                        if (obj.children[i].children[j].className == 'left rand') {
                            count++;
                        }
                    }
                }
                if (count == 9) {
                    //游戏结束
                    scoreCurrent.innerHTML = '当前得分: ' + num;
                    if (num >= numBest) {
                        numBest = num;
                    }
                    scoreBest.innerHTML = '最高得分: ' + numBest;
                    //显示结束游戏
                    gameEnd.style.display = "block";
                    //显示开始游戏
                    gameStart.style.display = "block";
                    gameStart.innerHTML = '重新开始';
                    //关闭定时器
                    clearInterval(obj.timer);
                }
            }

            //点击与计分
            obj.onmousedown = function (event) {
                //点击的是黑盒子
                if (event.target.className == 'left rand') {
                    //点击后的盒子颜色
                    event.target.style.backgroundColor = "#bbb";
                    //清除盒子标记
                    event.target.className += ' ';
                    //计分
                    num++;
                    //显示得分
                    scoreCurrent.innerHTML = '当前得分: ' + num;
                }
                else {
                    // 点击到了白盒子
                    //游戏结束
                    scoreCurrent.innerHTML = '当前得分: ' + num;
                    if (num >= numBest) {
                        console.log("点击空白：true");
                        numBest = num;
                    }
                    console.log("点击空白：" + numBest);
                    scoreBest.innerHTML = '最高得分: ' + numBest;
                    //显示结束游戏
                    gameEnd.style.display = "block";
                    //显示开始游戏
                    gameStart.style.display = "block";
                    gameStart.innerHTML = '重新开始';
                    //关闭定时器
                    clearInterval(obj.timer);
                }
                //盒子加速
                if (num % 10 == 0) {
                    speed++;
                }
            }
            //松开触发停止
            obj.onmouseup = function (event) {
            }

        }, 20);
    }

    // 开始游戏按钮的点击事件
    gameStart.onclick = function () {
        gameStart.style.display = "none";
        scoreCurrent.innerHTML = '当前得分: 0';
        lattices.innerHTML = "";
        gameEnd.style.display = "none";
        GStart(lattices);
    };

}