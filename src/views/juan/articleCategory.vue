<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
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
      style="width: 100%"
    >
      <el-table-column fixed label="ID" prop="id" align="center" width="80">
        <template scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类名">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="{ row }">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
            active-text="启用"
            inactive-text="禁用"
            @change="changeStatus(row.id, row.status)"
          />
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="formTemp" label-position="right" label-width="80px">
        <el-form-item label="分类名">
          <el-input v-model="formTemp.name" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { acList, acAdd, acEdit, acDel, acStatus } from '@/api/juan'
export default {
  components: { Pagination },
  data() {
    return {
      listLoading: true,
      list: [],
      tableKey: 0,
      total: 0,
      formTemp: {
        id: undefined,
        name: '',
        status: 0
      },
      rules: {},
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogStatus: '',
      dialogFormVisible: false,

      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      acList().then(response => {
        this.list = response.data.data
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      this.listLoading = false
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.formTemp = {
        id: undefined,
        name: '',
        status: 1
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          acAdd(this.formTemp).then(response => {
            console.log(response)
            this.formTemp.id = response.data.id
            this.list.unshift(this.formTemp)
            this.dialogFormVisible = false
            this.$notify.success(response.message)
          })
        }
      })
    },
    handleUpdate(row) {
      this.formTemp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.formTemp)
          acEdit(tempData).then(response => {
            const index = this.list.findIndex(v => v.id === this.formTemp.id)
            this.list.splice(index, 1, this.formTemp)
            this.dialogFormVisible = false
            this.$notify.success(response.message)
          })
        }
      })
    },
    handleDelete(row, index) {
      acDel({ id: row.id }).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },
    changeStatus(id, status) {
      acStatus({ id: id, status: status }).then(() => {
        this.$notify.success(status === 1 ? '开启成功' : '关闭成功')
      })
    }
  }
}
</script>
