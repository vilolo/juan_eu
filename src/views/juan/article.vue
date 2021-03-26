<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.category_id">
        <el-option label="所有分类" value="" />
        <el-option v-for="item in categoryList" :key="item.index" :value="item.id" :label="item.name" />
      </el-select>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>

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
      <el-table-column label="封面图" min-width="150px">
        <template slot-scope="{ row }">
          <img v-if="row.cover" width="100px" :src="row.cover | imgFilter">
        </template>
      </el-table-column>
      <el-table-column label="分类">
        <template slot-scope="{ row }">
          <span>{{ row.cname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Title">
        <template slot-scope="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template slot-scope="{ row }">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template slot-scope="{ row }">
          <el-checkbox v-model="row.is_home_carousel" :true-label="1" :false-label="0" @change="setOption({id:row.id,is_home_carousel:row.is_home_carousel})">首页轮播</el-checkbox>
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

      <el-table-column
        label="Actions"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="formTemp"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="文章分类">
          <el-select v-model="formTemp.category_id">
            <el-option v-for="item in categoryList" :key="item.index" :value="item.id" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="formTemp.title" />
        </el-form-item>
        <el-form-item label="跳转关键词">
          <el-input v-model="formTemp.keyword" />
        </el-form-item>
        <el-form-item label="LOGO">
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
        <el-form-item label="内容">
          <!-- <el-input v-model="formTemp.contents" type="textarea" /> -->
          <!-- <div v-html="formTemp.contents" /> -->
          <tinymce v-model="formTemp.contents" :height="300" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> Cancel </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Tinymce from '@/components/Tinymce'
import { setArticleOption, articleList, uploadApi, articleAdd, acAllList, articleEdit, articleStatus, articleDel } from '@/api/juan'
import { getToken } from '@/utils/auth'
export default {
  components: { Pagination, Tinymce },
  filters: {
    imgFilter(img) {
      return process.env.VUE_APP_BASE_API + img
    }
  },
  data() {
    return {
      uploadApi: uploadApi + '?token=' + getToken(),
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
      rules: {},
      formTemp: {
        title: '',
        contents: '',
        cover: '',
        category_id: '',
        keyword: '',
        status: 1
      },
      imageUrl: '',
      categoryList: []
    }
  },
  created() {
    this.getList()
    this.getCategoryList()
  },
  methods: {
    setOption(data) {
      setArticleOption(data).then(() => {
        this.$notify.success('设置成功')
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getCategoryList() {
      acAllList().then(response => {
        this.categoryList = response.data
      })
    },
    handleCreate() {
      // this.$router.push('/article/add');
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.imageUrl = ''
      this.formTemp = {
        title: '',
        contents: '',
        cover: '',
        category_id: '',
        keyword: '',
        status: 1
      }
    },
    handleUpdate(row) {
      this.formTemp = Object.assign({}, row) // copy obj
      this.imageUrl = process.env.VUE_APP_BASE_API + this.formTemp.cover
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getList() {
      this.listLoading = true
      articleList(this.listQuery).then((response) => {
        this.list = response.data.data
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      this.listLoading = false
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.formTemp.cover = res.data.url
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          articleAdd(this.formTemp).then(response => {
            this.list.unshift(this.formTemp)
            this.dialogFormVisible = false
            this.$notify.success(response.message)
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.formTemp)
          articleEdit(tempData).then(response => {
            const index = this.list.findIndex(v => v.id === this.formTemp.id)
            this.list.splice(index, 1, this.formTemp)
            this.dialogFormVisible = false
            this.$notify.success(response.message)
          })
        }
      })
    },
    handleDelete(row, index) {
      articleDel({ id: row.id }).then(() => {
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
      articleStatus({ id: id, status: status }).then(() => {
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
</style>
