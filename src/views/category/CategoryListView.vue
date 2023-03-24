<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="el-icon-s-promotion"></i> 后台管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>类别列表</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in history" :key="item.id"><span v-text="item.name"></span></el-breadcrumb-item>
    </el-breadcrumb>

    <el-divider></el-divider>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
      <el-table-column prop="name" label="名称" width="180" header-align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="keywords" label="关键词列表" header-align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="sort" label="排序序号" width="100" align="center"></el-table-column>
      <el-table-column label="是否启用" width="120" align="center">
        <template slot-scope="scope">
          <el-switch
              @change="updateEnable(scope.row)"
              v-model="scope.row.enable"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#999">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="显示在导航栏" width="120" align="center">
        <template slot-scope="scope">
          <el-switch
              v-model="scope.row.isDisplay"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#999">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="子级类别" width="100" align="center">
        <template slot-scope="scope">
          <el-button size="mini" :disabled="scope.row.isParent == 0"
                     @click="showSubCategoryList(scope.row)">
            查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini"
                     @click="openEditDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini"
                     :disabled="scope.row.isParent == 1"
                     @click="openDeleteConfirm(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="currentParentId != 0" style="text-align: right; margin: 10px 0;">
      <el-button @click="goBack()">返回</el-button>
    </div>

    <!-- 以下是弹出的修改类别的对话框 -->
    <el-dialog title="编辑类别" :visible.sync="dialogFormVisible">
      <el-form :model="editForm">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="关键词列表" :label-width="formLabelWidth">
          <el-input v-model="editForm.keywords" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" :label-width="formLabelWidth">
          <el-input v-model="editForm.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序序号" :label-width="formLabelWidth">
          <el-input v-model="editForm.sort" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditForm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      currentParentId: 0,
      history: [],
      dialogFormVisible: false,
      editForm: {
        id: '',
        name: '',
        keywords: '',
        icon: '',
        sort: ''
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    goBack() {
      let parentCategory = this.history[this.history.length - 1];
      this.history.pop();
      this.currentParentId = parentCategory.parentId;
      this.loadCategoryList();

      for (let i = 0; i < this.history.length; i++) {
        console.log(this.history[i].name);
      }
      console.log('-----------');
    },
    showSubCategoryList(category) {
      this.history[category.depth - 1] = category;
      this.currentParentId = category.id;
      this.loadCategoryList();

      for (let i = 0; i < this.history.length; i++) {
        console.log(this.history[i].name);
      }
      console.log('-----------');
    },
    updateEnable(category) {
      let enableStatus = [
        {'url': '/disable', text: '禁用'},
        {'url': '/enable', text: '启用'}
      ];
      let url = 'http://localhost:9080/categories/'
          + category.id + enableStatus[category.enable].url;
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('jwt')}})
          .post(url).then((response) => {
        let responseBody = response.data;
        if (responseBody.state == 20000) {
          this.$message({
            message: enableStatus[category.enable].text + '类别成功！',
            type: 'success'
          });
          this.loadCategoryList();
        } else if (responseBody.state == 40400) {
          this.$alert(responseBody.message, '警告', {
            confirmButtonText: '确定',
            callback: action => {
              this.loadCategoryList();
            }
          });
        } else {
          this.$message.error(responseBody.message);
        }
      });
    },
    openEditDialog(category) {
      let url = 'http://localhost:9080/categories/' + category.id;
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('jwt')}})
          .get(url).then((response) => {
        let responseBody = response.data;
        if (responseBody.state == 20000) {
          this.dialogFormVisible = true;
          this.editForm = responseBody.data;
        } else {
          this.$alert(responseBody.message, '警告', {
            confirmButtonText: '确定',
            callback: action => {
              this.loadCategoryList();
            }
          });
        }
      });
    },
    submitEditForm() {
      let url = 'http://localhost:9080/categories/' + this.editForm.id + '/update';
      console.log('url = ' + url);
      let formData = this.qs.stringify(this.editForm);
      console.log('formData = ' + formData);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('jwt')}})
          .post(url, formData).then((response) => {
        let responseBody = response.data;
        if (responseBody.state == 20000) {
          this.$message({
            message: '修改类别成功！',
            type: 'success'
          });
          this.loadCategoryList();
          this.dialogFormVisible = false;
        } else if (responseBody.state == 40400) {
          this.$alert(responseBody.message, '警告', {
            confirmButtonText: '确定',
            callback: action => {
              this.dialogFormVisible = false;
              this.loadCategoryList();
            }
          });
        } else {
          this.$message.error(responseBody.message);
        }
      });
    },
    openDeleteConfirm(category) {
      let message = '此操作将永久删除【' + category.name + '】类别，是否继续？';
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(category);
      }).catch(() => {
      });
    },
    handleDelete(category) {
      let url = 'http://localhost:9080/categories/' + category.id + '/delete';
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('jwt')}})
          .post(url).then((response) => {
        let responseBody = response.data;
        if (responseBody.state == 20000) {
          this.$message({
            message: '删除类别成功！',
            type: 'success'
          });
          this.loadCategoryList();
        } else if (responseBody.state == 40400) {
          this.$alert(responseBody.message, '警告', {
            confirmButtonText: '确定',
            callback: action => {
              this.loadCategoryList();
            }
          });
        } else {
          this.$message.error(responseBody.message);
        }
      });
    },
    loadCategoryList() {
      let url = 'http://localhost:9080/categories/list-by-parent?parentId=' + this.currentParentId;
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('jwt')}})
          .get(url).then((response) => {
        let responseBody = response.data;
        this.tableData = responseBody.data;
      });
    }
  },
  mounted() {
    this.loadCategoryList();
  }
}
</script>

<style scoped>

</style>