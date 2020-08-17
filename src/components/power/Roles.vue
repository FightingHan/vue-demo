<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>rights管理</el-breadcrumb-item>
      <el-breadcrumb-item>roles Manager</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-table-column>
          <!--add roles button-->
          <el-button type="primary">add rOles</el-button>
        </el-table-column>
      </el-row>
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!--level1 data-->
            <el-row
              class="expand-animation vcenter"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!--level2 data-->
                <el-row
                  :class="['bdtop']"
                  v-for="item2 in item1.children"
                  :key="item2.id"
                  class="vcenter"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!--level3 data-->
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--index column-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="roleName" prop="roleName"></el-table-column>
        <el-table-column label="roleDesc" prop="roleDesc"></el-table-column>
        <el-table-column label="operation" width="250px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editRoleDialogVisible = true"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              @click="removeRoleById(scope.row.id)"
              icon="el-icon-delete"
            ></el-button>
            <el-button
              size="mini"
              type="warning"
              @click="showSetRightDialog(scope.row)"
              icon="el-icon-setting"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--edit role info dialog-->
      <el-dialog
        title="edit role info"
        :visible.sync="editRoleDialogVisible"
        @close="editRoleDialogClose"
      >
        <span>
          <el-form
            ref="editRoleFormRef"
            :model="editRoleForm"
            :rules="editRoleFormRules"
            label-width="90px"
          >
            <!--用户名-->
            <el-form-item label="roleName" prop="roleName">
              <el-input
                v-model="editRoleForm.roleName"
                prefix-icon="el-icon-user"
              ></el-input>
            </el-form-item>
            <el-form-item label="roleDesc" prop="roleDesc">
              <el-input
                v-model="editRoleForm.roleDesc"
                prefix-icon="el-icon-chat-line-square"
              ></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRoleDialogVisible = false">cancel</el-button>
          <el-button @click="editRole" type="primary">ensure</el-button>
        </span>
      </el-dialog>

      <!--set right to role dialog-->
      <el-dialog
        title="edit role info"
        :visible.sync="showRightDialogVisible"
        @close="SetRightDialogCLose"
      >
        <el-tree
          ref="treeRef"
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defkeys"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showRightDialogVisible = false">cancel</el-button>
          <el-button @click="allotRights" type="primary"
            >ensure</el-button
          ></span
        >
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //all role data
      roleList: [],
      editRoleForm: {
        roleDesc: '',
        roleName: ''
      },
      editRoleDialogVisible: false,
      editRoleFormRules: {
        roleName: [
          {
            required: true,
            meaasge: 'please input role name',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            meaasge: 'please keep the length between 3 and 10',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true,
            message: 'please input role Descrition',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            trigger: 'blur'
          }
        ]
      },
      showRightDialogVisible: false,
      //all rights tree
      rightsList: [],
      //el-tree
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //default right tree data
      defkeys: [],
      roleId: ''
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('get role list is failed!')
      }

      this.roleList = res.data
    },
    //remove role
    async removeRoleById(id) {
      const confirmResult = await this.$confirm(
        'this operation will remove role forever, would you want to remove this role? ',
        'hint',
        {
          confirmButtonText: 'ensure',
          cancelButtonText: 'cancel',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'cannel') {
        const { data: res } = await this.$http.delete('roles/' + id)

        if (res.meta.status != 200) return this.$message.error(res.meta.msg)

        this.getRoleList()
        this.$message.success('remove user successed!')
      } else {
        this.$message.info('you cancel this operation')
      }
    },
    settingRole(id) {},
    //edit role info
    editRole(id) {
      this.editRoleDialogVisible = false
    },
    editRoleDialogClose() {
      this.$refs.editRoleFormRef.resetFields()
    },
    async removeRightById(role, rightsId) {
      const confirmResult = await this.$confirm(
        'this operation will remove this rights form role ? ',
        'hint',
        {
          confirmButtonText: 'ensure',
          cancelButtonText: 'cancel',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'cannel') {
        const { data: res } = await this.$http.delete(
          'roles/' + role.id + '/rights/' + rightsId
        )

        if (res.meta.status != 200) return this.$message.error(res.meta.msg)

        //only update data.not refresh all page
        role.children = res.data
        this.$message.success('remove user successed!')
      } else {
        this.$message.info('you cancel this operation')
      }
    },
    async showSetRightDialog(role) {
      this.roleId = role.id
      this.getLeafKeys(role, this.defkeys)

      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200)
        return this.$message.error('get all rights list is failed')

      //get rights tree to our rightList
      this.rightsList = res.data
      console.log(this.rightList)

      this.showRightDialogVisible = true
    },
    SetRightDialogCLose() {
      this.defkeys = []
    },
    //use leaf to get all role rights
    getLeafKeys(node, arr = []) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    //click and give rights to role
    async allotRights(roleId) {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        'roles/' + this.roleId + '/rights',
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getRoleList()

      this.showRightDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
.expand-animation {
  max-height: 200px;
  transform-origin: 50% 0;
  -webkit-animation: slide-down 0.5s ease-in;
  transition: all 0.3s ease-out;
}
@-webkit-keyframes slide-down {
  0% {
    transform: scale(1, 0);
  }
  25% {
    transform: scale(1, 1.05);
  }
  50% {
    transform: scale(1, 0.95);
  }
  75% {
    transform: scale(1, 1.05);
  }
  100% {
    transform: scale(1, 1);
  }
}
</style>
