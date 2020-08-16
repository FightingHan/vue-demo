<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>rights管理</el-breadcrumb-item>
      <el-breadcrumb-item>rights列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="rightsName" prop="authName"></el-table-column>
        <el-table-column label="path" prop="path"></el-table-column>
        <el-table-column label="rightsLevel" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0" type="success">
              level1
            </el-tag>
            <el-tag v-else-if="scope.row.level == 1">
              level2
            </el-tag>
            <el-tag v-else-if="scope.row.level == 2" type="warning">
              level3
            </el-tag>
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
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('get rights list is failed!')
      }
      this.rightsList = res.data
    }
  }
}
</script>
<style scoped lang="less"></style>
