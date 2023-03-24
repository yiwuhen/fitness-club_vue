<template>
  <div>
    <!-- 外层容器 -->
    <el-container>
      <!-- 上半区域：顶栏 -->
      <el-header class="layout-header">
        <h1>健身吧后台管理</h1>
      </el-header>
      <!-- 下半区域 -->
      <el-container class="layout-body">
        <!-- 下半区域的左侧边栏 -->
        <el-aside class="layout-aside">
          <el-menu
              router
              :default-active="activeMenuItemPath"
              class="el-menu-vertical-demo"
              background-color="#222"
              text-color="#fff"
              active-text-color="#fff">
            <!-- 首页 -->
            <el-menu-item index="/sport/index">
              <i class="el-icon-s-home"></i>
              <span>首页</span>
            </el-menu-item>
            <!-- 用户页面 -->
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-s-tools"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item index="/user/UserListView.vue">
                <i class="el-icon-circle-plus"></i>
                <span>用户列表</span>
              </el-menu-item>
            </el-submenu>


            <!-- 商品管理 -->
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-s-goods"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item index="3-1">
                <i class="el-icon-circle-plus"></i>
                <span>商品列表</span>
              </el-menu-item>
              <el-menu-item index="3-2">
                <i class="el-icon-circle-plus"></i>
                <span>添加商品</span>
              </el-menu-item>
            </el-submenu>


            <!-- 订单管理 -->
            <el-submenu index="4" >
              <template slot="title">
                <i class="el-icon-s-order"></i>
                <span>订单管理</span>
              </template>
            </el-submenu>
            <!-- 文章管理 -->
            <el-submenu index="5" >
              <template slot="title">
                <i class="el-icon-s-ticket"></i>
                <span>文章管理</span>
              </template>
              <el-menu-item index="/article/ArticleAddNewView.vue">
                <i class="el-icon-circle-plus"></i>
                <span>文章发布</span>
              </el-menu-item>

              <el-menu-item index="/article/ArticleListView.vue">
                <i class="el-icon-circle-plus"></i>
                <span>文章列表</span>
              </el-menu-item>

            </el-submenu>

            <!-- 类别管理 -->
            <el-submenu index="6" >
              <template slot="title">
                <i class="el-icon-s-ticket"></i>
                <span>类别管理</span>
              </template>
              <el-menu-item index="/category/CategoryListView.vue">
                <i class="el-icon-circle-plus"></i>
                <span>类别列表</span>
              </el-menu-item>

              <el-menu-item index="/category/CategoryAddNewView.vue">
                <i class="el-icon-circle-plus"></i>
                <span>类别添加</span>
              </el-menu-item>

            </el-submenu>

          </el-menu>
        </el-aside>
        <!-- 下半区域的右侧主体 -->
        <el-main class="layout-main">
          <!-- 由其它视图来显示 -->
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>


export default {
  data(){
    return{
      activeMenuItemPath: ''
    }
  },
  methods:{

  },
  mounted() {
    let path = this.$router.currentRoute.path;
    console.log(path);
    if (path==('/article/ArticleUpdateView.vue')||path==('/article/ArticleListView.vue')) {
      path = '/article/ArticleListView.vue';
    }
    this.activeMenuItemPath = path;
  }
}
</script>
<style>
.layout-header {
  background: #1684b0;
}

.layout-header h1 {
  color: #fff;
  line-height: 60px;
}

.layout-body {
  position: absolute;
  top: 60px;
  bottom: 0;
  left: 0;
  right: 0;
}

.layout-aside {
  background: #222;
}

.layout-aside i {
  color: #fff !important;
}

.layout-main {
  background: #fff;
}

.el-menu-item.is-active {
  background: #2d3c4d !important;
}
</style>