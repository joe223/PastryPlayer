"use strict"
/**
 * @ignore =====================================================
 * @fileoverview easy-player
 * @author       joe
 * @version      0.1.0
 * @ignore =====================================================
 */

/**
 * 定义进度条父类,播放进度控制条由此扩展
 * @param <Object> EasyPlayerVideo
 * @return none
 */
var ProgressDragBtn = function(VIDEO) {
    if(!(VIDEO && VIDEO.player)){ return false;}
    this.progressBar = VIDEO.player.getElementsByClassName('progress-bar')[0];
    this.progressUsed = this.progressBar.getElementsByClassName("progressUsed")[0];      // 已使用指示栏
    this.dragBtn = this.progressBar.getElementsByClassName( "progressDragBtn")[0];      // 拖动按钮
    this.currentProgress = 0;   // 进度 像素值
    this.progressPercent = 0;   // 进度 百分比
    this.parWidth = 0;          // 进度条初始宽度
    this.VIDEO = VIDEO;         // 被控制的视频组件
    this.init();
}
ProgressDragBtn.prototype = {
    /**
     * 初始化方法
     * @param none
     * @return none
     */
    init: function() {
        // TODO:补充初始化方法及事件响应
    },

    /**
     * 获取当前进度，根据像素
     * @param none
     * @return <number> (1,--)
     */
    getProgress:function() {
        return this.currentProgress;
    },

    /**
    * 获取当前进度,百分比
    * @param none
    * @return <number> [0,1]
    */
    getProgressPercent:function() {
        return this.progressPercent;
    },

    /**
     * 根据 像素宽度 或者 百分比 设置进度
     * @param <number>
     * @return none
     */
    setProgress:function(p) {
        if(!isNaN(p) && p >= 0) {
            if(p <= 1) { // 百分比
                this.currentProgress = p * this.parWidth;
                this.progressPercent = parseFloat(p.toFixed(2));
            }else{      // 像素宽度
                p = p > this.parWidth ? this.parWidth : p;
                this.currentProgress = p;
                this.progressPercent = parseFloat((p / this.parWidth).toFixed(2));
            }
            this.progressUsed.style.width = this.currentProgress;
            if(this.dragBtn.getAttribute("style")) {
                this.dragBtn.style.transform = "translate3d(" + this.currentProgress + "px,0,0)"; // 不能在属性里加入分号
            }else{
                this.dragBtn.setAttribute("style","transform:translate3d(" + this.currentProgress + "px,0,0);");
            }
            this.progressUsed.style.width = this.currentProgress + 6 + "px";
        }else{
            console.error("设置进度时请输入数值(>0)");
        }
    },
}
/**
 * 播放进度条组件构造函数
 * @param    none
 * @return   none
 */
// var VideoProgressDragBtn = pdb;
function VideoProgressDragBtn(){
    ProgressDragBtn.call(this);
}
VideoProgressDragBtn.prototype.init = function() {
    var _this_ = this;
    var parent = this.progressBar;          // 进度条拖动按钮
    var used = this.progressUsed;
    var width = this.dragBtn.offsetWidth;   // 按钮宽度
    this.parWidth = this.progressBar.offsetWidth - width;
    this.dragBtn.onmousedown = function (event) {
        var e = event || window.event;
        var target = e.target || e.srcElement;
        var initX = e.pageX;
        var _this = this;
        if(target.getAttribute("style")) {
            var initleft = parseInt(target.getAttribute("style").split(";")[0].split("(")[1].split("px")[0]);
        }else{
            var initleft = target.offsetLeft;
        }

        // 鼠标按下移动时拖动按钮位移
        document.onmousemove = function(event) {
            var e = event || window.event;
            var target = e.target || e.srcElement;
            var moveX = e.pageX - initX;
            var left = initleft + moveX;
            left = left < 0 ? 0 : left;
            left = left > _this_.parWidth ? _this_.parWidth : left;
            used.style.width = left + 6 + "px";
            _this.style.transform = "translate3d(" + left + "px,0,0)";
            // parent.setAttribute("data-progress" , left / _this_.parWidth);
        };

        // 鼠标松开时销毁事件监听
        document.onmouseup = function() {
            var currentProgress;
            if(_this_.dragBtn.getAttribute("style")) {
                currentProgress = parseInt(_this_.dragBtn.getAttribute("style").split(";")[0].split("(")[1].split("px")[0]);
            }else{
                currentProgress = _this_.dragBtn.offsetLeft;
            }
            // 设置当前进度 百分比 及 像素宽度
            _this_.currentProgress = currentProgress;
            _this_.progressPercent = parseFloat((_this_.currentProgress / _this_.parWidth ).toFixed(2))
            // 设置播放进度
            _this_.VIDEO.setProgress(_this_.getProgressPercent());
            // 清除事件监听
            document.onmousemove = null;
            document.onmouseup = null;
        };
        return false;
    }
}

