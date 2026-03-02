import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import { AuditModule, AuditAction } from '../../decorators/audit.decorator';

@Injectable()
export class DeviceService {
    constructor(
        private prisma: PrismaService,
        private auditService: AuditService,
    ) { }

    /**
     * 获取设备列表
     */
    async findDevices(query: {
        page?: number;
        pageSize?: number;
        type?: string;
        status?: string;
        canteenId?: string;
        keyword?: string;
    }) {
        const where: any = { isDeleted: false };

        if (query.type) where.type = query.type;
        if (query.status) where.status = query.status;
        if (query.canteenId) where.canteenId = query.canteenId;
        if (query.keyword) {
            where.OR = [
                { name: { contains: query.keyword, mode: 'insensitive' } },
                { sn: { contains: query.keyword, mode: 'insensitive' } },
            ];
        }

        return this.prisma.paginate('device', {
            where,
            page: query.page,
            pageSize: query.pageSize,
            orderBy: { createdAt: 'desc' },
            include: {
                canteen: { select: { id: true, name: true } },
            },
        });
    }

    /**
     * 获取设备详情
     */
    async findDevice(id: string) {
        const device = await this.prisma.device.findFirst({
            where: { id, isDeleted: false },
            include: { canteen: true },
        });

        if (!device) {
            throw new NotFoundException('Device not found');
        }

        return device;
    }

    /**
     * 创建设备
     */
    async createDevice(
        data: {
            name: string;
            type: 'POS' | 'RECHARGE_KIOSK' | 'GATE' | 'FACE_TERMINAL';
            sn: string;
            canteenId: string;
            ip?: string;
            version?: string;
        },
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        // 检查序列号唯一性
        const existing = await this.prisma.device.findUnique({
            where: { sn: data.sn },
        });

        if (existing) {
            throw new BadRequestException('Device serial number already exists');
        }

        const device = await this.prisma.device.create({
            data: {
                name: data.name,
                type: data.type,
                sn: data.sn,
                canteenId: data.canteenId,
                ip: data.ip,
                version: data.version,
                status: 'OFFLINE',
            },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.DEVICE,
            action: AuditAction.CREATE,
            targetType: 'Device',
            targetId: device.id,
            targetName: device.name,
            afterValue: device,
        });

        return device;
    }

    /**
     * 更新设备
     */
    async updateDevice(
        id: string,
        data: Partial<{
            name: string;
            ip: string;
            version: string;
        }>,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const existing = await this.findDevice(id);

        const updated = await this.prisma.device.update({
            where: { id },
            data,
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.DEVICE,
            action: AuditAction.UPDATE,
            targetType: 'Device',
            targetId: id,
            targetName: updated.name,
            beforeValue: existing,
            afterValue: updated,
        });

        return updated;
    }

    /**
     * 删除设备 (软删除)
     */
    async deleteDevice(
        id: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const existing = await this.findDevice(id);

        await this.prisma.device.update({
            where: { id },
            data: { isDeleted: true },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.DEVICE,
            action: AuditAction.DELETE,
            targetType: 'Device',
            targetId: id,
            targetName: existing.name,
            beforeValue: existing,
        });

        return { success: true };
    }

    /**
     * 绑定设备到食堂
     */
    async bindDevice(
        id: string,
        canteenId: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const device = await this.findDevice(id);
        const canteen = await this.prisma.canteen.findUnique({ where: { id: canteenId } });
        if (!canteen) throw new NotFoundException('Canteen not found');

        const updated = await this.prisma.device.update({
            where: { id },
            data: { canteenId },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.DEVICE,
            action: AuditAction.BIND,
            targetType: 'Device',
            targetId: id,
            targetName: device.name,
            beforeValue: { canteenId: device.canteenId },
            afterValue: { canteenId },
        });

        return updated;
    }

    /**
     * 解绑设备
     */
    async unbindDevice(
        id: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const device = await this.findDevice(id);

        const updated = await this.prisma.device.update({
            where: { id },
            data: { canteenId: null },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.DEVICE,
            action: AuditAction.UNBIND,
            targetType: 'Device',
            targetId: id,
            targetName: device.name,
            beforeValue: { canteenId: device.canteenId },
            afterValue: { canteenId: null },
        });

        return updated;
    }

    /**
     * 转移设备到另一个餐厅
     */
    async transferDevice(
        id: string,
        canteenId: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const device = await this.findDevice(id);

        // 验证餐厅存在
        const canteen = await this.prisma.canteen.findUnique({
            where: { id: canteenId },
        });

        if (!canteen) {
            throw new NotFoundException('Canteen not found');
        }

        const updated = await this.prisma.device.update({
            where: { id },
            data: { canteenId },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.DEVICE,
            action: AuditAction.UPDATE,
            targetType: 'Device',
            targetId: id,
            targetName: device.name,
            beforeValue: { canteenId: device.canteenId },
            afterValue: { canteenId, canteenName: canteen.name },
        });

        return updated;
    }

    /**
     * 发送命令到设备
     */
    async sendCommand(
        id: string,
        command: string,
        params: any,
        operatorId: string,
        traceId: string,
    ) {
        const device = await this.findDevice(id);

        if (device.status !== 'ONLINE') {
            throw new BadRequestException('Device is not online');
        }

        // 记录命令日志
        const commandLog = await this.prisma.deviceCommandLog.create({
            data: {
                deviceId: id,
                command,
                params,
                status: 'SENT',
                createdBy: operatorId,
            },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            module: AuditModule.DEVICE,
            action: AuditAction.COMMAND,
            targetType: 'Device',
            targetId: id,
            afterValue: commandLog,
        });

        // 实际设备通信逻辑这里省略
        return {
            success: true,
            message: 'Command sent successfully',
            commandId: commandLog.id,
        };
    }

    /**
     * 更新设备状态 (设备心跳)
     */
    async updateDeviceStatus(
        sn: string,
        status: 'ONLINE' | 'OFFLINE' | 'ERROR',
        version?: string,
    ) {
        const device = await this.prisma.device.findUnique({
            where: { sn },
        });

        if (!device || device.isDeleted) {
            throw new NotFoundException('Device not found');
        }

        const updateData: any = {
            status,
            lastHeartbeat: new Date(),
        };

        if (version) {
            updateData.version = version;
        }

        return this.prisma.device.update({
            where: { id: device.id },
            data: updateData,
        });
    }

    /**
     * 获取设备统计
     */
    async getStatistics(canteenId?: string) {
        const where: any = { isDeleted: false };
        if (canteenId) where.canteenId = canteenId;

        const [total, online, offline, error] = await Promise.all([
            this.prisma.device.count({ where }),
            this.prisma.device.count({ where: { ...where, status: 'ONLINE' } }),
            this.prisma.device.count({ where: { ...where, status: 'OFFLINE' } }),
            this.prisma.device.count({ where: { ...where, status: 'ERROR' } }),
        ]);

        return { total, online, offline, error };
    }
}
