<template>
  <div class="app-container">

    <el-form label-position="right" label-width="80px">
      <el-form-item label="图文类型">
        <el-select>
          <el-option>sdf</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题">
        <el-input />
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
        <el-input />
      </el-form-item>
      <el-form-item label="跳转地址">
        <el-row>
          选择跳转文章：
          <el-select>
            <el-option>asdf</el-option>
          </el-select>
          <el-select>
            <el-option>asdf</el-option>
          </el-select>
        </el-row>
        <el-row>
          <el-input placeholder="自定义跳转URL" />
        </el-row>
      </el-form-item>
      <el-form-item label="描述">
        <div>
          <el-input
            v-model="keywords"
            :autosize="{ minRows: 5}"
            type="textarea"
          />
        </div>
      </el-form-item>
    </el-form>

    <div style="margin-top: 20px">
      <el-button type="primary">提交</el-button>
    </div>

  </div>
</template>

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

<script>
import { uploadApi } from '@/api/juan'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      imageUrl: '',
      uploadApi: uploadApi + '?token=' + getToken()
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      console.log(res)
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
