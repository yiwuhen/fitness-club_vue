<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="el-icon-s-promotion"></i> 后台管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-divider></el-divider>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
      <el-table-column label="头像" width="60" align="center">
        <template slot-scope="scope">
          <el-avatar :size="30" :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="120" header-align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="nickname" label="昵称" width="100" header-align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="phone" label="手机号码" width="120" align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="email" label="电子邮箱" width="150" header-align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="description" label="简介" header-align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="是否启用" width="120" align="center">
        <template slot-scope="scope">
          <el-switch
              v-model="scope.row.enable"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#999">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini"
                     @click="openEditDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini"
                     @click="openDeleteConfirm(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 以下是弹出的修改相册的对话框 -->
    <el-dialog title="编辑相册" :visible.sync="dialogFormVisible">
      <el-form :model="editForm">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input v-model="editForm.description" autocomplete="off"></el-input>
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
      dialogFormVisible: false,
      editForm: {
        id: '',
        name: '',
        description: '',
        sort: ''
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    openEditDialog(admin) {
      let title = '提示';
      let message = '您正在尝试编辑【' + admin.id + '-' + admin.username + '】的管理员，抱歉，此功能尚未实现……';
      this.$alert(message, title, {
        confirmButtonText: '确定'
      });
    },
    
    openDeleteConfirm(admin) {
      let message = '此操作将永久删除【' + admin.username + '】管理员，是否继续？';
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(admin);
      }).catch(() => {
      });
    },
    handleDelete(admin) {
      let url = 'http://localhost:10001/admins/' + admin.id + '/delete';
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('jwt')}})
          .post(url).then((response) => {
        let responseBody = response.data;
        if (responseBody.state == 20000) {
          this.$message({
            message: '删除管理员成功！',
            type: 'success'
          });
          this.loadAdminList();
        } else if (responseBody.state == 40400) {
          this.$alert(responseBody.message, '警告', {
            confirmButtonText: '确定',
            callback: action => {
              this.loadAdminList();
            }
          });
        } else {
          this.$message.error(responseBody.message);
        }
      });
    },
    loadAdminList() {
      let url = 'http://localhost:10001/admins';
      console.log('url = ' + url);

      this.axios
          .create({'headers': {'Authorization': localStorage.getItem('jwt')}})
          .get(url).then((response) => {
        let responseBody = response.data;
        console.log('state=' + responseBody.state);
        console.log('message=' + responseBody.message);
        this.tableData = responseBody.data;
      });
    }
  },
  mounted() {
    this.loadAdminList();
  }
}
</script>

<style scoped>

</style>