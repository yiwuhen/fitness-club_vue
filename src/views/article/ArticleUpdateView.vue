<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="el-icon-s-promotion"></i> 首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
      <el-breadcrumb-item>修改文章</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
   <!-- 添加表单-->

        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px"
                 label-position="top">
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="formData.title" placeholder="请输入文章标题" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
          <el-form-item label="文章描述" prop="description">
            <el-input v-model="formData.description" type="textarea" placeholder="请输入文章描述" show-word-limit
                      :autosize="{minRows: 4, maxRows: 5}" :style="{width: '100%'}"></el-input>
          </el-form-item>
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>


  </div>
</template>

<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        title: undefined,
        description: undefined,
      },
      rules: {
        title: [{
          required: true,
          message: '请输入文章标题',
          trigger: 'blur'
        }],
        description: [{
          required: true,
          message: '请输入文章描述',
          trigger: 'blur'
        }],
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
  }
}

</script>
<style>
</style>