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
          <el-button type="primary">add categories</el-button>
        </el-col>
      </el-row>
      <!--数据区-->
      <tree-table :data="cateList" :columns="columns"> </tree-table>
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
    </el-card>
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
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: 'cateName',
          prop: 'cate_name'
        },
        {}
      ]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('get goods categories is failed')
      }

      this.cateList = res.data.result
      this.total = res.data.total
      this.$message.success('get goods categories successed!')
    }
  },
  //监听最新的pageSize改变
  handleSizeChange(newSize) {
    this.queryInfo.pagesize = newSize
    this.getCateList()
  },
  //监听页码值 改变的事件
  handleCurrentChange(newPage) {
    this.queryInfo.pagenum = newPage
    thiCateList()
  }
}
</script>

<style lang="sass" scoped></style>>
