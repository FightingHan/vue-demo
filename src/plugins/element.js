import Vue from 'vue'
import { 
    Button, 
    Form, 
    FormItem, 
    Input, 
    Message, 
    Container, 
    Header, 
    Aside, 
    Main, 
    Footer, 
    Menu, 
    Submenu, 
    MenuItemGroup, 
    MenuItem, 
    Breadcrumb, 
    BreadcrumbItem, 
    Card
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
//挂载到原型对象上，可以使用this访问
Vue.prototype.$message = Message;
