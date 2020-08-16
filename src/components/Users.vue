<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--搜索框与搜索按钮-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入搜索的内容"
            clearable
            v-model="queryInfo.query"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!--数据区-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="手机" prop="mobile"></el-table-column>
        <el-table-column label="状态">
          <!--scope就是当前的对象-->
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->

            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
            ></el-button>
            <!--分配角色按钮-->
            <el-tooltip
              placement="top"
              effect="dark"
              content="分配角色"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!--添加用户对话框-->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        @close="addUserDialogClose"
      >
        <span>
          <el-form
            ref="addUserFormRef"
            :model="addUserForm"
            :rules="addUserFormRules"
            label-width="90px"
          >
            <!--用户名-->
            <el-form-item label="username" prop="username">
              <el-input
                v-model="addUserForm.username"
                prefix-icon="el-icon-user"
              ></el-input>
            </el-form-item>
            <!--密码-->
            <el-form-item label="password" prop="password">
              <el-input
                v-model="addUserForm.password"
                type="password"
                prefix-icon="el-icon-lock"
              ></el-input>
            </el-form-item>
            <el-form-item label="email" prop="email">
              <el-input
                v-model="addUserForm.email"
                type="email"
                prefix-icon="el-icon-gmail"
              ></el-input>
            </el-form-item>
            <el-form-item label="mobile" prop="mobile">
              <el-input
                v-model="addUserForm.mobile"
                prefix-icon="el-icon-mobile"
              ></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">
            cancel
          </el-button>
          <el-button @click="addUser" type="primary">ensure</el-button>
        </span>
      </el-dialog>

      <!--edit user info dialog-->
      <el-dialog
        title="edit user info"
        :visible.sync="editDialogVisible"
        @close="editUserDialogClose"
      >
        <span>
          <el-form
            ref="editUserFormRef"
            :model="editUserForm"
            :rules="addUserFormRules"
            label-width="90px"
          >
            <!--用户名-->
            <el-form-item label="username">
              <el-input
                v-model="editUserForm.username"
                prefix-icon="el-icon-user"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="email" prop="email">
              <el-input
                v-model="editUserForm.email"
                type="email"
                prefix-icon="el-icon-gmail"
              ></el-input>
            </el-form-item>
            <el-form-item label="mobile" prop="mobile">
              <el-input
                v-model="editUserForm.mobile"
                prefix-icon="el-icon-mobile"
              ></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">
            cancel
          </el-button>
          <el-button @click="editUser" type="primary">ensure</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    //vaildate for email
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('email address is no valid'))
    }
    //vaildate for mobile
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^((\+|00)86)?((134\d{4})|((13[0-3|5-9]|14[1|5-9]|15[0-9]|16[2|5|6|7]|17[0-8]|18[0-9]|19[0-2|5-9])\d{8}))$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('mobile is no valid'))
    }
    return {
      input: '',
      //获取用户列表的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 8
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      //add user info
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //validitate for add user info
      addUserFormRules: {
        username: [
          {
            required: true,
            meaasge: 'please input username',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            meaasge: 'please keep the length between 3 and 10',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: 'please input password',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 12,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: 'please input mobile',
            trigger: 'blur'
          },
          {
            //use my validate rules
            validator: checkMobile,
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: 'please input email',
            trigger: 'blur'
          },
          {
            //use my validate rules
            validator: checkEmail,
            trigger: 'blur'
          }
        ]
      },
      //edit user INfo
      editDialogVisible: false,
      editUserForm: {}
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    //监听最新的pageSize改变
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    //监听页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStatusChange(userInfo) {
      this.$message.closeAll()
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新状态成功！')
    },
    //reset userInfo form
    addUserDialogClose() {
      this.$refs.addUserFormRef.resetFields()
    },
    addUser() {
      this.$refs.addUserFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('users', this.addUserForm)
          res.meta.status !== 201
            ? this.$message.error(res.meta.msg)
            : this.$message.success('add user successd!!! ')
          console.log(res)
          //close the dialog
          this.addDialogVisible = false
          //refresh userList data
          this.getUserList()
        } else return
      })
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('search user failed')
      }
      this.editUserForm = res.data
      this.editDialogVisible = true
    },
    editUserDialogClose() {
      this.$refs.editUserFormRef.resetFields()
    },
    //edit user info and commit
    editUser() {
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'users/' + this.editUserForm.id,
          {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }

        this.editDialogVisible = false

        this.getUserList()

        this.$message.success('update user info is successed!!')
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
