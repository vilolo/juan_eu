<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane v-for="(item, index) of list" :key="item.id" :label="item.shop">
        <el-input
          v-model="list[index].description"
          :autosize="{ minRows: 10}"
          type="textarea"
        />
        <el-button type="primary" @click="saveTemplate(item.shop, list[index].description)">保存</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getTemplate, saveTemplate } from '@/api/sspp'
export default {
  data() {
    return {
      list: []
    }
  },
  created() {
    getTemplate().then(response => {
      this.list = response.data
      console.log(this.list)
    })
  },
  methods: {
    saveTemplate(shop, description) {
      saveTemplate({ shop: shop, description: description }).then(response => {
        if (response.code === 20000) {
          this.$message({
            message: response.msg,
            type: 'success'
          })
        } else {
          this.$message.error(response.msg)
        }
      })
    }
  }
}
</script>