/**
 * 音量控制原型
 *
 * @param <string> <Element>
 * @returns none
 */
 var VolumeProgressDragBtn = function(VIDEO) {
    //  VIDEO.player 整个视频控件 Element
    this.progressBar = VIDEO.player.getElementsByClassName('volume-bar')[0]; // progressBar
    this.progressUsed = this.progressBar.getElementsByClassName("progressUsed")[0];      // 已使用指示栏
    this.dragBtn = this.progressBar.getElementsByClassName( "progressDragBtn")[0];      // 拖动按钮
    this.currentProgress = 0;   // 进度 像素值
    this.progressPercent = 0;   // 进度 百分比
    this.parWidth = 0;          // 进度条初始宽度
    this.VIDEO = VIDEO;         // 需要被控制的视频组件
    // ProgressDragBtn.call(this);
    this.volumeBtn = VIDEO.player.querySelector(".easy-volume-controller > button");
    this.init();
 }

 VolumeProgressDragBtn.prototype = {
     /**
      * 初始化方法
      * @param none
      * @return none
      */
     init: function() {
         // TODO:补充初始化方法及事件响应
     },

     /**
      * 获取当前进度，根据像素
      * @param none
      * @return <number> (1,--)
      */
     getProgress:function() {
         return this.currentProgress;
     },

     /**
     * 获取当前进度,百分比
     * @param none
     * @return <number> [0,1]
     */
     getProgressPercent:function() {
         return this.progressPercent;
     },

     /**
      * 根据 像素宽度 或者 百分比 设置音量条进度
      * @param <number>
      * @return none
      */
     setProgress:function(p) {
         if(!isNaN(p) && p >= 0) {
             console.log("before:"+p);

             if(p <= 1) { // 百分比
                 this.currentProgress = p * this.parWidth;
                 this.progressPercent = parseFloat(p.toFixed(2));
             }else{      // 像素宽度
                //  p = p > this.parWidth ? this.parWidth : p;
                //  this.currentProgress = p;
                 this.currentProgress = this.parWidth;
                //  this.progressPercent = parseFloat((p / this.parWidth).toFixed(2));
                 this.progressPercent = 1;
             }
             this.VIDEO.setVolume(p);
             console.log(p);
             this.progressUsed.style.width = this.currentProgress;
             if(this.dragBtn.getAttribute("style")) {
                 this.dragBtn.style.transform = "translate3d(" + this.currentProgress + "px,0,0)"; // 不能在属性里加入分号
                 // this.dragBtn.style.transform = "translate3d(" + this.currentProgress + "px,0,0)";
             }else{
                 this.dragBtn.setAttribute("style","transform:translate3d(" + this.currentProgress + "px,0,0);");
             }

             // 设置音量图标
             var currentVolume = this.getProgressPercent(); // 当前音量 [0,1]
             if (currentVolume === 0) {
                 this.volumeBtn.getElementsByTagName("i")[0].setAttribute("class","fa     fa-volume-off")
             }else if (currentVolume < 0.5) {
                 this.volumeBtn.getElementsByTagName("i")[0].setAttribute("class","fa     fa-volume-down")

             }else {
                 this.volumeBtn.getElementsByTagName("i")[0].setAttribute("class","fa     fa-volume-up")
             }

             this.progressUsed.style.width = this.currentProgress + 6 + "px";
         }else{
            //  console.error("设置进度时请输入数值(>=0)");
            this.VIDEO.setVolume(0);
         }
     },
 }
/**
 * 重新定义 音量控制条 init 方法
 *
 * @param none
 * @returns none
 */
 VolumeProgressDragBtn.prototype.init = function() {
     var _this_ = this;
     // 进度条拖动按钮
     var parent = this.progressBar;
     var used = this.progressUsed;
     var width = this.dragBtn.offsetWidth; // 按钮宽度
     this.parWidth = this.progressBar.offsetWidth - width;

     this.dragBtn.onmousedown = function (event) {
         var e = event || window.event;
         var target = e.target || e.srcElement;
         var initX = e.pageX;
         var _this = this;
         if(target.getAttribute("style")) {
             var initleft = parseInt(target.getAttribute("style").split(";")[0].split("(")[1].split("px")[0]);
         }else{
             var initleft = target.offsetLeft;
         }

         // 鼠标按下移动时拖动按钮位移
         document.onmousemove = function(e) {
             e = e || window.event;
             var target = e.target || e.srcElement;
             var moveX = e.pageX - initX;
             var left = initleft + moveX;
             left = left < 0 ? 0 : left;
             left = left > _this_.parWidth ? _this_.parWidth : left;
            //  left += 10;
             used.style.width = left + 6 + "px";
             _this.style.transform = "translate3d(" + left + "px,0,0)";
             // parent.setAttribute("data-progress" , left / _this_.parWidth);

         };

         // 鼠标松开时销毁事件监听
         document.onmouseup = function() {
             var currentProgress;
             if(_this_.dragBtn.getAttribute("style")) {
                 currentProgress = parseInt(_this_.dragBtn.getAttribute("style").split(";")[0].split("(")[1].split("px")[0]);
             }else{
                 currentProgress = _this_.dragBtn.offsetLeft;
             }
             // 设置当前进度 百分比 及 像素宽度
             _this_.currentProgress = currentProgress;
             _this_.progressPercent = parseFloat((_this_.currentProgress / _this_.parWidth ).toFixed(2))
             // 设置播放音量
             _this_.VIDEO.setVolume(_this_.getProgressPercent());

             // 设置音量图标
             var currentVolume = _this_.getProgressPercent(); // 当前音量 [0,1]
             if (currentVolume === 0) {
                 _this_.volumeBtn.getElementsByTagName("i")[0].setAttribute("class","fa     fa-volume-off")
             }else if (currentVolume < 0.5) {
                 _this_.volumeBtn.getElementsByTagName("i")[0].setAttribute("class","fa     fa-volume-down")

             }else {
                 _this_.volumeBtn.getElementsByTagName("i")[0].setAttribute("class","fa     fa-volume-up")
             }
             // 清除事件监听
             document.onmousemove = null;
             document.onmouseup = null;
         };
         return false;
     }
 }

