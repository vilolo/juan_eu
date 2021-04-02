<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.category_id">
        <el-option label="所有分类" value="" />
        <el-option v-for="(item, index) in imgDescCategoryList" :key="item.index" :label="item" :value="index" />
      </el-select>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>

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
      <el-table-column label="Img" min-width="150px">
        <template slot-scope="{row}">
          <img v-if="row.img" width="100px" :src="row.img | imgFilter">
        </template>
      </el-table-column>
      <el-table-column label="类型名">
        <template slot-scope="{row}">
          <span>{{ row.category_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Title" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.desc1 }}</span>
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
          <span v-if="row.type == 1">/{{ row.keyword }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template slot-scope="{row}">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column>
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
        <el-form-item label="图文类型" prop="category_id">
          <el-select v-model="formTemp.category_id">
            <el-option v-for="(item, index) in imgDescCategoryList" :key="item.index" :label="item" :value="(parseInt(index))" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="formTemp.desc1" />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="avatar-uploader"
            :action="uploadApi"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="按钮名">
          <el-input v-model="formTemp.btn_name" />
        </el-form-item>

        <el-form-item label="跳转类型">
          <el-radio-group v-model="formTemp.type">
            <el-radio-button v-for="(item, index) in navigationTypeList" :key="item.index" :label="index">{{ item }}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <template v-if="formTemp.type == '1' || formTemp.type == '2'">
          <el-form-item label="文章分类">
            <el-select v-model="formTemp.article_category_id" @change="getArticleList">
              <el-option v-for="item in categoryList" :key="item.index" :value="item.id" :label="item.name" />
            </el-select>
          </el-form-item>

          <el-form-item v-show="formTemp.type == '1'" label="文章列表">
            <el-select v-model="formTemp.article_id">
              <el-option v-for="item in articleList" :key="item.index" :value="item.id" :label="item.keyword" />
            </el-select>
          </el-form-item>
        </template>

        <el-form-item label="排序">
          <el-input v-model="formTemp.sort" />
        </el-form-item>
        <el-form-item label="描述">
          <div>
            <el-input
              v-model="formTemp.desc2"
              :autosize="{ minRows: 5}"
              type="textarea"
            />
          </div>
        </el-form-item>

        <el-form-item v-if="formTemp.category_id == 4" label="其他设置">
          <div class="editor-container">
            <json-editor ref="jsonEditor" v-model="formTemp.json_data" />
          </div>
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
import JsonEditor from '@/components/JsonEditor'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
import { navigationTypeList, acAllList, articleCategoryList, imgDescList, uploadApi, imgDescAdd, imgDescCategoryList, imgDescEdit, imgDescDel, changeStatus } from '@/api/juan'
import { getToken } from '@/utils/auth'
export default {
  name: 'ComplexTable',
  components: { Pagination, JsonEditor },
  directives: { waves },
  filters: {
    imgFilter(img) {
      return process.env.VUE_APP_BASE_API + img
    }
    // jsonFilter(jsonData){
    //   return JSON.parse(jsonData)
    // }
  },

  data() {
    return {
      imageUrl: '',
      uploadApi: uploadApi + '?token=' + getToken(),
      imgDescCategoryList: [],
      formTemp: {
        id: undefined,
        category_id: '',
        desc1: '',
        desc2: '',
        img: '',
        status: '',
        btn_name: '',
        url: '',
        sort: 50,
        articalCategoryId: '',
        articalId: '',
        type: '1',
        article_id: '',
        article_category_id: '',
        json_data: {}
      },

      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        category_id: '',
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      pvData: [],
      rules: {
        category_id: [{ required: true, message: '图文类型必选', trigger: 'blur' }]
      },
      categoryList: [],
      articleList: [],
      navigationTypeList: []
    }
  },
  created() {
    this.getList()
    imgDescCategoryList().then(response => {
      this.imgDescCategoryList = response.data
    })
    this.getCategoryList()
    this.getNavigationTypeList()
  },
  methods: {
    getNavigationTypeList() {
      navigationTypeList().then(response => {
        this.navigationTypeList = response.data
      })
    },
    getCategoryList() {
      acAllList().then(response => {
        this.categoryList = response.data
      })
    },
    getArticleList() {
      articleCategoryList({ category_id: this.formTemp.article_category_id }).then(response => {
        this.articleList = response.data
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.formTemp.img = res.data.url
    },
    beforeAvatarUpload(file) {
      const imgTypeList = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
      // const isJPG = file.type === 'image/jpeg'
      const isRightImg = imgTypeList.indexOf(file.type)
      const isLt2M = file.size / 1024 / 1024 < 8

      // if (!isJPG) {
      //   this.$message.error('上传图片只能是 JPG 格式!')
      // }
      if (isRightImg < 0) {
        this.$message.error('上传图片格式不正确!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 8MB!')
      }
      return isRightImg && isLt2M
    },

    getList() {
      this.listLoading = true
      imgDescList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })

      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.imageUrl = ''
      this.formTemp = {
        id: undefined,
        category_id: '',
        desc1: '',
        desc2: '',
        img: '',
        btn_name: '',
        url: '',
        sort: 50,
        articalCategoryId: '',
        articalId: '',
        status: 1,
        type: '1',
        article_id: '',
        article_category_id: '',
        json_data: {}
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          imgDescAdd(this.formTemp).then(response => {
            // this.list.unshift(this.formTemp)
            this.getList()
            this.dialogFormVisible = false
            this.$notify.success(response.message)
          })
        }
      })
    },
    handleUpdate(row) {
      this.imageUrl = ''
      this.formTemp = Object.assign({}, row) // copy obj
      if (this.formTemp.img) {
        this.imageUrl = process.env.VUE_APP_BASE_API + this.formTemp.img
      }
      this.formTemp.json_data = JSON.parse(this.formTemp.json_data)
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
          imgDescEdit(tempData).then(response => {
            // const index = this.list.findIndex(v => v.id === this.formTemp.id)
            // this.list.splice(index, 1, this.formTemp)
            this.getList()
            this.dialogFormVisible = false
            this.$notify.success(response.message)
          })
        }
      })
    },
    handleDelete(row, index) {
      imgDescDel({ id: row.id }).then(() => {
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
      changeStatus({ id: id, status: status }).then(() => {
        this.$notify.success(status === 1 ? '开启成功' : '关闭成功')
      })
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    /* height: 178px; */
    display: block;
  }

  .editor-container{
    position: relative;
    height: 100%;
  }
</style>
