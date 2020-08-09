<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/summer.png" class="logo" alt="logo" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--主题布局-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse()">|||</div>
        <!--
        //collapse表示是否折叠当前的菜单
        //collapse-transition关闭自带的折叠动画
        //router表示开启vue-router功能，会用index的值作为path进行跳转
        -->
        <el-menu
          background-color="#313743"
          unique-opened
          text-color="#fff"
          active-text-color="#409eff"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path"
        >
          <!--一级菜单-->
          <el-submenu :index="'/' + item.path" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!--右侧内容主体-->
        <el-main>
          <!--路由占位符-->
          <router-view></router-view>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [], //左侧菜单数据
      isCollapse: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    //注销登陆操作
    logout() {
      //清除所有的sessionStorage中的数据
      window.sessionStorage.clear()
      //重定向到登陆页面
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status != 200) return this.$message.error(res.mata.msg)
      this.menuList = res.data
    },
    //点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang='less' scoped>
.el-aside {
  background-color: #313743;
  transition: all 0.6s ease-in-out 0.3s;
  .el-menu {
    border-right: none;
  }
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-main {
  background-color: #e9edf1;
}
.home-container {
  height: 100%;
}
.el-header {
  background-color: #363d40;
  display: flex;
  //左右贴边
  justify-content: space-between;
  align-items: center;
  padding-left: 0px;
  color: #ffff;
  font-size: 20px;

  > div {
    display: flex;
    //纵向居中
    align-items: center;
    span {
      margin-left: 15px;
    }
    img {
      width: 60px;
      height: 60px;
    }
  }
}
.el-submenu {
  span {
    margin-left: 15px;
  }
}
</style>