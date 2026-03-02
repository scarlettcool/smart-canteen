import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create permissions
    const permissions = [
        // 人员管理
        { code: 'PEOPLE_ARCHIVE_READ', name: '人员档案查看', module: 'hr', description: '查看人员档案列表和详情' },
        { code: 'PEOPLE_ARCHIVE_WRITE', name: '人员档案编辑', module: 'hr', description: '创建、编辑、删除人员档案' },
        { code: 'PEOPLE_ARCHIVE_IMPORT', name: '人员档案导入', module: 'hr', description: '批量导入人员档案' },
        { code: 'PEOPLE_ARCHIVE_EXPORT', name: '人员档案导出', module: 'hr', description: '导出人员档案' },
        { code: 'PEOPLE_PRE_RECORD_READ', name: '预录入查看', module: 'hr', description: '查看预录入数据' },
        { code: 'PEOPLE_PRE_RECORD_WRITE', name: '预录入管理', module: 'hr', description: '管理预录入数据' },
        { code: 'PEOPLE_APPROVAL_READ', name: '注册审批查看', module: 'hr', description: '查看注册审批列表' },
        { code: 'PEOPLE_APPROVAL_WRITE', name: '注册审批处理', module: 'hr', description: '通过或驳回注册申请' },
        { code: 'PEOPLE_BLACKLIST_READ', name: '黑名单查看', module: 'hr', description: '查看黑名单列表' },
        { code: 'PEOPLE_BLACKLIST_WRITE', name: '黑名单管理', module: 'hr', description: '添加或解除黑名单' },
        { code: 'PEOPLE_ORG_READ', name: '组织架构查看', module: 'org', description: '查看组织架构' },
        { code: 'PEOPLE_ORG_WRITE', name: '组织架构管理', module: 'org', description: '管理部门结构' },

        // 消费管理
        { code: 'CONSUME_ACCOUNT_READ', name: '账户查看', module: 'account', description: '查看用户账户' },
        { code: 'CONSUME_ACCOUNT_WRITE', name: '账户管理', module: 'account', description: '充值、冻结等账户操作' },
        { code: 'CONSUME_TRADE_READ', name: '交易查看', module: 'trade', description: '查看交易流水' },
        { code: 'CONSUME_TRADE_CORRECT', name: '交易冲正', module: 'trade', description: '冲正交易' },
        { code: 'CONSUME_REFUND_READ', name: '退款查看', module: 'refund', description: '查看退款申请' },
        { code: 'CONSUME_REFUND_AUDIT', name: '退款审核', module: 'refund', description: '审核退款申请' },
        { code: 'CONSUME_APPEAL_READ', name: '申诉查看', module: 'appeal', description: '查看申诉记录' },
        { code: 'CONSUME_APPEAL_HANDLE', name: '申诉处理', module: 'appeal', description: '处理申诉' },
        { code: 'CONSUME_DEVICE_READ', name: '设备查看', module: 'device', description: '查看设备列表' },
        { code: 'CONSUME_DEVICE_WRITE', name: '设备管理', module: 'device', description: '管理设备' },
        { code: 'CONSUME_DEVICE_ADMIN', name: '设备高级管理', module: 'device', description: '设备绑定和命令' },
        { code: 'CONSUME_REPORT_READ', name: '报表查看', module: 'report', description: '查看消费报表' },
        { code: 'CONSUME_REPORT_EXPORT', name: '报表导出', module: 'report', description: '导出消费报表' },

        // 菜品管理
        { code: 'DISH_CATEGORY_READ', name: '分类查看', module: 'dish', description: '查看菜品分类' },
        { code: 'DISH_CATEGORY_WRITE', name: '分类管理', module: 'dish', description: '管理菜品分类' },
        { code: 'DISH_INFO_READ', name: '菜品查看', module: 'dish', description: '查看菜品信息' },
        { code: 'DISH_INFO_WRITE', name: '菜品管理', module: 'dish', description: '管理菜品信息' },
        { code: 'DISH_PUBLISH', name: '菜品发布', module: 'dish', description: '发布/下架菜品' },
        { code: 'DISH_MENU_READ', name: '菜单查看', module: 'menu', description: '查看菜单' },
        { code: 'DISH_MENU_WRITE', name: '菜单管理', module: 'menu', description: '管理菜单' },
        { code: 'DISH_MENU_PUBLISH', name: '菜单发布', module: 'menu', description: '发布/下架菜单' },
        { code: 'DISH_FEEDBACK_READ', name: '反馈查看', module: 'notify', description: '查看用户反馈' },
        { code: 'DISH_FEEDBACK_HANDLE', name: '反馈处理', module: 'notify', description: '处理用户反馈' },
        { code: 'DISH_NOTICE_READ', name: '公告查看', module: 'notify', description: '查看公告列表' },
        { code: 'DISH_NOTICE_WRITE', name: '公告管理', module: 'notify', description: '管理公告' },
        { code: 'DISH_NOTICE_PUBLISH', name: '公告发布', module: 'notify', description: '发布公告' },

        // 系统设置
        { code: 'SYSTEM_ROLE_READ', name: '角色查看', module: 'system', description: '查看角色列表' },
        { code: 'SYSTEM_ROLE_WRITE', name: '角色管理', module: 'system', description: '管理角色和权限' },
        { code: 'SYSTEM_ADMIN_READ', name: '管理员查看', module: 'system', description: '查看管理员列表' },
        { code: 'SYSTEM_ADMIN_WRITE', name: '管理员管理', module: 'system', description: '管理管理员账号' },
        { code: 'SYSTEM_LOG_READ', name: '日志查看', module: 'system', description: '查看操作日志' },
        { code: 'SYSTEM_CONFIG_READ', name: '配置查看', module: 'system', description: '查看系统配置' },
        { code: 'SYSTEM_CONFIG_WRITE', name: '配置管理', module: 'system', description: '管理系统配置' },
    ];

    for (const perm of permissions) {
        await prisma.permission.upsert({
            where: { code: perm.code },
            update: perm,
            create: perm,
        });
    }

    console.log(`✅ Created ${permissions.length} permissions`);

    // Create roles
    const superAdminRole = await prisma.role.upsert({
        where: { code: 'SUPER_ADMIN' },
        update: { name: '超级管理员', description: '拥有所有权限' },
        create: { code: 'SUPER_ADMIN', name: '超级管理员', description: '拥有所有权限', isSystem: true },
    });

    const adminRole = await prisma.role.upsert({
        where: { code: 'ADMIN' },
        update: { name: '管理员', description: '普通管理员' },
        create: { code: 'ADMIN', name: '管理员', description: '普通管理员', isSystem: true },
    });

    const canteenManagerRole = await prisma.role.upsert({
        where: { code: 'CANTEEN_MANAGER' },
        update: { name: '餐厅经理', description: '管理餐厅运营' },
        create: { code: 'CANTEEN_MANAGER', name: '餐厅经理', description: '管理餐厅运营' },
    });

    const hrManagerRole = await prisma.role.upsert({
        where: { code: 'HR_MANAGER' },
        update: { name: '人事经理', description: '管理人员档案' },
        create: { code: 'HR_MANAGER', name: '人事经理', description: '管理人员档案' },
    });

    const financeRole = await prisma.role.upsert({
        where: { code: 'FINANCE' },
        update: { name: '财务', description: '财务相关操作' },
        create: { code: 'FINANCE', name: '财务', description: '财务相关操作' },
    });

    const viewerRole = await prisma.role.upsert({
        where: { code: 'VIEWER' },
        update: { name: '观察者', description: '只读权限' },
        create: { code: 'VIEWER', name: '观察者', description: '只读权限' },
    });

    console.log('✅ Created 6 roles');

    // Assign all permissions to super admin
    const allPermissions = await prisma.permission.findMany();
    for (const perm of allPermissions) {
        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: superAdminRole.id,
                    permissionId: perm.id,
                },
            },
            update: {},
            create: {
                roleId: superAdminRole.id,
                permissionId: perm.id,
            },
        });
    }

    // Assign specific permissions to other roles
    const rolePermissionMap: Record<string, string[]> = {
        'ADMIN': allPermissions.filter(p => !p.code.startsWith('SYSTEM_')).map(p => p.code),
        'CANTEEN_MANAGER': ['DISH_CATEGORY_READ', 'DISH_CATEGORY_WRITE', 'DISH_INFO_READ', 'DISH_INFO_WRITE', 'DISH_PUBLISH', 'DISH_MENU_READ', 'DISH_MENU_WRITE', 'DISH_MENU_PUBLISH', 'DISH_FEEDBACK_READ', 'DISH_FEEDBACK_HANDLE', 'DISH_NOTICE_READ', 'DISH_NOTICE_WRITE', 'DISH_NOTICE_PUBLISH'],
        'HR_MANAGER': ['PEOPLE_ARCHIVE_READ', 'PEOPLE_ARCHIVE_WRITE', 'PEOPLE_ARCHIVE_IMPORT', 'PEOPLE_ARCHIVE_EXPORT', 'PEOPLE_PRE_RECORD_READ', 'PEOPLE_PRE_RECORD_WRITE', 'PEOPLE_APPROVAL_READ', 'PEOPLE_APPROVAL_WRITE', 'PEOPLE_BLACKLIST_READ', 'PEOPLE_BLACKLIST_WRITE', 'PEOPLE_ORG_READ', 'PEOPLE_ORG_WRITE'],
        'FINANCE': ['CONSUME_ACCOUNT_READ', 'CONSUME_ACCOUNT_WRITE', 'CONSUME_TRADE_READ', 'CONSUME_TRADE_CORRECT', 'CONSUME_REFUND_READ', 'CONSUME_REFUND_AUDIT', 'CONSUME_REPORT_READ', 'CONSUME_REPORT_EXPORT'],
        'VIEWER': allPermissions.filter(p => p.code.endsWith('_READ')).map(p => p.code),
    };

    const roleIdMap: Record<string, string> = {
        'ADMIN': adminRole.id,
        'CANTEEN_MANAGER': canteenManagerRole.id,
        'HR_MANAGER': hrManagerRole.id,
        'FINANCE': financeRole.id,
        'VIEWER': viewerRole.id,
    };

    for (const [roleCode, permCodes] of Object.entries(rolePermissionMap)) {
        const roleId = roleIdMap[roleCode];
        for (const permCode of permCodes) {
            const perm = allPermissions.find(p => p.code === permCode);
            if (perm) {
                await prisma.rolePermission.upsert({
                    where: {
                        roleId_permissionId: {
                            roleId: roleId,
                            permissionId: perm.id,
                        },
                    },
                    update: {},
                    create: {
                        roleId: roleId,
                        permissionId: perm.id,
                    },
                });
            }
        }
    }

    console.log('✅ Assigned permissions to all roles');

    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.adminUser.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: hashedPassword,
            name: '系统管理员',
            phone: '13800000000',
            email: 'admin@smartcanteen.com',
            status: 'ACTIVE',
        },
    });

    // Assign super admin role
    await prisma.adminUserRole.upsert({
        where: {
            adminId_roleId: {
                adminId: adminUser.id,
                roleId: superAdminRole.id,
            },
        },
        update: {},
        create: {
            adminId: adminUser.id,
            roleId: superAdminRole.id,
        },
    });

    console.log('✅ Created default admin user (admin / admin123)');

    // Create sample departments
    const rootDept = await prisma.department.create({
        data: {
            name: '总公司',
            sortOrder: 1,
        },
    });

    await prisma.department.createMany({
        data: [
            { name: '技术部', parentId: rootDept.id, sortOrder: 1 },
            { name: '人力资源部', parentId: rootDept.id, sortOrder: 2 },
            { name: '财务部', parentId: rootDept.id, sortOrder: 3 },
            { name: '运营部', parentId: rootDept.id, sortOrder: 4 },
        ],
        skipDuplicates: true,
    });

    console.log('✅ Created sample departments');

    // Create sample canteen
    const canteen = await prisma.canteen.create({
        data: {
            name: '一号餐厅',
            location: '综合楼1层',
            isOpen: true,
            openHours: {
                breakfast: { start: '06:30', end: '09:00' },
                lunch: { start: '11:00', end: '13:30' },
                dinner: { start: '17:00', end: '20:00' },
            },
            sortOrder: 1,
        },
    });

    console.log('✅ Created sample canteen');

    // Create sample meal types
    await prisma.mealType.createMany({
        data: [
            { name: '早餐', code: 'breakfast', startTime: '06:30', endTime: '09:00', sortOrder: 1 },
            { name: '午餐', code: 'lunch', startTime: '11:00', endTime: '13:30', sortOrder: 2 },
            { name: '晚餐', code: 'dinner', startTime: '17:00', endTime: '20:00', sortOrder: 3 },
        ],
        skipDuplicates: true,
    });

    console.log('✅ Created meal types');

    // Create sample dish categories
    await prisma.dishCategory.createMany({
        data: [
            { name: '主食', sortOrder: 1 },
            { name: '热菜', sortOrder: 2 },
            { name: '凉菜', sortOrder: 3 },
            { name: '汤品', sortOrder: 4 },
            { name: '甜点', sortOrder: 5 },
            { name: '饮品', sortOrder: 6 },
        ],
        skipDuplicates: true,
    });

    console.log('✅ Created dish categories');

    // Create sample dishes
    const categories = await prisma.dishCategory.findMany();
    const mainDishCategory = categories.find(c => c.name === '主食');
    const hotDishCategory = categories.find(c => c.name === '热菜');

    if (mainDishCategory && hotDishCategory) {
        await prisma.dish.createMany({
            data: [
                {
                    canteenId: canteen.id,
                    categoryId: mainDishCategory.id,
                    name: '米饭',
                    description: '精选东北大米',
                    price: 2.00,
                    stock: 100,
                    publishStatus: 'PUBLISHED',
                    isAvailable: true,
                    sortOrder: 1,
                },
                {
                    canteenId: canteen.id,
                    categoryId: mainDishCategory.id,
                    name: '馒头',
                    description: '手工馒头',
                    price: 1.00,
                    stock: 50,
                    publishStatus: 'PUBLISHED',
                    isAvailable: true,
                    sortOrder: 2,
                },
                {
                    canteenId: canteen.id,
                    categoryId: hotDishCategory.id,
                    name: '红烧肉',
                    description: '传统红烧肉，肥瘦相间',
                    price: 15.00,
                    stock: 30,
                    publishStatus: 'PUBLISHED',
                    isAvailable: true,
                    sortOrder: 1,
                },
                {
                    canteenId: canteen.id,
                    categoryId: hotDishCategory.id,
                    name: '宫保鸡丁',
                    description: '经典川菜',
                    price: 12.00,
                    stock: 30,
                    publishStatus: 'PUBLISHED',
                    isAvailable: true,
                    sortOrder: 2,
                },
            ],
        });

        console.log('✅ Created sample dishes');
    }

    // Create sample users
    const techDept = await prisma.department.findFirst({ where: { name: '技术部' } });

    await prisma.user.createMany({
        data: [
            {
                staffId: 'EMP001',
                name: '张三',
                phone: '13800000001',
                deptId: techDept?.id,
                regStatus: 'APPROVED',
                status: 'ACTIVE',
                balance: 500.00,
            },
            {
                staffId: 'EMP002',
                name: '李四',
                phone: '13800000002',
                deptId: techDept?.id,
                regStatus: 'PENDING',
                status: 'ACTIVE',
                balance: 0.00,
            },
        ],
        skipDuplicates: true,
    });

    console.log('✅ Created sample users');

    // Create system configs
    await prisma.systemConfig.createMany({
        data: [
            {
                key: 'reservation.advance_days',
                value: 7,
                module: 'reservation',
                remark: '预约提前天数',
            },
            {
                key: 'reservation.cancel_deadline',
                value: 30,
                module: 'reservation',
                remark: '取消预约截止时间（分钟）',
            },
            {
                key: 'refund.auto_approve_limit',
                value: 10,
                module: 'refund',
                remark: '自动审批退款金额上限',
            },
            {
                key: 'blacklist.max_no_show',
                value: 3,
                module: 'blacklist',
                remark: '连续爽约次数阈值',
            },
        ],
        skipDuplicates: true,
    });

    console.log('✅ Created system configs');

    // Create sample coupon template
    await prisma.couponTemplate.create({
        data: {
            code: 'NEWUSER10',
            name: '新用户优惠券',
            type: 'CASH',
            value: 10.00,
            minAmount: 30.00,
            validDays: 30,
            rules: '新用户首次消费可用',
            isActive: true,
        },
    });

    console.log('✅ Created sample coupon template');

    console.log('🎉 Database seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
