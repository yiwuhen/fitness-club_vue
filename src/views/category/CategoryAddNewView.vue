<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="el-icon-s-promotion"></i> 后台管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>类别添加</el-breadcrumb-item>
    </el-breadcrumb>

    <el-divider></el-divider>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
      <el-form-item label="父级类别" prop="parentId">
        <el-input v-model="ruleForm.parentId" placeholder="请输入父级类别的ID"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="排序序号" prop="sort">
        <el-input v-model="ruleForm.sort"></el-input>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch
            v-model="ruleForm.enable"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#999">
        </el-switch>
      </el-form-item>
      <el-form-item label="是否显示在导航栏">
        <el-switch
            v-model="ruleForm.isDisplay"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#999">
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        parentId: '0',
        name: 'test-name-001',
        // keywords: '测试关键词1,测试关键词2',
        // icon: 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png',
        sort: '99',
        enable: 1,
        isDisplay: 1
      },
      rules: {
        parentId: [
          {required: true, message: '请输入父级类别ID', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入类别名称', trigger: 'blur'},
          {min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur'}
        ],
        // ↓↓暂时用不上↓↓
        /*keywords: [
          {required: true, message: '请输入类别关键词列表', trigger: 'blur'},
          {min: 2, max: 35, message: '长度在 2 到 35 个字符', trigger: 'blur'}
        ],
        icon: [
          {required: true, message: '请输入类别图标的URL', trigger: 'blur'},
          {min: 20, max: 255, message: '长度在 20 到 255 个字符', trigger: 'blur'}
        ],*/
        // ↑↑暂时用不上↑↑
        sort: [
          {required: true, message: '请输入排序序号', trigger: 'blur'},
          {pattern: /^(\d{1}|[1-9]{1}[0-9]?)$/, message: '排序序号必须是 0~99 之间的数字', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = 'http://localhost:10001/articleCategories/add-new';
          console.log('url = ' + url);

          let formData = this.qs.stringify(this.ruleForm);
          console.log('formData = ' + formData);

          this.axios
              .create({'headers': {'Authorization': localStorage.getItem('jwt')}})
              .post(url, formData).then((response) => {
            let responseBody = response.data;
            console.log(responseBody);
            if (responseBody.state == 20000) {
              this.$message({
                showClose: true,
                message: '添加类别成功！',
                type: 'success'
              });
              this.resetForm(formName);
            } else {
              this.$message({
                showClose: true,
                message: responseBody.message,
                type: 'error'
              });
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>