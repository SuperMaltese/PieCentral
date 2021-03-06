document.addEventListener("DOMContentLoaded", function(event) {
    var canvas=document.getElementById("canvasA");
    var ctx=canvas.getContext("2d");
    var canvas2 = document.getElementById("canvasB");
    var ctx2 = canvas2.getContext("2d");
    var canvas3 = document.getElementById("canvasC");
    var ctx3 = canvas3.getContext("2d");
    var canvas4 = document.getElementById("canvasD");
    var ctx4 = canvas4.getContext("2d");
    var canvas5 = document.getElementById("canvasE");
    var ctx5 = canvas5.getContext("2d");

    var canvas_lst = [canvas, canvas2, canvas3, canvas4, canvas5]
    var contexts = [ctx, ctx2, ctx3, ctx4, ctx5];
    var pct = [0, 0, 0, 0, 0];
    var pct2 = [0, 0, 0, 0, 0];
    var pct3 = [0, 0, 0, 0, 0];
    var grow = [1, 1, 1, 1, 1];
    var grow2 = [1, 1, 1, 1, 1];
    var grow3 = [1, 1, 1, 1, 1];
    var owner = ['n', 'n', 'n', 'n', 'n'];
    // we might need to change these??
    var bidAmounts = [20, 40, 100, 40, 20];

    var dates_inner = [new Date(), new Date(), new Date(), new Date(), new Date()];
    var dates_middle = [new Date(), new Date(), new Date(), new Date(), new Date()];
    var dates_outer = [new Date(), new Date(), new Date(), new Date(), new Date()];
    var date_main = new Date();

    var cw=canvas.width;
    var ch=canvas.height;
    var duration=1;
    var endingPct=100;
    // var increment=duration/pct;
    var match_num = 0;
    var blue_1_num = 0;
    var blue_1_name = "Blue 1";
    var blue_2_num = 0;
    var blue_2_name = "Blue 2";
    var gold_1_num = 0;
    var gold_1_name = "Gold 1";
    var gold_2_num = 0;
    var gold_2_name = "Gold 2";

    var bottom = document.getElementById("bottom_bar");
    var ctx_bottom = bottom.getContext("2d");

    var master_gold_score = 0;
    var master_blue_score = 0;

    var gold_multiplier = 1;
    var blue_multiplier = 1;

    var barGrow = 0 * 60 * 10;
    var barPct = 0;

    function reset() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
        ctx4.clearRect(0, 0, canvas4.width, canvas4.height);
        ctx5.clearRect(0, 0, canvas5.width, canvas5.height);
        ctx_bottom.clearRect(0, 0, bottom.width, bottom.height);

        pct = [0, 0, 0, 0, 0];
        pct2 = [0, 0, 0, 0, 0];
        pct3 = [0, 0, 0, 0, 0];
        grow = [1, 1, 1, 1, 1];
        grow2 = [1, 1, 1, 1, 1];
        grow3 = [1, 1, 1, 1, 1];
        owner = ['n', 'n', 'n', 'n', 'n'];
        // we might need to change these??
        bidAmounts = [20, 40, 100, 40, 20];

        dates_inner = [new Date(), new Date(), new Date(), new Date(), new Date()];
        dates_middle = [new Date(), new Date(), new Date(), new Date(), new Date()];
        dates_outer = [new Date(), new Date(), new Date(), new Date(), new Date()];
        date_main = new Date();

        cw=canvas.width;
        ch=canvas.height;
        duration=1;
        endingPct=100;
        // increment=duration/pct;
        match_num = 0;
        blue_1_num = 0;
        blue_1_name = "Blue 1";
        blue_2_num = 0;
        blue_2_name = "Blue 2";
        gold_1_num = 0;
        gold_1_name = "Gold 1";
        gold_2_num = 0;
        gold_2_name = "Gold 2";

        bottom = document.getElementById("bottom_bar");
        ctx_bottom = bottom.getContext("2d");

        master_gold_score = 0;
        master_blue_score = 0;

        gold_multiplier = 1;
        blue_multiplier = 1;

        barGrow = 0 * 60 * 10;
        barPct = 0;

        resetTimers();
        setTeamsInfo();
        setMatchTime();
        setScores()

        requestAnimationFrame(animate);
    }

    //var socket = io('http://127.0.0.1:5500');
    var socket = io('http://192.168.128.135:5500');
    reset();

    socket.on('teams', function(data) {
        //console.log('teams')
        reset();
        parsed_data = JSON.parse(data);
        match_num = parsed_data.match_num;
        blue_1_num = parsed_data.b1num;
        blue_1_name = parsed_data.b1name;

        blue_2_num = parsed_data.b2num;
        blue_2_name = parsed_data.b2name;

        gold_1_num =  parsed_data.g1num;
        gold_1_name = parsed_data.g1name;

        gold_2_num = parsed_data.g2num;
        gold_2_name = parsed_data.g2name;

        master_blue_score = 0;
        master_gold_score = 0;
        gold_multiplier = 1;
        blue_multiplier = 1;
        setScores()
    });


    socket.on('reset_timers', function(data) {
        //reset ALL the timers;
        resetTimers()
    });

    function resetTimers() {
        for (var i = 0; i < 5; i++) {
            pct[i] = 0;
            pct2[i] = 0;
            pct3[i] = 0;
            grow[i] = 0;
            grow2[i] = 0;
            grow3[i] = 0;
        }
        barGrow = 0;
        barPct = 0;
        dates_inner = [new Date(), new Date(), new Date(), new Date(), new Date()];
        dates_middle = [new Date(), new Date(), new Date(), new Date(), new Date()];
        dates_outer = [new Date(), new Date(), new Date(), new Date(), new Date()];
        date_main = new Date();
    }

    socket.on('score', function(data) {
        //console.log('score')
        parsed_data = JSON.parse(data);
        var alliance = parsed_data.alliance;
        var score = parsed_data.score;
        if(alliance == "gold"){
          master_gold_score = score;
        }
        if(alliance == "blue"){
          master_blue_score = score;
        }
        setScores()
    });

    socket.on('alliance_multiplier', function(data) {
        //console.log('multiplier')
        parsed_data = JSON.parse(data);
        var alliance = parsed_data.alliance;
        var multiplier = parsed_data.multiplier;
        if(alliance == "gold"){
          gold_multiplier = multiplier;
        }
        if(alliance == "blue"){
          blue_multiplier = multiplier;
        }
        setScores();
    });

    socket.on('bid_win', function(data) {
        //console.log('bid_win')
        parsed_data = JSON.parse(data);
        var alliance = parsed_data.alliance;
        var goal = goalNumFromName(parsed_data.goal);
        var newOwner = 'n';
        if(alliance == "gold"){
          newOwner = 'g';
        }
        if(alliance == "blue"){
          newOwner = 'b';
        }
        owner[goal] = newOwner;
    });

    socket.on('bid_amount', function(data) {
        //console.log('bid_amount')
        parsed_data = JSON.parse(data);
        var alliance = parsed_data.alliance;
        var goal = goalNumFromName(parsed_data.goal);
        var bid = parsed_data.bid;
        bidAmounts[goal] = bid;
        var o = 'n';
        if(alliance == "gold"){
            o = 'g';
        }
        if(alliance == "blue"){
            o = 'b';
        }
        owner[goal] = o;
    });

    socket.on('bid_timer_start', function(data) {
        //console.log('bid_start')
        parsed_data = JSON.parse(data);
        var goal_num = goalNumFromName(parsed_data.goal);
        pct3[goal_num] = 0;
        dates_inner[goal_num] = new Date();
        grow3[goal_num] = parsed_data.time * 10;
    });

    socket.on('bid_timer', function(data) {
        //console.log('bid_time_increase')
        parsed_data = JSON.parse(data);
        var goal_num = goalNumFromName(parsed_data.goal);
        grow3[goal_num] += parsed_data.time * 10;
        //console.log(parsed_data.time)
    });

    socket.on('stage_timer_start', function(data) {
        //console.log('stage_time')
        parsed_data = JSON.parse(data);
        barGrow = parsed_data.time * 10;
        barPct = 0;
        date_main = new Date();
        //console.log(parsed_data.time)
        setMatchTime();
    });

    socket.on('powerups', function(data) {
        var parsed_data = JSON.parse(data);
        var goal = goalNumFromName(parsed_data.goal)
        var alliance = parsed_data.alliance
        var powerup = parsed_data.powerup
        if (powerup == "zero_x") {
            dates_middle[goal] = new Date();
            pct2[goal] = 0
            grow2[goal] = 300
        } else if (powerup == "two_x") {
            dates_outer[goal] = new Date();
            pct[goal] = 0
            grow[goal] = 300
        } else if (powerup == "steal") {
            if (alliance == "blue") {
                owner[goal] = "b"
            } else if (alliance == "gold") {
                owner[goal] = "g"
            }
        }
   
    });

    function goalNumFromName(goal_name) {
        var names = ["a", "b", "c", "d", "e"];
        return names.indexOf(goal_name.toLowerCase());
    }

    function setScores() {
        var mult = 120
        var width = bottom.width;
        var height = bottom.height
        setTeamsInfo();
        ctx_bottom.fillStyle = "white";
        ctx_bottom.font = "50px Helvetica";
        ctx_bottom.textAlign = "center"
        ctx_bottom.fillText(master_blue_score.toString(), 535, 95)
        ctx_bottom.fillText(master_gold_score.toString(), width - 535, 95)

        ctx_bottom.font = "40px Helvetica";
        ctx_bottom.fillStyle = "navy";
        ctx_bottom.beginPath();
        ctx_bottom.fillRect(0, 0, mult, 160);
        ctx_bottom.fillStyle = "goldenrod";
        ctx_bottom.beginPath();
        ctx_bottom.fillRect(width - mult, 0, mult, 160);
        ctx_bottom.fillStyle = "white";

        ctx_bottom.textAlign = "center";
        ctx_bottom.fillText(blue_multiplier.toString(), mult/2, 120);
        ctx_bottom.font = "20px Helvetica";
        ctx_bottom.fillText('Multiplier', mult/2,60);

        ctx_bottom.fillText('Multiplier', width - mult/2, 60);
        ctx_bottom.font = "40px Helvetica";
        ctx_bottom.fillText(gold_multiplier.toString(), width - mult/2, 120);
    }

    function setTeamsInfo() {
        var mult = 120
        width = bottom.width;
        ctx_bottom.clearRect(0, 0, bottom.width, bottom.height);
        ctx_bottom.font = "35px Helvetica";

        ctx_bottom.fillStyle = "navy";
        ctx_bottom.beginPath();
        ctx_bottom.fillRect(mult + 10, 0, 320, 160);
        ctx_bottom.fillRect(mult + 350, 0, 130, 160);

        ctx_bottom.beginPath();
        ctx_bottom.fillStyle = "goldenrod";
        ctx_bottom.fillRect(width - mult - 320 - 10, 0, 320, 160);
        ctx_bottom.fillRect(width - mult - 130 - 350, 0, 130, 160);

        ctx_bottom.fillStyle = "white";
        ctx_bottom.textAlign = "left";

        ctx_bottom.fillText(blue_1_num.toString(), mult + 30, 60);
        ctx_bottom.fillText(blue_1_name, mult + 90, 60)

        ctx_bottom.fillText(blue_2_num.toString(), mult + 30, 120);
        ctx_bottom.fillText(blue_2_name, mult + 90, 120)

        ctx_bottom.textAlign = "right";

        ctx_bottom.fillText(gold_1_num.toString(), width- mult - 30, 60);
        ctx_bottom.fillText(gold_1_name, width - mult - 90, 60)

        ctx_bottom.fillText(gold_2_num.toString(), width- mult - 30, 120);
        ctx_bottom.fillText(gold_2_name, width - mult - 90, 120)

        setMatchTime();
    }

    function animate(){
        date = new Date();
        for(var i = 0; i < 5; i++){
          if (grow[i] > 0) {
              pct[i] = (date - dates_outer[i])/grow[i];
          }
          if (grow2[i] > 0) {
              pct2[i] = (date - dates_middle[i])/grow2[i];
          }
          if (grow3[i] > 0) {
              pct3[i] = (date - dates_inner[i])/grow3[i];
          }
        }
        for(var i = 0; i < 5; i++){
            draw(i);
        }
        barPct = (date - date_main)/barGrow;
        drawBar(ctx_bottom, barPct)
        setMatchTime();
        requestAnimationFrame(animate);
    }

    function setMatchTime() {
        ctx_bottom.fillStyle='white';
        ctx_bottom.fillRect(bottom.width/2-100,0,200,150);
        ctx_bottom.fill();

        ctx_bottom.beginPath();
        ctx_bottom.fillStyle = "black";
        ctx_bottom.textAlign = "center";
        date = new Date();
        maintime = Math.ceil((barGrow/10)-(date/1000 - date_main/1000));
        var time_string = Math.floor(maintime / 60).toString() + " : ";
        if (Math.ceil(maintime) % 60 < 10) {
            time_string += "0";
        }
        time_string += (Math.ceil(maintime) % 60).toString();
        if(maintime<0){
          time_string = "0 : 00";
        }
        if(maintime<10){
          ctx_bottom.fillStyle = "red";
        }
        //console.log(time_string)
        ctx_bottom.font = "60px Helvetica";
        ctx_bottom.fillText(time_string,bottom.width/2, 75);
        ctx_bottom.fillStyle = "black";
        ctx_bottom.font = "40px Helvetica";
        ctx_bottom.fillText("Match " + match_num.toString(), bottom.width/2, 125);
    }

    function start(time){
        dates_inner = [new Date(), new Date(), new Date(), new Date(), new Date()];
        dates_middle = [new Date(), new Date(), new Date(), new Date(), new Date()];
        dates_outer = [new Date(), new Date(), new Date(), new Date(), new Date()];
        date_main = new Date();

        requestAnimationFrame(animate);
    };

    function drawBar(ctx, pct){
        ctx.beginPath();
        ctx.fillStyle='white';
        var width = bottom.width
        var height = bottom.height

        ctx.fillRect(0,height-120,width,20);

        ctx.beginPath();
        ctx.fillStyle='green';
        if(pct>5/6*100){
            ctx.fillStyle='orange';
        }
        var length = (width) - (width*pct/100);
        if(length<0){
          length = 0;
        }
        ctx.fillRect(0,height-120,length,20);
    }

    function draw(i) {
        var ctx = contexts[i];
        var alliance = owner[i];
        var name = ["A","B","C","D","E"][i];
        var bidValue = bidAmounts[i];
        var color;
        var width = canvas_lst[i].width;
        var height = canvas_lst[i].height;

        if(alliance == 'b'){
          color = 'navy'
        }
        if(alliance == 'g'){
          color = 'goldenrod'
        }
        var endRadians = -Math.PI/2 + Math.PI*2*pct[i]/100;
        var endRadians2 = -Math.PI/2 + Math.PI*2*pct2[i]/100;
        var endRadians3 = -Math.PI/2 + Math.PI*2*pct3[i]/100;
        ctx.fillStyle='white';
        ctx.fillRect(0,0,cw,ch);

        ctx.beginPath();
        ctx.arc(width/2, height/2 - 10, 80, 0, 2*Math.PI, false);
        ctx.moveTo(width/2,height/2);
        ctx.strokeStyle='black';
        ctx.lineWidth = 2;
        ctx.stroke();

        // outer arc
        if (pct[i] <= 100) {
            ctx.beginPath();
            ctx.arc(width/2,height/2 - 10,125,-Math.PI/2,endRadians, true);
            ctx.moveTo(width/2,height/2);
            ctx.strokeStyle='#004E8A';
            ctx.lineWidth = 15;
            ctx.stroke();
        }
        // inner arc
        if (pct2[i] <= 100) {
            ctx.beginPath();
            ctx.arc(width/2, height/2 - 10, 100, -Math.PI / 2, endRadians2, true);
            ctx.moveTo(width/2, height/2);
            ctx.strokeStyle = '#99000F';
            ctx.lineWidth = 15;
            ctx.stroke();
        }
        // inner circle
        ctx.beginPath();
        ctx.arc(width/2, height/2 - 10, 80, -Math.PI / 2, endRadians3, false);
        ctx.lineTo(width/2, height/2);
        ctx.fillStyle = color;
        ctx.fill();
        //text

        var offset = 10
        if (bidValue > 0) {
            offset = 43/4 - 30
        }

        ctx.beginPath();
        ctx.font = "60px Helvetica";
        ctx.textAlign = "center";
        ctx.strokeStyle="black";
        ctx.lineWidth = 5;
        ctx.strokeText(name, width/2, height/2 + offset);
        ctx.beginPath();

        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(name, width/2, height/2 + offset);
        //bid values
        if (bidValue > 0) {
            ctx.beginPath();
            ctx.font = "40px Helvetica";
            ctx.textAlign = "center";
            ctx.strokeStyle="black";
            ctx.lineWidth = 4;
            ctx.strokeText(Math.round(bidValue,2), width/2, height/2 + 43 / 4 + 20);
            ctx.beginPath();
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
            ctx.fillText(Math.round(bidValue,2), width/2, height/2 + 43 / 4 + 20);
        }
    }

    function addTime() {
        for(var i = 0; i < 5; i++){
            grow[i] += parseFloat(document.forms["addTime"].elements[0].value.split(" ")[i])*10;
            grow2[i] += parseFloat(document.forms["addTime"].elements[1].value.split(" ")[i])*10;
            grow3[i] += parseFloat(document.forms["addTime"].elements[2].value.split(" ")[i])*10;
        }
        ctx.clearRect(0, 0, cw, ch);
        ctx.beginPath();
    }
});
