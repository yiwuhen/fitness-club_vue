<template>
  <div>
    <!--顶部导航栏开始-->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="el-icon-s-promotion"></i> 后台管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>文章修改</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <!--顶部导航栏结束-->
    <div>

      <!--form表单开始-->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">

        <!--文章标题开始-->
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <!--文章标题结束-->

        <!--文章简介开始-->
        <el-form-item label="文章简介" prop="description">
          <el-input v-model="ruleForm.description"></el-input>
        </el-form-item>
        <!--文章简介结束-->

        <!--文章分类-级联选择器开始-->
        <el-form-item label="文章分类" prop="selectedOptions">
          <el-cascader
              v-model="selectedOptions"
              :options="options"
              :props="regionParams"
              @change="handleChange">
          </el-cascader>
        </el-form-item>
        <!--文章分类-级联选择器结束-->

        <!--排序序号开始-->
        <el-form-item label="排序序号" prop="sort">
          <el-input v-model="ruleForm.sort"></el-input>
        </el-form-item>
        <!--排序序号结束-->

        <!--封面上传组件开始-->
        <el-form-item label="图片上传" prop="cover">
          <el-upload
              action="http://localhost:10001/articlePictures/upload"
              list-type="picture-card"
              :fileList="fileList"
              name="picFile"
              :limit="1"
              :handlePreview="handlePreview"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess">
            <i class="el-icon-plus"></i>
          </el-upload>
          <!--封面上传-预览组件组件开始-->
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <!--封面上传-预览组件组件结束-->
        </el-form-item>
        <!--封面上传组件结束-->

        <!--文章正文开始-->
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

                @image-upload="handleImageUpload"
                @onCreated="onCreated"
                @onChange="onChange"
            />
          </div>
        </el-form-item>
        <!--文章正文结束-->

        <!--提交按钮开始-->
        <div style="margin: 30px 0 30px 130px">
          <el-button type="primary" @click="submitForm('ruleForm')">修改文章</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </div>
        <!--提交按钮结束-->

      </el-form>
      <!--form表单结束-->

    </div>
  </div>
</template>
<script>

import Vue from 'vue' // 导入富文本
import {Editor, Toolbar} from '@wangeditor/editor-for-vue' // 导入富文本

