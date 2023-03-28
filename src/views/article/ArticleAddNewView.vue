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
        <el-form-item label="文章分类" prop="categoryId">
          <!--↓↓超级牛逼的级联选择器↓↓-->
          <el-cascader
              v-model="selectedOptions"
              :options="options"
              :props="regionParams"
              @change="handleChange">
          </el-cascader>
          <!--↑↑超级牛逼的级联选择器↑↑-->
        </el-form-item>
        <el-form-item label="排序序号" prop="sort">
          <el-input v-model="ruleForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="文章正文" prop="content">
          <div style="border: 1px solid lightgrey;border-radius: 3px">
            <Toolbar
                style="border-bottom: 1px solid #ccc"
                prop="content"
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
        </el-form-item>
        <div style="margin: 30px 0 30px 130px">
          <el-button type="primary" @click="submitForm('ruleForm')">发布文章</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </div>
      </el-form>
    </div>

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
        content: '',
        categoryId: ''
      },//验证表单结束
      selectedOptions: [],
      regionParams: {
        label: 'name', //这里可以配置你们后端返回的属性
        value: 'id',
        children: 'children',
        expandTrigger: 'hover',
      },
      options: [],
      // 表单验证规则
      rules: {
        title: [
          {required: true, message: '请输入文章标题', trigger: 'blur'},
          {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
        ],
        // categoryId: [{required: true, message: '', trigger: 'blur'},
        //   {message: '', trigger: 'blur'}
        // ],
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
      html: '',//正文是html格式
      toolbarConfig: {},//富文本
      editorConfig: {placeholder: '请输入内容...'},//富文本
      mode: 'default' //富文本 or 'simple'
    }//return 结束
  },
  methods: {
    getData(array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].children.length < 1) {
          array[i].children = undefined;
        } else {

          //遍历元素并判断，挨个添加disabled
          array= array.map(obj=>{
            if (obj.enable==1){
              obj.disabled=false;
            } else {
              obj.disabled=true;
            }
            return obj;
          });
          //遍历结束

          this.getData(array[i].children);
        }
      }
      return array;
    },
    handleChange() {// 级联选择器方法
      // 级联列表返回来的是一个数组,需要的是最后一个值,代表最后一层的id值
      this.selectById = this.selectedOptions[this.selectedOptions.length - 1];
      // 输出这个id的值
      console.log("你点击的分类是:" + this.selectById);
      // 你要查询的详细分类的请求url
      // console.log('你点击分类后的请求路径是 = ' + url);
      // this.axios
      //     .create({'headers': {'Authorization': localStorage.getItem('jwt')}})//加上请求头,里面是jwt
      //     .get(url).then((response) => {
      //   let responseBody = response.data;
      //   //获取状态
      //   console.log('state=' + responseBody.state);
      //   //获取后端传来的信息
      //   console.log('message=' + responseBody.message);
      //   // //将信息赋值给表单数组
      //   // this.tableData = responseBody.data;
      //   // 将选择的分类赋值给categoryId
      //
      // });
      this.ruleForm.categoryId = this.selectById;
      console.log('你将选择的分类id：' + this.selectById + '赋值给了categoryId，现在它的值是：' + this.ruleForm.categoryId)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = 'http://localhost:10001/articles/add-new';//别忘了这里换提交的地址
          console.log('url = ' + url);
          //装填WangEditor的内容到Content
          this.ruleForm.content = this.editor.getHtml();
          console.log('ruleForm.title = ' + this.ruleForm.title);
          console.log('ruleForm.description = ' + this.ruleForm.description);
          console.log('ruleForm.sort = ' + this.ruleForm.sort);
          console.log('ruleForm.content = ' + this.ruleForm.content);
          console.log('ruleForm.categoryId = ' + this.ruleForm.categoryId);
          let formData = this.qs.stringify(this.ruleForm);
          console.log('formData = ' + formData);

          this.axios
              .create({'headers': {'Authorization': localStorage.getItem('jwt')}})
              .post(url, formData).then((response) => {
            let responseBody = response.data;
            if (responseBody.state == 20000) {
              this.$message({
                message: '文章发布成功！',
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
      this.editor.setHtml('');
    }
  },
  mounted() {
    //向后端发送请求(没有jwt验证)
    let url = "http://localhost:10001/articleCategories/list-children-by-parent";
    this.axios.get(url).then((response) => {
      let responseBody = response.data;
      var categories = this.getData(responseBody.data);
      this.options = categories;
      console.log(this.options);
    })
  },
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