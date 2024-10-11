"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebsocketMixin = void 0;

var _store = _interopRequireDefault(require("@/store/"));

var _mutationTypes = require("@/store/mutation-types");

var _vue = _interopRequireDefault(require("vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var WebsocketMixin = {
  mounted: function mounted() {
    this.initWebSocket();
  },
  destroyed: function destroyed() {
    // 离开页面生命周期函数
    this.websocketOnclose();
  },
  methods: {
    initWebSocket: function initWebSocket() {
      var token = _vue["default"].ls.get(_mutationTypes.ACCESS_TOKEN);

      console.log("------------WebSocket连接成功"); // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https

      var userId = _store["default"].getters.userInfo.id;

      if (!this.socketUrl.startsWith('/')) {
        this.socketUrl = '/' + this.socketUrl;
      }

      if (!this.socketUrl.endsWith('/')) {
        this.socketUrl = this.socketUrl + '/';
      }

      var url = window._CONFIG['domianURL'].replace("https://", "wss://").replace("http://", "ws://") + this.socketUrl + userId + "/" + token;
      this.websock = new WebSocket(url);
      this.websock.onopen = this.websocketOnopen;
      this.websock.onerror = this.websocketOnerror;
      this.websock.onmessage = this.websocketOnmessage;
      this.websock.onclose = this.websocketOnclose;
    },
    websocketOnopen: function websocketOnopen() {// console.log("WebSocket连接成功");
    },
    websocketOnerror: function websocketOnerror(e) {
      // console.log("WebSocket连接发生错误");
      this.reconnect();
    },
    websocketOnclose: function websocketOnclose(e) {
      this.reconnect();
    },
    websocketSend: function websocketSend(text) {
      // 数据发送
      try {
        this.websock.send(text);
      } catch (err) {// console.log("send failed (" + err.code + ")");
      }
    },
    reconnect: function reconnect() {
      var that = this;
      if (that.lockReconnect) return;
      that.lockReconnect = true; //没连接上会一直重连，设置延迟避免请求过多

      setTimeout(function () {
        // console.info("尝试重连...");
        that.initWebSocket();
        that.lockReconnect = false;
      }, 5000);
    }
  }
};
exports.WebsocketMixin = WebsocketMixin;