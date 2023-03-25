<template>

  <div>

    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="el-icon-s-promotion"></i> 后台管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>文章发布</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <!-- 添加表单-->

    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="120px"
             label-position="right">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入文章标题" clearable :style="{width: '100%'}">
        </el-input>
      </el-form-item>
      <el-form-item label="文章描述" prop="description">
        <el-input v-model="formData.description" type="textarea" placeholder="请输入文章描述" show-word-limit
                  :autosize="{minRows: 4, maxRows: 5}" :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label="排序序号" prop="sort">
        <el-input v-model="formData.sort" placeholder="请输入排序序号" clearable :style="{width: '100%'}"></el-input>
      </el-form-item>

      <el-form-item label="图片上传" prop="urls" >
        food2.jpeg
        <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="formData.fileList"
            list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章分类" prop="category">
        <el-cascader
            v-model="selectedOptions"
            :options="options"
            :props="regionParams"
            @change="handleChange"></el-cascader>

      </el-form-item>
      <el-form-item label="文章正文" prop="context" >

        <el-input
            type="textarea"
            :autosize="{ minRows: 10, maxRows:20}"
            placeholder="请输入内容"
            v-model="formData.textarea">
        </el-input>

      </el-form-item>

      <el-form-item size="large">
        <el-button type="primary" @click="submitForm('elForm')">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>

    </el-form>




  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      selectedOptions:[],
      regionParams: {
        label: 'name', //这里可以配置你们后端返回的属性
        value: 'id',
        children:'children',
        expandTrigger: 'hover',
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
        sort: [{
          required: true,
          message: '请输入排序序号',
          trigger: 'blur'
        }, {
          pattern: /^\+?[1-9][0-9]*$/,
          message: '只能是正整数',
          trigger: 'blur'
        }],
      },
      formData: {
        //文章标题
        title: undefined,
        //文章描述
        description: undefined,
        //文章排序
        sort: undefined,
        //文章正文
        textarea: undefined,
        //图片数组
        fileList: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
          {
            name: 'food2.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          },
          {name: 'food3.jpeg', url: "https://www.jianshen8.com/templets/jianshen8/images/logo.png\n"}
        ],
        //获得一个级联值的最后的值
        categoryId:'',


      },
      options: []

    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    //向后端发送请求(没有jwt验证)
    let url = "http://localhost:10001/articleCategories/list-children-by-parent";
    this.axios.get(url).then((resposne)=>{
      let responseBody= resposne.data;

     var categories = this.getData(responseBody.data);
      this.options=categories;
      console.log(this.options);

    })
  },
  methods: {
    getData(array){
      for(var i=0;i<array.length;i++){
        if(array[i].children.length<1){
          array[i].children=undefined;
        }else{
          this.getData(array[i].children);
        }
      }
      return array;
    },
    handlePreview(){},
    handleRemove(){},
    handleChange(){
      //
      //级联列表返回来的是一个数组,需要的是最后一个值,代表最后一层的id值
     this.formData.categoryId= this.selectedOptions[this.selectedOptions.length-1];
     console.log("数组的值:"+this.selectedOptions);

    },
    submitForm(formName) {
      console.log(this.formData.fileList);
      this.$refs[formName].validate(valid => {
        if (valid) {
          //获得form中的所有值
          let formData = this.qs.stringify(this.formData);
          let url = "http://localhost:9080/categories/xxxxx";
          this.axios.post(url,formData).then((response)=>{
            console.log('formData = ' +response);
          })

        }else{

        }

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




