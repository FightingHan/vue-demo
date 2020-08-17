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
              class="expand-rights"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!--level2 data-->
                <el-row :class="['bdtop']" v-for="item2 in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!--level3 data-->
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                    >{{ item3.authName }}</el-tag>
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
              @click="editRoles(scope.row.id)"
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
              @click="settingRoles(scope.row.id)"
              icon="el-icon-setting"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
	export default {
		data() {
			return {
				//all role data
				roleList: [],
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
			editRoles(id) {},
			async removeRoleById(id) {
				const confirmResult = await this.$confirm(
					'this operation will remove role forever, would you want to remove this role? ',
					'hint',
					{
						confirmButtonText: 'ensure',
						cancelButtonText: 'cancel',
						type: 'warning',
					}
				).catch((err) => err)

				if (confirmResult !== 'cannel') {
					const { data: res } = await this.$http.delete('roles/' + id)

					if (res.meta.status != 200) return this.$message.error(res.meta.msg)

					this.getRoleList()
					this.$message.success('remove user successed!')
				} else {
					this.$message.info('you cancel this operation')
				}
			},
			settingRoles(id) {},
		},
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
.expand-rights {
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
