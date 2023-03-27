<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="el-icon-s-promotion"></i> 后台管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>文章发布</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="文章简介" prop="description">
          <el-input v-model="ruleForm.description"></el-input>
        </el-form-item>
        <el-form-item label="排序序号" prop="sort">
          <el-input v-model="ruleForm.sort"></el-input>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
    </div>
    <!--富文本编辑器的功能板-->

    <div>
      <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editor"
          :defaultConfig="toolbarConfig"
          :mode="mode"
      />
      <Editor
          style="height: 500px; overflow-y: hidden;"
          v-model="html"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="onCreated"
      />
    </div>
    <el-divider></el-divider>
      <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    <el-divider></el-divider>
  </div>
</template>
<script>

import Vue from 'vue' //富文本
import {Editor, Toolbar} from '@wangeditor/editor-for-vue' //富文本

export default Vue.extend({//富文本
  components: {Editor, Toolbar},//富文本
  data() {
    return {
      // 验证表单
      ruleForm: {
        title: '请输入文章标题',
        description: '请输入文章简介',
        sort: 1,
        content:''
      },//验证表单结束
      // 表单验证规则
      rules: {
        title: [
          {required: true, message: '请输入文章标题', trigger: 'blur'},
          {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入文章简介', trigger: 'blur'},
          {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入品牌排序序号', trigger: 'blur'},
          {pattern: /^(\d{1}|[1-9]{1}[0-9]?)$/, message: '排序序号必须是0~99之间的数字', trigger: 'blur'}
        ]
      },// 表单规则结束
      editor: null,//富文本
      html: '<p>开始撰写文章……</p>',//正文是html格式
      toolbarConfig: {},//富文本
      editorConfig: {placeholder: '请输入内容...'},//富文本
      mode: 'default' //富文本 or 'simple'
    }//return 结束
  },
  methods: {//富文本
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = '';//别忘了这里换提交的地址
          console.log('url = ' + url);
          this.ruleForm.content = this.editor.html; //【这里我装填失败了！】将富文本编辑器正文传入formData中的content属性
          let formData = this.qs.stringify(this.ruleForm);
          console.log('formData = ' + formData);
          this.axios
              .create({'headers': {'Authorization': localStorage.getItem('jwt')}})
              .post(url, formData).then((response) => {
            let responseBody = response.data;
            if (responseBody.state == 20000) {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.resetForm(formName);
            } else {
              this.$message.error(responseBody.message);
            }
          });
        } else {
          alert('error submit!!');
          return false;
        }
      });
    },
    onCreated(editor) {//富文本
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    resetForm(formName) { //重置
      this.$refs[formName].resetFields(); // 重置element ui组件内的信息
      this.editor.setHtml(''); // 重置 WangEditor的内容
    }
  },
  mounted() {},
  beforeDestroy() {//富文本
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
})
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style><!--富文本编辑器css样式-->
<style scoped>

</style>