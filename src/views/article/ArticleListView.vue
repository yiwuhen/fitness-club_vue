<!--文章列表-->
<template>
  <div>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
        <el-breadcrumb-item :to="{ path: '/' }">
          <i class="el-icon-s-promotion"></i> 后台管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <!--↓↓超级牛逼的级联选择器↓↓-->
          <el-cascader
              v-model="selectedOptions"
              :options="options"
              :props="regionParams"
              @change="handleChange">
          </el-cascader>
          <!--↑↑超级牛逼的级联选择器↑↑-->


        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-divider></el-divider>
    <!-- 文章列表:表单形式 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
      <!--     <el-table-column label="头像" width="60" align="center">-->
      <!--       <template slot-scope="scope">-->
      <!--         <el-avatar :size="30" :src="scope.row.avatar"></el-avatar>-->
      <!--       </template>-->
      <!--     </el-table-column>-->
      <el-table-column prop="title" label="文章标题" header-align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="description" label="文章简述" header-align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="categoryName" label="类别" width="100" header-align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="viewCount" label="浏览量" width="80" align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="sort" label="排序序号" width="80" header-align="center"
                       :show-overflow-tooltip="true"></el-table-column>

      <!--      <el-table-column label="是否启用" width="120" align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-switch-->
      <!--              v-model="scope.row.enable"-->
      <!--              :active-value="1"-->
      <!--              :inactive-value="0"-->
      <!--              active-color="#13ce66"-->
      <!--              inactive-color="#999">-->
      <!--          </el-switch>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="是否显示在导航栏" width="120" align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-switch-->
      <!--              v-model="scope.row.isDisplay"-->
      <!--              :active-value="1"-->
      <!--              :inactive-value="0"-->
      <!--              active-color="#13ce66"-->
      <!--              inactive-color="#999">-->
      <!--          </el-switch>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <!-- 编辑
          有正文,
          有图片,
          是否为父级,
          有类别,
          有id,
          隐藏修改:流览量为 0
          -->
          <el-button type="primary" icon="el-icon-edit" circle size="mini"
                     @click="openUpdateView(scope.row)"></el-button>
          <!--
          判断是否为父级
             后端判断是否存在,存在往下走,
                               是:可以删除
                               否:提示先删除子类,再删除父类
                            不存在,提示不存在
          -->
          <el-button type="danger" icon="el-icon-delete" circle size="mini"
                     @click="openDeleteConfirm(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 加上分割线-->

  </div>
</template>

<script>
export default {
  data() {
    return {
      selectById: '',
      selectedOptions: [],
      regionParams: {
        label: 'name', //这里可以配置你们后端返回的属性
        value: 'id',
        children: 'children',
        expandTrigger: 'hover',
      },
      options: [],
      tableData: []
    }
  },
  methods: {
    getData(array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].children.length < 1) {
          array[i].children = undefined;
        } else {
          this.getData(array[i].children);
        }
      }
      return array;
    },
    handleChange() {
      // 级联列表返回来的是一个数组,需要的是最后一个值,代表最后一层的id值
      this.selectById = this.selectedOptions[this.selectedOptions.length - 1];
      // 输出这个id的值
      console.log("你点击的分类是:" + this.selectById);
      // 根据Id值去查询文章并刷新文章列表
      let url = 'http://localhost:10001/articles/' + this.selectById + '/list';
      // 你要查询的详细分类的请求url
      console.log('你点击分类后的请求路径是 = ' + url);
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
    //初始化文章列表
    initArticleList() {
      //向后端发送复杂请求,其实带上
      //////要修改端口号
      let url = 'http://localhost:10001/articles';
      console.log('url = ' + url);
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
    //删除列表 的 提示框
    openDeleteConfirm(article) {
      //弹框提示信息
      let message = '此操作将永久删除【' + article.title + '】文章，是否继续？';

      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        //回调函数
      }).then(() => {
        //处理删除
        this.handleDelete(article);
      }).catch(() => {
      });
    },
    //z向后端发送请求,处理删除
    handleDelete(article) {
      //向后端发送请求
      let url = "http://localhost:10001/articles/" + article.id + "/delete";
      console.log(url);
      this.axios.create({'headers': {'Authorization': localStorage.getItem('jwt')}}).post(url).then((response) => {
        let responseBody = response.data;
        if (responseBody.state == 20000) {
          //提示删除成功
          this.$message({
            message: '删除文章成功！',
            type: 'success'
          });
          //加载页面
          this.initArticleList();
          //如果不是20000,就说明没有删除成功
        } else if (response.state == 40400) {
          //提示没有删除成功,将后端传来的信息显示
          this.$alert(responseBody.message, '警告', {
            confirmButtonText: '确定',
            callback: action => {
              //关闭之后的回调函数:再加载一次页面
              this.initArticleList();
            }
          });
        } else {
          //没有删除成功,提示其他信息
          this.$message.error(responseBody.message);
        }
      })
    },
    //修改编辑,打开新页面
    openUpdateView(article) {
      //TODO 尝试一个新方法，如果新方法失败，请恢复下面两行代码
      // console.log("要修改的文章是："+JSON.stringify(article)+"，它的id是：" + article.id);
      // this.$router.push("/article/ArticleUpdateView.vue/?id=" + article.id);

      //将用户点击的article对象全部push到修改页面
      this.$router.push({
        path: '/article/ArticleUpdateView.vue',
        query: {
          article: JSON.stringify(article)
        }
      });
    },
    //选择板块 选择文章
    selectArticle(value) {
      //选择选项时传入value值 需要后台有对应方法 得到value的值，并调用相应查询方法
      let url = 'http://localhost:65535/selectByArticleCateGory/' + value;
      console.log('url = ' + url, value);
      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('jwt')}})//加上请求头,里面是jwt
          .get(url, value).then((response) => {
        let responseBody = response.data;
        //获取状态
        console.log('state=' + responseBody.state);
        //获取后端传来的信息
        console.log('message=' + responseBody.message);
        //将信息赋值给表单数组
        this.tableData = responseBody.data;
      });
    }

  },
  mounted() {
    console.log("开始预加载")
    //向后端发送请求
    let url = "http://localhost:10001/articleCategories/list-children-by-parent";
    this.axios.create({'headers': {'Authorization': localStorage.getItem('jwt')}})
        .get(url).then((response) => {
      let responseBody = response.data;
      console.log("查到的级联数据",responseBody.data)
      var categories = this.getData(responseBody.data);
      this.options = categories;
      console.log(this.options);

    })
    //  初始化加载
    this.initArticleList();

    //初始化第一层
  }
}
</script>

