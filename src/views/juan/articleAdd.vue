<template>
  <div class="app-container">
    <div class="filter-container" style="text-align: right">
      <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
    </div>

    <el-form
      ref="dataForm"
      :rules="rules"
      :model="formTemp"
      label-position="right"
      label-width="80px"
    >
      <el-form-item label="标题">
        <el-input v-model="formTemp.name" />
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="formTemp.email" />
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
      <el-form-item label="内容">
        <el-input type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button type="primary"> 提交 </el-button>
    </div>
  </div>
</template>

<script>
import { uploadApi } from '@/api/juan'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      rules: {},
      formTemp: {},
      imageUrl: '',
      uploadApi: uploadApi + '?token=' + getToken()
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.formTemp.img = res.data.url
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
