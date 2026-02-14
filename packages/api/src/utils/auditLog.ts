import prisma from '../config/database';
import { Request } from 'express';

export interface AuditLogParams {
    userId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    req: Request;
    changes?: any;
    status: 'SUCCESS' | 'FAILURE';
    errorMessage?: string;
}

export const logAudit = async (params: AuditLogParams) => {
    try {
        await prisma.auditLog.create({
            data: {
                userId: params.userId,
                action: params.action,
                resource: params.resource,
                resourceId: params.resourceId,
                ipAddress: params.req.ip || params.req.socket.remoteAddress || 'unknown',
                userAgent: params.req.headers['user-agent'] || 'unknown',
                changes: params.changes ? JSON.stringify(params.changes) : null,
                status: params.status,
                errorMessage: params.errorMessage,
            },
        });
    } catch (error) {
        console.error('Failed to log audit:', error);
        // Don't throw - audit logging should not break the main flow
    }
};

// Security event monitoring
export const monitorSecurityEvent = async (params: {
    type: 'SUSPICIOUS_LOGIN' | 'MULTIPLE_FAILED_LOGINS' | 'ADMIN_ACCESS_DENIED' | 'RATE_LIMIT_EXCEEDED';
    userId?: string;
    ipAddress: string;
    details: any;
}) => {
    // Log to audit trail
    await logAudit({
        userId: params.userId,
        action: `SECURITY_EVENT_${params.type}`,
        resource: 'Security',
        req: { ip: params.ipAddress, headers: {}, socket: {} } as any,
        changes: params.details,
        status: 'FAILURE',
    });

    // Send alert if critical
    if (params.type === 'ADMIN_ACCESS_DENIED' || params.type === 'MULTIPLE_FAILED_LOGINS') {
        console.error('[SECURITY ALERT]', {
            severity: 'HIGH',
            type: params.type,
            userId: params.userId,
            ipAddress: params.ipAddress,
            details: params.details,
        });
        // TODO: Integrate with alerting service (email, Slack, etc.)
    }
};
