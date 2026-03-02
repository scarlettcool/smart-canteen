# Admin Frontend Test Plan - Sprint 3: Dish Management

## 1. Dish Archives (菜品资料库)
**Page:** `/dishes/archives` (菜品资料库)

| ID | Component | Action | Expected Result | Status |
|----|-----------|--------|-----------------|--------|
| D1-1 | **Header** | Check Page Title | Display "菜品资料库" | ⏳ |
| D1-2 | **Header** | Click "+ 新增菜品" | Open "新增菜品" Modal | ⏳ |
| D1-3 | **Add Modal**| Submit Empty | Alert "请填写必要信息" | ⏳ |
| D1-4 | **Add Modal**| Submit Valid Data | Create success, Modal close, List refresh | ⏳ |
| D1-5 | **List** | Check Columns | Name, Category, Price, Calories, Tags, Status | ⏳ |
| D1-6 | **Row Action**| Click "Edit" (Pencil) | Open "编辑菜品" Modal, Fields pre-filled | ⏳ |
| D1-7 | **Edit Modal**| Modify Price & Save | Update success, List reflects change | ⏳ |
| D1-8 | **Row Action**| Click Status Toggle | Toggle between "供应中" and "已下架" | ⏳ |
| D1-9 | **Row Action**| Click "Delete" (Trash) | Show Confirm Dialog | ⏳ |
| D1-10| **Row Action**| Confirm Delete | Delete success, Row removed from list | ⏳ |

## 2. Category Management (Dependency)
*Note: Category management UI might be separate or integrated. For `DishArchives`, we assume categories exist or can be selected.*

| ID | Component | Action | Expected Result | Status |
|----|-----------|--------|-----------------|--------|
| D2-1 | **Add Modal** | Check Category Options | Dropdown lists available categories | ⏳ |
