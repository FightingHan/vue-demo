<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>Goods Manager</el-breadcrumb-item>
      <el-breadcrumb-item>Goods categories</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--按钮-->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="showEditCateDialog">add categories</el-button>
        </el-col>
      </el-row>
      <!--数据区-->
      <tree-table
        class="table-data"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!--isValid column-->
        <template #isOk="scope">
          <i v-if="!scope.row.cate_deleted" class="el-icon-success" style="color: lightgreen;"></i>
          <i v-else class="el-icon-error" style="color: red;"></i>
        </template>

        <!--order column-->
        <template #order="scope">
          <el-tag v-if="scope.row.cat_level === 1" type="success">level2</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 0">level1</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 2" type="warning">level3</el-tag>
        </template>
        <template #opt="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteGoodsCate(scope.row.id)"
            icon="el-icon-delete"
          ></el-button>
        </template>
      </tree-table>
      <!--分页区-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog
      title="add categories"
      :visible.sync="addCateDialogVisible"
      @close="addCateDialogClose"
    >
      <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules">
        <el-form-item label="cate name" prop="cat_name">
          <el-input v-model="addCateForm.cat_name" prefix-icon="el-icon-user"></el-input>
        </el-form-item>

        <el-form-item label="cate name">
          <el-cascader
            expand-trigger="hover"
            :options="parentCateList"
            v-model="selectedKeys"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">cancel</el-button>
        <el-button @click="addCate" type="primary">ensure</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
	export default {
		data() {
			return {
				cateList: [],
				queryInfo: {
					type: 3,
					pagenum: 1,
					pagesize: 3,
				},
				total: 0,
				columns: [
					{
						label: 'cat_name',
						prop: 'cat_name',
					},
					{
						label: 'isValid',
						type: 'template',
						template: 'isOk',
					},
					{
						label: 'sort',
						type: 'template',
						template: 'order',
					},
					{
						label: 'operation',
						type: 'template',
						template: 'opt',
					},
				],
				addCateDialogVisible: false,
				addCateFormRules: {
					cat_name: [
						{
							required: true,
							meaasge: 'please input username',
							trigger: 'blur',
						},
					],
				},
				addCateForm: {
					cat_name: '',
					cat_pid: '',
					cat_level: '',
				},
				parentCateList: [],
				cascaderProps: {
					value: 'cat_id',
					label: 'cat_name',
					children: 'children',
				},
				selectedKeys: [],
			}
		},
		created() {
			this.getCateList()
		},
		methods: {
			addCate() {
				this.$refs.addCateFormRef.validate( async valid => {
					if(!valid) return
					const {data : res } = await this.$http.post('categories', this.addCateForm)
					console.log(res)
					if( res.meta.status !== 201)
						return this.$message.error(res.meta.msg)

					this.$message.success('添加分类成功')
					this.addCateDialogVisible = false
					this.getCateList()
				})
			},
			parentCateChange() {
				if (this.selectedKeys.length > 0) {
					this.addCateForm.cat_pid = this.selectedKeys[
						this.selectedKeys.length - 1
					]
					this.addCateForm.cat_level = this.selectedKeys.length
				} else {
					this.$message.error('请至少选择一项分类提交')
					this.addCateForm.cat_level = 0
					this.addCateForm.cat_pid = 0
				}
			},
			async getCateList() {
				const { data: res } = await this.$http.get('categories', {
					params: this.queryInfo,
				})
				if (res.meta.status !== 200) {
					return this.$message.error('get goods categories is failed')
				}

				this.cateList = res.data.result
				this.total = res.data.total
				this.$message.closeAll()
				this.$message.success('get goods categories successed!')
			},
			//监听最新的pageSize改变
			handleSizeChange(newSize) {
				this.queryInfo.pagesize = newSize
				this.getCateList()
			},
			//监听页码值 改变的事件
			handleCurrentChange(newPage) {
				this.queryInfo.pagenum = newPage
				this.getCateList()
			},
			addCateDialogClose() {
				this.addCateDialogVisible = false
				this.$refs.addCateFormRef.resetFields()
				this.selectedKeys = []
				this.addCateForm.cat_level = 0
				this.addCateForm.cat_pid = 0
			},
			showEditCateDialog() {
				//get Parent categries list
				this.getParentCateList()
				this.addCateDialogVisible = true
			},
			async getParentCateList() {
				const { data: res } = await this.$http.get('categories', {
					params: {
						type: 2,
					},
				})
				if (res.meta.status !== 200) {
					return this.$message.error(res.meta.msg)
				}
				this.parentCateList = res.data
			},
		},
	}
</script>

<style lang="less" scoped>
.table-data {
	margin-top: 10px;
}
</style>>
