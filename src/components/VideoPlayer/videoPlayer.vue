  <template>
  <div class="demo">
    <video-player
      class="video-player vjs-custom-skin"
      :playsinline="true"
      :options="playerOptions"
      @play="onPlayerPlay($event)"
      @pause="onPlayerPause($event)"
      @ended="onPlayerEnded($event)"
      @statechanged="playerStateChanged($event)"
    ></video-player>
          <!-- @waiting="onPlayerWaiting($event)"
      @playing="onPlayerPlaying($event)"
      @loadeddata="onPlayerLoadeddata($event)"
      @timeupdate="onPlayerTimeupdate($event)"
      @canplay="onPlayerCanplay($event)"
      @canplaythrough="onPlayerCanplaythrough($event)"
      @statechanged="playerStateChanged($event)"
      @ready="playerReadied" -->
  </div>
  <!-- 组件引用方法 videoSrc是指所播放视频的视频地址 -->
  <!-- <video-playback :videoSrc='videoSrc'></video-playback>  -->
</template>
<script>
export default {
  name: 'VideoPlayback',
  props: ['videoSrc'],
  // mounted(){
  //   console.log(this.videoSrc)
  // },
  data() {
    return {
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: 'video/mp4', // 类型
            src: this.videoSrc
            // src:'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm'
          }
        ],
        poster: '', // 封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true // 是否显示全屏按钮
        }
      },
      finishFlag:3,
    }
  },
  methods: {
    
    // 播放回调
    onPlayerPlay(player) {
      console.log('播放回调!', player)
      this.finishFlag = 0;
      this.$emit('finishF',this.finishFlag)
    },

    // 暂停回调
    onPlayerPause(player) {
      console.log('player pause!', player)
    },

    // 视频播完回调
    onPlayerEnded(player) {
      console.log('视频播完回调',player)
      this.finishFlag = 1;
      this.$emit('finishF',this.finishFlag)
    },

    // DOM元素上的readyState更改导致播放停止
    onPlayerWaiting(player) {
      console.log(player)
    },

    // 已开始播放回调
    onPlayerPlaying(player) {
      console.log(player)
    },

    // 当播放器在当前播放位置下载数据时触发
    onPlayerLoadeddata(player) {
      console.log(player)
    },

    // 当前播放位置发生变化时触发。
    onPlayerTimeupdate(player) {
      console.log(player)
    },

    //媒体的readyState为HAVE_FUTURE_DATA或更高
    onPlayerCanplay(player) {
      // console.log('player Canplay!', player)
    },

    //媒体的readyState为HAVE_ENOUGH_DATA或更高。这意味着可以在不缓冲的情况下播放整个媒体文件。
    onPlayerCanplaythrough(player) {
      // console.log('player Canplaythrough!', player)
    },

    //播放状态改变回调
    playerStateChanged(playerCurrentState) {
      //console.log('player current update state', playerCurrentState)
    },

    //将侦听器绑定到组件的就绪状态。与事件监听器的不同之处在于，如果ready事件已经发生，它将立即触发该函数。。
    playerReadied(player) {
      console.log('example player 1 readied', player)
    }
  }
}
</script>