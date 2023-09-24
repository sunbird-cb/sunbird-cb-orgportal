export namespace TelemetryEvents {
  export enum EnumInteractTypes {
    CLICK = 'click',
  }
  export enum EnumInteractSubTypes {
    CREATE_BTN = 'create-btn',
    BTN_CONTENT = 'btn-content',
    SIDE_NAV = 'side-nav-content',
    TAB_CONTENT = 'tab-content',
    CARD_CONTENT = 'card-content',
    NEW_BTN = 'new-btn',
    PRINT_BTN = 'print-btn',
    WORK_ALLOCATION_TAB = 'work-allocation-tab',
    USER_TAB = 'user-tab',
    EVENTS_TAB = 'events-tab',
    APPROVAL_TAB = 'approval-tab',
    SCROLLY_MENU = 'scrolly-menu',
    NOMINATE_BTN = 'nominate-learners-btn',

  }
  export enum EnumIdtype {
    USER = 'user',
    MENU = 'menu',
    ROLES = 'roles',
    PDF = 'pdf',
    WORK_ORDER = 'work-order',
    APPLICATION = 'application',
    OFFICER_ID = 'officer-id',
    OFFICER_ID_WORK = 'work-oder-officer-id',
    WORK_ORDER_ROW = 'work-order-row',
    USER_ROW = 'user-row',
    ROLES_ROW = 'roles-row',
    APPROVAL_ROW = 'approval-row',
    EVENTS_ROW = 'events-row',

  }
  export interface ITelemetryTabData {
    label: string,
    index: number,
  }
}
