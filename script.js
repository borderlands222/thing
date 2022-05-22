// function audioPlayer(){
//     var currentSong = 0;
//     $("#audioPlayer")[0].src = $("#playlist li a")[0];
//     $("#audioPlayer")[0].play();
//     $("#playlist li a").click(function(e){
//        e.preventDefault(); 
//        $("#audioPlayer")[0].src = this;
//        $("#audioPlayer")[0].play();
//        $("#playlist li").removeClass("current-song");
//         currentSong = $(this).parent().index();
//         $(this).parent().addClass("current-song");
//     });
    
//     $("#audioPlayer")[0].addEventListener("ended", function(){
//        currentSong++;
//         if(currentSong == $("#playlist li a").length)
//             currentSong = 0;
//         $("#playlist li").removeClass("current-song");
//         $("#playlist li:eq("+currentSong+")").addClass("current-song");
//         $("#audioPlayer")[0].src = $("#playlist li a")[currentSong].href;
//         $("#audioPlayer")[0].play();
//     });
// }


class AudioPlaylist{

    setTrack(arrayPos){

        var liPos = this.trackOrder[arrayPos];
        this.player.src = $('#'+this.playlistId+ " li a").eq(liPos).attr("href");
        $("."+this.currentClass).removeClass(this.currentClass);
        $("#"+this.playlistId+ " li").eq(liPos).addClass(this.currentClass);
        this.trackPos = arrayPos;

    }

    randomizeOrder(){

    }

    prevTrack(){

        if(this.trackPos == 0)
            this.setTrack(0);
        else
            this.setTrack(this.trackPos - 1);
        this.player.play()

    }

    nextTrack(){
        if(this.trackPos < this.length - 1)
            this.setTrack(this.trackPos+1);
        else{
            if(this.shuffle)
                this.randomizeOrder();
            this.setTrack(0);
        }
        this.player.play();
    }

    setLoop(val){

        if(val === true)
            this.loop = true;
        else
            this.loop = false;
        return this.loop;

    }

    setShuffle(val){
        if(val == this.shuffle)
            return val;
        else{
            if(val == true){
                this.randomizeOrder()
                this.shuffle = true;
            }
            else{
                this.shuffle = false;

                this.trackOrder = [];
                for(var i = 0; i < this.length; i++){
                    this.trackOrder.push(i);
                }

                this.trackPos = this.trackOrder.indexOf($("."+this.currentClass).index());
            }
            return this.shuffle;
        }
    }
    toggleShuffle(){
        if(this.shuffle === true)
            this.setShuffle(false);
        else
            this.setShuffle(true);
        return this.shuffle;
    }

    toggleLoop(){

        if(this.loop === true)
            this.setLoop(false);
        else
            this.setLoop(true);
        return this.loop;
    }




    constructor(config = {}){

        var classObj = this;
        this.shuffle = (config.shuffle === true) ? true : false;
        this.playerId = (config.playerId) ? config.playerId : "audioPlayer";
        this.playlistId = (config.playlistId) ? config.playlistId : "playlist";
        this.currentClass = (config.currentClass) ? config.currentClass : "current-song"
        this.length = $("#"+this.playlistId+" li").length;
        this.player = $('#'+this.playerId)[0];
        this.autoplay = (config.autoplay === true || this.player.autoplay) ? true : false;
        this.loop = (config.loop === true) ? true : false;
        this.trackPos = 0;
        this.trackOrder = [];
        for (var i = 0; i < this.length; i++){
            this.trackOrder.push(i);
        }

        if(this.shuffle)
            this.randomizeOrder();

        this.setTrack(this.trackPos);
        if(this.autoplay)
            this.player.play();

        $("#"+this.playlistId+" li a").click(function(e){
            e.preventDefault();
            classObj.setTrack(classObj.trackOrder.indexOf($(this).parent().index()));
            classObj.player.play();
        });

        this.player.addEventListener("ended", function(){

            if(classObj.trackPos < classObj.length - 1){
                classObj.setTrack(classObj.trackPos+1);
                classObj.player.play();
            }
        });
    }
}

