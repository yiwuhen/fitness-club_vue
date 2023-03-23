<template>
  <div>
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-form-item label="标题" prop="field106">
        <el-input v-model="formData.title" placeholder="请输入标题" :maxlength="20" show-word-limit
                  :style="{width: '80%'}"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="field107">
        <el-input v-model="formData.description" type="textarea" placeholder="请输入描述"
                  maxlength="200"
                  show-word-limit
                  :rows="5"
                  show-word-limit
                  style="width:80%; ">
        </el-input>
      </el-form-item>
      <el-form-item label="所属类别" prop="field111">
        <template>
          <el-select v-model="formData.categoryId" clearable placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>



        </template>
      </el-form-item>
      <el-form-item label="上传封面" prop="field112" required>
<!--        <el-upload ref="field112" :file-list="field112fileList" :action="field112Action"-->
<!--                   :before-upload="field112BeforeUpload" list-type="picture">-->
<!--          <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>-->
<!--        </el-upload>-->
        <el-upload
            ref="fileUrl"
            class="upload-demo"
            drag
            action="https://localhost:9081/static/"
            multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="文章正文">
        <div style=" width:80%;min-height:100px;height: auto;border-radius: 4px; border: #cccccc 1px solid;margin-bottom: 30px ">
          <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :defaultConfig="toolbarConfig"
              :mode="mode"
          />

          <Editor
              style=" overflow-y: hidden; min-height: 300px;  "
              v-model="html"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="onCreated"
              @onChange="onChange"
          />
        </div>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm">发布</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Vue from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
export default  {

  components: { Editor, Toolbar },
  props: [],
  data() {
    return {
      formData: {
        title: '',
        description: undefined,
        categoryId:'',
        fileUrl: null,
      },
      editor: null,
      html: '<p>hello</p>',
      toolbarConfig: { },
      editorConfig: { placeholder: '请输入内容...' },
      mode: 'default', // or 'simple'

      options:[
        {id:1,name:'蛋白粉'},
        {id:2,name:'肌酸'},
        {id:3,name:'鱼油'},
        {id:4,name:'牛排'},
        {id:5,name:'枸杞'}
      ],
      rules: {
        field106: [{
          required: true,
          message: '请输入标题',
          trigger: 'blur'
        }],
        field107: [{
          required: true,
          message: '请输入描述',
          trigger: 'blur'
        }],
        field111: [{
          required: true,
          type: 'array',
          message: '请至少选择一个field111',
          trigger: 'change'
        }],
      },
      field112Action: 'https://jsonplaceholder.typicode.com/posts/',
      field112fileList: [],
      field111Options: [

      ],
      field111Props: {
        "multiple": false
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // 模拟 ajax 请求，异步渲染编辑器
    setTimeout(() => {
      this.html = '<p>文章正文</p>'
    }, 1500)
  },
  beforeDestroy() {
    const editor = this.editor

    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  methods: {

    handleChange:function () {
      if(this.input_title.length==0){
        this.input_title = "【无标题】"
      }
    },
    handleBlur:function () {
      if(this.input_title.length<5){
        this.input_title = "【无标题】"
      }
    },
    onCreated(editor) {
      this.editor = Object.seal(editor); // 【注意】一定要用 Object.seal() 否则会报错
    },
    onChange(editor) {
      console.log("onChange", editor.getHtml()); // onChange 时获取编辑器最新内容
    },
    getEditorText() {
      const editor = this.editor;
      if (editor == null) return;

      console.log(editor.getText()); // 执行 editor API
    },
    printEditorHtml() {
      const editor = this.editor;
      if (editor == null) return;

      console.log(editor.getHtml()); // 执行 editor API
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    getField111Options() {
      // TODO 发起请求获取数据
      this.field111Options
    },
    field112BeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 2
      if (!isRightSize) {
        this.$message.error('文件大小超过 2MB')
      }
      return isRightSize
    },
  }
}

</script>
<style>
.el-upload__tip {
  line-height: 1.2;
}
.el-input--medium{


}

</style>
<style src="@wangeditor/editor/dist/css/style.css">

</style>