/**
 * 视频播放控制组件
 * @param   none
 * @return  none
 */
var EasyPlayerVideo = function (config) {
    this.player = document.getElementById(config.playerId); // 整个视频控件元素
    this.video = this.player.getElementsByClassName("ep-video")[0];
    this.bufferbar = this.player.getElementsByClassName("progressBarBuffered")[0];
    // this.bufferedColor = "#ff0000";
    this.progress = null;
    this.volume = null;
    this.init();
}

EasyPlayerVideo.prototype = {
    /**
     * 初始化方法
     */
    init:function() {
        var _this = this;
        var ctx = _this.bufferbar.getContext('2d');
        // 必须在 html 标签里指明 width 或者 height
        var width = _this.bufferbar.offsetWidth;
        var height = _this.bufferbar.offsetHeight;
        _this.bufferbar.width  = width;
        _this.bufferbar.height  = height;
        _this.video.addEventListener("seeked",function() {
            t();
        });
        var interval = window.setInterval(t,1000);
        // 临时方法，重绘缓冲进度条
        function t() {
            if(_this.video.buffered.length == 1 && _this.video.buffered.end(_this.video.buffered.length - 1) == _this.video.duration && _this.video.buffered.start(0) == 0) {
                _this.drawBuffered(_this);
                window.clearInterval(interval);
                console.log("视频缓冲完成！");
            }else {
                _this.drawBuffered(_this);
            }
        }
    },

    /**
     * 设置视频链接方法
     */
    setVideoSrc:function(str) {
        this.video.setAttribute("src",str);
    },

    /**
     * 绘制缓存状态
     * @param <Element> player element
     */
    drawBuffered:function(_this) {
        var ctx = _this.bufferbar.getContext('2d');
        var width = _this.bufferbar.offsetWidth;
        var height = _this.bufferbar.offsetHeight;
        var inc = width / _this.video.duration;

        for( var i = 0; i < _this.video.buffered.length; i++) {
            var startX = _this.video.buffered.start(i) * inc;
            var endX = _this.video.buffered.end(i) * inc;
            width = endX - startX;
            ctx.fillStyle = "#4D5559";
            ctx.fillRect(startX,0,width,6);
            // console.log("startX:"+startX+",width:"+width);
        }
        // console.log("_this.video.buffered.length:"+_this.video.buffered.length);
    },

    /**
     * 视频播放
     */
    play:function() {
        this.video.play();
    },

    /**
     * 视频暂停
     */
    pause:function() {
        this.video.pause();
    },

    /**
     * 视频重新加载
     */
    reload:function() {
        this.video.play();
    },

    /**
     * 视频播放位置设置,传入参数 百分比
     * @param    <number> 大于 0 的小数
     */
    setProgress:function(t) {
        t = t > 1 ? 1 : t;
        t = t < 0 ? 0 : t;
        this.video.currentTime = t * this.video.duration;
    },

    /**
     * 获取视频播放进度
     * @return  <number> 播放进度 百分比
     */
    getProgress:function() {
        return parseFloat((this.video.currentTime / this.video.duration).toFixed(3));
    },

    /**
     * 获取视频已播放时间
     * @return   <number> int 当前播放进度 秒
     */
    getTime:function() {
        return Math.round(this.video.currentTime);
    },

    /**
     * 获取视频总时长
     *
     * @param none
     * @returns <Number> int 秒
     */
    getDuration:function() {
        var duration =  Math.round(this.video.duration); // 返回四舍五入后的时间 /s
        return duration;
    },

    /**
     * 视频音量设置
     * @param <number> [0,1]
     * @returns none
     */
     setVolume: function(v) {
         if(!isNaN(v) && v >= 0) {
             v = v > 1 ? 1 : v;
             this.video.volume = v;
         }else{
             console.error("设置音量时传入了错误的值！");
         }
     },

     /**
      * 获取视频音量
      *
      * @param none
      * @returns <Number> [0,1]
      */
     getVolume: function() {
         return this.video.volume || 1; // 默认最大声音
     },

     /**
      * 获取播放状态
      *
      * @param none
      * @returns <Number> 0 / 1
      */
     getStatus: function() {
         if (this.video.paused) {
             return 0;
         }else {
             return 1;
         }
     },

     /**
      * 设置播放速率
      *
      * @param <String>/<Number>
      * @returns none
      */
     setRate:function(r) {
         var rate = r || 1;
         if(isNaN(rate)) {
             console.error("setRate 方法参数错误!");
             return false;
         }
         if(typeof rate === "String") {
            rate = parseFloat(rate);
         }
         rate = rate < 1 ? 1 : rate;
         rate = rate > 2 ? 2 : rate;
         this.video.playbackRate = rate;
     },
}

