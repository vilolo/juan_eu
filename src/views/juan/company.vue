<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="saveData()">
        保存
      </el-button>
    </div>

    <el-form ref="dataForm" :rules="rules" :model="formTemp" label-position="right" label-width="80px">
      <el-form-item label="公司名">
        <el-input v-model="formTemp.name" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="formTemp.email" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formTemp.phone" />
      </el-form-item>
      <el-form-item label="公司描述">
        <el-input v-model="formTemp.description" />
      </el-form-item>
      <el-form-item label="facebook">
        <el-input v-model="formTemp.facebook" />
      </el-form-item>
      <el-form-item label="twitter">
        <el-input v-model="formTemp.twitter" />
      </el-form-item>
      <el-form-item label="instagram">
        <el-input v-model="formTemp.instagram" />
      </el-form-item>
      <el-form-item label="LOGO">
        <el-upload
          class="avatar-uploader"
          :action="uploadApi"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl | imgFilter" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { uploadApi, companyInfoEdit, companyInfo } from '@/api/juan'
import { getToken } from '@/utils/auth'
export default {
  filters: {
    imgFilter(img) {
      return process.env.VUE_APP_BASE_API + img
    }
  },
  data() {
    return {
      formTemp: {
        name: '',
        phone: '',
        email: '',
        address: '',
        description: '',
        logo: '',
        facebook: '',
        twitter: '',
        instagram: ''
      },
      uploadApi: uploadApi + '?token=' + getToken(),
      rules: {},
      imageUrl: ''
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      companyInfo().then(response => {
        this.formTemp = Object.assign({}, response.data)
        this.imageUrl = response.data.logo
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      console.log(this.imageUrl)
      this.formTemp.logo = res.data.url
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 8

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 8MB!')
      }
      return isJPG && isLt2M
    },
    saveData() {
      companyInfoEdit(this.formTemp).then(() => {
        this.$notify.success('保存成功')
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
    height: 178px;
    display: block;
  }
</style>
