<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column fixed label="ID" prop="id" align="center" width="80">
        <template scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-form-item label="导航名">
        <el-input v-model="formTemp.name" />
      </el-form-item>
      <el-form-item label="上级导航">
        <el-input v-model="formTemp.pname" />
      </el-form-item>
      <el-form-item label="状态">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
            active-text="启用"
            inactive-text="禁用"
            @change="changeStatus(row.id,row.status)"
          />
        </template>
      </el-form-item>
    </el-table>

  </div>
</template>

<script>
export default {
  data: function() {
    return {
      list: null
    }
  }
}
</script>