/**
 * 视频滤镜　组件
 *
 * @param   none
 * @returns none
 */
var EasyPlayerFilter = function(config, VIDEO, filterName) {
    this.player = document.getElementById(config.playerId);
    this.filter = this.player.getElementsByClassName("ep-screen-filter")[0];
    this.video =
    this.player.getElementsByClassName("ep-video")[0];
    this.filterName = filterName || "filterOriginal";                         // 滤镜方法名
    this.init();
}

EasyPlayerFilter.prototype = {
    init:function() {
        var player = this.player;   // 自定义　player 对象
        // var filter = this.filter;   // 自定义　filter 对象
        var filter = player.querySelector(".easy-player-screen > .ep-screen-scratch");     // 缓冲区
        var scratch = player.querySelector(".easy-player-screen > .ep-screen-filter");   // 播放区
        var width = filter.offsetWidth;
        var height = filter.offsetHeight;
        filter.width = width;
        filter.height = height;
        scratch.width = width;
        scratch.height = height;
        var video = this.video;     // 自定义　video 对象
        var ctx = filter.getContext('2d');
        var ctx2 = scratch.getContext('2d');
        var _this = this;


        this.video.addEventListener("play",function() {
            // 根据参数选择滤镜方法
            var rendors = ['','webkit','moz'];
            // requestAnimationFrame 兼容性处理
            for( var r = 0; r < rendors.length && !window.requestAnimationFrame; r++) {
                if(!window[rendors[r]+"requestAnimationFrame"]) {
                    window.requestAnimationFrame = window[rendors[r]+'requestAnimationFrame'];
                    window.cancelAnimationFrame = window[rendors[r] +"cancelAnimationFrame"] || window[rendors[r] +"cancelRequestAnimationFrame"]; // webkit 上命名不同
                }
            }


            /**
            * 重绘屏幕
            *
            * @param none
            * @returns none
            */
            function refresh() {
                ctx.drawImage( video, 0, 0, width, height);
                if(_this.filterName !== "filterOriginal") {
                    var frame = ctx.getImageData(0,0,width,height); // 缓冲帧,需要被处理
                    // 根据参数选择滤镜方法
                    if(_this.filterName) {
                        frame = _this[_this.filterName](frame);
                    }
                    // frame = _this['filterOriginal'](frame);
                    if(typeof frame.data === "object" || frame.data !== false) {
                        ctx2.putImageData(frame,0,0);
                    }
                    if(video.paused) {
                        cancelAnimationFrame(refresh);
                    }else{
                        requestAnimationFrame(refresh);
                    }
                }else{
                    var frame = ctx.getImageData(0,0,width,height); // 缓冲帧,需要被处理
                    // console.log(width+","+height);
                    var data = frame.data;
                    if(typeof data !== "object" || data.length === 0) {
                        return frame;
                    }
                    var len = data.length / 4;
                    for (var i = 0; i < len; i++) {
                        data[i*4 + 3] = 0;
                    }
                    ctx.putImageData(frame ,0,0);
                    ctx2.putImageData(frame ,0,0);
                }
            }
            requestAnimationFrame(refresh);
        });

    },

    /**
     * 原画滤镜 效果处理方法 0
     *
     * @param <ImageBitmap>     data
     * @returns <ImageBitmap>   data
     */
    filterOriginal:function(frame) {
        return frame;
    },

    /**
     * 反色滤镜 效果处理方法 1
     *
     * @param <ImageBitmap>     data
     * @returns <ImageBitmap>   data
     */
    filterContrary:function(frame) {
        var data = frame.data;
        if(typeof data !== "object" || data.length === 0) {
            return frame;
        }
        var len = data.length / 4;
        for (var i = 0; i < len; i++) {
            data[i*4 ] = 255 - data[i*4];
            data[i*4 + 1] = 255 - data[i*4 + 1];
            data[i*4 + 2] = 255 - data[i*4 + 2];
        }
        return frame;
    },

    /**
     * 雕塑滤镜 效果处理方法 2
     *
     * @param <ImageBitmap> data
     * @returns <ImageBitmap> data
     */
    filterSculpture:function(frame) {
        var data = frame.data;
        var len = data.length / 4;
        var h = frame.height;
        var w = frame.width;
        if(typeof data !== "object" || data.length === 0) {
            return frame;
        }
        // 先进行灰度处理
        for(var i = 0;i < len; i++) {
            var ave = ( data[i*4] + data[i*4 + 1] + data[i*4 + 2] ) / 3;
            data[i*4] = data[i*4 + 1] = data[i*4 + 2] = ave;
        }
        // 浮雕效果
        for(var y = 0; y < h; y++) {
            for(var x = 0;x < w; x++) {
                // 先判断是否存在该像素,及下一点是否存在
                if(data[(x + w*y)*4 + 4]) {
                    var current = (x + w * y) * 4;
                    var next = current + 4;
                    var newData = data[next] - data[current];
                    data[current] = data[current + 1] = data[current + 2] = newData + 128;
                }
            }
        }
        return frame;

    },

    /**
     * 灰度滤镜 效果处理方法 3
     * 加权平均值法
     * @param <ImageBitmap> data
     * @returns <ImageBitmap> data
     */
    filterGrey1:function(frame) {
        var data = frame.data;
        if(typeof data !== "object" || data.length === 0) {
            return frame;
        }
        // 权重 R:30% ,G:59% ,B:11%
        var len = data.length / 4;
        for(var i = 0; i < len; i ++) {
            var newData = ~~(data[i*4] * 0.3 + data[i*4 + 1] * 0.59 + data[i*4 + 2] * 0.11);
            data[i*4] = data[i*4 + 1] = data[i*4 + 2] = newData;
        }
        return frame;
    },

    /**
     * 灰度滤镜 效果处理方法 4
     * 最大值法
     * @param <ImageBitmap> data
     * @returns <ImageBitmap> data
     */
    filterGrey2:function(frame) {
        var data = frame.data;
        if(typeof data !== "object" || data.length === 0) {
            return frame;
        }
        var len = data.length / 4;
        for(var i = 0; i < len; i++) {
            var max = Math.max(data[i*4], data[i*4 + 1], data[i*4 + 2]);
            data[i*4] = data[i*4 + 1] = data[i*4 + 2] = max;
        }
        return frame;
    },

    /**
     * 灰度滤镜 效果处理方法 5
     * 最小值法
     * @param <ImageBitmap> data
     * @returns <ImageBitmap> data
     */
    filterGrey3:function(frame) {
        var data = frame.data;
        if(typeof data !== "object" || data.length === 0) {
            return frame;
        }
        var len = data.length / 4;
        for(var i = 0; i < len; i++) {
            var min = Math.min(data[i*4], data[i*4 + 1], data[i*4 + 2]);
            data[i*4] = data[i*4 + 1] = data[i*4 + 2] = min;
        }
        return frame;
    },

    /**
     * 灰度滤镜 效果处理方法 6
     * 平均值法
     * @param
     * @returns
     */
    filterGrey4:function(frame) {
        var data = frame.data;
        if(typeof data !== "object" || data.length === 0) {
            return frame;
        }
        var len = data.length / 4;frame
        for(var i = 0;i < len; i++) {
            var ave = ( data[i*4] + data[i*4 + 1] + data[i*4 + 2] ) / 3;
            data[i*4] = data[i*4 + 1] = data[i*4 + 2] = ave;
        }
        return frame;
    },
    /**
     * 模糊滤镜 效果处理方法 7
     *
     * @param <ImageBitmap> data
     * @returns <ImageBitmap> data
     */
    filterBlur:function(frame) {
        var data = frame.data;
        if(typeof data !== "object" || data.length === 0) {
          return frame;
        }
        // 调用模糊处理方法
        return this.blur(frame, 5, 1);
     },


    /**
     * 高斯模糊 效果函数
     *
     * @param <ImageBitmap> data
     * @returns <ImageBitmap> data
     */
    blur:function(frame, radius, sigma) {
        var data = frame.data;
        if(typeof data !== "object" || data.length === 0) {
            return frame;
        }
         radius = radius || 5;
         sigma = sigma || radius/3;
         var _a_ = 1 / (sigma * Math.sqrt(2 * Math.PI));
         var _b_ = -1 / (2*sigma*sigma);
         var arr = [];//权重
         var arrSum = 0,
             x, y,
             i, j,
             re,t,
             len,
             r,g,b,a;
         var w = frame.width;
         var h = frame.height;

         function gauss(x) {
             return _a_ * Math.exp(_b_*x*x );
         }
         for(i = -radius; i <= radius; i++) {
             re = gauss(i);
             arr.push(re);
             arrSum += re;
         }
         for(len = 0; len < arr.length; len++) {
             arr[len] /= arrSum;//权重,总和为 1
         }
         //按行进行模糊
         for(y = 0; y < h; y++) {
             for(x = 0; x < w; x++) {
                 r = g = b = a = 0;
                 arrSum = 0;
                 for(j = -radius; j < radius; j++) {
                     t = x + j;
                     if(t >= 0 && t < w) {
                         r += data[(w*y+t)*4] * arr[j+radius];
                         g += data[(w*y+t)*4+1] * arr[j+radius];
                         b += data[(w*y+t)*4+2] * arr[j+radius];
                         arrSum += arr[j+radius];
                     }
                 }
                 i = (w*y+x)*4;
                 data[i  ] = ~~(r/arrSum);
                 // console.log(arrSum);
                 data[i+1] = ~~(g/arrSum);
                 data[i+2] = ~~(b/arrSum);
             }
         }
         //按列进行模糊
         for(x = 0; x < w; x++) {
             for(y = 0; y < h; y++) {
                 r = g = b = a = 0;
                 arrSum = 0;
                 for(j = -radius; j < radius; j++) {
                     t = y+j;
                     if(t >= 0 && t < h) {
                         r += data[(w*t+x)*4] * arr[j+radius];
                         g += data[(w*t+x)*4+1] * arr[j+radius];
                         b += data[(w*t+x)*4+2] * arr[j+radius];
                         arrSum += arr[j+radius];
                     }
                 }
                 i = (w*y+x)*4;
                 data[i  ] = ~~(r/arrSum);
                 data[i+1] = ~~(g/arrSum);
                 data[i+2] = ~~(b/arrSum);
             }
         }
         return frame;
     },
};

