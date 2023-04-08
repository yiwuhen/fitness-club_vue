<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="el-icon-s-promotion"></i> 后台管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>文章修改</el-breadcrumb-item>
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
        <el-form-item label="文章分类" prop="selectedOptions">
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

        <el-form-item label="图片上传" prop="urls">
          <el-upload
              action="http://localhost:10001/articlePictures/upload"
              list-type="picture-card"
              ref="del"
              name="picFile"
              :limit="1"
              :file-list="fileList"
              :auto-upload="false"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
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

                @image-upload="handleImageUpload"
                @onCreated="onCreated"
                @onChange="onChange"
            />
          </div>
        </el-form-item>
        <div style="margin: 30px 0 30px 130px">
          <el-button type="primary" @click="submitForm('ruleForm')">修改文章</el-button>
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
      ///////////////////
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      ContentImg: [],
      //////////////////
      // 验证表单
      ruleForm: {
        title: undefined,
        description: undefined,
        sort: undefined,
        content: undefined,
        categoryId: undefined
      },//验证表单结束
      //////////
      //图片数组
      //获得一个级联值的最后的值
      // TODO 这里需要判断提交时，用户的封面是否发生变化？如果变化，就给isDelDB=1
      file: {url: '', articleId: undefined, isCover: '', description: '封面', isDelDB: 1},
      data: {
        description: '',
        width: '',
        height: '',
        isCover: 0,
        sort: undefined
      },
      //////////
      // 级联选择器
      selectedOptions: [],
      options: [],
      regionParams: {
        label: 'name', //这里可以配置你们后端返回的属性
        value: 'id',
        children: 'children',
        expandTrigger: 'hover',
      },

      // 表单验证规则
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
      },// 表单规则结束
      editor: null,//富文本
      html: '',//正文是html格式
      toolbarConfig: {},//富文本
      editorConfig: {
        placeholder: '请输入内容...',
        /////////////////
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

        /////////////////
      },//富文本
      mode: 'default' //富文本 or 'simple'
    }//return 结束！！！！！
  },// data结束！！！！！！！！！！！！！！！！！！！！！！！！！！！！
  computed: {},
  watch: {},
  methods: {
    ////////
    // 插入图片
    handleInsertedImage(image) {
      // JS 语法
      if (image == null) return

      const {src, alt, url, href} = image
      this.ContentImg.push(image)
      console.log("所有的图片:", this.ContentImg);
      console.log('inserted image', src, alt, url, href)


    },

    onChange(editor) {
      console.log("onChange", this.editor.getHtml()); // onChange 时获取编辑器最新内容
      console.log("获得当前的图片:", this.editor.getElemsByType('image'));
    },

    handleImageUpload(result) {
      console.log(result.data);
      // 图片上传成功的回调函数
      if (result.errno === 0) {
        const url = result.data.url
        this.$refs.editor.txt.insertImage(url)
      } else {
        alert('图片上传失败')
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      console.log("触发了handlePreView，file的值为：" + JSON.stringify(this.file));
      this.dialogVisible = true;
    },

    handleRemove() {
      //TODO 记得配置isDelDB属性，因为这个属性涉及到删除数据库里相应url的操作。
      //TODO 因为当前页面是修改文章，不涉及数据库图片删除的操作，所以isDelDB=1（已配置）
      const article = JSON.parse(this.$route.query.article);
      this.file.articleId = article.id;
      let url = "http://localhost:10001/articlePictures/deleteCoverByIsDelDB"; //删除服务器图片时的请求路径
      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('jwt')}})
          .post(url, this.file).then((response) => {
        let responseBody = response.data;
        if (responseBody.state == 20000) {
          let urlCoverVue = this.file.url;
          console.log("【删除封面】后台发回删除图片的url："+urlCoverVue);

            this.$refs.del.clearFiles();
            console.log("FileList清除后的长度是："+this.fileList.length)

          this.$message({
            message: '【删除封面】封面图片删除成功！',
            type: 'success'
          })
        } else {
          this.$message.error(responseBody.message);
        }
      })//then结束！！！

    },
    handleSuccess(response, file, fileList) {
      let url = "http://localhost:10001/img/" + response.data;
      console.log(url);
      file.url = url;
      //将有url赋值给文件的url
      this.file.url = file.url;
      this.file.isCover = 1;
      console.log("【上传封面】图像列表:" + JSON.stringify(fileList));
      this.fileList = fileList;
      console.log(this.fileList.length);
    },
    //////////
    //得到Json对象数据
    getData(array) {
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
    handleChange() {// 级联选择器方法
      const article = JSON.parse(this.$route.query.article);
      console.log("传过来的文章是：" + JSON.stringify(article));

      // 级联列表返回来的是一个数组,需要的是最后一个值,代表最后一层的id值
      this.selectById = this.selectedOptions[this.selectedOptions.length - 1];
      // 输出这个id的值
      console.log("你点击的分类是:" + this.selectById);
      // 根据Id值去查询文章并刷新文章列表
      let url = 'http://localhost:10001/articles/' + article.id + '/list';
      // 你要查询的详细分类的请求url
      console.log('你修改文章的请求路径是 = ' + url);
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
    submitForm(formName) {
      // 去重：
      // 属性说明：
      //
      //let i = arr.length - 1; i >= 0; i--
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

      const article = JSON.parse(this.$route.query.article);
      console.log("【发布文章】传过来的文章是：" + JSON.stringify(article));

      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = 'http://localhost:10001/articles/' + article.id + '/update';//别忘了这里换提交的地址
          console.log('【发布文章】装填id后的url请求路径为 = ' + url);

          // 装填WangEditor的内容到Content
          this.ruleForm.content = this.editor.getHtml();
          console.log('【发布文章】ruleForm.title = ' + this.ruleForm.title);
          console.log('【发布文章】ruleForm.description = ' + this.ruleForm.description);
          console.log('【发布文章】ruleForm.sort = ' + this.ruleForm.sort);
          console.log('【发布文章】ruleForm.content = ' + this.ruleForm.content);
          // 装填categoryId
          this.ruleForm.categoryId = this.selectById;

          let formData = this.qs.stringify(this.ruleForm);
          console.log('【发布文章】formData = ' + formData);

          this.axios
              .create({'headers': {'Authorization': localStorage.getItem('jwt')}})
              .post(url, formData).then((response) => {
            let responseBody = response.data;
            if (responseBody.state == 20000) {
              ///////////
              console.log("【发布文章】修改的文章的id值" + article.id);
              //将文章的id赋值给图片的对应文章id
              this.file.articleId = article.id;
              console.log("【发布文章】图片对应的文章Id = " + this.file.articleId)
              //图片发送异步请求
              //将封装的图片发送请求
              let pictureURI = "http://localhost:10001/articlePictures/add-new" //
              let fileData = this.qs.stringify(this.file);
              console.log("【发布文章】图片的信息是:" + fileData);
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
    }, // methods结束
    onCreated(editor) {//富文本
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    resetForm(formName) { //重置
      this.$refs[formName].resetFields(); // 重置element ui组件内的信息
      this.editor.setHtml('');
    }
  },// methods结束！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
  mounted() {
    //TODO 在尝试一个很新的东西，如果炸了，恢复下面两段代码
    // 拿到上个页面传过来的id
    // let articleId = this.$route.query.id;
    // console.log(articleId);

    const article = JSON.parse(this.$route.query.article);
    console.log("传过来的文章是：" + JSON.stringify(article));

    // 设置请求路径 TODO
    // let oldArticleUrl = "http://localhost:10001/articles/"+articleId;
    let oldArticleUrl = "http://localhost:10001/articles/" + article.id;
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


    //向后端发送请求(没有jwt验证)
    let url = "http://localhost:10001/articleCategories/list-children-by-parent";
    this.axios.get(url).then((response) => {
      let responseBody = response.data;

      var categories = this.getData(responseBody.data);
      this.options = categories;
      console.log(this.options);

    })
  },// mounted结束！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
  beforeDestroy() {//富文本
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  } //！！！
})// extend结束！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style><!--富文本编辑器css样式-->
<style scoped>

</style>