export default Vue.extend({
  components: {Editor, Toolbar},// 导入富文本
  data() {
    return {
      fileList: [],
      file: {url: '', articleId: undefined, isCover: '', description: '封面', isDelDB: 1},
      data: {
        description: '',
        width: '',
        height: '',
        isCover: 0,
        sort: undefined
      },
      exArticleId:null,

      dialogImageUrl: '',// 封面上传-预览组件中的图片url
      dialogVisible: false,// 封面上传-预览组件的可见性，false为不显示

      ruleForm: {// form表单
        title: undefined,
        description: undefined,
        sort: undefined,
        content: undefined,
        categoryId: undefined
      },// form表单

      selectedOptions: [],// 级联选择器参数开始
      options: [],
      regionParams: {
        label: 'name', //这里可以配置你们后端返回的属性
        value: 'id',
        children: 'children',
        expandTrigger: 'hover',
      },// 级联选择器参数结束

      // form表单-验证规则
      rules: {
        title: [
          {required: true, message: '请输入文章标题', trigger: 'blur'},
          {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
        ],
        //TODO 级联选择器的表单验证有问题 未解决
        selectedOptions: [
          {required: false, message: '请选择分类', trigger: 'change', type: 'array'}
        ],
        description: [
          {required: true, message: '请输入文章简介', trigger: 'blur'},
          {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序序号', trigger: 'blur'},
          {pattern: /^(\d{1}|[1-9]{1}[0-9]?)$/, message: '排序序号必须是0~99之间的数字', trigger: 'blur'}
        ]
      },// form表单-规则结束

      ContentImg: [],// 富文本编辑器开始
      editor: null,//富文本
      html: '',//正文是html格式
      toolbarConfig: {},//富文本
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: {
          uploadImage: {
            // 后端上传地址，必填
            server: "http://localhost:10001/articlePictures/uploadImg",
            // form-data fieldName，后端接口参数名称，默认值wangeditor-uploaded-image
            fieldName: "picFile",
            // 1M，单个文件的最大体积限制，默认为 2M
            maxFileSize: 10 * 1024 * 1024,
            // 最多可上传几个文件，默认为 100
            maxNumberOfFiles: 10,
            // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
            allowedFileTypes: ['image/*'],
            // 15 秒，超时时间，默认为 10 秒
            timeout: 15 * 1000,
            // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
            // meta: {
            //     token: 'xxx',
            //     otherKey: 'yyy'
            // },
            // 将 meta 拼接到 url 参数中，默认 false
            // metaWithUrl: false,
            // 自定义增加 http  header
            // headers: {
            //     Accept: 'text/x-json',
            //     otherKey: 'xxx'
            // },
            // 跨域是否传递 cookie ，默认为 false
            // withCredentials: false,
          },
          insertImage: {
            onInsertedImage: this.handleInsertedImage
          }
        }
      },// 富文本编辑器结束
      mode: 'default' //富文本 or 'simple'
    };
  },

  computed: {},// 意义不明

  watch: {},// 意义不明

  methods: {

    handleRemove(file, fileList) {// 封面上传组件的删除方法
      console.log("【删除方法】点击了删除按钮，传入file和fileList：", file, fileList);
      let url = "http://localhost:10001/articlePictures/deleteCoverByIsDelDB"; //删除文件时的请求路径
      console.log("【删除方法】请求路径是：",url);
      // 定义一个DTO提交到后端
      const ArticlePictureDeleteCoverDTO = {
        id: undefined,
        articleId: undefined,
        url: undefined,
        isCover: 1,
        isDelDB: 1,
        description: undefined
      };
      // 取出上个页面传来的信息
      // const article = JSON.parse(this.$route.query.article);
      // 赋值给DTO
      ArticlePictureDeleteCoverDTO.id = null;
      ArticlePictureDeleteCoverDTO.articleId = this.exArticleId;
      ArticlePictureDeleteCoverDTO.url = file.url;
      console.log("【删除方法】DTO装填完毕：",ArticlePictureDeleteCoverDTO);
      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('jwt')}})
          .post(url,ArticlePictureDeleteCoverDTO).then((response) => {
        let responseBody = response.data;
        if (responseBody.state == 20000) {
          this.fileList.splice(0,1);
          this.$message({
            message: '封面图片删除成功！',
            type: 'success'
          })
        } else {
          this.$message.error(responseBody.message);
        }
      })
      console.log("【删除方法】执行完毕！此刻封面列表为：", this.fileList, "宽度为：", this.fileList.length)
    },

    handlePictureCardPreview(file) {// 封面上传组件的预览方法
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    handlePreview(file) { // 封面上传组件的预览方法
      this.dialogImageUrl = file.url;
      console.log("触发了handlePreView，file的值为：", this.file);
      this.dialogVisible = true;
    },

    handleSuccess(response, file, fileList) { // 封面上传成功时触发的方法
      let url = "http://localhost:10001/img/" + response.data;
      console.log("【上传图片】上传COVER请求的路径是：",url);
      file.url = url;
      //将有url赋值给文件的url
      this.file.url = file.url;
      this.file.isCover = 1;
      this.file.articleId=this.exArticleId;
      console.log("【上传封面】图像列表:", fileList);
      this.fileList = fileList;
      console.log(this.fileList.length);
    },

    handleInsertedImage(image) { // 富文本编辑器-插入图片
      // JS 语法
      if (image == null) return
      const {src, alt, url, href} = image
      this.ContentImg.push(image)
      console.log("【富文本编辑器】ContentImg:", this.ContentImg);
      console.log('【富文本编辑器】Inserted Image：', src, alt, url, href)
    },

    onChange(editor) { // 富文本编辑器-文本框监听
      console.log("onChange", this.editor.getHtml());
      console.log("获得当前的图片:", this.editor.getElemsByType('image'));
    },

    handleImageUpload(result) { // 富文本编辑器-上传图片
      console.log("【富文本编辑器】-上传图片")
      console.log(result.data);
      // 图片上传成功的回调函数
      if (result.errno === 0) {
        const url = result.data.url
        this.$refs.editor.txt.insertImage(url)
      } else {
        alert('图片上传失败')
      }
    },

    onCreated(editor) {// 富文本编辑器
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    resetForm(formName) {// 富文本编辑器重置
      this.$refs[formName].resetFields(); // 重置element ui组件内的信息
      this.editor.setHtml('');
    },

    handleChange() {// 级联选择器-查询多级分类方法
      // const article = JSON.parse(this.$route.query.article);
      // console.log("【级联选择器】你从上个页面传过来的文章是：", article);

      // 级联列表返回来的是一个数组,需要的是最后一个值,代表最后一层的id值
      this.selectById = this.selectedOptions[this.selectedOptions.length - 1];
      // 输出这个id的值
      console.log("【级联选择器】你点击的分类是:", this.selectById);
      // 根据Id值去查询文章并刷新文章列表
      let url = 'http://localhost:10001/articles/' + this.exArticleId + '/list';
      // 你要查询的详细分类的请求url
      console.log('你修改文章的请求路径是 = ', url);
      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('jwt')}})//加上请求头,里面是jwt
          .get(url).then((response) => {
        let responseBody = response.data;
        //获取状态
        console.log('state=' + responseBody.state);
        //获取后端传来的信息
        console.log('message=' + responseBody.message);
        //将信息赋值给表单数组
        this.tableData = responseBody.data;
      });
    },

    getData(array) { // 级联选择器-取出分类、添加隐显方法
      for (var i = 0; i < array.length; i++) {
        if (array[i].children.length < 1) {
          array[i].children = undefined;
        } else {
          //遍历元素并判断，挨个添加disabled
          array = array.map(obj => {
            if (obj.enable == 1) {
              obj.disabled = false;
            } else {
              obj.disabled = true;
            }
            return obj;
          });
          //遍历结束
          this.getData(array[i].children);
        }
      }
      return array;
    },

    submitForm(formName) { //提交表单
      // 去重
      console.log("【发布文章】正在执行发布文章操作！")
      for (let i = this.ContentImg.length - 1; i >= 0; i--) {
        for (let j = 0; j < this.editor.getElemsByType('image').length; j++) {
          if (this.ContentImg[i].src == this.editor.getElemsByType('image')[j].src) {
            // this.ContentImg[i].url=undefined;
            this.ContentImg.splice(i, 1);
          }
        }
      }
      // 最终要删除的多余的图片
      console.log("【发布文章】最终的佼佼图片（猎杀名单）:", this.ContentImg)

      // let article = JSON.parse(this.$route.query.article);
      // console.log("【发布文章】传过来的文章是：", article);

      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = 'http://localhost:10001/articles/' + this.exArticleId + '/update';//别忘了这里换提交的地址
          console.log('【发布文章】装填id后的url请求路径为 = ', url);

          // 装填WangEditor的内容到Content
          this.ruleForm.content = this.editor.getHtml();
          console.log('【发布文章】ruleForm.title = ',this.ruleForm.title);
          console.log('【发布文章】ruleForm.description = ',this.ruleForm.description);
          console.log('【发布文章】ruleForm.sort = ',this.ruleForm.sort);
          console.log('【发布文章】ruleForm.content = ',this.ruleForm.content);
          // 装填categoryId
          this.ruleForm.categoryId = this.selectById;

          let formData = this.qs.stringify(this.ruleForm);
          console.log('【发布文章】formData = ',formData);

          this.axios
              .create({'headers': {'Authorization': localStorage.getItem('jwt')}})
              .post(url,formData).then((response) => {
            let responseBody = response.data;
            if (responseBody.state == 20000) {
              //图片发送异步请求
              //将封装的图片发送请求
              let pictureURI = "http://localhost:10001/articlePictures/add-new" //
              let fileData = this.qs.stringify(this.file);
              console.log("【发布文章】图片的信息是:" + fileData);
              let ArticlePictureAddNewDTO ={
                articleId: null,
                url: undefined,
                isCover: 1,
                description:undefined,
                width: undefined,
                height: undefined,
                sort:undefined
              }
              // 取出上个页面传来的信息
              // const article = JSON.parse(this.$route.query.article);
              console.log("【发布文章】即将通过",this.fileList,"的",this.fileList.url,"给DTO赋值")
              ArticlePictureAddNewDTO.articleId=this.exArticleId;
              ArticlePictureAddNewDTO.url=this.file.url;
              console.log("【发布文章】DTO的信息是：",ArticlePictureAddNewDTO)

              this.axios.post(pictureURI, fileData).then((response) => {
                let FileResponseData = response.data;
                console.log("【发布文章】返回的消息是:" + FileResponseData.state)
              })
              ///////////
              // 提交“删除前端瞎几把给服务器上传多余的图片”请求
              let delImgUrl = "http://localhost:10001/articlePictures/deleteUnnecessaryPic";
              console.log("【发布文章】删除多余图片的请求路径：" + delImgUrl)
              this.axios.post(delImgUrl, this.ContentImg).then((response) => {
                let delImgUrlResponseData = response.data;
                console.log("【发布文章】提交了删除多余图片的请求，返回的消息是：" + delImgUrlResponseData) //TODO
              })

              this.$message({
                message: '文章修改成功！即将刷新页面！',
                type: 'success'
              });
              this.resetForm(formName);

              // // 延迟2秒后刷新页面
              // setTimeout(() => {
              //   location.href = "/article/ArticleListView.vue";
              // }, 2000);

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

  },

  mounted() {
    //TODO 在尝试一个很新的东西，如果炸了，恢复下面两段代码
    // 拿到上个页面传过来的id
    // let articleId = this.$route.query.id;
    // console.log(articleId);

    const article = JSON.parse(this.$route.query.article);
    console.log("【预加载】传过来的文章是：", article);
    this.exArticleId=article.id;
    console.log("【预加载】传过来的文章id是：",this.exArticleId);

    // 设置请求路径 TODO
    // let oldArticleUrl = "http://localhost:10001/articles/"+articleId;
    let oldArticleUrl = "http://localhost:10001/articles/" + this.exArticleId;
    // 发送请求获取数据
    this.axios.get(oldArticleUrl).then((response) => {
      // 声明一个参数用来接收Json对象
      let responseBody = response.data;
      var oldArticle = this.getData(responseBody.data);
      // 将Json对象的值赋给ruleForm
      this.ruleForm = oldArticle;
      // 将ruleForm的content赋值给editor正文
      this.editor.setHtml(this.ruleForm.content);
      console.log(
          '【预加载】从所选页面拿到的标题：' + this.ruleForm.title + '\n' +
          '【预加载】从所选页面拿到的简介：' + this.ruleForm.description + '\n' +
          '【预加载】从所选页面拿到的序号：' + this.ruleForm.sort + '\n' +
          '【预加载】从所选页面拿到的正文：' + this.ruleForm.content
      )
    })

    let getCoverUrl = "http://localhost:10001/articlePictures/" + this.exArticleId + "/cover";//url的地址根据项目实际需要，info.photo=>图片路径,this.baseUrl=>上传的网络地址
    // this.axios.get(getCoverUrl).then((response) => {
    //   console.log("【预加载】得到图片回传response：", response)
    //   let coverResponseBody = response.data
    //   var coverData = this.getData(coverResponseBody.data) //TODO 这里可能没取出来
    //   console.log("【预加载】得到图片回传response.data：", coverData)
    //   this.fileList = [];
    //   this.fileList.push({
    //     'url': coverData.url
    //   })
    //   console.log("【预加载】赋值给fileList后：", this.fileList)
    // })

    this.axios.get(getCoverUrl).then((response) => {
      console.log("【预加载】得到图片回传response：", response)
      let coverResponseBody = response.data
      if (coverResponseBody.state === 40400) {
        console.log(coverResponseBody.message)
        this.fileList = [];
        // 在这里执行相应的错误处理逻辑，例如显示一个提示消息等等
      } else {
        var coverData = this.getData(coverResponseBody.data) //TODO 这里可能没取出来
        console.log("【预加载】得到图片回传response.data：", coverData)
        this.fileList = [];
        this.fileList.push({
          'url': coverData.url
        })
      }
    })


    //向后端发送请求(没有jwt验证)
    let url = "http://localhost:10001/articleCategories/list-children-by-parent";
    this.axios.get(url).then((response) => {
      let responseBody = response.data;

      var categories = this.getData(responseBody.data);
      this.options = categories;
      console.log(this.options);

    })


  },

  beforeDestroy() {// 富文本编辑器
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },

})
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style><!--富文本编辑器css样式-->
<style scoped>
</style>