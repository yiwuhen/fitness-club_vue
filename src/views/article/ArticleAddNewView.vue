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

        <el-form-item label="文章分类" prop="selectedOptions">
          <!--↓↓超级牛逼的级联选择器↓↓-->
          <el-cascader
              v-model="selectedOptions"
              :options="options"
              :props="regionParams"
              @change="handleChange"
          >
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
              name="picFile"
              :limit="1"
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
      ///////////////////
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
      file: {url: '', articleId: undefined, isCover: '', description: '封面', isDelDB: 0},
      data: {
        description: '',
        width: '',
        height: '',
        isCover: 0,
        sort: undefined
      },
      //////////
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
          {min: 1, max: 30, message: '长度在 2 到 15 个字符', trigger: 'blur'}
        ],
        selectedOptions:[
          {required:false,message:'请选择分类',trigger:'change',type:'array'}
        ],
        description: [
          {required: true, message: '请输入文章简介', trigger: 'blur'},
          {min: 1, max: 300, message: '长度在 2 到 30 个字符', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入品牌排序序号', trigger: 'blur'},
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
    }// return结束！！！！！


  },// data作用域结束！！！！！
  computed: {},
  watch: {},
  methods: {
    //////////
    //富文本编辑器插入图片后的回调函数，该函数通常用于将插入的图片保存起来，以便在提交表单或者保存编辑器内容时，将这些图片一同上传到服务器端。
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


    /*
    用于在点击缩略图时展示对应的大图。具体来说，该方法会将当前点击的文件的 URL 赋值给 "dialogImageUrl" 属性，
    并将 "dialogVisible" 属性设置为 true，从而展示一个弹窗(dialog)，在弹窗中展示对应的大图。
    */
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 和上面的差不多，但是参数不同
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      console.log("触发了handlePreView，file的值为：" + JSON.stringify(this.file));
      this.dialogVisible = true;
    },


    handleRemove() {
      //TODO 记得配置isDelDB属性，因为这个属性涉及到删除数据库里相应url的操作。
      //TODO 因为当前页面是发布文章，不涉及数据库图片删除的操作，所以isDelDB=0（已配置）
      let url = "http://localhost:10001/articlePictures/deleteCoverByIsDelDB"; //删除文件时的请求路径
      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('jwt')}})
          .post(url, this.file).then((response) => {
        let responseBody = response.data;
        if (responseBody.state == 20000) {
          this.$message({
            message: '封面图片删除成功！',
            type: 'success'
          })
          console.log("执行了删除封面操作，封面数量:" + this.fileList.length);
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
      this.fileList = fileList;
      console.log("执行了上传封面操作，封面数量:" + this.fileList.length);
      console.log("封面图是:" + JSON.stringify(file));
    },


    //////////
    getData(array) { // 级联选择器-取出分类、添加隐显方法
      for (let i = 0; i < array.length; i++) {
        if (array[i].children.length) {
          array[i].children = this.getData(array[i].children); // 递归调用
        } else {
          //遍历元素并判断，挨个添加disabled
          array = array.map(obj => {
            if (obj.enable === 1) {
              obj.disabled = false;
            } else {
              obj.disabled = true;
            }
            console.log("【getData】取出了obj：", obj)
            return obj;
          });
          //遍历结束
          array[i].children = null; // 将 children 设置为空数组
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
      console.log("当前的封面图路径",this.file)
      if (this.file.url === "") {
        this.$message({
          showClose: true,
          message: "必须上传封面图!",
          type: 'error'
        });
        return;
      }
      // 去重：
      // 属性说明：
      //
      //let i = arr.length - 1; i >= 0; i--
      for (let i = this.ContentImg.length - 1; i >= 0; i--) {
        for (let j = 0; j < this.editor.getElemsByType('image').length; j++) {
          if (this.ContentImg[i].src == this.editor.getElemsByType('image')[j].src) {
            // this.ContentImg[i].url=undefined;
            this.ContentImg.splice(i, 1);
          }
        }
      }
      // 最终要删除的多余的图片
      console.log("最终的佼佼图片:", this.ContentImg)


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

              ///////////
              // 如果文章正文上传成功，那么执行图片保存
              // 如果保存文章的部分成功,则返回id值,让后面部分执行
              let articleId = responseBody.data;
              console.log("准备保存图片到数据库，文章的id值" + articleId);
              //将文章的id赋值给图片的对应文章id
              this.file.articleId = articleId;
              //图片发送异步请求
              //将封装的图片发送请求
              let pictureURI = "http://localhost:10001/articlePictures/add-new";
              let fileData = this.qs.stringify(this.file);
              console.log("图片的信息是:" + fileData);
              this.axios.create({'headers': {'Authorization': localStorage.getItem('jwt')}})
                  .post(pictureURI, fileData).then((response) => {
                let FileResponseData = response.data;
                console.log("返回的消息是:" + FileResponseData.state)
              })
              ///////////

              // 提交“删除前端瞎几把给服务器上传多余的图片”请求
              let delImgUrl = "http://localhost:10001/articlePictures/deleteUnnecessaryPic";
              console.log("删除多余图片的请求路径：" + delImgUrl)
              this.axios.create({'headers': {'Authorization': localStorage.getItem('jwt')}})
                  .post(delImgUrl, this.ContentImg).then((response) => {
                let delImgUrlResponseData = response.data;
                console.log("提交了删除多余图片的请求，返回的消息是：" + delImgUrlResponseData) //TODO
              })

              this.$message({
                message: '文章发布成功！即将刷新页面！',
                type: 'success'
              });
              this.resetForm(formName);

              // 延迟1秒后刷新页面
              setTimeout(() => {
                location.reload();
              }, 1000);

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
  }, // methods结束！！！！！！

  mounted() {
    console.log("开始预加载")
    //向后端发送请求
    let url = "http://localhost:10001/articleCategories/list-children-by-parent";
    this.axios.create({'headers': {'Authorization': localStorage.getItem('jwt')}})
        .get(url).then((response) => {
      let responseBody = response.data;
      var categories = this.getData(responseBody.data);
      this.options = categories;
      console.log(this.options);
    })
  }, // mounted结束！！！！！！

  beforeDestroy() {//富文本
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }

})//extend结束！！！！！！！！！
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style><!--富文本编辑器css样式-->
<style scoped>

</style>