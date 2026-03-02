import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrgService {
    constructor(private prisma: PrismaService) { }

    async getTree() {
        const departments = await this.prisma.department.findMany({
            where: { isDeleted: false },
            orderBy: { sortOrder: 'asc' },
        });

        return this.buildTree(departments);
    }

    private buildTree(departments: any[], parentId: string | null = null): any[] {
        return departments
            .filter((d) => d.parentId === parentId)
            .map((d) => ({
                ...d,
                children: this.buildTree(departments, d.id),
            }));
    }

    async createDepartment(data: any, operatorId: string) {
        return this.prisma.department.create({
            data: {
                ...data,
                createdBy: operatorId,
            },
        });
    }

    async updateDepartment(id: string, data: any, operatorId: string) {
        return this.prisma.department.update({
            where: { id },
            data: {
                ...data,
                updatedBy: operatorId,
            },
        });
    }

    async deleteDepartment(id: string, operatorId: string) {
        return this.prisma.softDelete('Department', { id }, operatorId);
    }

    async moveDepartment(deptId: string, targetParentId: string, operatorId: string) {
        return this.prisma.department.update({
            where: { id: deptId },
            data: {
                parentId: targetParentId,
                updatedBy: operatorId,
            },
        });
    }
}
