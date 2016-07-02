![screenshot](http://7xrnuo.com1.z0.glb.clouddn.com/PastryPlayerScreenShot.png) or [http://7xrnuo.com1.z0.glb.clouddn.com/PastryPlayerScreenShot.png](http://7xrnuo.com1.z0.glb.clouddn.com/PastryPlayerScreenShot.png)

## PastryPlayerScreenShot
  A HTML5 player based on `canvas` and `video`.

## useage
  `left` & `right` for progress<br>
  `up` & `down` for volume<br>
  `Enter` for fullscreen<br>
  `backspace` for play & pause



### code
* html
```html
<div class="position elevation-16">
    <div class="easy-player" id="easyPlayer2">
        <div class="easy-player-screen">
            <video class="ep-video" preload="" crossorigin="“anonymous”" src="/public/video/trailer.mp4">
                <!-- <source src="/home/joe/Videos/imooc/linux养成计划/L.mp4" type="video/mp4"> -->
                <source src="" type="video/mp4">
            </video>
            <!-- filter start -->
            <canvas class="ep-screen-scratch" width="720" height="360"></canvas>
            <canvas class="ep-screen-filter" width="720" height="360"></canvas>
            <!-- filter end -->
            <div class="ep-notice-loading" style="display: none;">
                <!-- <i class="fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom"></i> -->
                <div class="load-1"></div>
                <p>Loading</p>
            </div>
        </div>
        <!-- control panel start -->
        <div class="control-panel">
            <!-- progress bar start -->
            <div class="progress-bar drag-bar" data-progress="0">
                <div class="progressBarBase"></div>
                <canvas class="progressBarBuffered" width="691" height="6"></canvas>
                <div class="progressUsed" style="width: 329.68px;"></div>
                <div class="ripple-drag-btn progressDragBtn" style="transform: translate3d(323.68px, 0px, 0px);"></div>
            </div>
            <!-- progress bar end -->

            <!-- play control buttons start-->
            <div class="control-btn-group">
                <!-- play & pause -->
                <div class="play-controller">
                    <button class="btn flat-btn font-blod ripple">
                        <i class="fa fa-play"></i>
                    <span class="ripple-scope" style="width: 3.67151px; height: 3.67151px; position: absolute !important; left: 31px; top: 20px; background: rgba(0, 0, 0, 0.133333);background:rgba(0,0,0,0);"></span></button>
                </div>
                <!-- display time -->
                <div class="ep-current-time">
                    <span class="font-sm">00:25</span><span class="font-sm">/</span><span class="font-sm">00:52</span>
                </div>
                <!-- set volume -->
                <div class="easy-volume-controller">
                    <button class="btn flat-btn font-blod ripple">
                        <i class="fa     fa-volume-up"></i>
                    </button>
                    <!-- volume controller -->
                    <div class="volume-controller">
                        <div class="volume-bar drag-bar" data-progress="0">
                            <div class="progressBarBase"></div>
                            <div class="progressUsed" style="width: 90px;"></div>
                            <div class="ripple-drag-btn progressDragBtn  elevation-2" style="transform:translate3d(84px,0,0);"></div>
                        </div>
                    </div>
                </div>
                <!-- full screen -->
                <div class="full-screen-controller">
                    <button class="btn flat-btn font-blod ripple">
                        <i class="fa fa-expand"></i>
                    </button>
                </div>
                <!-- set filter -->
                <div class="ep-set-filter">
                    <button class="btn flat-btn ripple">原画</button>
                    <ul class="ep-set-options">
                        <li class="ripple" data-filter="filterBlur">模糊</li>
                        <li class="ripple" data-filter="filterSculpture">浮雕</li>
                        <li class="ripple" data-filter="filterGrey1">灰度</li>
                        <li class="ripple" data-filter="filterContrary">反色</li>
                        <li class="ripple" data-filter="filterOriginal">原画</li>
                    </ul>
                </div>
                <!-- set rate -->
                <div class="ep-set-rate">
                    <button class="btn flat-btn font-blod ripple">1&nbsp;✕</button>
                    <ul class="ep-set-options">
                        <li data-rate="2">2&nbsp;✕</li>
                        <li data-rate="1.75">1.75&nbsp;✕</li>
                        <li data-rate="1.5">1.5&nbsp;✕</li>
                        <li data-rate="1.25">1.25&nbsp;✕</li>
                        <li data-rate="1">1&nbsp;✕</li>
                    </ul>
                </div>
            </div>
            <!-- play control buttons end-->

        </div>
        <!-- control panel end -->
    </div>
</div>
```
* javascirpt

```javascirpt
  var pastryPlayer = new EasyPlayer({'playerId':'easyPlayer2'});
```

### configure
  [PastryUI](https://github.com/joe223/MyGradutionProject/tree/master/Website/public/scss)
