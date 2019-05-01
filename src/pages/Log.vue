<template>
  <div>
    <button type="button" class="button" :class="{isempty:isempty}" @click="selectFile">select file</button>
    <button
      type="button"
      class="button loadFile"
      :class="{isempty:isempty}"
      @click="loadFile"
    >load file</button>
    <div class="sltAttr" v-if="sltAttr">
      <div>select key 
         <a class="reselect" @click="reselectKey"><icon-up></icon-up></a> 
      <a class="reselect" @click="sltAttr=false"><icon-close></icon-close></a></div>
      <span class="spn" v-for="(item,key) in selectDataObj" :key="key" @click="selectDataFun(item)">{{key}}</span>
    </div>
    <!-- <div class="button title">title</div> -->
    <div class="search">
      <div class="searchInput" v-for="(value,key) in fields" :key="key">
        <input :placeholder="key" v-model="fields[key]" @input="searchOnTable">
        <select v-model="formatType[key]" @change="changeFormat($event.target.value,key)">
          <option value="string">string</option>
          <option value="time">time</option>
          <option value="json">json</option>
        </select>
      </div>
    </div>
    <div class="content">
      <table class="table">
        <tr>
          <th v-for="(value,index) in fields" :key="index">{{index}}</th>
        </tr>
        <tbody>
          <tr v-for="(item,index) in searched" :key="index">
            <td v-for="(value,key) in fields" :key="key" v-html="formatValue(item[key],key)"></td>
          </tr>
        </tbody>
      </table>
      <div style="height:60px;"></div>
    </div>
    <div id="modal" v-if="isInput">
      <div>Please enter your file url</div>
      <input v-model="geturl"> <button class="geturlBtn" @click="promptInput">Go</button>
    </div>
    <div id="loaidng" v-if="loaidng"><div class="loading"><icon-loading></icon-loading></div></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import "./style.css";
import { searchContent, formatData, selectFile, ajax } from "./utils";
export default {
  name: "Log",
  data: () => {
    return {
      isempty: true,
      fields: {},
      formatType: {},
      dataValue: [],
      searched: [],
      searchedAll: [],
      selectDataObj: {},
      fileData:{},
      geturl:'',
      isInput:false,
      sltAttr: false,
      loaidng:false
    };
  },
  computed: {
    ...mapGetters(["lg", "page", "total", "size"])
  },
  watch: {
    page(a, b) {
      this.gotoPage(a);
    }
  },
  created() {
    this.init();
  },
  methods: {
    ...mapMutations(["render"]),
    init() {
      if (this.dataValue.length > 0) {
        this.fields = Object.assign({}, this.dataValue[0]);
        this.formats = Object.assign({}, this.dataValue[0]);
        for (var k in this.fields) {
          this.fields[k] = "";
          this.formatType[k] = "string";
        }
        this.render({ total: this.dataValue.length });
        this.searchedAll = this.dataValue;
        if (this.lg > 1) {
          this.searched = this.dataValue.slice(0, this.size);
        }else{
          this.searched = this.dataValue.slice(0, this.dataValue.length);
        }
        this.isempty = false;
      }
    },
    gotoPage(value) {
      var end =
        this.size * (value + 1) > this.dataValue.length
          ? -1
          : this.size * (value + 1);
      this.searched = this.dataValue.slice(value * this.size, end);
    },
    changeFormat(value, key) {
      this.formatType[key] = value;
      this.searched = this.searched.concat();
      this.render({ total: this.searched.length });
    },
    searchOnTable() {
      var data = searchContent(this.dataValue, this.fields);
      this.render({ total: data.length });

      if (data.length / this.size > 1) {
        this.searched = data.slice(0, this.size);
      } else {
        this.searched = data;
      }
    },
    formatValue(value, type) {
      if (formatData[this.formatType[type]]) {
        return formatData[this.formatType[type]].call(this, value);
      }
      return value;
    },
    promptInput(){
      this.isInput=false;
      if (this.geturl!="") {
        localStorage.setItem("url", this.geturl);
        this.loaidng=true
        ajax({ url:this.geturl }).then(res => {
          this.loaidng=false
          this.fileData=res;
          this.selectDataFun(res);
        },err=>{this.loaidng=false});
      }
    },
    loadFile() {
      this.isInput=true;
      this.geturl = localStorage.getItem("url") || "";
    },
    selectFile() {
      selectFile().then(res => {
        var data = JSON.parse(res.data);
        this.fileData=data;
        this.selectDataFun(data)
      });
    },
    selectDataFun(data) {
      if (Array.isArray(data)) {
        this.sltAttr = false;
        this.dataValue = data;
        this.init();
      } else {
        this.selectDataObj = data;
        this.sltAttr = true;
      }
    },
    reselectKey(){
        this.selectDataFun(this.fileData)
    }
  }
};
</script>