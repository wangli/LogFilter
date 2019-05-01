<template>
  <div id="app">
    <div id="topBar" style="-webkit-app-region: drag"></div>
    <div class="pageDown">
      <div class="pageDownCon">
        <span class="pageBtn" @click="prev">prev</span>
        <template v-for="(value,index) in pages">
          <span
            v-bind:key="index"
            v-if="value!=0"
            class="pageBtn"
            :class="{act:(value==page)}"
            @click="gotoPage(value)"
          >{{value}}</span>
          <span v-bind:key="index" v-else>. . .</span>
        </template>
        <span class="pageBtn" @click="next">next</span>
      </div>
    </div>
    <div id="closeBtn" @click="closewin">
      <icon-close></icon-close>
    </div>
    <Log id="Log"/>
  </div>
</template>

<script>
import Vue from "vue";
import Log from "./pages/Log.vue";
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
// const { ipcRenderer } = window.require("electron");

export default {
  name: "app",
  components: {
    Log
  },
  computed: {
    ...mapGetters(["lg", "page", "total", "size"]),
    pages() {
      var list = [];
      var start = this.page < 4 ? 1 : this.page - 2;
      for (var i = start; i < this.lg; i++) {
        if (i < start + 5) {
          list.push(i);
        } else if (i == start + 6) {
          list.push(0);
        } else if (i > this.lg - 3) {
          list.push(i);
        }
      }
      return list;
    }
  },
  methods: {
    closewin() {
      ipcRenderer.send("close");
    },
    ...mapMutations({
      next: "next",
      prev: "prev",
      gotoPage: "goto"
    })
  }
};
</script>

<style>
body {
  font-size: 13px;
  padding: 0;
  margin: 0;
}
body::-webkit-scrollbar,
#Log::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
body::-webkit-scrollbar-thumb,
#Log::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #5a5a7e;
}
body::-webkit-scrollbar-track,
#Log::-webkit-scrollbar-track {
  background: #dedeee;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#topBar {
  height: 20px;
  width: calc(100% - 20px);
  position: fixed;
  top: 0;
  left: 0;
  background-color: #c8c8ea;
  z-index: 100;
}
#closeBtn {
  display: inline-block;
  width: 20px;
  height: 20px;
  color: #c1e0ff;
  text-align: center;
  position: fixed;
  top: 0;
  right: 0;
  box-sizing: border-box;
  z-index: 200;
  padding: 4px;
  background-color: #c8c8ea;
}
#closeBtn:hover {
  background: #c8c8ea;
}
#closeBtn path {
  fill: #184a7c;
}
#closeBtn:hover path {
  fill: rgb(0, 0, 0);
  font-weight: bold;
}
#Log {
  position: fixed;
  top: 20px;
  left: 0;
  width: 100%;
  bottom: 0;
  overflow: auto;
  border-top: 1px #a997ca solid;
}
input[type="file"] {
  display: none;
}
.pageDown {
  position: absolute;
  text-align: center;
  bottom: 10px;
  width: 100%;
  z-index: 22;
}
.pageDownCon {
  display: inline-block;
  padding: 2px 5px;
  background-color: #f4f4f4d9;
  border-radius: 3px;
  border: 1px #eeeeee solid;
}
.pageBtn {
  font-size: 12px;
  display: inline-block;
  padding: 2px;
  margin: 1px 2px;
  text-align: center;
  min-width: 18px;
  border-radius: 3px;
}
.pageBtn.act {
  background-color: #184a7c;
  color: #c1e0ff;
}
.pageBtn:hover {
  cursor: pointer;
  background-color: #184a7c;
  color: #c1e0ff;
}
</style>
