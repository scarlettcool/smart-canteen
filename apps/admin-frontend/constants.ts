
import { MenuItem } from './types';

export const SYSTEM_NAME = "智慧食堂管理后台";
export const SYSTEM_VERSION = "V3.1.0-Release";

// 54-item Mandatory Function Matrix mapped to Menu Tree
export const MENU_TREE: MenuItem[] = [
  {
    id: 'people',
    label: '人员管理',
    path: '/people',
    icon: 'Users',
    children: [
      {
        id: 'people-archive',
        label: '人事资料',
        path: '/people/archive',
        children: [
          { id: '1', label: '人员档案', path: '/people/archive/list' },
          { id: '2', label: '组织架构', path: '/people/archive/org' },
          { id: '3', label: '注册审批', path: '/people/archive/approval' },
          { id: '4', label: '预录资料', path: '/people/archive/prerecord' },
        ]
      },
      {
        id: 'people-report',
        label: '人事报表',
        path: '/people/report',
        children: [
          { id: '5', label: '离职人员表', path: '/people/report/resigned' },
          { id: '6', label: '统计分析', path: '/people/report/stats' },
          { id: '7', label: '近期生日人员表', path: '/people/report/birthday' },
          { id: '8', label: '退休人员表', path: '/people/report/retired' },
        ]
      },
      {
        id: 'people-option',
        label: '人事选项',
        path: '/people/option',
        children: [
          { id: '9', label: '自定义属性', path: '/people/option/attr' },
          { id: '10', label: '自定义选项', path: '/people/option/dict' },
          { id: '11', label: '人员编号规则', path: '/people/option/id-rule' },
          { id: '12', label: '黑名单管理', path: '/people/option/blacklist' },
        ]
      }
    ]
  },
  {
    id: 'consumption',
    label: '消费管理',
    path: '/consumption',
    icon: 'Wallet',
    children: [
      { id: '13', label: '账户管理', path: '/consumption/accounts' },
      {
        id: 'consumption-trade',
        label: '交易管理',
        path: '/consumption/trade',
        children: [
          { id: '14', label: '交易明细', path: '/consumption/trade/tx' },
          { id: '15', label: '退款审核', path: '/consumption/trade/refund' },
          { id: '16', label: '失约申诉', path: '/consumption/trade/appeal' },
        ]
      },
      {
        id: 'consumption-report',
        label: '报表中心',
        path: '/consumption/report',
        children: [
          { id: '17', label: '消费明细', path: '/consumption/report/detail' },
          { id: '18', label: '个人汇总', path: '/consumption/report/user-summary' },
          { id: '19', label: '日期汇总', path: '/consumption/report/date-summary' },
          { id: '20', label: '金额统计', path: '/consumption/report/amount-stats' },
          { id: '21', label: '餐厅汇总', path: '/consumption/report/canteen-summary' },
          { id: '22', label: '部门汇总', path: '/consumption/report/dept-summary' },
          { id: '23', label: '设备汇总', path: '/consumption/report/device-summary' },
          { id: '24', label: '预定统计', path: '/consumption/report/order-stats' },
          { id: '25', label: '充值退款表', path: '/consumption/report/recharge' },
          { id: '26', label: '综合统计表', path: '/consumption/report/total' },
          { id: '27', label: '补交差价表', path: '/consumption/report/diff' },
          { id: '28', label: '个人综合表', path: '/consumption/report/personal' },
          { id: '29', label: '经营趋势', path: '/consumption/report/trend' },
        ]
      },
      { id: '30', label: '消费设置', path: '/consumption/config' },
      { id: '31', label: '设备管理', path: '/consumption/devices' },
    ]
  },
  {
    id: 'dishes',
    label: '菜品管理',
    path: '/dishes',
    icon: 'UtensilsCrossed',
    children: [
      { id: '32', label: '菜品发布', path: '/dishes/publish' },
      { id: '33', label: '菜品资料', path: '/dishes/archives' },
      { id: '34', label: '餐别管理', path: '/dishes/meal-types' },
      { id: '35', label: '账户类型', path: '/dishes/account-types' },
      { id: '36', label: '消费规则', path: '/dishes/rules' },
      { id: '37', label: '订餐管理', path: '/dishes/reservations' },
      { id: '38', label: '餐厅资料', path: '/dishes/canteen-info' },
      { id: '39', label: '提醒通知', path: '/dishes/notices' },
      { id: '40', label: '公告管理', path: '/dishes/announcements' },
      { id: '41', label: '意见箱', path: '/dishes/feedback' },
    ]
  },
  {
    id: 'system',
    label: '系统设置',
    path: '/system',
    icon: 'Settings',
    children: [
      { id: '42', label: '操作日志', path: '/system/logs' },
      { id: '43', label: '微信配置', path: '/system/wechat' },
      { id: '44', label: '政务短信', path: '/system/sms' },
      { id: '45', label: '开放接口', path: '/system/openapi' },
      { id: '46', label: '菜单设置', path: '/system/menus' },
      { id: '47', label: '字段对照', path: '/system/field-map' },
      { id: '48', label: '报表管理', path: '/system/report-config' },
      { id: '49', label: '插件管理', path: '/system/plugins' },
      { id: '50', label: '门户定制', path: '/system/portal' },
      { id: '51', label: '节假日设置', path: '/system/holidays' },
      { id: '52', label: '权限管理', path: '/system/perms' },
      { id: '53', label: '角色管理', path: '/system/roles' },
      { id: '54', label: '管理员设置', path: '/system/admins' },
    ]
  }
];