/**
 * EasyPlayer 构造器，由 EasyPlayerVideo(视频) 、VolumeProgressDragBtn（进度控制条） 、VideoProgressDragBtn（声音控制条） 组件组成
 *
 * @param <Object> config {"playerId":id,}
 * @returns none
 */
var PastryPlayer = function(config) {
    this.video = new EasyPlayerVideo(config);                           // 视频组件
    this.progressBar = new VideoProgressDragBtn(this.video);            // 进度条组件
    this.timePanelGroup = document.querySelectorAll("#" + config.playerId + " .ep-current-time span");    // 时间信息面板
    this.volumeBar = new VolumeProgressDragBtn(this.video);             // 音量控制组件
    this.filter = new EasyPlayerFilter(config);
    this.playBtn = document.querySelector("#" + config.playerId + " .play-controller button");                          // 播放控制按钮
    this.volumeBtn = document.querySelector("#" + config.playerId + " .easy-volume-controller > button.btn");           // 音量按钮
    this.filterList = document.querySelectorAll("#" + config.playerId + " .ep-set-filter ul.ep-set-options li");        // 滤镜设置列表
    this.rateList = document.querySelectorAll("#" + config.playerId + " .ep-set-rate ul.ep-set-options li");            // 速率设置列表
    this.filterBtn = document.querySelector("#" + config.playerId + " .ep-set-filter button");                          // 滤镜设置按钮
    this.rateBtn = document.querySelector("#" + config.playerId + " .ep-set-rate button");                              // 速率设置按钮
    this.fullScreenBtn = document.querySelector("#" + config.playerId + " .full-screen-controller button");             // 全屏设置按钮
    this.loadingIcon = document.querySelector("#" + config.playerId + " .ep-notice-loading");                         // loading icon
    this.videoDuration = 0;                         // 视频时长
    this.playStatus = false;                        // 播放状态，默认暂停
    this.config = config;                           // 配置项
    this.init();                                    // 初始化方法

}

