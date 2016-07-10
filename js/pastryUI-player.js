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
let ProgressDragBtn = function(VIDEO) {

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
let VideoProgressDragBtn = ProgressDragBtn;
VideoProgressDragBtn.prototype.init = function() {
    let _this_ = this;
    // 进度条拖动按钮
    let parent = this.progressBar;
    let used = this.progressUsed;
    let width = this.dragBtn.offsetWidth; // 按钮宽度
    this.parWidth = this.progressBar.offsetWidth - width;

    this.dragBtn.onmousedown = function (event) {
        let e = event || window.event;
        let target = e.target || e.srcElement;
        let initX = e.pageX;
        let _this = this;
        if(target.getAttribute("style")) {
            let initleft = parseInt(target.getAttribute("style").split(";")[0].split("(")[1].split("px")[0]);
        }else{
            let initleft = target.offsetLeft;
        }

        // 鼠标按下移动时拖动按钮位移
        document.onmousemove = function(event) {
            let e = event || window.event;
            let target = e.target || e.srcElement;
            let moveX = e.pageX - initX;
            let left = initleft + moveX;
            left = left < 0 ? 0 : left;
            left = left > _this_.parWidth ? _this_.parWidth : left;
            used.style.width = left + 6 + "px";
            _this.style.transform = "translate3d(" + left + "px,0,0)";
        };

        // 鼠标松开时销毁事件监听
        document.onmouseup = function() {
            let currentProgress;
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
 let VolumeProgressDragBtn = function(VIDEO) {
     //  VIDEO.player 整个视频控件 Element
     this.progressBar = VIDEO.player.getElementsByClassName('volume-bar')[0]; // progressBar
     this.progressUsed = this.progressBar.getElementsByClassName("progressUsed")[0];      // 已使用指示栏
     this.dragBtn = this.progressBar.getElementsByClassName( "progressDragBtn")[0];      // 拖动按钮
     this.currentProgress = 0;   // 进度 像素值
     this.progressPercent = 0;   // 进度 百分比
     this.parWidth = 0;          // 进度条初始宽度
     this.VIDEO = VIDEO;         // 需要被控制的视频组件
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
                 this.currentProgress = this.parWidth;
                 this.progressPercent = 1;
             }
             this.VIDEO.setVolume(p);
             console.log(p);
             this.progressUsed.style.width = this.currentProgress;
             if(this.dragBtn.getAttribute("style")) {
                 this.dragBtn.style.transform = "translate3d(" + this.currentProgress + "px,0,0)"; // 不能在属性里加入分号
             }else{
                 this.dragBtn.setAttribute("style","transform:translate3d(" + this.currentProgress + "px,0,0);");
             }

             // 设置音量图标
             let currentVolume = this.getProgressPercent(); // 当前音量 [0,1]
             if (currentVolume === 0) {
                 this.volumeBtn.getElementsByTagName("i")[0].setAttribute("class","fa     fa-volume-off")
             }else if (currentVolume < 0.5) {
                 this.volumeBtn.getElementsByTagName("i")[0].setAttribute("class","fa     fa-volume-down")

             }else {
                 this.volumeBtn.getElementsByTagName("i")[0].setAttribute("class","fa     fa-volume-up")
             }
             this.progressUsed.style.width = this.currentProgress + 6 + "px";
         }else{
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
     let _this_ = this;
     // 进度条拖动按钮
     let parent = this.progressBar;
     let used = this.progressUsed;
     let width = this.dragBtn.offsetWidth; // 按钮宽度
     this.parWidth = this.progressBar.offsetWidth - width;

     this.dragBtn.onmousedown = function (event) {
         let e = event || window.event;
         let target = e.target || e.srcElement;
         let initX = e.pageX;
         let _this = this;
         if(target.getAttribute("style")) {
             let initleft = parseInt(target.getAttribute("style").split(";")[0].split("(")[1].split("px")[0]);
         }else{
             let initleft = target.offsetLeft;
         }

         // 鼠标按下移动时拖动按钮位移
         document.onmousemove = function(e) {
             e = e || window.event;
             let target = e.target || e.srcElement;
             let moveX = e.pageX - initX;
             let left = initleft + moveX;
             left = left < 0 ? 0 : left;
             left = left > _this_.parWidth ? _this_.parWidth : left;
             used.style.width = left + 6 + "px";
             _this.style.transform = "translate3d(" + left + "px,0,0)";

         };

         // 鼠标松开时销毁事件监听
         document.onmouseup = function() {
             let currentProgress;
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
             let currentVolume = _this_.getProgressPercent(); // 当前音量 [0,1]
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
let EasyPlayerVideo = function (config) {
    this.player = document.getElementById(config.playerId); // 整个视频控件元素
    this.video = this.player.getElementsByClassName("ep-video")[0];
    this.bufferbar = this.player.getElementsByClassName("progressBarBuffered")[0];
    this.progress = null;
    this.volume = null;
    this.init();
}

EasyPlayerVideo.prototype = {
    /**
     * 初始化方法
     */
    init:function() {
        let _this = this;
        let ctx = _this.bufferbar.getContext('2d');
        // 必须在 html 标签里指明 width 或者 height
        let width = _this.bufferbar.offsetWidth;
        let height = _this.bufferbar.offsetHeight;
        _this.bufferbar.width  = width;
        _this.bufferbar.height  = height;
        _this.video.addEventListener("seeked",function() {
            t();
        });
        let interval = window.setInterval(t,1000);
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
        let ctx = _this.bufferbar.getContext('2d');
        let width = _this.bufferbar.offsetWidth;
        let height = _this.bufferbar.offsetHeight;
        let inc = width / _this.video.duration;

        for( let i = 0; i < _this.video.buffered.length; i++) {
            let startX = _this.video.buffered.start(i) * inc;
            let endX = _this.video.buffered.end(i) * inc;
            width = endX - startX;
            ctx.fillStyle = "#4D5559";
            ctx.fillRect(startX,0,width,6);
        }
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
        let duration =  Math.round(this.video.duration); // 返回四舍五入后的时间 /s
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
         let rate = r || 1;
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
let EasyPlayerFilter = function(config, VIDEO, filterName) {
    this.player = document.getElementById(config.playerId);
    this.filter = this.player.getElementsByClassName("ep-screen-filter")[0];
    this.video =
    this.player.getElementsByClassName("ep-video")[0];
    this.filterName = filterName || "filterOriginal";                         // 滤镜方法名
    this.init();
}

EasyPlayerFilter.prototype = {
    init:function() {
        let player = this.player;   // 自定义　player 对象
        // let filter = this.filter;   // 自定义　filter 对象
        let filter = player.querySelector(".easy-player-screen > .ep-screen-scratch");     // 缓冲区
        let scratch = player.querySelector(".easy-player-screen > .ep-screen-filter");   // 播放区
        let width = filter.offsetWidth;
        let height = filter.offsetHeight;
        filter.width = width;
        filter.height = height;
        scratch.width = width;
        scratch.height = height;
        let video = this.video;     // 自定义　video 对象
        let ctx = filter.getContext('2d');
        let ctx2 = scratch.getContext('2d');
        let _this = this;


        this.video.addEventListener("play",function() {
            // 根据参数选择滤镜方法
            let rendors = ['','webkit','moz'];
            // requestAnimationFrame 兼容性处理
            for( let r = 0; r < rendors.length && !window.requestAnimationFrame; r++) {
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
                    let frame = ctx.getImageData(0,0,width,height); // 缓冲帧,需要被处理
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
                    let frame = ctx.getImageData(0,0,width,height); // 缓冲帧,需要被处理
                    // console.log(width+","+height);
                    let data = frame.data;
                    if(typeof data !== "object" || data.length === 0) {
                        return frame;
                    }
                    let len = data.length / 4;
                    for (let i = 0; i < len; i++) {
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
        let data = frame.data;
        if(typeof data !== "object" || data.length === 0) {
            return frame;
        }
        let len = data.length / 4;
        for (let i = 0; i < len; i++) {
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
        let data = frame.data;
        let len = data.length / 4;
        let h = frame.height;
        let w = frame.width;
        if(typeof data !== "object" || data.length === 0) {
            return frame;
        }
        // 先进行灰度处理
        for(let i = 0;i < len; i++) {
            let ave = ( data[i*4] + data[i*4 + 1] + data[i*4 + 2] ) / 3;
            data[i*4] = data[i*4 + 1] = data[i*4 + 2] = ave;
        }
        // 浮雕效果
        for(let y = 0; y < h; y++) {
            for(let x = 0;x < w; x++) {
                // 先判断是否存在该像素,及下一点是否存在
                if(data[(x + w*y)*4 + 4]) {
                    let current = (x + w * y) * 4;
                    let next = current + 4;
                    let newData = data[next] - data[current];
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
        let data = frame.data;
        if(typeof data !== "object" || data.length === 0) {
            return frame;
        }
        // 权重 R:30% ,G:59% ,B:11%
        let len = data.length / 4;
        for(let i = 0; i < len; i ++) {
            let newData = ~~(data[i*4] * 0.3 + data[i*4 + 1] * 0.59 + data[i*4 + 2] * 0.11);
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
        let data = frame.data;
        if(typeof data !== "object" || data.length === 0) {
            return frame;
        }
        let len = data.length / 4;
        for(let i = 0; i < len; i++) {
            let max = Math.max(data[i*4], data[i*4 + 1], data[i*4 + 2]);
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
        let data = frame.data;
        if(typeof data !== "object" || data.length === 0) {
            return frame;
        }
        let len = data.length / 4;
        for(let i = 0; i < len; i++) {
            let min = Math.min(data[i*4], data[i*4 + 1], data[i*4 + 2]);
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
        let data = frame.data;
        if(typeof data !== "object" || data.length === 0) {
            return frame;
        }
        let len = data.length / 4;frame
        for(let i = 0;i < len; i++) {
            let ave = ( data[i*4] + data[i*4 + 1] + data[i*4 + 2] ) / 3;
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
        let data = frame.data;
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
        let data = frame.data;
        if(typeof data !== "object" || data.length === 0) {
            return frame;
        }
         radius = radius || 5;
         sigma = sigma || radius/3;
         let _a_ = 1 / (sigma * Math.sqrt(2 * Math.PI));
         let _b_ = -1 / (2*sigma*sigma);
         let arr = [];//权重
         let arrSum = 0,
             x, y,
             i, j,
             re,t,
             len,
             r,g,b,a;
         let w = frame.width;
         let h = frame.height;

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
let EasyPlayer = function(config) {
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

EasyPlayer.prototype = {
    /**
     * 视频播放器初始化
     *
     * @param none
     * @returns none
     */
    init: function() {
        let _this_ = this;
        let refresh;
        let endTime = "00:00";
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
        let filterCount = _this_.filterList.length;
        if(typeof filterCount === "undefined" || filterCount === 0) {
            console.error("获取滤镜设置列表失败!");
        }
        for(let ifilter = 0; ifilter < filterCount; ifilter ++ ) {
            _this_.filterList[ifilter].addEventListener("click", function(event) {
                if(_this_.playStatus === true) {
                    _this_.video.pause();
                }else{
                    _this_.video.play();
                }
                let target = event.target || event.srcElement;
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
        let rateCount = _this_.rateList.length;
        if(typeof rateCount === "undefined" || rateCount === 0) {
            console.error("获取速率设置列表失败!");
        }
        for(let irate = 0; irate < filterCount; irate ++ ) {
            _this_.rateList[irate].addEventListener("click", function(event) {
                let target = event.target || event.srcElement;
                _this_.video.setRate(target.getAttribute("data-rate"));
                _this_.rateBtn.innerHTML = target.innerHTML;
            }, false);
        }

        // 全屏处理
        // 改变播放效果前先暂停视频
        this.fullScreenBtn.addEventListener("click",function(event) {
            let target = event.target || event.srcElement;
            let playerElem = document.getElementById(_this_.config.playerId);
            let result = toggleFullScreen(playerElem);
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
                let progress = _this_.video.getProgress(); // 当前播放进度
                let currentTime = _this_.video.getTime(); // 当前时间
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
            let keyCode = e.keyCode;
            // 判断播放器是否存在及是否初始化
            let isControl = false;
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
                    let target = _this_.fullScreenBtn;
                    let playerElem = document.getElementById(_this_.config.playerId);
                    let result = toggleFullScreen(playerElem);
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
        let _this_ = t;
        let p = document.querySelector( "#" + _this_.config.playerId );
        let pstyle = window.getComputedStyle(p);
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
