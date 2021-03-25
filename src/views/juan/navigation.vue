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
      <el-table-column label="导航名">
        <template slot-scope="{row}">
          <span>{{ row.tname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跳转类型">
        <template slot-scope="{row}">
          <span>{{ row.type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跳转目标">
        <template slot-scope="{row}">
          <span>{{ row.cname }}</span>
          <span v-if="row.type === 1">/{{ row.keyword }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
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
        <el-form-item label="标题">
          <el-input v-model="formTemp.name" />
        </el-form-item>
        <el-form-item label="父导航">
          <el-select v-model="formTemp.pid">
            <el-option :value="0" label="一级导航" />
            <el-option v-for="item in pList" :key="item.index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="跳转类型">
          <el-radio-group v-model="formTemp.type">
            <el-radio-button v-for="(item, index) in navigationTypeList" :key="item.index" :label="index">{{ item }}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <template v-if="formTemp.type === '1' || formTemp.type === '2'">
          <el-form-item label="文章分类">
            <el-select v-model="formTemp.category_id" @change="getArticleList">
              <el-option v-for="item in categoryList" :key="item.index" :value="item.id" :label="item.name" />
            </el-select>
          </el-form-item>

          <el-form-item v-show="formTemp.type === '1'" label="文章列表">
            <el-select v-model="formTemp.article_id">
              <el-option v-for="item in articleList" :key="item.index" :value="item.id" :label="item.keyword" />
            </el-select>
          </el-form-item>

          <el-form-item label="自定义跳转地址">
            <el-input v-model="formTemp.url" />
          </el-form-item>
        </template>

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
import { navigationTypeList, articleCategoryList, navigationList, navigationAdd, navigationStatus, navigationPList, navigationEdit, acAllList } from '@/api/juan'
export default {
  components: { Pagination },
  data: function() {
    return {
      list: null,
      listLoading: false,
      tableKey: 0,
      formTemp: {
        name: '',
        pname: '',
        status: 1,
        pid: 0,
        type: '1',
        article_id: '',
        category_id: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      rules: {},
      pList: [],
      categoryList: [],
      articleList: [],
      navigationTypeList: []
    }
  },
  created() {
    this.getList()
    this.getCategoryList()
    this.getNavigationTypeList()
  },
  methods: {
    getCategoryList() {
      acAllList().then(response => {
        this.categoryList = response.data
      })
    },
    getNavigationTypeList() {
      navigationTypeList().then(response => {
        this.navigationTypeList = response.data
      })
    },
    getArticleList() {
      articleCategoryList({ category_id: this.formTemp.category_id }).then(response => {
        this.articleList = response.data
      })
    },
    handleCreate() {
      this.pList = this.navigationPList(0)
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.formTemp = {
        name: '',
        pname: '',
        status: 1,
        pid: 0,
        type: '1',
        article_id: '',
        category_id: ''
      }
    },
    getList() {
      this.listLoading = true
      navigationList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })

      this.listLoading = false
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          navigationAdd(this.formTemp).then(response => {
            // this.list.unshift(this.formTemp)
            this.dialogFormVisible = false
            this.$notify.success(response.message)
            this.getList()
          })
        }
      })
    },
    changeStatus(id, status) {
      navigationStatus({ id: id, status: status }).then(() => {
        this.$notify.success(status === 1 ? '开启成功' : '关闭成功')
      })
    },
    navigationPList(noId) {
      navigationPList(noId).then((response) => {
        this.pList = response.data
      })
    },
    handleUpdate(row) {
      this.pList = this.navigationPList(row.id)

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
          navigationEdit(tempData).then(response => {
            // const index = this.list.findIndex(v => v.id === this.formTemp.id)
            // this.list.splice(index, 1, this.formTemp)
            this.dialogFormVisible = false
            this.$notify.success(response.message)
            this.getList()
          })
        }
      })
    }
  }
}
</script>