PastryPlayer.prototype = {
    /**
     * 视频播放器初始化
     *
     * @param none
     * @returns none
     */
    init: function() {
        var _this_ = this;
        var refresh;
        var endTime = "00:00";
        this.checkInitialize(this);
        _this_.loadingIcon.style.display = "block";
        // 播放按钮 事件响应
        this.playBtn.addEventListener("click",function() {
            if(_this_.playStatus) {
                _this_.video.pause();
                _this_.playStatus = false;
            }else{
                _this_.video.play();
                _this_.loadingIcon.style.display = "none";
                _this_.playStatus = true;
            }
        }, false);

        // 声音设置按钮
        this.volumeBtn.addEventListener("click", function() {
            if(_this_.video.video.muted) {
                _this_.video.video.muted = false;
                _this_.volumeBar.setProgress(_this_.video.getVolume());
            }else{
                _this_.video.video.muted = true;
                _this_.volumeBar.setProgress(0);
            }
        }, false);

        // 滤镜设置列表
        // 改变播放效果前先暂停视频
        var filterCount = _this_.filterList.length;
        if(typeof filterCount === "undefined" || filterCount === 0) {
            console.error("获取滤镜设置列表失败!");
        }
        for(var ifilter = 0; ifilter < filterCount; ifilter ++ ) {
            _this_.filterList[ifilter].addEventListener("click", function(event) {
                if(_this_.playStatus === true) {
                    _this_.video.pause();
                }else{
                    _this_.video.play();
                }
                var target = event.target || event.srcElement;
                _this_.filter.filterName = target.getAttribute("data-filter");
                _this_.filterBtn.innerHTML = target.innerHTML;
                if(_this_.playStatus === true) {
                    _this_.video.play();
                }else{
                    _this_.video.pause();
                }
            }, false);
        }

        // 速率设置列表
        var rateCount = _this_.rateList.length;
        if(typeof rateCount === "undefined" || rateCount === 0) {
            console.error("获取速率设置列表失败!");
        }
        for(var irate = 0; irate < filterCount; irate ++ ) {
            _this_.rateList[irate].addEventListener("click", function(event) {
                var target = event.target || event.srcElement;
                _this_.video.setRate(target.getAttribute("data-rate"));
                _this_.rateBtn.innerHTML = target.innerHTML;
            }, false);
        }

        // 全屏处理
        // 改变播放效果前先暂停视频
        this.fullScreenBtn.addEventListener("click",function(event) {
            var target = event.target || event.srcElement;
            var playerElem = document.getElementById(_this_.config.playerId);
            var result = toggleFullScreen(playerElem);
            if(result === "fullScreen") {
                target.querySelector("i").setAttribute("class", "fa fa-compress");
            }else if (result === "cancelFullScreen") {
                target.querySelector("i").setAttribute("class", "fa fa-expand");
            }else{
                console.error("全屏控制异常!");
            }
        },false);

        /**
         * 全屏切换处理 方法
         *
         * @param <Element> player
         * @returns none
         */
        function toggleFullScreen(playerElem) {
            console.log("调用全屏方法");
            if(_this_.playStatus === true) {
                _this_.video.pause();
            }
            if(document.fullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement) { // 检测是否有全屏的元素
                // 取消全屏
                if (document.cancelFullscreen) {
                    document.cancelFullScreen();
                    if(_this_.playStatus === true) {
                        _this_.video.play();
                    }
                    return "cancelFullScreen";
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                    if(_this_.playStatus === true) {
                        _this_.video.play();
                    }
                    return "cancelFullScreen";
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                    if(_this_.playStatus === true) {
                        _this_.video.play();
                    }
                    return "cancelFullScreen";
                }
                _this_.filter = new EasyPlayerFilter(_this_.config);
            }else{
                // 全屏
                if (playerElem.requestFullscreen) {
                    playerElem.requestFullscreen();
                    if(_this_.playStatus === true) {
                        _this_.video.play();
                    }
                    return "fullScreen";
                } else if (playerElem.mozRequestFullScreen) {
                    playerElem.mozRequestFullScreen();
                    if(_this_.playStatus === true) {
                        _this_.video.play();
                    }
                    return "fullScreen";
                } else if (playerElem.webkitRequestFullscreen) {
                    playerElem.webkitRequestFullscreen();
                    if(_this_.playStatus === true) {
                        _this_.video.play();
                    }
                    return "fullScreen";
                }
                _this_.filter = new EasyPlayerFilter(_this_.config);
            }
            return false;
        }

        // 无法取得下个视频页面 / 缓冲中 事件处理
        this.video.video.addEventListener("waiting",function() {
            _this_.loadingIcon.style.display = "block";
        },false);
        // 无法取得下个视频页面 / 缓冲中 事件处理
        this.video.video.addEventListener("stalled",function() {
            _this_.loadingIcon.style.display = "block";
        },false);
        this.video.video.addEventListener("loadeddata",function() {
            _this_.loadingIcon.style.display = "block";
        },false);
        // 视频 可以播放时事件,当前 video.buffered 缓冲到可以播放时触发
        this.video.video.addEventListener("canplay",function() {
            _this_.loadingIcon.style.display = "none";
            _this_.videoDuration = _this_.video.getDuration();
            endTime = ("0" + Math.floor(_this_.videoDuration / 60)).slice(-2) + ":" + ("0" + _this_.videoDuration % 60).slice(-2);      // 设置时间格式 为 00:00
            _this_.timePanelGroup[2].innerHTML = endTime;
            // 初始化 音量调节按钮
            _this_.volumeBar.setProgress(_this_.video.getVolume());
            console.log("<vidoe can play>");

        });

        // 视频 开始播放时 事件处理
        this.video.video.addEventListener("play",function() {

            /**
             * 视频播放进度条刷新方法
             * @param none
             * @returns none
             */
            function refreshProgressBar() {
                var progress = _this_.video.getProgress(); // 当前播放进度
                var currentTime = _this_.video.getTime(); // 当前时间
                currentTime = ("0" + Math.floor(currentTime / 60)).slice(-2) + ":" + ("0" + currentTime % 60).slice(-2); // 转换当前播放时间格式
                _this_.timePanelGroup[0].innerHTML = currentTime;
                _this_.progressBar.setProgress(progress);
            }

            refresh = setInterval(refreshProgressBar, 1000);

            _this_.playStatus = true;     // 修改 播放状态标签
            _this_.playBtn.getElementsByTagName("i")[0].setAttribute("class","fa fa-pause");
        }, false);

        // 视频暂停事件处理
        this.video.video.addEventListener("pause",function() {
            console.log("<video is paused>");
            clearInterval(refresh);
            _this_.playStatus = false;    // 修改 播放状态标签
            _this_.playBtn.getElementsByTagName("i")[0].setAttribute("class","fa fa-play");
        }, false);

        // 键盘按键事件处理
        // 13 -> Enter
        // 32 -> 空格
        // 38 -> up
        // 40 -> down
        // 37 -> left
        // 39 -> right
        document.addEventListener("keydown", function(e) {
            // console.log(e.keyCode);
            var keyCode = e.keyCode;
            // 判断播放器是否存在及是否初始化
            var isControl = false;
            if( document.querySelector( '#'+ _this_.config.playerId ) &&
                _this_.video &&
                _this_.progressBar &&
                _this_.volumeBar &&
                _this_.filter
                ) {
                isControl = true;
            }else{
                _this_.checkInitialize(_this_);
            }
            switch (keyCode) {
                case 13: // 全屏控制
                    var target = _this_.fullScreenBtn;
                    var playerElem = document.getElementById(_this_.config.playerId);
                    var result = toggleFullScreen(playerElem);
                    if(result === "fullScreen") {
                        target.querySelector("i").setAttribute("class", "fa fa-compress")
                    }else if (result === "cancelFullScreen") {
                        target.querySelector("i").setAttribute("class", "fa fa-expand");
                    }else{
                        console.error("全屏控制异常!");
                    }
                    e.preventDefault(); // 阻止默认事件
                    break;

                case 32: // 播放暂停控制
                    if(_this_.video.getStatus() === 0) {
                        _this_.video.play();
                    }else{
                        _this_.video.pause();
                    }
                    e.preventDefault(); // 阻止默认事件
                    break;

                // left 设置进度 快退
                case 37:
                    _this_.progressBar.setProgress(_this_.progressBar.getProgressPercent() - 0.01);
                    _this_.video.setProgress(_this_.progressBar.getProgressPercent());
                    e.preventDefault();
                    break;

                // down 音量减
                case 38:
                    _this_.volumeBar.setProgress(_this_.volumeBar.getProgressPercent() + 0.1)
                    e.preventDefault();
                    break;

                // right 快进
                case 39:
                    _this_.progressBar.setProgress(_this_.progressBar.getProgressPercent() + 0.01);
                    _this_.video.setProgress(_this_.progressBar.getProgressPercent());
                    e.preventDefault();
                    break;

                // up 音量 加
                case 40:
                    _this_.volumeBar.setProgress(_this_.volumeBar.getProgressPercent() - 0.1)
                    e.preventDefault();
                    break;

                default:
                    break;

            }
        }, false);

    },

    /**
     * 检查播放器组件初始化情况
     * @param <Object> (self)
     * @returns none
     */
    checkInitialize: function(t) {
        var _this_ = t;
        var p = document.querySelector( "#" + _this_.config.playerId );
        var pstyle = window.getComputedStyle(p);
        console.log("=======检测开始=======");
        if( document.querySelector( "#" + _this_.config.playerId )){
            if(pstyle.offsetWidth){
                if(pstyle.width == "0" || pstyle.offsetHeight == "0px"){
                    console.error("样式设置错误,请检查宽高!");
                }
            }
            if(pstyle.display == "none"){
                console.error("样式设置错误,请检查 display !");
            }
            if(pstyle.visible == "hidden"){
                console.error("样式设置错误,请检查 visible !");
            }
            console.log("HTML 初始化成功!");
        } else{
            console.error("根据 config.playerId 找不到对应元素");
        }

        if( _this_.video ) {
            console.log("video组件 初始化成功!");
        }else{
            console.error("video组件 初始化失败!");
        }
        if( _this_.progressBar ){
            console.log("progressBar  初始化成功!");
        }else{
            console.error("progressBar  初始化失败!");
        }
        if( _this_.volumeBar ){
            console.log("volumeBar 初始化成功!");
        }else{
            console.error("volumeBar 初始化失败!");
        }
        if( _this_.filter ){
            console.log("filter组价 初始化成功!");
        }else{
            console.error("filter组价 初始化失败!");
        }
        console.log("=======检测完成=======");
    },

    /**
     * 设置视频源
     * @param <string> url
     * @returns
     */
    setVideoSrc: function(url) {
        this.video.setVideoSrc(url);
    },

    /**
     * 播放
     * @param none
     * @returns none
     */
    play: function(url) {
        this.video.play(url);
    },

    /**
     * 暂停
     * @param none
     * @returns none
     */
    pause: function(url) {
        this.video.pause(url);
    },
}
