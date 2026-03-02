import { BadRequestException } from '@nestjs/common';

/**
 * State Machine Base Class
 * 
 * Provides common state transition logic for:
 * - Registration approval flow
 * - Refund flow
 * - Appeal flow
 * - Dish publish flow
 */
export interface StateTransition<S extends string, A extends string> {
    from: S | S[];
    to: S;
    action: A;
    guard?: (context: any) => boolean;
}

export interface StateLog<S extends string, A extends string> {
    entityId: string;
    fromStatus: S;
    toStatus: S;
    action: A;
    operatorId: string;
    operatorName?: string;
    remark?: string;
}

export abstract class StateMachine<
    S extends string,
    A extends string,
> {
    protected abstract transitions: StateTransition<S, A>[];

    /**
     * Check if transition is allowed
     */
    canTransition(currentState: S, action: A, context?: any): boolean {
        const transition = this.findTransition(currentState, action);
        if (!transition) return false;
        if (transition.guard && !transition.guard(context)) return false;
        return true;
    }

    /**
     * Get next state for an action
     */
    getNextState(currentState: S, action: A, context?: any): S {
        const transition = this.findTransition(currentState, action);

        if (!transition) {
            throw new BadRequestException(
                `Invalid state transition: ${currentState} -> ${action}`,
            );
        }

        if (transition.guard && !transition.guard(context)) {
            throw new BadRequestException(
                `State transition guard failed: ${currentState} -> ${action}`,
            );
        }

        return transition.to;
    }

    /**
     * Get allowed actions from current state
     */
    getAllowedActions(currentState: S, context?: any): A[] {
        return this.transitions
            .filter((t) => {
                const fromMatch = Array.isArray(t.from)
                    ? t.from.includes(currentState)
                    : t.from === currentState;
                const guardPass = !t.guard || t.guard(context);
                return fromMatch && guardPass;
            })
            .map((t) => t.action);
    }

    private findTransition(
        currentState: S,
        action: A,
    ): StateTransition<S, A> | undefined {
        return this.transitions.find((t) => {
            const fromMatch = Array.isArray(t.from)
                ? t.from.includes(currentState)
                : t.from === currentState;
            return fromMatch && t.action === action;
        });
    }
}

// =============================================================================
// Registration Approval State Machine
// =============================================================================

export type RegistrationStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
export type RegistrationAction = 'SUBMIT' | 'PASS' | 'REJECT' | 'RESUBMIT';

export class RegistrationStateMachine extends StateMachine<
    RegistrationStatus,
    RegistrationAction
> {
    protected transitions: StateTransition<RegistrationStatus, RegistrationAction>[] = [
        { from: 'DRAFT', to: 'PENDING', action: 'SUBMIT' },
        { from: 'PENDING', to: 'APPROVED', action: 'PASS' },
        { from: 'PENDING', to: 'REJECTED', action: 'REJECT' },
        { from: 'REJECTED', to: 'PENDING', action: 'RESUBMIT' },
    ];
}

// =============================================================================
// Refund State Machine
// =============================================================================

export type RefundStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
export type RefundAction = 'APPROVE' | 'REJECT' | 'EXECUTE';

export class RefundStateMachine extends StateMachine<RefundStatus, RefundAction> {
    protected transitions: StateTransition<RefundStatus, RefundAction>[] = [
        { from: 'PENDING', to: 'APPROVED', action: 'APPROVE' },
        { from: 'PENDING', to: 'REJECTED', action: 'REJECT' },
        { from: 'APPROVED', to: 'REFUNDED', action: 'EXECUTE' },
    ];
}

// =============================================================================
// Appeal State Machine
// =============================================================================

export type AppealStatus = 'SUBMITTED' | 'PENDING' | 'PROCESSING' | 'REJECTED' | 'RESOLVED';
export type AppealAction = 'ACCEPT' | 'REJECT' | 'START_PROCESS' | 'RESOLVE';

export class AppealStateMachine extends StateMachine<AppealStatus, AppealAction> {
    protected transitions: StateTransition<AppealStatus, AppealAction>[] = [
        { from: 'SUBMITTED', to: 'PENDING', action: 'ACCEPT' },
        { from: 'SUBMITTED', to: 'REJECTED', action: 'REJECT' },
        { from: 'PENDING', to: 'PROCESSING', action: 'START_PROCESS' },
        { from: ['PENDING', 'PROCESSING'], to: 'RESOLVED', action: 'RESOLVE' },
        { from: ['PENDING', 'PROCESSING'], to: 'REJECTED', action: 'REJECT' },
    ];
}

// =============================================================================
// Dish Publish State Machine
// =============================================================================

export type DishPublishStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED' | 'UNPUBLISHED';
export type DishPublishAction = 'SUBMIT' | 'APPROVE' | 'REJECT' | 'PUBLISH' | 'UNPUBLISH' | 'RESUBMIT';

export class DishPublishStateMachine extends StateMachine<
    DishPublishStatus,
    DishPublishAction
> {
    protected transitions: StateTransition<DishPublishStatus, DishPublishAction>[] = [
        { from: 'DRAFT', to: 'PENDING', action: 'SUBMIT' },
        { from: 'PENDING', to: 'PUBLISHED', action: 'APPROVE' },
        { from: 'PENDING', to: 'REJECTED', action: 'REJECT' },
        { from: 'PUBLISHED', to: 'UNPUBLISHED', action: 'UNPUBLISH' },
        { from: 'UNPUBLISHED', to: 'PENDING', action: 'RESUBMIT' },
        { from: 'REJECTED', to: 'PENDING', action: 'RESUBMIT' },
        // Direct publish (for admins)
        { from: 'DRAFT', to: 'PUBLISHED', action: 'PUBLISH' },
        { from: 'UNPUBLISHED', to: 'PUBLISHED', action: 'PUBLISH' },
    ];
}

// Singleton instances
export const registrationStateMachine = new RegistrationStateMachine();
export const refundStateMachine = new RefundStateMachine();
export const appealStateMachine = new AppealStateMachine();
export const dishPublishStateMachine = new DishPublishStateMachine();
