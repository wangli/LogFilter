<template>
  <div>
    <button type="button" class="button" :class="{isempty:isempty}" @click="selectFile">select file</button>
    <!-- <div class="button title">title</div> -->
    <div class="search">
      <div class="searchInput" v-for="(value,key) in fields" :key="key">
        <input :placeholder="key" v-model="fields[key]" @input="searchOnTable">
        <select v-model="formatType[key]" @change="changeFormat($event.target.value,key)">
          <option value="string">string</option>
          <option value="time">time</option>
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
            <td v-for="(value,key) in fields" :key="key">{{ formatValue(item[key],key) }}</td>
          </tr>
        </tbody>
      </table>
      <div style="height:60px;"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import "./style.css";
import { searchContent, formatData, selectFile } from "./utils";
export default {
  name: "Log",
  data: () => {
    return {
      isempty: true,
      fields: {},
      formatType: {},
      dataValue: [],
      searched: [],
      searchedAll: []
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
    selectFile() {
      selectFile().then(res => {
        var data = JSON.parse(res.data);
        if (data instanceof Array) {
          this.dataValue = data;
        } else {
          for (var k in data) {
            this.dataValue = data[k];
            break;
          }
        }
        this.init();
      });
    }
  }
};
</script>