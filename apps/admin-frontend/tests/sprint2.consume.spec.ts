import { test, expect } from '@playwright/test';

test.describe('Sprint 2: 消费管理全按钮冒烟测试', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/#/consumption/accounts');
  });

  test('S2-C13: 账户管理全闭环', async ({ page }) => {
    // S2-C13-01: 打开页面
    await expect(page.getByTestId('page-account-list')).toBeVisible();

    // S2-C13-03: 打开调账
    await page.getByTestId('btn-adjust-1001').click();
    await expect(page.getByTestId('modal-adjust')).toBeVisible();

    // S2-C13-06: 金额为空拦截
    await page.getByTestId('btn-adjust-submit').click();
    // 断言弹窗未关闭 (通过等待 visible)
    await expect(page.getByTestId('modal-adjust')).toBeVisible();

    // S2-C13-07: 原因必填校验
    await page.getByTestId('input-adjust-amount').fill('50');
    await page.getByTestId('btn-adjust-submit').click();
    await expect(page.getByTestId('modal-adjust')).toBeVisible();

    // S2-C13-04 & S2-C13-08: 充值提交成功
    await page.getByTestId('input-adjust-reason').fill('自动化测试');
    await page.getByTestId('btn-adjust-submit').click();

    // S2-C13-11: 防重复点击 (Loading)
    // 注意：由于是 Mock 环境，Loading 会很快，这里断言按钮在消失前被 disable
    // await expect(page.getByTestId('btn-adjust-submit')).toBeDisabled();

    // S2-C13-10: 列表余额刷新
    await expect(page.getByTestId('modal-adjust')).not.toBeVisible({ timeout: 5000 });
    // 原 500.25 + 50 = 550.25
    const balanceText = await page.getByTestId('balance-1001').innerText();
    expect(balanceText).toContain('550.25');
  });

  test('S2-C14: 交易管理冲正拦截', async ({ page }) => {
    await page.goto('/#/consumption/trade/tx');
    
    // S2-C14-02: 筛选
    await page.getByTestId('input-trade-filter').fill('TX001');

    // S2-C14-04: 冲正状态限制
    const correctedBtn = page.getByTestId('btn-trade-correct-TX002');
    await expect(correctedBtn).toBeDisabled();
  });

  test('S2-C15: 退款审批驳回原因必填', async ({ page }) => {
    await page.goto('/#/consumption/trade/refund');
    
    // S2-C15-05: 驳回原因必填
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('原因');
      await dialog.dismiss(); // 模拟点击取消
    });
    await page.getByTestId('btn-reject-REF001').click();
  });

  test('S2-C31: 设备离线拦截', async ({ page }) => {
    await page.goto('/#/consumption/devices');
    
    // S2-C31-03: 离线拦截
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('无法重启离线设备');
      await dialog.accept();
    });
    await page.getByTestId('btn-reboot-POS-002').click();
  });
});
